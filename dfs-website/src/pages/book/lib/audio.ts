/**
 * Web Audio API Synthesis Engine for "An Elephant on Parade"
 * Synthesizes percussion sounds of Djembe drums and classroom found objects.
 */

let audioCtx: AudioContext | null = null;
let analyser: AnalyserNode | null = null;
let masterGain: GainNode | null = null;
let currentMasterVolume: number = 0.8;

export function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    try {
      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(currentMasterVolume, audioCtx.currentTime);
      masterGain.connect(audioCtx.destination);

      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.6;
      analyser.connect(masterGain);
    } catch (e) {
      console.warn("Failed to create AnalyserNode", e);
    }
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function setMasterVolume(volume: number): void {
  currentMasterVolume = volume;
  if (audioCtx && masterGain) {
    const now = audioCtx.currentTime;
    masterGain.gain.setTargetAtTime(volume, now, 0.015);
  }
}

export function getMasterVolume(): number {
  return currentMasterVolume;
}

export function getAudioAnalyser(): AnalyserNode | null {
  getAudioContext();
  return analyser;
}

export function getDestination(ctx: AudioContext): AudioNode {
  return analyser || masterGain || ctx.destination;
}

/**
 * Creates a stereo impulse response buffer featuring exponential decay noise,
 * simulating acoustic reverb.
 */
function createReverbImpulseResponse(ctx: AudioContext, duration: number, decay: number, preDelay: number): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const length = Math.floor(sampleRate * duration);
  const impulse = ctx.createBuffer(2, length, sampleRate);
  
  const left = impulse.getChannelData(0);
  const right = impulse.getChannelData(1);
  const preDelaySamples = Math.floor(preDelay * sampleRate);

  for (let i = 0; i < length; i++) {
    if (i < preDelaySamples) {
      left[i] = 0;
      right[i] = 0;
    } else {
      const percent = (i - preDelaySamples) / (length - preDelaySamples);
      const decayFactor = Math.pow(1 - percent, decay);
      
      left[i] = (Math.random() * 2 - 1) * decayFactor;
      right[i] = (Math.random() * 2 - 1) * decayFactor;
    }
  }
  return impulse;
}

let sharedReverbConvolver: ConvolverNode | null = null;
let sharedReverbGain: GainNode | null = null;

export function getReverbNode(ctx: AudioContext): AudioNode | null {
  if (!sharedReverbConvolver) {
    try {
      sharedReverbConvolver = ctx.createConvolver();
      // Outdoor parade savannah style: 2.2s decay, warm 4.0 power rate, 40ms pre-delay
      sharedReverbConvolver.buffer = createReverbImpulseResponse(ctx, 2.2, 4.0, 0.04);

      const reverbFilter = ctx.createBiquadFilter();
      reverbFilter.type = "lowpass";
      reverbFilter.frequency.setValueAtTime(2200, ctx.currentTime);

      sharedReverbGain = ctx.createGain();
      sharedReverbGain.gain.setValueAtTime(0.25, ctx.currentTime);

      sharedReverbConvolver.connect(reverbFilter);
      reverbFilter.connect(sharedReverbGain);
      sharedReverbGain.connect(getDestination(ctx));
    } catch (e) {
      console.warn("Failed to create shared reverb node", e);
      return null;
    }
  }
  return sharedReverbConvolver;
}

/**
 * Connects the given audio source node to both the main dry destination
 * and a parallel warm wet reverb path with customizable level.
 */
export function connectWithReverb(ctx: AudioContext, sourceNode: AudioNode, sendLevel: number = 0.22): void {
  const dest = getDestination(ctx);
  // Direct Dry feed
  sourceNode.connect(dest);

  try {
    const rev = getReverbNode(ctx);
    if (rev) {
      const sendGain = ctx.createGain();
      sendGain.gain.setValueAtTime(sendLevel, ctx.currentTime);
      sourceNode.connect(sendGain);
      sendGain.connect(rev);
    }
  } catch (e) {
    console.warn("Could not connect parallel reverb send", e);
  }
}


// Generate a 1-second white noise buffer for triggers
let cachedNoiseBuffer: AudioBuffer | null = null;
function getNoiseBuffer(ctx: AudioContext): AudioBuffer {
  if (cachedNoiseBuffer) return cachedNoiseBuffer;
  const bufferSize = ctx.sampleRate * 1.5;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  cachedNoiseBuffer = buffer;
  return buffer;
}

/**
 * Play a synthesized Djembe BASS note.
 * Deep, booming tone in the center of the drum.
 */
export function playBass(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Bass fundamental tone oscillator
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = 'sine';
    // Deep swoop from 140Hz down to 50Hz
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.15);

    // Envelope for fundamental
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(1.0, now + 0.005);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    // Highpass transient click for the palm impact
    const noise = ctx.createBufferSource();
    noise.buffer = getNoiseBuffer(ctx);
    
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(120, now);
    noiseFilter.Q.setValueAtTime(2.0, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.6, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    // Connections
    osc.connect(gainNode);
    connectWithReverb(ctx, gainNode, 0.24);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(getDestination(ctx));


    osc.start(now);
    osc.stop(now + 0.45);
    
    noise.start(now);
    noise.stop(now + 0.05);
  } catch (e) {
    console.warn("Web Audio failed to play sound", e);
  }
}

/**
 * Play a synthesized Djembe OPEN note.
 * Brighter, higher-pitched snapping tone on the edge of the drum.
 */
export function playOpen(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Fundamental tone - mix of triangle for woody ring
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.1);

    // Envelope
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.8, now + 0.005);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    // Ringing resonance for the shell
    const ringOsc = ctx.createOscillator();
    const ringGain = ctx.createGain();
    ringOsc.type = 'sine';
    ringOsc.frequency.setValueAtTime(450, now);
    ringGain.gain.setValueAtTime(0.2, now);
    ringGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    // Sharp finger strike transient
    const noise = ctx.createBufferSource();
    noise.buffer = getNoiseBuffer(ctx);
    
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.setValueAtTime(1500, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.4, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    // Connections
    osc.connect(gainNode);
    connectWithReverb(ctx, gainNode, 0.32);

    ringOsc.connect(ringGain);
    connectWithReverb(ctx, ringGain, 0.28);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(getDestination(ctx));

    osc.start(now);
    osc.stop(now + 0.25);

    ringOsc.start(now);
    ringOsc.stop(now + 0.2);

    noise.start(now);
    noise.stop(now + 0.04);
  } catch (e) {
    console.warn("Web Audio failed to play sound", e);
  }
}

/**
 * Play a synthesized Djembe SLAP note.
 * Sharp, high-pitched cracking finger strike on the edge.
 */
export function playSlap(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(650, now);
    osc.frequency.exponentialRampToValueAtTime(350, now + 0.08);

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.9, now + 0.002);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    const noise = ctx.createBufferSource();
    noise.buffer = getNoiseBuffer(ctx);
    
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.setValueAtTime(2800, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.7, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

    osc.connect(gainNode);
    connectWithReverb(ctx, gainNode, 0.28);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(getDestination(ctx));

    // Sharp, high-frequency skin resonance tail
    const resonanceOsc = ctx.createOscillator();
    const resonanceGain = ctx.createGain();

    resonanceOsc.type = 'sine';
    resonanceOsc.frequency.setValueAtTime(1450, now);
    resonanceOsc.frequency.exponentialRampToValueAtTime(1100, now + 0.08);

    resonanceGain.gain.setValueAtTime(0, now);
    resonanceGain.gain.linearRampToValueAtTime(0.18, now + 0.003);
    resonanceGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    resonanceOsc.connect(resonanceGain);
    resonanceGain.connect(getDestination(ctx));

    osc.start(now);
    osc.stop(now + 0.15);

    noise.start(now);
    noise.stop(now + 0.03);

    resonanceOsc.start(now);
    resonanceOsc.stop(now + 0.20);
  } catch (e) {
    console.warn("Web Audio failed to play Slap sound", e);
  }
}

/**
 * Play a synthesized Djembe TONE note.
 * A warm, balanced mix of bass fundamental and open ring.
 */
export function playTone(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(190, now);
    osc.frequency.exponentialRampToValueAtTime(95, now + 0.12);

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.9, now + 0.004);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    const woodyOsc = ctx.createOscillator();
    const woodyGain = ctx.createGain();
    woodyOsc.type = 'triangle';
    woodyOsc.frequency.setValueAtTime(280, now);
    woodyGain.gain.setValueAtTime(0.4, now);
    woodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gainNode);
    connectWithReverb(ctx, gainNode, 0.26);

    woodyOsc.connect(woodyGain);
    connectWithReverb(ctx, woodyGain, 0.24);

    osc.start(now);
    osc.stop(now + 0.25);

    woodyOsc.start(now);
    woodyOsc.stop(now + 0.2);
  } catch (e) {
    console.warn("Web Audio failed to play Tone sound", e);
  }
}

/**
 * Play a synthesized Djembe MUTED note.
 * A dry, dampened bass thud representing the hand resting tightly on the head.
 */
export function playMuted(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.06);

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.75, now + 0.002);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    const noise = ctx.createBufferSource();
    noise.buffer = getNoiseBuffer(ctx);
    
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(200, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.3, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    osc.connect(gainNode);
    connectWithReverb(ctx, gainNode, 0.12);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(getDestination(ctx));

    osc.start(now);
    osc.stop(now + 0.1);

    noise.start(now);
    noise.stop(now + 0.04);
  } catch (e) {
    console.warn("Web Audio failed to play Muted sound", e);
  }
}

/**
 * Play a subtle, high-pitched tactile click sound when a zone is pressed down (mousedown).
 */
export function playTactileClick(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(2200, now);
    osc.frequency.exponentialRampToValueAtTime(1600, now + 0.005);
    
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.04, now + 0.001);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.006);
    
    osc.connect(gainNode);
    gainNode.connect(getDestination(ctx));
    
    osc.start(now);
    osc.stop(now + 0.01);
  } catch (e) {
    console.warn("Failed to play tactile click sound", e);
  }
}

/**
 * Play a subtle click-release sound when a zone is released (mouseup).
 */
export function playTactileRelease(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(900, now + 0.007);
    
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.03, now + 0.001);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.008);
    
    osc.connect(gainNode);
    gainNode.connect(getDestination(ctx));
    
    osc.start(now);
    osc.stop(now + 0.012);
  } catch (e) {
    console.warn("Failed to play tactile release sound", e);
  }
}

/**
 * Play a synthesized Shaker.
 * Simulates a metallic rattle or maraca.
 */
export function playShaker(durationFactor: number = 1.0): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const noise = ctx.createBufferSource();
    noise.buffer = getNoiseBuffer(ctx);

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(6000, now);
    filter.Q.setValueAtTime(2.0, now);

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, now);
    // Mimic the physical "swell" click
    gainNode.gain.linearRampToValueAtTime(0.5, now + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + (0.15 * durationFactor));

    noise.connect(filter);
    filter.connect(gainNode);
    connectWithReverb(ctx, gainNode, 0.25);

    noise.start(now);
    noise.stop(now + (0.2 * durationFactor));
  } catch (e) {
    console.warn("Web Audio Play Shaker failed", e);
  }
}

/**
 * Play a synthesized Wooden Frog guiro scraper.
 * Emits a realistic rhythmic scraping / ribbiting rattle.
 */
export function playFrog(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Simulate 4 distinct scrapes in rapid succession: "ch-ch-ch-ch"
    const clicks = 5;
    const clickSpacing = 0.035; // 35ms spacing

    for (let i = 0; i < clicks; i++) {
      const clickTime = now + (i * clickSpacing);
      
      const noise = ctx.createBufferSource();
      noise.buffer = getNoiseBuffer(ctx);

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      // Wooden resonance frequency at ~1400Hz
      filter.frequency.setValueAtTime(1400 - (i * 80), clickTime); 
      filter.Q.setValueAtTime(4, clickTime);

      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0, clickTime);
      gainNode.gain.linearRampToValueAtTime(0.4 - (i * 0.03), clickTime + 0.005);
      gainNode.gain.exponentialRampToValueAtTime(0.001, clickTime + 0.025);

      noise.connect(filter);
      filter.connect(gainNode);
      connectWithReverb(ctx, gainNode, 0.20);

      noise.start(clickTime);
      noise.stop(clickTime + 0.03);
    }
  } catch (e) {
    console.warn("Web Audio Play Frog failed", e);
  }
}

/**
 * Play a specific sound matching page 15 found objects list.
 */
export function playFoundObject(id: string): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    switch (id) {
      case 'tabletop': {
        // Flat hand in center = Bass, fingertips near edge = Open. Let's make it a lighter desk thud
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(95, now);
        osc.frequency.linearRampToValueAtTime(60, now + 0.1);
        gain.gain.setValueAtTime(0.8, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.connect(gain).connect(getDestination(ctx));
        osc.start(now);
        osc.stop(now + 0.2);
        break;
      }
      case 'cardboard_box': {
        // Sturdy box, deep resonant hollow
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const bpf = ctx.createBiquadFilter();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(110, now);
        osc.frequency.exponentialRampToValueAtTime(65, now + 0.18);
        
        bpf.type = 'bandpass';
        bpf.frequency.setValueAtTime(100, now);
        bpf.Q.setValueAtTime(1.5, now);

        gain.gain.setValueAtTime(0.9, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        osc.connect(bpf).connect(gain).connect(getDestination(ctx));
        osc.start(now);
        osc.stop(now + 0.3);
        break;
      }
      case 'plastic_bin': {
        // High pitched plastic tub hollow pop
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(90, now + 0.12);
        gain.gain.setValueAtTime(0.7, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
        osc.connect(gain).connect(getDestination(ctx));
        osc.start(now);
        osc.stop(now + 0.2);
        break;
      }
      case 'hardcover_book': {
        // Struck with open palm, fleshy slap thud
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(130, now);
        osc.frequency.linearRampToValueAtTime(80, now + 0.08);
        gain.gain.setValueAtTime(0.85, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        
        // Add flat slap noise
        const noise = ctx.createBufferSource();
        noise.buffer = getNoiseBuffer(ctx);
        const lpf = ctx.createBiquadFilter();
        lpf.type = 'lowpass';
        lpf.frequency.setValueAtTime(600, now);
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.5, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        
        noise.connect(lpf).connect(noiseGain).connect(getDestination(ctx));
        osc.connect(gain).connect(getDestination(ctx));
        
        osc.start(now);
        osc.stop(now + 0.15);
        noise.start(now);
        noise.stop(now + 0.05);
        break;
      }
      case 'plastic_bottle_rice': {
        // Grainy rattle
        for (let i = 0; i < 3; i++) {
          const t = now + (i * 0.02);
          const noise = ctx.createBufferSource();
          noise.buffer = getNoiseBuffer(ctx);
          const filter = ctx.createBiquadFilter();
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(3200, t);
          filter.Q.setValueAtTime(1.8, t);
          const g = ctx.createGain();
          g.gain.setValueAtTime(0.3, t);
          g.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
          noise.connect(filter).connect(g).connect(getDestination(ctx));
          noise.start(t);
          noise.stop(t + 0.06);
        }
        break;
      }
      case 'jar_of_coins': {
        // High pitched metal clicks
        const frequencies = [4800, 6200, 8000];
        frequencies.forEach((f) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, now);
          gain.gain.setValueAtTime(0.15, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
          osc.connect(gain).connect(getDestination(ctx));
          osc.start(now);
          osc.stop(now + 0.1);
        });
        break;
      }
      case 'keys_keyring': {
        // Fast jingle clack
        const clickTimes = [0, 0.03, 0.06];
        clickTimes.forEach((delay) => {
          const t = now + delay;
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const g = ctx.createGain();
          osc1.type = 'sine';
          osc1.frequency.setValueAtTime(7500, t);
          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(9200, t);
          g.gain.setValueAtTime(0.1, t);
          g.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
          osc1.connect(g);
          osc2.connect(g);
          g.connect(getDestination(ctx));
          osc1.start(t);
          osc1.stop(t + 0.04);
          osc2.start(t);
          osc2.stop(t + 0.04);
        });
        break;
      }
      case 'comb_teeth': {
        // Pencil scraping wooden comb scraper
        const teeth = 8;
        const speed = 0.015; // 15ms
        for (let i = 0; i < teeth; i++) {
          const t = now + (i * speed);
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(900 + (Math.random() * 300), t);
          g.gain.setValueAtTime(0.08, t);
          g.gain.exponentialRampToValueAtTime(0.001, t + 0.01);
          osc.connect(g).connect(getDestination(ctx));
          osc.start(t);
          osc.stop(t + 0.012);
        }
        break;
      }
      case 'bottle_ridges': {
        // Plastic ridges fingernail scratch
        const ridges = 12;
        const s = 0.01;
        for (let i = 0; i < ridges; i++) {
          const t = now + (i * s);
          const noise = ctx.createBufferSource();
          noise.buffer = getNoiseBuffer(ctx);
          const filter = ctx.createBiquadFilter();
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(2200, t);
          filter.Q.setValueAtTime(3, t);
          const g = ctx.createGain();
          g.gain.setValueAtTime(0.12, t);
          g.gain.exponentialRampToValueAtTime(0.001, t + 0.008);
          noise.connect(filter).connect(g).connect(getDestination(ctx));
          noise.start(t);
          noise.stop(t + 0.01);
        }
        break;
      }
      case 'pencils_clicked': {
        // High woody click
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1400, now);
        osc.frequency.linearRampToValueAtTime(900, now + 0.02);
        gain.gain.setValueAtTime(0.65, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
        osc.connect(gain).connect(getDestination(ctx));
        osc.start(now);
        osc.stop(now + 0.04);
        break;
      }
      default:
        playBass();
    }
  } catch (e) {
    console.warn("Found object play failed", e);
  }
}

/**
 * Handle scheduling concept demonstrations
 * Returns a cancel function so the user can halt the playing demonstration
 */
export function playConceptDemo(type: string, onBeats: (step: number) => void): () => void {
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  let oscillators: { stop: (t: number) => void }[] = [];
  let gainNodes: { gain: { setValueAtTime: (v: number, t: number) => void } }[] = [];
  let timeouts: NodeJS.Timeout[] = [];

  const cleanup = () => {
    timeouts.forEach(clearTimeout);
    try {
      oscillators.forEach(o => o.stop(ctx.currentTime));
    } catch {}
  };

  switch (type) {
    case 'pulse': {
      // 4 steady clicks of Bass note
      for (let i = 0; i < 4; i++) {
        timeouts.push(
          setTimeout(() => {
            playBass();
            onBeats(i);
          }, i * 550)
        );
      }
      break;
    }
    case 'decelerando': {
      // Walks slower and slower
      const intervals = [0, 450, 450 + 600, 450 + 600 + 850, 450 + 600 + 850 + 1300];
      intervals.forEach((delay, i) => {
        timeouts.push(
          setTimeout(() => {
            playBass();
            onBeats(i);
          }, delay)
        );
      });
      break;
    }
    case 'accelerando': {
      // Shaker rattle swelling fast
      for (let i = 0; i < 15; i++) {
        // Fast interval reducing
        const delay = 1500 * (1 - Math.pow(i / 15, 0.7));
        timeouts.push(
          setTimeout(() => {
            playShaker(0.3);
            onBeats(i);
          }, delay)
        );
      }
      break;
    }
    case 'unison': {
      // Play bass twice separated by 500ms, then open tone twice.
      // Representing children and facilitator playing exactly together.
      [0, 500, 1000, 1500].forEach((delay, i) => {
        timeouts.push(
          setTimeout(() => {
            // Trigger both at same time to represent unison
            playBass();
            onBeats(i);
          }, delay)
        );
      });
      break;
    }
    case 'timbre': {
      // Timbre comparison: Bass -> Open -> Shaker -> Frog
      const timing = [0, 600, 1200, 1800];
      timing.forEach((bStr, i) => {
        timeouts.push(
          setTimeout(() => {
            if (i === 0) playBass();
            if (i === 1) playOpen();
            if (i === 2) playShaker();
            if (i === 3) playFrog();
            onBeats(i);
          }, bStr)
        );
      });
      break;
    }
    case 'improvisation': {
      // Fast random rhythm of monkey chattering
      for (let i = 0; i < 12; i++) {
        const delay = i * 160 + (Math.random() * 80);
        timeouts.push(
          setTimeout(() => {
            playOpen();
            onBeats(i);
          }, delay)
        );
      }
      break;
    }
    case 'fermata': {
      // Slow beat, then a deep held bass note simulation
      timeouts.push(
        setTimeout(() => { playBass(); onBeats(0); }, 0),
        setTimeout(() => { playBass(); onBeats(1); }, 600),
        // Third note: play a bass + a low resonant drone layer for that held feel
        setTimeout(() => {
          playBass();
          onBeats(2);
          try {
            const oscNode = ctx.createOscillator();
            const gNode = ctx.createGain();
            oscNode.frequency.setValueAtTime(50, ctx.currentTime);
            gNode.gain.setValueAtTime(0.08, ctx.currentTime);
            gNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
            oscNode.connect(gNode).connect(getDestination(ctx));
            oscNode.start();
            oscNode.stop(ctx.currentTime + 1.6);
          } catch {}
        }, 1200)
      );
      break;
    }
  }

  return cleanup;
}

/**
 * Programmatically synthesizes a gentle ambient African savannah soundscape in real-time.
 * Features slowly swelling warm breeze noise and sweet periodic pentatonic kalimba tones.
 * Returns a controller with a fade-out stop function.
 */
export function startAmbientSavannah(): { stop: () => void } {
  try {
    const ctx = getAudioContext();
    const dest = getDestination(ctx);
    const now = ctx.currentTime;

    // Create a master gain for the ambient noise to be very subtle
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.04, now); // keep it soft and immersive
    masterGain.connect(dest);

    // 1. Savannah Wind/Breeze: Modulating bandpass-filtered noise
    const noise = ctx.createBufferSource();
    noise.buffer = getNoiseBuffer(ctx);
    noise.loop = true;

    const windFilter = ctx.createBiquadFilter();
    windFilter.type = 'bandpass';
    windFilter.frequency.setValueAtTime(450, now);
    windFilter.Q.setValueAtTime(1.0, now);

    const windGain = ctx.createGain();
    windGain.gain.setValueAtTime(0.15, now);

    // Modulator for the wind frequency to simulate breeze rising and falling
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.08, now); // slow cycle
    
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(150, now); // modulate filter freq +/- 150Hz

    lfo.connect(lfoGain);
    lfoGain.connect(windFilter.frequency);
    
    noise.connect(windFilter);
    windFilter.connect(windGain);
    windGain.connect(masterGain);

    lfo.start(now);
    noise.start(now);

    // 2. Periodic gentle organic percussive accents (simulating distance crickets / thumb-piano / seeds rustling)
    let isStopped = false;
    let timeoutId: NodeJS.Timeout | null = null;

    const notes = [146.83, 164.81, 196.00, 220.00, 293.66]; // Pentatonic scale (D3, E3, G3, A3, D4)
    let noteIndex = 0;

    const playAmbientTick = () => {
      if (isStopped) return;

      const innerNow = ctx.currentTime;
      const rand = Math.random();
      
      if (rand < 0.4) {
        // Soft shaker/dry grass rustle
        const grainNoise = ctx.createBufferSource();
        grainNoise.buffer = getNoiseBuffer(ctx);
        
        const grainFilter = ctx.createBiquadFilter();
        grainFilter.type = 'bandpass';
        grainFilter.frequency.setValueAtTime(4000 + Math.random() * 1000, innerNow);
        grainFilter.Q.setValueAtTime(3.0, innerNow);

        const grainGain = ctx.createGain();
        grainGain.gain.setValueAtTime(0.001, innerNow);
        grainGain.gain.linearRampToValueAtTime(0.06, innerNow + 0.05);
        grainGain.gain.exponentialRampToValueAtTime(0.001, innerNow + 0.35);

        grainNoise.connect(grainFilter).connect(grainGain).connect(masterGain);

        grainNoise.start(innerNow);
        grainNoise.stop(innerNow + 0.4);
      } else if (rand < 0.8) {
        // Soft pentatonic Kalimba chime
        const osc = ctx.createOscillator();
        const pitch = notes[noteIndex];
        noteIndex = (noteIndex + 1) % notes.length;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(pitch, innerNow);

        // Warm second harmonic for depth
        const subOsc = ctx.createOscillator();
        subOsc.type = 'triangle';
        subOsc.frequency.setValueAtTime(pitch / 2, innerNow); // an octave below
        
        const keyGain = ctx.createGain();
        keyGain.gain.setValueAtTime(0, innerNow);
        keyGain.gain.linearRampToValueAtTime(0.12, innerNow + 0.01);
        keyGain.gain.exponentialRampToValueAtTime(0.001, innerNow + 1.2);

        osc.connect(keyGain);
        subOsc.connect(keyGain);
        keyGain.connect(masterGain);

        osc.start(innerNow);
        subOsc.start(innerNow);
        osc.stop(innerNow + 1.3);
        subOsc.stop(innerNow + 1.3);
      }

      // Schedule next incident (between 1.8 to 4.0 seconds)
      const nextDelay = 1800 + Math.random() * 2200;
      timeoutId = setTimeout(playAmbientTick, nextDelay);
    };

    // Begin looping
    playAmbientTick();

    const stop = () => {
      isStopped = true;
      if (timeoutId) clearTimeout(timeoutId);
      
      const stopNow = ctx.currentTime;
      masterGain.gain.linearRampToValueAtTime(0, stopNow + 0.8); // elegant fade out over 800ms
      
      setTimeout(() => {
        try {
          lfo.stop();
          noise.stop();
        } catch {}
      }, 900);
    };

    return { stop };
  } catch (e) {
    console.warn("Ambient savannah synth failed to play", e);
    return { stop: () => {} };
  }
}
