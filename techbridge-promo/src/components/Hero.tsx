import { motion } from "framer-motion";
import React from "react";

export const Header: React.FC = () => {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="w-full px-10 py-5 flex items-center justify-between border-b border-gold/20 backdrop-blur-md bg-black/40 z-50 sticky top-0"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center border border-gold/40 shadow-lg shadow-gold/20">
          <span className="text-xl">🏛️</span>
        </div>
        <div className="font-accent text-[13px] tracking-widest text-gold leading-tight uppercase">
          Techbridge University College
          <span className="block text-[11px] text-gold/60 tracking-[0.2em] font-sans font-normal mt-0.5">Est. 2015 · Accra, Ghana</span>
        </div>
      </div>
      <nav className="hidden md:flex gap-8">
        {["Programmes", "Admissions", "Research", "Contact"].map((item) => (
          <a key={item} href="#top" className="text-[13px] tracking-[0.12em] text-cream/70 uppercase font-semibold hover:text-gold transition-colors relative group">
            {item}
            <span className="absolute bottom-[-3px] left-0 right-full h-[1px] bg-gold transition-all duration-300 group-hover:right-0" />
          </a>
        ))}
      </nav>
    </motion.header>
  );
};

export const Hero: React.FC = () => {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, delay: 0.3 }}
      className="px-10 pt-20 pb-10 flex flex-col items-center text-center max-w-4xl mx-auto z-10"
    >
      <div className="text-[11px] tracking-[0.35em] uppercase text-gold border border-gold/40 px-5 py-2 rounded-sm mb-8 bg-gold/5 font-semibold">
        ✦ 2025–2026 Academic Year Now Open ✦
      </div>
      
      <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-black leading-[1.05] text-cream mb-4">
        Shape the<br />
        <span className="text-gold relative inline-block shimmer-text">Future</span> of Africa
      </h1>
      
      <p className="text-xs md:text-sm tracking-[0.4em] text-gold/70 uppercase mb-8 font-bold">
        Design and Build a Nation
      </p>
      
      <p className="text-lg text-cream/70 leading-relaxed max-w-2xl mb-12 font-medium">
        Join a community of innovators, engineers, and visionaries at Techbridge University College — where technology meets purpose and knowledge transforms nations.
      </p>
      
      <div className="flex flex-wrap justify-center gap-6">
        <button className="px-10 py-4 bg-gradient-to-br from-gold to-deep-gold text-dark-maroon font-bold text-sm tracking-[0.2em] uppercase custom-clip shadow-xl shadow-gold/30 hover:-translate-y-1 transition-all active:scale-95">
          Apply Now →
        </button>
        <button className="px-10 py-4 bg-transparent border border-gold/50 text-gold font-bold text-sm tracking-[0.2em] uppercase custom-clip hover:bg-gold/10 transition-all active:scale-95">
          Explore Programmes
        </button>
      </div>
    </motion.section>
  );
};
