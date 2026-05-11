import { motion } from "framer-motion";
import React from "react";
import { PROGRAMS } from "../constants";

export const ProgramGrid: React.FC = () => {
  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <span className="text-[11px] tracking-[0.4em] uppercase text-gold mb-3 block font-bold">Academic Excellence</span>
        <h2 className="font-display text-4xl md:text-5xl text-cream font-bold">Our Flagship Programmes</h2>
        <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-6" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-gold/15 border border-gold/15 shadow-2xl overflow-hidden rounded-xl">
        {PROGRAMS.map((program, i) => (
          <motion.div
            key={i}
            whileHover={{ backgroundColor: "rgba(107, 15, 26, 0.2)" }}
            className="bg-black/80 p-8 relative overflow-hidden group cursor-default h-full flex flex-col"
          >
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="text-4xl mb-6 block transition-transform duration-300 group-hover:scale-110">{program.icon}</span>
            <h3 className="font-accent text-lg text-gold mb-4 tracking-wider uppercase leading-tight">{program.name}</h3>
            <p className="text-sm text-cream/50 leading-relaxed font-medium">{program.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
