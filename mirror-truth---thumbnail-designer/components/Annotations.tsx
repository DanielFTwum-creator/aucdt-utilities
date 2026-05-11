import React from 'react';
import { Palette, Type, ScanFace, Activity } from 'lucide-react';

export const Annotations: React.FC = () => {
  return (
    <div className="w-full max-w-[1280px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-10 mb-10">
      
      {/* Colour Palette */}
      <div className="border-t border-zinc-300 dark:border-zinc-800 pt-4">
        <h4 className="flex items-center gap-2 font-bebas text-lg tracking-[3px] text-zinc-600 dark:text-zinc-500 mb-2">
          <Palette size={16} /> Colour Palette
        </h4>
        <div className="space-y-2 text-[11px] text-zinc-500 dark:text-zinc-400 font-mono leading-relaxed">
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-[2px] bg-deep-black border border-zinc-700 mr-2"></span>
            Deep Black #0A0A0A
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-[2px] bg-burnt-amber mr-2"></span>
            Burnt Amber #D4760A
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-[2px] bg-cyan-shadow mr-2"></span>
            Cyan Shadow #0A6E6E
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-[2px] bg-warm-white border border-zinc-700 mr-2"></span>
            Warm White #F5F5F0
          </div>
        </div>
      </div>

      {/* Typography */}
      <div className="border-t border-zinc-300 dark:border-zinc-800 pt-4">
        <h4 className="flex items-center gap-2 font-bebas text-lg tracking-[3px] text-zinc-600 dark:text-zinc-500 mb-2">
          <Type size={16} /> Typography
        </h4>
        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono leading-relaxed">
          <strong>Hook:</strong> Bebas Neue, 96px, tracked +8px<br/>
          <strong>Artist:</strong> JetBrains Mono, 13px, 35% opacity<br/>
          <span className="text-burnt-amber">"RUN"</span> in amber to isolate the action word and create urgency.
        </p>
      </div>

      {/* Split Face Concept */}
      <div className="border-t border-zinc-300 dark:border-zinc-800 pt-4">
        <h4 className="flex items-center gap-2 font-bebas text-lg tracking-[3px] text-zinc-600 dark:text-zinc-500 mb-2">
          <ScanFace size={16} /> Split Face
        </h4>
        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono leading-relaxed">
          <strong>Left:</strong> Sharp, amber lit (Truth/Present).<br/>
          <strong>Right:</strong> Blurred, teal (Shadow/Past).<br/>
          Designed to be replaced with a real photo using the same lighting split. The blur on the right is intentional to signify memory or distortion.
        </p>
      </div>

      {/* Glitch Line */}
      <div className="border-t border-zinc-300 dark:border-zinc-800 pt-4">
        <h4 className="flex items-center gap-2 font-bebas text-lg tracking-[3px] text-zinc-600 dark:text-zinc-500 mb-2">
          <Activity size={16} /> Glitch Line
        </h4>
        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono leading-relaxed">
          Digital fragments along the centre divide. Pixel scatter and horizontal displacement. Bridges the tech identity with the musical theme.
        </p>
      </div>

    </div>
  );
};