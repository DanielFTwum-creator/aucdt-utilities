"""
Spectral Blender — Merges multiple model audio outputs via weighted
mel-spectrogram averaging, then reconstructs waveform via Griffin-Lim.

Pipeline:
  1. Resample all inputs to common sample rate (32000 Hz)
  2. Compute mel spectrograms (n_mels=128)
  3. Trim/pad to shortest duration
  4. Weighted average per frequency band
  5. Griffin-Lim waveform reconstruction
  6. Post-process: LUFS normalisation + EQ
"""
import logging
import numpy as np
import librosa
import pyloudnorm as pyln
from scipy.signal import butter, sosfilt

logger = logging.getLogger(__name__)

TARGET_SR = 32000        # common sample rate
N_MELS = 128
HOP_LENGTH = 256
N_FFT = 2048
GRIFFIN_LIM_ITER = 48
TARGET_LUFS = -14.0      # streaming standard


class SpectralBlender:

    def blend(
        self,
        model_outputs: dict[str, np.ndarray],  # {model_id: audio_np}
        weights: dict[str, float],              # {model_id: weight}
        sample_rates: dict[str, int],           # {model_id: sr}
    ) -> tuple[np.ndarray, int]:
        """
        Blend model outputs using weighted mel-spectrogram averaging.

        Returns:
            (blended_audio_np, sample_rate) — float32, mono, normalised
        """
        if not model_outputs:
            raise ValueError("No model outputs to blend")

        if len(model_outputs) == 1:
            # Single model — skip blend, just post-process
            model_id = next(iter(model_outputs))
            audio = model_outputs[model_id]
            sr = sample_rates.get(model_id, TARGET_SR)
            audio = self._resample(audio, sr, TARGET_SR)
            return self._post_process(audio, TARGET_SR), TARGET_SR

        # 1. Resample all to TARGET_SR
        resampled: dict[str, np.ndarray] = {}
        for mid, audio in model_outputs.items():
            sr = sample_rates.get(mid, TARGET_SR)
            resampled[mid] = self._resample(audio, sr, TARGET_SR)
            logger.debug(f"  {mid}: {len(resampled[mid])} samples after resample")

        # 2. Compute mel spectrograms
        spectrograms: dict[str, np.ndarray] = {}
        for mid, audio in resampled.items():
            spectrograms[mid] = self._to_mel(audio)
            logger.debug(f"  {mid}: spectrogram shape={spectrograms[mid].shape}")

        # 3. Align to shortest duration
        min_frames = min(S.shape[1] for S in spectrograms.values())
        for mid in spectrograms:
            spectrograms[mid] = spectrograms[mid][:, :min_frames]

        # 4. Weighted average
        S_blend = np.zeros_like(next(iter(spectrograms.values())), dtype=np.float32)
        total_weight = 0.0
        for mid, S in spectrograms.items():
            w = weights.get(mid, 0.0)
            S_blend += w * S.astype(np.float32)
            total_weight += w

        if total_weight > 0:
            S_blend /= total_weight   # re-normalise in case weights don't sum to 1

        # 5. Reconstruct waveform via Griffin-Lim
        audio_blend = self._from_mel(S_blend)

        # 6. Post-process
        audio_final = self._post_process(audio_blend, TARGET_SR)

        logger.info(
            f"Blend complete | models={list(model_outputs.keys())} "
            f"| frames={min_frames} | samples={len(audio_final)}"
        )
        return audio_final, TARGET_SR

    # ── Spectrogram helpers ───────────────────────────────────────────────────

    def _to_mel(self, audio: np.ndarray) -> np.ndarray:
        """Audio → mel power spectrogram (linear scale, not dB)."""
        S = librosa.feature.melspectrogram(
            y=audio, sr=TARGET_SR,
            n_mels=N_MELS, hop_length=HOP_LENGTH, n_fft=N_FFT,
            fmin=20, fmax=14000,
        )
        return S.astype(np.float32)

    def _from_mel(self, S_mel: np.ndarray) -> np.ndarray:
        """Mel spectrogram → waveform via Griffin-Lim (via librosa)."""
        # Convert mel → linear STFT magnitude
        S_linear = librosa.feature.inverse.mel_to_stft(
            S_mel, sr=TARGET_SR, n_fft=N_FFT, fmin=20, fmax=14000,
        )
        # Griffin-Lim
        audio = librosa.griffinlim(
            S_linear, n_iter=GRIFFIN_LIM_ITER,
            hop_length=HOP_LENGTH, n_fft=N_FFT,
        )
        return audio.astype(np.float32)

    # ── Post-processing ───────────────────────────────────────────────────────

    def _post_process(self, audio: np.ndarray, sr: int) -> np.ndarray:
        """Loudness normalisation + gentle high-shelf EQ."""
        audio = self._normalise_lufs(audio, sr)
        audio = self._apply_eq(audio, sr)
        # Final peak clip guard
        peak = np.max(np.abs(audio))
        if peak > 0.99:
            audio = audio / peak * 0.99
        return audio

    def _normalise_lufs(self, audio: np.ndarray, sr: int) -> np.ndarray:
        """Normalise integrated loudness to TARGET_LUFS (-14 LUFS)."""
        try:
            meter = pyln.Meter(sr)
            loudness = meter.integrated_loudness(audio)
            if np.isfinite(loudness) and loudness < 0:
                audio = pyln.normalize.loudness(audio, loudness, TARGET_LUFS)
        except Exception as e:
            logger.warning(f"LUFS normalisation skipped: {e}")
        return audio

    def _apply_eq(self, audio: np.ndarray, sr: int) -> np.ndarray:
        """
        Gentle high-shelf boost (+1.5 dB @ 8 kHz) for perceived brightness.
        Uses a 2nd-order Butterworth high-shelf IIR filter.
        """
        try:
            nyq = sr / 2
            freq = min(8000, nyq * 0.9)
            sos = butter(2, freq / nyq, btype="high", output="sos")
            shelf = sosfilt(sos, audio)
            # Mix: original + 0.19 * high frequencies (≈ +1.5 dB shelf)
            audio = audio + 0.19 * shelf
        except Exception as e:
            logger.warning(f"EQ skipped: {e}")
        return audio

    # ── Utility ───────────────────────────────────────────────────────────────

    @staticmethod
    def _resample(audio: np.ndarray, from_sr: int, to_sr: int) -> np.ndarray:
        if from_sr == to_sr:
            return audio
        return librosa.resample(audio, orig_sr=from_sr, target_sr=to_sr)


# ── Module-level singleton ────────────────────────────────────────────────────
spectral_blender = SpectralBlender()
