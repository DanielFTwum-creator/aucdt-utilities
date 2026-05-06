import React from 'react';
import { motion } from 'framer-motion';
import { useBookingMode } from './BookingContext';
import { BACKGROUND_VIDEOS } from './Background';

export const VisualEcosystem: React.FC = () => {
  const { bookingType } = useBookingMode();
  const isPrivate = bookingType === 'PRIVATE';

  // Dynamic Theme Colors
  const primaryColor = isPrivate ? '#f59e0b' : '#667eea'; // Amber-500 vs Indigo-500
  const secondaryColor = isPrivate ? '#ea580c' : '#764ba2'; // Orange-600 vs Purple-700
  const shadowColor = isPrivate ? 'rgba(245, 158, 11,' : 'rgba(102,126,234,'; // Glow base
  const videoSrc = isPrivate ? BACKGROUND_VIDEOS.PRIVATE : BACKGROUND_VIDEOS.MASTERCLASS;

  return (
    <div className="relative h-[350px] md:h-[450px] w-full flex items-center justify-center [perspective:1000px]">
      <div 
        className="relative w-[300px] h-[300px] md:w-[350px] md:h-[350px] [transform-style:preserve-3d]"
        style={{ animation: 'rotate3d 20s linear infinite' }}
      >
        {/* Orbit Rings */}
        <motion.div 
            animate={{ borderColor: isPrivate ? 'rgba(245, 158, 11, 0.2)' : 'rgba(102, 126, 234, 0.2)' }}
            className="absolute top-1/2 left-1/2 w-[200px] h-[200px] border-2 rounded-full -translate-x-1/2 -translate-y-1/2 [transform:translate(-50%,-50%)_rotateX(60deg)]" 
        />
        <motion.div 
            animate={{ borderColor: isPrivate ? 'rgba(245, 158, 11, 0.2)' : 'rgba(102, 126, 234, 0.2)' }}
            className="absolute top-1/2 left-1/2 w-[280px] h-[280px] border-2 rounded-full -translate-x-1/2 -translate-y-1/2 [transform:translate(-50%,-50%)_rotateX(30deg)]" 
        />

        {/* Central Core */}
        <div 
          className="absolute top-1/2 left-1/2 w-24 h-24 z-10"
          style={{ transform: 'translate(-50%, -50%) translateZ(50px)' }}
        >
          <motion.div
            className="w-full h-full rounded-full flex items-center justify-center text-white font-black text-2xl overflow-hidden relative"
            style={{
                background: '#0f0f23'
            }}
            animate={{
              scale: [1, 1.1, 1],
              boxShadow: [
                `0 0 60px ${shadowColor}0.3)`,
                `0 0 90px ${shadowColor}0.6)`,
                `0 0 60px ${shadowColor}0.3)`
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {/* Video Background in Core */}
            <div className="absolute inset-0 w-full h-full">
                <motion.video
                    key={videoSrc} // Force re-render on source change
                    src={videoSrc}
                    autoPlay
                    loop
                    muted
                    playsInline
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="w-full h-full object-cover scale-150"
                />
                {/* Overlay to ensure text legibility */}
                <motion.div 
                    animate={{ 
                        background: `linear-gradient(135deg, ${primaryColor}99, ${secondaryColor}99)` 
                    }}
                    className="absolute inset-0 mix-blend-multiply" 
                />
            </div>

            <span className="relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">AI</span>
          </motion.div>
        </div>

        {/* Floating Nodes */}
        {[
          { icon: '💰', top: 50, left: 150, color: isPrivate ? 'from-[#fbbf24] to-[#d97706]' : 'from-[#ff6b6b] to-[#ff8e8e]', delay: '0s', shadow: isPrivate ? 'rgba(251, 191, 36, ' : 'rgba(255, 107, 107, ' },
          { icon: '⚡', top: 100, right: 50, color: isPrivate ? 'from-[#fcd34d] to-[#f59e0b]' : 'from-[#4ecdc4] to-[#6bcf7f]', delay: '0.5s', shadow: isPrivate ? 'rgba(252, 211, 77, ' : 'rgba(78, 205, 196, ' },
          { icon: '📊', bottom: 100, right: 50, color: isPrivate ? 'from-[#fdba74] to-[#ea580c]' : 'from-[#ffe66d] to-[#ff9f43]', delay: '1s', shadow: isPrivate ? 'rgba(253, 186, 116, ' : 'rgba(255, 230, 109, ' },
          { icon: '🎯', bottom: 50, left: 150, color: isPrivate ? 'from-[#bef264] to-[#65a30d]' : 'from-[#a8e6cf] to-[#88d8a3]', delay: '1.5s', shadow: isPrivate ? 'rgba(190, 242, 100, ' : 'rgba(168, 230, 207, ' },
          { icon: '💡', top: 100, left: 50, color: isPrivate ? 'from-[#fca5a5] to-[#dc2626]' : 'from-[#ffaaa5] to-[#ff8a80]', delay: '2s', shadow: isPrivate ? 'rgba(252, 165, 165, ' : 'rgba(255, 170, 165, ' },
        ].map((node, idx) => (
          <div
            key={idx}
            className="absolute w-[50px] h-[50px]"
            style={{
              top: node.top !== undefined ? node.top : undefined,
              bottom: node.bottom !== undefined ? node.bottom : undefined,
              left: node.left !== undefined ? node.left : undefined,
              right: node.right !== undefined ? node.right : undefined,
              animation: `float-node 3s ease-in-out infinite ${node.delay}`,
            }}
          >
            <motion.div
              className={`w-full h-full rounded-full flex items-center justify-center text-white font-bold text-lg bg-gradient-to-br ${node.color}`}
              animate={{
                boxShadow: [
                  `0 0 0 0 ${node.shadow}0.4)`,
                  `0 0 20px 5px ${node.shadow}0.2)`,
                  `0 0 0 0 ${node.shadow}0.4)`
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              whileHover={{
                scale: 1.2,
                boxShadow: `0 0 30px 10px ${node.shadow}0.6)`,
                transition: { duration: 0.2 }
              }}
            >
              {node.icon}
            </motion.div>
          </div>
        ))}

        {/* Energy Beams (Pulsing Glow) */}
         {[
            { t: '75px', l: '175px', r: '-15deg', w: '80px' }, // Top Left
            { t: '120px', l: '200px', r: '25deg', w: '70px' },  // Top Right
            { b: '120px', l: '200px', r: '-25deg', w: '70px' }, // Bottom Right
            { b: '75px', l: '175px', r: '15deg', w: '80px' },   // Bottom Left
            { t: '120px', l: '100px', r: '-25deg', w: '70px' }, // Top Far Left
         ].map((beam, idx) => (
             <motion.div 
                key={`beam-${idx}`}
                className="absolute h-[2px] origin-left"
                style={{ 
                    background: `linear-gradient(90deg, transparent, ${primaryColor}, transparent)`,
                    top: beam.t, 
                    bottom: beam.b,
                    left: beam.l, 
                    width: beam.w,
                    transform: `rotate(${beam.r})`
                }}
                animate={{ 
                    opacity: [0.3, 1, 0.3],
                    filter: [
                        `drop-shadow(0 0 0px ${shadowColor}0)) brightness(1)`,
                        `drop-shadow(0 0 15px ${shadowColor}1)) brightness(2.5)`, 
                        `drop-shadow(0 0 0px ${shadowColor}0)) brightness(1)`
                    ],
                    scaleX: [0.95, 1.1, 0.95]
                }}
                transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    delay: idx * 0.4,
                    ease: "easeInOut" 
                }}
             />
         ))}

         {/* Floating Icons */}
         {[
            { i: '🚀', t: '20%', l: '20%' },
            { i: '💎', t: '30%', r: '20%' },
            { i: '⭐', b: '30%', l: '15%' },
         ].map((icon, idx) => (
             <motion.div
                key={`icon-${idx}`}
                className="absolute text-2xl opacity-70 pointer-events-none"
                style={{ 
                    top: icon.t, 
                    bottom: icon.b,
                    left: icon.l,
                    right: icon.r
                }}
                animate={{ 
                    y: [-10, 10, -10],
                    rotate: [0, 10, -10, 0],
                }}
                transition={{ duration: 8, repeat: Infinity, delay: idx * 2 }}
             >
                 {icon.i}
             </motion.div>
         ))}
      </div>
    </div>
  );
};