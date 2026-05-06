import React from "react";
import { BackgroundLayers, ParticleBackground } from "./components/Background";
import { Header, Hero } from "./components/Hero";
import { ProgramGrid } from "./components/ProgramGrid";
import { PromotionalFlyer } from "./components/PromotionalFlyer";
import { StatsBoard } from "./components/StatsBoard";
import "./styles/global.css";

const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-gold/15 px-10 py-10 flex flex-col md:flex-row items-center justify-between bg-black/60 backdrop-blur-md z-30">
      <div className="text-[11px] text-cream/30 tracking-widest uppercase mb-4 md:mb-0 font-medium">
        © 2025 Techbridge University College. All rights reserved.
      </div>
      <div className="font-accent text-[11px] text-gold/40 tracking-widest uppercase flex items-center gap-2">
        <span>Accra, Ghana</span>
        <span className="w-1.5 h-1.5 rounded-full bg-gold/20" />
        <span>Est. 2015</span>
      </div>
    </footer>
  );
};

const App: React.FC = () => {
  return (
    <div className="relative min-h-screen font-sans cursor-default custom-scrollbar selection:bg-gold/30 selection:text-white">
      <BackgroundLayers />
      <ParticleBackground />
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-1">
          <Hero />
          
          <div className="py-20 flex justify-center px-10">
            <div className="w-full max-w-sm relative group">
              <div className="absolute inset-0 bg-gold/20 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-1000" />
              {/* Globe Icon / Placeholder */}
              <div className="relative text-center text-9xl animate-pulse">🌍</div>
            </div>
          </div>

          <StatsBoard />
          <ProgramGrid />
          <PromotionalFlyer />
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default App;
