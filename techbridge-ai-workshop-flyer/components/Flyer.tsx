import React, { useRef, useState } from 'react';
import { BackgroundElements } from './BackgroundElements';
import { SpeakerCard } from './SpeakerCard';
import { Showcase } from './Showcase';
// Removed HandbookPresentation import as it's no longer used
import { INSTITUTION, SPEAKERS, EVENT_DETAILS, SHOWCASE_IMAGES } from '../constants';

export const Flyer: React.FC = () => {
  const cardRef = useRef<HTMLElement>(null);
  // Removed showHandbookPresentation state as it's no longer needed

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!cardRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xCenter = rect.width / 2;
    const yCenter = rect.height / 2;
    const rotateX = ((y - yCenter) / yCenter) * -1;
    const rotateY = ((x - xCenter) / xCenter) * 1;
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    }
  };

  return (
    <main 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-[800px] min-h-[1100px] rounded-xl overflow-hidden shadow-2xl mx-auto my-8 transition-transform duration-200 ease-out border-t-4 border-[var(--accent-gold)]"
      style={{ background: 'var(--bg-flyer)', transformStyle: 'preserve-3d' }}
      aria-label="Flyer: AI Rendering in Fashion Design Workshop"
    >
      
      <BackgroundElements />

      <article className="relative z-10 p-8 sm:p-12 flex flex-col h-full text-[var(--text-primary)]">
        
        {/* Header */}
        <header className="text-center mb-8 animate-fadeInUp">
          <div className="flex justify-center mb-6">
            <img 
              src="https://techbridge.edu.gh/static/TUC_LOGO_1.png" 
              alt="Techbridge University College Logo" 
              className="w-24 h-auto drop-shadow-[0_0_15px_rgba(255,215,0,0.3)]"
            />
          </div>

          <h2 className="font-poppins text-sm font-semibold tracking-[0.25em] uppercase mb-2" style={{ color: 'var(--accent-gold)' }}>
            {INSTITUTION.name}
          </h2>
          <p className="text-[11px] font-normal tracking-[0.2em] uppercase mb-6" style={{ color: 'var(--text-secondary)' }}>
            {INSTITUTION.dept} &nbsp;·&nbsp; {INSTITUTION.location}
          </p>

          <div className="flex items-center gap-3 my-4 opacity-60" aria-hidden="true">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--accent-red)] to-transparent" />
            <div className="w-2 h-2 rotate-45" style={{ backgroundColor: 'var(--accent-gold)' }} />
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--accent-green)] to-transparent" />
          </div>

          <p className="text-[11px] tracking-[0.3em] uppercase mb-4" style={{ color: 'var(--text-secondary)' }}>proudly presents</p>

          <div 
            className="inline-block px-5 py-1.5 mb-4 rounded-full border text-[11px] tracking-[0.2em] uppercase"
            style={{ 
              borderColor: 'var(--accent-gold)', 
              backgroundColor: 'rgba(255, 215, 0, 0.05)', 
              color: 'var(--accent-gold)' 
            }}
          >
            ⚡ Practical Workshop
          </div>

          <h1 className="font-playfair text-5xl sm:text-6xl font-black leading-[1.1] mb-2 drop-shadow-lg">
            <span className="block" style={{ color: 'var(--text-primary)' }}>Afrofuturism:</span>
            <span className="block bg-clip-text text-transparent bg-gradient-to-br from-[var(--accent-gold)] via-yellow-200 to-[var(--accent-red)]"
                  style={{ backgroundImage: 'linear-gradient(to bottom right, var(--accent-gold), #fff, var(--accent-red))', backgroundClip: 'text', WebkitBackgroundClip: 'text' }}>
              AI Fashion
            </span>
            <span className="block text-4xl sm:text-5xl mt-2" style={{ color: 'var(--accent-green)' }}>Design Workshop</span>
          </h1>
        </header>

        {/* AI Showcase */}
        <section className="animate-fadeInUp delay-100">
           <Showcase images={SHOWCASE_IMAGES} />
        </section>

        {/* Focus Box */}
        <div 
          className="mx-auto max-w-xl w-full rounded-lg p-4 text-center mb-8 backdrop-blur-sm animate-fadeInUp delay-200 kente-border-top"
          style={{ 
            backgroundColor: 'rgba(0, 107, 63, 0.1)', 
            borderBottom: '1px solid var(--accent-green)'
          }}
        >
          <div className="text-[10px] tracking-[0.25em] uppercase mb-1" style={{ color: 'var(--accent-gold)' }}>Workshop Focus</div>
          <div className="text-base font-semibold tracking-wide" style={{ color: 'var(--text-primary)' }}>
            Merging Traditional African Aesthetics with Generative AI
          </div>
        </div>

        {/* Workshop Materials Link / Button */}
        <section className="text-center mb-8 animate-fadeInUp delay-200 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="https://techbridge.edu.gh/static/presentations/TECHBRIDGE%20african_fashion_ai_workshop.pdf" // Updated PDF URL
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[var(--accent-green)] text-black font-bold uppercase tracking-wide text-sm shadow-lg 
                       hover:bg-[var(--accent-gold)] hover:text-black transition-all duration-300 transform hover:scale-105"
            aria-label="View Workshop Handbook PDF in a new tab"
          >
            <span className="text-xl" aria-hidden="true">⬇️</span> View PDF
          </a>
        </section>


        {/* Event Details Grid */}
        <section aria-label="Event Details" className="flex flex-wrap justify-center gap-8 mb-8 animate-fadeInUp delay-300">
          {EVENT_DETAILS.map((detail, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <span className="text-2xl mb-1" aria-hidden="true">{detail.icon}</span>
              <span className="text-[10px] tracking-[0.2em] uppercase" style={{ color: 'var(--text-secondary)' }}>{detail.label}</span>
              <span className="text-base font-bold mt-1" style={{ color: 'var(--accent-gold)' }}>{detail.value}</span>
              {detail.subValue && <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{detail.subValue}</span>}
            </div>
          ))}
        </section>

        <div className="flex items-center gap-3 my-6 opacity-60 animate-fadeInUp delay-300" aria-hidden="true">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--accent-green)] to-transparent" />
          <div className="w-2 h-2 rotate-45" style={{ backgroundColor: 'var(--accent-gold)' }} />
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--accent-green)] to-transparent" />
        </div>

        {/* Resource Persons Header */}
        <div className="text-center mb-6 animate-fadeInUp delay-400">
          <span className="relative inline-block px-4 text-[11px] tracking-[0.3em] uppercase" style={{ color: 'var(--text-secondary)' }}>
            <span className="mr-2" style={{ color: 'var(--accent-gold)' }} aria-hidden="true">✦</span>
            Visionary Speakers
            <span className="ml-2" style={{ color: 'var(--accent-gold)' }} aria-hidden="true">✦</span>
          </span>
        </div>

        {/* Speakers */}
        <section aria-label="Speakers" className="flex flex-wrap justify-center gap-6 mb-8 animate-fadeInUp delay-400">
          {SPEAKERS.map((speaker, idx) => (
            <SpeakerCard key={idx} speaker={speaker} />
          ))}
        </section>

        {/* Audience Strip */}
        <div className="mt-auto rounded-xl p-4 flex items-center gap-4 backdrop-blur-sm animate-fadeInUp delay-500"
             style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <div className="text-3xl" aria-hidden="true">🇬🇭</div>
          <div className="flex-1">
            <div className="text-[10px] tracking-[0.25em] uppercase mb-1" style={{ color: 'var(--accent-gold)' }}>Invitation</div>
            <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              Open to all Techbridge Fashion Students &amp; Alumni
            </div>
          </div>
          <div className="hidden sm:block text-[10px] text-center leading-relaxed border-l pl-4"
               style={{ color: 'var(--text-secondary)', borderColor: 'var(--border-color)' }}>
            Akwaaba<br/>Welcome<br/>2026
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 pt-6 border-t flex flex-wrap justify-between items-center gap-4 animate-fadeInUp delay-500"
                style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex flex-col items-center sm:items-start gap-1">
            <span className="text-[9px] tracking-[0.2em] uppercase" style={{ color: 'var(--text-secondary)' }}>Organiser</span>
            <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Victoria Abra Honu</span>
            {/* Fix: Wrap string literal in curly braces to avoid parser confusion */}
            <span className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>{'Head, Fashion Dept.'}</span>
          </div>

          <div className="font-extrabold text-xs tracking-[0.15em] px-5 py-2 rounded-full uppercase shadow-lg"
               style={{ 
                 background: 'linear-gradient(to right, var(--accent-red), var(--accent-gold), var(--accent-green))', 
                 color: '#000',
                 boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
               }}>
            Free Entry
          </div>

          <div className="flex flex-col items-center sm:items-end gap-1">
            <span className="text-[9px] tracking-[0.2em] uppercase" style={{ color: 'var(--text-secondary)' }}>Location</span>
            <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Oyibi, Ghana</span>
            {/* Fix: Wrap string literal in curly braces to avoid parser confusion */}
            <span className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>{'Techbridge Univ. College'}</span>
          </div>
        </footer>

      </article>

      {/* Handbook Presentation Modal (Removed) */}
    </main>
  );
};