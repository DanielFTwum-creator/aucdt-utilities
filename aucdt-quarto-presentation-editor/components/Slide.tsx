import React from 'react';
import { markdownToHtml } from '../services/parser';
import type { Frontmatter } from '../types';

interface SlideProps {
  content: string | Frontmatter;
  isActive: boolean;
  isTitleSlide: boolean;
}

const Slide: React.FC<SlideProps> = ({ content, isActive, isTitleSlide }) => {
  const classNames = `slide ${isTitleSlide ? 'title-slide' : ''} ${isActive ? 'active' : ''}`;
  
  let slideInnerHtml: string;

  if (isTitleSlide) {
    const fm = content as Frontmatter;
    slideInnerHtml = `
      <div>
        ${fm.title ? `<h1>${fm.title}</h1>` : ''}
        ${fm.subtitle ? `<h2 class="subtitle">${fm.subtitle}</h2>` : ''}
        ${fm.author ? `<p class="author">${fm.author}</p>` : ''}
      </div>
    `;
  } else {
    slideInnerHtml = markdownToHtml(content as string);
  }

  const wrapperProps = {
    className: classNames,
  };

  const contentWrapper = isTitleSlide 
    ? <div dangerouslySetInnerHTML={{ __html: slideInnerHtml }} />
    : <div className="slide-content" dangerouslySetInnerHTML={{ __html: slideInnerHtml }} />;

  return React.createElement('div', wrapperProps, contentWrapper);
};

export default Slide;
