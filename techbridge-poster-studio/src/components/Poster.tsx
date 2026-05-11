import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink } from 'lucide-react';
import { PosterData, AspectRatio } from '../types';
import { TOKENS, getPosterDimensions, getLogoSize, getStatsBarHeight, getStripHeight, getHeadlineSizeClass } from '../constants';

interface Props {
  data: PosterData;
  forceVisible?: boolean;
}

const Poster: React.FC<Props> = ({ data, forceVisible }) => {
  const [index, setIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(forceVisible || false);
  
  const dimensions = getPosterDimensions(data.aspectRatio);
  const items = [
    { type: 'image', url: data.logoUrl },
    ...(data.showVideo && data.videoUrl ? [{ type: 'video', url: data.videoUrl }] : [])
  ];

  useEffect(() => {
    if (forceVisible) {
      setIsVisible(true);
      return;
    }
    setIsVisible(false);
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, [data.aspectRatio, forceVisible]);

  useEffect(() => {
    if (items.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [items.length]);

  const logoSize = getLogoSize(data.aspectRatio);
  const statsBarHeight = getStatsBarHeight(data.aspectRatio);
  const stripHeight = getStripHeight(data.aspectRatio);

  const statsBg = data.aspectRatio === AspectRatio.STORY || data.aspectRatio === AspectRatio.CINEMA 
    ? 'bg-tuc-espresso-deep' 
    : data.aspectRatio === AspectRatio.SQUARE 
      ? 'bg-[#100604]' 
      : 'bg-tuc-espresso';

  const headlineFontSize = getHeadlineSizeClass(data.aspectRatio);

  const LogoContainer = () => {
    const [logoError, setLogoError] = useState(false);
    
    return (
      <div 
        className="bg-tuc-parchment border border-tuc-crimson flex items-center justify-center overflow-hidden shrink-0 shadow-sm"
        style={{ 
          width: logoSize, 
          height: logoSize, 
          borderRadius: '18%' 
        }}
      >
        <AnimatePresence mode="wait">
          {items[index]?.type === 'image' && !logoError ? (
            <motion.img 
              key="logo"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              src={data.logoUrl} 
              alt={data.brandName} 
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
              onError={() => setLogoError(true)}
              className="w-[85%] h-[85%] object-contain"
            />
          ) : items[index]?.type === 'image' && logoError ? (
            <motion.div
              key="fallback"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center text-center p-2"
            >
               <span className="text-tuc-crimson font-black text-[10px] leading-tight tracking-tighter">TECHBRIDGE</span>
               <div className="w-4 h-[1px] bg-tuc-gold my-1"></div>
               <span className="text-[6px] font-bold text-slate-400">TUK</span>
            </motion.div>
          ) : (
            <motion.video
              key="video"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            src={data.videoUrl}
            autoPlay muted loop playsInline
            className="w-full h-full object-cover"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

  const StatsBar = () => {
    const isStory = data.aspectRatio === AspectRatio.STORY;
    const isCinema = data.aspectRatio === AspectRatio.CINEMA;
    const isSquare = data.aspectRatio === AspectRatio.SQUARE;
    
    const dividerHeight = {
      [AspectRatio.CINEMA]: '40%',
      [AspectRatio.LANDSCAPE]: '70%',
      [AspectRatio.PORTRAIT]: '70%',
      [AspectRatio.SQUARE]: '50%',
      [AspectRatio.STORY]: '70%'
    }[data.aspectRatio] || '70%';

    const statsBarLabelSize = isStory ? '12px' : '11.5px';

    return (
      <div 
        className={`flex ${statsBg} relative shrink-0 overflow-hidden ${isStory ? 'w-full' : 'mx-0 mb-0'} animate-slide-up ${isVisible ? 'visible' : ''}`} 
        style={{ height: statsBarHeight, transitionDelay: '700ms' }}
      >
        {[
          { v: data.stat1Value, l: data.stat1Label },
          { v: data.stat2Value, l: data.stat2Label },
          { v: data.stat3Value, l: data.stat3Label }
        ].map((stat, i) => (
          <div key={i} className={`flex-1 flex ${isStory ? 'flex-col' : 'flex-col gap-1'} items-center justify-center relative px-6 min-w-0 overflow-hidden`}>
            <span className="font-serif text-tuc-gold font-bold leading-none shrink-0" style={{ fontSize: isStory ? '32px' : isSquare ? '22px' : '28px' }}>{stat.v}</span>
            <span className="text-[#888888] font-sans tracking-[0.1em] leading-tight uppercase shrink-0 whitespace-nowrap" style={{ fontSize: statsBarLabelSize }}>{stat.l}</span>
            {i < 2 && (
              <div 
                className="absolute right-0 top-1/2 -translate-y-1/2 w-[0.5px] bg-white/20" 
                style={{ height: dividerHeight }}
              />
            )}
          </div>
        ))}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-tuc-gold/30 to-transparent" />
      </div>
    );
  };

  const UrgencyStrip = () => {
    const isSquare = data.aspectRatio === AspectRatio.SQUARE;
    return (
      <div 
        className={`bg-tuc-crimson flex items-center overflow-hidden shrink-0 marquee-mask animate-slide-down ${isVisible ? 'visible' : ''}`} 
        style={{ height: stripHeight }}
      >
        {isSquare ? (
          <div className="w-full text-center">
            <span className="font-condensed text-[9px] font-medium text-white/90 tracking-[0.3em] uppercase">
              {data.urgencyText}
            </span>
          </div>
        ) : (
          <div className="flex items-center shrink-0">
            <div className="animate-marquee whitespace-nowrap flex items-center shrink-0">
              {[1, 2].map((group) => (
                <div key={group} className="flex items-center shrink-0">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                    <div key={i} className="flex items-center shrink-0 whitespace-nowrap">
                      <span className="font-condensed text-[12px] font-medium text-[#FAF7F0] tracking-[-0.04em] uppercase mx-4">
                        {data.urgencyText}
                      </span>
                      <span className="text-tuc-gold text-[0.8em] mx-2">✦</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const CTAButton = () => {
    const isStory = data.aspectRatio === AspectRatio.STORY;
    if (isStory) {
      return (
        <a 
          href={data.ctaUrl}
          className="w-full h-[52px] bg-tuc-crimson text-tuc-parchment flex items-center justify-center gap-2 rounded-sm"
        >
          <span className="font-sans font-bold text-[18px]">{data.ctaText}</span>
          <span className="text-[20px]">→</span>
        </a>
      );
    }

    const cardStyle = data.aspectRatio === AspectRatio.LANDSCAPE || data.aspectRatio === AspectRatio.SQUARE;
    const isLandscape = data.aspectRatio === AspectRatio.LANDSCAPE;
    const isPortrait = data.aspectRatio === AspectRatio.PORTRAIT;
    const isSquare = data.aspectRatio === AspectRatio.SQUARE;

    if (isLandscape) {
      return (
        <div 
          className={`bg-[#FFFDF4] border border-[#C8B898]/30 flex flex-col p-[16px_20px] rounded-[16px_4px_16px_4px] shadow-sm max-w-[280px] animate-in ${isVisible ? 'visible' : ''}`}
          style={{ 
            background: 'radial-gradient(circle at center, #FBF3DC 0%, transparent 100%)',
            '--dur': '380ms',
            transitionDelay: '600ms'
          } as any}
        >
          <div className="font-condensed font-medium text-[9px] tracking-[0.1em] text-tuc-crimson uppercase mb-[6px]">
            SECURE ADMISSION
          </div>
          <div className="font-mono font-light text-[13px] text-tuc-text-muted mb-[10px] whitespace-nowrap overflow-hidden text-ellipsis">
            {data.ctaUrl.replace(/^https?:\/\//, '')} →
          </div>
          <a 
            href={data.ctaUrl}
            className="group cta-sweep border-[1.5px] border-tuc-crimson text-tuc-crimson transition-all duration-[220ms] ease-out flex items-center justify-center py-2 px-4 w-fit rounded-sm font-condensed font-semibold text-[12px] tracking-[0.08em] uppercase whitespace-nowrap bg-transparent overflow-hidden"
          >
            <span className="relative z-10">{data.ctaText}</span>
          </a>
        </div>
      );
    }

    return (
      <a 
        href={data.ctaUrl}
        className={`group cta-sweep border border-tuc-crimson text-tuc-crimson transition-all duration-300 flex flex-col items-center justify-center gap-1 py-4 px-8 ${(isPortrait || isSquare) ? 'w-full h-[72px]' : 'w-fit'} ${cardStyle ? 'rounded-[16px_4px_16px_4px]' : 'rounded-sm'}`}
      >
        <span className="font-sans font-bold uppercase tracking-widest text-[14px]">{data.ctaText}</span>
      </a>
    );
  };

  const InstitutionLockup = ({ alignment = 'center', fontSize = '12px' }: { alignment?: 'center' | 'left', fontSize?: string }) => (
    <div className={`mt-2 ${alignment === 'center' ? 'text-center' : 'text-left'}`}>
      <div 
        className="font-sans font-bold text-tuc-text-muted uppercase tracking-[0.18em] leading-relaxed"
        style={{ fontSize }}
      >
        {data.brandName.toUpperCase().replace(' UNIVERSITY COLLEGE', '').replace('UNIVERSITY COLLEGE', '')}
        <br />UNIVERSITY COLLEGE
      </div>
      <div className="font-mono font-light text-tuc-crimson text-[11px] mt-2">{data.domainUrl}</div>
    </div>
  );

  const renderContent = () => {
    switch (data.aspectRatio) {
      case AspectRatio.CINEMA:
        return (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 flex px-[32px] items-center relative">
               <div className="w-[55%] pr-12 flex flex-col justify-center gap-8">
                  <div 
                    className={`flex items-center gap-3 mb-2 animate-in-left ${isVisible ? 'visible' : ''}`}
                    style={{ '--dur': '350ms', transitionDelay: '180ms' } as any}
                  >
                    <div className="w-[2px] h-4 bg-tuc-gold"></div>
                    <div className="font-sans text-tuc-text-muted text-[13px] font-bold uppercase tracking-widest">
                      {data.eyebrow}
                    </div>
                  </div>
                  <h1 className="font-serif leading-[0.95] tracking-[-0.03em]" style={{ fontSize: headlineFontSize }}>
                    <span className={`block animate-in ${isVisible ? 'visible' : ''}`} style={{ '--dur': '420ms', transitionDelay: '280ms' } as any}>{data.headlineLine1}</span>
                    <span className={`text-tuc-crimson italic relative top-[3px] block animate-in ${isVisible ? 'visible' : ''}`} style={{ '--dur': '420ms', transitionDelay: '380ms' } as any}>{data.headlineLine2}</span>
                    <span className={`block animate-in ${isVisible ? 'visible' : ''}`} style={{ '--dur': '420ms', transitionDelay: '480ms' } as any}>{data.headlineLine3}</span>
                  </h1>
                  <div 
                    className={`animate-in ${isVisible ? 'visible' : ''}`}
                    style={{ '--dur': '380ms', transitionDelay: '600ms' } as any}
                  >
                    <CTAButton />
                  </div>
               </div>
               
               <div className="w-[0.5px] h-3/5 bg-[rgba(200,184,152,0.3)] absolute left-[55%] top-1/2 -translate-y-1/2" />
               
                <div 
                  className={`w-[45%] pl-12 flex flex-col items-center justify-center gap-6 animate-in-right ${isVisible ? 'visible' : ''}`}
                  style={{ '--dur': '380ms', transitionDelay: '500ms' } as any}
                >
                   <LogoContainer />
                   <InstitutionLockup alignment="center" fontSize="10px" />
                </div>
            </div>
            <StatsBar />
          </div>
        );

      case AspectRatio.STORY:
        return (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 flex flex-col px-[20px] py-[28px] gap-8">
              <div 
                className={`flex items-center gap-2 mb-2 animate-in-left ${isVisible ? 'visible' : ''}`}
                style={{ '--dur': '350ms', transitionDelay: '180ms' } as any}
              >
                <LogoContainer />
                <div className="flex items-center gap-1.5 flex-1 border-l-[1.5px] border-tuc-gold pl-2">
                  <div className="font-sans text-tuc-text-muted text-[11px] font-bold uppercase tracking-wider truncate">
                    {data.eyebrow}
                  </div>
                </div>
              </div>
              
              <h1 className="font-serif leading-[1.0] tracking-[-0.03em]" style={{ fontSize: headlineFontSize }}>
                <span className={`block animate-in ${isVisible ? 'visible' : ''}`} style={{ '--dur': '420ms', transitionDelay: '280ms' } as any}>{data.headlineLine1}</span>
                <span className={`text-tuc-crimson italic relative top-[3px] block animate-in ${isVisible ? 'visible' : ''}`} style={{ '--dur': '420ms', transitionDelay: '380ms' } as any}>{data.headlineLine2}</span>
                <span className={`block animate-in ${isVisible ? 'visible' : ''}`} style={{ '--dur': '420ms', transitionDelay: '480ms' } as any}>{data.headlineLine3}</span>
              </h1>
              
              <div 
                className={`mt-auto space-y-6 animate-in ${isVisible ? 'visible' : ''}`}
                style={{ '--dur': '380ms', transitionDelay: '600ms' } as any}
              >
                <CTAButton />
                <div className="font-mono text-tuc-crimson text-[13px] text-center">{data.domainUrl}</div>
              </div>
            </div>
            <StatsBar />
          </div>
        );

      case AspectRatio.PORTRAIT:
        return (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 flex flex-col items-center text-center px-[24px] py-[20px] gap-6">
              <div 
                className={`flex items-center gap-2 mb-2 border-l-2 border-tuc-gold pl-3 animate-in-left ${isVisible ? 'visible' : ''}`}
                style={{ '--dur': '350ms', transitionDelay: '180ms' } as any}
              >
                <div className="font-sans text-tuc-text-muted text-[13px] font-bold uppercase tracking-widest">
                  {data.eyebrow}
                </div>
              </div>
              
              <h1 className="font-serif leading-[0.95] tracking-[-0.03em]" style={{ fontSize: headlineFontSize }}>
                <span className={`block animate-in ${isVisible ? 'visible' : ''}`} style={{ '--dur': '420ms', transitionDelay: '280ms' } as any}>{data.headlineLine1}</span>
                <span className={`text-tuc-crimson italic relative top-[3px] block animate-in ${isVisible ? 'visible' : ''}`} style={{ '--dur': '420ms', transitionDelay: '380ms' } as any}>{data.headlineLine2}</span>
                <span className={`block animate-in ${isVisible ? 'visible' : ''}`} style={{ '--dur': '420ms', transitionDelay: '480ms' } as any}>{data.headlineLine3}</span>
              </h1>

              <div 
                className={`flex flex-col items-center gap-4 my-4 animate-in-right ${isVisible ? 'visible' : ''}`}
                style={{ '--dur': '380ms', transitionDelay: '500ms' } as any}
              >
                <div className="mb-2">
                  <LogoContainer />
                </div>
                <InstitutionLockup alignment="center" fontSize="11px" />
              </div>

              <div 
                className={`w-full mt-auto mb-4 animate-in ${isVisible ? 'visible' : ''}`}
                style={{ '--dur': '380ms', transitionDelay: '600ms' } as any}
              >
                <CTAButton />
              </div>
            </div>
            <StatsBar />
          </div>
        );

      case AspectRatio.SQUARE:
        return (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 flex flex-col px-[20px] py-10 gap-8">
              <div 
                className={`flex items-center gap-3 animate-in-left ${isVisible ? 'visible' : ''}`}
                style={{ '--dur': '350ms', transitionDelay: '180ms' } as any}
              >
                <LogoContainer />
                <div className="flex items-center gap-2 flex-1 mb-2 border-l-2 border-tuc-gold pl-2">
                  <div className="font-sans text-tuc-text-muted text-[13px] font-bold uppercase tracking-widest truncate">
                    {data.eyebrow}
                  </div>
                </div>
              </div>
              
              <h1 className="font-serif leading-[0.95] tracking-[-0.03em]" style={{ fontSize: headlineFontSize }}>
                <span className={`block animate-in ${isVisible ? 'visible' : ''}`} style={{ '--dur': '420ms', transitionDelay: '280ms' } as any}>{data.headlineLine1}</span>
                <span className={`text-tuc-crimson italic relative top-[3px] block animate-in ${isVisible ? 'visible' : ''}`} style={{ '--dur': '420ms', transitionDelay: '380ms' } as any}>{data.headlineLine2}</span>
                <span className={`block animate-in ${isVisible ? 'visible' : ''}`} style={{ '--dur': '420ms', transitionDelay: '480ms' } as any}>{data.headlineLine3}</span>
              </h1>

              <div 
                className={`mt-auto space-y-8 animate-in ${isVisible ? 'visible' : ''}`}
                style={{ '--dur': '380ms', transitionDelay: '600ms' } as any}
              >
                <CTAButton />
                <div className="font-mono text-tuc-crimson text-[13px]">{data.domainUrl}</div>
              </div>
            </div>
            <StatsBar />
          </div>
        );

      case AspectRatio.LANDSCAPE:
      default:
        return (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 flex p-[24px] items-stretch">
              <div className="flex-[7] flex flex-col justify-center pr-12">
                <div 
                  className={`flex items-center gap-2 mb-[10px] border-l-2 border-tuc-gold pl-2 animate-in-left ${isVisible ? 'visible' : ''}`}
                  style={{ '--dur': '350ms', transitionDelay: '180ms' } as any}
                >
                  <div className="font-condensed text-tuc-text-muted text-[11px] font-medium uppercase tracking-[0.08em]">
                    LIMITED INTAKE · JULY 26 COHORT
                  </div>
                </div>
                <h1 className="font-serif leading-[0.95] tracking-[-0.03em] flex flex-col" style={{ fontSize: headlineFontSize }}>
                  <span className={`block animate-in ${isVisible ? 'visible' : ''}`} style={{ '--dur': '420ms', transitionDelay: '280ms' } as any}>{data.headlineLine1}</span>
                  <span className={`text-tuc-crimson italic relative top-[3px] block animate-in ${isVisible ? 'visible' : ''}`} style={{ '--dur': '420ms', transitionDelay: '380ms' } as any}>{data.headlineLine2}</span>
                  <span className={`block animate-in ${isVisible ? 'visible' : ''}`} style={{ '--dur': '420ms', transitionDelay: '480ms' } as any}>{data.headlineLine3}</span>
                  {data.headlineLine4 && <span className={`block animate-in ${isVisible ? 'visible' : ''}`} style={{ '--dur': '420ms', transitionDelay: '580ms' } as any}>{data.headlineLine4}</span>}
                </h1>
                <div className="mt-6">
                  <CTAButton />
                </div>
              </div>

              <div className="flex-[3] flex flex-col items-center justify-center pl-12 border-l border-tuc-gold/10">
                <div 
                  className={`flex flex-col items-center animate-in-right ${isVisible ? 'visible' : ''}`}
                  style={{ '--dur': '380ms', transitionDelay: '500ms' } as any}
                >
                  <LogoContainer />
                  <div className="flex flex-col items-center gap-1 mt-2">
                    <div className="font-sans font-bold text-tuc-text-muted uppercase tracking-[0.18em] text-[10px] leading-relaxed text-center">
                      {data.brandName.toUpperCase().replace(' UNIVERSITY COLLEGE', '').replace('UNIVERSITY COLLEGE', '')}
                      <br />UNIVERSITY COLLEGE
                    </div>
                    <div className="font-mono font-light text-tuc-crimson text-[11px] text-center">{data.domainUrl}</div>
                  </div>
                </div>
              </div>
            </div>
            <StatsBar />
          </div>
        );
    }
  };

  const [watermarkError, setWatermarkError] = useState(false);

  return (
    <div 
      id="poster-target"
      style={{ width: dimensions.width, height: dimensions.height }}
      className="bg-tuc-parchment rounded-none overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.2)] flex flex-col font-sans relative"
    >
      <UrgencyStrip />
      {!watermarkError && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0 opacity-[0.04]">
          <img 
            src={data.logoUrl} 
            alt="" 
            className="w-[120%] h-[120%] object-contain" 
            style={{ transform: 'rotate(-10deg) scale(1.2)' }}
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
            onError={() => setWatermarkError(true)}
          />
        </div>
      )}
      {renderContent()}
    </div>
  );
};

export default Poster;
