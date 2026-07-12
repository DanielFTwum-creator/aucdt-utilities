import { useState } from 'react';
import { Sparkles, HelpCircle, AlertCircle, CheckCircle2, ChevronRight, Copy, Check } from 'lucide-react';

export default function PromptFrameworkCard() {
  const [copiedWeak, setCopiedWeak] = useState(false);
  const [copiedStrong, setCopiedStrong] = useState(false);
  const [activeHighlight, setActiveHighlight] = useState<string | null>(null);

  const copyToClipboard = (text: string, setCopied: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const frameworkParts = [
    {
      id: 'goal',
      name: 'Goal',
      desc: 'One clear, specific thing you want the AI to generate.',
      color: 'bg-[#EAFDF5] text-[#0F5132] border-[#C3E6CB] hover:bg-[#D5F9EA]',
      badgeColor: 'bg-[#198754] text-white',
      textHighlight: 'text-[#198754] bg-[#EAFDF5] px-1 rounded font-semibold border border-[#C3E6CB]',
      examplePart: 'Write a 300-word case study on teamwork failure',
    },
    {
      id: 'context',
      name: 'Context',
      desc: 'The essential background details, student cohort, and level.',
      color: 'bg-[#E8F4FD] text-[#084298] border-[#B6EFFB] hover:bg-[#D4EBFD]',
      badgeColor: 'bg-[#0D6EFD] text-white',
      textHighlight: 'text-[#0D6EFD] bg-[#E8F4FD] px-1 rounded font-semibold border border-[#B6EFFB]',
      examplePart: 'for my HND Fashion Design Technology students at a Ghanaian university college. Context: they are in their second year and about to start group portfolio projects.',
    },
    {
      id: 'example',
      name: 'Example',
      desc: 'Showing the format, tone, or shape of what you expect.',
      color: 'bg-[#F3EAFE] text-[#5213AA] border-[#E1C6FF] hover:bg-[#EAE0FC]',
      badgeColor: 'bg-[#6F42C1] text-white',
      textHighlight: 'text-[#6F42C1] bg-[#F3EAFE] px-1 rounded font-semibold border border-[#E1C6FF]',
      examplePart: 'Base it on a realistic scenario — a four-person group preparing for a fashion show where one member misses deadlines.',
    },
    {
      id: 'steps',
      name: 'Steps',
      desc: 'An ordered guide to break down complex sequential assignments.',
      color: 'bg-[#FFF9E6] text-[#664D03] border-[#FFE69C] hover:bg-[#FFF3CD]',
      badgeColor: 'bg-[#FFC107] text-black',
      textHighlight: 'text-[#664D03] bg-[#FFF9E6] px-1 rounded font-semibold border border-[#FFE69C]',
      examplePart: 'End with three discussion questions.',
    },
    {
      id: 'boundaries',
      name: 'Boundaries',
      desc: 'Constraints like word length, tone, writing style, or exclusions.',
      color: 'bg-[#FFF5F5] text-[#842029] border-[#F5C2C7] hover:bg-[#FEE2E2]',
      badgeColor: 'bg-[#DC3545] text-white',
      textHighlight: 'text-[#DC3545] bg-[#FFF5F5] px-1 rounded font-semibold border border-[#F5C2C7]',
      examplePart: 'Tone: practical, not preachy. British English.',
    },
  ];

  const weakPromptText = "Write about teamwork for my students.";

  const strongPromptText = "Write a 300-word case study on teamwork failure for my HND Fashion Design Technology students at a Ghanaian university college. Context: they are in their second year and about to start group portfolio projects. Base it on a realistic scenario — a four-person group preparing for a fashion show where one member misses deadlines. End with three discussion questions. Tone: practical, not preachy. British English.";

  return (
    <section className="bg-white border border-editorial-border rounded-2xl p-6 sm:p-8 space-y-8">
      {/* Block Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-editorial-border">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-editorial-accent flex items-center gap-2">
            Block 1 <span className="text-editorial-text-muted font-sans font-normal">•</span> Prompting Fundamentals
          </h2>
          <p className="text-sm text-editorial-text-medium font-sans">Master the foundational art of crafting high-impact instructions.</p>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-editorial-secondary border border-editorial-border rounded-lg text-xs text-editorial-text-light font-semibold font-mono">
          <span>Active Practice</span>
        </div>
      </div>

      {/* 5-Part Framework Graphic */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-editorial-accent font-serif flex items-center gap-2">
          <Sparkles size={16} className="text-editorial-gold" />
          The 5-Part Framework
        </h3>
        <p className="text-sm text-editorial-text-medium leading-relaxed max-w-3xl">
          Every masterfully written prompt uses five foundational dimensions to guide generative models to highly professional, context-specific results on the first attempt. Click on any part below to highlight it in the example.
        </p>

        {/* Dynamic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
          {frameworkParts.map((part) => (
            <button
              key={part.id}
              onClick={() => setActiveHighlight(activeHighlight === part.id ? null : part.id)}
              className={`p-4 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between h-36 cursor-pointer ${
                activeHighlight === part.id
                  ? `${part.color} ring-2 ring-editorial-accent/25 scale-[1.02] shadow-sm`
                  : 'bg-editorial-secondary/40 border-editorial-border hover:border-editorial-text-muted hover:bg-editorial-secondary text-editorial-text-dark'
              }`}
            >
              <div>
                <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${part.badgeColor}`}>
                  {part.name}
                </span>
                <p className="text-xs text-editorial-text-light mt-2.5 leading-normal font-sans">{part.desc}</p>
              </div>
              <span className="text-[10px] font-mono text-editorial-text-muted flex items-center gap-0.5 mt-2">
                Click to inspect <ChevronRight size={10} />
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Weak vs Strong comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4">
        {/* Weak Prompt Card */}
        <div className="lg:col-span-4 bg-editorial-secondary/30 border border-editorial-border rounded-xl p-5 flex flex-col justify-between h-full relative">
          <div className="absolute -top-3 left-4 inline-flex items-center gap-1 px-2.5 py-1 bg-[#FDF2F2] border border-[#FDE8E8] rounded text-[9px] font-bold text-[#C81E1E] tracking-widest uppercase font-mono">
            <AlertCircle size={10} />
            Weak Example
          </div>
          
          <div className="space-y-3 mt-2">
            <p className="text-xs font-mono text-editorial-text-muted">INPUT PROMPT:</p>
            <blockquote className="text-sm text-editorial-text-light italic bg-white border border-editorial-border rounded-xl p-4 font-serif leading-relaxed">
              "{weakPromptText}"
            </blockquote>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-editorial-border/60 pt-4">
            <span className="text-xs text-editorial-text-light leading-normal">
              Produces standard, generic, boilerplate output that misses Ghanaian local relevance completely.
            </span>
            <button
              onClick={() => copyToClipboard(weakPromptText, setCopiedWeak)}
              className="p-1.5 hover:bg-editorial-secondary rounded-lg text-editorial-text-muted hover:text-editorial-text-dark transition-colors cursor-pointer"
              title="Copy prompt"
            >
              {copiedWeak ? <Check size={14} className="text-[#198754]" /> : <Copy size={14} />}
            </button>
          </div>
        </div>

        {/* Strong Prompt Card */}
        <div className="lg:col-span-8 bg-editorial-secondary/20 border border-editorial-border rounded-xl p-5 flex flex-col justify-between h-full relative">
          <div className="absolute -top-3 left-4 inline-flex items-center gap-1 px-2.5 py-1 bg-[#EDFDFD] border border-[#C5F2F2] rounded text-[9px] font-bold text-editorial-accent tracking-widest uppercase font-mono">
            <CheckCircle2 size={10} />
            Strong Example
          </div>

          <div className="space-y-3 mt-2">
            <p className="text-xs font-mono text-editorial-accent font-semibold">MASTERCLASS FORMATTED PROMPT:</p>
            <div className="text-sm text-editorial-text-medium bg-white border border-editorial-border rounded-xl p-4 font-sans leading-relaxed shadow-sm">
              <span className={activeHighlight === 'goal' ? frameworkParts[0].textHighlight : ''}>
                Write a 300-word case study on teamwork failure
              </span>{' '}
              <span className={activeHighlight === 'context' ? frameworkParts[1].textHighlight : ''}>
                for my HND Fashion Design Technology students at a Ghanaian university college. Context: they are in their second year and about to start group portfolio projects.
              </span>{' '}
              <span className={activeHighlight === 'example' ? frameworkParts[2].textHighlight : ''}>
                Base it on a realistic scenario — a four-person group preparing for a fashion show where one member misses deadlines.
              </span>{' '}
              <span className={activeHighlight === 'steps' ? frameworkParts[3].textHighlight : ''}>
                End with three discussion questions.
              </span>{' '}
              <span className={activeHighlight === 'boundaries' ? frameworkParts[4].textHighlight : ''}>
                Tone: practical, not preachy. British English.
              </span>
            </div>
          </div>

          <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-editorial-border/60 pt-4">
            <p className="text-xs text-editorial-text-light leading-normal max-w-md">
              <strong>Why it works:</strong> Fully contextualized cohort, strict boundaries, local relevance, and a concrete scenario that delivers precise, ready-to-teach results.
            </p>
            <button
              onClick={() => copyToClipboard(strongPromptText, setCopiedStrong)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-editorial-accent text-white hover:bg-editorial-accent/90 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors self-end shadow-sm cursor-pointer"
            >
              {copiedStrong ? (
                <>
                  <Check size={12} className="text-emerald-300" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={12} />
                  <span>Copy Prompt</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

