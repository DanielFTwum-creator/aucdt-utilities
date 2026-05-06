
import React from 'react';
import { VariationStyle } from '../data/catalog';

interface ThumbnailPreviewProps {
  title: string;
  style: VariationStyle;
  theme: string;
  className?: string;
  customBackground?: string | null;
}

export const ThumbnailPreview: React.FC<ThumbnailPreviewProps> = ({ title, style, theme, className = '', customBackground }) => {
  // Extract a short title for the thumbnail text if it's too long
  const shortTitle = title.split(' - ')[0].toUpperCase();

  // Determine background based on theme keywords
  let bgClass = 'bg-neutral-900';
  if (theme.includes('Ghana')) bgClass = 'bg-gradient-to-br from-red-900 via-yellow-900 to-green-900';
  else if (theme.includes('African')) bgClass = 'bg-gradient-to-br from-yellow-700 via-orange-900 to-black';
  else if (theme.includes('Russian') || theme.includes('Mystic')) bgClass = 'bg-gradient-to-br from-slate-900 via-blue-950 to-black';
  else if (theme.includes('Studio')) bgClass = 'bg-gradient-to-br from-zinc-800 via-zinc-900 to-black';

  // Determine text style
  const textStyle: React.CSSProperties = {
    fontFamily: 'Impact, sans-serif', // Classic YouTube thumbnail font
    lineHeight: 1,
    textAlign: 'center',
    width: '100%',
  };

  if (style === 'Golden Glow') {
    textStyle.color = 'white';
    textStyle.textShadow = '0 0 10px #FFD700, 0 0 20px #FFD700, 0 0 30px #FFD700, 2px 2px 4px black';
    // Top positioned
    textStyle.marginTop = '12%';
  } else if (style === 'Thick Outline') {
    textStyle.color = 'white';
    textStyle.WebkitTextStroke = '3px black'; // Scaled down for preview
    textStyle.paintOrder = 'stroke fill';
    // Centre positioned
    textStyle.display = 'flex';
    textStyle.alignItems = 'center';
    textStyle.justifyContent = 'center';
    textStyle.height = '100%';
  } else if (style === 'Red Glow') {
    textStyle.color = 'white';
    textStyle.textShadow = '0 0 10px #FF5050, 0 0 20px #FF5050, 2px 2px 4px black';
    // Top positioned
    textStyle.marginTop = '12%';
  } else if (style === 'Clean Shadow') {
    textStyle.color = 'white';
    textStyle.textShadow = '4px 4px 6px rgba(0,0,0,0.8)';
    // Centre positioned
    textStyle.display = 'flex';
    textStyle.alignItems = 'center';
    textStyle.justifyContent = 'center';
    textStyle.height = '100%';
  }

  return (
    <div className={`aspect-video w-full overflow-hidden relative ${!customBackground ? bgClass : 'bg-black'} ${className}`}>
      {/* Custom Background */}
      {customBackground && (
        <div className="absolute inset-0">
          {customBackground.startsWith('blob:http') || customBackground.match(/\.(jpeg|jpg|gif|png)$/) != null ? (
             <img src={customBackground} alt="Background" className="w-full h-full object-cover opacity-80" />
          ) : (
             <video src={customBackground} className="w-full h-full object-cover opacity-80" autoPlay muted loop playsInline />
          )}
        </div>
      )}

      {/* Background Pattern Overlay (only if no custom background) */}
      {!customBackground && (
        <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      )}
      
      {/* Text Container */}
      <div className="absolute inset-0 p-4 flex flex-col z-10">
        <div style={textStyle} className="text-3xl md:text-4xl font-bold tracking-tighter">
          {shortTitle}
        </div>
      </div>

      {/* Badge */}
      <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] px-1 rounded z-20">
        HD
      </div>
    </div>
  );
};
