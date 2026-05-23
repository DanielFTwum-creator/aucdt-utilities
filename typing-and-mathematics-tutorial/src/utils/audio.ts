// Browser Web Audio API Synthesizer for high-fidelity interactive feedback
// Designed specifically for children - gentle, musical, non-stressful sounds.

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playSoundTap(freq = 440, type: OscillatorType = 'triangle') {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    // Short tactile click
    gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch (e) {
    // Audio Context blocked or not supported - safe fallback
  }
}

export function playSoundSuccess() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Sweet double tone arpeggio (C5 -> E5 -> G5)
    const notes = [523.25, 659.25, 783.99];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.08);

      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.12, now + i * 0.08 + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.3);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.31);
    });
  } catch (e) {
    // fallback
  }
}

export function playSoundUpgrade() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Beautiful upward pentatonic scale (C5 -> D5 -> E5 -> G5 -> A5 -> C6)
    const scale = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50];
    scale.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);

      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.1, now + idx * 0.07 + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.35);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.4);
    });
  } catch (e) {
    // fallback
  }
}

export function playSoundIncorrect() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sawtooth';
    // Gentle low buzz so it's corrective, not stressful
    osc.frequency.setValueAtTime(120, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(80, ctx.currentTime + 0.18);

    gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.18);
  } catch (e) {
    // fallback
  }
}

export function playSoundCoin() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Classic arcade ding (B5 then E6)
    const times = [0, 0.08];
    const freqs = [987.77, 1318.51];

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + times[idx]);

      gainNode.gain.setValueAtTime(0.1, now + times[idx]);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + times[idx] + 0.25);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now + times[idx]);
      osc.stop(now + times[idx] + 0.3);
    });
  } catch (e) {
    // fallback
  }
}
