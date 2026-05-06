import React, { useState, useEffect, useMemo } from 'react';
import { AppItem, Category } from '../types';
import { ResearchIcon, DevelopmentIcon, AnalysisIcon, EducationIcon } from './icons';

interface AppCardProps {
  app: AppItem;
  index: number;
}

const categoryStyles: { [key in Category]: { badge: string; icon: React.ReactNode; bgColor: string; textColor: string; } } = {
  [Category.Research]: { badge: 'bg-[var(--color-badge-research-bg)] text-[var(--color-badge-research-text)]', icon: <ResearchIcon />, bgColor: '#DBEAFE', textColor: '#1E40AF' },
  [Category.Development]: { badge: 'bg-[var(--color-badge-development-bg)] text-[var(--color-badge-development-text)]', icon: <DevelopmentIcon />, bgColor: '#EEDCFF', textColor: '#5B21B6' },
  [Category.Analysis]: { badge: 'bg-[var(--color-badge-analysis-bg)] text-[var(--color-badge-analysis-text)]', icon: <AnalysisIcon />, bgColor: '#D1FAE5', textColor: '#065F46' },
  [Category.Education]: { badge: 'bg-[var(--color-badge-education-bg)] text-[var(--color-badge-education-text)]', icon: <EducationIcon />, bgColor: '#FEF3C7', textColor: '#92400E' },
};

const generateSvgPlaceholder = (category: Category, title: string): string => {
    const { bgColor, textColor } = categoryStyles[category];
    const initial = title.charAt(0).toUpperCase();
    const svg = `
        <svg width="600" height="400" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="${bgColor}" />
            <text
                x="50%"
                y="50%"
                dominant-baseline="middle"
                text-anchor="middle"
                font-family="Inter, sans-serif"
                font-size="120"
                font-weight="bold"
                fill="${textColor}"
            >
                ${initial}
            </text>
        </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
};


const AppCard: React.FC<AppCardProps> = ({ app, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [imageStatus, setImageStatus] = useState<'loading' | 'loaded' | 'error'>(
    app.imageUrl ? 'loading' : 'loaded' // No loading state if there's no URL
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 50); // Staggered delay
    return () => clearTimeout(timer);
  }, [index]);

  const imageSrc = useMemo(() => {
    if (imageStatus === 'error' || !app.imageUrl) {
        return generateSvgPlaceholder(app.category, app.title);
    }
    return app.imageUrl;
  }, [imageStatus, app.imageUrl, app.category, app.title]);

  const { badge, icon } = categoryStyles[app.category];

  return (
    <div className={`
      group relative transition-all duration-500 ease-in-out
      ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
    `}>
      <div className={`
        bg-[var(--color-card-bg)] border border-[var(--color-card-border)] rounded-lg shadow-md group-hover:shadow-xl 
        transition-all duration-300 ease-in-out transform group-hover:-translate-y-1 group-hover:scale-[1.03]
        flex flex-col h-full overflow-hidden
      `}>
        <div className="aspect-video w-full bg-[var(--color-card-border)] relative overflow-hidden">
            {imageStatus === 'loading' && (
              <div className="absolute inset-0 w-full h-full bg-[var(--color-card-border)] shimmer"></div>
            )}
            <img 
                src={imageSrc} 
                alt={`${app.title} preview`} 
                className={`w-full h-full object-cover transition-opacity duration-300 ${imageStatus === 'loading' ? 'opacity-0' : 'opacity-100'}`}
                onLoad={() => setImageStatus('loaded')}
                onError={() => setImageStatus('error')}
            />
        </div>

        <div className="p-6 flex-grow flex flex-col">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4 flex-1 min-w-0">
                <div className="text-[var(--color-text)] h-8 w-8 flex-shrink-0">{icon}</div>
                <h3 className="text-lg font-bold text-[var(--color-text)] leading-tight truncate">{app.title}</h3>
            </div>
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${badge} ml-2 flex-shrink-0`}>
              {app.category}
            </span>
          </div>
          <p className="mt-4 text-[var(--color-text-muted)] text-sm leading-relaxed max-h-20 group-hover:max-h-64 overflow-hidden transition-all duration-300 ease-in-out flex-grow">
            {app.description}
          </p>
        </div>
        <div className="bg-[var(--color-card-footer-bg)] p-4 rounded-b-lg mt-auto">
          <a
            href={app.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full relative overflow-hidden inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-accent)] transition-transform duration-200 ease-out transform hover:-translate-y-0.5 active:translate-y-0 group"
          >
            Launch App
            <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            <span className="absolute inset-0 shimmer group-hover:animate-none"></span>
          </a>
        </div>
      </div>
      
      {/* Tooltip */}
      <div role="tooltip" className={`
        absolute bottom-full left-1/2 z-20 mb-3 w-72 max-w-xs -translate-x-1/2 transform rounded-lg bg-[var(--color-tooltip-bg)] p-3 text-sm text-[var(--color-tooltip-text)] shadow-xl
        opacity-0 transition-opacity duration-300
        invisible group-hover:opacity-100 group-hover:visible pointer-events-none
      `}>
        <p className="mb-2 pb-2 font-semibold text-base border-b border-white/20">{app.title}</p>
        <p className="mb-2 text-inherit opacity-80">{app.description}</p>
        <p className="text-xs text-[var(--color-accent)] font-mono break-all">{app.url}</p>
        <div className="absolute top-full left-1/2 h-0 w-0 -translate-x-1/2 border-x-8 border-x-transparent border-t-8 border-t-[var(--color-tooltip-bg)]"></div>
      </div>
    </div>
  );
};

export default AppCard;