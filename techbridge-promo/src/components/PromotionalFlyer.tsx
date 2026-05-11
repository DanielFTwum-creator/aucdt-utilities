import { motion } from "framer-motion";
import React from "react";
import { CURRENT_EVENT } from "../constants";

export const PromotionalFlyer: React.FC = () => {
  return (
    <section className="w-full max-w-3xl mx-auto px-6 py-20">
      <div className="text-center mb-10">
        <span className="text-[11px] tracking-[0.4em] uppercase text-gold mb-3 block font-bold">Promotional Flyer</span>
        <h2 className="font-display text-4xl text-cream font-bold">Upcoming Event</h2>
        <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-4" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="relative bg-gradient-to-br from-dark-maroon via-[#1a0000] to-black border border-gold/40 p-12 md:p-16 text-center overflow-hidden shadow-[0_30px_100px_rgba(212,160,23,0.15)] rounded-sm group"
      >
        {/* Decorative Inner Border */}
        <div className="absolute inset-2 border border-gold/15 pointer-events-none" />
        
        {/* Decorative Corners */}
        <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-gold opacity-50" />
        <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-gold opacity-50" />
        <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-gold opacity-50" />
        <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-gold opacity-50" />

        <div className="relative z-10 flex flex-col items-center">
          <motion.div 
            animate={{ filter: ["drop-shadow(0 0 10px rgba(212,160,23,0.3))", "drop-shadow(0 0 20px rgba(212,160,23,0.6))", "drop-shadow(0 0 10px rgba(212,160,23,0.3))"] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-24 h-24 mb-6 relative"
          >
            <div className="absolute inset-0 bg-gold/20 rounded-full blur-xl" />
            <span className="text-6xl relative">🏛️</span>
          </motion.div>

          <span className="text-[10px] tracking-[0.45em] text-gold uppercase font-black mb-4">✦ Techbridge University College Presents ✦</span>
          
          <h3 className="font-display text-4xl md:text-5xl font-black text-cream leading-none mb-2 px-4 italic">
            {CURRENT_EVENT.title.split("&").map((p, i) => (
              <React.Fragment key={i}>
                {p}
                {i === 0 && <span className="block text-gold text-3xl not-italic my-2">&</span>}
              </React.Fragment>
            ))}
          </h3>
          
          <p className="font-accent text-sm text-gold tracking-widest uppercase mb-8">{CURRENT_EVENT.subtitle}</p>
          
          <div className="w-full h-px bg-gradient-to-r from-transparent via-gold to-transparent mb-8" />
          
          <p className="font-display text-2xl text-gold font-bold mb-4 italic">Discover Your Path to Excellence</p>
          <p className="text-sm text-cream/70 leading-relaxed max-w-sm mb-10 font-medium">{CURRENT_EVENT.description}</p>
          
          <div className="flex flex-wrap justify-center gap-10 mb-10">
            {[
              { icon: "📅", label: "Date", val: CURRENT_EVENT.date },
              { icon: "🕘", label: "Time", val: CURRENT_EVENT.time },
              { icon: "📍", label: "Venue", val: CURRENT_EVENT.venue },
            ].map((d) => (
              <div key={d.label} className="text-center">
                <div className="text-xl mb-1">{d.icon}</div>
                <div className="text-[9px] uppercase tracking-widest text-gold/50 font-black mb-1">{d.label}</div>
                <div className="text-sm text-cream font-bold tracking-tight">{d.val}</div>
              </div>
            ))}
          </div>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-gold to-transparent mb-10" />
          
          <button className="px-12 py-4 bg-gradient-to-br from-gold to-deep-gold text-dark-maroon font-black text-xs tracking-[0.25em] uppercase custom-clip shadow-xl shadow-gold/40 hover:-translate-y-1 transition-all">
            Register Free →
          </button>
          
          <p className="mt-10 text-[10px] tracking-[0.3em] text-gold/40 uppercase font-black italic">
            Design and Build a Nation · Est. 2015
          </p>
        </div>
      </motion.div>
    </section>
  );
};
