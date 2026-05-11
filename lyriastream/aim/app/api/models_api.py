"""AIM API — Model management endpoints."""
from fastapi import APIRouter, HTTPException
from app.schemas.generation import ModelInfo
from app.config import settings

router = APIRouter(tags=["Models"])

CATALOGUE: list[ModelInfo] = [
    ModelInfo(model_id="musicgen_medium",   display_name="MusicGen Medium (1.5B)", status="UNLOADED", cpu_viable=True,  licence="MIT"),
    ModelInfo(model_id="musicgen_large",    display_name="MusicGen Large (3.3B)",  status="UNLOADED", cpu_viable=False, vram_gb=12.0, licence="MIT"),
    ModelInfo(model_id="stable_audio_open", display_name="Stable Audio Open",      status="UNLOADED", cpu_viable=False, vram_gb=16.0, licence="LicenseRef-S-Rail"),
    ModelInfo(model_id="audioldm2",         display_name="AudioLDM 2",             status="UNLOADED", cpu_viable=False, vram_gb=10.0, licence="Apache-2.0"),
    ModelInfo(model_id="riffusion",         display_name="Riffusion",              status="UNLOADED", cpu_viable=True,  licence="MIT"),
]


@router.get("/models", response_model=list[ModelInfo])
async def list_models() -> list[ModelInfo]:
    """List all models with current load status."""
    result = []
    for m in CATALOGUE:
        item = m.model_copy()
        try:
            if m.model_id == "musicgen_medium":
                from app.models.musicgen_model import musicgen_model
                item.status = "LOADED" if musicgen_model.is_loaded else "UNLOADED"
            elif m.model_id == "riffusion":
                from app.models.riffusion_model import riffusion_model
                item.status = "LOADED" if riffusion_model.is_loaded else "UNLOADED"
        except Exception:
            item.status = "ERROR"
        result.append(item)
    return result


@router.post("/models/{model_id}/load")
async def load_model(model_id: str) -> dict:
    """Load a model into memory (admin action)."""
    if model_id == "musicgen_medium":
        from app.models.musicgen_model import musicgen_model
        musicgen_model.load()
    elif model_id == "riffusion":
        from app.models.riffusion_model import riffusion_model
        riffusion_model.load()
    else:
        raise HTTPException(status_code=404, detail=f"Model {model_id} not found or GPU-only")
    return {"status": "loaded", "modelId": model_id}


@router.post("/models/{model_id}/unload")
async def unload_model(model_id: str) -> dict:
    """Unload a model to free memory (admin action)."""
    if model_id == "musicgen_medium":
        from app.models.musicgen_model import musicgen_model
        musicgen_model.unload()
    elif model_id == "riffusion":
        from app.models.riffusion_model import riffusion_model
        riffusion_model.unload()
    else:
        raise HTTPException(status_code=404, detail=f"Model {model_id} not found")
    return {"status": "unloaded", "modelId": model_id}
