/**
 * Simple sound synthesizer using the Web Audio API.
 * Provides a clean "ding" sound without external dependencies.
 */

class SoundService {
  private audioCtx: AudioContext | null = null;

  private init() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  /**
   * Plays a high-frequency rhythmic "ding" sound.
   */
  playDing() {
    this.init();
    if (!this.audioCtx) return;

    const now = this.audioCtx.currentTime;
    
    // Fundamental tone (Bell-like)
    this.createTone(880, now, 0.4, 0.15); // A5
    this.createTone(1320, now, 0.2, 0.1); // E6 (harmonic)
    this.createTone(1760, now, 0.1, 0.05); // A6 (harmonic)
  }

  /**
   * Plays a subtle start sound.
   */
  playStart() {
    this.init();
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    this.createTone(440, now, 0.1, 0.2, 'sine');
  }

  private createTone(freq: number, start: number, volume: number, duration: number, type: OscillatorType = 'triangle') {
    if (!this.audioCtx) return;
    
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    
    // Envelope: Quick attack, exponential decay
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(volume, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, start + duration);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(start);
    osc.stop(start + duration);
  }
}

export const soundService = new SoundService();
