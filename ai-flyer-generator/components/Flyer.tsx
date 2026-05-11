import React from 'react';
import type { FlyerData, TextElement } from '../types';

interface FlyerProps {
  imageUrl: string;
  flyerData: FlyerData;
}

const getTextColorClass = (colorName: string | undefined) => {
  switch (colorName) {
    case 'primaryText': return 'text-primary-text';
    case 'goldAccent': return 'text-gold-accent';
    default: return 'text-white';
  }
};

const getButtonColorClass = (colorName: string | undefined) => {
    switch (colorName) {
      case 'burgundyPrimary': return 'bg-burgundy-primary hover:opacity-90 text-white';
      case 'goldAccent': return 'bg-gold-accent hover:opacity-90 text-primary-text';
      default: return 'bg-gray-500 hover:bg-gray-600 text-white';
    }
}

// SVG Icons for Social Media
const InstagramIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44 1.441-.645 1.441-1.44c0-.795-.645-1.44-1.441-1.44z"></path>
    </svg>
);
const XIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 16 16">
      <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z" />
    </svg>
);
const LinkedInIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
);
  
const getSocialIcon = (platform: 'instagram' | 'x' | 'linkedin') => {
    switch(platform) {
        case 'instagram': return <InstagramIcon />;
        case 'x': return <XIcon />;
        case 'linkedin': return <LinkedInIcon />;
        default: return null;
    }
}

const renderTextElement = (element: TextElement, index: number) => {
  const sizeClass = element.size === 'large' ? 'text-4xl' : 'text-base';
  const weightClass = element.weight === 'bold' ? 'font-bold' : 'font-normal';
  const textColorClass = getTextColorClass(element.color);
  
  switch (element.type) {
    case 'headline':
      return <h1 key={index} className={`mb-4 leading-tight ${sizeClass} ${weightClass} ${textColorClass}`}>{element.text}</h1>;
    case 'subheading':
      return <p key={index} className={`mb-8 ${sizeClass} ${weightClass} ${textColorClass}`}>{element.text}</p>;
    case 'bullet':
      return (
        <div key={index} className="flex items-center mb-6">
          <svg className="w-6 h-6 mr-3 text-burgundy-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span className={`text-primary-text`}>{element.text}</span>
        </div>
      );
    case 'divider':
      return <hr key={index} className="my-4 border-t border-warm-beige" />;
    case 'social_links':
      return (
        <div key={index} className="text-center">
          <p className="text-sm font-semibold text-primary-text mb-3">{element.text}</p>
          <div className="flex justify-center items-center gap-4">
            {element.links?.map(link => (
              <div key={link.platform} className="flex items-center gap-2 text-primary-text hover:text-burgundy-primary transition-colors cursor-pointer">
                {getSocialIcon(link.platform)}
                <span className="text-xs font-medium">{link.handle}</span>
              </div>
            ))}
          </div>
        </div>
      );
    default:
      return null;
  }
};

const Flyer: React.FC<FlyerProps> = ({ imageUrl, flyerData }) => {
  const { text_elements, column_widths } = flyerData;
  const rightColumnButtons = text_elements.filter(el => el.type === 'button');

  return (
    <div id="flyer-container" className="w-full max-w-sm rounded-lg shadow-2xl overflow-hidden bg-white flex" style={{ aspectRatio: '9 / 16' }}>
      <div className="bg-cover bg-center" style={{ width: column_widths.left, backgroundImage: `url(${imageUrl})` }}>
        {/* Image column */}
      </div>
      <div className="p-8 flex flex-col justify-between" style={{ width: column_widths.right }}>
        <div>
          {text_elements.map((el, i) => el.type !== 'button' && renderTextElement(el, i))}
        </div>
        <div className="flex gap-4">
          {rightColumnButtons.map((btn, i) => (
             <button key={i} className={`w-full p-3 rounded font-bold text-sm ${getButtonColorClass(btn.color)}`}>
                {btn.text}
             </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Flyer;