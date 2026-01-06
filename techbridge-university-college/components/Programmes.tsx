
import React, { useState, useRef } from 'react';
import { PROGRAMMES } from '../constants.ts';
import { ArrowRight, X, Award, Zap, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { ProgrammeCardData } from '../types.ts';

const Programmes: React.FC = () => {
  const [selectedProgramme, setSelectedProgramme] = useState<ProgrammeCardData | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const openModal = (prog: ProgrammeCardData) => {
    setSelectedProgramme(prog);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedProgramme(null);
    document.body.style.overflow = 'unset';
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 450;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-24 bg-white dark:bg-tuc-dark overflow-hidden font-display" aria-labelledby="programmes-title">
      <div className="max-w-7xl mx-auto px-4 mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="max-w-2xl text-left">
          <span className="text-tuc-maroon dark:text-tuc-gold font-black uppercase tracking-[0.3em] text-xs">Our Academic Portfolio</span>
          <h2 id="programmes-title" className="text-4xl md:text-5xl font-black text-tuc-maroon dark:text-white mt-4 uppercase tracking-tighter">Pioneering Programmes</h2>
          <p className="text-tuc-slate dark:text-gray-400 text-lg font-medium mt-4">
            Combining design intelligence with technical mastery to build a nation through industrial disruption.
          </p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => scroll('left')}
            className="p-4 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-tuc-gold hover:text-tuc-maroon transition-all shadow-sm"
            aria-label="Scroll left"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="p-4 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-tuc-gold hover:text-tuc-maroon transition-all shadow-sm"
            aria-label="Scroll right"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex overflow-x-auto pb-12 px-4 space-x-8 scrollbar-hide snap-x snap-mandatory" 
        role="region" 
        aria-label="Programme list"
      >
        <div className="flex-shrink-0 w-0 lg:w-[calc((100vw-80rem)/2)]" aria-hidden="true"></div>
        {PROGRAMMES.map((programme) => (
          <article 
            key={programme.id} 
            onClick={() => openModal(programme)}
            className="flex-shrink-0 w-[320px] md:w-[450px] bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100 dark:border-gray-700 snap-center group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col cursor-pointer"
          >
            <div className="relative h-72 overflow-hidden rounded-t-[2.5rem]">
              <img src={programme.image} alt={programme.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-tuc-maroon/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="absolute top-8 right-8 bg-tuc-gold text-tuc-maroon text-[10px] font-black px-6 py-2.5 uppercase tracking-[0.2em] shadow-2xl rounded-full">{programme.badge}</span>
            </div>
            <div className="p-10 flex-1 flex flex-col text-left">
              <h3 className="text-2xl md:text-3xl font-black text-tuc-maroon dark:text-tuc-gold mb-4 group-hover:text-tuc-maroon dark:group-hover:text-tuc-gold transition-colors uppercase tracking-tighter leading-tight">{programme.title}</h3>
              <p className="text-tuc-slate dark:text-gray-400 text-sm mb-8 flex-1 leading-relaxed font-medium">{programme.description}</p>
              <div className="flex items-center text-tuc-maroon dark:text-white font-black text-xs uppercase tracking-widest hover:text-tuc-gold transition-colors group/link">
                View Curriculum <ArrowRight size={18} className="ml-3 group-hover/link:translate-x-2 transition-transform" />
              </div>
            </div>
          </article>
        ))}
        <div className="flex-shrink-0 w-12" aria-hidden="true"></div>
      </div>

      {/* Detail Modal */}
      {selectedProgramme && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-tuc-maroon/80 backdrop-blur-xl animate-fade-in" onClick={closeModal}></div>
          <div className="relative bg-white dark:bg-gray-900 w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[3.5rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] animate-fade-in-up border border-white/10">
            <button onClick={closeModal} className="absolute top-10 right-10 z-20 p-4 bg-white dark:bg-gray-800 text-gray-500 hover:text-tuc-maroon rounded-full shadow-2xl transition-all"><X size={28} /></button>
            <div className="flex flex-col lg:flex-row min-h-full">
              <div className="lg:w-1/2 h-80 lg:h-auto sticky top-0"><img src={selectedProgramme.image} alt={selectedProgramme.title} className="w-full h-full object-cover" /></div>
              <div className="lg:w-1/2 p-10 lg:p-20 text-left">
                <span className="bg-tuc-gold/15 text-tuc-maroon dark:text-tuc-gold px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-tuc-gold/20">{selectedProgramme.badge}</span>
                <h3 className="text-4xl lg:text-6xl font-black text-tuc-maroon dark:text-white mt-8 mb-6 uppercase tracking-tighter leading-none">{selectedProgramme.title}</h3>
                <p className="text-lg text-tuc-slate dark:text-gray-300 mb-10 font-medium leading-relaxed">{selectedProgramme.description}</p>
                
                <div className="grid grid-cols-1 gap-6 mb-12">
                   <div className="flex items-center gap-5 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-3xl border border-gray-100 dark:border-gray-700">
                     <Award className="text-tuc-gold" size={28} />
                     <div>
                       <p className="text-xs font-black uppercase tracking-widest text-tuc-maroon dark:text-tuc-gold">Accreditation</p>
                       <p className="text-sm font-bold text-gray-500">GTEC Certified Industry Degree</p>
                     </div>
                   </div>
                   <div className="flex items-center gap-5 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-3xl border border-gray-100 dark:border-gray-700">
                     <Zap className="text-tuc-gold" size={28} />
                     <div>
                       <p className="text-xs font-black uppercase tracking-widest text-tuc-maroon dark:text-tuc-gold">Fast-Track Career</p>
                       <p className="text-sm font-bold text-gray-500">Industry Placement in Level 300</p>
                     </div>
                   </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-6">
                  <a href="https://portal.aucdt.edu.gh/admissions/#/home" className="flex-1 bg-tuc-maroon text-white text-center py-6 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-tuc-gold hover:text-tuc-maroon transition-all">Apply for Jan 2026</a>
                  <button onClick={closeModal} className="flex-1 border-2 border-tuc-maroon text-tuc-maroon py-6 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-gray-50 transition-all dark:text-white dark:border-gray-700">Download Brochure</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Programmes;
