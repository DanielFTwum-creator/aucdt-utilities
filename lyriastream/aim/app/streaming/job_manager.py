"""
Job Manager — orchestrates the full generation pipeline:
  1. Dispatch async generation tasks per model in recipe
  2. Publish SSE events (progress, blend_update, audio_chunk, done, error)
     to Redis channel lyriastream:job:{jobId}:events
  3. Manage job state in Redis (TTL 1 hour)

SSE event schema (matches SRS §8.2):
  progress:     {"pct": int, "etaMs": int, "mode": str}
  blend_update: {"activeModel": str, "weight": float}
  audio_chunk:  {"seq": int, "data": "<base64>", "src": str}
  error:        {"code": str, "model": str, "fallback": bool}
  done:         {"trackUuid": str, "blendRecipe": dict, "duration": int}
"""
import asyncio
import base64
import io
import json
import logging
import os
import time
import uuid
from typing import AsyncIterator

import numpy as np
import redis.asyncio as aioredis
import scipy.io.wavfile as wavfile

from app.config import settings
from app.schemas.generation import GenerationRequest, JobStatus

logger = logging.getLogger(__name__)

CHANNEL_PREFIX = "lyriastream:job:"
JOB_TTL = 3600   # 1 hour


class JobManager:

    def __init__(self):
        self._redis: aioredis.Redis | None = None
        self._active_jobs: dict[str, JobStatus] = {}
        self._semaphore: asyncio.Semaphore | None = None

    async def init(self):
        self._redis = aioredis.from_url(settings.redis_url, decode_responses=True)
        self._semaphore = asyncio.Semaphore(settings.max_concurrent_jobs)
        logger.info("JobManager initialised")

    async def close(self):
        if self._redis:
            await self._redis.aclose()

    # ── Submit ────────────────────────────────────────────────────────────────

    async def submit(self, request: GenerationRequest) -> str:
        """Create a job record and schedule async generation. Returns job_id."""
        from app.router.model_router import model_router

        job_id = request.job_id or str(uuid.uuid4())
        preview = model_router.route(request)

        status = JobStatus(
            job_id=job_id,
            status="PENDING",
            blend_recipe=preview.recipe,
            compute_mode=preview.compute_mode,
        )
        self._active_jobs[job_id] = status
        await self._save_status(job_id, status)

        # Fire and forget generation task
        asyncio.create_task(self._run_generation(job_id, request, preview.recipe))
        return job_id

    # ── SSE stream ────────────────────────────────────────────────────────────

    async def stream_events(self, job_id: str) -> AsyncIterator[str]:
        """
        Subscribe to Redis channel and yield SSE-formatted event strings.
        Yields heartbeat pings every settings.sse_heartbeat_sec seconds.
        """
        channel = f"{CHANNEL_PREFIX}{job_id}:events"
        pubsub = self._redis.pubsub()
        await pubsub.subscribe(channel)

        last_ping = time.time()
        try:
            while True:
                # Heartbeat
                if time.time() - last_ping > settings.sse_heartbeat_sec:
                    yield ": ping\n\n"
                    last_ping = time.time()

                msg = await pubsub.get_message(ignore_subscribe_messages=True, timeout=1.0)
                if msg:
                    data = msg["data"]
                    try:
                        event = json.loads(data)
                        event_type = event.pop("_type", "message")
                        yield f"event: {event_type}\ndata: {json.dumps(event)}\n\n"
                        if event_type in ("done", "error"):
                            break
                    except json.JSONDecodeError:
                        pass
        finally:
            await pubsub.unsubscribe(channel)
            await pubsub.aclose()

    # ── Generation pipeline ───────────────────────────────────────────────────

    async def _run_generation(
        self,
        job_id: str,
        request: GenerationRequest,
        recipe: dict[str, float],
    ):
        async with self._semaphore:
            try:
                await self._update_status(job_id, "PROCESSING", 5)
                await self._publish(job_id, "progress", {"pct": 5, "etaMs": self._eta_ms(recipe), "mode": settings.resolved_compute_mode})

                # Run each model
                model_outputs: dict[str, np.ndarray] = {}
                sample_rates: dict[str, int] = {}
                total = len(recipe)
                step = 0

                for model_id, weight in recipe.items():
                    await self._publish(job_id, "blend_update", {"activeModel": model_id, "weight": weight})
                    try:
                        audio, sr = await self._run_model(model_id, request, recipe)
                        model_outputs[model_id] = audio
                        sample_rates[model_id] = sr
                    except Exception as e:
                        logger.error(f"Model {model_id} failed: {e}")
                        await self._publish(job_id, "error", {
                            "code": "MODEL_FAILED", "model": model_id,
                            "fallback": len(model_outputs) > 0
                        })
                        if not model_outputs:
                            raise   # nothing to blend
                        # Redistribute and continue with remaining models

                    step += 1
                    pct = 10 + int((step / total) * 60)
                    await self._update_status(job_id, "PROCESSING", pct)
                    await self._publish(job_id, "progress", {"pct": pct, "etaMs": 0, "mode": settings.resolved_compute_mode})

                # Blend
                await self._publish(job_id, "progress", {"pct": 75, "etaMs": 0, "mode": settings.resolved_compute_mode})
                from app.blender.spectral_blender import spectral_blender

                # Recalculate weights for models that actually ran
                active_weights = {mid: recipe[mid] for mid in model_outputs}
                blended_audio, final_sr = await asyncio.get_event_loop().run_in_executor(
                    None,
                    spectral_blender.blend,
                    model_outputs, active_weights, sample_rates,
                )

                # Save WAV file
                track_uuid = str(uuid.uuid4())
                file_path = await self._save_audio(blended_audio, final_sr, track_uuid)

                # Stream audio chunks
                await self._update_status(job_id, "STREAMING", 85)
                await self._stream_audio_chunks(job_id, blended_audio, final_sr)

                # Done
                duration_sec = int(len(blended_audio) / final_sr)
                await self._update_status(job_id, "COMPLETE", 100, track_path=file_path)
                await self._publish(job_id, "done", {
                    "trackUuid": track_uuid,
                    "blendRecipe": active_weights,
                    "duration": duration_sec,
                    "filePath": file_path,
                })

            except Exception as e:
                logger.exception(f"Job {job_id} failed: {e}")
                await self._update_status(job_id, "FAILED")
                await self._publish(job_id, "error", {"code": "GENERATION_FAILED", "model": "pipeline", "fallback": False, "message": str(e)})

    async def _run_model(
        self, model_id: str, request: GenerationRequest, recipe: dict
    ) -> tuple[np.ndarray, int]:
        """Dispatch to the correct model handler."""
        if model_id == "musicgen_medium" or model_id == "musicgen_large":
            from app.models.musicgen_model import musicgen_model
            audio = await musicgen_model.generate_async(
                prompt=request.prompt,
                duration_sec=request.duration_sec,
                seed=request.seed,
            )
            return audio, 32000

        elif model_id == "riffusion":
            from app.models.riffusion_model import riffusion_model
            # In blend mode: if other models already ran, use style transfer
            # Otherwise generate standalone
            audio = await asyncio.get_event_loop().run_in_executor(
                None,
                riffusion_model.generate,
                request.prompt,
                min(request.duration_sec, 5),
                request.seed,
            )
            return audio, 44100

        else:
            raise NotImplementedError(f"Model {model_id} not yet implemented (GPU only)")

    # ── Audio chunk streaming ─────────────────────────────────────────────────

    async def _stream_audio_chunks(
        self, job_id: str, audio: np.ndarray, sr: int
    ):
        """Break audio into 8 KB PCM chunks and publish as SSE events."""
        pcm = (audio * 32767).astype(np.int16).tobytes()
        chunk_size = settings.chunk_size_bytes
        total_chunks = (len(pcm) + chunk_size - 1) // chunk_size

        for seq, i in enumerate(range(0, len(pcm), chunk_size)):
            chunk = pcm[i:i + chunk_size]
            b64 = base64.b64encode(chunk).decode("ascii")
            await self._publish(job_id, "audio_chunk", {
                "seq": seq,
                "data": b64,
                "src": "blended",
                "total": total_chunks,
            })
            # Yield control to event loop between chunks
            await asyncio.sleep(0)

    # ── Persistence ───────────────────────────────────────────────────────────

    async def _save_audio(
        self, audio: np.ndarray, sr: int, track_uuid: str
    ) -> str:
        """Save blended audio to WAV file. Returns absolute file path."""
        out_dir = settings.audio_output_path
        os.makedirs(out_dir, exist_ok=True)
        file_path = os.path.join(out_dir, f"{track_uuid}.wav")
        pcm = (audio * 32767).astype(np.int16)

        loop = asyncio.get_event_loop()
        await loop.run_in_executor(
            None,
            lambda: wavfile.write(file_path, sr, pcm)
        )
        logger.info(f"Audio saved: {file_path}")
        return file_path

    async def _save_status(self, job_id: str, status: JobStatus):
        await self._redis.set(
            f"{CHANNEL_PREFIX}{job_id}:status",
            status.model_dump_json(),
            ex=JOB_TTL,
        )

    async def _update_status(
        self, job_id: str, status: str, pct: int = 0, **kwargs
    ):
        job = self._active_jobs.get(job_id)
        if job:
            job.status = status
            job.progress_pct = pct
            for k, v in kwargs.items():
                setattr(job, k, v)
            await self._save_status(job_id, job)

    async def get_status(self, job_id: str) -> JobStatus | None:
        data = await self._redis.get(f"{CHANNEL_PREFIX}{job_id}:status")
        if data:
            return JobStatus.model_validate_json(data)
        return self._active_jobs.get(job_id)

    # ── Pub/sub helpers ───────────────────────────────────────────────────────

    async def _publish(self, job_id: str, event_type: str, payload: dict):
        channel = f"{CHANNEL_PREFIX}{job_id}:events"
        payload["_type"] = event_type
        await self._redis.publish(channel, json.dumps(payload))

    # ── Utility ───────────────────────────────────────────────────────────────

    def _eta_ms(self, recipe: dict) -> int:
        mode = settings.resolved_compute_mode
        from app.router.model_router import TTFB_ESTIMATE
        return TTFB_ESTIMATE.get(mode, 75) * 1000

    def active_job_count(self) -> int:
        return len([j for j in self._active_jobs.values() if j.status in ("PENDING", "PROCESSING", "STREAMING")])


# ── Module-level singleton ────────────────────────────────────────────────────
job_manager = JobManager()
