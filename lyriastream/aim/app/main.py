"""
LyriaStream — AI Inference Microservice (AIM)
FastAPI application entry point.
"""
import logging
import structlog
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from prometheus_fastapi_instrumentator import Instrumentator

from app.config import settings
from app.streaming.job_manager import job_manager

# ── Logging ───────────────────────────────────────────────────────────────────
structlog.configure(
    processors=[
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.JSONRenderer(),
    ]
)
logging.basicConfig(level=getattr(logging, settings.log_level.upper(), logging.INFO))
logger = logging.getLogger(__name__)


# ── Model loading state ───────────────────────────────────────────────────────
_aim_ready = False


def is_aim_ready() -> bool:
    return _aim_ready


# ── Lifespan (startup / shutdown) ─────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    import asyncio
    global _aim_ready
    logger.info(f"AIM starting | compute_mode={settings.resolved_compute_mode}")

    # Initialise Redis job manager before accepting traffic
    await job_manager.init()

    # Kick off model loading as a background task so the server accepts
    # connections (and health checks) immediately while models load.
    asyncio.create_task(_load_models_background())

    yield  # Server is UP — health returns models_loaded=[] until loading finishes

    # ── Shutdown ─────────────────────────────────────────────────────────────
    _aim_ready = False
    await job_manager.close()
    logger.info("AIM shutdown complete")


async def _load_models_background():
    """Background task: load models without blocking the event loop."""
    global _aim_ready
    try:
        await _load_models()
        _aim_ready = True
        logger.info("AIM ready ✓ — all models loaded")
    except Exception as e:
        logger.error(f"Model loading failed: {e}", exc_info=True)


async def _load_models():
    """Load models appropriate for current compute mode."""
    import asyncio
    mode = settings.resolved_compute_mode
    logger.info(f"Loading models for mode: {mode}")

    if mode in ("cpu_draft", "gpu_fast", "gpu_full"):
        from app.models.musicgen_model import musicgen_model
        # run_in_executor keeps the event loop free during blocking torch load
        await asyncio.get_event_loop().run_in_executor(None, musicgen_model.load)

    if mode in ("cpu_draft",):
        from app.models.riffusion_model import riffusion_model
        try:
            await asyncio.get_event_loop().run_in_executor(None, riffusion_model.load)
        except Exception as e:
            logger.warning(f"Riffusion load failed (non-fatal, will use musicgen only): {e}")

    if mode in ("gpu_fast", "gpu_full"):
        # Stub: GPU models loaded here when provisioned
        logger.info("GPU models: staged (not yet provisioned)")


# ── App ───────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="LyriaStream AIM",
    description="AI Inference Microservice — Multi-Model Music Generator",
    version="2.0.0",
    docs_url="/aim/docs",
    redoc_url="/aim/redoc",
    openapi_url="/aim/openapi.json",
    lifespan=lifespan,
)

# ── Middleware ────────────────────────────────────────────────────────────────
# AIM is internal-only; CORS is intentionally restrictive
app.add_middleware(
    CORSMiddleware,
    allow_origins=[],  # No browser direct access
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["X-AIM-Key"],
)

# ── Auth middleware ───────────────────────────────────────────────────────────
@app.middleware("http")
async def verify_aim_key(request: Request, call_next):
    """Require X-AIM-Key header on all /aim/v1/* routes."""
    if request.url.path.startswith("/aim/v1"):
        key = request.headers.get("X-AIM-Key", "")
        if key != settings.aim_api_key:
            return JSONResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                content={"detail": "Invalid AIM API key"},
            )
    return await call_next(request)


# ── Prometheus metrics ────────────────────────────────────────────────────────
Instrumentator().instrument(app).expose(app, endpoint="/aim/metrics")

# ── Routers ───────────────────────────────────────────────────────────────────
from app.api.generate import router as generate_router
from app.api.health import router as health_router
from app.api.models_api import router as models_router

app.include_router(generate_router, prefix="/aim/v1")
app.include_router(health_router)
app.include_router(models_router, prefix="/aim/v1")
