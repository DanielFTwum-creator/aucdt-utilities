
import React, { useState, useEffect } from 'react';
import { SlideContent, SlideImage, SlideType } from '../types';
import { Check, Edit3, Sparkles, LayoutGrid, Network } from 'lucide-react';
import { SankeyDiagram } from './SankeyDiagram';

interface SlideLayoutProps {
  slide: SlideContent;
  onOpenSandbox?: (prompt?: string, mode?: 'text' | 'image') => void;
}

const BrandColor = '#C97064';
const LOGO_URL = "https://thepitchhub.org/wp-content/uploads/2021/08/Copy-of-Untitled.svg";

const ImageCarousel: React.FC<{ images: SlideImage[], className?: string, imgClassName?: string }> = ({ images, className, imgClassName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {images.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out flex items-center justify-center bg-gray-50 ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <img
            src={img.url}
            alt={img.alt}
            loading={index === 0 ? "eager" : "lazy"}
            className={`w-full h-full ${imgClassName || 'object-cover'}`}
          />
          {img.caption && (
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4 text-center text-xl backdrop-blur-sm">
              {img.caption}
            </div>
          )}
        </div>
      ))}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
        {images.map((_, idx) => (
          <div 
            key={idx} 
            className={`h-2 w-2 rounded-full transition-all ${idx === currentIndex ? 'bg-white w-6' : 'bg-white/50'}`}
          />
        ))}
      </div>
    </div>
  );
};

export const TitleSlide: React.FC<SlideLayoutProps> = ({ slide }) => {
  const hasBgImage = !!slide.backgroundImage;
  return (
    <div className="relative h-full w-full overflow-hidden font-sans bg-white" 
      style={{ backgroundImage: hasBgImage ? `url(${slide.backgroundImage})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center 20%' }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/95 via-40% to-transparent" />
      <div className="absolute bottom-0 left-0 w-full px-12 pb-12 md:px-16 md:pb-16 z-10 flex flex-col justify-end h-full">
        <h1 className="text-7xl md:text-8xl font-bold text-[#C97064] mb-6 leading-[1.1] max-w-7xl">{slide.title}</h1>
        {slide.subtitle && <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-12 leading-tight max-w-6xl">{slide.subtitle}</h2>}
        <div className="flex items-center gap-6 border-t-2 border-slate-200 pt-6 w-full max-w-4xl">
           <img src={LOGO_URL} alt="The Pitch Hub" className="h-16 md:h-20 w-auto" />
           <div className="h-12 w-0.5 bg-slate-300"></div>
           <p className="text-slate-600 text-2xl md:text-3xl font-medium">An Initiative by The Pitch Hub</p>
        </div>
      </div>
    </div>
  );
};

export const SectionSlide: React.FC<SlideLayoutProps> = ({ slide }) => {
  const hasBgImage = !!slide.backgroundImage;
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-16 text-white overflow-hidden relative" style={{ backgroundColor: BrandColor }}>
      {hasBgImage && (
        <>
          <div className="absolute inset-0 z-0" style={{ backgroundImage: `url(${slide.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <div className="absolute inset-0 bg-black/60 z-0" />
        </>
      )}
      <div className="relative z-10 flex flex-col items-center">
        <div className="border-b-4 border-white/30 pb-8 mb-12 w-64 mx-auto shrink-0"></div>
        <h1 className="text-8xl md:text-[10rem] font-bold mb-10 leading-none">{slide.title}</h1>
        {slide.subtitle && <h2 className="text-5xl md:text-6xl font-light opacity-90 max-w-6xl leading-tight">{slide.subtitle}</h2>}
      </div>
    </div>
  );
};

export const ContentSlide: React.FC<SlideLayoutProps> = ({ slide, onOpenSandbox }) => {
  const hasCarousel = slide.images && slide.images.length > 1;
  const [formState, setFormState] = useState<Record<string, string>>({});
  const [activeField, setActiveField] = useState<string | null>(null);

  const handleInputChange = (id: string, value: string) => {
    setFormState(prev => ({ ...prev, [id]: value }));
  };

  return (
    <div className="flex flex-col h-full px-12 py-12 bg-white text-gray-800 overflow-hidden">
      <div className="mb-8 border-b-4 border-gray-100 pb-6 shrink-0 flex justify-between items-end">
        <div>
          <h2 className="text-6xl md:text-7xl font-bold text-gray-900 leading-tight">{slide.title}</h2>
          {slide.subtitle && <h3 className="text-3xl md:text-4xl text-gray-500 mt-3 font-light">{slide.subtitle}</h3>}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto flex flex-col min-h-0 pr-4">
        {hasCarousel && slide.images && slide.images[0].position !== 'bottom' && (
          <div className="mb-8 h-[350px] w-full shrink-0 rounded-2xl shadow-lg overflow-hidden">
             <ImageCarousel images={slide.images} className="w-full h-full" imgClassName="object-contain" />
          </div>
        )}
        
        {!hasCarousel && slide.mainImage && slide.mainImage.position !== 'bottom' && (
          <div className={`mb-8 ${slide.mainImage.position === 'center' ? 'flex justify-center' : ''} shrink-0`}>
             <img src={slide.mainImage.url} alt={slide.mainImage.alt} loading="eager" className="rounded-2xl shadow-lg max-h-[350px] object-contain" />
             {slide.mainImage.caption && <p className="text-xl text-gray-500 mt-3 text-center">{slide.mainImage.caption}</p>}
          </div>
        )}

        {slide.body && (
          <ul className="space-y-6 pl-2 mb-10">
            {slide.body.map((line, idx) => (
              <li key={idx} className="flex items-start text-4xl md:text-[2.75rem] text-gray-700 leading-snug">
                <span className="inline-block w-8 h-8 rounded-full bg-[#C97064] mt-5 mr-6 flex-shrink-0" />
                {line}
              </li>
            ))}
          </ul>
        )}

        {slide.interactions && (
          <div className="mt-4 grid gap-8 grid-cols-1 max-w-5xl">
            {slide.interactions.map((interaction) => {
              const isActive = activeField === interaction.id;
              const hasValue = !!formState[interaction.id];
              
              return (
              <div key={interaction.id} className="flex flex-col gap-3 group">
                <div className="flex items-center justify-between">
                  <label className={`text-3xl md:text-4xl font-semibold transition-colors duration-300 ${isActive ? 'text-[#C97064]' : 'text-gray-700'}`}>
                    {interaction.label}
                  </label>
                  <div className="flex gap-4 items-center">
                    {onOpenSandbox && (
                      <button 
                        onClick={() => onOpenSandbox(interaction.aiPromptTemplate, interaction.type === 'image-gen' ? 'image' : 'text')}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-[#C97064]/10 text-gray-600 hover:text-[#C97064] rounded-lg text-lg font-bold transition-all border border-transparent hover:border-[#C97064]/20"
                      >
                        <Sparkles size={20} /> Use AI Helper
                      </button>
                    )}
                    {hasValue && (
                      <span className="flex items-center gap-2 text-[#C97064] text-xl animate-in fade-in duration-300">
                        <Check size={24} /> <span className="text-sm uppercase tracking-wider font-bold">Captured</span>
                      </span>
                    )}
                  </div>
                </div>
                <div className="relative">
                  {interaction.type === 'textarea' ? (
                    <textarea
                      placeholder={interaction.placeholder}
                      value={formState[interaction.id] || ''}
                      onChange={(e) => handleInputChange(interaction.id, e.target.value)}
                      onFocus={() => setActiveField(interaction.id)}
                      onBlur={() => setActiveField(null)}
                      className={`w-full p-6 text-3xl border-2 rounded-xl transition-all duration-300 resize-none h-40 shadow-sm
                        ${isActive ? 'border-[#C97064] outline-none ring-4 ring-[#C97064]/20 bg-white scale-[1.01] shadow-lg' : 'border-slate-300 bg-slate-50'}
                      `}
                    />
                  ) : (
                    <input
                      type="text"
                      placeholder={interaction.placeholder}
                      value={formState[interaction.id] || ''}
                      onChange={(e) => handleInputChange(interaction.id, e.target.value)}
                      onFocus={() => setActiveField(interaction.id)}
                      onBlur={() => setActiveField(null)}
                      className={`w-full p-6 text-3xl border-2 rounded-xl transition-all duration-300 shadow-sm
                        ${isActive ? 'border-[#C97064] outline-none ring-4 ring-[#C97064]/20 bg-white scale-[1.01] shadow-lg' : 'border-slate-300 bg-slate-50'}
                      `}
                    />
                  )}
                  {isActive && <div className="absolute right-4 top-4 text-[#C97064] opacity-50 animate-pulse"><Edit3 size={28} /></div>}
                </div>
              </div>
            )})}
          </div>
        )}

        {hasCarousel && slide.images && slide.images[0].position === 'bottom' && (
          <div className="mt-8 h-[350px] w-full shrink-0 rounded-2xl shadow-lg overflow-hidden">
             <ImageCarousel images={slide.images} className="w-full h-full" imgClassName="object-contain" />
          </div>
        )}

        {!hasCarousel && slide.mainImage && slide.mainImage.position === 'bottom' && (
          <div className="mt-8 flex flex-col items-center shrink-0">
             <img src={slide.mainImage.url} alt={slide.mainImage.alt} loading="eager" className="rounded-2xl shadow-lg max-h-[350px] object-contain" />
              {slide.mainImage.caption && <p className="text-xl text-gray-500 mt-3">{slide.mainImage.caption}</p>}
          </div>
        )}
      </div>
      {slide.footer && <div className="mt-6 text-gray-400 text-xl border-t pt-4 shrink-0">{slide.footer}</div>}
    </div>
  );
};

export const UseCaseGridSlide: React.FC<SlideLayoutProps> = ({ slide, onOpenSandbox }) => {
  return (
    <div className="flex flex-col h-full px-12 py-12 bg-white text-gray-800 overflow-hidden">
      <div className="mb-10 border-b-4 border-gray-100 pb-6 flex justify-between items-center">
        <div>
          <h2 className="text-6xl md:text-7xl font-bold text-gray-900 leading-tight">{slide.title}</h2>
          {slide.subtitle && <h3 className="text-3xl md:text-4xl text-gray-500 mt-3 font-light">{slide.subtitle}</h3>}
        </div>
        <LayoutGrid size={64} className="text-[#C97064] opacity-20" />
      </div>

      <div className="flex-1 overflow-y-auto pr-4 grid grid-cols-1 md:grid-cols-2 gap-8 content-start pb-10">
        {slide.useCases?.map((uc, idx) => (
          <div key={idx} className="bg-gray-50 rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all group hover:scale-[1.01]">
            <div className="flex justify-between items-start mb-4">
              <span className="px-4 py-1 bg-[#C97064]/10 text-[#C97064] text-lg font-bold rounded-full uppercase tracking-widest">{uc.industry}</span>
              {onOpenSandbox && (
                <button 
                  onClick={() => onOpenSandbox(`Act as an AI business consultant. ${uc.promptExample}`)}
                  className="p-3 bg-white hover:bg-[#C97064] text-gray-400 hover:text-white rounded-full transition-all border border-gray-200 shadow-sm"
                  title="Try this prompt in AI Tool"
                >
                  <Sparkles size={24} />
                </button>
              )}
            </div>
            <h3 className="text-3xl font-bold mb-3 text-gray-800">{uc.title}</h3>
            <p className="text-2xl text-gray-600 mb-6 leading-relaxed">{uc.description}</p>
            
            <div className="bg-white rounded-xl p-5 border border-dashed border-gray-300 mb-4">
              <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Prompt Example</label>
              <p className="text-xl italic text-gray-500">"{uc.promptExample}"</p>
            </div>
            
            <div className="flex items-center gap-3 text-[#C97064] font-semibold text-xl">
              <Check size={20} /> Benefit: {uc.benefit}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const SankeySlide: React.FC<SlideLayoutProps> = ({ slide }) => {
  return (
    <div className="flex flex-col h-full px-12 py-12 bg-white text-gray-800 overflow-hidden">
      <div className="mb-8 border-b-4 border-gray-100 pb-6 flex justify-between items-center">
        <div>
          <h2 className="text-6xl md:text-7xl font-bold text-gray-900 leading-tight">{slide.title}</h2>
          {slide.subtitle && <h3 className="text-3xl md:text-4xl text-gray-500 mt-3 font-light">{slide.subtitle}</h3>}
        </div>
        <Network size={64} className="text-[#C97064] opacity-20" />
      </div>
      <div className="flex-1 min-h-0">
        <SankeyDiagram />
      </div>
      {slide.footer && <div className="mt-6 text-gray-400 text-xl border-t pt-4 shrink-0">{slide.footer}</div>}
    </div>
  );
};

export const SplitSlide: React.FC<SlideLayoutProps> = ({ slide }) => {
  const hasCarousel = slide.images && slide.images.length > 1;
  const carouselPosition = hasCarousel && slide.images ? slide.images[0].position : null;
  const showLeftImage = (slide.mainImage?.position === 'left') || (hasCarousel && carouselPosition === 'left');
  const showRightImage = (slide.mainImage?.position === 'right') || (hasCarousel && carouselPosition === 'right');

  return (
    <div className="flex flex-col h-full px-12 py-12 bg-white text-gray-800 overflow-hidden">
      <div className="mb-8 border-b-4 border-gray-100 pb-6 shrink-0">
        <h2 className="text-6xl md:text-7xl font-bold text-gray-900 leading-tight">{slide.title}</h2>
        {slide.subtitle && <h3 className="text-3xl md:text-4xl text-gray-500 mt-3 font-light">{slide.subtitle}</h3>}
      </div>
      
      <div className="flex-1 grid grid-cols-2 gap-12 overflow-hidden min-h-0 items-center">
        {showLeftImage ? (
           <div className="h-full max-h-[60vh] w-full rounded-3xl overflow-hidden shadow-lg relative group">
             {hasCarousel && slide.images ? <ImageCarousel images={slide.images} className="w-full h-full" /> : slide.mainImage ? <img src={slide.mainImage.url} alt={slide.mainImage.alt} loading="eager" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" /> : null}
           </div>
        ) : (
          <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-center h-full max-h-full">
            {slide.leftTitle && <h3 className="text-4xl md:text-5xl font-semibold mb-6 text-[#C97064]">{slide.leftTitle}</h3>}
            {slide.leftBody && (
              <ul className="space-y-6 overflow-hidden pr-2">
                {slide.leftBody.map((line, idx) => (
                  <li key={idx} className="flex items-start text-3xl md:text-[2.5rem] text-gray-700 leading-snug">
                    <span className="inline-block w-6 h-6 rounded-full bg-[#C97064] mt-3 mr-5 flex-shrink-0" />
                    {line}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {showRightImage ? (
           <div className="h-full max-h-[60vh] w-full rounded-3xl overflow-hidden shadow-lg relative group">
             {hasCarousel && slide.images ? <ImageCarousel images={slide.images} className="w-full h-full" /> : slide.mainImage ? <img src={slide.mainImage.url} alt={slide.mainImage.alt} loading="eager" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" /> : null}
           </div>
        ) : (
          <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-center h-full max-h-full">
            {slide.rightTitle && <h3 className="text-4xl md:text-5xl font-semibold mb-6 text-[#C97064]">{slide.rightTitle}</h3>}
            {slide.rightBody && (
              <ul className="space-y-6 overflow-hidden pr-2">
                {slide.rightBody.map((line, idx) => (
                  <li key={idx} className="flex items-start text-3xl md:text-[2.5rem] text-gray-700 leading-snug">
                     <span className="inline-block w-6 h-6 rounded-full bg-[#C97064] mt-3 mr-5 flex-shrink-0" />
                    {line}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
      {slide.footer && <div className="mt-6 text-gray-400 text-xl italic shrink-0">{slide.footer}</div>}
    </div>
  );
};

export const CTASlide: React.FC<SlideLayoutProps> = ({ slide }) => {
  const hasBgImage = !!slide.backgroundImage;
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-16 text-white relative overflow-hidden" 
      style={{ backgroundColor: BrandColor, backgroundImage: hasBgImage ? `url(${slide.backgroundImage})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {hasBgImage && <div className="absolute inset-0 bg-black/70 z-0" />}
      <div className="relative z-10 flex flex-col items-center w-full max-w-7xl h-full justify-center">
        <div className="mb-6 bg-white/95 p-6 rounded-3xl shadow-xl shrink-0">
          <img src={LOGO_URL} alt="The Pitch Hub" className="h-20 w-auto" />
        </div>
        <h1 className="text-7xl md:text-9xl font-bold mb-8 leading-none">{slide.title}</h1>
        {slide.subtitle && <div className="text-4xl md:text-5xl font-semibold mb-12 bg-white/20 backdrop-blur-md px-12 py-5 rounded-full">{slide.subtitle}</div>}
        {slide.body && (
          <div className="bg-white text-[#C97064] p-12 rounded-[3rem] shadow-2xl max-w-5xl w-full transform hover:scale-105 transition-transform duration-300">
            {slide.body.map((line, idx) => (
              <p key={idx} className={`text-3xl md:text-5xl ${idx === 0 ? 'font-bold mb-5' : 'mb-3'}`}>{line}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
