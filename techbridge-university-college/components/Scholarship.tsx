import React from 'react';

const Scholarship: React.FC = () => {
  return (
    <section className="relative py-32 bg-tuc-maroon text-white text-center overflow-hidden">
      <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      <div className="relative max-w-4xl mx-auto px-4 z-10">
        <span className="text-tuc-gold font-black uppercase tracking-[0.5em] text-xs">Empowering Talent</span>
        <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter uppercase text-white">The Bridge Scholarship</h2>
        <p className="text-lg md:text-xl mb-12 text-gray-300 leading-relaxed font-medium">
          Techbridge University College is committed to making high-tech education accessible. We offer generous undergraduate scholarships for creative minds demonstrating industrial potential.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <a 
            href="https://portal.aucdt.edu.gh/eligibility/" 
            target="_blank"
            rel="noopener noreferrer"
            className="px-10 py-5 bg-transparent border-2 border-white text-white font-black rounded-full hover:bg-white hover:text-tuc-maroon transition-all duration-300 uppercase tracking-widest text-xs"
          >
            Check Eligibility
          </a>
          <a 
            href="#coming-soon" 
            className="px-10 py-5 bg-tuc-gold text-tuc-maroon border-2 border-tuc-gold font-black rounded-full hover:bg-white hover:border-white transition-all duration-300 uppercase tracking-widest text-xs"
          >
            Download Guide
          </a>
        </div>
      </div>
    </section>
  );
};

export default Scholarship;