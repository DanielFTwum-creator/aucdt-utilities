
import React from 'react';
import { PROGRAMMES } from '../constants.ts';
import { ArrowRight } from 'lucide-react';

const Programmes: React.FC = () => {
  return (
    <section className="py-24 bg-white dark:bg-tuc-dark overflow-hidden font-display" aria-labelledby="programmes-title">
      <div className="max-w-7xl mx-auto px-4 mb-16">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-tuc-maroon dark:text-tuc-gold font-black uppercase tracking-[0.3em] text-xs">Our Academic Portfolio</span>
          <h2 id="programmes-title" className="text-4xl md:text-5xl font-black text-tuc-maroon dark:text-white mt-4 mb-6 uppercase tracking-tighter">Pioneering Programmes</h2>
          <p className="text-tuc-slate dark:text-gray-400 text-lg font-medium">
            Techbridge University College bridges the future by combining design intelligence with technical mastery. Our curriculum is engineered for industrial disruption.
          </p>
        </div>
      </div>

      {/* Scrolling Container */}
      <div 
        className="flex overflow-x-auto pb-12 px-4 space-x-8 scrollbar-hide snap-x snap-mandatory"
        role="region"
        aria-label="Programme list"
      >
        <div className="flex-shrink-0 w-0 lg:w-[calc((100vw-80rem)/2)]" aria-hidden="true"></div>
        {PROGRAMMES.map((programme) => (
          <article 
            key={programme.id} 
            className="flex-shrink-0 w-80 md:w-[400px] bg-white dark:bg-gray-800 rounded-3xl shadow-[0_15px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-100 dark:border-gray-700 snap-center group hover:shadow-2xl transition-all duration-500 flex flex-col"
          >
            <div className="relative h-64 overflow-hidden rounded-t-3xl">
              <img 
                src={programme.image} 
                alt={`${programme.title} illustration`} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <span className="absolute top-6 right-6 bg-tuc-gold text-tuc-maroon text-[10px] font-black px-4 py-2 uppercase tracking-[0.2em] shadow-xl rounded-full">
                {programme.badge}
              </span>
            </div>
            <div className="p-8 flex-1 flex flex-col">
              <h3 className="text-2xl font-black text-tuc-maroon dark:text-tuc-gold mb-4 group-hover:text-tuc-gold transition-colors uppercase tracking-tighter">
                {programme.title}
              </h3>
              <p className="text-tuc-slate dark:text-gray-400 text-sm mb-8 flex-1 leading-relaxed font-medium">
                {programme.description}
              </p>
              <a 
                href={programme.link}
                className="inline-flex items-center text-tuc-maroon dark:text-white font-black text-xs uppercase tracking-widest hover:text-tuc-gold transition-colors group/link focus:ring-2 focus:ring-tuc-gold rounded"
                aria-label={`Learn more about ${programme.title}`}
              >
                Explore Programme <ArrowRight size={16} className="ml-2 group-hover/link:translate-x-1 transition-transform" aria-hidden="true" />
              </a>
            </div>
          </article>
        ))}
        <div className="flex-shrink-0 w-4" aria-hidden="true"></div>
      </div>
    </section>
  );
};

export default Programmes;
