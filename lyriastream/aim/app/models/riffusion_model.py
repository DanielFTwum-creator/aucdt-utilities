"""
Riffusion — Spectrogram-based Stable Diffusion for audio style transfer.
Used as a style layer over MusicGen output in CPU blend mode.
Licence: MIT.

Strategy in cpu_draft mode:
  1. Convert MusicGen WAV → mel spectrogram image
  2. Pass spectrogram + style prompt to Riffusion pipeline
  3. Riffusion outputs a stylised spectrogram image
  4. Convert stylised spectrogram → audio waveform (Griffin-Lim)
  5. Blender mixes MusicGen (0.70) + Riffusion style (0.30)
"""
import asyncio
import io
import logging
import numpy as np
from PIL import Image
import librosa
import torch

from app.config import settings

logger = logging.getLogger(__name__)

MODEL_ID = settings.riffusion_model_id  # riffusion/riffusion-model-v1
SAMPLE_RATE = 44100                      # Riffusion native sample rate
SPEC_HEIGHT = 512
SPEC_WIDTH = 512


class RiffusionModel:
    """
    Wraps the Riffusion pipeline for spectrogram-based style transfer.
    On CPU: runs in float32 (slow but functional, ~30-60 s/pass).
    """

    def __init__(self):
        self._pipe = None
        self._loaded = False
        self._device = settings.torch_device

    # ── Loading ───────────────────────────────────────────────────────────────

    def load(self) -> None:
        if self._loaded:
            return
        logger.info(f"Loading Riffusion ({MODEL_ID}) on {self._device}…")
        try:
            from diffusers import StableDiffusionPipeline
            self._pipe = StableDiffusionPipeline.from_pretrained(
                MODEL_ID,
                cache_dir=settings.hf_home,
                torch_dtype=torch.float16 if self._device == "cuda" else torch.float32,
                safety_checker=None,       # audio spectrograms are not images
                requires_safety_checker=False,
            )
            self._pipe.to(self._device)
            self._pipe.set_progress_bar_config(disable=True)
            self._loaded = True
            logger.info("Riffusion loaded ✓")
        except Exception as e:
            logger.error(f"Riffusion load failed: {e}")
            raise

    def unload(self) -> None:
        self._pipe = None
        self._loaded = False
        if self._device == "cuda":
            torch.cuda.empty_cache()
        logger.info("Riffusion unloaded")

    @property
    def is_loaded(self) -> bool:
        return self._loaded

    # ── Style Transfer ────────────────────────────────────────────────────────

    def style_transfer(
        self,
        audio_np: np.ndarray,
        style_prompt: str,
        source_sr: int = 32000,
        strength: float = 0.45,
        seed: int | None = None,
    ) -> np.ndarray:
        """
        Apply Riffusion style transfer to an existing audio array.

        Args:
            audio_np: Input audio (float32, mono, [-1,1])
            style_prompt: Text description of desired style
            source_sr: Sample rate of input audio
            strength: 0.0 = keep original, 1.0 = full Riffusion generation
            seed: Optional random seed

        Returns:
            Stylised audio numpy array (float32, mono, [-1,1]) at SAMPLE_RATE
        """
        if not self._loaded:
            raise RuntimeError("RiffusionModel not loaded — call load() first")

        generator = torch.Generator(device=self._device)
        if seed is not None:
            generator.manual_seed(seed)

        # 1. Resample input to Riffusion's sample rate
        if source_sr != SAMPLE_RATE:
            audio_np = librosa.resample(audio_np, orig_sr=source_sr, target_sr=SAMPLE_RATE)

        # 2. Clip to Riffusion's max window (~5 s at 44100 Hz)
        max_samples = SAMPLE_RATE * 5
        audio_np = audio_np[:max_samples]

        # 3. Convert audio → mel spectrogram image
        spec_image = self._audio_to_spectrogram_image(audio_np)

        # 4. Run img2img Riffusion pipeline
        logger.info(f"Riffusion style pass: '{style_prompt[:60]}' | strength={strength}")
        result = self._pipe(
            prompt=style_prompt,
            image=spec_image,
            strength=strength,
            num_inference_steps=20,   # fast pass (CPU: ~30s)
            guidance_scale=7.0,
            generator=generator,
        )
        styled_spec = result.images[0]

        # 5. Convert spectrogram image → audio
        styled_audio = self._spectrogram_image_to_audio(styled_spec)
        return styled_audio

    # ── Generate (standalone) ─────────────────────────────────────────────────

    def generate(
        self,
        prompt: str,
        duration_sec: int = 5,
        seed: int | None = None,
    ) -> np.ndarray:
        """
        Generate audio from prompt alone (no input audio).
        Used when Riffusion is the primary model (not just style layer).
        """
        if not self._loaded:
            raise RuntimeError("RiffusionModel not loaded")

        generator = torch.Generator(device=self._device)
        if seed is not None:
            generator.manual_seed(seed)

        result = self._pipe(
            prompt=prompt,
            num_inference_steps=20,
            guidance_scale=7.0,
            generator=generator,
        )
        return self._spectrogram_image_to_audio(result.images[0])

    async def style_transfer_async(
        self, audio_np: np.ndarray, style_prompt: str, **kwargs
    ) -> np.ndarray:
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(
            None, self.style_transfer, audio_np, style_prompt,
            kwargs.get("source_sr", 32000),
            kwargs.get("strength", 0.45),
            kwargs.get("seed"),
        )

    # ── Spectrogram conversion ────────────────────────────────────────────────

    def _audio_to_spectrogram_image(self, audio_np: np.ndarray) -> Image.Image:
        """Convert audio waveform to mel spectrogram PIL image (RGB, 512×512)."""
        # Compute mel spectrogram
        S = librosa.feature.melspectrogram(
            y=audio_np, sr=SAMPLE_RATE,
            n_mels=SPEC_HEIGHT, fmax=8000,
            hop_length=512, n_fft=2048,
        )
        S_db = librosa.power_to_db(S, ref=np.max)

        # Normalise to [0, 255]
        S_norm = ((S_db - S_db.min()) / (S_db.max() - S_db.min() + 1e-8) * 255).astype(np.uint8)

        # Resize to 512×512
        img = Image.fromarray(S_norm, mode="L").resize((SPEC_WIDTH, SPEC_HEIGHT))
        return img.convert("RGB")

    def _spectrogram_image_to_audio(self, spec_image: Image.Image) -> np.ndarray:
        """Convert a PIL spectrogram image back to audio waveform via Griffin-Lim."""
        # Convert to greyscale numpy
        img_grey = np.array(spec_image.convert("L").resize((SPEC_WIDTH, SPEC_HEIGHT)))

        # Scale to dB range
        S_db = img_grey.astype(np.float32) / 255.0 * 80.0 - 80.0
        S_power = librosa.db_to_power(S_db)

        # Griffin-Lim reconstruction
        audio = librosa.griffinlim(
            S_power,
            n_iter=32,
            hop_length=512,
            n_fft=2048,
        )

        # Normalise
        peak = np.max(np.abs(audio))
        if peak > 0:
            audio = audio / peak

        return audio.astype(np.float32)


# ── Module-level singleton ────────────────────────────────────────────────────
riffusion_model = RiffusionModel()
