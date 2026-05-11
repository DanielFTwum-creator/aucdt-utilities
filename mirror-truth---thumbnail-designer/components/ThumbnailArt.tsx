import React, { useState } from 'react';
import { ThumbnailConfig, GlitchFragment, PixelScatter, ThumbnailVariant } from '../types';
import { Info, X, Upload } from 'lucide-react';

interface ThumbnailArtProps {
  config: ThumbnailConfig;
  onImageDrop?: (side: 'left' | 'right', file: File) => void;
}

const GLITCH_FRAGMENTS: GlitchFragment[] = [
  { id: 1, width: 35, height: 3, top: 18, left: -15, color: 'rgba(212, 118, 10, 0.5)', delay: 0 },
  { id: 2, width: 25, height: 2, top: 28, left: -8, color: 'rgba(10, 110, 110, 0.5)', delay: 0.4 },
  { id: 3, width: 50, height: 4, top: 42, left: -25, color: 'rgba(245, 245, 240, 0.2)', delay: 0.8 },
  { id: 4, width: 18, height: 2, top: 55, left: -5, color: 'rgba(212, 118, 10, 0.4)', delay: 1.2 },
  { id: 5, width: 40, height: 3, top: 67, left: -20, color: 'rgba(10, 110, 110, 0.4)', delay: 0.2 },
  { id: 6, width: 30, height: 5, top: 78, left: -12, color: 'rgba(245, 245, 240, 0.15)', delay: 0.6 },
  { id: 7, width: 22, height: 2, top: 35, left: 2, color: 'rgba(212, 118, 10, 0.35)', delay: 1 },
  { id: 8, width: 45, height: 3, top: 88, left: -22, color: 'rgba(10, 110, 110, 0.3)', delay: 1.4 },
];

const PIXEL_SCATTERS: PixelScatter[] = [
  { id: 1, top: 22, left: -8, color: '#D4760A', delay: 0.1, opacity: 1 },
  { id: 2, top: 24, left: 12, color: '#0A6E6E', delay: 0.5, opacity: 1 },
  { id: 3, top: 45, left: -14, color: '#F5F5F0', delay: 0.3, opacity: 0.4 },
  { id: 4, top: 48, left: 10, color: '#D4760A', delay: 0.7, opacity: 0.5 },
  { id: 5, top: 70, left: -10, color: '#0A6E6E', delay: 0.9, opacity: 1 },
  { id: 6, top: 73, left: 8, color: '#F5F5F0', delay: 1.1, opacity: 0.3 },
  { id: 7, top: 60, left: -6, color: '#D4760A', delay: 0.2, opacity: 0.6 },
  { id: 8, top: 15, left: 6, color: '#0A6E6E', delay: 0.8, opacity: 0.4 },
];

// Styles configuration based on variant
const getVariantStyles = (variant: ThumbnailVariant) => {
  switch (variant) {
    case 'neon-void':
      return {
        leftBg: 'linear-gradient(170deg, #09090b 0%, #18181b 40%, #27272a 100%)', // Dark/Desaturated
        rightBg: 'linear-gradient(190deg, #1e1b4b 0%, #701a75 40%, #db2777 100%)', // Vibrant Neon Pink/Purple
        leftTint: 'linear-gradient(170deg, rgba(9,9,11,0.8) 0%, rgba(39,39,42,0.6) 100%)',
        rightTint: 'linear-gradient(190deg, rgba(30,27,75,0.6) 0%, rgba(219,39,119,0.5) 100%)',
        leftEyeColor: '#52525b',
        rightEyeColor: '#f472b6',
        leftShadow: '0 0 15px rgba(82, 82, 91, 0.5)',
        rightShadow: '0 0 20px rgba(219, 39, 119, 0.8)',
        textColor: 'text-white',
        accentColor: 'text-neon-purple',
        fontClass: 'font-bebas',
        artistPos: 'top-[48px] left-[52px]',
        glowColor: 'rgba(219, 39, 119, 0.2)',
      };
    case 'editorial':
      return {
        leftBg: 'linear-gradient(170deg, #0A0A0A 0%, #1a0f04 15%, #D4760A 40%, #E8943A 55%, #D4760A 70%, #1a0f04 90%, #0A0A0A 100%)', // Original
        rightBg: 'linear-gradient(190deg, #0A0A0A 0%, #041a1a 15%, #0A6E6E 40%, #0C8585 52%, #0A6E6E 65%, #041a1a 88%, #0A0A0A 100%)', // Original
        leftTint: 'linear-gradient(170deg, rgba(10,10,10,0.8) 0%, rgba(212,118,10,0.4) 100%)',
        rightTint: 'linear-gradient(190deg, rgba(10,10,10,0.8) 0%, rgba(10,110,110,0.4) 100%)',
        leftEyeColor: '#3d1f00',
        rightEyeColor: '#003d3d',
        leftShadow: '0 0 15px rgba(212,118,10,0.5)',
        rightShadow: '0 0 20px rgba(10,110,110,0.4)',
        textColor: 'text-warm-white',
        accentColor: 'text-burnt-amber',
        fontClass: 'font-serif italic', // Playfair Display
        artistPos: 'bottom-[48px] right-[48px] text-right', // Moved to bottom right
        glowColor: 'rgba(212, 118, 10, 0.08)',
      };
    case 'original':
    default:
      return {
        leftBg: 'linear-gradient(170deg, #0A0A0A 0%, #1a0f04 15%, #D4760A 40%, #E8943A 55%, #D4760A 70%, #1a0f04 90%, #0A0A0A 100%)',
        rightBg: 'linear-gradient(190deg, #0A0A0A 0%, #041a1a 15%, #0A6E6E 40%, #0C8585 52%, #0A6E6E 65%, #041a1a 88%, #0A0A0A 100%)',
        leftTint: 'linear-gradient(170deg, rgba(10,10,10,0.7) 0%, rgba(212,118,10,0.5) 100%)',
        rightTint: 'linear-gradient(190deg, rgba(10,10,10,0.7) 0%, rgba(10,110,110,0.5) 100%)',
        leftEyeColor: '#3d1f00',
        rightEyeColor: '#003d3d',
        leftShadow: '0 0 15px rgba(212,118,10,0.5)',
        rightShadow: '0 0 20px rgba(10,110,110,0.4)',
        textColor: 'text-warm-white',
        accentColor: 'text-burnt-amber',
        fontClass: 'font-bebas',
        artistPos: 'top-[48px] left-[52px]',
        glowColor: 'rgba(212, 118, 10, 0.08)',
      };
  }
};

export const ThumbnailArt: React.FC<ThumbnailArtProps> = ({ config, onImageDrop }) => {
  const { artistName, hookText, accentWord, animate, showSafeZones, showGrid, variant, leftImage, rightImage, showCssFace, hookLetterSpacing, hookFontWeight, faceX, faceY, faceScale, faceSpread } = config;
  const styles = getVariantStyles(variant);
  
  // Interactive State
  const [activeSide, setActiveSide] = useState<'left' | 'right' | null>(null);
  const [dragOverSide, setDragOverSide] = useState<'left' | 'right' | null>(null);

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Close overlay if clicking background but not the faces if they were the trigger
    if (e.target === e.currentTarget) {
        setActiveSide(null);
    }
  };

  const handleDragOver = (e: React.DragEvent, side: 'left' | 'right') => {
    e.preventDefault();
    e.stopPropagation();
    if (dragOverSide !== side) {
      setDragOverSide(side);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverSide(null);
  };

  const handleDrop = (e: React.DragEvent, side: 'left' | 'right') => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverSide(null);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/') && onImageDrop) {
      onImageDrop(side, file);
    }
  };

  return (
    <div 
        id="thumbnail-canvas"
        className="relative w-[1280px] h-[720px] bg-deep-black overflow-hidden border border-zinc-800 shadow-2xl select-none group/canvas"
        onClick={handleBackdropClick}
    >
      {/* Dynamic Styles for Animations */}
      <style>{`
        @keyframes glitchShift {
          0% { transform: translateX(0); opacity: 0.6; }
          30% { transform: translateX(3px); opacity: 1; }
          70% { transform: translateX(-2px); opacity: 0.4; }
          100% { transform: translateX(1px); opacity: 0.8; }
        }
        @keyframes pixelFlicker {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
      `}</style>

      {/* ======================== */}
      {/* AMBIENT LIGHT LEAKS      */}
      {/* ======================== */}
      <div className="absolute -top-[50px] -left-[50px] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(212,118,10,0.06)_0%,transparent_70%)] z-10" />
      <div className="absolute -bottom-[50px] -right-[50px] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(10,110,110,0.04)_0%,transparent_70%)] z-10" />

      {/* ======================== */}
      {/* FACE ASSEMBLY WRAPPER    */}
      {/* ======================== */}
      <div 
        className="absolute z-20"
        style={{
            top: '50%',
            left: '50%',
            width: '480px',
            height: '600px',
            transform: `translate(-50%, -50%) translate(${faceX}px, ${faceY}px) scale(${faceScale})`
        }}
      >

        {/* ======================== */}
        {/* SPLIT FACE CONTAINER     */}
        {/* ======================== */}
        <div className="absolute inset-0 flex z-20">
            
            {/* LEFT SIDE — TRUTH */}
            <div 
                className={`w-1/2 h-full relative overflow-hidden cursor-pointer transition-all duration-500 group/left hover:brightness-110 ${dragOverSide === 'left' ? 'ring-2 ring-burnt-amber z-30 brightness-125' : ''}`}
                style={{ 
                    clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
                    background: leftImage ? '#000' : styles.leftBg,
                    transform: `translateX(-${faceSpread / 2}px)`
                }}
                onClick={(e) => { e.stopPropagation(); setActiveSide('left'); }}
                onDragOver={(e) => handleDragOver(e, 'left')}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, 'left')}
            >
                {/* User Image Render */}
                {leftImage && (
                <>
                    <img 
                        src={leftImage} 
                        alt="Left Face" 
                        className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-100 ease-out" 
                        style={{
                        transform: `scale(${config.leftImageScale}) translate(${config.leftImageX}px, ${config.leftImageY}px)`
                        }}
                    />
                    {/* Colour Grading Overlay */}
                    <div className="absolute inset-0 mix-blend-color" style={{ background: styles.leftTint }}></div>
                    <div className="absolute inset-0 mix-blend-overlay opacity-50" style={{ background: styles.leftBg }}></div>
                </>
                )}

                <div className="absolute inset-0 bg-[radial-gradient(ellipse_120px_200px_at_70%_35%,rgba(255,255,255,0.1)_0%,transparent_70%)] opacity-50"></div>
                
                {/* Drag Overlay */}
                {dragOverSide === 'left' && (
                  <div className="absolute inset-0 bg-burnt-amber/20 flex items-center justify-center">
                    <div className="bg-black/80 px-4 py-2 rounded text-burnt-amber font-mono text-xs flex items-center gap-2">
                       <Upload size={14} /> DROP TO UPLOAD TRUTH
                    </div>
                  </div>
                )}

                {/* Eye Detail Left (Toggleable) */}
                {showCssFace && (
                <div 
                    className="absolute w-[42px] h-[18px] rounded-[50%] top-[38%] right-[25%]"
                    style={{
                        background: `radial-gradient(ellipse, ${styles.leftEyeColor} 30%, transparent 70%)`,
                        boxShadow: styles.leftShadow
                    }}
                ></div>
                )}

                {/* Hover Indicator */}
                <div className="absolute top-4 left-4 opacity-0 group-hover/left:opacity-100 transition-opacity duration-300 export-exclude">
                    <Info size={24} className="text-white drop-shadow-lg" />
                </div>
            </div>

            {/* RIGHT SIDE — SHADOW */}
            <div 
                className={`w-1/2 h-full relative overflow-hidden backdrop-blur-[2.5px] blur-[2.5px] cursor-pointer transition-all duration-500 group/right hover:brightness-110 hover:blur-[1px] ${dragOverSide === 'right' ? 'ring-2 ring-cyan-shadow z-30 brightness-125' : ''}`}
                style={{ 
                    background: rightImage ? '#000' : styles.rightBg,
                    transform: `translateX(${faceSpread / 2}px)` 
                }}
                onClick={(e) => { e.stopPropagation(); setActiveSide('right'); }}
                onDragOver={(e) => handleDragOver(e, 'right')}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, 'right')}
            >
            {/* User Image Render */}
            {rightImage && (
                <>
                    <img 
                        src={rightImage} 
                        alt="Right Face" 
                        className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-100 ease-out" 
                        style={{
                        transform: `scale(${config.rightImageScale}) translate(${config.rightImageX}px, ${config.rightImageY}px)`
                        }}
                    />
                    {/* Colour Grading Overlay */}
                    <div className="absolute inset-0 mix-blend-color" style={{ background: styles.rightTint }}></div>
                    <div className="absolute inset-0 mix-blend-overlay opacity-50" style={{ background: styles.rightBg }}></div>
                </>
                )}

            <div className="absolute inset-0 bg-[radial-gradient(ellipse_120px_200px_at_30%_35%,rgba(255,255,255,0.1)_0%,transparent_70%)] opacity-50"></div>
            
             {/* Drag Overlay */}
             {dragOverSide === 'right' && (
                  <div className="absolute inset-0 bg-cyan-shadow/20 flex items-center justify-center">
                    <div className="bg-black/80 px-4 py-2 rounded text-cyan-400 font-mono text-xs flex items-center gap-2">
                       <Upload size={14} /> DROP TO UPLOAD SHADOW
                    </div>
                  </div>
                )}

            {/* Eye Detail Right (Toggleable) */}
            {showCssFace && (
                <div 
                    className="absolute w-[42px] h-[18px] rounded-[50%] top-[38%] left-[25%] blur-[1px]"
                    style={{
                        background: `radial-gradient(ellipse, ${styles.rightEyeColor} 30%, transparent 70%)`,
                        boxShadow: styles.rightShadow
                    }}
                ></div>
                )}

                {/* Hover Indicator */}
                <div className="absolute top-4 right-4 opacity-0 group-hover/right:opacity-100 transition-opacity duration-300 export-exclude">
                    <Info size={24} className="text-white drop-shadow-lg" />
                </div>
            </div>

        </div>

        {/* ======================== */}
        {/* INTERACTIVE OVERLAYS     */}
        {/* ======================== */}
        {activeSide === 'left' && (
            <div className="absolute top-1/2 left-[50%] -translate-x-[120%] -translate-y-1/2 w-[300px] z-[50] animate-in fade-in slide-in-from-right-10 duration-300 export-exclude">
                <div className="bg-black/90 border-l-4 border-burnt-amber p-6 text-left shadow-2xl backdrop-blur-md">
                    <button onClick={() => setActiveSide(null)} className="absolute top-2 right-2 text-zinc-500 hover:text-white"><X size={16}/></button>
                    <h3 className="font-bebas text-3xl text-burnt-amber tracking-widest mb-2">THE TRUTH</h3>
                    <p className="font-mono text-xs text-zinc-300 leading-relaxed">
                        <strong>ANALYSIS:</strong> Present Tense.<br/>
                        <strong>STATE:</strong> Raw, unfiltered reality.<br/>
                        <strong>FOCUS:</strong> Sharp.<br/><br/>
                        "The mirror doesn't lie, but it only shows you what's in front of it right now."
                    </p>
                </div>
                {/* Connecting Line */}
                <div className="absolute top-1/2 -right-[20px] w-[20px] h-[1px] bg-burnt-amber/50"></div>
                <div className="absolute top-1/2 -right-[20px] w-2 h-2 bg-burnt-amber rounded-full -translate-y-1/2"></div>
            </div>
        )}

        {activeSide === 'right' && (
            <div className="absolute top-1/2 right-[50%] -translate-x-[120%] -translate-y-1/2 w-[300px] z-[50] animate-in fade-in slide-in-from-left-10 duration-300 export-exclude" style={{ right: 'auto', left: 'auto', transform: 'translate(120%, -50%)' }}>
                <div className="bg-black/90 border-r-4 border-cyan-shadow p-6 text-right shadow-2xl backdrop-blur-md">
                    <button onClick={() => setActiveSide(null)} className="absolute top-2 left-2 text-zinc-500 hover:text-white"><X size={16}/></button>
                    <h3 className="font-bebas text-3xl text-cyan-500 tracking-widest mb-2">THE SHADOW</h3>
                    <p className="font-mono text-xs text-zinc-300 leading-relaxed">
                        <strong>ANALYSIS:</strong> Past Tense.<br/>
                        <strong>STATE:</strong> Distorted memory.<br/>
                        <strong>FOCUS:</strong> Blurred.<br/><br/>
                        "Ghosts don't haunt places, they haunt people. This side is what you're running from."
                    </p>
                </div>
                {/* Connecting Line */}
                <div className="absolute top-1/2 -left-[20px] w-[20px] h-[1px] bg-cyan-500/50"></div>
                <div className="absolute top-1/2 -left-[20px] w-2 h-2 bg-cyan-500 rounded-full -translate-y-1/2"></div>
            </div>
        )}

        {/* ======================== */}
        {/* FACIAL STRUCTURE HINTS   */}
        {/* ======================== */}
        <div className="absolute inset-0 z-[5] pointer-events-none">
            {showCssFace && (
            <>
                {/* Nose */}
                <div className="absolute top-[42%] left-1/2 -translate-x-1/2 w-[40px] h-[70px] rounded-[50%] bg-[linear-gradient(90deg,rgba(255,255,255,0.05)_0%,transparent_100%)] opacity-30" />
                {/* Mouth */}
                <div className="absolute top-[62%] left-1/2 -translate-x-1/2 w-[80px] h-[12px] border-b-[2px] border-[rgba(100,60,20,0.25)] rounded-b-[50%]" />
                {/* Jaw Left */}
                <div 
                    className="absolute bottom-[10%] w-[120px] h-[200px] rounded-[50%] left-[15%] border-r border-[rgba(255,255,255,0.1)]" 
                    style={{ transform: `translateX(-${faceSpread / 2}px)` }}
                />
                {/* Jaw Right */}
                <div 
                    className="absolute bottom-[10%] w-[120px] h-[200px] rounded-[50%] right-[15%] border-l border-[rgba(255,255,255,0.1)] blur-[2px]" 
                    style={{ transform: `translateX(${faceSpread / 2}px)` }}
                />
            </>
            )}
        </div>

        {/* ======================== */}
        {/* GLITCH ZONE              */}
        {/* ======================== */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[20px] h-[600px] z-[25] overflow-visible pointer-events-none">
            <div className="absolute left-1/2 -translate-x-1/2 w-[2px] h-full bg-[linear-gradient(180deg,transparent_0%,rgba(245,245,240,0.1)_10%,rgba(245,245,240,0.4)_25%,rgba(212,118,10,0.6)_35%,rgba(245,245,240,0.5)_50%,rgba(10,110,110,0.6)_65%,rgba(245,245,240,0.3)_80%,rgba(245,245,240,0.1)_90%,transparent_100%)]"></div>
            
            {GLITCH_FRAGMENTS.map((gf) => (
            <div
                key={`gf-${gf.id}`}
                className="absolute"
                style={{
                width: `${gf.width}px`,
                height: `${gf.height}px`,
                top: `${gf.top}%`,
                left: `${gf.left}px`,
                backgroundColor: gf.color,
                animation: animate ? `glitchShift 3s ease-in-out infinite alternate` : 'none',
                animationDelay: `${gf.delay}s`
                }}
            />
            ))}

            {PIXEL_SCATTERS.map((px) => (
            <div
                key={`px-${px.id}`}
                className="absolute w-[4px] h-[4px]"
                style={{
                top: `${px.top}%`,
                left: `${px.left}px`,
                backgroundColor: px.color,
                opacity: px.opacity,
                animation: animate ? `pixelFlicker 2s ease-in-out infinite` : 'none',
                animationDelay: `${px.delay}s`
                }}
            />
            ))}
        </div>

      </div>

      {/* ======================== */}
      {/* OVERLAYS                 */}
      {/* ======================== */}
      
      {/* Scanlines */}
      <div className="absolute inset-0 z-[25] pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.08)_2px,rgba(0,0,0,0.08)_4px)]" />

      {/* Noise */}
      <div className="absolute inset-0 z-[27] pointer-events-none opacity-[0.04]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundSize: '128px 128px'
      }}></div>

      {/* Vignette */}
      <div className="absolute inset-0 z-[26] pointer-events-none bg-[radial-gradient(ellipse_70%_65%_at_50%_50%,transparent_0%,rgba(10,10,10,0.3)_60%,rgba(10,10,10,0.85)_100%)]"></div>

      {/* Text Layer */}
      <div className="absolute inset-0 z-[30] pointer-events-none">
        <div className={`absolute font-mono text-[13px] font-normal tracking-[8px] uppercase text-[rgba(245,245,240,0.35)] ${styles.artistPos}`}>
          {artistName}
        </div>
        
        {variant !== 'editorial' ? (
            <div 
                className={`absolute bottom-[60px] left-0 right-0 text-center ${styles.fontClass} text-[96px] ${styles.textColor} leading-none drop-shadow-[0_0_60px_rgba(212,118,10,0.4)]`}
                style={{
                  letterSpacing: `${hookLetterSpacing}px`,
                  fontWeight: hookFontWeight
                }}
            >
                <span className="drop-shadow-[0_0_120px_rgba(10,110,110,0.2)]">
                    {hookText} <span className={`${styles.accentColor} drop-shadow-[0_0_40px_rgba(212,118,10,0.6)]`}>{accentWord}</span>
                </span>
                {/* Ambient Text Glow */}
                <div 
                    className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 w-[500px] h-[80px] -z-10"
                    style={{ background: `radial-gradient(ellipse, ${styles.glowColor} 0%, transparent 70%)`}}
                ></div>
            </div>
        ) : (
            <div 
                className={`absolute bottom-[60px] left-[60px] right-auto text-left ${styles.fontClass} text-[80px] ${styles.textColor} leading-tight`}
                style={{
                  letterSpacing: `${hookLetterSpacing - 4}px`, // Slight adjustment for editorial
                  fontWeight: hookFontWeight
                }}
            >
                <span className="block italic opacity-80">{hookText}</span>
                <span className={`${styles.accentColor} not-italic font-bold block`}>{accentWord}</span>
            </div>
        )}
      </div>

      {/* ======================== */}
      {/* ANALYTICS OVERLAYS       */}
      {/* ======================== */}
      {showGrid && (
        <div className="absolute inset-0 z-[40] pointer-events-none export-exclude">
            {/* Rule of Thirds */}
            <div className="absolute top-0 left-1/3 w-px h-full bg-cyan-400 opacity-30"></div>
            <div className="absolute top-0 left-2/3 w-px h-full bg-cyan-400 opacity-30"></div>
            <div className="absolute top-1/3 left-0 w-full h-px bg-cyan-400 opacity-30"></div>
            <div className="absolute top-2/3 left-0 w-full h-px bg-cyan-400 opacity-30"></div>
        </div>
      )}

      {showSafeZones && (
        <div className="absolute inset-0 z-[40] pointer-events-none export-exclude">
            {/* YouTube Timestamp (Bottom Right) */}
            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1 rounded">
                12:45
            </div>
            {/* Safe Area Border (Approximate) */}
            <div className="absolute inset-[30px] border border-red-500/30 border-dashed"></div>
            <div className="absolute top-2 right-2 text-[10px] text-red-500/50 uppercase tracking-widest font-mono">
                UI Obstruction Zone
            </div>
        </div>
      )}

    </div>
  );
};