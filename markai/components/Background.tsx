import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, MotionValue } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { Theme } from '../types';

interface Particle { id: number; x: number; y: number; size: number; duration: number; delay: number; }

interface InteractiveParticleProps {
  x: number; y: number; size: number;
  mouseX: MotionValue<number>; mouseY: MotionValue<number>;
  factor: number; color: string;
}

const InteractiveParticle: React.FC<InteractiveParticleProps> = ({ x, y, size, mouseX, mouseY, factor, color }) => {
  const xOffset = useTransform(mouseX, (val) => val * factor);
  const yOffset = useTransform(mouseY, (val) => val * factor);
  return (
    <motion.div
      className="absolute rounded-full blur-[1px] constellation-particle"
      style={{ top: `${y}%`, left: `${x}%`, width: size, height: size, x: xOffset, y: yOffset, backgroundColor: color }}
    />
  );
};

export const Background: React.FC = () => {
  const { theme } = useTheme();
  const [particles, setParticles] = useState<Particle[]>([]);
  const [interactiveParticles, setInteractiveParticles] = useState<Array<{ x: number; y: number; size: number; factor: number }>>([]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { damping: 25, stiffness: 120 });
  const smoothY = useSpring(mouseY, { damping: 25, stiffness: 120 });

  useEffect(() => {
    setParticles(Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1.5,
      duration: Math.random() * 10 + 12,
      delay: Math.random() * 6,
    })));
    setInteractiveParticles(Array.from({ length: 20 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 1,
      factor: (Math.random() - 0.5) * 80,
    })));
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth) * 2 - 1);
      mouseY.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, [mouseX, mouseY]);

  if (theme === Theme.HighContrast) {
    return <div className="fixed inset-0 bg-black z-0" />;
  }

  const isDark  = theme === Theme.Dark;
  const particleColor     = isDark ? 'hsl(var(--brand-300))' : 'hsl(var(--brand-500))';
  const interactiveColor  = isDark ? 'hsl(var(--brand-500) / 0.15)' : 'hsl(var(--brand-500) / 0.08)';

  return (
    <div
      className="fixed inset-0 w-full h-full z-0 overflow-hidden transition-colors duration-500"
      style={{ background: 'var(--bg-page)' }}
    >
      {/* Video background — dark and light modes */}
      {theme !== Theme.HighContrast && (
        <>
          <video
            src="https://techbridge.edu.gh/static/videos/video-1037996266055286.mp4"
            autoPlay
            loop
            muted
            playsInline
            onLoadedData={(e) => { e.currentTarget.playbackRate = 0.5; }}
            className="absolute inset-0 min-w-full min-h-full w-full h-full object-cover scale-[1.45] blur-[1.5px] pointer-events-none"
            style={{ opacity: isDark ? 0.45 : 0.15 }}
          />
          {/* Overlay: dark mode deep tint, light mode white wash */}
          <div
            className="absolute inset-0"
            style={{ background: isDark ? 'rgba(10,0,20,0.55)' : 'rgba(255,255,255,0.70)' }}
          />
        </>
      )}

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full constellation-particle"
            style={{
              width: p.size, height: p.size,
              left: `${p.x}%`, top: `${p.y}%`,
              backgroundColor: particleColor,
              filter: 'blur(0.5px)',
            }}
            animate={{ y: [0, -110], opacity: [0, 0.7, 0] }}
            transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'linear' }}
          />
        ))}
      </div>

      {/* Mouse-reactive particles */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {interactiveParticles.map((p, i) => (
          <InteractiveParticle
            key={i}
            x={p.x} y={p.y} size={p.size}
            mouseX={smoothX} mouseY={smoothY}
            factor={p.factor} color={interactiveColor}
          />
        ))}
      </div>
    </div>
  );
};
