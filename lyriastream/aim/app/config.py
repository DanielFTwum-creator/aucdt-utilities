from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Literal
import torch


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # ── Auth ──────────────────────────────────────────────────────────────────
    aim_api_key: str = "dev-aim-key-change-in-prod"

    # ── Compute ───────────────────────────────────────────────────────────────
    compute_mode: Literal["auto", "cpu_draft", "gpu_fast", "gpu_full"] = "auto"

    # ── Storage ───────────────────────────────────────────────────────────────
    hf_home: str = "/var/lyriastream/models"
    audio_output_path: str = "/var/lyriastream/audio"

    # ── Redis ─────────────────────────────────────────────────────────────────
    redis_url: str = "redis://localhost:6379/2"

    # ── Model defaults ────────────────────────────────────────────────────────
    musicgen_model_id: str = "facebook/musicgen-medium"
    riffusion_model_id: str = "riffusion/riffusion-model-v1"
    max_concurrent_jobs: int = 2   # conservative for CPU

    # ── Streaming ─────────────────────────────────────────────────────────────
    chunk_size_bytes: int = 8192   # 8 KB SSE audio chunks
    sse_heartbeat_sec: int = 15

    # ── Logging ───────────────────────────────────────────────────────────────
    log_level: str = "INFO"

    # ── Derived ───────────────────────────────────────────────────────────────
    @property
    def resolved_compute_mode(self) -> str:
        if self.compute_mode != "auto":
            return self.compute_mode
        if torch.cuda.is_available():
            vram = torch.cuda.get_device_properties(0).total_memory / 1e9
            if vram >= 40:
                return "gpu_full"
            return "gpu_fast"
        return "cpu_draft"

    @property
    def use_gpu(self) -> bool:
        return self.resolved_compute_mode != "cpu_draft"

    @property
    def torch_device(self) -> str:
        return "cuda" if self.use_gpu else "cpu"


settings = Settings()
