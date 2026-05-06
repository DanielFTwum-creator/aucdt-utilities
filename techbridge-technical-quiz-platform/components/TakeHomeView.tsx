
import React, { useState } from 'react';
import { 
  Book, 
  Terminal, 
  Database, 
  Download, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Info,
  Server,
  Layers,
  Shield,
  Zap,
  Star,
  Trophy,
  Mail,
  Fingerprint
} from 'lucide-react';
import { MOCK_TAKE_HOMES } from '../mockData';
import { Difficulty } from '../types';

const TakeHomeView: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<number>(0); // 0: Easy, 1: Medium, 2: Hard
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const currentProject = MOCK_TAKE_HOMES[selectedTier];

  const toggleStep = (idx: number) => {
    const next = new Set(completedSteps);
    if (next.has(idx)) next.delete(idx);
    else next.add(idx);
    setCompletedSteps(next);
  };

  const getTierIcon = (idx: number) => {
    switch(idx) {
      case 0: return <Zap size={18} />;
      case 1: return <Star size={18} />;
      case 2: return <Trophy size={18} />;
      default: return <Shield size={18} />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      
      {/* Tier Selector Navigation */}
      <div className="flex flex-col items-center gap-4">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Select Assessment Tier</p>
        <div className="bg-white dark:bg-slate-800 p-2 rounded-2xl border-2 border-brand-maroon/10 shadow-lg flex gap-2">
          {MOCK_TAKE_HOMES.map((project, idx) => (
            <button
              key={project.id}
              onClick={() => {
                setSelectedTier(idx);
                setCompletedSteps(new Set());
              }}
              className={`px-6 py-3 rounded-xl font-heading font-black text-xs tracking-widest transition-all flex items-center gap-3 relative overflow-hidden ${
                selectedTier === idx 
                ? 'bg-brand-maroon text-brand-gold shadow-md scale-105' 
                : 'text-slate-400 hover:bg-slate-50 hover:text-brand-maroon'
              }`}
            >
              {idx === 0 && (
                <div className="absolute top-0 right-0">
                  <div className="bg-brand-gold text-brand-maroon text-[6px] font-black px-1 transform rotate-45 translate-x-2 -translate-y-0.5">REC</div>
                </div>
              )}
              {getTierIcon(idx)}
              {project.difficulty.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Academic Brief Header */}
      <div className="bg-brand-maroon text-white rounded-[3rem] p-10 relative overflow-hidden shadow-2xl border-b-8 border-brand-gold transition-all duration-500">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-10">
          <div className="space-y-6 max-w-3xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-gold rounded-xl text-brand-maroon animate-pulse">
                {getTierIcon(selectedTier)}
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-gold">Directive Level: {currentProject.difficulty}</span>
                {selectedTier === 0 && <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest">Recommended for ICT Unit Onboarding</span>}
              </div>
            </div>
            <h1 className="text-5xl font-black tracking-tighter uppercase leading-none brand-heading">
              {currentProject.title}
            </h1>
            <p className="text-brand-lightGold/60 text-lg font-medium leading-relaxed italic border-l-4 border-brand-gold pl-6">
              "{currentProject.overview}"
            </p>
            
            <div className="pt-4 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full border-2 border-brand-gold p-0.5 shrink-0 bg-white">
                <img src="https://picsum.photos/48/48?grayscale&seed=daniel" alt="Daniel Twum" className="rounded-full grayscale" />
              </div>
              <div className="text-sm">
                <p className="font-black uppercase tracking-tight text-brand-gold">Daniel Twum</p>
                <p className="text-xs font-bold text-white/50 uppercase">Head of ICT • TechBridge Authority</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 w-full md:w-80 space-y-6 shrink-0 relative">
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-brand-gold text-brand-maroon rounded-full flex items-center justify-center shadow-lg border-4 border-brand-maroon animate-bounce">
              <Fingerprint size={24} />
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-brand-gold/10 rounded-2xl text-brand-gold">
                <Clock size={24} />
              </div>
              <div>
                <p className="text-[10px] uppercase font-black text-brand-gold/50 tracking-widest">Directive Window</p>
                <p className="text-2xl font-black">{currentProject.duration}</p>
              </div>
            </div>
            <div className="h-px bg-white/10"></div>
            <button className="btn-primary w-full py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl">
              <Download size={20} />
              GET OFFICIAL BRIEF
            </button>
          </div>
        </div>
        
        {/* Abstract watermark */}
        <div className="absolute right-[-100px] bottom-[-100px] opacity-[0.03]">
           <Shield size={600} fill="currentColor" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Core Content */}
        <div className="lg:col-span-3 space-y-12">
          
          {/* Deliverables Section */}
          <section className="bg-white dark:bg-slate-800 rounded-[2.5rem] border-2 border-brand-maroon/5 shadow-2xl overflow-hidden">
            <div className="px-10 py-8 border-b-2 border-brand-maroon/5 bg-slate-50/50 dark:bg-slate-800/50 flex items-center gap-4">
              <div className="p-3 bg-brand-maroon text-brand-gold rounded-2xl shadow-lg"><Book size={20} /></div>
              <h2 className="text-2xl font-black text-brand-maroon tracking-tight uppercase">Mission Objectives</h2>
            </div>
            <div className="p-10 space-y-5">
              {currentProject.userStories.map((story: string, i: number) => (
                <div 
                  key={i} 
                  onClick={() => toggleStep(i)}
                  className={`flex items-start gap-6 p-6 rounded-3xl cursor-pointer transition-all border-2 ${
                    completedSteps.has(i) 
                    ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/10 dark:border-emerald-800' 
                    : 'bg-white border-slate-100 dark:bg-slate-900 hover:border-brand-gold shadow-sm'
                  }`}
                >
                  <div className={`mt-1 shrink-0 ${completedSteps.has(i) ? 'text-emerald-500' : 'text-brand-maroon/20'}`}>
                    <CheckCircle2 size={30} fill={completedSteps.has(i) ? 'currentColor' : 'none'} strokeWidth={3} />
                  </div>
                  <p className={`font-extrabold text-lg leading-tight tracking-tight ${completedSteps.has(i) ? 'text-emerald-700 dark:text-emerald-400 line-through opacity-50' : 'text-slate-800 dark:text-slate-100'}`}>
                    {story}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Technical Architecture Specs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <section className="bg-brand-maroon rounded-[2.5rem] p-10 text-white shadow-2xl space-y-8 border-r-4 border-brand-gold">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-brand-gold text-brand-maroon rounded-2xl"><Server size={20} /></div>
                <h2 className="text-xl font-black tracking-tight uppercase">API Blueprint</h2>
              </div>
              <div className="space-y-4">
                {currentProject.apiSpecs.map((api: any, i: number) => (
                  <div key={i} className="bg-white/5 p-5 rounded-2xl border border-white/10 group hover:border-brand-gold transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black ${
                        api.method === 'POST' ? 'bg-brand-gold text-brand-maroon' :
                        api.method === 'GET' ? 'bg-white/20 text-white' : 'bg-brand-brown text-white'
                      }`}>{api.method}</span>
                      <code className="text-xs font-black tracking-wider text-brand-gold">{api.path}</code>
                    </div>
                    <p className="text-xs font-bold text-white/50">{api.description}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-brand-gold rounded-[2.5rem] p-10 text-brand-maroon shadow-2xl space-y-8 border-b-8 border-brand-maroon/10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-brand-maroon text-brand-gold rounded-2xl"><Database size={20} /></div>
                <h2 className="text-xl font-black tracking-tight uppercase">Schema Definition</h2>
              </div>
              <div className="space-y-5">
                {currentProject.databaseSchema.map((schema: string, i: number) => (
                  <div key={i} className="flex gap-4">
                    <Layers size={18} className="mt-1 text-brand-maroon shrink-0 opacity-40" />
                    <p className="text-sm font-black italic leading-tight">{schema}</p>
                  </div>
                ))}
                <div className="h-px bg-brand-maroon/20 w-full"></div>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-brand-maroon animate-ping"></div>
                   <p className="text-[10px] font-black uppercase">MariaDB 10.11+ Required</p>
                </div>
              </div>
            </section>
          </div>

          {/* Environment Constraints Card */}
          <section className="bg-white dark:bg-slate-800 rounded-[2.5rem] border-2 border-brand-maroon/5 shadow-2xl overflow-hidden">
            <div className="px-10 py-8 border-b-2 border-brand-maroon/5 bg-slate-50/50 dark:bg-slate-800/50 flex items-center gap-4">
              <div className="p-3 bg-slate-100 text-slate-600 rounded-2xl"><Terminal size={20} /></div>
              <h2 className="text-2xl font-black text-brand-maroon tracking-tight uppercase">Infrastructure Directives</h2>
            </div>
            <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentProject.technicalConstraints.map((constraint, i) => {
                const [cat, detail] = constraint.includes(':') ? constraint.split(':') : [null, constraint];
                return (
                  <div key={i} className="p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 hover:border-brand-maroon/20 transition-all group">
                    {cat && <span className="block text-[10px] font-black uppercase text-brand-maroon/40 tracking-widest mb-2 group-hover:text-brand-maroon transition-colors">{cat}</span>}
                    <p className="text-sm font-black text-slate-800 dark:text-slate-200">{detail}</p>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-10">
          {/* Official ICT Contact */}
          <div className="bg-white rounded-[2.5rem] border-4 border-brand-maroon p-8 shadow-xl space-y-4 relative overflow-hidden group">
             <div className="absolute -bottom-8 -right-8 text-brand-maroon/5 group-hover:text-brand-maroon/10 transition-colors">
                <Shield size={120} fill="currentColor" />
             </div>
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-maroon flex items-center justify-center text-white">
                  <Mail size={16} />
                </div>
                <h3 className="font-heading font-black text-xs text-brand-maroon uppercase tracking-widest">ICT Support</h3>
             </div>
             <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase relative z-10">
                Authorized directive issued by the ICT Governance Office.
             </p>
             <p className="text-xs font-black text-brand-maroon relative z-10">daniel.twum@techbridge.edu.gh</p>
          </div>

          {/* Submission Protocol */}
          <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl space-y-8 border-t-8 border-brand-gold">
            <h3 className="text-2xl font-black tracking-tight uppercase leading-none">Submission Protocol</h3>
            <div className="space-y-6">
              {[1,2,3].map((step) => (
                <div key={step} className="flex gap-4 items-center">
                  <div className="w-10 h-10 rounded-2xl bg-brand-gold text-brand-maroon flex items-center justify-center font-black text-xl shrink-0">
                    {step}
                  </div>
                  <p className="text-xs font-bold text-slate-300">
                    {step === 1 && "Fork the certified Spring Boot / MariaDB boilerplate."}
                    {step === 2 && "Implement logic and provide a production-ready Dockerfile."}
                    {step === 3 && "Submit via the official ICT staff portal for verification."}
                  </p>
                </div>
              ))}
            </div>
            <a 
              href={currentProject.boilerplateUrl} 
              target="_blank" 
              className="btn-primary w-full py-5 rounded-2xl flex items-center justify-center gap-3 text-sm font-black"
            >
              ACCESS ICT REPO <ExternalLink size={20} />
            </a>
          </div>

          {/* Institutional Rubric */}
          <div className="bg-white rounded-[2.5rem] border-2 border-brand-maroon/5 p-10 shadow-xl space-y-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-brand-lightGold text-brand-maroon rounded-2xl"><Info size={20} /></div>
              <h3 className="font-black text-xs uppercase tracking-widest text-brand-maroon">Grading Matrix</h3>
            </div>
            <div className="space-y-6">
              {currentProject.rubric.map((item: any, i: number) => (
                <div key={i} className="space-y-3">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter">
                    <span className="text-slate-500">{item.criterion}</span>
                    <span className="text-brand-maroon">{item.weight}%</span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div className="h-full bg-brand-maroon rounded-full" style={{ width: `${item.weight}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TakeHomeView;
