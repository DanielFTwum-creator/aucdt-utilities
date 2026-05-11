import React from 'react';
import { motion } from 'framer-motion';

export const VisualEcosystem: React.FC = () => {
  const primaryColor = '#7c3aed';   // violet-600 (accent-primary)
  const secondaryColor = '#4f46e5'; // indigo-600
  const shadowColor = 'rgba(124, 58, 237,';

  return (
    <div className="relative h-[350px] md:h-[450px] w-full flex items-center justify-center [perspective:1000px]">
      <div
        className="relative w-[300px] h-[300px] md:w-[350px] md:h-[350px] [transform-style:preserve-3d]"
        style={{ animation: 'rotate3d 20s linear infinite' }}
      >
        {/* Orbit Rings */}
        <div
          className="absolute top-1/2 left-1/2 w-[200px] h-[200px] border-2 rounded-full"
          style={{
            borderColor: 'rgba(124, 58, 237, 0.2)',
            transform: 'translate(-50%, -50%) rotateX(60deg)',
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-[280px] h-[280px] border-2 rounded-full"
          style={{
            borderColor: 'rgba(124, 58, 237, 0.15)',
            transform: 'translate(-50%, -50%) rotateX(30deg)',
          }}
        />

        {/* Central Core */}
        <div
          className="absolute top-1/2 left-1/2 w-24 h-24 z-10"
          style={{ transform: 'translate(-50%, -50%) translateZ(50px)' }}
        >
          <motion.div
            className="w-full h-full rounded-full flex items-center justify-center text-white font-black text-xl overflow-hidden relative"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}
            animate={{
              scale: [1, 1.1, 1],
              boxShadow: [
                `0 0 60px ${shadowColor}0.3)`,
                `0 0 90px ${shadowColor}0.6)`,
                `0 0 60px ${shadowColor}0.3)`,
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] text-2xl">AI</span>
          </motion.div>
        </div>

        {/* Floating Nodes */}
        {[
          { icon: '📣', top: 50,  left: 150, color: 'from-[#7c3aed] to-[#6d28d9]', delay: '0s',   shadow: 'rgba(124, 58, 237, ' },
          { icon: '📊', top: 100, right: 50, color: 'from-[#4f46e5] to-[#4338ca]', delay: '0.5s', shadow: 'rgba(79, 70, 229, ' },
          { icon: '✍️', bottom: 100, right: 50, color: 'from-[#10b981] to-[#059669]', delay: '1s', shadow: 'rgba(16, 185, 129, ' },
          { icon: '🎯', bottom: 50, left: 150, color: 'from-[#f59e0b] to-[#d97706]', delay: '1.5s', shadow: 'rgba(245, 158, 11, ' },
          { icon: '⚡', top: 100,  left: 50,  color: 'from-[#ec4899] to-[#db2777]', delay: '2s',   shadow: 'rgba(236, 72, 153, ' },
        ].map((node, idx) => (
          <div
            key={idx}
            className="absolute w-[50px] h-[50px]"
            style={{
              top: node.top !== undefined ? node.top : undefined,
              bottom: (node as any).bottom !== undefined ? (node as any).bottom : undefined,
              left: node.left !== undefined ? node.left : undefined,
              right: (node as any).right !== undefined ? (node as any).right : undefined,
              animation: `float-node 3s ease-in-out infinite ${node.delay}`,
            }}
          >
            <motion.div
              className={`w-full h-full rounded-full flex items-center justify-center text-white font-bold text-lg bg-gradient-to-br ${node.color}`}
              animate={{
                boxShadow: [
                  `0 0 0 0 ${node.shadow}0.4)`,
                  `0 0 20px 5px ${node.shadow}0.2)`,
                  `0 0 0 0 ${node.shadow}0.4)`,
                ],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              whileHover={{
                scale: 1.2,
                boxShadow: `0 0 30px 10px ${node.shadow}0.6)`,
                transition: { duration: 0.2 },
              }}
            >
              {node.icon}
            </motion.div>
          </div>
        ))}

        {/* Energy Beams */}
        {[
          { t: '75px',  l: '175px', r: '-15deg', w: '80px' },
          { t: '120px', l: '200px', r: '25deg',  w: '70px' },
          { b: '120px', l: '200px', r: '-25deg', w: '70px' },
          { b: '75px',  l: '175px', r: '15deg',  w: '80px' },
          { t: '120px', l: '100px', r: '-25deg', w: '70px' },
        ].map((beam, idx) => (
          <motion.div
            key={`beam-${idx}`}
            className="absolute h-[2px] origin-left"
            style={{
              background: `linear-gradient(90deg, transparent, ${primaryColor}, transparent)`,
              top: (beam as any).t,
              bottom: (beam as any).b,
              left: beam.l,
              width: beam.w,
              transform: `rotate(${beam.r})`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              filter: [
                `drop-shadow(0 0 0px ${shadowColor}0)) brightness(1)`,
                `drop-shadow(0 0 15px ${shadowColor}1)) brightness(2.5)`,
                `drop-shadow(0 0 0px ${shadowColor}0)) brightness(1)`,
              ],
              scaleX: [0.95, 1.1, 0.95],
            }}
            transition={{ duration: 2, repeat: Infinity, delay: idx * 0.4, ease: 'easeInOut' }}
          />
        ))}

        {/* Floating Icons */}
        {[
          { i: '🚀', t: '20%', l: '20%' },
          { i: '💡', t: '30%', r: '20%' },
          { i: '⭐', b: '30%', l: '15%' },
        ].map((icon, idx) => (
          <motion.div
            key={`icon-${idx}`}
            className="absolute text-2xl opacity-70 pointer-events-none"
            style={{
              top: (icon as any).t,
              bottom: (icon as any).b,
              left: (icon as any).l,
              right: (icon as any).r,
            }}
            animate={{ y: [-10, 10, -10], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 8, repeat: Infinity, delay: idx * 2 }}
          >
            {icon.i}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
