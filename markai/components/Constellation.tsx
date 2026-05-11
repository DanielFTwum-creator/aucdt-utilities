import React from 'react';
import { motion } from 'framer-motion';

const PRIMARY   = '#7c3aed';
const SECONDARY = '#4f46e5';
const SHADOW    = 'rgba(124, 58, 237,';

const NODES = [
  { icon: '📣', top: 50,  left: 150, color: 'from-[#7c3aed] to-[#6d28d9]', delay: '0s',   shadow: 'rgba(124,58,237,' },
  { icon: '📊', top: 100, right: 50, color: 'from-[#4f46e5] to-[#4338ca]', delay: '0.5s', shadow: 'rgba(79,70,229,' },
  { icon: '✍️', bottom: 100, right: 50, color: 'from-[#10b981] to-[#059669]', delay: '1s', shadow: 'rgba(16,185,129,' },
  { icon: '🎯', bottom: 50, left: 150, color: 'from-[#f59e0b] to-[#d97706]', delay: '1.5s', shadow: 'rgba(245,158,11,' },
  { icon: '⚡', top: 100, left: 50,  color: 'from-[#ec4899] to-[#db2777]', delay: '2s',   shadow: 'rgba(236,72,153,' },
];

const BEAMS = [
  { t: '75px',  l: '175px', r: '-15deg', w: '80px' },
  { t: '120px', l: '200px', r: '25deg',  w: '70px' },
  { b: '120px', l: '200px', r: '-25deg', w: '70px' },
  { b: '75px',  l: '175px', r: '15deg',  w: '80px' },
  { t: '120px', l: '100px', r: '-25deg', w: '70px' },
];

const FLOATERS = [
  { i: '🚀', t: '20%', l: '20%' },
  { i: '💡', t: '30%', r: '20%' },
  { i: '⭐', b: '30%', l: '15%' },
];

export const Constellation: React.FC = () => (
  <div className="relative h-[350px] md:h-[450px] w-full flex items-center justify-center [perspective:1000px]">
    <div
      className="relative w-[300px] h-[300px] md:w-[350px] md:h-[350px] [transform-style:preserve-3d]"
      style={{ animation: 'rotate3d 20s linear infinite' }}
    >
      {/* Orbit rings — tilted */}
      <div
        className="absolute top-1/2 left-1/2 w-[200px] h-[200px] border-2 rounded-full"
        style={{ borderColor: 'rgba(124,58,237,0.25)', transform: 'translate(-50%,-50%) rotateX(60deg)' }}
      />
      <div
        className="absolute top-1/2 left-1/2 w-[280px] h-[280px] border-2 rounded-full"
        style={{ borderColor: 'rgba(124,58,237,0.15)', transform: 'translate(-50%,-50%) rotateX(30deg)' }}
      />

      {/* Central core */}
      <div
        className="absolute top-1/2 left-1/2 w-24 h-24 z-10"
        style={{ transform: 'translate(-50%, -50%) translateZ(50px)' }}
      >
        <motion.div
          className="w-full h-full rounded-full flex items-center justify-center text-white font-black text-xl relative overflow-hidden"
          style={{ background: '#0f0f23' }}
          animate={{
            scale: [1, 1.1, 1],
            boxShadow: [
              `0 0 60px ${SHADOW}0.3)`,
              `0 0 90px ${SHADOW}0.65)`,
              `0 0 60px ${SHADOW}0.3)`,
            ],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Video background inside core */}
          <div className="absolute inset-0 w-full h-full">
            <video
              src="https://techbridge.edu.gh/static/videos/video-1037996266055286.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover scale-150"
            />
            <div
              className="absolute inset-0 mix-blend-multiply"
              style={{ background: 'linear-gradient(135deg, #7c3aed99, #4f46e599)' }}
            />
          </div>
          <span className="relative z-10 font-display drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">MA</span>
        </motion.div>
      </div>

      {/* Floating nodes */}
      {NODES.map((node, idx) => (
        <div
          key={idx}
          className="absolute w-[50px] h-[50px]"
          style={{
            top:    node.top    !== undefined ? node.top    : undefined,
            bottom: (node as any).bottom !== undefined ? (node as any).bottom : undefined,
            left:   node.left   !== undefined ? node.left   : undefined,
            right:  (node as any).right  !== undefined ? (node as any).right  : undefined,
            animation: `float-node 3s ease-in-out infinite ${node.delay}`,
          }}
        >
          <motion.div
            className={`w-full h-full rounded-full flex items-center justify-center text-lg bg-gradient-to-br ${node.color}`}
            animate={{
              boxShadow: [
                `0 0 0 0 ${node.shadow}0.4)`,
                `0 0 20px 5px ${node.shadow}0.25)`,
                `0 0 0 0 ${node.shadow}0.4)`,
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            whileHover={{
              scale: 1.25,
              boxShadow: `0 0 30px 10px ${node.shadow}0.6)`,
              transition: { duration: 0.2 },
            }}
          >
            {node.icon}
          </motion.div>
        </div>
      ))}

      {/* Energy beams */}
      {BEAMS.map((beam, idx) => (
        <motion.div
          key={`beam-${idx}`}
          className="absolute h-[2px] origin-left"
          style={{
            background: `linear-gradient(90deg, transparent, ${PRIMARY}, transparent)`,
            top:    (beam as any).t,
            bottom: (beam as any).b,
            left:   beam.l,
            width:  beam.w,
            transform: `rotate(${beam.r})`,
          }}
          animate={{
            opacity: [0.3, 1, 0.3],
            filter: [
              `drop-shadow(0 0 0px ${SHADOW}0)) brightness(1)`,
              `drop-shadow(0 0 15px ${SHADOW}1)) brightness(2.5)`,
              `drop-shadow(0 0 0px ${SHADOW}0)) brightness(1)`,
            ],
            scaleX: [0.95, 1.1, 0.95],
          }}
          transition={{ duration: 2, repeat: Infinity, delay: idx * 0.4, ease: 'easeInOut' }}
        />
      ))}

      {/* Floating ambient icons */}
      {FLOATERS.map((f, idx) => (
        <motion.div
          key={`floater-${idx}`}
          className="absolute text-2xl opacity-70 pointer-events-none"
          style={{
            top:    (f as any).t,
            bottom: (f as any).b,
            left:   (f as any).l,
            right:  (f as any).r,
          }}
          animate={{ y: [-10, 10, -10], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity, delay: idx * 2 }}
        >
          {f.i}
        </motion.div>
      ))}
    </div>
  </div>
);

export default Constellation;
