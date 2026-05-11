import React, { ReactNode } from 'react';

interface SectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export const Section: React.FC<SectionProps> = ({ title, description, children, className = '' }) => {
  return (
    <section className={`mb-20 relative ${className}`}>
      {/* Editorial Header */}
      <div className="mb-10 border-l-2 border-tuc-gold pl-6">
        <h2 className="font-display font-black text-4xl text-tuc-ink dark:text-white uppercase tracking-tight mb-3 transition-colors duration-500">
          {title}
        </h2>
        {description && (
          <p className="font-body italic text-[#444444] dark:text-tuc-cream/60 text-xl leading-relaxed max-w-3xl transition-colors duration-500 font-medium">
            {description}
          </p>
        )}
      </div>
      
      {/* Content Area */}
      <div className="pl-6 md:pl-8">
        {children}
      </div>
    </section>
  );
};
