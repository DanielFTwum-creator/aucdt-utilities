import { motion } from 'motion/react';
import { MathQuestion } from '../types';

interface LevelFractionBakeryProps {
  question: MathQuestion;
  typedValue: string;
}

export default function LevelFractionBakery({
  question,
  typedValue,
}: LevelFractionBakeryProps) {
  const { totalSlices, selectedSlices, label } = question.visualData;

  // Draw the slices path for an SVG pie chart
  const renderPieSlices = () => {
    const paths = [];
    const radius = 60;
    const center = 80;

    for (let i = 0; i < totalSlices; i++) {
      const startAngle = (i * 360) / totalSlices - 90;
      const endAngle = ((i + 1) * 360) / totalSlices - 90;

      const radStart = (startAngle * Math.PI) / 180;
      const radEnd = (endAngle * Math.PI) / 180;

      const x1 = center + radius * Math.cos(radStart);
      const y1 = center + radius * Math.sin(radStart);

      const x2 = center + radius * Math.cos(radEnd);
      const y2 = center + radius * Math.sin(radEnd);

      const largeArc = 0; // slice angle is always < 180
      const isSelected = i < selectedSlices;

      const pathData = `
        M ${center} ${center}
        L ${x1} ${y1}
        A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}
        Z
      `;

      paths.push(
        <g key={i}>
          {/* Pizza slice paths */}
          <motion.path
            d={pathData}
            className={`transition-all duration-300 ${
              isSelected
                ? 'fill-amber-500 stroke-amber-700/60 hover:fill-amber-400 cursor-pointer'
                : 'fill-amber-900/30 stroke-amber-950/40 hover:fill-amber-950/20'
            }`}
            strokeWidth="2.5"
            whileHover={{ scale: 1.02, originX: '80px', originY: '80px' }}
          />
          {/* Slices sprinkles / toppings icons */}
          {isSelected && (
            <circle
              cx={center + (radius * 0.55) * Math.cos(radStart + (radEnd - radStart) / 2)}
              cy={center + (radius * 0.55) * Math.sin(radStart + (radEnd - radStart) / 2)}
              r="4"
              className="fill-rose-600 shadow"
            />
          )}
        </g>
      );
    }
    return paths;
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6 rounded-3xl bg-slate-900/60 border border-slate-700/40 shadow-inner">
      <div className="text-center font-sans">
        <span className="text-xs font-mono tracking-wider text-orange-400 uppercase">
          🍕 THE FRACTION BAKERY
        </span>
        <h3 className="text-lg font-bold text-slate-100 mt-1">
          Slice and Serve Fraction Orders
        </h3>
      </div>

      {/* Gourmet kitchen visual table */}
      <div className="flex flex-col items-center gap-4 bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl relative w-full max-w-sm">
        <div className="absolute top-2.5 left-3 bg-teal-950/40 text-teal-400 text-[10px] uppercase tracking-wide border border-teal-800/20 px-2.5 py-1 rounded-full font-mono">
          {label}
        </div>

        {/* SVG Cooked Pie crust visual */}
        <div className="relative w-44 h-44 flex items-center justify-center p-2 rounded-full bg-orange-950/20 border-4 border-amber-900/40 shadow-inner mt-4">
          <svg className="w-40 h-40 transform" viewBox="0 0 160 160">
            {/* Ambient shadow backplate */}
            <circle cx="80" cy="80" r="62" className="fill-stone-900/70" />
            
            {renderPieSlices()}
            
            {/* Center crust button dot */}
            <circle cx="80" cy="80" r="5" className="fill-amber-900 stroke-amber-700/20" strokeWidth="1" />
          </svg>
        </div>
      </div>

      {/* Fractions nomenclature */}
      <div className="flex flex-col items-center justify-center gap-1.5 bg-slate-800/50 p-3 rounded-2xl border border-slate-700/50 text-xs text-slate-300 w-full max-w-xs">
        <div className="flex items-center gap-3">
          <div className="text-center">
            <span className="block font-bold text-amber-400 text-sm">{selectedSlices}</span>
            <div className="w-10 h-0.5 bg-slate-400 my-0.5 mx-auto" />
            <span className="block font-semibold text-slate-400 text-sm">{totalSlices}</span>
          </div>
          <div className="text-slate-400 text-xs">
            👉 <strong className="text-slate-200">{selectedSlices} out of {totalSlices}</strong> slices served.
          </div>
        </div>
      </div>
    </div>
  );
}
