/**
 * PeaceOneLoveVinyl.tsx
 * Spinning 45 LP with impressionist album art + 8-beat canvas light show
 * DJ KoFAi / DJ CyStorm / DJ Genie — Wild Turkey Studios / Hologram AI Records
 *
 * Dependencies: React 18+, TypeScript
 * No external libraries required — pure React + Canvas API
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface VinylConfig {
  studioName: string;
  title: string;
  artists: string;
  side: string;
  labelTitle: string;
  labelStudio: string;
  catalogNo: string;
  rights: string;
  flagText: string;
  creditsLine1: string;
  creditsLine2: string;
}

interface Pulse {
  t: number;
  color: string;
  maxR: number;
  dur: number;
  width: number;
  fill: boolean;
  rays: boolean;
  delay: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CX = 210;
const CY = 210;
const BASE_SPEED = 2.8;
const BASE_RPM = 45;

const BEAT_COLORS = [
  '#f0c84a', // 1 gold
  '#3aaa28', // 2 green
  '#c83030', // 3 red
  '#f0c84a', // 4 gold
  '#3aaa28', // 5 green
  '#c83030', // 6 red
  '#f0c84a', // 7 gold
  // 8th beat handled separately (tricolor explosion)
];

const DOT_CLASSES = ['gold', 'green', 'red', 'gold', 'green', 'red', 'gold', 'mega'] as const;

const UPLOADED_IMAGES = [
  '/DJKofai.png',
  '/This_is_a_202604181926.png',
  '/ai-image-generator(1).jpg',
  '/ai-image-generator(2).jpg',
  '/ai-image-generator(3).jpg',
  '/ai-image-generator(5).jpg',
  '/ai-image-generator(6).jpg',
  '/ai-image-generator.jpg',
  '/image_1778109798863.jpeg',
  '/lTPaGSI0yHiFHw1rCOwn--0--yAt09.jpg',
  'https://techbridge.edu.gh/static/campus_tour.mp4'
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function hexAlpha(hex: string, a: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${Math.max(0, Math.min(1, a)).toFixed(3)})`;
}

function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3); // Slightly steeper for smoother tail
}

function renderLightShow(
  ctx: CanvasRenderingContext2D,
  pulses: Pulse[],
  timestamp: number
) {
  // Expire old pulses is handled by caller usually, but we filter here for safety if needed
  // However, for deterministic export, we just draw what's valid at timestamp
  
  for (const p of pulses) {
    const elapsed = timestamp - p.t;
    if (elapsed < 0 || elapsed > p.dur) continue;

    const raw      = Math.min(elapsed / p.dur, 1);
    const progress = easeOut(raw);
    const alpha    = Math.max(0, 1 - raw);

    if (p.fill) {
      const r    = 15 + (p.maxR - 15) * progress;
      const grad = ctx.createRadialGradient(CX, CY, 0, CX, CY, r);
      grad.addColorStop(0,   hexAlpha(p.color, alpha));
      grad.addColorStop(0.5, hexAlpha(p.color, alpha * 0.6));
      grad.addColorStop(1,   hexAlpha(p.color, 0));
      ctx.beginPath();
      ctx.arc(CX, CY, r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    } else {
      const r = 15 + (p.maxR - 15) * progress;
      ctx.beginPath();
      ctx.arc(CX, CY, r, 0, Math.PI * 2);
      ctx.strokeStyle    = p.color;
      ctx.lineWidth      = p.width * (1 - raw * 0.6);
      ctx.globalAlpha    = alpha * 0.9;
      ctx.stroke();
      ctx.globalAlpha    = 1;

      if (p.rays && raw < 0.75) {
        const rayAlpha = Math.min(alpha * (1 - raw * 0.8) * 1.1, 0.85);
        drawRays(ctx, CX, CY, r * 0.55,      r + 28,      8, p.color, rayAlpha,        Math.PI / 8);
        drawRays(ctx, CX, CY, r * 0.8 * 0.55, (r + 28) * 0.85, 8, p.color, rayAlpha * 0.55, 0);
      }
    }
  }

  // Idle center breathe
  const breathe = 0.4 + 0.25 * Math.sin(timestamp * 0.004);
  const glowColor = pulses[0]?.color || '#f0c84a';
  const g2 = ctx.createRadialGradient(CX, CY, 0, CX, CY, 22);
  g2.addColorStop(0, hexAlpha(glowColor, breathe * 0.5));
  g2.addColorStop(1, hexAlpha(glowColor, 0));
  ctx.beginPath();
  ctx.arc(CX, CY, 22, 0, Math.PI * 2);
  ctx.fillStyle = g2;
  ctx.fill();
}

function drawRays(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  innerR: number,
  outerR: number,
  numRays: number,
  color: string,
  alpha: number,
  phase: number
): void {
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  for (let i = 0; i < numRays; i++) {
    const angle = (i / numRays) * Math.PI * 2 + phase;
    const spread = 0.13;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle - spread) * innerR, cy + Math.sin(angle - spread) * innerR);
    ctx.lineTo(cx + Math.cos(angle) * outerR,          cy + Math.sin(angle) * outerR);
    ctx.lineTo(cx + Math.cos(angle + spread) * innerR, cy + Math.sin(angle + spread) * innerR);
    ctx.closePath();
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const RASTA_COLORS = ['#3aaa28', '#f0c84a', '#c83030'];
const EMBLEMS = ['🦁', '✌️', '✨', '💿', '🔥'];

function RandomizedText({ text, style, delay = 0, stagger = 0.05 }: { text: string; style: React.CSSProperties; delay?: number; stagger?: number }) {
  const characters = text.split('');
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const triggerNext = () => {
      setPhase(p => p + 1);
      const nextDelay = 8000 + Math.random() * 12000;
      setTimeout(triggerNext, nextDelay);
    };
    const initialTimer = setTimeout(triggerNext, 12000);
    return () => clearTimeout(initialTimer);
  }, []);
  
  return (
    <motion.div 
      style={{ ...style, display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}
    >
      {characters.map((char, i) => {
        // Occasionally substitute a character with an emblem for "Peace One Love" vibe
        const isEmblemTime = (i + phase) % 15 === 0 && char !== ' ';
        const displayChar = isEmblemTime ? EMBLEMS[(i + phase) % EMBLEMS.length] : char;

        return (
          <motion.span
            key={`${i}-${phase}`}
            initial={phase === 0 ? { opacity: 0, y: 15, filter: 'blur(6px)' } : { 
              opacity: 0.6, 
              y: Math.random() * 10 - 5, 
              x: Math.random() * 6 - 3,
              filter: 'blur(2px)',
              rotate: Math.random() * 10 - 5
            }}
            animate={{ 
              opacity: 1, 
              y: [null, 0, -1.2, 0.6, 0],
              x: 0,
              filter: 'blur(0px)',
              rotate: [null, 0, Math.random() * 2 - 1, 0],
              color: [style.color as string, ...RASTA_COLORS, style.color as string]
            }}
            transition={{
              y: {
                times: [0, 0.2, 0.5, 0.8, 1],
                duration: 5 + Math.random() * 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: (phase === 0 ? delay : 0) + i * stagger
              },
              rotate: {
                duration: 4 + Math.random() * 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: (phase === 0 ? delay : 0) + i * stagger
              },
              color: {
                duration: 10 + Math.random() * 5,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.2
              },
              opacity: { duration: 0.8, delay: (phase === 0 ? delay : i * stagger * 0.5) },
              filter: { duration: 0.8, delay: (phase === 0 ? delay : i * stagger * 0.5) }
            }}
            style={{ 
              display: 'inline-block', 
              whiteSpace: char === ' ' ? 'pre' : 'normal',
              textShadow: isEmblemTime ? '0 0 8px rgba(240, 200, 74, 0.4)' : 'none'
            }}
          >
            {displayChar}
          </motion.span>
        );
      })}
    </motion.div>
  );
}

function VinylSVG({ spinning, config, albumArt }: { spinning: boolean; config: VinylConfig; albumArt?: string }) {
  const animStyle: React.CSSProperties = {
    animation: `vinyl-spin 2.8s linear infinite`,
    animationPlayState: spinning ? 'running' : 'paused',
    willChange: 'transform',
    borderRadius: '50%',
    display: 'block',
  };

  return (
    <svg
      style={animStyle}
      width="420"
      height="420"
      viewBox="0 0 420 420"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath id="vinylClip"><circle cx="210" cy="210" r="208" /></clipPath>
        <clipPath id="artClip"><circle cx="210" cy="210" r="115" /></clipPath>
        <radialGradient id="grooveSheen" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#2a2420" stopOpacity="0.6" />
          <stop offset="60%" stopColor="#0d0b09" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="labelGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1a1208" />
          <stop offset="100%" stopColor="#0e0c06" />
        </radialGradient>
        <radialGradient id="skyGrad" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#e8b548" />
          <stop offset="30%" stopColor="#c47b25" />
          <stop offset="60%" stopColor="#7a4a1a" />
          <stop offset="100%" stopColor="#1e1008" />
        </radialGradient>
        <filter id="painterly" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves={3} seed={8} result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={2.2} xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <radialGradient id="holeCover" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#100d08" />
          <stop offset="85%" stopColor="#0a0806" />
          <stop offset="100%" stopColor="#1a1510" />
        </radialGradient>
      </defs>

      {/* Vinyl disc */}
      <circle cx="210" cy="210" r="208" fill="#0d0b09" />

      {/* Groove rings */}
      <g clipPath="url(#vinylClip)" opacity="0.9">
        {[207,204,200,196,192,188,184,180,176,172,168,164,160,156,152,148,144,140,136,132,128,124].map((r, i) => (
          <circle key={r} cx="210" cy="210" r={r} fill="none"
            stroke={i % 2 === 0 ? '#1c1815' : '#1e1a16'}
            strokeWidth={i % 3 === 0 ? 0.8 : 0.55}
          />
        ))}
      </g>
      <circle cx="210" cy="210" r="208" fill="url(#grooveSheen)" clipPath="url(#vinylClip)" />

      {/* Label */}
      <circle cx="210" cy="210" r="118" fill="url(#labelGrad)" />

      {/* Album art — impressionist scene or dynamic image */}
      <g clipPath="url(#artClip)">
        {albumArt ? (
          albumArt.toLowerCase().endsWith('.mp4') ? (
            <foreignObject x="95" y="95" width="230" height="230">
              <video
                src={albumArt}
                autoPlay
                muted
                loop
                playsInline
                style={{ width: 230, height: 230, objectFit: 'cover' }}
              />
            </foreignObject>
          ) : (
            <image
              href={albumArt}
              x="95"
              y="95"
              width="230"
              height="230"
              preserveAspectRatio="xMidYMid slice"
            />
          )
        ) : (
          <g filter="url(#painterly)">
            {/* Sky */}
            <rect x="95" y="95" width="230" height="230" fill="url(#skyGrad)" />

            {/* Painterly sky strokes */}
            <g opacity="0.55">
              <ellipse cx="140" cy="130" rx="38" ry="14" fill="#f0c060" opacity="0.3" transform="rotate(-8,140,130)" />
              <ellipse cx="190" cy="118" rx="45" ry="10" fill="#e8aa40" opacity="0.25" transform="rotate(5,190,118)" />
              <ellipse cx="260" cy="125" rx="35" ry="12" fill="#d49030" opacity="0.3" transform="rotate(-5,260,125)" />
              <ellipse cx="280" cy="142" rx="40" ry="11" fill="#e8b048" opacity="0.28" transform="rotate(7,280,142)" />
            </g>

            {/* Sun rays */}
            <g transform="translate(210,182)" opacity="0.88">
              {[0,22,45,67,90,112,135,157,180,202,225,247,270,292,315,337].map((deg, i) => (
                <polygon
                  key={deg}
                  points={`0,0 ${i%2===0?-8:-6},-${85+i%3*3} ${i%2===0?8:6},-${85+i%3*3}`}
                  fill={i%3===0?'#f7d060':i%3===1?'#f4c848':'#f0c040'}
                  opacity={i%2===0?0.52:0.42}
                  transform={`rotate(${deg})`}
                />
              ))}
              <circle cx="0" cy="0" r="22" fill="#fce878" opacity="0.6" />
              <circle cx="0" cy="0" r="13" fill="#fff4a0" opacity="0.7" />
              <circle cx="0" cy="0" r="6"  fill="#fffde0" opacity="0.85" />
            </g>

            {/* Hill */}
            <ellipse cx="210" cy="248" rx="92" ry="45" fill="#2a3818" opacity="0.9" />
            <ellipse cx="210" cy="244" rx="82" ry="40" fill="#334820" opacity="0.95" />
            <ellipse cx="198" cy="238" rx="35" ry="12" fill="#4a6830" opacity="0.5" transform="rotate(-8,198,238)" />
            <ellipse cx="210" cy="280" rx="110" ry="35" fill="#1e2a10" opacity="0.9" />

            {/* Palm tree — left */}
            <g opacity="0.92">
              <path d="M143 265 Q139 240 141 218 Q143 200 145 185" stroke="#1a1408" strokeWidth="4" fill="none" />
              {[[-8,13],[-12,10],[12,3],[12,-2],[-12,-4],[-10,-8]].map(([dx,dy],i) => (
                <path key={i}
                  d={`M145 188 Q${145+dx*5} ${170+dy} ${145+dx*10} ${158+dy*2}`}
                  stroke={i%2===0?'#1c2810':'#243418'} strokeWidth="3" fill="none" strokeLinecap="round"
                />
              ))}
              <ellipse cx="110" cy="186" rx="14" ry="6" fill="#2e4020" opacity="0.6" transform="rotate(-20,110,186)" />
              <ellipse cx="120" cy="157" rx="16" ry="5" fill="#243818" opacity="0.55" transform="rotate(-40,120,157)" />
              <ellipse cx="163" cy="153" rx="15" ry="5" fill="#2e4220" opacity="0.55" transform="rotate(30,163,153)" />
            </g>

            {/* Baobab tree — right */}
            <g opacity="0.92">
              <path d="M278 270 Q276 248 274 228 Q272 210 270 195" stroke="#1a1408" strokeWidth="5" fill="none" />
              <ellipse cx="268" cy="182" rx="35" ry="28" fill="#1e2e12" opacity="0.9" />
              <ellipse cx="245" cy="190" rx="28" ry="22" fill="#243618" opacity="0.85" />
              <ellipse cx="290" cy="188" rx="30" ry="24" fill="#1a2a0e" opacity="0.88" />
              <ellipse cx="268" cy="165" rx="26" ry="20" fill="#28381a" opacity="0.8" />
              <ellipse cx="258" cy="168" rx="14" ry="9"  fill="#3a5428" opacity="0.45" transform="rotate(-15,258,168)" />
            </g>

            {/* Crowd silhouettes */}
            <g opacity="0.88">
              <g fill="#141008" opacity="0.75">
                {[158,168,178,188,198,208,218,228,238,248,258].map((x,i) => (
                  <ellipse key={x} cx={x} cy={258+i%2} rx="5" ry={10+i%2} />
                ))}
              </g>
              <g fill="#0e0c08" opacity="0.85">
                {[130,143,156,169,182,195,208,221,234,247,260,273,286].map((x,i) => (
                  <ellipse key={x} cx={x} cy={276-i%3} rx="6" ry={13+i%3} />
                ))}
              </g>
              {/* Raised arms */}
              <g fill="#100e08" opacity="0.7">
                <path d="M195 265 Q188 256 182 252" stroke="#100e08" strokeWidth="2" fill="none" />
                <path d="M195 265 Q202 256 207 252" stroke="#100e08" strokeWidth="2" fill="none" />
                <path d="M225 265 Q219 257 215 253" stroke="#100e08" strokeWidth="2" fill="none" />
                <path d="M225 265 Q231 256 236 252" stroke="#100e08" strokeWidth="2" fill="none" />
              </g>
            </g>

            {/* JAH flag on pole */}
            <g opacity="0.95">
              <line x1="210" y1="240" x2="210" y2="185" stroke="#1a1208" strokeWidth="1.8" />
              <rect x="210" y="185" width="22" height="8"  fill="#2d6b20" />
              <rect x="210" y="193" width="22" height="7"  fill="#d4a020" />
              <rect x="210" y="200" width="22" height="8"  fill="#9e2020" />
              <text x="221" y="197" fontFamily="serif" fontSize="5.5" fontWeight="bold"
                fill="#f8f0d8" textAnchor="middle" letterSpacing="0.5">{config.flagText}</text>
            </g>

            <rect x="95" y="300" width="230" height="25" fill="#0e120a" />
          </g>
        )}
      </g>

      {/* Label border */}
      <circle cx="210" cy="210" r="118" fill="none" stroke="#8b6e3a" strokeWidth="1.2" opacity="0.7" />
      <circle cx="210" cy="210" r="114" fill="none" stroke="#4a3a1e" strokeWidth="0.5" opacity="0.5" />

      {/* Label text */}
      <text x="210" y="112" fontFamily="'Space Mono',monospace" fontSize="7" fontWeight="700"
        fill="#f0c84a" textAnchor="middle" letterSpacing="2.5">{config.side}</text>
      <text x="210" y="302" fontFamily="Georgia,serif" fontSize="9.5" fontWeight="bold"
        fill="#f0c84a" textAnchor="middle" letterSpacing="1.5">{config.labelTitle}</text>
      <text x="210" y="314" fontFamily="'Space Mono',monospace" fontSize="6"
        fill="#8b6e3a" textAnchor="middle" letterSpacing="1.8">{config.labelStudio}</text>
      <text x="134" y="236" fontFamily="'Space Mono',monospace" fontSize="6"
        fill="#4a3a1e" textAnchor="middle" transform="rotate(-90,134,210)">{config.catalogNo}</text>
      <text x="287" y="184" fontFamily="'Space Mono',monospace" fontSize="6"
        fill="#4a3a1e" textAnchor="middle" transform="rotate(90,287,210)">{config.rights}</text>

      {/* Center hole (large 45 format) */}
      <circle cx="210" cy="210" r="18" fill="url(#holeCover)" />
      <circle cx="210" cy="210" r="18" fill="none" stroke="#2a2018" strokeWidth="1" />
      <circle cx="210" cy="210" r="15" fill="#0a0806" />
      <circle cx="207" cy="207" r="3"  fill="#201a10" opacity="0.5" />
    </svg>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PeaceOneLoveVinyl() {
  const [playing, setPlaying]   = useState(true);
  const [speed, setSpeed]       = useState(BASE_SPEED);
  const [bpm, setBpm]           = useState(60);
  const [activeDot, setActiveDot] = useState<number>(-1);
  const [isEditing, setIsEditing] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [flashImage, setFlashImage] = useState('');
  const [bgImage, setBgImage] = useState(UPLOADED_IMAGES[7]); // Default to one of the images
  const [showBg, setShowBg] = useState(true);
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [customAssets, setCustomAssets] = useState<string[]>([]);

  const allAssets = [...UPLOADED_IMAGES, ...customAssets];

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomAssets(prev => [url, ...prev]);
      setBgImage(url);
    }
  };

  const aspectRatios = [
    { label: '1:1', w: 1080, h: 1080 },
    { label: '4:3', w: 1080, h: 810 },
    { label: '3:4', w: 810, h: 1080 },
    { label: '16:9', w: 1280, h: 720 },
    { label: '9:16', w: 720, h: 1280 },
    { label: '3:2', w: 1080, h: 720 },
    { label: '2:3', w: 720, h: 1080 },
    { label: '5:4', w: 1080, h: 864 },
    { label: '4:5', w: 864, h: 1080 },
    { label: '21:9', w: 1280, h: 548 },
    { label: '9:21', w: 548, h: 1280 },
  ];

  const [config, setConfig] = useState<VinylConfig>({
    studioName: 'Wild Turkey Studios · Hologram AI Records',
    title: 'PEACE & ONE LOVE',
    artists: 'DJ KoFAi · DJ CyStorm · DJ Genie',
    side: '▶ SIDE A',
    labelTitle: 'PEACE & ONE LOVE',
    labelStudio: 'WILD TURKEY STUDIOS',
    catalogNo: 'PLCRP-45-002',
    rights: 'GHAMRO · ASCAP',
    flagText: 'JAH',
    creditsLine1: 'Hologram AI Records / Patois-Lyricist Records (PLCRP)',
    creditsLine2: 'Distributed via DistroKid · GHAMRO · ASCAP',
  });

  const canvasRef      = useRef<HTMLCanvasElement>(null);
  const vinylWrapperRef = useRef<HTMLDivElement>(null);
  const pulsesRef      = useRef<Pulse[]>([]);
  const beatCountRef   = useRef(0);
  const imageIndexRef  = useRef(-1);
  const lastBeatRef    = useRef(-Infinity);
  const playingRef     = useRef(true);
  const bpmRef         = useRef(60);
  const rafRef         = useRef<number>(0);

  // Keep refs in sync with state
  useEffect(() => { playingRef.current = playing; }, [playing]);
  useEffect(() => { bpmRef.current = bpm; }, [bpm]);

  const addPulse = useCallback((
    t: number, color: string, maxR: number, dur: number,
    width: number, fill: boolean, rays: boolean, delay = 0
  ) => {
    pulsesRef.current.push({ t: t + delay, color, maxR, dur, width, fill, rays, delay });
  }, []);

  const triggerBeat = useCallback((now: number) => {
    const b = beatCountRef.current % 8;
    setActiveDot(b);

    if (b === 7) {
      // ── Beat 8 — tricolor starburst ──
      addPulse(now, '#f0c84a', 165, 2000, 4,   false, true,  0);
      addPulse(now, '#3aaa28', 140, 1800, 3.5, false, false, 80);
      addPulse(now, '#c83030', 118, 1600, 3,   false, false, 160);
      addPulse(now, '#ffffff',  30,  600, 0,   true,  false, 0);
      addPulse(now, '#f0c84a',  22,  500, 0,   true,  false, 100);
      addPulse(now, '#3aaa28',  22,  450, 0,   true,  false, 200);
      addPulse(now, '#c83030',  22,  400, 0,   true,  false, 300);
    } else {
      const color = BEAT_COLORS[b];
      addPulse(now, color, 80,  900, 3, false, false, 0);
      addPulse(now, color, 24,  400, 0,   true,  false, 0);
    }

    // ── Image Flash Trigger (every 12 beats) ──
    if ((beatCountRef.current + 1) % 12 === 0) {
      const nextIdx = (imageIndexRef.current + 1) % UPLOADED_IMAGES.length;
      imageIndexRef.current = nextIdx;
      setFlashImage(UPLOADED_IMAGES[nextIdx]);
      setShowFlash(true);
      
      // Auto-hide after 3 seconds for a more relaxed pace
      setTimeout(() => setShowFlash(false), 3000);
    }

    beatCountRef.current++;
  }, [addPulse]);

  // ── Canvas render loop ────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function frame(timestamp: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, 420, 420);

      // Fire beats
      if (playingRef.current) {
        const interval = 60000 / bpmRef.current;
        if (timestamp - lastBeatRef.current >= interval) {
          lastBeatRef.current = timestamp;
          triggerBeat(timestamp);
        }
      }

      // Expire old pulses
      pulsesRef.current = pulsesRef.current.filter(
        p => timestamp - p.t < p.dur + 10
      );

      // Render
      renderLightShow(ctx, pulsesRef.current, timestamp);

      rafRef.current = requestAnimationFrame(frame);
    }

    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, [triggerBeat]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const togglePlay = () => {
    setPlaying(p => {
      if (p) lastBeatRef.current = -Infinity; // reset beat clock on pause
      return !p;
    });
  };

  const handleSpeed = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSpeed(parseFloat(e.target.value));
  };

  const handleBpm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBpm(parseInt(e.target.value));
    lastBeatRef.current = -Infinity;
  };

  const spinDuration = `${(BASE_SPEED / speed).toFixed(2)}s`;
  const rpm          = Math.round(speed * BASE_RPM / BASE_SPEED);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Space+Mono:wght@400;700&display=swap');

        @keyframes vinyl-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        @keyframes pulse-glow {
          0%,100% { opacity: .6; transform: scale(1); }
          50%      { opacity: 1;  transform: scale(1.03); }
        }

        .plv-dot.gold { background:#f0c84a; box-shadow:0 0 6px #f0c84a; }
        .plv-dot.green{ background:#3aaa28; box-shadow:0 0 6px #3aaa28; }
        .plv-dot.red  { background:#c83030; box-shadow:0 0 6px #c83030; }
        .plv-dot.mega { background:#fff;    box-shadow:0 0 10px #fff,0 0 20px #f0c84a; transform:scale(2)!important; }
      `}</style>

      <div style={{
        background: '#0a0806',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        fontFamily: "'Space Mono', monospace",
        padding: '2rem 1rem',
        gap: '1.6rem',
        transition: 'background 0.5s ease',
        overflow: 'hidden',
      }}>
        
        {/* Background Layer */}
        <AnimatePresence mode="popLayout">
          {showBg && (
            <motion.div
              key={bgImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                zIndex: 0,
                pointerEvents: 'none',
              }}
            >
              {bgImage.toLowerCase().endsWith('.mp4') ? (
                <video
                  src={bgImage}
                  autoPlay
                  muted
                  loop
                  playsInline
                  style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.15 }}
                />
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  backgroundImage: `url(${bgImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  opacity: 0.15,
                }} />
              )}
              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'radial-gradient(circle at center, transparent, #0a0806 80%)',
              }} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Title */}
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <RandomizedText 
            text={config.studioName}
            style={{ fontSize: 10, letterSpacing: '0.35em', color: '#8b6e3a', textTransform: 'uppercase', marginBottom: 6 }}
            delay={0.5}
            stagger={0.02}
          />
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 28, fontWeight: 700,
              color: '#f0c84a', lineHeight: 1, letterSpacing: '0.04em', margin: 0,
            }}
          >
            <RandomizedText 
              text={config.title}
              style={{ display: 'inline' }}
              delay={0.8}
              stagger={0.04}
            />
          </motion.h1>
          <RandomizedText 
            text={config.artists}
            style={{ fontSize: 10, letterSpacing: '0.25em', color: '#c8a44a', marginTop: 6, textTransform: 'uppercase' }}
            delay={1.2}
            stagger={0.03}
          />
        </div>

        {/* Record stage */}
        <div style={{ position: 'relative', width: 420, height: 420, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>

          {/* Ambient glow behind record */}
          <div style={{
            position: 'absolute',
            width: 440, height: 440,
            borderRadius: '50%',
            background: 'radial-gradient(circle,rgba(240,200,74,.12) 0%,rgba(180,130,30,.06) 40%,transparent 70%)',
            top: -10, left: -10,
            pointerEvents: 'none',
            animation: 'pulse-glow 3s ease-in-out infinite',
          }} />

          {/* Light show canvas — fixed above spinning vinyl */}
          <canvas
            ref={canvasRef}
            width={420}
            height={420}
            style={{
              position: 'absolute',
              top: 0, left: 0,
              width: 420, height: 420,
              pointerEvents: 'none',
              clipPath: 'circle(208px at center)',
              zIndex: 10,
            }}
          />

          {/* Spinning vinyl (non-negotiable 🎶) */}
          <div
            ref={vinylWrapperRef}
            onClick={togglePlay}
            style={{ 
              ...({ animationDuration: spinDuration } as React.CSSProperties), 
              cursor: 'pointer', 
              width: 420, 
              height: 420,
              transition: 'animation-duration 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <VinylSVG spinning={playing} config={config} albumArt={flashImage} />
          </div>

          {/* Flash Image Overlay */}
          <AnimatePresence>
            {showFlash && (
              <motion.div
                initial={{ opacity: 0, scale: 0.2, rotate: -25 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 2, rotate: 25, filter: 'blur(10px)' }}
                transition={{ 
                  duration: 0.8, 
                  type: 'spring', 
                  damping: 18, 
                  stiffness: 80,
                  mass: 1.2
                }}
                style={{
                  position: 'absolute',
                  zIndex: 50,
                  width: 280,
                  height: 280,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  boxShadow: '0 0 60px rgba(240,200,74,0.6)',
                  border: '4px solid #f0c84a',
                  backgroundColor: '#000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {flashImage.toLowerCase().endsWith('.mp4') ? (
                  <video
                    src={flashImage}
                    autoPlay
                    muted
                    loop
                    playsInline
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <img
                    src={flashImage}
                    alt="Special Reveal"
                    referrerPolicy="no-referrer"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                )}
                <div style={{
                  position: 'absolute',
                  bottom: 20,
                  left: 0,
                  right: 0,
                  background: 'rgba(0,0,0,0.6)',
                  padding: '8px',
                  color: '#f0c84a',
                  fontSize: '9px',
                  textAlign: 'center',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  backdropFilter: 'blur(4px)',
                }}>
                  {config.artists}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Beat counter dots */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', position: 'relative', zIndex: 1 }}>
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className={`plv-dot${activeDot === i ? ` ${DOT_CLASSES[i]}` : ''}`}
              style={{
                width: 8, height: 8,
                borderRadius: '50%',
                background: activeDot === i ? undefined : '#1e1810',
                border: `1px solid ${activeDot === i ? 'transparent' : '#3a2e14'}`,
                transform: activeDot === i ? (i === 7 ? 'scale(2)' : 'scale(1.5)') : 'scale(1)',
                transition: 'background .05s, transform .05s',
              }}
            />
          ))}
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
          <span style={{ fontSize: 10, color: '#8b6e3a', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Speed</span>
          <input type="range" min="0.3" max="5" step="0.1" value={speed} onChange={handleSpeed}
            style={{ width: 80, accentColor: '#f0c84a' }} />
          <span style={{ fontSize: 13, color: '#f0c84a', minWidth: 42, textAlign: 'center' }}>{rpm} rpm</span>

          <span style={{ fontSize: 10, color: '#8b6e3a', letterSpacing: '0.2em', textTransform: 'uppercase', marginLeft: 8 }}>BPM</span>
          <input type="range" min="40" max="180" step="1" value={bpm} onChange={handleBpm}
            style={{ width: 80, accentColor: '#f0c84a' }} />
          <span style={{ fontSize: 13, color: '#f0c84a', minWidth: 28, textAlign: 'center' }}>{bpm}</span>

          <button onClick={togglePlay} style={{
            background: 'transparent',
            border: '1px solid #8b6e3a',
            color: '#f0c84a',
            fontFamily: "'Space Mono', monospace",
            fontSize: 11,
            letterSpacing: '0.15em',
            padding: '8px 20px',
            borderRadius: 2,
            cursor: 'pointer',
            textTransform: 'uppercase',
            marginLeft: 8,
          }}>
            {playing ? '⏸ Pause' : '▶ Play'}
          </button>

          <button onClick={() => setIsEditing(!isEditing)} style={{
            background: isEditing ? '#f0c84a' : 'transparent',
            border: '1px solid #8b6e3a',
            color: isEditing ? '#0a0806' : '#f0c84a',
            fontFamily: "'Space Mono', monospace",
            fontSize: 11,
            letterSpacing: '0.15em',
            padding: '8px 20px',
            borderRadius: 2,
            cursor: 'pointer',
            textTransform: 'uppercase',
            marginLeft: 8,
          }}>
            {isEditing ? '✓ Close Edit' : '✎ Edit Text'}
          </button>

          <button onClick={() => setShowBg(!showBg)} style={{
            background: showBg ? '#f0c84a' : 'transparent',
            border: '1px solid #8b6e3a',
            color: showBg ? '#0a0806' : '#f0c84a',
            fontFamily: "'Space Mono', monospace",
            fontSize: 11,
            letterSpacing: '0.15em',
            padding: '8px 20px',
            borderRadius: 2,
            cursor: 'pointer',
            textTransform: 'uppercase',
            marginLeft: 8,
          }}>
            {showBg ? '🖼 Hide BG' : '🖼 Show BG'}
          </button>

          <ExportButton 
            vinylRef={vinylWrapperRef} 
            config={config}
            bpm={bpm}
            speed={speed}
            bgState={{ show: showBg, img: bgImage }}
            selectedRatio={aspectRatios.find(r => r.label === aspectRatio) || aspectRatios[3]}
          />
        </div>

        {/* Editing Panel */}
        {isEditing && (
          <div style={{
            width: '100%',
            maxWidth: 600,
            background: '#1a1815',
            padding: '24px',
            borderRadius: 8,
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            border: '1px solid #3a2e14',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px',
            marginTop: '1rem',
            position: 'relative',
            zIndex: 1,
          }}>
            <div style={{ gridColumn: '1 / -1', borderBottom: '1px solid #3a2e14', paddingBottom: 8, marginBottom: 8, color: '#8b6e3a', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Text Editor
            </div>
            {[
              { label: 'Studio Name', key: 'studioName' },
              { label: 'App Title', key: 'title' },
              { label: 'Artists', key: 'artists' },
              { label: 'Side Text', key: 'side' },
              { label: 'Label Title', key: 'labelTitle' },
              { label: 'Label Studio', key: 'labelStudio' },
              { label: 'Catalog No', key: 'catalogNo' },
              { label: 'Rights/Label Info', key: 'rights' },
              { label: 'Flag Text', key: 'flagText' },
              { label: 'Credits Line 1', key: 'creditsLine1' },
              { label: 'Credits Line 2', key: 'creditsLine2' },
            ].map((field) => (
              <React.Fragment key={field.key}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 9, color: '#8b6e3a', textTransform: 'uppercase' }}>{field.label}</label>
                <input
                  type="text"
                  value={config[field.key as keyof VinylConfig]}
                  onChange={(e) => setConfig(prev => ({ ...prev, [field.key]: e.target.value }))}
                  style={{
                    background: '#0a0806',
                    border: '1px solid #3a2e14',
                    color: '#f0c84a',
                    padding: '8px 12px',
                    fontSize: 12,
                    fontFamily: "'Space Mono', monospace",
                    borderRadius: 4,
                  }}
                />
              </div>
            <div style={{ gridColumn: '1 / -1', borderTop: '1px solid #3a2e14', paddingTop: 16, marginTop: 8, color: '#8b6e3a', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Aspect Ratio
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {aspectRatios.map(r => (
                <button
                  key={r.label}
                  onClick={() => setAspectRatio(r.label)}
                  style={{
                    background: aspectRatio === r.label ? '#f0c84a' : '#0a0806',
                    border: '1px solid #3a2e14',
                    color: aspectRatio === r.label ? '#0a0806' : '#f0c84a',
                    padding: '4px 8px',
                    fontSize: 10,
                    fontFamily: "'Space Mono', monospace",
                    borderRadius: 4,
                    cursor: 'pointer',
                    minWidth: 50,
                  }}
                >
                  {r.label}
                </button>
              ))}
            </div>

            {field.key === 'creditsLine2' && (
              <div key="bg-controls" style={{ gridColumn: '1 / -1', borderTop: '1px solid #3a2e14', paddingTop: 16, marginTop: 8, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <label style={{ fontSize: 10, color: '#f0c84a', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input type="checkbox" checked={showBg} onChange={e => setShowBg(e.target.checked)} style={{ accentColor: '#f0c84a' }} />
                    Show Background Image
                  </label>
                  <label style={{ 
                    fontSize: 10, 
                    color: '#0a0806', 
                    background: '#f0c84a', 
                    padding: '4px 10px', 
                    borderRadius: 2, 
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    fontWeight: 'bold'
                  }}>
                    + Upload Bg
                    <input type="file" accept="image/*,video/mp4" onChange={handleBgUpload} style={{ display: 'none' }} />
                  </label>
                </div>

                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))', 
                  gap: 8,
                  maxHeight: 180,
                  overflowY: 'auto',
                  padding: 4,
                  background: '#0a0806',
                  borderRadius: 4,
                  border: '1px solid #3a2e14'
                }}>
                  {allAssets.map((img, idx) => (
                    <div 
                      key={idx}
                      onClick={() => setBgImage(img)}
                      style={{
                        width: '100%',
                        aspectRatio: '1/1',
                        borderRadius: 2,
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: bgImage === img ? '2px solid #f0c84a' : '2px solid transparent',
                        position: 'relative'
                      }}
                    >
                      {img.toLowerCase().endsWith('.mp4') ? (
                        <video src={img} autoPlay muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} referrerPolicy="no-referrer" />
                      )}
                      {img.toLowerCase().endsWith('.mp4') && (
                        <div style={{ position: 'absolute', bottom: 2, right: 2, fontSize: 8, color: '#fff', background: 'rgba(0,0,0,0.5)', padding: '1px 3px', borderRadius: 2 }}>MP4</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    )}

        {/* Credits */}
        <div style={{ fontSize: 9, color: '#4a3a1e', letterSpacing: '0.3em', textTransform: 'uppercase', textAlign: 'center', lineHeight: 2, position: 'relative', zIndex: 1 }}>
          <RandomizedText text={config.creditsLine1} style={{ fontSize: 9, color: '#4a3a1e' }} delay={2} stagger={0.01} />
          <RandomizedText text={config.artists} style={{ fontSize: 9, color: '#4a3a1e', fontWeight: 'bold' }} delay={2.5} stagger={0.01} />
          <RandomizedText text={config.creditsLine2} style={{ fontSize: 9, color: '#4a3a1e' }} delay={3} stagger={0.01} />
        </div>

      </div>
    </>
  );
}

// ─── Export Logic ─────────────────────────────────────────────────────────────

function ExportButton({ vinylRef, config, bpm, speed, bgState, selectedRatio }: { 
  vinylRef: React.RefObject<HTMLDivElement | null>,
  config: VinylConfig,
  bpm: number,
  speed: number,
  bgState: { show: boolean, img: string },
  selectedRatio: { label: string, w: number, h: number }
}) {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleExport = async () => {
    if (!vinylRef.current) return;

    setIsExporting(true);
    setProgress(0);
    
    // Create export canvas based on selected ratio
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = selectedRatio.w;
    exportCanvas.height = selectedRatio.h;
    const eCtx = exportCanvas.getContext('2d');
    if (!eCtx) return;

    // To prevent jitter, we capture the static Vinyl SVG once and then rotate it ourselves
    const vinylStaticCanvas = document.createElement('canvas');
    vinylStaticCanvas.width = 420;
    vinylStaticCanvas.height = 420;
    const vCtx = vinylStaticCanvas.getContext('2d');
    
    // Capture Vinyl SVG (static version)
    const svgElement = vinylRef.current?.querySelector('svg');
    if (svgElement && vCtx) {
      const clonedSvg = svgElement.cloneNode(true) as SVGSVGElement;
      clonedSvg.style.animation = 'none';
      clonedSvg.style.transform = 'none';
      const svgData = new XMLSerializer().serializeToString(clonedSvg);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      const img = new Image();
      await new Promise((resolve) => {
        img.onload = () => {
          vCtx.drawImage(img, 0, 0, 420, 420);
          URL.revokeObjectURL(url);
          resolve(true);
        };
        img.src = url;
      });
    }

    const fps = 60;
    const duration = 12000; // 12 seconds capture
    const totalFrames = (duration / 1000) * fps;
    const frameTime = 1000 / fps;

    const stream = exportCanvas.captureStream(fps);
    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9', bitsPerSecond: 12000000 });
    const chunks: Blob[] = [];
    mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
    
    const exportFinished = new Promise((resolve) => {
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${config.title.replace(/\s+/g, '_')}_Visual.webm`;
        a.click();
        URL.revokeObjectURL(url);
        resolve(true);
      };
    });

    mediaRecorder.start();

    // Pre-load all assets for export
    let bgAsset: HTMLImageElement | HTMLVideoElement | null = null;
    if (bgState.show && bgState.img) {
      if (bgState.img.toLowerCase().endsWith('.mp4')) {
        const v = document.createElement('video');
        v.src = bgState.img;
        v.muted = true;
        v.playsInline = true;
        v.crossOrigin = 'anonymous';
        bgAsset = v;
      } else {
        const img = new Image();
        img.src = bgState.img;
        img.crossOrigin = 'anonymous';
        bgAsset = img;
      }

      await new Promise(r => {
        if (bgAsset instanceof HTMLImageElement) {
          if (bgAsset.complete) r(true);
          else bgAsset.onload = () => r(true);
          bgAsset.onerror = () => r(false);
        } else if (bgAsset instanceof HTMLVideoElement) {
          bgAsset.onloadeddata = () => r(true);
          bgAsset.onerror = () => r(false);
          bgAsset.load();
        }
      });
    }

    const flashAssets: (HTMLImageElement | HTMLVideoElement)[] = [];
    for (const src of UPLOADED_IMAGES) {
      if (src.toLowerCase().endsWith('.mp4')) {
        const v = document.createElement('video');
        v.src = src;
        v.muted = true;
        v.playsInline = true;
        v.crossOrigin = 'anonymous';
        flashAssets.push(v);
      } else {
        const img = new Image();
        img.src = src;
        img.crossOrigin = 'anonymous';
        flashAssets.push(img);
      }
    }

    await Promise.all(flashAssets.map(asset => new Promise(r => {
      if (asset instanceof HTMLImageElement) {
        if (asset.complete) r(true);
        else asset.onload = () => r(true);
        asset.onerror = () => r(false);
      } else {
        asset.onloadeddata = () => r(true);
        asset.onerror = () => r(false);
        asset.load();
      }
    })));

    // Deterministic simulation
    const simulatedPulses: Pulse[] = [];
    let simulatedBeatCount = 0;
    let simulatedLastBeatTime = -99999;
    const beatInterval = 60000 / bpm;

    for (let i = 0; i < totalFrames; i++) {
      const simTime = i * frameTime;
      setProgress(Math.round((i / totalFrames) * 100));

      // 1. Simulate Beats
      if (simTime - simulatedLastBeatTime >= beatInterval) {
        simulatedLastBeatTime = simTime;
        const b = simulatedBeatCount % 8;
        
        const addP = (t: number, color: string, maxR: number, dur: number, w: number, f: boolean, r: boolean, delay: number) => {
          simulatedPulses.push({ t: t + delay, color, maxR, dur, width: w, fill: f, rays: r, delay });
        };

        if (b === 7) {
          addP(simTime, '#f0c84a', 165, 2000, 4,   false, true,  0);
          addP(simTime, '#3aaa28', 140, 1800, 3.5, false, false, 80);
          addP(simTime, '#c83030', 118, 1600, 3,   false, false, 160);
          addP(simTime, '#ffffff',  30,  600, 0,   true,  false, 0);
          addP(simTime, '#f0c84a',  22,  500, 0,   true,  false, 100);
          addP(simTime, '#3aaa28',  22,  450, 0,   true,  false, 200);
          addP(simTime, '#c83030',  22,  400, 0,   true,  false, 300);
        } else {
          const color = BEAT_COLORS[b];
          addP(simTime, color, 80, 900, 3, false, false, 0);
          addP(simTime, color, 24, 400, 0, true,  false, 0);
        }
        simulatedBeatCount++;
      }

      // Cleanup pulses for performance
      const activePulses = simulatedPulses.filter(p => simTime - p.t < p.dur + 10);

      // 2. Draw Background
      let bgReady = false;
      if (bgState.show && bgAsset) {
        if (bgAsset instanceof HTMLImageElement) {
          bgReady = bgAsset.complete;
        } else {
          bgAsset.currentTime = (simTime % (bgAsset.duration * 1000 || 10000)) / 1000;
          bgReady = true;
        }
      }

      if (bgReady && bgAsset) {
        eCtx.drawImage(bgAsset, 0, 0, selectedRatio.w, selectedRatio.h);
        eCtx.fillStyle = 'rgba(10, 8, 6, 0.85)';
        eCtx.fillRect(0, 0, selectedRatio.w, selectedRatio.h);
      } else {
        eCtx.fillStyle = '#0a0806';
        eCtx.fillRect(0, 0, selectedRatio.w, selectedRatio.h);
      }

      const CX_OFF = selectedRatio.w / 2;
      const CY_OFF = selectedRatio.h / 2;

      // 3. Draw Vinyl
      eCtx.save();
      eCtx.translate(CX_OFF, CY_OFF);
      const rotationPerMs = (speed / 2.8) * (Math.PI * 2) / 2800;
      eCtx.rotate(simTime * rotationPerMs);
      eCtx.drawImage(vinylStaticCanvas, -210, -210, 420, 420);
      eCtx.restore();

      // 4. Draw Light Show
      // We need a temp canvas for clipping or just translate eCtx
      eCtx.save();
      eCtx.translate(CX_OFF - 210, CY_OFF - 210);
      eCtx.beginPath();
      eCtx.arc(210, 210, 208, 0, Math.PI * 2);
      eCtx.clip();
      renderLightShow(eCtx, activePulses, simTime);
      eCtx.restore();

      // 5. Simulate Flash
      const flashInterval = 12 * beatInterval;
      const isFlashing = (simTime % flashInterval) < 3000;
      if (isFlashing) {
        const flashIndex = Math.floor(simTime / flashInterval) % flashAssets.length;
        const currentAsset = flashAssets[flashIndex];
        
        let assetReady = false;
        if (currentAsset instanceof HTMLImageElement) {
          assetReady = currentAsset.complete;
        } else {
          // Seek video to current flash time
          const flashOffset = (simTime % flashInterval) / 1000;
          currentAsset.currentTime = flashOffset;
          // Wait a tiny bit or just assume it's fast enough
          assetReady = true; 
        }

        if (assetReady) {
          // Add some motion to flash for drama!
          const flashPhase = (simTime % flashInterval) / 3000;
          const scale = flashPhase < 0.2 ? 0.2 + (flashPhase / 0.2) * 0.8 : 1.0;
          const opacity = flashPhase > 0.8 ? 1 - (flashPhase - 0.8) / 0.2 : 1.0;

          eCtx.save();
          eCtx.globalAlpha = opacity;
          eCtx.translate(CX_OFF, CY_OFF);
          eCtx.scale(scale, scale);
          
          eCtx.beginPath();
          eCtx.arc(0, 0, 140, 0, Math.PI * 2);
          eCtx.clip();
          eCtx.drawImage(currentAsset, -140, -140, 280, 280);
          eCtx.restore();

          eCtx.beginPath();
          eCtx.arc(CX_OFF, CY_OFF, 140 * scale, 0, Math.PI * 2);
          eCtx.strokeStyle = '#f0c84a';
          eCtx.lineWidth = 4;
          eCtx.stroke();
        }
      }

      if (i % 60 === 0) await new Promise(r => setTimeout(r, 0));
    }

    mediaRecorder.stop();
    await exportFinished;
    setIsExporting(false);
  };

  return (
    <button 
      onClick={handleExport}
      disabled={isExporting}
      style={{
        background: isExporting ? '#333' : 'transparent',
        border: '1px solid #c83030',
        color: isExporting ? '#888' : '#c83030',
        fontFamily: "'Space Mono', monospace",
        fontSize: 11,
        letterSpacing: '0.15em',
        padding: '8px 20px',
        borderRadius: 2,
        cursor: isExporting ? 'default' : 'pointer',
        textTransform: 'uppercase',
        marginLeft: 8,
        position: 'relative',
        minWidth: 140,
      }}
    >
      {isExporting ? `REC ${progress}%` : '🎥 Export Video'}
    </button>
  );
}
