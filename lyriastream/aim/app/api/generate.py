"""AIM API — Generation endpoints."""
from fastapi import APIRouter, HTTPException, status
from fastapi.responses import StreamingResponse

from app.schemas.generation import GenerationRequest, JobStatus, BlendRecipePreview
from app.streaming.job_manager import job_manager
from app.router.model_router import model_router

router = APIRouter(tags=["Generation"])


@router.post("/generate", status_code=status.HTTP_202_ACCEPTED)
async def submit_generation(request: GenerationRequest) -> dict:
    """
    Submit a music generation job.
    Returns immediately with jobId; client polls /stream/{jobId} for progress.
    """
    job_id = await job_manager.submit(request)
    recipe = model_router.route(request)
    return {
        "jobId": job_id,
        "computeMode": recipe.compute_mode,
        "estimatedTtfbSec": recipe.estimated_ttfb_sec,
        "blendRecipe": recipe.recipe,
    }


@router.get("/generate/preview", response_model=BlendRecipePreview)
async def preview_recipe(
    prompt: str,
    genre: str | None = None,
    duration_sec: int = 10,
    quality_mode: str = "auto",
) -> BlendRecipePreview:
    """Dry-run: return blend recipe without consuming quota or generating audio."""
    request = GenerationRequest(
        prompt=prompt, genre=genre,
        duration_sec=duration_sec, quality_mode=quality_mode,
    )
    return model_router.route(request)


@router.get("/jobs/{job_id}/stream")
async def stream_job(job_id: str) -> StreamingResponse:
    """
    SSE stream for a generation job.
    Events: progress | blend_update | audio_chunk | error | done | : ping
    """
    status_obj = await job_manager.get_status(job_id)
    if status_obj is None:
        raise HTTPException(status_code=404, detail=f"Job {job_id} not found")

    return StreamingResponse(
        job_manager.stream_events(job_id),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",   # disable Nginx buffering
            "Connection": "keep-alive",
        },
    )


@router.get("/jobs/{job_id}/status", response_model=JobStatus)
async def get_job_status(job_id: str) -> JobStatus:
    """Poll-based status check (alternative to SSE for simple clients)."""
    job = await job_manager.get_status(job_id)
    if job is None:
        raise HTTPException(status_code=404, detail=f"Job {job_id} not found")
    return job
