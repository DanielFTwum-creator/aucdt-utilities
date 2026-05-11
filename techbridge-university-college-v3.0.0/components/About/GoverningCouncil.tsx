
import React from 'react';
import { ShieldCheck, UserCheck, Award, GraduationCap } from 'lucide-react';
import { COUNCIL_DATA } from '../../constants.ts';

const GoverningCouncil: React.FC = () => {
  return (
    <div className="bg-white dark:bg-tuc-midnight min-h-screen font-sans">
      {/* Breadcrumbs Navigation */}
      <nav className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 py-3 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 text-left">
          <ol className="flex text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
            <li>
              <a 
                href="#/" 
                className="hover:text-tuc-forest transition-colors focus:outline-none focus:ring-2 focus:ring-tuc-gold rounded px-1"
                aria-label="Return to Home page"
                title="Go to Home"
              >
                Home
              </a>
            </li>
            <li className="mx-3 opacity-30">/</li>
            <li>About TUC</li>
            <li className="mx-3 opacity-30">/</li>
            <li className="text-tuc-gold">Governing Council</li>
          </ol>
        </div>
      </nav>

      {/* Hero Header */}
      <section className="relative py-20 lg:py-28 bg-tuc-forest overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://aucdt.edu.gh/wp-content/uploads/2022/01/AUCDT-Main-Building_2.jpg')] bg-cover bg-center opacity-10 grayscale scale-110"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-tuc-forest/90 to-tuc-forest"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-left">
          <div className="max-w-3xl">
            <span className="text-tuc-gold font-black uppercase tracking-[0.5em] text-xs">Institutional Oversight</span>
            <h1 className="text-5xl md:text-7xl font-black text-white mt-4 uppercase tracking-tighter leading-none mb-6">
              Governing <br /> Council
            </h1>
            <div className="w-24 h-1 bg-tuc-gold rounded-full mb-8"></div>
          </div>
        </div>
      </section>

      {/* Intro Text */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/40">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-xl md:text-2xl text-tuc-stone dark:text-gray-300 font-bold leading-relaxed italic">
            "The Governing Council of Techbridge University College provides strategic leadership, institutional advisory, and governance support to the University College and its senior management team."
          </p>
        </div>
      </section>

      {/* Grid Container */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
          {COUNCIL_DATA.map((member, idx) => (
            <div key={idx} className="flex flex-col items-center group text-center animate-fade-in-up" style={{ animationDelay: `${idx * 50}ms` }}>
              <div className="relative mb-8">
                {/* Photo container */}
                <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-[8px] border-gray-50 dark:border-gray-800 shadow-2xl transition-transform duration-500 group-hover:scale-105 group-hover:border-tuc-gold/30">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=630f12&color=ffcb05&size=512`;
                    }}
                  />
                </div>
                {/* Badge/Icon Overlay */}
                <div className="absolute -bottom-2 right-4 bg-tuc-gold p-3 rounded-2xl shadow-xl transform transition-transform group-hover:-translate-y-1">
                  {idx === 0 ? <ShieldCheck size={20} className="text-tuc-forest" /> : <UserCheck size={20} className="text-tuc-forest" />}
                </div>
              </div>
              
              <div className="space-y-2 max-w-xs">
                <h3 className="text-xl md:text-2xl font-black text-tuc-forest dark:text-white uppercase tracking-tighter leading-tight group-hover:text-tuc-gold transition-colors">
                  {member.name}
                </h3>
                <p className="text-[10px] md:text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">
                  {member.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Institutional Core Values Section (Bonus) */}
      <section className="py-24 bg-tuc-forest text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="text-left space-y-6">
              <span className="text-tuc-gold font-black uppercase tracking-[0.4em] text-xs">Commitment to Integrity</span>
              <h2 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter">Excellence in Governance</h2>
              <p className="text-white/70 text-lg font-medium leading-relaxed">
                Our council ensures that every academic programme and industrial partnership adheres to the highest global standards of quality and ethical leadership.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white/5 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10 flex flex-col items-start gap-4">
                 <Award className="text-tuc-gold" size={32} />
                 <h4 className="font-black uppercase tracking-widest text-sm">Accountability</h4>
              </div>
              <div className="bg-white/5 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10 flex flex-col items-start gap-4">
                 <GraduationCap className="text-tuc-gold" size={32} />
                 <h4 className="font-black uppercase tracking-widest text-sm">Scholarly Rigor</h4>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GoverningCouncil;
