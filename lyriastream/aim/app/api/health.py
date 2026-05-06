"""AIM API — Health endpoint (no auth required)."""
import torch
from fastapi import APIRouter
from app.config import settings
from app.schemas.generation import HealthResponse
from app.streaming.job_manager import job_manager

router = APIRouter(tags=["Health"])

@router.get("/aim/health", response_model=HealthResponse)
async def health() -> HealthResponse:
    """Health check — returns compute mode, loaded models, active jobs."""
    loaded = []
    try:
        from app.models.musicgen_model import musicgen_model
        if musicgen_model.is_loaded:
            loaded.append("musicgen_medium")
    except Exception:
        pass
    try:
        from app.models.riffusion_model import riffusion_model
        if riffusion_model.is_loaded:
            loaded.append("riffusion")
    except Exception:
        pass

    return HealthResponse(
        compute_mode=settings.resolved_compute_mode,
        gpu_available=torch.cuda.is_available(),
        models_loaded=loaded,
        active_jobs=job_manager.active_job_count(),
    )
