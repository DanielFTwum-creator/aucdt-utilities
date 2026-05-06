import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";

export const ParticleBackground: React.FC = () => {
  const [particles, setParticles] = useState<{ id: number; left: string; top: string; duration: number; delay: number; size: number }[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: 3 + Math.random() * 5,
      delay: Math.random() * 6,
      size: Math.random() > 0.7 ? 3 : 2,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: [0, 0.7, 0], scale: [0.5, 1.5, 0.5] }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            backgroundColor: "#D4A017",
            borderRadius: "50%",
          }}
        />
      ))}
      
      {/* Orbit Rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-gold/10 rounded-full animate-[spin_30s_linear_infinite]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-maroon/20 rounded-full animate-[spin_20s_linear_infinite_reverse]" />
    </div>
  );
};

export const BackgroundLayers: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden">
      {/* Base Dark Overlay */}
      <div className="absolute inset-0 bg-[#0a0a0a]" />
      
      {/* Globe Placeholder / Visual Layer */}
      <motion.div 
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 opacity-20 flex items-center justify-center"
      >
        <div className="w-[120%] h-[120%] bg-gradient-to-b from-maroon/20 via-transparent to-transparent rounded-full blur-[100px]" />
      </motion.div>

      {/* Radial Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(107,15,26,0.15)_0%,transparent_70%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0a]/80 to-[#0a0a0a]" />
    </div>
  );
};
