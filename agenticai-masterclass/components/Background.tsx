import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, MotionValue } from 'framer-motion';
import { useTheme } from './ThemeProvider';
import { useBookingMode } from './BookingContext';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

interface InteractiveParticleProps {
    x: number;
    y: number;
    size: number;
    mouseX: MotionValue<number>;
    mouseY: MotionValue<number>;
    factor: number;
    color: string;
}

export const BACKGROUND_VIDEOS = {
    MASTERCLASS: "https://techbridge.edu.gh/static/videos/video-1037996266055286.mp4",
    PRIVATE: "https://techbridge.edu.gh/static/videos/Fiery_Sunset_Over_Ocean_Video.mp4"
};

const InteractiveParticle: React.FC<InteractiveParticleProps> = ({ x, y, size, mouseX, mouseY, factor, color }) => {
    const xOffset = useTransform(mouseX, (val) => val * factor);
    const yOffset = useTransform(mouseY, (val) => val * factor);

    return (
        <motion.div
            className="absolute rounded-full blur-[1px]"
            style={{
                top: `${y}%`,
                left: `${x}%`,
                width: size,
                height: size,
                x: xOffset,
                y: yOffset,
                backgroundColor: color,
            }}
        />
    );
};

export const Background: React.FC = () => {
  const { theme } = useTheme();
  const { bookingType } = useBookingMode();
  const [particles, setParticles] = useState<Particle[]>([]);
  const [interactiveParticles, setInteractiveParticles] = useState<Array<{x: number, y: number, size: number, factor: number}>>([]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 120 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const newParticles = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);

    const newInteractiveParticles = Array.from({ length: 30 }).map((_, i) => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        factor: (Math.random() - 0.5) * 100
    }));
    setInteractiveParticles(newInteractiveParticles);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
        const { innerWidth, innerHeight } = window;
        const x = (e.clientX / innerWidth) * 2 - 1;
        const y = (e.clientY / innerHeight) * 2 - 1;
        mouseX.set(x);
        mouseY.set(y);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Determine colors based on theme
  const particleColor = theme === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)';
  const interactiveColor = theme === 'light' ? 'rgba(100,100,255,0.1)' : 'rgba(255,255,255,0.2)';
  const isHighContrast = theme === 'high-contrast';

  if (isHighContrast) {
    return <div className="fixed inset-0 bg-black z-0"></div>;
  }

  return (
    <div className={`fixed inset-0 w-full h-full z-0 overflow-hidden ${theme === 'light' ? 'bg-slate-50' : 'bg-[#0f0f23]'} transition-colors duration-500`}>
      {/* Video Carousel - Only in Dark Mode */}
      {theme === 'dark' && (
          <div className="absolute inset-0 w-full h-full">
             {/* Masterclass Video */}
             <motion.video
                key="masterclass-video"
                src={BACKGROUND_VIDEOS.MASTERCLASS}
                autoPlay
                loop
                muted
                playsInline
                initial={{ opacity: 0 }}
                animate={{ opacity: bookingType === 'MASTERCLASS' ? 0.4 : 0 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full object-cover"
             />
             {/* Private Video */}
             <motion.video
                key="private-video"
                src={BACKGROUND_VIDEOS.PRIVATE}
                autoPlay
                loop
                muted
                playsInline
                initial={{ opacity: 0 }}
                animate={{ opacity: bookingType === 'PRIVATE' ? 0.4 : 0 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full object-cover"
             />
             <div className="absolute inset-0 bg-[#0f0f23]/60 mix-blend-multiply z-10" />
             <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f23] via-transparent to-[#0f0f23] z-10" />
          </div>
      )}

      {/* Light Mode Gradient */}
      {theme === 'light' && (
           <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-slate-100 z-0" />
      )}

      {/* Floating Particles */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-20">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full blur-[1px]"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.x}%`,
              top: `${p.y}%`,
              backgroundColor: theme === 'light' ? '#cbd5e1' : '#667eea',
              opacity: theme === 'light' ? 0.6 : 0.4
            }}
            animate={{
              y: [0, -100],
              opacity: [0, theme === 'light' ? 0.8 : 0.8, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "linear"
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 w-full h-full pointer-events-none z-20">
        {interactiveParticles.map((p, i) => (
            <InteractiveParticle 
                key={`interactive-${i}`}
                x={p.x}
                y={p.y}
                size={p.size}
                mouseX={smoothX}
                mouseY={smoothY}
                factor={p.factor}
                color={interactiveColor}
            />
        ))}
      </div>
    </div>
  );
};