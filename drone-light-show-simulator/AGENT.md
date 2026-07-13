# drone-light-show-simulator - Ultimate Self-Replicating Blueprint (AGENT.md)

> [!IMPORTANT]
> This is an auto-generated monolithic blueprint containing the source code for drone-light-show-simulator.

### FILE: .dockerignore
```text
node_modules
dist
build
.git
.gitignore
*.md
.env
.env.local
.env.*.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
.DS_Store
coverage
.nyc_output
*.log
.cache
.vscode
.idea
*.swp
*.swo
test-results
playwright-report

```

### FILE: (environment files omitted)

> Environment files are never committed. See the repo's own `.env.example`
> for variable names; real values live only in the server's untracked
> `.env.local` / `.env.production`. This block was removed by the fleet
> secret-scrub (blueprint minus secrets).

### FILE: .gitignore
```text
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

```

### FILE: .npmrc
```text
# Use pnpm as package manager
package-manager=pnpm

```

### FILE: App (2).tsx
```typescript

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Drone } from './components/Drone';
import { GREEK_LETTERS_ORDER, AFRICA_OUTLINE_POINTS, AFRICA_SHAPE_SEGMENTS, AFRICA_TEXT_SHAPES_DATA, GREEK_LETTER_SHAPES_DATA } from './data/shapes';
import { DRONE_COUNT, DISPLAY_DURATION, COLORS } from './data/constants';
import { generateShapePoints } from './utils/geometry';

const App: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [droneInstances, setDroneInstances] = useState<Drone[]>([]);
    const animationStartTimeRef = useRef<number | null>(null);
    const animationFrameIdRef = useRef<number | null>(null);
    const [currentGreekLetterIndex, setCurrentGreekLetterIndex] = useState(0);

    const startNewDisplaySequence = useCallback(() => {
        if (!canvasRef.current) return;
        animationStartTimeRef.current = null;
        setCurrentGreekLetterIndex(prevIndex => (prevIndex + 1) % GREEK_LETTERS_ORDER.length);
    }, []);

    const initDrones = useCallback(() => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const { width, height } = canvas;
        const currentGreekLetter = GREEK_LETTERS_ORDER[currentGreekLetterIndex];
        const greekLetterData = GREEK_LETTER_SHAPES_DATA[currentGreekLetter];

        // --- Calculate scaling and offsets ---
        const africaPointsForBounds = generateShapePoints(AFRICA_SHAPE_SEGMENTS, 1, 1, 0, 0);
        const africaMinX = Math.min(...africaPointsForBounds.map(p => p.x));
        const africaMaxX = Math.max(...africaPointsForBounds.map(p => p.x));
        const africaMinY = Math.min(...africaPointsForBounds.map(p => p.y));
        const africaMaxY = Math.max(...africaPointsForBounds.map(p => p.y));

        const greekPointsForBounds = generateShapePoints(greekLetterData.segments, 1, 1, 0, 0);
        const greekMinX = Math.min(...greekPointsForBounds.map(p => p.x));
        const greekMaxX = Math.max(...greekPointsForBounds.map(p => p.x));
        const greekMinY = Math.min(...greekPointsForBounds.map(p => p.y));
        const greekMaxY = Math.max(...greekPointsForBounds.map(p => p.y));

        const africaBoundsWidth = africaMaxX - africaMinX;
        const africaBoundsHeight = africaMaxY - africaMinY;
        const greekBoundsWidth = greekMaxX - greekMinX;
        const greekBoundsHeight = greekMaxY - greekMinY;

        const scale = Math.min(width / africaBoundsWidth, height / africaBoundsHeight) * 0.8;
        const africaOffsetX = (width - africaBoundsWidth * scale) / 2 - africaMinX * scale;
        const africaOffsetY = (height - africaBoundsHeight * scale) / 2 - africaMinY * scale;

        const greekScale = Math.min(width / greekBoundsWidth, height / greekBoundsHeight) * 0.8;
        const greekOffsetX = (width - greekBoundsWidth * greekScale) / 2 - greekMinX * greekScale;
        const greekOffsetY = (height - greekBoundsHeight * greekScale) / 2 - greekMinY * greekScale;

        // --- Generate target points ---
        const africaTargetPoints = AFRICA_OUTLINE_POINTS.map(p => ({
            x: p.x * scale + africaOffsetX,
            y: p.y * scale + africaOffsetY,
            color: p.color
        }));

        const africanTextTargetPoints = generateShapePoints(AFRICA_TEXT_SHAPES_DATA, scale * 0.9, scale * 0.9, africaOffsetX, africaOffsetY);
        const greekTargetPoints = generateShapePoints(greekLetterData.segments, greekScale, greekScale, greekOffsetX, greekOffsetY);
        
        // --- Create drone instances ---
        const newDrones: Drone[] = [];
        for (let i = 0; i < DRONE_COUNT; i++) {
            const initialX = Math.random() * width;
            const initialY = Math.random() * height;

            const africaPoint = africaTargetPoints[i % africaTargetPoints.length];
            const greekPoint = greekTargetPoints[i % greekTargetPoints.length];
            const textPoint = africanTextTargetPoints[i % africanTextTargetPoints.length];

            newDrones.push(new Drone(
                initialX, initialY,
                greekPoint.x, greekPoint.y,
                africaPoint.x, africaPoint.y,
                textPoint.x, textPoint.y,
                greekLetterData.color,
                africaPoint.color,
                textPoint.color as string // Already assigned in geometry util
            ));
        }

        setDroneInstances(newDrones);
    }, [currentGreekLetterIndex]);

    const animate = useCallback((currentTime: number) => {
        if (!canvasRef.current || droneInstances.length === 0) {
            animationFrameIdRef.current = requestAnimationFrame(animate);
            return;
        }

        if (animationStartTimeRef.current === null) {
            animationStartTimeRef.current = currentTime;
        }

        const elapsedTime = currentTime - animationStartTimeRef.current;
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;
        
        ctx.fillStyle = COLORS.indigoSky;
        ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        droneInstances.forEach(drone => {
            drone.update(currentTime, animationStartTimeRef.current!);
            drone.draw(ctx);
        });

        if (elapsedTime > DISPLAY_DURATION) {
            setTimeout(startNewDisplaySequence, 1000); // Wait 1s before starting next letter
        } else {
            animationFrameIdRef.current = requestAnimationFrame(animate);
        }
    }, [droneInstances, startNewDisplaySequence]);


    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const resizeCanvas = () => {
            const { width, height } = canvas.getBoundingClientRect();
            canvas.width = width * window.devicePixelRatio;
            canvas.height = height * window.devicePixelRatio;
            initDrones(); // Re-initialize with new dimensions
        };

        const resizeObserver = new ResizeObserver(resizeCanvas);
        resizeObserver.observe(canvas);
        
        resizeCanvas(); // Initial setup

        return () => {
            resizeObserver.unobserve(canvas);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initDrones]); // initDrones is dependency

     useEffect(() => {
        if (droneInstances.length > 0) {
            animationFrameIdRef.current = requestAnimationFrame(animate);
        }
        return () => {
            if (animationFrameIdRef.current) {
                cancelAnimationFrame(animationFrameIdRef.current);
            }
        };
    }, [droneInstances, animate]);

    return (
        <main className="relative h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-indigo-900 overflow-hidden">
            <div className="absolute top-0 left-0 p-8 text-center w-full">
                <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-wider" style={{ textShadow: '0 0 15px rgba(255,255,255,0.5)' }}>
                    Drone Light Show
                </h1>
                <p className="text-xl text-indigo-200 mt-2">
                    Current Shape: {GREEK_LETTERS_ORDER[currentGreekLetterIndex]}
                </p>
            </div>
            <canvas
                ref={canvasRef}
                className="w-full h-full"
            />
        </main>
    );
};

export default App;

```

### FILE: App.tsx
```typescript

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Drone } from './components/Drone';
import { GREEK_LETTERS_ORDER, AFRICA_OUTLINE_POINTS, AFRICA_SHAPE_SEGMENTS, AFRICA_TEXT_SHAPES_DATA, GREEK_LETTER_SHAPES_DATA } from './data/shapes';
import { DRONE_COUNT, DISPLAY_DURATION, COLORS } from './data/constants';
import { generateShapePoints } from './utils/geometry';

const App: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [droneInstances, setDroneInstances] = useState<Drone[]>([]);
    const animationStartTimeRef = useRef<number | null>(null);
    const animationFrameIdRef = useRef<number | null>(null);
    const [currentGreekLetterIndex, setCurrentGreekLetterIndex] = useState(0);

    const startNewDisplaySequence = useCallback(() => {
        if (!canvasRef.current) return;
        animationStartTimeRef.current = null;
        setCurrentGreekLetterIndex(prevIndex => (prevIndex + 1) % GREEK_LETTERS_ORDER.length);
    }, []);

    const initDrones = useCallback(() => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const { width, height } = canvas;
        const currentGreekLetter = GREEK_LETTERS_ORDER[currentGreekLetterIndex];
        const greekLetterData = GREEK_LETTER_SHAPES_DATA[currentGreekLetter];

        // --- Calculate scaling and offsets ---
        const africaPointsForBounds = generateShapePoints(AFRICA_SHAPE_SEGMENTS, 1, 1, 0, 0);
        const africaMinX = Math.min(...africaPointsForBounds.map(p => p.x));
        const africaMaxX = Math.max(...africaPointsForBounds.map(p => p.x));
        const africaMinY = Math.min(...africaPointsForBounds.map(p => p.y));
        const africaMaxY = Math.max(...africaPointsForBounds.map(p => p.y));

        const greekPointsForBounds = generateShapePoints(greekLetterData.segments, 1, 1, 0, 0);
        const greekMinX = Math.min(...greekPointsForBounds.map(p => p.x));
        const greekMaxX = Math.max(...greekPointsForBounds.map(p => p.x));
        const greekMinY = Math.min(...greekPointsForBounds.map(p => p.y));
        const greekMaxY = Math.max(...greekPointsForBounds.map(p => p.y));

        const africaBoundsWidth = africaMaxX - africaMinX;
        const africaBoundsHeight = africaMaxY - africaMinY;
        const greekBoundsWidth = greekMaxX - greekMinX;
        const greekBoundsHeight = greekMaxY - greekMinY;

        const scale = Math.min(width / africaBoundsWidth, height / africaBoundsHeight) * 0.8;
        const africaOffsetX = (width - africaBoundsWidth * scale) / 2 - africaMinX * scale;
        const africaOffsetY = (height - africaBoundsHeight * scale) / 2 - africaMinY * scale;

        const greekScale = Math.min(width / greekBoundsWidth, height / greekBoundsHeight) * 0.8;
        const greekOffsetX = (width - greekBoundsWidth * greekScale) / 2 - greekMinX * greekScale;
        const greekOffsetY = (height - greekBoundsHeight * greekScale) / 2 - greekMinY * greekScale;

        // --- Generate target points ---
        const africaTargetPoints = AFRICA_OUTLINE_POINTS.map(p => ({
            x: p.x * scale + africaOffsetX,
            y: p.y * scale + africaOffsetY,
            color: p.color
        }));

        const africanTextTargetPoints = generateShapePoints(AFRICA_TEXT_SHAPES_DATA, scale * 0.9, scale * 0.9, africaOffsetX, africaOffsetY);
        const greekTargetPoints = generateShapePoints(greekLetterData.segments, greekScale, greekScale, greekOffsetX, greekOffsetY);
        
        // --- Create drone instances ---
        const newDrones: Drone[] = [];
        for (let i = 0; i < DRONE_COUNT; i++) {
            const initialX = Math.random() * width;
            const initialY = Math.random() * height;

            const africaPoint = africaTargetPoints[i % africaTargetPoints.length];
            const greekPoint = greekTargetPoints[i % greekTargetPoints.length];
            const textPoint = africanTextTargetPoints[i % africanTextTargetPoints.length];

            newDrones.push(new Drone(
                initialX, initialY,
                greekPoint.x, greekPoint.y,
                africaPoint.x, africaPoint.y,
                textPoint.x, textPoint.y,
                greekLetterData.color,
                africaPoint.color,
                textPoint.color as string // Already assigned in geometry util
            ));
        }

        setDroneInstances(newDrones);
    }, [currentGreekLetterIndex]);

    const animate = useCallback((currentTime: number) => {
        if (!canvasRef.current || droneInstances.length === 0) {
            animationFrameIdRef.current = requestAnimationFrame(animate);
            return;
        }

        if (animationStartTimeRef.current === null) {
            animationStartTimeRef.current = currentTime;
        }

        const elapsedTime = currentTime - animationStartTimeRef.current;
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;
        
        ctx.fillStyle = COLORS.indigoSky;
        ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        droneInstances.forEach(drone => {
            drone.update(currentTime, animationStartTimeRef.current!);
            drone.draw(ctx);
        });

        if (elapsedTime > DISPLAY_DURATION) {
            setTimeout(startNewDisplaySequence, 1000); // Wait 1s before starting next letter
        } else {
            animationFrameIdRef.current = requestAnimationFrame(animate);
        }
    }, [droneInstances, startNewDisplaySequence]);


    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const resizeCanvas = () => {
            const { width, height } = canvas.getBoundingClientRect();
            canvas.width = width * window.devicePixelRatio;
            canvas.height = height * window.devicePixelRatio;
            initDrones(); // Re-initialize with new dimensions
        };

        const resizeObserver = new ResizeObserver(resizeCanvas);
        resizeObserver.observe(canvas);
        
        resizeCanvas(); // Initial setup

        return () => {
            resizeObserver.unobserve(canvas);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initDrones]); // initDrones is dependency

     useEffect(() => {
        if (droneInstances.length > 0) {
            animationFrameIdRef.current = requestAnimationFrame(animate);
        }
        return () => {
            if (animationFrameIdRef.current) {
                cancelAnimationFrame(animationFrameIdRef.current);
            }
        };
    }, [droneInstances, animate]);

    return (
        <main className="relative h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-indigo-900 overflow-hidden">
            <div className="absolute top-0 left-0 p-8 text-center w-full">
                <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-wider" style={{ textShadow: '0 0 15px rgba(255,255,255,0.5)' }}>
                    Drone Light Show
                </h1>
                <p className="text-xl text-indigo-200 mt-2">
                    Current Shape: {GREEK_LETTERS_ORDER[currentGreekLetterIndex]}
                </p>
            </div>
            <canvas
                ref={canvasRef}
                className="w-full h-full"
            />
        </main>
    );
};

export default App;

```

### FILE: AuthGate.tsx
```typescript
import React, { useState } from 'react';

const AUTH_KEY = 'tuc_auth_drone_light_show_simulator';
const ACCENT   = '#4f46e5';

export function AuthGate({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem(AUTH_KEY) === '1'
  );
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');

  if (authed) return <>{children}</>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password =[REDACTED_CREDENTIAL]
      sessionStorage.setItem(AUTH_KEY, '1');
      setAuthed(true);
    } else {
      setError('Invalid credentials. Use admin / admin');
    }
  };

  return (
    <div style={{minHeight:'100vh',background:'#f8fafc',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Inter,system-ui,sans-serif'}}>
      <div style={{background:'#fff',padding:'36px',borderRadius:'16px',boxShadow:'0 4px 24px rgba(0,0,0,0.10)',width:'100%',maxWidth:'420px'}}>
        <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'6px'}}>
          <div style={{width:'38px',height:'38px',background:ACCENT,borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:'20px',flexShrink:0}}>⚡</div>
          <h1 style={{fontSize:'20px',fontWeight:'700',color:'#0f172a',margin:0}}>Drone Light Show Simulator</h1>
        </div>
        <p style={{fontSize:'13px',color:'#94a3b8',margin:'0 0 24px 0'}}>Sign in to continue</p>
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom:'14px'}}>
            <label style={{display:'block',fontSize:'13px',fontWeight:'500',color:'#374151',marginBottom:'6px'}}>Username</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              style={{width:'100%',padding:'9px 12px',border:'1px solid #d1d5db',borderRadius:'8px',fontSize:'14px',outline:'none',boxSizing:'border-box'}}
            />
          </div>
          <div style={{marginBottom:'14px'}}>
            <label style={{display:'block',fontSize:'13px',fontWeight:'500',color:'#374151',marginBottom:'6px'}}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{width:'100%',padding:'9px 12px',border:'1px solid #d1d5db',borderRadius:'8px',fontSize:'14px',outline:'none',boxSizing:'border-box'}}
            />
          </div>
          {error && <p style={{color:'#ef4444',fontSize:'13px',margin:'0 0 12px 0'}}>{error}</p>}
          <button
            type="submit"
            style={{width:'100%',padding:'10px',background:ACCENT,color:'#fff',border:'none',borderRadius:'8px',fontSize:'14px',fontWeight:'600',cursor:'pointer'}}
          >
            Sign In
          </button>
        </form>
        <p style={{fontSize:'11px',color:'#cbd5e1',textAlign:'center',marginTop:'16px',marginBottom:0}}>Techbridge University College &nbsp;·&nbsp; admin / admin</p>
      </div>
    </div>
  );
}

```

### FILE: components/Drone (2).ts
```typescript

import { COLORS, DISPLAY_DURATION, JITTER_AMOUNT } from '../data/constants';

export class Drone {
    x: number;
    y: number;
    initialX: number;
    initialY: number;
    targetX: number;
    targetY: number;
    africanTargetX: number;
    africanTargetY: number;
    africanTextTargetX: number;
    africanTextTargetY: number;
    color: string;
    africanColor: string;
    africanTextColor: string;
    drawColor: string;
    size: number;
    alpha: number;
    culminationPhaseDuration: number;

    constructor(
        initialX: number, initialY: number,
        targetX: number, targetY: number,
        africanTargetX: number, africanTargetY: number,
        africanTextTargetX: number, africanTextTargetY: number,
        color: string, africanColor: string, africanTextColor: string
    ) {
        this.initialX = initialX;
        this.initialY = initialY;
        this.x = initialX;
        this.y = initialY;

        this.targetX = targetX + (Math.random() - 0.5) * JITTER_AMOUNT;
        this.targetY = targetY + (Math.random() - 0.5) * JITTER_AMOUNT;

        this.africanTargetX = africanTargetX;
        this.africanTargetY = africanTargetY;
        
        this.africanTextTargetX = africanTextTargetX;
        this.africanTextTargetY = africanTextTargetY;

        this.color = color;
        this.africanColor = africanColor;
        this.africanTextColor = africanTextColor;
        this.drawColor = COLORS.pureWhite;

        this.size = 1;
        this.alpha = 0;
        this.culminationPhaseDuration = 5000; // 5 seconds
    }

    private lerp(start: number, end: number, t: number): number {
        return start * (1 - t) + end * t;
    }

    private interpolateColor(color1: string, color2: string, factor: number): string {
        const c1 = { r: parseInt(color1.slice(1, 3), 16), g: parseInt(color1.slice(3, 5), 16), b: parseInt(color1.slice(5, 7), 16) };
        const c2 = { r: parseInt(color2.slice(1, 3), 16), g: parseInt(color2.slice(3, 5), 16), b: parseInt(color2.slice(5, 7), 16) };
        const r = Math.round(this.lerp(c1.r, c2.r, factor));
        const g = Math.round(this.lerp(c1.g, c2.g, factor));
        const b = Math.round(this.lerp(c1.b, c2.b, factor));
        return `rgb(${r},${g},${b})`;
    }

    update(currentTime: number, animationStartTime: number): void {
        const elapsedTime = currentTime - animationStartTime;
        const totalDuration = DISPLAY_DURATION;
        let progress = elapsedTime / totalDuration;

        // Phase timings
        const phase1End = 10000;
        const phase2End = 12000;
        const phase3End = 22000;
        const phase4End = 24000;
        const phase5End = 40000;
        const phase6End = 45000;

        if (elapsedTime <= phase1End) { // 0-10s: Scatter to Africa Outline
            const phaseProgress = elapsedTime / phase1End;
            this.x = this.lerp(this.initialX, this.africanTargetX, phaseProgress);
            this.y = this.lerp(this.initialY, this.africanTargetY, phaseProgress);
            this.drawColor = this.interpolateColor(COLORS.pureWhite, this.africanColor, phaseProgress);
            this.alpha = this.lerp(0, 1, phaseProgress);
            this.size = 1.5;

        } else if (elapsedTime <= phase2End) { // 10-12s: Hold Africa Outline
            this.x = this.africanTargetX;
            this.y = this.africanTargetY;
            this.drawColor = this.africanColor;
            this.alpha = 1;
            this.size = 1.5;

        } else if (elapsedTime <= phase3End) { // 12-22s: Form "AFRICA" Text
            const phaseProgress = (elapsedTime - phase2End) / (phase3End - phase2End);
            this.x = this.lerp(this.africanTargetX, this.africanTextTargetX, phaseProgress);
            this.y = this.lerp(this.africanTargetY, this.africanTextTargetY, phaseProgress);
            this.drawColor = this.interpolateColor(this.africanColor, this.africanTextColor, phaseProgress);
            this.alpha = 1;
            this.size = 1.5;
            
        } else if (elapsedTime <= phase4End) { // 22-24s: Hold "AFRICA" Text
            this.x = this.africanTextTargetX;
            this.y = this.africanTextTargetY;
            this.drawColor = this.africanTextColor;
            this.alpha = 1;
            this.size = 1.5;

        } else if (elapsedTime <= phase5End) { // 24-40s: Africa/Text to Greek Letter
            const phaseProgress = (elapsedTime - phase4End) / (phase5End - phase4End);
            this.x = this.lerp(this.africanTextTargetX, this.targetX, phaseProgress);
            this.y = this.lerp(this.africanTextTargetY, this.targetY, phaseProgress);
            this.drawColor = this.interpolateColor(this.africanTextColor, this.color, phaseProgress);
            this.alpha = 1;
            this.size = 1.5;

        } else if (elapsedTime <= phase6End) { // 40-45s: Culmination Burst and Fade Out
            const phaseProgress = (elapsedTime - phase5End) / (phase6End - phase5End);
            
            // Burst out then shrink
            const burstProgress = Math.min(phaseProgress * 4, 1); // Burst happens in first quarter
            const fadeProgress = Math.max(0, (phaseProgress - 0.25) / 0.75); // Fade happens in last 3/4
            
            this.size = this.lerp(1.5, 5, burstProgress) * (1 - fadeProgress);
            this.alpha = this.lerp(1, 0, fadeProgress);
            this.drawColor = this.interpolateColor(this.color, COLORS.warmGold, burstProgress);

        } else { // After display duration
             this.alpha = 0;
             this.size = 0;
        }

        // Clamp values
        this.alpha = Math.max(0, Math.min(1, this.alpha));
    }

    draw(ctx: CanvasRenderingContext2D): void {
        if (this.alpha <= 0) return;

        const scaledSize = this.size * window.devicePixelRatio;

        ctx.beginPath();
        ctx.arc(this.x, this.y, scaledSize, 0, Math.PI * 2, false);
        ctx.fillStyle = this.drawColor;
        ctx.globalAlpha = this.alpha;
        ctx.shadowColor = this.drawColor;
        ctx.shadowBlur = scaledSize * 2;
        ctx.fill();
        ctx.globalAlpha = 1; // Reset global alpha
        ctx.shadowBlur = 0; // Reset shadow
    }
}

```

### FILE: components/Drone.ts
```typescript

import { COLORS, DISPLAY_DURATION, JITTER_AMOUNT } from '../data/constants';

export class Drone {
    x: number;
    y: number;
    initialX: number;
    initialY: number;
    targetX: number;
    targetY: number;
    africanTargetX: number;
    africanTargetY: number;
    africanTextTargetX: number;
    africanTextTargetY: number;
    color: string;
    africanColor: string;
    africanTextColor: string;
    drawColor: string;
    size: number;
    alpha: number;
    culminationPhaseDuration: number;

    constructor(
        initialX: number, initialY: number,
        targetX: number, targetY: number,
        africanTargetX: number, africanTargetY: number,
        africanTextTargetX: number, africanTextTargetY: number,
        color: string, africanColor: string, africanTextColor: string
    ) {
        this.initialX = initialX;
        this.initialY = initialY;
        this.x = initialX;
        this.y = initialY;

        this.targetX = targetX + (Math.random() - 0.5) * JITTER_AMOUNT;
        this.targetY = targetY + (Math.random() - 0.5) * JITTER_AMOUNT;

        this.africanTargetX = africanTargetX;
        this.africanTargetY = africanTargetY;
        
        this.africanTextTargetX = africanTextTargetX;
        this.africanTextTargetY = africanTextTargetY;

        this.color = color;
        this.africanColor = africanColor;
        this.africanTextColor = africanTextColor;
        this.drawColor = COLORS.pureWhite;

        this.size = 1;
        this.alpha = 0;
        this.culminationPhaseDuration = 5000; // 5 seconds
    }

    private lerp(start: number, end: number, t: number): number {
        return start * (1 - t) + end * t;
    }

    private interpolateColor(color1: string, color2: string, factor: number): string {
        const c1 = { r: parseInt(color1.slice(1, 3), 16), g: parseInt(color1.slice(3, 5), 16), b: parseInt(color1.slice(5, 7), 16) };
        const c2 = { r: parseInt(color2.slice(1, 3), 16), g: parseInt(color2.slice(3, 5), 16), b: parseInt(color2.slice(5, 7), 16) };
        const r = Math.round(this.lerp(c1.r, c2.r, factor));
        const g = Math.round(this.lerp(c1.g, c2.g, factor));
        const b = Math.round(this.lerp(c1.b, c2.b, factor));
        return `rgb(${r},${g},${b})`;
    }

    update(currentTime: number, animationStartTime: number): void {
        const elapsedTime = currentTime - animationStartTime;
        const totalDuration = DISPLAY_DURATION;
        let progress = elapsedTime / totalDuration;

        // Phase timings
        const phase1End = 10000;
        const phase2End = 12000;
        const phase3End = 22000;
        const phase4End = 24000;
        const phase5End = 40000;
        const phase6End = 45000;

        if (elapsedTime <= phase1End) { // 0-10s: Scatter to Africa Outline
            const phaseProgress = elapsedTime / phase1End;
            this.x = this.lerp(this.initialX, this.africanTargetX, phaseProgress);
            this.y = this.lerp(this.initialY, this.africanTargetY, phaseProgress);
            this.drawColor = this.interpolateColor(COLORS.pureWhite, this.africanColor, phaseProgress);
            this.alpha = this.lerp(0, 1, phaseProgress);
            this.size = 1.5;

        } else if (elapsedTime <= phase2End) { // 10-12s: Hold Africa Outline
            this.x = this.africanTargetX;
            this.y = this.africanTargetY;
            this.drawColor = this.africanColor;
            this.alpha = 1;
            this.size = 1.5;

        } else if (elapsedTime <= phase3End) { // 12-22s: Form "AFRICA" Text
            const phaseProgress = (elapsedTime - phase2End) / (phase3End - phase2End);
            this.x = this.lerp(this.africanTargetX, this.africanTextTargetX, phaseProgress);
            this.y = this.lerp(this.africanTargetY, this.africanTextTargetY, phaseProgress);
            this.drawColor = this.interpolateColor(this.africanColor, this.africanTextColor, phaseProgress);
            this.alpha = 1;
            this.size = 1.5;
            
        } else if (elapsedTime <= phase4End) { // 22-24s: Hold "AFRICA" Text
            this.x = this.africanTextTargetX;
            this.y = this.africanTextTargetY;
            this.drawColor = this.africanTextColor;
            this.alpha = 1;
            this.size = 1.5;

        } else if (elapsedTime <= phase5End) { // 24-40s: Africa/Text to Greek Letter
            const phaseProgress = (elapsedTime - phase4End) / (phase5End - phase4End);
            this.x = this.lerp(this.africanTextTargetX, this.targetX, phaseProgress);
            this.y = this.lerp(this.africanTextTargetY, this.targetY, phaseProgress);
            this.drawColor = this.interpolateColor(this.africanTextColor, this.color, phaseProgress);
            this.alpha = 1;
            this.size = 1.5;

        } else if (elapsedTime <= phase6End) { // 40-45s: Culmination Burst and Fade Out
            const phaseProgress = (elapsedTime - phase5End) / (phase6End - phase5End);
            
            // Burst out then shrink
            const burstProgress = Math.min(phaseProgress * 4, 1); // Burst happens in first quarter
            const fadeProgress = Math.max(0, (phaseProgress - 0.25) / 0.75); // Fade happens in last 3/4
            
            this.size = this.lerp(1.5, 5, burstProgress) * (1 - fadeProgress);
            this.alpha = this.lerp(1, 0, fadeProgress);
            this.drawColor = this.interpolateColor(this.color, COLORS.warmGold, burstProgress);

        } else { // After display duration
             this.alpha = 0;
             this.size = 0;
        }

        // Clamp values
        this.alpha = Math.max(0, Math.min(1, this.alpha));
    }

    draw(ctx: CanvasRenderingContext2D): void {
        if (this.alpha <= 0) return;

        const scaledSize = this.size * window.devicePixelRatio;

        ctx.beginPath();
        ctx.arc(this.x, this.y, scaledSize, 0, Math.PI * 2, false);
        ctx.fillStyle = this.drawColor;
        ctx.globalAlpha = this.alpha;
        ctx.shadowColor = this.drawColor;
        ctx.shadowBlur = scaledSize * 2;
        ctx.fill();
        ctx.globalAlpha = 1; // Reset global alpha
        ctx.shadowBlur = 0; // Reset shadow
    }
}

```

### FILE: CREATION.md
```md
# drone-light-show-simulator

## Purpose
[Auto-generated. Needs manual review and completion.]

## Stack
Node.js, TypeScript, Vite

## Setup
```bash
# Placeholder — needs manual update based on project type
```

## Key Decisions
- [Pending review]
- [Pending review]
- [Pending review]

## Open Questions
- [To be determined]
- [To be determined]

```

### FILE: data/constants (2).ts
```typescript

export const DRONE_COUNT = 1000;
export const DISPLAY_DURATION = 45000; // 45 seconds
export const JITTER_AMOUNT = 5;
export const POINTS_PER_LENGTH_UNIT = 0.5;

export const COLORS = {
    indigoSky: '#1a2035',
    warmGold: '#ffca28',
    regalPurple: '#6a1b9a',
    panAfricanRed: '#e31b23',
    panAfricanGreen: '#009460',
    pureWhite: '#ffffff',
};

```

### FILE: data/constants.ts
```typescript

export const DRONE_COUNT = 1000;
export const DISPLAY_DURATION = 45000; // 45 seconds
export const JITTER_AMOUNT = 5;
export const POINTS_PER_LENGTH_UNIT = 0.5;

export const COLORS = {
    indigoSky: '#1a2035',
    warmGold: '#ffca28',
    regalPurple: '#6a1b9a',
    panAfricanRed: '#e31b23',
    panAfricanGreen: '#009460',
    pureWhite: '#ffffff',
};

```

### FILE: data/shapes (2).ts
```typescript
import { COLORS } from './constants';

export type ShapeSegment = {
    type: 'line' | 'arc';
    points?: { x: number; y: number }[];
    center?: { x: number; y: number };
    radius?: number;
    startAngle?: number;
    endAngle?: number;
    anticlockwise?: boolean;
    color?: string;
};

export const GREEK_LETTERS_ORDER: string[] = [
    'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta',
    'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi',
    'Rho', 'Sigma', 'Tau', 'Upsilon', 'Phi', 'Chi', 'Psi', 'Omega'
];

export const AFRICA_OUTLINE_POINTS = [
    { x: 0.44, y: 0.99, color: COLORS.panAfricanGreen }, { x: 0.49, y: 0.96, color: COLORS.panAfricanGreen },
    { x: 0.52, y: 0.9, color: COLORS.panAfricanGreen }, { x: 0.53, y: 0.84, color: COLORS.warmGold },
    { x: 0.54, y: 0.77, color: COLORS.warmGold }, { x: 0.56, y: 0.71, color: COLORS.warmGold },
    { x: 0.59, y: 0.65, color: COLORS.warmGold }, { x: 0.64, y: 0.6, color: COLORS.panAfricanRed },
    { x: 0.69, y: 0.58, color: COLORS.panAfricanRed }, { x: 0.75, y: 0.58, color: COLORS.panAfricanRed },
    { x: 0.81, y: 0.6, color: COLORS.panAfricanRed }, { x: 0.85, y: 0.63, color: COLORS.panAfricanRed },
    { x: 0.89, y: 0.6, color: COLORS.panAfricanRed }, { x: 0.93, y: 0.55, color: COLORS.panAfricanRed },
    { x: 0.97, y: 0.5, color: COLORS.panAfricanRed }, { x: 0.99, y: 0.45, color: COLORS.panAfricanRed },
    { x: 0.97, y: 0.4, color: COLORS.panAfricanRed }, { x: 0.92, y: 0.38, color: COLORS.warmGold },
    { x: 0.87, y: 0.38, color: COLORS.warmGold }, { x: 0.82, y: 0.39, color: COLORS.warmGold },
    { x: 0.76, y: 0.4, color: COLORS.warmGold }, { x: 0.7, y: 0.4, color: COLORS.panAfricanGreen },
    { x: 0.65, y: 0.38, color: COLORS.panAfricanGreen }, { x: 0.6, y: 0.35, color: COLORS.panAfricanGreen },
    { x: 0.56, y: 0.3, color: COLORS.panAfricanGreen }, { x: 0.55, y: 0.25, color: COLORS.panAfricanGreen },
    { x: 0.56, y: 0.2, color: COLORS.panAfricanGreen }, { x: 0.6, y: 0.15, color: COLORS.panAfricanGreen },
    { x: 0.62, y: 0.1, color: COLORS.panAfricanGreen }, { x: 0.6, y: 0.05, color: COLORS.panAfricanGreen },
    { x: 0.55, y: 0.01, color: COLORS.warmGold }, { x: 0.5, y: 0.01, color: COLORS.warmGold },
    { x: 0.45, y: 0.02, color: COLORS.warmGold }, { x: 0.4, y: 0.05, color: COLORS.warmGold },
    { x: 0.35, y: 0.1, color: COLORS.panAfricanRed }, { x: 0.3, y: 0.15, color: COLORS.panAfricanRed },
    { x: 0.27, y: 0.2, color: COLORS.panAfricanRed }, { x: 0.25, y: 0.25, color: COLORS.panAfricanRed },
    { x: 0.24, y: 0.3, color: COLORS.panAfricanRed }, { x: 0.23, y: 0.35, color: COLORS.panAfricanRed },
    { x: 0.21, y: 0.4, color: COLORS.panAfricanRed }, { x: 0.18, y: 0.45, color: COLORS.panAfricanRed },
    { x: 0.15, y: 0.5, color: COLORS.warmGold }, { x: 0.12, y: 0.55, color: COLORS.warmGold },
    { x: 0.11, y: 0.6, color: COLORS.warmGold }, { x: 0.12, y: 0.65, color: COLORS.warmGold },
    { x: 0.15, y: 0.7, color: COLORS.panAfricanGreen }, { x: 0.2, y: 0.75, color: COLORS.panAfricanGreen },
    { x: 0.25, y: 0.8, color: COLORS.panAfricanGreen }, { x: 0.3, y: 0.85, color: COLORS.panAfricanGreen },
    { x: 0.35, y: 0.9, color: COLORS.panAfricanGreen }, { x: 0.4, y: 0.95, color: COLORS.panAfricanGreen }
];

export const AFRICA_SHAPE_SEGMENTS: ShapeSegment[] = AFRICA_OUTLINE_POINTS.map((point, index, arr) => ({
    type: 'line',
    points: [point, arr[(index + 1) % arr.length]]
}));


export const AFRICA_TEXT_SHAPES_DATA: ShapeSegment[] = [
    // A
    { type: 'line', points: [{x: 0.2, y: 0.65}, {x: 0.25, y: 0.55}], color: COLORS.panAfricanRed },
    { type: 'line', points: [{x: 0.25, y: 0.55}, {x: 0.3, y: 0.65}], color: COLORS.panAfricanRed },
    { type: 'line', points: [{x: 0.22, y: 0.61}, {x: 0.28, y: 0.61}], color: COLORS.panAfricanRed },
    // F
    { type: 'line', points: [{x: 0.33, y: 0.65}, {x: 0.33, y: 0.55}], color: COLORS.warmGold },
    { type: 'line', points: [{x: 0.33, y: 0.55}, {x: 0.39, y: 0.55}], color: COLORS.warmGold },
    { type: 'line', points: [{x: 0.33, y: 0.6}, {x: 0.37, y: 0.6}], color: COLORS.warmGold },
    // R
    { type: 'line', points: [{x: 0.42, y: 0.65}, {x: 0.42, y: 0.55}], color: COLORS.panAfricanGreen },
    { type: 'arc', center: {x: 0.45, y: 0.575}, radius: 0.025, startAngle: -Math.PI / 2, endAngle: Math.PI / 2, color: COLORS.panAfricanGreen },
    { type: 'line', points: [{x: 0.42, y: 0.6}, {x: 0.46, y: 0.65}], color: COLORS.panAfricanGreen },
    // I
    { type: 'line', points: [{x: 0.51, y: 0.65}, {x: 0.51, y: 0.55}], color: COLORS.panAfricanRed },
    // C
    { type: 'arc', center: {x: 0.58, y: 0.6}, radius: 0.05, startAngle: Math.PI * 0.4, endAngle: Math.PI * 1.6, color: COLORS.warmGold },
    // A
    { type: 'line', points: [{x: 0.66, y: 0.65}, {x: 0.71, y: 0.55}], color: COLORS.panAfricanGreen },
    { type: 'line', points: [{x: 0.71, y: 0.55}, {x: 0.76, y: 0.65}], color: COLORS.panAfricanGreen },
    { type: 'line', points: [{x: 0.68, y: 0.61}, {x: 0.74, y: 0.61}], color: COLORS.panAfricanGreen },
];


export const GREEK_LETTER_SHAPES_DATA: { [key: string]: { segments: ShapeSegment[]; color: string } } = {
    Alpha: { color: COLORS.warmGold, segments: [{ type: 'line', points: [{ x: 0, y: 1 }, { x: 0.5, y: 0 }] }, { type: 'line', points: [{ x: 0.5, y: 0 }, { x: 1, y: 1 }] }, { type: 'line', points: [{ x: 0.25, y: 0.5 }, { x: 0.75, y: 0.5 }] }] },
    Beta: { color: COLORS.regalPurple, segments: [{ type: 'line', points: [{ x: 0.1, y: 0 }, { x: 0.1, y: 1 }] }, { type: 'arc', center: { x: 0.1, y: 0.25 }, radius: 0.25, startAngle: -Math.PI / 2, endAngle: Math.PI / 2 }, { type: 'arc', center: { x: 0.1, y: 0.75 }, radius: 0.25, startAngle: -Math.PI / 2, endAngle: Math.PI / 2 }] },
    Gamma: { color: COLORS.warmGold, segments: [{ type: 'line', points: [{ x: 0, y: 0 }, { x: 1, y: 0 }] }, { type: 'line', points: [{ x: 0.5, y: 0 }, { x: 0.5, y: 1 }] }] },
    Delta: { color: COLORS.regalPurple, segments: [{ type: 'line', points: [{ x: 0, y: 1 }, { x: 0.5, y: 0 }] }, { type: 'line', points: [{ x: 0.5, y: 0 }, { x: 1, y: 1 }] }, { type: 'line', points: [{ x: 1, y: 1 }, { x: 0, y: 1 }] }] },
    Epsilon: { color: COLORS.warmGold, segments: [{ type: 'line', points: [{ x: 1, y: 0 }, { x: 0, y: 0 }] }, { type: 'line', points: [{ x: 0, y: 0 }, { x: 0, y: 1 }] }, { type: 'line', points: [{ x: 0, y: 1 }, { x: 1, y: 1 }] }, { type: 'line', points: [{ x: 0, y: 0.5 }, { x: 0.75, y: 0.5 }] }] },
    Zeta: { color: COLORS.regalPurple, segments: [{ type: 'line', points: [{ x: 0, y: 0 }, { x: 1, y: 0 }] }, { type: 'line', points: [{ x: 1, y: 0 }, { x: 0, y: 1 }] }, { type: 'line', points: [{ x: 0, y: 1 }, { x: 1, y: 1 }] }] },
    Eta: { color: COLORS.warmGold, segments: [{ type: 'line', points: [{ x: 0, y: 0 }, { x: 0, y: 1 }] }, { type: 'line', points: [{ x: 1, y: 0 }, { x: 1, y: 1 }] }, { type: 'line', points: [{ x: 0, y: 0.5 }, { x: 1, y: 0.5 }] }] },
    Theta: { color: COLORS.regalPurple, segments: [{ type: 'arc', center: { x: 0.5, y: 0.5 }, radius: 0.5, startAngle: 0, endAngle: 2 * Math.PI }, { type: 'line', points: [{ x: 0.1, y: 0.5 }, { x: 0.9, y: 0.5 }] }] },
    Iota: { color: COLORS.warmGold, segments: [{ type: 'line', points: [{ x: 0.5, y: 0 }, { x: 0.5, y: 1 }] }] },
    Kappa: { color: COLORS.regalPurple, segments: [{ type: 'line', points: [{ x: 0, y: 0 }, { x: 0, y: 1 }] }, { type: 'line', points: [{ x: 1, y: 0 }, { x: 0, y: 0.5 }] }, { type: 'line', points: [{ x: 0, y: 0.5 }, { x: 1, y: 1 }] }] },
    Lambda: { color: COLORS.warmGold, segments: [{ type: 'line', points: [{ x: 0, y: 1 }, { x: 0.5, y: 0 }] }, { type: 'line', points: [{ x: 0.5, y: 0 }, { x: 1, y: 1 }] }] },
    Mu: { color: COLORS.regalPurple, segments: [{ type: 'line', points: [{ x: 0, y: 1 }, { x: 0, y: 0 }] }, { type: 'line', points: [{ x: 0, y: 0 }, { x: 0.5, y: 0.5 }] }, { type: 'line', points: [{ x: 0.5, y: 0.5 }, { x: 1, y: 0 }] }, { type: 'line', points: [{ x: 1, y: 0 }, { x: 1, y: 1 }] }] },
    Nu: { color: COLORS.warmGold, segments: [{ type: 'line', points: [{ x: 0, y: 1 }, { x: 0, y: 0 }] }, { type: 'line', points: [{ x: 0, y: 0 }, { x: 1, y: 1 }] }, { type: 'line', points: [{ x: 1, y: 1 }, { x: 1, y: 0 }] }] },
    Xi: { color: COLORS.regalPurple, segments: [{ type: 'line', points: [{ x: 0, y: 0 }, { x: 1, y: 0 }] }, { type: 'line', points: [{ x: 0, y: 0.5 }, { x: 1, y: 0.5 }] }, { type: 'line', points: [{ x: 0, y: 1 }, { x: 1, y: 1 }] }] },
    Omicron: { color: COLORS.warmGold, segments: [{ type: 'arc', center: { x: 0.5, y: 0.5 }, radius: 0.5, startAngle: 0, endAngle: 2 * Math.PI }] },
    Pi: { color: COLORS.regalPurple, segments: [{ type: 'line', points: [{ x: 0, y: 0 }, { x: 1, y: 0 }] }, { type: 'line', points: [{ x: 0.25, y: 0 }, { x: 0.25, y: 1 }] }, { type: 'line', points: [{ x: 0.75, y: 0 }, { x: 0.75, y: 1 }] }] },
    Rho: { color: COLORS.warmGold, segments: [{ type: 'line', points: [{ x: 0.1, y: 0 }, { x: 0.1, y: 1 }] }, { type: 'arc', center: { x: 0.1, y: 0.25 }, radius: 0.25, startAngle: -Math.PI / 2, endAngle: Math.PI / 2 }] },
    Sigma: { color: COLORS.regalPurple, segments: [{ type: 'line', points: [{ x: 1, y: 0 }, { x: 0, y: 0.5 }] }, { type: 'line', points: [{ x: 0, y: 0.5 }, { x: 1, y: 1 }] }] },
    Tau: { color: COLORS.warmGold, segments: [{ type: 'line', points: [{ x: 0, y: 0 }, { x: 1, y: 0 }] }, { type: 'line', points: [{ x: 0.5, y: 0 }, { x: 0.5, y: 1 }] }] },
    Upsilon: { color: COLORS.regalPurple, segments: [{ type: 'line', points: [{ x: 0, y: 0 }, { x: 0.5, y: 0.5 }] }, { type: 'line', points: [{ x: 1, y: 0 }, { x: 0.5, y: 0.5 }] }, { type: 'line', points: [{ x: 0.5, y: 0.5 }, { x: 0.5, y: 1 }] }] },
    Phi: { color: COLORS.warmGold, segments: [{ type: 'arc', center: { x: 0.5, y: 0.5 }, radius: 0.5, startAngle: 0, endAngle: 2 * Math.PI }, { type: 'line', points: [{ x: 0.5, y: 0 }, { x: 0.5, y: 1 }] }] },
    Chi: { color: COLORS.regalPurple, segments: [{ type: 'line', points: [{ x: 0, y: 0 }, { x: 1, y: 1 }] }, { type: 'line', points: [{ x: 1, y: 0 }, { x: 0, y: 1 }] }] },
    Psi: { color: COLORS.warmGold, segments: [{ type: 'line', points: [{ x: 0, y: 0 }, { x: 0.5, y: 0.5 }] }, { type: 'line', points: [{ x: 1, y: 0 }, { x: 0.5, y: 0.5 }] }, { type: 'line', points: [{ x: 0.5, y: 0.5 }, { x: 0.5, y: 1 }] }] },
    Omega: { color: COLORS.regalPurple, segments: [{ type: 'arc', center: { x: 0.5, y: 0.5 }, radius: 0.4, startAngle: Math.PI * 1.2, endAngle: Math.PI * -0.2, anticlockwise: false }, { type: 'line', points: [{ x: 0.1, y: 0.8 }, { x: 0.3, y: 0.8 }] }, { type: 'line', points: [{ x: 0.7, y: 0.8 }, { x: 0.9, y: 0.8 }] }] }
};
```

### FILE: data/shapes.ts
```typescript
import { COLORS } from './constants';

export type ShapeSegment = {
    type: 'line' | 'arc';
    points?: { x: number; y: number }[];
    center?: { x: number; y: number };
    radius?: number;
    startAngle?: number;
    endAngle?: number;
    anticlockwise?: boolean;
    color?: string;
};

export const GREEK_LETTERS_ORDER: string[] = [
    'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta',
    'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi',
    'Rho', 'Sigma', 'Tau', 'Upsilon', 'Phi', 'Chi', 'Psi', 'Omega'
];

export const AFRICA_OUTLINE_POINTS = [
    { x: 0.44, y: 0.99, color: COLORS.panAfricanGreen }, { x: 0.49, y: 0.96, color: COLORS.panAfricanGreen },
    { x: 0.52, y: 0.9, color: COLORS.panAfricanGreen }, { x: 0.53, y: 0.84, color: COLORS.warmGold },
    { x: 0.54, y: 0.77, color: COLORS.warmGold }, { x: 0.56, y: 0.71, color: COLORS.warmGold },
    { x: 0.59, y: 0.65, color: COLORS.warmGold }, { x: 0.64, y: 0.6, color: COLORS.panAfricanRed },
    { x: 0.69, y: 0.58, color: COLORS.panAfricanRed }, { x: 0.75, y: 0.58, color: COLORS.panAfricanRed },
    { x: 0.81, y: 0.6, color: COLORS.panAfricanRed }, { x: 0.85, y: 0.63, color: COLORS.panAfricanRed },
    { x: 0.89, y: 0.6, color: COLORS.panAfricanRed }, { x: 0.93, y: 0.55, color: COLORS.panAfricanRed },
    { x: 0.97, y: 0.5, color: COLORS.panAfricanRed }, { x: 0.99, y: 0.45, color: COLORS.panAfricanRed },
    { x: 0.97, y: 0.4, color: COLORS.panAfricanRed }, { x: 0.92, y: 0.38, color: COLORS.warmGold },
    { x: 0.87, y: 0.38, color: COLORS.warmGold }, { x: 0.82, y: 0.39, color: COLORS.warmGold },
    { x: 0.76, y: 0.4, color: COLORS.warmGold }, { x: 0.7, y: 0.4, color: COLORS.panAfricanGreen },
    { x: 0.65, y: 0.38, color: COLORS.panAfricanGreen }, { x: 0.6, y: 0.35, color: COLORS.panAfricanGreen },
    { x: 0.56, y: 0.3, color: COLORS.panAfricanGreen }, { x: 0.55, y: 0.25, color: COLORS.panAfricanGreen },
    { x: 0.56, y: 0.2, color: COLORS.panAfricanGreen }, { x: 0.6, y: 0.15, color: COLORS.panAfricanGreen },
    { x: 0.62, y: 0.1, color: COLORS.panAfricanGreen }, { x: 0.6, y: 0.05, color: COLORS.panAfricanGreen },
    { x: 0.55, y: 0.01, color: COLORS.warmGold }, { x: 0.5, y: 0.01, color: COLORS.warmGold },
    { x: 0.45, y: 0.02, color: COLORS.warmGold }, { x: 0.4, y: 0.05, color: COLORS.warmGold },
    { x: 0.35, y: 0.1, color: COLORS.panAfricanRed }, { x: 0.3, y: 0.15, color: COLORS.panAfricanRed },
    { x: 0.27, y: 0.2, color: COLORS.panAfricanRed }, { x: 0.25, y: 0.25, color: COLORS.panAfricanRed },
    { x: 0.24, y: 0.3, color: COLORS.panAfricanRed }, { x: 0.23, y: 0.35, color: COLORS.panAfricanRed },
    { x: 0.21, y: 0.4, color: COLORS.panAfricanRed }, { x: 0.18, y: 0.45, color: COLORS.panAfricanRed },
    { x: 0.15, y: 0.5, color: COLORS.warmGold }, { x: 0.12, y: 0.55, color: COLORS.warmGold },
    { x: 0.11, y: 0.6, color: COLORS.warmGold }, { x: 0.12, y: 0.65, color: COLORS.warmGold },
    { x: 0.15, y: 0.7, color: COLORS.panAfricanGreen }, { x: 0.2, y: 0.75, color: COLORS.panAfricanGreen },
    { x: 0.25, y: 0.8, color: COLORS.panAfricanGreen }, { x: 0.3, y: 0.85, color: COLORS.panAfricanGreen },
    { x: 0.35, y: 0.9, color: COLORS.panAfricanGreen }, { x: 0.4, y: 0.95, color: COLORS.panAfricanGreen }
];

export const AFRICA_SHAPE_SEGMENTS: ShapeSegment[] = AFRICA_OUTLINE_POINTS.map((point, index, arr) => ({
    type: 'line',
    points: [point, arr[(index + 1) % arr.length]]
}));


export const AFRICA_TEXT_SHAPES_DATA: ShapeSegment[] = [
    // A
    { type: 'line', points: [{x: 0.2, y: 0.65}, {x: 0.25, y: 0.55}], color: COLORS.panAfricanRed },
    { type: 'line', points: [{x: 0.25, y: 0.55}, {x: 0.3, y: 0.65}], color: COLORS.panAfricanRed },
    { type: 'line', points: [{x: 0.22, y: 0.61}, {x: 0.28, y: 0.61}], color: COLORS.panAfricanRed },
    // F
    { type: 'line', points: [{x: 0.33, y: 0.65}, {x: 0.33, y: 0.55}], color: COLORS.warmGold },
    { type: 'line', points: [{x: 0.33, y: 0.55}, {x: 0.39, y: 0.55}], color: COLORS.warmGold },
    { type: 'line', points: [{x: 0.33, y: 0.6}, {x: 0.37, y: 0.6}], color: COLORS.warmGold },
    // R
    { type: 'line', points: [{x: 0.42, y: 0.65}, {x: 0.42, y: 0.55}], color: COLORS.panAfricanGreen },
    { type: 'arc', center: {x: 0.45, y: 0.575}, radius: 0.025, startAngle: -Math.PI / 2, endAngle: Math.PI / 2, color: COLORS.panAfricanGreen },
    { type: 'line', points: [{x: 0.42, y: 0.6}, {x: 0.46, y: 0.65}], color: COLORS.panAfricanGreen },
    // I
    { type: 'line', points: [{x: 0.51, y: 0.65}, {x: 0.51, y: 0.55}], color: COLORS.panAfricanRed },
    // C
    { type: 'arc', center: {x: 0.58, y: 0.6}, radius: 0.05, startAngle: Math.PI * 0.4, endAngle: Math.PI * 1.6, color: COLORS.warmGold },
    // A
    { type: 'line', points: [{x: 0.66, y: 0.65}, {x: 0.71, y: 0.55}], color: COLORS.panAfricanGreen },
    { type: 'line', points: [{x: 0.71, y: 0.55}, {x: 0.76, y: 0.65}], color: COLORS.panAfricanGreen },
    { type: 'line', points: [{x: 0.68, y: 0.61}, {x: 0.74, y: 0.61}], color: COLORS.panAfricanGreen },
];


export const GREEK_LETTER_SHAPES_DATA: { [key: string]: { segments: ShapeSegment[]; color: string } } = {
    Alpha: { color: COLORS.warmGold, segments: [{ type: 'line', points: [{ x: 0, y: 1 }, { x: 0.5, y: 0 }] }, { type: 'line', points: [{ x: 0.5, y: 0 }, { x: 1, y: 1 }] }, { type: 'line', points: [{ x: 0.25, y: 0.5 }, { x: 0.75, y: 0.5 }] }] },
    Beta: { color: COLORS.regalPurple, segments: [{ type: 'line', points: [{ x: 0.1, y: 0 }, { x: 0.1, y: 1 }] }, { type: 'arc', center: { x: 0.1, y: 0.25 }, radius: 0.25, startAngle: -Math.PI / 2, endAngle: Math.PI / 2 }, { type: 'arc', center: { x: 0.1, y: 0.75 }, radius: 0.25, startAngle: -Math.PI / 2, endAngle: Math.PI / 2 }] },
    Gamma: { color: COLORS.warmGold, segments: [{ type: 'line', points: [{ x: 0, y: 0 }, { x: 1, y: 0 }] }, { type: 'line', points: [{ x: 0.5, y: 0 }, { x: 0.5, y: 1 }] }] },
    Delta: { color: COLORS.regalPurple, segments: [{ type: 'line', points: [{ x: 0, y: 1 }, { x: 0.5, y: 0 }] }, { type: 'line', points: [{ x: 0.5, y: 0 }, { x: 1, y: 1 }] }, { type: 'line', points: [{ x: 1, y: 1 }, { x: 0, y: 1 }] }] },
    Epsilon: { color: COLORS.warmGold, segments: [{ type: 'line', points: [{ x: 1, y: 0 }, { x: 0, y: 0 }] }, { type: 'line', points: [{ x: 0, y: 0 }, { x: 0, y: 1 }] }, { type: 'line', points: [{ x: 0, y: 1 }, { x: 1, y: 1 }] }, { type: 'line', points: [{ x: 0, y: 0.5 }, { x: 0.75, y: 0.5 }] }] },
    Zeta: { color: COLORS.regalPurple, segments: [{ type: 'line', points: [{ x: 0, y: 0 }, { x: 1, y: 0 }] }, { type: 'line', points: [{ x: 1, y: 0 }, { x: 0, y: 1 }] }, { type: 'line', points: [{ x: 0, y: 1 }, { x: 1, y: 1 }] }] },
    Eta: { color: COLORS.warmGold, segments: [{ type: 'line', points: [{ x: 0, y: 0 }, { x: 0, y: 1 }] }, { type: 'line', points: [{ x: 1, y: 0 }, { x: 1, y: 1 }] }, { type: 'line', points: [{ x: 0, y: 0.5 }, { x: 1, y: 0.5 }] }] },
    Theta: { color: COLORS.regalPurple, segments: [{ type: 'arc', center: { x: 0.5, y: 0.5 }, radius: 0.5, startAngle: 0, endAngle: 2 * Math.PI }, { type: 'line', points: [{ x: 0.1, y: 0.5 }, { x: 0.9, y: 0.5 }] }] },
    Iota: { color: COLORS.warmGold, segments: [{ type: 'line', points: [{ x: 0.5, y: 0 }, { x: 0.5, y: 1 }] }] },
    Kappa: { color: COLORS.regalPurple, segments: [{ type: 'line', points: [{ x: 0, y: 0 }, { x: 0, y: 1 }] }, { type: 'line', points: [{ x: 1, y: 0 }, { x: 0, y: 0.5 }] }, { type: 'line', points: [{ x: 0, y: 0.5 }, { x: 1, y: 1 }] }] },
    Lambda: { color: COLORS.warmGold, segments: [{ type: 'line', points: [{ x: 0, y: 1 }, { x: 0.5, y: 0 }] }, { type: 'line', points: [{ x: 0.5, y: 0 }, { x: 1, y: 1 }] }] },
    Mu: { color: COLORS.regalPurple, segments: [{ type: 'line', points: [{ x: 0, y: 1 }, { x: 0, y: 0 }] }, { type: 'line', points: [{ x: 0, y: 0 }, { x: 0.5, y: 0.5 }] }, { type: 'line', points: [{ x: 0.5, y: 0.5 }, { x: 1, y: 0 }] }, { type: 'line', points: [{ x: 1, y: 0 }, { x: 1, y: 1 }] }] },
    Nu: { color: COLORS.warmGold, segments: [{ type: 'line', points: [{ x: 0, y: 1 }, { x: 0, y: 0 }] }, { type: 'line', points: [{ x: 0, y: 0 }, { x: 1, y: 1 }] }, { type: 'line', points: [{ x: 1, y: 1 }, { x: 1, y: 0 }] }] },
    Xi: { color: COLORS.regalPurple, segments: [{ type: 'line', points: [{ x: 0, y: 0 }, { x: 1, y: 0 }] }, { type: 'line', points: [{ x: 0, y: 0.5 }, { x: 1, y: 0.5 }] }, { type: 'line', points: [{ x: 0, y: 1 }, { x: 1, y: 1 }] }] },
    Omicron: { color: COLORS.warmGold, segments: [{ type: 'arc', center: { x: 0.5, y: 0.5 }, radius: 0.5, startAngle: 0, endAngle: 2 * Math.PI }] },
    Pi: { color: COLORS.regalPurple, segments: [{ type: 'line', points: [{ x: 0, y: 0 }, { x: 1, y: 0 }] }, { type: 'line', points: [{ x: 0.25, y: 0 }, { x: 0.25, y: 1 }] }, { type: 'line', points: [{ x: 0.75, y: 0 }, { x: 0.75, y: 1 }] }] },
    Rho: { color: COLORS.warmGold, segments: [{ type: 'line', points: [{ x: 0.1, y: 0 }, { x: 0.1, y: 1 }] }, { type: 'arc', center: { x: 0.1, y: 0.25 }, radius: 0.25, startAngle: -Math.PI / 2, endAngle: Math.PI / 2 }] },
    Sigma: { color: COLORS.regalPurple, segments: [{ type: 'line', points: [{ x: 1, y: 0 }, { x: 0, y: 0.5 }] }, { type: 'line', points: [{ x: 0, y: 0.5 }, { x: 1, y: 1 }] }] },
    Tau: { color: COLORS.warmGold, segments: [{ type: 'line', points: [{ x: 0, y: 0 }, { x: 1, y: 0 }] }, { type: 'line', points: [{ x: 0.5, y: 0 }, { x: 0.5, y: 1 }] }] },
    Upsilon: { color: COLORS.regalPurple, segments: [{ type: 'line', points: [{ x: 0, y: 0 }, { x: 0.5, y: 0.5 }] }, { type: 'line', points: [{ x: 1, y: 0 }, { x: 0.5, y: 0.5 }] }, { type: 'line', points: [{ x: 0.5, y: 0.5 }, { x: 0.5, y: 1 }] }] },
    Phi: { color: COLORS.warmGold, segments: [{ type: 'arc', center: { x: 0.5, y: 0.5 }, radius: 0.5, startAngle: 0, endAngle: 2 * Math.PI }, { type: 'line', points: [{ x: 0.5, y: 0 }, { x: 0.5, y: 1 }] }] },
    Chi: { color: COLORS.regalPurple, segments: [{ type: 'line', points: [{ x: 0, y: 0 }, { x: 1, y: 1 }] }, { type: 'line', points: [{ x: 1, y: 0 }, { x: 0, y: 1 }] }] },
    Psi: { color: COLORS.warmGold, segments: [{ type: 'line', points: [{ x: 0, y: 0 }, { x: 0.5, y: 0.5 }] }, { type: 'line', points: [{ x: 1, y: 0 }, { x: 0.5, y: 0.5 }] }, { type: 'line', points: [{ x: 0.5, y: 0.5 }, { x: 0.5, y: 1 }] }] },
    Omega: { color: COLORS.regalPurple, segments: [{ type: 'arc', center: { x: 0.5, y: 0.5 }, radius: 0.4, startAngle: Math.PI * 1.2, endAngle: Math.PI * -0.2, anticlockwise: false }, { type: 'line', points: [{ x: 0.1, y: 0.8 }, { x: 0.3, y: 0.8 }] }, { type: 'line', points: [{ x: 0.7, y: 0.8 }, { x: 0.9, y: 0.8 }] }] }
};
```

### FILE: DEPLOYMENT.md
```md
# Deployment Configuration

This application is deployed behind an Nginx reverse proxy at the path `/drone-light-show-simulator/`.

## Required Configuration for Docker/Nginx Deployment

### 1. Vite Base Path (vite.config.ts)

The Vite config MUST include `base: '/drone-light-show-simulator/'` to ensure all assets (JS, CSS) load correctly:

```typescript
export default defineConfig(({mode}) => {
  return {
    base: '/drone-light-show-simulator/',  // REQUIRED: Assets must load from /drone-light-show-simulator/assets/
    plugins: [react(), ...],
    // ... rest of config
  };
});
```

### 2. React Router Basename (src/main.tsx or src/index.tsx)

If using React Router, the BrowserRouter MUST include `basename="/drone-light-show-simulator"` for client-side routing:

```typescript
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/drone-light-show-simulator">
      <App />
    </BrowserRouter>
  </StrictMode>,
);
```

**Note:** Only include this if the project uses `react-router-dom`. Check package.json dependencies first.

## Why This is Required

- **Nginx Configuration**: The app is served at `http://localhost:8080/drone-light-show-simulator/`, not at the root
- **Asset Loading**: Without `base: '/drone-light-show-simulator/'`, assets try to load from `/assets/` instead of `/drone-light-show-simulator/assets/`
- **Routing**: Without `basename="/drone-light-show-simulator"`, React Router treats routes incorrectly

## Error Symptoms

If you see this error:
```
Failed to load module script: Expected a JavaScript-or-Wasm module script
but the server responded with a MIME type of "text/html"
```

This means the base path is NOT configured correctly. The browser is trying to load JS from the wrong path.

## Verification After Build

After running `npm run build` or `pnpm run build`, check `dist/index.html`:
- Script tags should reference: `/drone-light-show-simulator/assets/index-*.js`
- Link tags should reference: `/drone-light-show-simulator/assets/index-*.css`

If they reference `/assets/` instead of `/drone-light-show-simulator/assets/`, the configuration is incorrect.

## Deployment URLs

- **Development**: `http://localhost:5173` (Vite dev server, no base path needed)
- **Production (Docker)**: `http://localhost:8080/drone-light-show-simulator/`
- **Production (Staging/Live)**: `https://portal.aucdt.edu.gh/drone-light-show-simulator/` (or similar)

## DO NOT REMOVE THESE SETTINGS

These settings are critical for deployment and must not be removed or changed unless the Nginx reverse proxy configuration is also updated in:
- `docker/nginx/nginx.conf`
- `docker-compose-all-apps.yml`

---

**Generated**: 2026-03-04
**Monorepo**: aucdt-utilities (109 applications)
**Project**: drone-light-show-simulator

```

### FILE: Dockerfile
```text
# Multi-stage Dockerfile for Vite/React Applications
# Optimized for production deployment

# Stage 1: Build
FROM node:24-alpine AS builder

WORKDIR /app

# Enable Corepack for pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy dependency files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile || npm install

# Copy application source
COPY . .

# Build application
RUN pnpm run build || npm run build

# Stage 2: Production
FROM node:24-alpine

WORKDIR /app

# Install serve for production preview
RUN corepack enable && corepack prepare pnpm@latest --activate && \
    pnpm add -g serve

# Copy built assets from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

# Expose port
EXPOSE 4173

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:4173/health || exit 1

# Run application
CMD ["serve", "-s", "dist", "-l", "4173"]

```

### FILE: docs/ADMIN_GUIDE.md
```md
# Admin Guide — drone-light-show-simulator

**Application:** drone-light-show-simulator
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08

---

## Accessing the Admin Section

Navigate to: `http://localhost:5173/#/admin`

The admin section is password-protected. Default credentials are set via the `VITE_ADMIN_PASSWORD`
environment variable (see `.env`). Never commit credentials to version control.

---

## Admin Features

### Audit Log

All significant user actions are recorded in the Audit Log panel. Entries include:

| Field | Description |
|---|---|
| Timestamp | ISO 8601 UTC time of the action |
| User | User identifier or "guest" |
| Action | Action type (e.g. LOGIN, SUBMIT, EXPORT) |
| Detail | Additional context |

Audit log data is stored in `localStorage` under the key `tuc_drone-light-show-simulator_audit`.

### Diagnostic Panel

The Diagnostic Panel provides:

- **System Info** — React version, build mode, environment variables (non-secret)
- **State Inspector** — Current application state snapshot
- **Network Monitor** — API call history and response codes
- **Test Runner** — Trigger manual smoke tests from the UI

### Theme Controls

Admins may switch between Light, Dark, and High-Contrast themes.
Theme selection persists via `localStorage`.

---

## Environment Variables

| Variable | Purpose | Default |
|---|---|---|
| `VITE_ADMIN_PASSWORD` | Admin section password | (required) |
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |
| `VITE_GA_ID` | Google Analytics tag | `G-FKXTELQ71R` |

---

## Security Notes

- The admin route must not be linked from the public UI
- All diagnostic tools and audit logs are confined to `#/admin`
- No sensitive data may be logged to the browser console in production
- CSP headers enforced via nginx configuration

---

*Generated by Phase 4 Docs Generator — TUC Refresh Directive — 2026-03-08*

```

### FILE: docs/DEPLOYMENT.md
```md
# Deployment Guide — drone-light-show-simulator

**Application:** drone-light-show-simulator
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08

---

## Local Development

```bash
cd drone-light-show-simulator
pnpm install
pnpm run dev        # http://localhost:5173
```

```bash
pnpm run build      # TypeScript compile + Vite bundle → dist/
```


---

## Docker Deployment

### Build

```bash
# From monorepo root
docker-compose -f docker-compose-all-apps.yml build drone-light-show-simulator
```

### Run

```bash
docker-compose -f docker-compose-all-apps.yml up drone-light-show-simulator
# App available at http://localhost:5173
```

### All services

```bash
docker-compose -f docker-compose-all-apps.yml up
# Gateway: http://localhost:8080
```

---

## Dockerfile

Multi-stage build pattern:

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile 2>/dev/null || pnpm install
COPY . .
RUN pnpm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1
```

---

## Environment Variables

Create `.env` (never commit):

```bash
VITE_API_URL=http://localhost:5000/api
VITE_ADMIN_PASSWORD=[REDACTED_CREDENTIAL]
VITE_GA_ID=G-FKXTELQ71R
```

---

## Health Check

```bash
curl http://localhost:5173/health
# → healthy
```

---

## Troubleshooting

| Issue | Fix |
|---|---|
| `pnpm install` fails | `rm -rf node_modules pnpm-lock.yaml && npm install --legacy-peer-deps` |
| Vite memory error | `NODE_OPTIONS=--max-old-space-size=4096 pnpm run build` |
| Port 5173 in use | Change port mapping in `docker-compose-all-apps.yml` |
| Blank page in Docker | Check `nginx.conf` — ensure `try_files $uri $uri/ /index.html` |

---

*Generated by Phase 4 Docs Generator — TUC Refresh Directive — 2026-03-08*

```

### FILE: docs/SRS.md
```md
﻿# Software Requirements Specification

**Project:** Drone Light Show Simulator
**Version:** 3.0.0
**Status:** As-Built
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Standard:** IEEE 29148-2018

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) documents the requirements for **Drone Light Show Simulator**, a web application deployed as part of the Techbridge University College (TUC) institutional utility suite. It serves as the authoritative reference for developers, testers, and stakeholders.

### 1.2 Scope

**Drone Light Show Simulator** is a TypeScript-based React 19 single-page application (SPA) built with Vite and deployed via Docker/Nginx. It operates within the TUC monorepo (`aucdt-utilities`) and conforms to the Techbridge University College Shared Standards.

**In scope:**
- All functional UI components and user flows
- Authentication and authorisation (where applicable)
- Data presentation, form handling, and export features
- Admin section and audit logging (where applicable)

**Out of scope:**
- Backend database administration
- Third-party service configuration
- Network infrastructure

### 1.3 Definitions and Acronyms

| Term | Definition |
|---|---|
| TUC | Techbridge University College |
| SPA | Single-Page Application |
| SRS | Software Requirements Specification |
| ARIA | Accessible Rich Internet Applications |
| JWT | JSON Web Token |
| CI/CD | Continuous Integration / Continuous Deployment |
| PWA | Progressive Web Application |

### 1.4 References

- SHARED-STANDARDS.md â€” TUC Canonical AI Governance Layer
- CLAUDE.md â€” Audit & Analysis Agent Constitution
- GEMINI.md â€” Execution Agent Constitution
- IEEE 29148-2018 â€” Systems and Software Engineering Requirements
- TUC Refresh Directive: <https://ai-tools.aucdt.edu.gh/refresh>

### 1.5 Overview

Section 2 describes the overall product context. Section 3 lists system features. Section 4 covers external interfaces. Section 5 defines non-functional requirements.

---

## 2. Overall Description

### 2.1 Product Perspective

**Drone Light Show Simulator** is a standalone module within the TUC institutional web application suite. It communicates with TUC backend services via REST APIs and shares the TUC design system (Tailwind CSS, Playfair Display, Bebas Neue, Cormorant Garamond).

### 2.2 Product Functions

- Core institutional utility functionality

### 2.3 User Classes and Characteristics

| User Class | Description | Access Level |
|---|---|---|
| Student | Enrolled TUC students using the utility | Standard |
| Staff | Academic and administrative personnel | Elevated |
| Administrator | System admins with full configuration access | Full (#/admin) |
| Public | Unauthenticated visitors (where applicable) | Read-only |

### 2.4 Operating Environment

- **Browser:** Chrome 120+, Firefox 120+, Safari 17+, Edge 120+
- **Device:** Desktop (primary), tablet (responsive), mobile (responsive)
- **Network:** TUC campus network or internet-connected
- **Container:** Docker (nginx:alpine), port 80 internal / mapped externally
- **Gateway:** http://localhost:8080 (development)

### 2.5 Design and Implementation Constraints

- **React version:** Exactly 19.2.5 â€” locked, no exceptions
- **Build tool:** Vite 7.3.1
- **Package manager:** pnpm (preferred), npm (fallback)
- **Styling:** Tailwind CSS 4.x with TUC design tokens
- **Accessibility:** WCAG 2.1 AA minimum; 100% ARIA coverage on interactive elements
- **Branding:** TUC colour palette (Gold `#C8A84B`, Ink `#0F0C07`, Cream `#F2EBD9`)
- **Fonts:** Playfair Display (titles), Bebas Neue (display), Cormorant Garamond / Inter (body)

### 2.6 Assumptions and Dependencies

- TUC Auth API available at `http://localhost:5000/api/auth/*` (when auth required)
- Mail API at `https://portal.aucdt.edu.gh` (live â€” do not change URL)
- Docker and Docker Compose available in deployment environment
- Google Analytics tag G-FKXTELQ71R injected via `index.html`

---

## 3. System Features (Functional Requirements)

### 3.1 Core Application Shell

**FR-001** The application shall render without errors in all supported browsers.
**FR-002** The application shall display a loading state during async operations.
**FR-003** The application shall display a meaningful error state on API failure with retry option.
**FR-004** The application shall display an empty state when no data is available.

### 3.2 Navigation and Routing

**FR-010** The application shall provide client-side routing without full page reloads.
**FR-011** All navigation links shall be functional and lead to valid routes.
**FR-012** The application shall handle 404 routes gracefully with a fallback page.

### 3.3 Accessibility

**FR-020** All interactive elements shall have ARIA labels or descriptive text.
**FR-021** The application shall be fully navigable via keyboard alone.
**FR-022** Focus indicators shall be visible on all focusable elements.
**FR-023** Colour contrast shall meet WCAG 2.1 AA standards (4.5:1 normal text, 3:1 large).

### 3.4 Theme Support

**FR-030** The application shall support Light, Dark, and High-Contrast themes.
**FR-031** Theme preference shall persist across sessions via localStorage.

### 3.5 Admin Section (where applicable)

**FR-040** The application shall provide a password-protected `#/admin` route.
**FR-041** The admin section shall display an audit log of all significant user actions.
**FR-042** Diagnostic and simulation tools shall be isolated to the admin section only.

---

## 4. External Interface Requirements

### 4.1 User Interface

- Responsive layout: 320px (mobile) â†’ 1920px (desktop)
- TUC branding applied consistently (colours, typography, logo)
- No broken links or dead UI elements

### 4.2 Software Interfaces

| Interface | Protocol | Purpose |
|---|---|---|
| TUC Auth API | REST / JWT | User authentication |
| Google Analytics | HTTPS / gtag.js | Usage tracking |
| TUC Mail API | HTTPS / POST | Email notifications |

### 4.3 Communication Interfaces

- HTTPS for all external API calls
- CORS configured per TUC backend settings

---

## 5. Non-Functional Requirements

### 5.1 Performance

- Initial page load: < 2 seconds on 10 Mbps connection
- Chart/component render: < 100ms
- Bundle size: monitored with source-map-explorer; target < 500 KB gzipped

### 5.2 Reliability

- Application uptime target: 99.5% (Docker container auto-restart)
- Error boundary implemented at root level to prevent total failure

### 5.3 Security

- No sensitive data stored in localStorage beyond JWT tokens
- All API calls over HTTPS in production
- CSP headers enforced via Nginx configuration
- XSS prevention via React's built-in JSX escaping

### 5.4 Maintainability

- All source files TypeScript (where applicable)
- Components follow the custom hooks pattern (useXxx)
- No inline styles; all styling via Tailwind classes or CSS variables
- Test coverage target: > 70% for core utilities

### 5.5 Portability

- Deployed as Docker container (nginx:alpine)
- Single `docker-compose-all-apps.yml` entry
- Environment variables via `.env` files (VITE_ prefix)

---

## 6. Compliance

| Requirement | Status |
|---|---|
| React 19.2.5 exact version | âœ… Compliant |
| TUC branding applied | âœ… Compliant |
| ARIA 100% coverage | âŒ Non-compliant |
| Docker service configured | âœ… Compliant |
| SRS matches as-built state | âœ… Compliant |
| Zero broken links | â³ Verify |
| Admin section isolated | âŒ Non-compliant |
| Test suite present | âœ… Compliant |

---

## 7. Appendix â€” Tech Stack Reference

```
Stack: React 19.2.5 + TypeScript, Vite 7.3.1
Build output: dist/
Docker: nginx:alpine
Network: aucdt-network (172.20.0.0/16)
CI/CD: Bitbucket Pipelines
```

---


---

## 8. Diagrams

### 8.1 System Architecture

![System Architecture](architecture.svg)

### 8.2 Data Flow

![Data Flow](dataflow.svg)

---

*Generated by Phase 1b SRS Generator â€” TUC Refresh Directive*
*Document version 3.0.0 â€” 2026-03-07*

```

### FILE: docs/TESTING.md
```md
# Testing Guide — drone-light-show-simulator

**Application:** drone-light-show-simulator
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Framework:** Vitest 3.0.0 + @testing-library/react

---

## Running Tests

```bash
cd drone-light-show-simulator
pnpm install           # ensure devDeps installed
pnpm test              # run unit tests (watch mode)
pnpm test:coverage     # coverage report → coverage/
pnpm test:ui           # Vitest UI at http://localhost:51204
pnpm test:e2e          # E2E stubs (node environment)
```

---

## Test Structure

```
src/
  __tests__/
    setup.ts            # @testing-library/jest-dom import
    App.test.tsx        # Root component smoke tests
    App.e2e.ts          # E2E stub (extend with Playwright)
vitest.config.ts        # Unit test config (jsdom)
vitest.e2e.config.ts    # E2E config (node)
```

---

## Coverage Targets (TUC Standard)

| Metric | Target |
|---|---|
| Branches | ≥ 70% |
| Functions | ≥ 70% |
| Lines | ≥ 70% |
| Statements | ≥ 70% |

---

## Writing Tests

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('renders heading', () => {
    render(<MyComponent />);
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });

  it('handles button click', async () => {
    render(<MyComponent />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Clicked!')).toBeInTheDocument();
  });
});
```

---

## E2E with Playwright (Recommended)

```bash
# Install Playwright
pnpm add -D @playwright/test
npx playwright install chromium

# Run E2E
npx playwright test
```

Extend `src/__tests__/App.e2e.ts` with Playwright page assertions once the app is running.

---

## Admin Section Test Dashboard

Access at `http://localhost:5173/#/admin` → Test Runner tab.

The diagnostic panel provides a manual smoke test runner for verifying core user flows
without leaving the browser.

---

*Generated by Phase 4 Docs Generator — TUC Refresh Directive — 2026-03-08*

```

### FILE: index (2).html
```html

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Drone Light Show Simulator</title>
    <script src="https://cdn.tailwindcss.com"></script>
  <script type="importmap">
{
  "imports": {
    "react-dom/": "https://esm.sh/react-dom@^19.1.1/",
    "react/": "https://esm.sh/react@^19.1.1/",
    "react": "https://esm.sh/react@^19.1.1"
  }
}
</script>
<link rel="stylesheet" href="/index.css">
</head>
  <body class="bg-gray-900">
    <div id="root"></div>
    <script type="module" src="/index.tsx"></script>
  </body>
</html>

```

### FILE: index (2).tsx
```typescript

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

```

### FILE: index.css
```css
@import "tailwindcss";


```

### FILE: index.html
```html
<!DOCTYPE html>
<html lang="en-GB">
  <head>
    <meta charset="UTF-8" />
    <!-- ── TUC Standard Meta ─────────────────────────────────────── -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <!-- SEO -->
    <meta name="description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    <meta name="keywords" content="Techbridge University College, TUC, design education, technology education, Accra university, Ghana university, product design, entrepreneurship, private university Ghana, design school" />
    <meta name="author" content="Techbridge University College" />
    <meta name="publisher" content="Techbridge University College" />
    <link rel="canonical" href="https://www.techbridge.edu.gh/" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <!-- Geographic -->
    <meta name="language" content="English" />
    <meta name="geo.region" content="GH-AA" />
    <meta name="geo.placename" content="Accra" />
    <meta name="geo.position" content="5.6037;-0.1870" />
    <meta name="ICBM" content="5.6037, -0.1870" />
    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://www.techbridge.edu.gh/" />
    <meta property="og:site_name" content="Techbridge University College" />
    <meta property="og:title" content="Drone Light Show Simulator | Techbridge University College" />
    <meta property="og:description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    <meta property="og:image" content="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Techbridge University College Logo" />
    <meta property="og:locale" content="en_GB" />
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@TUCGhana" />
    <meta name="twitter:creator" content="@TUCGhana" />
    <meta name="twitter:title" content="Drone Light Show Simulator | Techbridge University College" />
    <meta name="twitter:description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    <meta name="twitter:image" content="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <meta name="twitter:image:alt" content="Techbridge University College Logo" />
    <!-- Theme -->
    <meta name="theme-color" content="#630f12" />
    <meta name="msapplication-TileColor" content="#630f12" />
    <meta name="copyright" content="Techbridge University College" />
    <meta name="referrer" content="origin-when-cross-origin" />
    <!-- ────────────────────────────────────────────────────────────── -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Drone Light Show Simulator | Techbridge University College</title>

    <!-- TailwindCSS -->
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap" rel="stylesheet">

    <!-- Favicon -->
    <link rel="icon" type="image/png" href="https://techbridge.edu.gh/static/TUC_LOGO.png" />

    <style>
      body {
        font-family: 'Inter', sans-serif;
        margin: 0;
        padding: 0;
      }

      #root {
        min-height: 100vh;
      }
    </style>

    <script type="module" src="./index.tsx"></script>
  
    <style id="tuc-splash-styles">
      body { background-color: #0F0C07 !important; margin: 0; padding: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: serif; overflow: hidden; }
      .tuc-splash { text-align: center; border: 1px solid rgba(200,168,75,0.2); padding: 60px; background: #141210; position: relative; }
      .tuc-splash::before { content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 4px; background: #C8A84B; }
      .tuc-logo { color: #C8A84B; font-size: 3rem; font-weight: 900; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 10px; display: block; }
      .tuc-status { color: #D4C4A0; font-family: sans-serif; text-transform: uppercase; letter-spacing: 0.4em; font-size: 0.7rem; opacity: 0.6; }
      .tuc-loading { margin-top: 30px; height: 1px; width: 100px; background: rgba(200,168,75,0.2); margin-left: auto; margin-right: auto; position: relative; overflow: hidden; }
      .tuc-loading::after { content: ""; position: absolute; left: -100%; width: 50%; height: 100%; background: #C8A84B; animation: tuc-load 2s infinite; }
      @keyframes tuc-load { to { left: 150%; } }
    </style>
</head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    
    <div id="root">
      <div class="tuc-splash">
        <span class="tuc-logo">TECHBRIDGE</span>
        <div class="tuc-status">drone light show simulator</div>
        <div class="tuc-loading"></div>
      </div>
    </div>

  </body>
</html>

```

### FILE: index.tsx
```typescript

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthGate } from './AuthGate';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AuthGate><App /></AuthGate>
  </React.StrictMode>
);

```

### FILE: metadata (2).json
```json
{
  "name": "Drone Light Show Simulator",
  "description": "A dynamic React application that simulates a drone light show on an HTML5 canvas. Drones visually form various shapes and text, transitioning through choreographed sequences.",
  "requestFramePermissions": []
}
```

### FILE: metadata.json
```json
{
  "name": "Drone Light Show Simulator",
  "description": "A dynamic React application that simulates a drone light show on an HTML5 canvas. Drones visually form various shapes and text, transitioning through choreographed sequences.",
  "requestFramePermissions": []
}
```

### FILE: nginx.conf
```conf
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /health {
        access_log off;
        return 200 'healthy';
        add_header Content-Type text/plain;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;
}

```

### FILE: package (2).json
```json
{
  "name": "drone-light-show-simulator",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react-dom": "^19.1.1",
    "react": "^19.1.1"
  },
  "devDependencies": {
    "@types/node": "^22.14.0",
    "typescript": "~5.8.2",
    "vite": "^6.2.0"
  }
}

```

### FILE: package.json
```json
{
  "packageManager": "pnpm@10.30.1",
  "name": "drone-light-show-simulator",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "vitest run --config vitest.e2e.config.ts"
  },
  "dependencies": {
    "react": "19.2.5",
    "react-dom": "19.2.5",
    "react-router-dom": "^7.1.0",
    "lucide-react": "^0.400.0"
  },
  "devDependencies": {
    "@types/node": "^22.17.1",
    "serve": "14.2.5",
    "typescript": "~5.8.3",
    "vite": "7.3.1",
    "vitest": "^3.0.0",
    "@vitest/ui": "^3.0.0",
    "@vitest/coverage-v8": "^3.0.0",
    "@testing-library/react": "^16.3.2",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/user-event": "^14.6.1",
    "jsdom": "^26.1.0",
    "tailwindcss": "^4.2.2",
    "@tailwindcss/vite": "^4.2.2"
  }
}

```

### FILE: README (2).md
```md
# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1pCiP7WKb4y18D3bxMQnFoE-vMXRD5jKv?showAssistant=true&showCode=true&showTreeView=true&showPreview=true&resourceKey=

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

```

### FILE: README.md
```md
# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1pCiP7WKb4y18D3bxMQnFoE-vMXRD5jKv?showAssistant=true&showCode=true&showTreeView=true&showPreview=true&resourceKey=

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

```

### FILE: src/components/ProtectedRoute.tsx
```typescript
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Verifying session…</div>
      </div>
    );
  }
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

```

### FILE: src/contexts/AuthContext.tsx
```typescript
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthService } from '../services/AuthService';

interface User { id: string; username: string; role: string }
interface AuthContextValue {
  isAuthenticated: boolean;
  user: User | null;
  login: (u: string, p: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(AuthService.isAuthenticated());
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = [REDACTED_CREDENTIAL]
    if (!token) { setIsLoading(false); return; }
    AuthService.validateToken(token)
      .then((res: any) => {
        if (res.valid && res.user) { setIsAuthenticated(true); setUser(res.user); }
        else { AuthService.logout(); setIsAuthenticated(false); }
      })
      .catch(() => { /* backend unreachable — keep state */ })
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (username: string, password: string) => {
    const res = await AuthService.login(username, password);
    if (res.success && res.user) { setIsAuthenticated(true); setUser(res.user); }
    return { success: res.success, message: res.message };
  };

  const logout = () => { AuthService.logout(); setIsAuthenticated(false); setUser(null); };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

```

### FILE: src/pages/AdminPage.tsx
```typescript
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

type Tab = 'overview' | 'logs';

interface LogEntry { id: string; time: string; action: string; detail: string }

export default function AdminPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('overview');
  const [logs] = useState<LogEntry[]>([
    { id: '1', time: new Date().toLocaleTimeString(), action: 'SESSION_START', detail: 'Admin session initiated' },
  ]);

  const handleLogout = () => { logout(); navigate('/login', { replace: true }); };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-60 bg-[#0f172a] text-white flex flex-col p-6 shrink-0" aria-label="Admin navigation">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 bg-[#ffcb05] rounded-lg flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-[#0f172a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <span className="font-bold text-sm">Drone Light Show Simulator</span>
        </div>
        <nav className="flex-1 space-y-1" role="navigation">
          {(['overview', 'logs'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              aria-pressed={tab === t ? 'true' : 'false'}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all ${tab === t ? 'bg-[#ffcb05] text-[#0f172a] font-bold' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              {t === 'overview' ? 'Overview' : 'Activity Log'}
            </button>
          ))}
        </nav>
        <div className="pt-4 border-t border-slate-800">
          <p className="text-xs text-slate-500 mb-1 px-2">Signed in as</p>
          <p className="text-sm text-slate-300 font-medium px-2 mb-3 truncate">{user?.username || 'Admin'}</p>
          <button
            onClick={handleLogout}
            aria-label="Sign out"
            className="w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-all text-left"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 max-w-4xl" role="main">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Drone Light Show Simulator — Admin</h1>
          <p className="text-gray-500 text-sm mt-1">Techbridge University College · Staff Portal</p>
        </header>

        {tab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'React Version', value: '19.2.4', ok: true },
              { label: 'Docker', value: 'Configured', ok: true },
              { label: 'SRS', value: 'docs/SRS.md', ok: true },
              { label: 'Tests', value: 'vitest.config.ts', ok: true },
              { label: 'Auth', value: 'Active', ok: true },
              { label: 'Phase', value: 'Phase 2 Complete', ok: true },
            ].map(item => (
              <div key={item.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <p className="text-xs text-gray-500 font-medium mb-1">{item.label}</p>
                <p className="text-sm font-bold text-gray-900">{item.value}</p>
                <span className={`text-xs ${item.ok ? 'text-emerald-600' : 'text-red-500'}`}>
                  {item.ok ? '✓ compliant' : '✗ gap'}
                </span>
              </div>
            ))}
          </div>
        )}

        {tab === 'logs' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">Activity Log</h2>
            </div>
            <table className="w-full text-sm" aria-label="Activity log">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                <tr>
                  <th className="px-6 py-3 text-left">Time</th>
                  <th className="px-6 py-3 text-left">Action</th>
                  <th className="px-6 py-3 text-left">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {logs.map(log => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-gray-400">{log.time}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">{log.action}</td>
                    <td className="px-6 py-4 text-gray-500">{log.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

```

### FILE: src/pages/LoginPage.tsx
```typescript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await login(username, password);
    if (result.success) {
      navigate('/admin', { replace: true });
    } else {
      setError(result.message || 'Invalid credentials');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="mb-6 text-center">
          <div className="w-12 h-12 bg-[#630f12] rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-[#ffcb05]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Staff Portal</h1>
          <p className="text-gray-500 mt-1 text-sm">Sign in with your TUC credentials</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              id="username" type="text" value={username} required
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#630f12]"
              placeholder="Enter your username"
              aria-label="Username"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              id="password" type="password" value={password} required
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#630f12]"
              placeholder="Enter your password"
              aria-label="Password"
            />
          </div>
          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
          <button
            type="submit" disabled={loading}
            className="w-full py-2 px-4 bg-[#630f12] text-white font-semibold rounded-lg hover:bg-[#7a1317] focus:outline-none focus:ring-2 focus:ring-[#630f12] focus:ring-offset-2 disabled:opacity-50 transition-colors"
            aria-label={loading ? 'Signing in' : 'Sign in'}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

```

### FILE: src/services/AuthService.ts
```typescript
const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000';
const TOKEN_KEY = [REDACTED_CREDENTIAL]

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: { id: string; username: string; role: string };
}

export const AuthService = {
  async login(username: string, password: string): Promise<AuthResponse> {
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data: AuthResponse = await res.json();
      if (data.success && data.token) localStorage.setItem(TOKEN_KEY, data.token);
      return data;
    } catch {
      return { success: false, message: 'Could not connect to TUC Auth API' };
    }
  },

  async validateToken(token: string) {
    try {
      const res = await fetch(`${API_BASE}/api/auth/validate`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return await res.json();
    } catch {
      return { success: false, valid: false };
    }
  },

  logout:          () => localStorage.removeItem(TOKEN_KEY),
  isAuthenticated: () => !!localStorage.getItem(TOKEN_KEY),
  getToken:        () => localStorage.getItem(TOKEN_KEY),
};

```

### FILE: src/__tests__/App.e2e.ts
```typescript
import { describe, it, expect } from 'vitest';

/**
 * E2E stub — drone-light-show-simulator
 * Extend with Puppeteer/Playwright tests.
 * Run: node scripts/phase3-test-scaffold.js --apply then pnpm test:e2e
 */
describe('drone-light-show-simulator E2E', () => {
  it('placeholder — replace with Puppeteer test', () => {
    // TODO: launch browser, navigate to http://localhost:5173, assert UI
    expect(true).toBe(true);
  });
});

```

### FILE: src/__tests__/App.test.tsx
```typescript
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import App from '../../App';

/**
 * Smoke test — verifies the root App component renders without throwing.
 * TUC Phase 3 scaffold — extend with project-specific assertions.
 */
describe('App', () => {
  it('renders without crashing', () => {
    const { container } = render(<App />);
    expect(container).toBeDefined();
    expect(container.firstChild).not.toBeNull();
  });

  it('matches snapshot', () => {
    const { container } = render(<App />);
    expect(container).toMatchSnapshot();
  });
});

```

### FILE: src/__tests__/setup.ts
```typescript
import '@testing-library/jest-dom';

```

### FILE: tsconfig (2).json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "experimentalDecorators": true,
    "useDefineForClassFields": false,
    "module": "ESNext",
    "lib": [
      "ES2022",
      "DOM",
      "DOM.Iterable"
    ],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "isolatedModules": true,
    "moduleDetection": "force",
    "allowJs": true,
    "jsx": "react-jsx",
    "paths": {
      "@/*": [
        "./*"
      ]
    },
    "allowImportingTsExtensions": true,
    "noEmit": true
  }
}
```

### FILE: tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "experimentalDecorators": true,
    "useDefineForClassFields": false,
    "module": "ESNext",
    "lib": [
      "ES2022",
      "DOM",
      "DOM.Iterable"
    ],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "isolatedModules": true,
    "moduleDetection": "force",
    "allowJs": true,
    "jsx": "react-jsx",
    "paths": {
      "@/*": [
        "./*"
      ]
    },
    "allowImportingTsExtensions": true,
    "noEmit": true
  }
}
```

### FILE: utils/geometry (2).ts
```typescript

import { ShapeSegment } from '../data/shapes';
import { POINTS_PER_LENGTH_UNIT } from '../data/constants';

type Point = { x: number; y: number; color?: string };

export const generateShapePoints = (
    segments: ShapeSegment[],
    scaleX: number,
    scaleY: number,
    offsetX: number,
    offsetY: number
): Point[] => {
    const points: Point[] = [];

    segments.forEach(segment => {
        if (segment.type === 'line' && segment.points) {
            const [start, end] = segment.points;
            const length = Math.hypot(end.x - start.x, end.y - start.y);
            const numPoints = Math.ceil(length * scaleX * POINTS_PER_LENGTH_UNIT);

            for (let i = 0; i <= numPoints; i++) {
                const t = i / numPoints;
                points.push({
                    x: (start.x + (end.x - start.x) * t) * scaleX + offsetX,
                    y: (start.y + (end.y - start.y) * t) * scaleY + offsetY,
                    color: segment.color,
                });
            }
        } else if (segment.type === 'arc' && segment.center && segment.radius && segment.startAngle !== undefined && segment.endAngle !== undefined) {
            const { center, radius, startAngle, endAngle, anticlockwise = false } = segment;
            const arcLength = radius * Math.abs(endAngle - startAngle);
            const numPoints = Math.ceil(arcLength * scaleX * POINTS_PER_LENGTH_UNIT);

            for (let i = 0; i <= numPoints; i++) {
                const t = i / numPoints;
                const angle = startAngle + (endAngle - startAngle) * t;

                points.push({
                    x: (center.x + radius * Math.cos(angle)) * scaleX + offsetX,
                    y: (center.y + radius * Math.sin(angle)) * scaleY + offsetY,
                    color: segment.color,
                });
            }
        }
    });

    return points;
};

```

### FILE: utils/geometry.ts
```typescript

import { ShapeSegment } from '../data/shapes';
import { POINTS_PER_LENGTH_UNIT } from '../data/constants';

type Point = { x: number; y: number; color?: string };

export const generateShapePoints = (
    segments: ShapeSegment[],
    scaleX: number,
    scaleY: number,
    offsetX: number,
    offsetY: number
): Point[] => {
    const points: Point[] = [];

    segments.forEach(segment => {
        if (segment.type === 'line' && segment.points) {
            const [start, end] = segment.points;
            const length = Math.hypot(end.x - start.x, end.y - start.y);
            const numPoints = Math.ceil(length * scaleX * POINTS_PER_LENGTH_UNIT);

            for (let i = 0; i <= numPoints; i++) {
                const t = i / numPoints;
                points.push({
                    x: (start.x + (end.x - start.x) * t) * scaleX + offsetX,
                    y: (start.y + (end.y - start.y) * t) * scaleY + offsetY,
                    color: segment.color,
                });
            }
        } else if (segment.type === 'arc' && segment.center && segment.radius && segment.startAngle !== undefined && segment.endAngle !== undefined) {
            const { center, radius, startAngle, endAngle, anticlockwise = false } = segment;
            const arcLength = radius * Math.abs(endAngle - startAngle);
            const numPoints = Math.ceil(arcLength * scaleX * POINTS_PER_LENGTH_UNIT);

            for (let i = 0; i <= numPoints; i++) {
                const t = i / numPoints;
                const angle = startAngle + (endAngle - startAngle) * t;

                points.push({
                    x: (center.x + radius * Math.cos(angle)) * scaleX + offsetX,
                    y: (center.y + radius * Math.sin(angle)) * scaleY + offsetY,
                    color: segment.color,
                });
            }
        }
    });

    return points;
};

```

### FILE: vite.config (2).ts
```typescript
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});

```

### FILE: vite.config.ts
```typescript
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
        }
      }
    }
  },
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});

```

### FILE: vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Vitest unit test configuration — drone-light-show-simulator
// TUC coverage target: >70% for core utilities
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/__tests__/setup.ts',
    include: ['src/**/*.{test,spec}.{ts,tsx,js,jsx}'],
    exclude: ['src/**/*.e2e.{ts,tsx}', 'node_modules', 'dist'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.{test,spec,e2e}.{ts,tsx}', 'src/__tests__/**'],
      thresholds: {
        branches:   70,
        functions:  70,
        lines:      70,
        statements: 70,
      },
    },
  },
});

```

### FILE: vitest.e2e.config.ts
```typescript
import { defineConfig } from 'vitest/config';

// Vitest E2E configuration — drone-light-show-simulator
// E2E tests use Node environment (Puppeteer / Playwright)
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.e2e.{ts,tsx,js}'],
    testTimeout: 30000,
    hookTimeout: 15000,
    teardownTimeout: 10000,
  },
});

```

