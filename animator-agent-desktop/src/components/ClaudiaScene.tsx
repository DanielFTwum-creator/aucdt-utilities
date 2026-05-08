import React, { useEffect, useRef } from 'react';
import './claudia.css';

interface SVGProps {
  className?: string;
  style?: React.CSSProperties;
}

const RobotDown = ({ className, style }: SVGProps) => (
  <svg className={className} style={style} width="200" height="300" viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="50" y="80" width="100" height="220" rx="50" fill="#E5E5E5"/>
    <circle cx="100" cy="180" r="30" fill="#FF2D9D"/>
    <circle cx="80" cy="120" r="10" fill="white"/>
    <circle cx="120" cy="120" r="10" fill="white"/>
    <circle cx="78" cy="118" r="4" fill="black"/>
    <circle cx="118" cy="118" r="4" fill="black"/>
    <line x1="100" y1="80" x2="100" y2="40" stroke="#E5E5E5" strokeWidth="6"/>
    <circle cx="100" cy="30" r="12" fill="#FF2D9D"/>
    <rect x="70" y="240" width="60" height="20" rx="4" fill="white" stroke="#008080" strokeWidth="2"/>
    <text x="100" y="254" fontSize="10" fill="black" textAnchor="middle" fontWeight="bold">CLAUDIA</text>
  </svg>
);

const RobotUp = ({ className, style }: SVGProps) => (
  <svg className={className} style={style} width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 160 Q 20 100 40 50" stroke="#E5E5E5" strokeWidth="16" strokeLinecap="round" fill="none"/>
    <path d="M150 160 Q 180 100 160 50" stroke="#E5E5E5" strokeWidth="16" strokeLinecap="round" fill="none"/>
    <rect x="50" y="80" width="100" height="220" rx="50" fill="#E5E5E5"/>
    <circle cx="100" cy="180" r="30" fill="#FF2D9D"/>
    <circle cx="80" cy="120" r="10" fill="white"/>
    <circle cx="120" cy="120" r="10" fill="white"/>
    <circle cx="80" cy="118" r="4" fill="black"/>
    <circle cx="120" cy="118" r="4" fill="black"/>
    <line x1="100" y1="80" x2="100" y2="40" stroke="#E5E5E5" strokeWidth="6"/>
    <circle cx="100" cy="30" r="14" fill="#FF2D9D" filter="drop-shadow(0 0 8px #FF2D9D)"/>
    <rect x="70" y="240" width="60" height="20" rx="4" fill="white" stroke="#008080" strokeWidth="2"/>
    <text x="100" y="254" fontSize="10" fill="black" textAnchor="middle" fontWeight="bold">CLAUDIA</text>
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
    let heartInterval: any;

    const createFizz = (left: string, bottom: string) => {
      if (!fizzContainerRef.current) return;
      const f = document.createElement('div');
      f.className = 'claudia-fizz';
      const s = Math.random() * 2.5 + 1.5;
      f.style.setProperty('--s', s + 'px');
      f.style.setProperty('--d', (Math.random() * 0.8 + 1.8) + 's');
      f.style.setProperty('--tx', (Math.random() * 30 - 15) + 'px');
      f.style.left = left;
      f.style.bottom = bottom;
      fizzContainerRef.current.appendChild(f);
      setTimeout(() => f.remove(), 2600);
    };

    const createHeart = (burst = false) => {
      if (!heartsContainerRef.current || !sceneRef.current || !suitcaseRef.current) return;
      const h = document.createElement('div');
      h.className = 'claudia-heart';
      const size = burst ? (Math.random() * 14 + 28) : (Math.random() * 22 + 16);
      const duration = burst ? (Math.random() * 1.2 + 3.5) : (Math.random() * 2.2 + 4.2);
      const xDrift = (Math.random() * 180 - 90);
      const rot = (Math.random() * 40 - 20);
      const wobble = (Math.random() * 40 - 20);
      const tilt = (Math.random() * 20 + 8);
      
      h.style.setProperty('--size', size + 'px');
      h.style.setProperty('--dur', duration + 's');
      h.style.setProperty('--x', xDrift + 'px');
      h.style.setProperty('--rot', rot + 'deg');
      h.style.setProperty('--wobble', wobble + 'px');
      h.style.setProperty('--tilt', tilt + 'deg');
      
      const suitcaseRect = suitcaseRef.current.getBoundingClientRect();
      const sceneRect = sceneRef.current.getBoundingClientRect();
      const leftPercent = ((suitcaseRect.left + suitcaseRect.width / 2 - sceneRect.left) / sceneRect.width) * 100;
      const bottomPercent = 100 - ((suitcaseRect.top + 10 - sceneRect.top) / sceneRect.height * 100);
      
      h.style.left = `calc(${leftPercent}% + ${Math.random() * 40 - 20}px)`;
      h.style.bottom = `calc(${Math.max(18, bottomPercent)}% + ${Math.random() * 6}px)`;
      h.innerHTML = '<div class="claudia-heart-inner"><div class="claudia-heart-spec"></div></div>';
      
      heartsContainerRef.current.appendChild(h);
      setTimeout(() => h.remove(), duration * 1000 + 200);
      
      if (Math.random() > 0.25) createFizz(h.style.left, h.style.bottom);
    };

    const createBurst = () => {
      if (!suitcaseRef.current || !sceneRef.current) return;
      const rect = suitcaseRef.current.getBoundingClientRect();
      const sceneRect = sceneRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2 - sceneRect.left;
      const cy = rect.top - sceneRect.top;
      
      for (let i = 0; i < 24; i++) {
        const s = document.createElement('div');
        s.className = 'claudia-sparkle';
        const angle = (i / 24) * Math.PI * 2;
        const dist = 40 + Math.random() * 60;
        s.style.left = cx + 'px';
        s.style.top = cy + 'px';
        s.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
        s.style.setProperty('--dy', Math.sin(angle) * dist - Math.random() * 40 + 'px');
        sceneRef.current.appendChild(s);
        setTimeout(() => s.remove(), 800);
      }
      for (let i = 0; i < 18; i++) {
        setTimeout(() => createHeart(true), i * 35);
      }
    };

    const startBubbling = () => {
      if (bubbling) return;
      bubbling = true;
      for (let i = 0; i < 8; i++) setTimeout(() => createHeart(), i * 120);
      heartInterval = setInterval(() => {
        createHeart();
        if (Math.random() > 0.6) createHeart();
      }, 140);
    };

    let timeouts: any[] = [];
    
    // Timeline
    timeouts.push(setTimeout(() => {
      if (suitcaseRef.current) suitcaseRef.current.classList.add('open');
    }, 2000));

    timeouts.push(setTimeout(() => {
      startBubbling();
    }, 2500));

    timeouts.push(setTimeout(() => {
      if (downImgRef.current && upImgRef.current && stageRef.current && suitcaseRef.current) {
        downImgRef.current.style.opacity = '0';
        upImgRef.current.style.opacity = '1';
        stageRef.current.classList.add('levitating');
        suitcaseRef.current.classList.add('levitate');
        createBurst();
        
        setTimeout(() => {
          if (stageRef.current) stageRef.current.classList.add('floating');
        }, 800);
      }
    }, 3000));

    timeouts.push(setTimeout(() => {
      if (captionRef.current) captionRef.current.classList.add('show');
    }, 4100));

    const handleVisibility = () => {
      if (!document.hidden && !bubbling) startBubbling();
    };
    document.addEventListener('visibilitychange', handleVisibility);

    for (let i = 0; i < 3; i++) createFizz('50%', '24%');

    return () => {
      timeouts.forEach(clearTimeout);
      clearInterval(heartInterval);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return (
    <div className="claudia-scene" ref={sceneRef}>
      <div className="claudia-rays">
        <div className="claudia-ray"></div>
        <div className="claudia-ray"></div>
        <div className="claudia-ray"></div>
        <div className="claudia-ray"></div>
        <div className="claudia-ray"></div>
        <div className="claudia-ray"></div>
        <div className="claudia-ray"></div>
      </div>

      <div className="claudia-hearts-container" ref={heartsContainerRef}></div>
      <div className="claudia-fizz-container" ref={fizzContainerRef}></div>

      <div className="claudia-stage" id="stage" ref={stageRef}>
        <div className="claudia-glow-under"></div>
        <div ref={downImgRef} className="claudia-down">
          <RobotDown />
        </div>
        <div ref={upImgRef} className="claudia-up">
          <RobotUp />
        </div>
        
        <div className="claudia-suitcase" id="suitcase" ref={suitcaseRef}>
          <div className="claudia-suitcase-glow"></div>
          <div className="claudia-suitcase-body">
            <div className="claudia-suitcase-lid">
              <div className="claudia-lid-outer"></div>
              <div className="claudia-lid-inner"></div>
            </div>
            <div className="claudia-suitcase-front"></div>
          </div>
        </div>
      </div>

      <div className="claudia-caption" ref={captionRef}><span>chaos:</span> organized</div>
    </div>
  );
}
