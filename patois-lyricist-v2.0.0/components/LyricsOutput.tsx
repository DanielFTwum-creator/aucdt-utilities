import React from 'react';

interface LyricsOutputProps {
  lyrics: string;
  description?: string;
}

const LyricsOutput: React.FC<LyricsOutputProps> = ({ lyrics, description }) => {
  return (
    <div 
      id="lyricsOutput"
      className="bg-black/30 backdrop-blur-sm border-l-4 border-[#D4AF37] p-6 rounded-lg transition-all duration-300 ease-in-out shadow-inner"
      role="region"
      aria-label="Generated Song Lyrics"
      aria-live="polite"
    >
      {description && (
        <div className="mb-6 pb-4 border-b border-white/5 text-sm italic text-title/60 font-sans">
          <span className="font-black uppercase tracking-widest text-[10px] block mb-1 opacity-40">Original Vision:</span>
          "{description}"
        </div>
      )}
      <div className="font-mono whitespace-pre-wrap text-gray-200 text-base sm:text-lg leading-relaxed min-h-[150px]">
        {lyrics}
      </div>
    </div>
  );
};

export default LyricsOutput;