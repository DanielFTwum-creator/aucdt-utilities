import { useState, useEffect } from 'react';
import { MUSICAL_CONCEPTS, FOUND_OBJECTS, CASEL_CHART } from '../lib/data';
import { FoundObjectInstrument, MusicalConcept, CASELMapping } from '../types';
import { playFoundObject, playConceptDemo } from '../lib/audio';
import { 
  Sparkles, 
  HelpCircle, 
  BookOpen, 
  CheckCircle2, 
  Play, 
  Pause, 
  Volume2, 
  Check, 
  Smile, 
  Heart
} from 'lucide-react';

interface ResourceHubProps {
  onBackToHome: () => void;
}

export function ResourceHub({ onBackToHome }: ResourceHubProps) {
  const [activeTab, setActiveTab] = useState<'concepts' | 'objects' | 'sel' | 'tips'>('concepts');
  const [activeConceptDemo, setActiveConceptDemo] = useState<string | null>(null);
  const [demoStep, setDemoStep] = useState<number>(-1);
  const [cancelDemoFn, setCancelDemoFn] = useState<(() => void) | null>(null);
  const [expandedTip, setExpandedTip] = useState<number | null>(null);

  // Stop sound loops on unmount safely
  useEffect(() => {
    return () => {
      if (cancelDemoFn) cancelDemoFn();
    };
  }, [cancelDemoFn]);

  // Handle concept demo play trigger
  const runConceptDemo = (concept: MusicalConcept) => {
    if (cancelDemoFn) {
      cancelDemoFn();
      setCancelDemoFn(null);
    }

    if (activeConceptDemo === concept.term) {
      setActiveConceptDemo(null);
      setDemoStep(-1);
      return;
    }

    setActiveConceptDemo(concept.term);
    setDemoStep(0);

    const cleanup = playConceptDemo(concept.demoType, (step) => {
      setDemoStep(step);
    });

    // Cache cancel function
    setCancelDemoFn(() => () => {
      cleanup();
      setActiveConceptDemo(null);
      setDemoStep(-1);
    });

    // Auto-stop normal short demos after a brief period
    const totalDuration = concept.demoType === 'pulse' ? 2400 : 
                          concept.demoType === 'decelerando' ? 3400 :
                          concept.demoType === 'accelerando' ? 2000 : 2500;
    setTimeout(() => {
      setActiveConceptDemo((current) => {
        if (current === concept.term) {
          setDemoStep(-1);
          return null;
        }
        return current;
      });
    }, totalDuration);
  };

  // Common Troubleshooting Tips list matching page 18-19
  const TROUBLESHOOTING_TIPS = [
    {
      q: "Children won’t stop playing when the story pauses.",
      a: "This is completely normal and expected, especially on the first telling. Don’t fight it — lean into the story. Stop playing yourself, hold up one finger, and say quietly: 'How many elephants are walking?' The question almost always works. If it doesn’t, try making the elephant sound — children will stop to listen and then laugh, which resets the energy."
    },
    {
      q: "Children are playing too fast for the elephant walk.",
      a: "Model the tempo yourself with exaggerated slowness. Say 'SLOW... elephant... walking...' as you play each beat. If needed, physically slow your arm movements to match the beat. Children mirror the facilitator’s body language more than they follow verbal instruction."
    },
    {
      q: "Children don’t respond to the shaker — they don’t say ‘snakes.’",
      a: "Give them a moment. Silence is sometimes the right answer — let it sit. If nothing comes, shake the shaker a little more dramatically and look around the room with wide eyes. One child will say it, and the rest will follow instantly."
    },
    {
      q: "The improvisation sections become chaotic and hard to bring back.",
      a: "This is actually a sign of success — children are deeply engaged. To bring them back, play the loud drum slap firmly and clearly. If that doesn’t work, stop playing completely and hold up the shaker. The visual cue of a new instrument tends to immediately redirect attention."
    },
    {
      q: "Older children seem reluctant or self-conscious.",
      a: "Commit fully to the story yourself. Older children follow adult energy — if you are enthusiastic and unselfconscious, they will follow. It also helps to acknowledge the silliness directly: 'I know this seems a little goofy, but trust me — just try it.' That small moment of honesty almost always breaks the ice."
    },
    {
      q: "A child doesn’t have an instrument or found object.",
      a: "Their lap, their desk, their hands clapping together — anything works. Encourage creativity and make it clear that the sound matters more than the object. Some of the best percussion sounds in a DfS classroom have come from unexpected places."
    }
  ];

  return (
    <div id="resource-hub-container" className="space-y-6 pb-12 animate-fade-in">
      
      {/* Tabs list navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-amber-900/10 shadow-xs">
        <div className="space-y-1">
          <h2 className="font-heading text-xl font-bold text-brand-earth flex items-center gap-1.5">
            <Sparkles className="h-5 w-5 text-brand-gold animate-spin" style={{ animationDuration: '60s' }} />
            Curriculum Reference Index &amp; Sandbox
          </h2>
          <p className="text-xs text-[#64748B]">
            Interactive auditory demonstrations, CASEL mappings, found objects, and classroom troubleshooting.
          </p>
        </div>
        <button
          onClick={onBackToHome}
          type="button"
          id="btn-hub-home"
          className="w-full sm:w-auto py-2 px-4 hover:bg-amber-100/50 hover:text-brand-earth rounded-lg border border-dashed border-amber-900/30 text-amber-900 font-medium text-xs tracking-wider uppercase transition-all text-center cursor-pointer"
        >
          &larr; Exit to Menu
        </button>
      </div>

      {/* Tabs Trigger List */}
      <div className="flex flex-wrap border-b border-amber-900/10">
        {[
          { id: 'concepts', label: "📋 Musical Techniques", icon: "🥁" },
          { id: 'objects', label: "📦 Found Objects Sandbox", icon: "🔔" },
          { id: 'sel', label: "❤️ CASEL SEL mapping", icon: "🌱" },
          { id: 'tips', label: "💬 Teacher Tips", icon: "👨‍🏫" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
              if (cancelDemoFn) {
                cancelDemoFn();
                setCancelDemoFn(null);
              }
            }}
            type="button"
            className={`py-3 px-4 sm:px-5 border-b-2 text-sm font-semibold tracking-wide flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'border-brand-earth text-brand-earth font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TABS VIEWS */}
      
      {/* 1. Concepts panel */}
      {activeTab === 'concepts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
          
          <div className="md:col-span-2 bg-amber-50/50 p-4 rounded-xl border border-amber-900/10 mb-2">
            <h3 className="font-heading font-bold text-sm text-brand-earth">Programmatic Sound Demonstrations</h3>
            <p className="text-xs text-amber-950/70 mt-1 leading-relaxed">
              Below are the key musical concepts taught implicitly by Steve's story before children ever study formal musical notation. Press the <strong className="text-brand-earth">Demo Tone</strong> icons to hear synthesized Web Audio sequences illustrating each term!
            </p>
          </div>

          {MUSICAL_CONCEPTS.map((concept) => {
            const isPlaying = activeConceptDemo === concept.term;

            return (
              <div 
                key={concept.term} 
                className="bg-white p-4 rounded-2xl border border-amber-900/10 shadow-xs hover:shadow-sm hover:border-brand-gold/20 flex flex-col justify-between gap-3 transition-all"
              >
                <div className="space-y-1.5 text-left">
                  <div className="flex justify-between items-center">
                    <h4 className="font-heading text-base font-bold text-brand-earth">
                      {concept.term}
                    </h4>
                    
                    {concept.hasAudioDemo && (
                      <button
                        onClick={() => runConceptDemo(concept)}
                        type="button"
                        className={`h-7 w-7 rounded-full flex items-center justify-center transition-all cursor-pointer border ${
                          isPlaying 
                            ? 'bg-red-500 border-red-500 text-white shadow-md rotate-90 scale-105' 
                            : 'bg-amber-100 hover:bg-amber-200 border-amber-300 text-brand-gold hover:scale-105'
                        }`}
                        title="Demo this concept"
                      >
                        {isPlaying ? <Pause className="h-3.5 w-3.5 text-white" /> : <Play className="h-3.5 w-3.5" />}
                      </button>
                    )}
                  </div>
                  
                  <p className="text-xs text-charcoal leading-relaxed">
                    {concept.definition}
                  </p>
                </div>

                <div className="bg-amber-50/40 p-2.5 rounded-lg border border-amber-900/5 hover:bg-amber-100/20">
                  <span className="font-mono text-[9px] font-bold text-[#B45309] block uppercase tracking-wider">
                    How it applies in Steve's Book:
                  </span>
                  <p className="text-[11px] text-amber-950 leading-relaxed mt-0.5">
                    {concept.dfsApplication}
                  </p>
                  
                  {/* Visual tick indicator for live playing steps */}
                  {isPlaying && demoStep >= 0 && (
                    <div className="flex items-center gap-1.5 mt-2 animate-pulse justify-center">
                      <span className="text-[10px] font-mono text-center text-brand-red font-bold">Rhythm Loop Active:</span>
                      <span className="h-2 w-2 rounded-full bg-brand-red"></span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. Found Objects sandbox */}
      {activeTab === 'objects' && (
        <div className="space-y-5 animate-fade-in">
          
          <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-900/10 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="md:col-span-2 space-y-1.5 text-left">
              <h3 className="font-heading text-lg font-bold text-brand-earth">
                No Drums? No Problem!
              </h3>
              <p className="text-xs text-amber-950/70 leading-relaxed">
                Steve's curriculum has been deployed completely without instruments using found classroom objects! 
                This sandbox illustrates alternative household items that produce surprisingly high fidelity echoes.
              </p>
              <p className="text-[11px] text-brand-gold font-mono font-bold uppercase tracking-wider">
                📢 TAP ANY CARD BELOW TO CHIRP OR RATTLE THAT OBJECT'S SOUNDS LIVE!
              </p>
            </div>
            <div className="p-3 bg-white border border-amber-900/10 rounded-xl text-center space-y-1">
              <span className="text-3xl block">📦</span>
              <span className="font-mono text-[9px] text-[#B45309] font-bold block uppercase tracking-wide">
                Acoustic Alternatives
              </span>
            </div>
          </div>

          {/* Grid layout of interactive object trigger cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {FOUND_OBJECTS.map((obj) => (
              <button
                key={obj.id}
                onClick={() => playFoundObject(obj.id)}
                type="button"
                className="text-left bg-white p-4 rounded-xl border border-amber-950/10 hover:border-brand-gold/40 hover:-translate-y-0.5 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex justify-between items-start">
                    <span className="font-bold font-sans text-xs text-brand-earth uppercase tracking-wide">
                      {obj.name}
                    </span>
                    <span className="text-[10px] font-mono select-none px-1.5 py-0.5 rounded bg-amber-50 text-brand-gold border border-amber-900/5 font-semibold">
                      {obj.soundType}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#475569] leading-relaxed mt-1">
                    {obj.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-amber-900/5 flex justify-between items-center text-[10px] font-mono">
                  <span className="text-slate-500">Replaces:</span>
                  <span className="text-brand-gold font-bold uppercase tracking-tight group-hover:underline">
                    {obj.realAlternative} &rarr;
                  </span>
                </div>
              </button>
            ))}
          </div>

        </div>
      )}

      {/* 3. CASEL SEL Log Map */}
      {activeTab === 'sel' && (
        <div className="space-y-4 animate-fade-in">
          
          <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-950/5">
            <h3 className="font-heading text-base font-bold text-emerald-950">
              The CASEL Social-Emotional Learning Framework
            </h3>
            <p className="text-xs text-emerald-900/70 mt-1 leading-relaxed">
              A functioning drumming group is a near-perfect physical manifestation of the Collaborative for Academic, Social, and Emotional Learning (CASEL) standards. Here is how Steve Ferraris&apos; book connects with each core competency.
            </p>
          </div>

          <div className="space-y-4">
            {CASEL_CHART.map((comp) => (
              <div 
                key={comp.competency} 
                className="bg-white p-5 rounded-2xl border border-slate-100 flex flex-col md:flex-row gap-4 items-start"
              >
                {/* Competency badge */}
                <div className="md:w-1/4 shrink-0 space-y-1">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold font-sans text-emerald-800 bg-[#E8F5E9] rounded-full px-3 py-1">
                    <Smile className="h-3.5 w-3.5 text-emerald-600" />
                    {comp.competency}
                  </span>
                  <p className="text-[11px] text-slate-500 italic">
                    &ldquo;{comp.description}&rdquo;
                  </p>
                </div>

                {/* Connection description */}
                <div className="flex-1 space-y-3 font-sans">
                  <div className="text-xs text-[#334155] leading-relaxed bg-[#FAF9F6] p-3 rounded-xl border border-amber-900/5">
                    <strong className="text-brand-earth">How drumming teaches it:</strong> {comp.drummingConnection}
                  </div>

                  <div className="space-y-1.5 pl-2">
                    <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider block">
                      Direct Book Milestones:
                    </span>
                    <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {comp.examples.map((ex, exIdx) => (
                        <li key={exIdx} className="bg-white p-2 rounded-lg border border-slate-100 text-[10px] text-[#475569] leading-relaxed flex gap-1.5 items-start">
                          <Check className="h-3 w-3 text-brand-green mt-0.5 shrink-0" />
                          <span>{ex}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* 4. Teacher Tips & Troubleshooting */}
      {activeTab === 'tips' && (
        <div className="space-y-5 animate-fade-in">
          
          <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-900/10">
            <h3 className="font-heading text-base font-bold text-brand-earth">
              Facilitator Handbook & Troubleshooting Guide
            </h3>
            <p className="text-xs text-amber-950/70 mt-1 leading-relaxed">
              Teaching drum rhythm to elementary school children can bring lively chaos. Use Steve&apos;s field-tested classroom cheat-sheets to gracefully navigate common behaviors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Left sidebar: general tips summary */}
            <div className="space-y-4">
              <div className="bg-white border border-amber-950/10 p-5 rounded-2xl space-y-3">
                <span className="text-xs font-mono font-bold text-[#B45309] block uppercase tracking-wide">
                  ⭐ Tips for Different Settings
                </span>
                
                <div className="space-y-2 text-xs text-[#334155] leading-relaxed">
                  <div>
                    <h5 className="font-bold text-brand-earth mb-0.5">Elementary Music Studio:</h5>
                    <p>Use as the opening activities of percussion units. Direct and seating techniques require very little words. Formally deconstruct the terms afterward.</p>
                  </div>
                  <div>
                    <h5 className="font-bold text-brand-earth mb-0.5">General Education Classroom:</h5>
                    <p>Use for brain breaks! Tables acts as wonderful drums. Helps build intense focus, auditory sequencing, and emotional release within 5 to 10 minutes.</p>
                  </div>
                  <div>
                    <h5 className="font-bold text-brand-earth mb-0.5">Homeschooling / Families:</h5>
                    <p>Scales perfectly to any size, even one child combined with one adult. Facilitators play the call rhythm, and children handle responses. Free found objects are highly rewarded!</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right sidebar: Interactive accordion troubleshooting Q&As */}
            <div className="space-y-3">
              <h4 className="font-mono text-[10px] text-slate-500 font-bold uppercase tracking-wider pl-1">
                Common Classroom Scenarios
              </h4>
              
              <div className="space-y-2">
                {TROUBLESHOOTING_TIPS.map((tip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setExpandedTip(expandedTip === idx ? null : idx)}
                    className="w-full text-left bg-white p-3 rounded-xl border border-slate-100 hover:border-brand-gold/30 hover:bg-[#FAF9F5] cursor-pointer transition-all block focus:outline-hidden"
                  >
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-xs font-bold text-[#1E293B] leading-snug flex items-start gap-1.5">
                        <span className="text-brand-red font-mono font-bold text-[10px] bg-red-50 px-1 py-0.5 rounded shrink-0">SCENARIO</span>
                        <span>{tip.q}</span>
                      </span>
                      <span className="text-xs font-bold text-brand-gold">
                        {expandedTip === idx ? "▼" : "▶"}
                      </span>
                    </div>

                    {expandedTip === idx && (
                      <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-[#475569] leading-relaxed space-y-1.5 animate-fade-in">
                        <span className="font-mono text-[9px] font-bold text-brand-green tracking-wide uppercase block">Steve&apos;s Solution:</span>
                        <p className="italic bg-amber-50/20 p-2 rounded-lg text-brand-earth">
                          &ldquo;{tip.a}&rdquo;
                        </p>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
