"""
Model Router — Constructs blend recipes from prompt + parameters.
CPU dev mode: only cpu_viable models are selected.
"""
import logging
from dataclasses import dataclass, field

from app.config import settings
from app.schemas.generation import GenerationRequest, BlendRecipePreview

logger = logging.getLogger(__name__)

# ── Model catalogue ───────────────────────────────────────────────────────────
@dataclass
class ModelSpec:
    model_id: str
    cpu_viable: bool
    min_vram_gb: float = 0.0
    licence: str = "MIT"

MODELS: dict[str, ModelSpec] = {
    "musicgen_medium":   ModelSpec("musicgen_medium",   cpu_viable=True,  min_vram_gb=4.0,  licence="MIT"),
    "musicgen_large":    ModelSpec("musicgen_large",    cpu_viable=False, min_vram_gb=12.0, licence="MIT"),
    "stable_audio_open": ModelSpec("stable_audio_open", cpu_viable=False, min_vram_gb=16.0, licence="LicenseRef-S-Rail"),
    "audioldm2":         ModelSpec("audioldm2",         cpu_viable=False, min_vram_gb=10.0, licence="Apache-2.0"),
    "riffusion":         ModelSpec("riffusion",         cpu_viable=True,  min_vram_gb=4.0,  licence="MIT"),
}

# ── Named recipes ─────────────────────────────────────────────────────────────
CPU_RECIPES: dict[str, dict[str, float]] = {
    "default":   {"musicgen_medium": 0.70, "riffusion": 0.30},
    "ambient":   {"musicgen_medium": 0.50, "riffusion": 0.50},
    "energetic": {"musicgen_medium": 0.80, "riffusion": 0.20},
    "minimal":   {"musicgen_medium": 0.60, "riffusion": 0.40},
    "riffusion_only": {"riffusion": 1.00},
}

GPU_RECIPES: dict[str, dict[str, float]] = {
    "default":   {"musicgen_large": 0.55, "stable_audio_open": 0.30, "riffusion": 0.15},
    "ambient":   {"audioldm2": 0.55, "stable_audio_open": 0.30, "musicgen_large": 0.15},
    "long_form": {"stable_audio_open": 0.60, "musicgen_large": 0.40},
    "energetic": {"musicgen_large": 0.65, "stable_audio_open": 0.20, "riffusion": 0.15},
}

# ── Genre → recipe key mapping ────────────────────────────────────────────────
GENRE_RECIPE_MAP: dict[str, str] = {
    "ambient":    "ambient",   "drone":    "ambient",
    "meditation": "ambient",   "lo-fi":    "ambient",
    "cinematic":  "ambient",   "jazz":     "default",
    "classical":  "default",   "orchestra":"default",
    "highlife":   "default",   "afrobeats":"energetic",
    "afropop":    "energetic", "dancehall":"energetic",
    "reggae":     "default",   "hiphop":   "energetic",
    "electronic": "energetic", "edm":      "energetic",
}

# ── TTFB estimates (P95 seconds) ──────────────────────────────────────────────
TTFB_ESTIMATE: dict[str, int] = {
    "cpu_draft": 75,
    "gpu_fast":  15,
    "gpu_full":  8,
    "gpu_long":  20,
}


class ModelRouter:
    """
    Builds a blend recipe given a GenerationRequest and current compute mode.
    Routing rules (applied in priority order):
      1. User blend_override → use as-is (validated by Pydantic)
      2. cpu_draft mode → CPU-only recipe regardless of genre
      3. duration > 45 s and GPU → favour stable_audio_open
      4. genre mapping → select named recipe
      5. Default recipe for current compute mode
    """

    def route(self, request: GenerationRequest) -> BlendRecipePreview:
        mode = settings.resolved_compute_mode
        recipe = self._select_recipe(request, mode)
        recipe = self._filter_for_compute(recipe, mode)
        recipe = self._normalise(recipe)

        logger.info(
            f"Router → mode={mode} recipe={recipe} "
            f"prompt='{request.prompt[:50]}'"
        )

        return BlendRecipePreview(
            recipe=recipe,
            compute_mode=mode,
            estimated_ttfb_sec=TTFB_ESTIMATE.get(mode, 75),
            models_used=list(recipe.keys()),
        )

    # ── Private ───────────────────────────────────────────────────────────────

    def _select_recipe(
        self, req: GenerationRequest, mode: str
    ) -> dict[str, float]:

        # 1. Explicit override (Pro/Developer users)
        if req.blend_override:
            return dict(req.blend_override)

        recipes = CPU_RECIPES if mode == "cpu_draft" else GPU_RECIPES

        # 2. Long-form track on GPU
        if req.duration_sec > 45 and mode != "cpu_draft":
            return GPU_RECIPES.get("long_form", recipes["default"])

        # 3. Genre mapping
        genre_key = (req.genre or "").lower().replace(" ", "")
        recipe_key = GENRE_RECIPE_MAP.get(genre_key, "default")
        return recipes.get(recipe_key, recipes["default"])

    def _filter_for_compute(
        self, recipe: dict[str, float], mode: str
    ) -> dict[str, float]:
        """Remove models that can't run in current compute mode."""
        if mode == "cpu_draft":
            filtered = {
                mid: w for mid, w in recipe.items()
                if MODELS.get(mid, ModelSpec(mid, True)).cpu_viable
            }
            if not filtered:
                logger.warning("No CPU-viable models in recipe — falling back to musicgen_medium")
                filtered = {"musicgen_medium": 1.0}
            return filtered
        return recipe

    def _normalise(self, recipe: dict[str, float]) -> dict[str, float]:
        """Ensure weights sum to exactly 1.0."""
        total = sum(recipe.values())
        if total == 0:
            return {"musicgen_medium": 1.0}
        return {mid: round(w / total, 4) for mid, w in recipe.items()}


# ── Module-level singleton ────────────────────────────────────────────────────
model_router = ModelRouter()
