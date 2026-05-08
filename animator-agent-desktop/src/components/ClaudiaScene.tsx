import React, { useEffect, useRef } from 'react';
import './claudia.css';

interface SVGProps {
  className?: string;
  style?: React.CSSProperties;
}

const RobotDown = ({ className, style }: SVGProps) => (
  <svg className={className} style={style} width="200" height="300" viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bodyGrad" x1="0.15" y1="0.05" x2="0.85" y2="0.95">
        <stop offset="0%" stopColor="#dde6f0" />
        <stop offset="35%" stopColor="#b8cce0" />
        <stop offset="70%" stopColor="#7a9dbf" />
        <stop offset="100%" stopColor="#4a6d8f" />
      </linearGradient>
      <radialGradient id="bodyAO" cx="50%" cy="50%" r="55%">
        <stop offset="55%" stopColor="transparent" />
        <stop offset="100%" stopColor="rgba(0,0,0,0.22)" />
      </radialGradient>
      <radialGradient id="orbGrad" cx="35%" cy="28%" r="65%">
        <stop offset="0%" stopColor="#fff8e0" />
        <stop offset="18%" stopColor="#f9d87a" />
        <stop offset="55%" stopColor="#f4c55a" />
        <stop offset="100%" stopColor="#c9922a" />
      </radialGradient>
      <radialGradient id="eyeSocketGrad" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#1a2540" />
        <stop offset="100%" stopColor="#0d1520" />
      </radialGradient>
      <radialGradient id="irisGrad" cx="40%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#a8d4ff" />
        <stop offset="40%" stopColor="#3b8bff" />
        <stop offset="100%" stopColor="#1a4fcc" />
      </radialGradient>
      <radialGradient id="antennaGrad" cx="38%" cy="30%" r="62%">
        <stop offset="0%" stopColor="#fffce8" />
        <stop offset="30%" stopColor="#f9d87a" />
        <stop offset="100%" stopColor="#c9922a" />
      </radialGradient>
      <linearGradient id="badgeGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1e2d45" />
        <stop offset="100%" stopColor="#141e30" />
      </linearGradient>
      <filter id="bodyShad" x="-20%" y="-10%" width="140%" height="130%">
        <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#0a1628" floodOpacity="0.55" />
      </filter>
      <linearGradient id="rimLight" x1="1" y1="0.3" x2="0.7" y2="1">
        <stop offset="0%" stopColor="rgba(160,200,255,0.18)" />
        <stop offset="100%" stopColor="transparent" />
      </linearGradient>
    </defs>

    <rect x="50" y="80" width="100" height="220" rx="50" fill="url(#bodyGrad)" filter="url(#bodyShad)" />
    <rect x="50" y="80" width="100" height="220" rx="50" fill="url(#bodyAO)" />
    <rect x="50" y="80" width="100" height="220" rx="50" fill="url(#rimLight)" />

    <circle cx="100" cy="185" r="28" fill="url(#orbGrad)" />
    <circle cx="100" cy="185" r="28" fill="none" stroke="rgba(249,216,122,0.35)" strokeWidth="1.5" />
    <ellipse cx="92" cy="177" rx="7" ry="4" fill="rgba(255,255,255,0.55)" transform="rotate(-20 92 177)" />

    <circle cx="80" cy="128" r="12" fill="url(#eyeSocketGrad)" />
    <circle cx="80" cy="128" r="7" fill="url(#irisGrad)" />
    <circle cx="77" cy="125" r="2" fill="rgba(255,255,255,0.9)" />

    <circle cx="120" cy="128" r="12" fill="url(#eyeSocketGrad)" />
    <circle cx="120" cy="128" r="7" fill="url(#irisGrad)" />
    <circle cx="117" cy="125" r="2" fill="rgba(255,255,255,0.9)" />

    <line x1="100" y1="80" x2="100" y2="45" stroke="#7a9dbf" strokeWidth="5" strokeLinecap="round" />
    <circle cx="100" cy="34" r="11" fill="url(#antennaGrad)" />
    <circle cx="100" cy="34" r="11" fill="none" stroke="rgba(249,216,122,0.4)" strokeWidth="1" />

    <rect x="68" y="248" width="64" height="22" rx="5" fill="url(#badgeGrad)" stroke="#2d4a6e" strokeWidth="1.5" />
    <text x="100" y="263" fontSize="9" fill="#7da0ff" textAnchor="middle" fontWeight="600" letterSpacing="0.06em" fontFamily="system-ui, -apple-system, sans-serif">
      Claudia
    </text>
  </svg>
);

const RobotUp = ({ className, style }: SVGProps) => (
  <svg className={className} style={style} width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bodyGrad-up" x1="0.15" y1="0.05" x2="0.85" y2="0.95">
        <stop offset="0%" stopColor="#dde6f0" />
        <stop offset="35%" stopColor="#b8cce0" />
        <stop offset="70%" stopColor="#7a9dbf" />
        <stop offset="100%" stopColor="#4a6d8f" />
      </linearGradient>
      <radialGradient id="bodyAO-up" cx="50%" cy="50%" r="55%">
        <stop offset="55%" stopColor="transparent" />
        <stop offset="100%" stopColor="rgba(0,0,0,0.22)" />
      </radialGradient>
      <radialGradient id="orbGrad-up" cx="35%" cy="28%" r="65%">
        <stop offset="0%" stopColor="#fff8e0" />
        <stop offset="18%" stopColor="#f9d87a" />
        <stop offset="55%" stopColor="#f4c55a" />
        <stop offset="100%" stopColor="#c9922a" />
      </radialGradient>
      <radialGradient id="eyeSocketGrad-up" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#1a2540" />
        <stop offset="100%" stopColor="#0d1520" />
      </radialGradient>
      <radialGradient id="irisGrad-up" cx="40%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#a8d4ff" />
        <stop offset="40%" stopColor="#3b8bff" />
        <stop offset="100%" stopColor="#1a4fcc" />
      </radialGradient>
      <radialGradient id="antennaGrad-up" cx="38%" cy="30%" r="62%">
        <stop offset="0%" stopColor="#fffce8" />
        <stop offset="30%" stopColor="#f9d87a" />
        <stop offset="100%" stopColor="#c9922a" />
      </radialGradient>
      <linearGradient id="badgeGrad-up" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1e2d45" />
        <stop offset="100%" stopColor="#141e30" />
      </linearGradient>
      <filter id="bodyShad-up" x="-20%" y="-10%" width="140%" height="130%">
        <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#0a1628" floodOpacity="0.55" />
      </filter>
      <linearGradient id="rimLight-up" x1="1" y1="0.3" x2="0.7" y2="1">
        <stop offset="0%" stopColor="rgba(160,200,255,0.18)" />
        <stop offset="100%" stopColor="transparent" />
      </linearGradient>
    </defs>

    <path d="M50 158 Q 18 100 36 52" stroke="url(#bodyGrad-up)" strokeWidth="15" strokeLinecap="round" fill="none" />
    <path d="M50 158 Q 18 100 36 52" stroke="rgba(0,0,0,0.18)" strokeWidth="15" strokeLinecap="round" fill="none" />
    <path d="M150 158 Q 182 100 164 52" stroke="url(#bodyGrad-up)" strokeWidth="15" strokeLinecap="round" fill="none" />
    <path d="M150 158 Q 182 100 164 52" stroke="rgba(0,0,0,0.18)" strokeWidth="15" strokeLinecap="round" fill="none" />

    <rect x="50" y="80" width="100" height="220" rx="50" fill="url(#bodyGrad-up)" filter="url(#bodyShad-up)" />
    <rect x="50" y="80" width="100" height="220" rx="50" fill="url(#bodyAO-up)" />
    <rect x="50" y="80" width="100" height="220" rx="50" fill="url(#rimLight-up)" />

    <circle cx="100" cy="185" r="28" fill="url(#orbGrad-up)" />
    <circle cx="100" cy="185" r="28" fill="none" stroke="rgba(249,216,122,0.35)" strokeWidth="1.5" />
    <ellipse cx="92" cy="177" rx="7" ry="4" fill="rgba(255,255,255,0.55)" transform="rotate(-20 92 177)" />

    <circle cx="80" cy="128" r="12" fill="url(#eyeSocketGrad-up)" />
    <circle cx="80" cy="128" r="7" fill="url(#irisGrad-up)" />
    <circle cx="77" cy="125" r="2" fill="rgba(255,255,255,0.9)" />

    <circle cx="120" cy="128" r="12" fill="url(#eyeSocketGrad-up)" />
    <circle cx="120" cy="128" r="7" fill="url(#irisGrad-up)" />
    <circle cx="117" cy="125" r="2" fill="rgba(255,255,255,0.9)" />

    <line x1="100" y1="80" x2="100" y2="45" stroke="#7a9dbf" strokeWidth="5" strokeLinecap="round" />
    <circle cx="100" cy="34" r="13" fill="url(#antennaGrad-up)" filter="drop-shadow(0 0 6px rgba(244,197,90,0.6))" />
    <circle cx="100" cy="34" r="13" fill="none" stroke="rgba(249,216,122,0.4)" strokeWidth="1" />

    <rect x="68" y="248" width="64" height="22" rx="5" fill="url(#badgeGrad-up)" stroke="#2d4a6e" strokeWidth="1.5" />
    <text x="100" y="263" fontSize="9" fill="#7da0ff" textAnchor="middle" fontWeight="600" letterSpacing="0.06em" fontFamily="system-ui, -apple-system, sans-serif">
      Claudia
    </text>
  </svg>
);

export function ClaudiaScene() {
  const stageRef = useRef<HTMLDivElement>(null);
  const suitcaseRef = useRef<HTMLDivElement>(null);
  const heartsContainerRef = useRef<HTMLDivElement>(null);
  const fizzContainerRef = useRef<HTMLDivElement>(null);
  const downImgRef = useRef<HTMLDivElement>(null);
  const upImgRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let bubbling = false;
    let heartInterval: NodeJS.Timeout;

    const createParticle = (isBurst = false) => {
      const container = heartsContainerRef.current;
      if (!container || !sceneRef.current) return;

      const h = document.createElement('div');
      h.className = 'claudia-particle';

      const size = isBurst ? Math.random() * 4 + 6 : Math.random() * 3 + 4;
      const x = Math.random() * 100;
      const dur = Math.random() * 3 + 3;
      const wobble = Math.random() * 8 + 12;
      const tilt = Math.random() * 90 - 45;
      const rot = Math.random() * 360;

      h.style.setProperty('--size', `${size}px`);
      h.style.setProperty('--dur', `${dur}s`);
      h.style.setProperty('--x', `${Math.random() * 40 - 20}px`);
      h.style.setProperty('--wobble', `${wobble}px`);
      h.style.setProperty('--tilt', `${tilt}deg`);
      h.style.setProperty('--rot', `${rot}deg`);
      h.style.left = `${x}%`;
      h.style.bottom = '-20px';

      container.appendChild(h);

      setTimeout(() => {
        h.style.opacity = '1';
      }, 16);

      setTimeout(() => {
        if (container.contains(h)) container.removeChild(h);
      }, dur * 1000);
    };

    const startBubbling = () => {
      if (bubbling) return;
      bubbling = true;

      for (let i = 0; i < 5; i++) {
        setTimeout(() => createParticle(), i * 200);
      }

      heartInterval = setInterval(() => {
        createParticle();
        if (Math.random() > 0.75) createParticle();
      }, 600);
    };

    const createBurst = () => {
      for (let i = 0; i < 8; i++) {
        setTimeout(() => createParticle(true), i * 60);
      }

      for (let i = 0; i < 24; i++) {
        const angle = (i / 24) * Math.PI * 2;
        const distance = Math.random() * 60 + 40;
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;

        const s = document.createElement('div');
        s.className = 'claudia-sparkle';
        s.style.setProperty('--dx', `${dx}px`);
        s.style.setProperty('--dy', `${dy}px`);
        s.style.left = '50%';
        s.style.bottom = '50%';
        s.style.opacity = '1';

        if (fizzContainerRef.current) {
          fizzContainerRef.current.appendChild(s);
        }

        setTimeout(() => {
          if (fizzContainerRef.current?.contains(s)) fizzContainerRef.current.removeChild(s);
        }, 900);
      }
    };

    const timeline = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      if (suitcaseRef.current) suitcaseRef.current.classList.add('open');

      await new Promise((resolve) => setTimeout(resolve, 500));
      startBubbling();

      await new Promise((resolve) => setTimeout(resolve, 500));
      if (downImgRef.current && upImgRef.current) {
        downImgRef.current.style.opacity = '0';
        upImgRef.current.style.opacity = '1';
      }
      if (stageRef.current) stageRef.current.classList.add('levitating');
      if (suitcaseRef.current) suitcaseRef.current.classList.add('levitate');
      createBurst();

      await new Promise((resolve) => setTimeout(resolve, 300));
      if (stageRef.current) stageRef.current.classList.add('floating');

      await new Promise((resolve) => setTimeout(resolve, 300));
      if (captionRef.current) captionRef.current.classList.add('show');
    };

    timeline();

    return () => {
      if (heartInterval) clearInterval(heartInterval);
    };
  }, []);

  return (
    <div ref={sceneRef} className="claudia-scene">
      <div className="claudia-grid" />
      <div ref={stageRef} className="claudia-stage">
        <div ref={suitcaseRef} className="claudia-suitcase">
          <div className="claudia-suitcase-glow" />
          <div className="claudia-suitcase-front" />
          <div className="claudia-lid-outer">
            <div className="claudia-lid-inner" />
            <div className="claudia-sheen" />
          </div>
        </div>

        <div ref={downImgRef} className="claudia-robot-wrapper">
          <RobotDown />
        </div>

        <div ref={upImgRef} className="claudia-robot-wrapper claudia-robot-up">
          <RobotUp />
        </div>

        <div className="claudia-glow-under" />

        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="claudia-ray" style={{ '--r': `${i * 45}deg` } as React.CSSProperties} />
        ))}
      </div>

      <div ref={heartsContainerRef} className="claudia-hearts-container" />
      <div ref={fizzContainerRef} className="claudia-fizz-container" />

      <div ref={captionRef} className="claudia-caption">
        <span className="font-bold tracking-wider">chaos:</span> organized
      </div>
    </div>
  );
}
