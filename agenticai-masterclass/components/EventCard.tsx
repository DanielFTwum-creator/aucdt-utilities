import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ArrowDownCircle, Clock } from 'lucide-react';
import { RegistrationForm } from './RegistrationForm';
import { VisualEcosystem } from './VisualEcosystem';
import { useTheme } from './ThemeProvider';

export const EventCard: React.FC = () => {
  const { theme } = useTheme();
  const registrationRef = useRef<HTMLDivElement>(null);

  const scrollToRegistration = () => {
    registrationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const isHighContrast = theme === 'high-contrast';
  const isLight = theme === 'light';

  // Dynamic classes based on theme
  const cardBg = isHighContrast ? 'bg-black border-2 border-white' : isLight ? 'bg-white/90 border border-slate-200 shadow-xl' : 'bg-white/95 backdrop-blur-xl border border-white/20 shadow-[0_25px_50px_rgba(0,0,0,0.2)]';
  const textColor = isHighContrast ? 'text-white' : isLight ? 'text-slate-900' : 'text-slate-800';
  const subTextColor = isHighContrast ? 'text-white' : 'text-slate-600';
  const accentColor = isHighContrast ? 'text-white' : '#667eea';

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateX: 10 }}
      animate={{ opacity: 1, y: 0, rotateX: 5 }}
      transition={{ duration: 0.8, type: 'spring' }}
      className={`relative w-full max-w-7xl rounded-[32px] p-8 md:p-14 group overflow-hidden [transform-style:preserve-3d] ${cardBg}`}
    >
      {/* Hover Gradient Border Effect - Disabled in High Contrast */}
      {!isHighContrast && (
        <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-[#667eea] via-[#764ba2] to-[#667eea] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -z-10 p-[2px]" />
      )}

      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-20 items-center relative z-10">
        {/* Left Column: Content */}
        <div className="flex flex-col gap-8">
          <motion.h1 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={`text-4xl md:text-6xl font-black leading-[1.1] tracking-tight ${isHighContrast ? 'text-white decoration-white underline' : 'bg-clip-text text-transparent bg-gradient-to-br from-[#1a202c] via-[#2d3748] to-[#4a5568] drop-shadow-sm'}`}
            style={isLight ? { backgroundImage: 'none', color: '#0f172a' } : {}}
          >
            Unlock Your Potential: The 15-Minute AI Agent Masterclass
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col gap-4"
          >
            <p className={`text-lg md:text-xl leading-relaxed ${subTextColor}`}>
              Ready to stop watching and start building? 🚀 Join us for a hands-on masterclass where you'll learn to create your very own AI agent in just 15 minutes. We'll demystify the process and show you how to build a smart, autonomous tool that can automate tasks and supercharge your workflows.
            </p>
            
            <div>
              <button 
                onClick={scrollToRegistration}
                className={`inline-flex items-center gap-2 font-bold text-lg transition-colors group/btn ${isHighContrast ? 'text-white border-b-2 border-white' : 'text-[#667eea] hover:text-[#764ba2]'}`}
              >
                Book Your Spot Below
                <ArrowDownCircle className="w-5 h-5 group-hover/btn:translate-y-1 transition-transform" />
              </button>
            </div>
          </motion.div>

          {/* Event Details Box */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={`flex flex-col gap-4 p-6 rounded-2xl ${isHighContrast ? 'border-2 border-white' : 'bg-gradient-to-br from-[#667eea]/10 to-[#764bba]/10 border border-[#667eea]/20'}`}
          >
            <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isHighContrast ? 'border border-white bg-black text-white' : 'bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white shadow-lg'}`}>
                        <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                        <div className={`text-sm font-bold uppercase tracking-wider mb-1 ${isHighContrast ? 'text-white' : 'text-[#667eea]'}`}>Schedule</div>
                        <div className={`text-lg font-bold leading-tight ${textColor}`}>Weekly Live Sessions</div>
                        <div className={`text-sm font-medium ${isHighContrast ? 'text-white' : 'text-slate-500'}`}>Thursdays @ 7:00 PM GMT</div>
                    </div>
                </div>

                <div className={`hidden sm:block w-px ${isHighContrast ? 'bg-white' : 'bg-[#667eea]/20'}`}></div>

                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isHighContrast ? 'border border-white bg-black text-white' : 'bg-white border border-[#667eea]/20 text-[#764ba2] shadow-sm'}`}>
                        <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                        <div className={`text-sm font-bold uppercase tracking-wider mb-1 ${isHighContrast ? 'text-white' : 'text-[#667eea]'}`}>Location</div>
                        <div className={`text-lg font-bold leading-tight ${textColor}`}>Online Experience</div>
                        <div className={`text-sm font-medium ${isHighContrast ? 'text-white' : 'text-slate-500'}`}>Live via Google Meet</div>
                    </div>
                </div>
            </div>
            
            <div className={`mt-2 pt-4 border-t flex items-center gap-2 text-sm font-semibold ${isHighContrast ? 'border-white text-white' : 'border-[#667eea]/10 text-slate-500'}`}>
                <Clock className="w-4 h-4" />
                <span>Duration: 45 Minutes</span>
            </div>
          </motion.div>

          <div ref={registrationRef} className="scroll-mt-8">
            <RegistrationForm />
          </div>

          {/* Info Section */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-4"
          >
            <h3 className={`text-xl font-bold mb-2 ${textColor}`}>Hi there,</h3>
            <p className={`leading-relaxed mb-6 ${subTextColor}`}>
              This session is your guide to turning innovative ideas into scalable business solutions. We'll show you how intelligent agents can automate processes, enhance customer experiences, and create new revenue streams.
            </p>
            
            <div className={`p-6 rounded-2xl ${isHighContrast ? 'border-2 border-white' : 'bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 border border-[#667eea]/10'}`}>
              <h4 className={`font-bold mb-4 ${textColor}`}>Key Takeaways:</h4>
              <ul className="space-y-4">
                {[
                  "Build Your First AI Agent: Get hands-on experience.",
                  "Go from Idea to Reality in Minutes: No-code/low-code rapid creation.",
                  "Unlock New Revenue Streams: Monetize ideas and automate processes."
                ].map((item, i) => (
                  <li key={i} className={`flex items-start gap-3 p-4 rounded-xl transition-all duration-300 ${isHighContrast ? 'border border-white bg-black' : 'bg-white/60 hover:bg-white/80 hover:translate-x-1'}`}>
                    <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${isHighContrast ? 'bg-white' : 'bg-gradient-to-br from-[#667eea] to-[#764ba2]'}`} />
                    <span className={`leading-relaxed font-medium ${isHighContrast ? 'text-white' : 'text-slate-600'}`}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Visuals - Hidden in High Contrast Mode to reduce noise */}
        {!isHighContrast && (
            <div className="hidden lg:flex items-center justify-center h-full min-h-[500px]">
               <VisualEcosystem />
            </div>
        )}
      </div>
    </motion.div>
  );
};