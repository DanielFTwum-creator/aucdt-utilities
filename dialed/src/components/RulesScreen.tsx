import React from 'react';
import { useGame } from '../GameContext';
import { motion } from 'motion/react';
import { ArrowLeft, Target, Eye, Palette, Award } from 'lucide-react';

export const RulesScreen: React.FC = () => {
  const { setScreen } = useGame();

  const rules = [
    {
      icon: <Eye className="text-tuc-gold" size={32} />,
      title: "MEMORIZE",
      description: "You will be presented with 5 distinct colors. Study their hue, saturation, and brightness carefully. You only have a few seconds."
    },
    {
      icon: <Palette className="text-tuc-gold" size={32} />,
      title: "RECALL",
      description: "Recreate each color using our high-precision HSB picker. Adjust the sliders until you feel the color matches your memory."
    },
    {
      icon: <Target className="text-tuc-gold" size={32} />,
      title: "ACCURACY",
      description: "Scores are calculated based on the geometric distance between your selection and the target in HSB color space."
    },
    {
      icon: <Award className="text-tuc-gold" size={32} />,
      title: "MASTERY",
      description: "High scores are reserved for those who maintain over 90% average accuracy. Competitive and Daily modes have stricter validation."
    }
  ];

  return (
    <div className="min-h-screen bg-tuc-ink text-tuc-cream p-8 md:p-12 lg:p-24 overflow-y-auto">
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => setScreen('intro')}
        className="flex items-center gap-3 text-tuc-silver hover:text-tuc-gold transition-colors font-label tracking-widest mb-16 group"
        aria-label="Return to main menu"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        BACK TO MENU
      </motion.button>

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-20"
        >
          <h1 className="text-6xl md:text-8xl font-display font-bold tracking-tighter mb-6">
            game<span className="text-tuc-gold italic">_</span>rules
          </h1>
          <p className="text-xl md:text-2xl font-light text-tuc-silver max-w-2xl leading-relaxed">
            DIALED is a high-fidelity color memory platform. It challenges your visual perception and recollection through precision color mapping.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
          {rules.map((rule, index) => (
            <motion.div
              key={rule.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (index * 0.1) }}
              className="group p-8 border border-tuc-rule bg-white/5 hover:border-tuc-gold transition-all duration-500"
            >
              <div className="mb-6 group-hover:scale-110 transition-transform duration-500">
                {rule.icon}
              </div>
              <h2 className="text-2xl font-label tracking-widest mb-4">{rule.title}</h2>
              <p className="text-tuc-silver font-light leading-relaxed">
                {rule.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="p-12 border-t border-tuc-rule flex flex-col md:flex-row gap-12 items-center"
        >
          <div className="flex-1">
            <h3 className="text-xl font-label tracking-widest text-tuc-gold mb-4">A NOTE ON HARDWARE</h3>
            <p className="text-tuc-silver font-light text-sm leading-loose">
              Color accuracy is dependent on your display calibration. For the most precise experience, ensure your brightness is at a comfortable level and "Night Shift" or blue-light filters are disabled.
            </p>
          </div>
          <div className="flex-shrink-0">
            <button 
              onClick={() => setScreen('intro')}
              className="bg-tuc-gold text-tuc-ink px-10 py-5 font-label tracking-[0.2em] text-lg hover:bg-white transition-all active:scale-95"
            >
              GOTTEN IT
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
