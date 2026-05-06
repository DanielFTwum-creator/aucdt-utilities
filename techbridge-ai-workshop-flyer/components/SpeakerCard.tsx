import React from 'react';
import { Speaker } from '../types';

interface SpeakerCardProps {
  speaker: Speaker;
}

export const SpeakerCard: React.FC<SpeakerCardProps> = ({ speaker }) => {
  const isPrimary = speaker.variant === 'primary';
  
  // Dynamic styles: Primary = Gold, Secondary = Green
  const accentColor = isPrimary ? 'var(--accent-gold)' : 'var(--accent-green)';
  
  return (
    <div 
      className="relative flex flex-col items-center flex-1 min-w-[280px] p-6 
      rounded-2xl border backdrop-blur-sm 
      transition-all duration-300 group hover:-translate-y-2 hover:shadow-[0_0_25px_rgba(255,69,0,0.2)]"
      style={{ 
        backgroundColor: 'var(--bg-card)', 
        borderColor: `color-mix(in srgb, ${accentColor}, transparent 70%)` 
      }}
      tabIndex={0}
      role="article"
      aria-label={`Speaker: ${speaker.name}, ${speaker.title}`}
    >
      
      {/* Badge */}
      <div 
        className="absolute top-3 right-3 px-3 py-1 rounded-full border text-[10px] tracking-widest uppercase font-semibold transition-colors group-hover:border-[var(--accent-red)] group-hover:text-[var(--accent-red)]"
        style={{ 
          backgroundColor: `color-mix(in srgb, ${accentColor}, transparent 80%)`,
          borderColor: `color-mix(in srgb, ${accentColor}, transparent 60%)`,
          color: accentColor
        }}
      >
        Resource Person
      </div>

      {/* Avatar */}
      <div 
        className="w-32 h-32 mb-4 rounded-full overflow-hidden border-[3px] shadow-lg flex items-center justify-center bg-gray-900 transition-colors group-hover:border-[var(--accent-red)]"
        style={{ 
          borderColor: `color-mix(in srgb, ${accentColor}, transparent 50%)`,
          boxShadow: `0 0 20px color-mix(in srgb, ${accentColor}, transparent 90%)`
        }}
      >
        {speaker.isAi ? (
          <span className="text-5xl" role="img" aria-label="AI Robot Avatar">🤖</span>
        ) : (
          <img 
            src={speaker.imageUrl} 
            alt={`Photo of ${speaker.name}`} 
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Name & Title */}
      <h3 className="font-playfair text-lg font-bold mb-2 text-center leading-tight transition-colors group-hover:text-white" style={{ color: 'var(--text-primary)' }}>
        {speaker.name}
      </h3>
      <p className="text-[11px] text-center leading-relaxed mb-4 h-12 flex items-center justify-center" style={{ color: 'var(--text-secondary)' }}>
        {speaker.title}
      </p>

      {/* Topic */}
      <div className="w-full mt-auto rounded-lg p-3 transition-colors group-hover:bg-[rgba(255,69,0,0.1)]"
           style={{ backgroundColor: `color-mix(in srgb, ${accentColor}, transparent 90%)` }}>
        <div className="text-[9px] uppercase tracking-widest mb-1 text-center transition-colors group-hover:text-[var(--accent-red)]"
             style={{ color: `color-mix(in srgb, ${accentColor}, #fff 20%)` }}>
          Speaking On
        </div>
        <div className="text-xs font-semibold text-center" style={{ color: 'var(--text-primary)' }}>
          {speaker.topic.startsWith("⏰") || speaker.topic.startsWith("🎨") ? speaker.topic : `🎙️ ${speaker.topic}`}
        </div>
      </div>
    </div>
  );
};