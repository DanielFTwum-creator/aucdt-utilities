from pydantic import BaseModel, Field, field_validator
from typing import Optional, Literal
import uuid


class GenerationRequest(BaseModel):
    job_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    prompt: str = Field(..., min_length=1, max_length=500)
    genre: Optional[str] = None
    mood: list[str] = Field(default_factory=list)
    tempo_bpm: Optional[int] = Field(None, ge=60, le=180)
    key: Optional[str] = None
    duration_sec: int = Field(default=10, ge=5, le=30)   # 30s max per call
    seed: Optional[int] = None
    quality_mode: Literal["auto", "cpu_draft", "gpu_fast", "gpu_full"] = "auto"
    # Pro feature: pass previous track WAV as base64 for continuation
    continue_from: Optional[str] = None
    # Advanced: override blend recipe weights (Pro/Developer only)
    blend_override: Optional[dict[str, float]] = None

    @field_validator("blend_override")
    @classmethod
    def validate_weights(cls, v):
        if v is None:
            return v
        total = sum(v.values())
        if not (0.99 <= total <= 1.01):
            raise ValueError(f"Blend weights must sum to 1.0, got {total:.3f}")
        return v


class JobStatus(BaseModel):
    job_id: str
    status: Literal["PENDING", "PROCESSING", "STREAMING", "COMPLETE", "FAILED"]
    progress_pct: int = 0
    eta_ms: Optional[int] = None
    blend_recipe: Optional[dict[str, float]] = None
    compute_mode: Optional[str] = None
    error: Optional[str] = None
    track_path: Optional[str] = None
    duration_sec: Optional[int] = None


class BlendRecipePreview(BaseModel):
    recipe: dict[str, float]
    compute_mode: str
    estimated_ttfb_sec: int
    models_used: list[str]


class ModelInfo(BaseModel):
    model_id: str
    display_name: str
    status: Literal["UNLOADED", "LOADING", "LOADED", "ERROR"]
    cpu_viable: bool
    vram_gb: Optional[float] = None
    licence: str


class HealthResponse(BaseModel):
    status: str = "ok"
    compute_mode: str
    gpu_available: bool
    models_loaded: list[str]
    active_jobs: int
    version: str = "2.0.0"
