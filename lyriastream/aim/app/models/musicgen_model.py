"""
MusicGen Medium — CPU-viable text-to-music model.
Meta AudioCraft / HuggingFace Transformers.
Licence: MIT (no restrictions on generated audio).
"""
import asyncio
import io
import logging
import numpy as np
import scipy.io.wavfile as wavfile
import torch
from transformers import AutoProcessor, MusicgenForConditionalGeneration

from app.config import settings

logger = logging.getLogger(__name__)

MODEL_ID = settings.musicgen_model_id   # facebook/musicgen-medium
SAMPLE_RATE = 32000                      # MusicGen native sample rate


class MusicGenModel:
    """
    Wraps facebook/musicgen-medium for text-to-music generation.
    Runs on CPU in cpu_draft mode; moves to CUDA in gpu_* modes.
    """

    def __init__(self):
        self._processor = None
        self._model = None
        self._loaded = False
        self._device = settings.torch_device

    # ── Loading ───────────────────────────────────────────────────────────────

    def load(self) -> None:
        """Load model weights into memory. Called once at AIM startup."""
        if self._loaded:
            return
        logger.info(f"Loading MusicGen ({MODEL_ID}) on {self._device}…")
        self._processor = AutoProcessor.from_pretrained(
            MODEL_ID, cache_dir=settings.hf_home
        )
        self._model = MusicgenForConditionalGeneration.from_pretrained(
            MODEL_ID,
            cache_dir=settings.hf_home,
            torch_dtype=torch.float16 if self._device == "cuda" else torch.float32,
        )
        self._model.to(self._device)
        self._model.eval()
        self._loaded = True
        logger.info("MusicGen loaded ✓")

    def unload(self) -> None:
        self._model = None
        self._processor = None
        self._loaded = False
        if self._device == "cuda":
            torch.cuda.empty_cache()
        logger.info("MusicGen unloaded")

    @property
    def is_loaded(self) -> bool:
        return self._loaded

    # ── Inference ─────────────────────────────────────────────────────────────

    def generate(
        self,
        prompt: str,
        duration_sec: int = 10,
        seed: int | None = None,
        continue_from_wav: bytes | None = None,
    ) -> np.ndarray:
        """
        Generate audio from a text prompt.

        Returns:
            numpy array of shape (samples,) at SAMPLE_RATE (32000 Hz), float32 in [-1, 1]
        """
        if not self._loaded:
            raise RuntimeError("MusicGenModel not loaded — call load() first")

        if seed is not None:
            torch.manual_seed(seed)

        # MusicGen generates ~50 tokens/sec; duration_sec * 50 ≈ tokens needed
        max_tokens = int(duration_sec * 51.2)   # 256 tokens ≈ 5 s

        # Build inputs
        inputs = self._processor(
            text=[prompt],
            padding=True,
            return_tensors="pt",
        ).to(self._device)

        # Optional: audio continuation via decoder_input_ids
        # (continuation_from_wav handled by blender for now)

        logger.info(f"MusicGen generating: '{prompt[:60]}' | {duration_sec}s | {max_tokens} tokens")

        with torch.no_grad():
            audio_values = self._model.generate(
                **inputs,
                max_new_tokens=max_tokens,
                do_sample=True,
                guidance_scale=3.0,   # classifier-free guidance
            )

        # Shape: [batch=1, channels=1, samples]
        audio_np = audio_values[0, 0].cpu().numpy().astype(np.float32)

        # Normalise to [-1, 1]
        peak = np.max(np.abs(audio_np))
        if peak > 0:
            audio_np = audio_np / peak

        logger.info(f"MusicGen done | samples={len(audio_np)} | sr={SAMPLE_RATE}")
        return audio_np

    async def generate_async(
        self,
        prompt: str,
        duration_sec: int = 10,
        seed: int | None = None,
    ) -> np.ndarray:
        """Async wrapper — runs CPU inference in thread pool to avoid blocking."""
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(
            None, self.generate, prompt, duration_sec, seed, None
        )

    # ── Audio serialisation ───────────────────────────────────────────────────

    @staticmethod
    def to_wav_bytes(audio_np: np.ndarray, sample_rate: int = SAMPLE_RATE) -> bytes:
        """Convert float32 numpy array to PCM WAV bytes."""
        # Convert to int16 PCM
        pcm = (audio_np * 32767).astype(np.int16)
        buf = io.BytesIO()
        wavfile.write(buf, sample_rate, pcm)
        return buf.getvalue()


# ── Module-level singleton ────────────────────────────────────────────────────
musicgen_model = MusicGenModel()
