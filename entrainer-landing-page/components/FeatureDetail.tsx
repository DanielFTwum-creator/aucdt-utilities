
import React from 'react';
import { FeatureDetailContent } from '../types';

interface FeatureDetailProps {
  content: FeatureDetailContent;
  imagePosition: 'left' | 'right';
}

const FeatureDetail: React.FC<FeatureDetailProps> = ({ content, imagePosition }) => {
  const isImageLeft = imagePosition === 'left';
  
  const imageDiv = (
    <div className={`w-full md:w-5/12 ${isImageLeft ? 'md:pr-8' : 'md:pl-8'} flex items-center justify-center`}>
        <img src={content.imageUrl} alt={content.imageAlt} className="max-w-sm w-full" />
    </div>
  );

  const textDiv = (
    <div className={`w-full md:w-7/12 ${isImageLeft ? 'md:pl-8' : 'md:pr-8'}`}>
      <h3 className="text-3xl font-bold text-gray-800 mb-4">{content.title}</h3>
      {content.paragraphs.map((p, i) => (
        <p key={i} className="text-lg text-gray-600 mb-4 leading-relaxed">{p}</p>
      ))}
      <a href={content.buttonUrl} className="inline-block mt-4 text-[#325766] font-semibold border-b-2 border-[#325766] hover:text-[#243f4d] hover:border-[#243f4d] transition">
        {content.buttonText}
      </a>
    </div>
  );

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className={`flex flex-wrap items-center ${isImageLeft ? 'flex-row-reverse' : ''}`}>
          {imageDiv}
          {textDiv}
        </div>
      </div>
    </section>
  );
};

export default FeatureDetail;
