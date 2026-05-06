import React from 'react';
import { motion } from 'motion/react';
import { RefreshCw, Palette, Type, Layout, Sparkles, ShieldCheck } from 'lucide-react';

const methodology = [
  {
    r: 'Refresh',
    title: 'Kinetic Urgency',
    desc: 'Legacy marquees are upgraded with Barlow Condensed and ✦ glyph separators, creating a sophisticated yet urgent rhythm.',
    icon: RefreshCw,
    color: '#8C1A2E'
  },
  {
    r: 'Recolour',
    title: 'Warm Foundation',
    desc: 'The palette shifts from flat white to a premium parchment (#FAF7F0), anchored by deep espresso statistics bars.',
    icon: Palette,
    color: '#C49A22'
  },
  {
    r: 'Retype',
    title: 'Typographic Tension',
    desc: 'High-contrast pairing of Libre Baskerville for editorial authority against JetBrains Mono for data-technical fields.',
    icon: Type,
    color: '#1A0A06'
  },
  {
    r: 'Recompose',
    title: 'Architectural Grids',
    desc: 'Moving from generic symmetry to aspect-ratio specific structural logic (Cinema 55/45, Story vertical stacks).',
    icon: Layout,
    color: '#8C1A2E'
  },
  {
    r: 'Refine',
    title: 'Micro-Detail Mastery',
    desc: 'Executing precision details: asymmetric CTA corners (16px/4px), 0.5px vertical dividers, and 2px gold accent rules.',
    icon: Sparkles,
    color: '#C49A22'
  },
  {
    r: 'Reinforce',
    title: 'Systemic Equity',
    desc: 'Strict adherence to the 24px inner-margin grid and brand-locked logo size scales across all five layout variants.',
    icon: ShieldCheck,
    color: '#1A0A06'
  }
];

const Methodology: React.FC = () => {
  return (
    <div className="w-full max-w-5xl px-12 py-24 border-t border-slate-200/60 mt-24">
      <div className="mb-16">
        <h2 className="text-[12px] font-black uppercase tracking-[0.4em] text-tuc-crimson mb-4">The 6R Methodology</h2>
        <p className="text-4xl font-serif text-tuc-text-primary max-w-2xl leading-tight">
          A disciplined framework for <span className="italic text-tuc-crimson">aesthetic enhancement</span> and systemic brand consistency.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {methodology.map((item, idx) => (
          <motion.div
            key={item.r}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="group relative p-8 rounded-2xl bg-white border border-slate-100 hover:border-tuc-crimson/20 hover:shadow-2xl hover:shadow-tuc-crimson/5 transition-all duration-500"
          >
            <div className="absolute top-8 right-8 text-slate-100 font-black text-5xl group-hover:text-tuc-crimson/5 transition-colors duration-500">
              0{idx + 1}
            </div>
            
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-500"
              style={{ backgroundColor: `${item.color}10`, color: item.color }}
            >
              <item.icon className="w-6 h-6" />
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-[12px] font-black uppercase tracking-widest text-tuc-crimson">{item.r}</h4>
                <h3 className="text-xl font-bold text-tuc-text-primary tracking-tight">{item.title}</h3>
              </div>
              <p className="text-base text-slate-500 leading-relaxed font-medium">
                {item.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Methodology;
