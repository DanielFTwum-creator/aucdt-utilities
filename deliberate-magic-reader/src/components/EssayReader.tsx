import React, { useState, useEffect, useRef } from "react";
import { Essay, essays as baseEssays } from "../data/essays";
import { Calendar, Type, Maximize2, Sparkles, BookOpen, ChevronLeft, ArrowRight, Eye, RefreshCw, Copy, Check } from "lucide-react";
import { motion } from "motion/react";

interface EssayReaderProps {
  essay: Essay;
  onBack: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  allEssays?: Essay[];
  onSelectEssay?: (essay: Essay) => void;
}

const glossaryShortcuts: Record<string, string> = {
  "overnight delegation": "The practice of leaving autonomous agents with full write capabilities to run, refactor, and self-heal codebases overnight.",
  "delegation loop": "A recursive execution cycle where human intention is mapped down into multi-layered agent actions, running with automated agency.",
  "tokens": "The fundamental currency and feedstock of large language models, representing segments of characters that context windows digest as data.",
  "glucose": "A metaphor for compute tokens, representing the core nourishment and metabolic fuel consumed by autonomous routing engines.",
  "context weightings": "The ratio (e.g. A/B/C) balancing structural guidelines, active diagnostics, and conversation histories to optimize model behavior.",
  "sautéed": "Refers to context instructions that are refined and condensed via quick, iterative self-correction loops until only the most fragrant constraints remain.",
  "institutional memory": "The latent, unwritten tribal knowledge and architectural constraints that exist between the commits and design files of static codebases.",
  "semantic decay": "The natural degradation of code vocabulary and architectural intents over time as creators depart and documentation gathers dust.",
  "documentation debt": "The mounting cognitive tax on a system when unwritten words and vague naming schemas force agents to spend compute aligning terminology.",
  "osmosis": "The passive, spectator-like absorption of local repo context before an agent initiates active execution pipelines.",
  "osmosing": "The state of passive contextual absorption. A spectator reading codebase parameters without initiating active, structured changes.",
  "port verification": "Probing and validating network bindings (like Port 3007) to ensure an active, authorized bridge between intent and live execution.",
  "port 3007": "The primary container ingress port that serves as the bridge between developers, reverse proxy servers, and agent actions.",
  "technical debt": "The long-term engineering cost from prioritizing rapid delivery speeds over modularity, doc-coverage, or clean configurations.",
  "spaghetti code": "Devoid of modularity or separation of concerns; highly coupled, tangled software files prone to cascade failures.",
  "circular dependencies": "A situation where two or more software modules refer to each other directly or indirectly, creating compilation blocks.",
  "cognitive overhead": "The mental demand and processing resource required to navigate, decant, or make sense of ambiguous system layouts."
};

const glossaryTermsList = Object.keys(glossaryShortcuts).sort((a, b) => b.length - a.length);

function GlossaryTooltip({ term, children, essayContext }: { term: string; children: React.ReactNode; essayContext?: string }) {
  const [hovered, setHovered] = useState(false);
  const [definition, setDefinition] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const normalized = (term || "").toLowerCase().trim();
  const fastDef = normalized ? (glossaryShortcuts[normalized] || Object.entries(glossaryShortcuts).find(([k]) => {
    if (!k || !normalized) return false;
    return normalized.includes(k) || k.includes(normalized);
  })?.[1]) : undefined;

  const handleMouseEnter = async () => {
    setHovered(true);
    if (definition || loading) return;

    if (fastDef) {
      setDefinition(fastDef);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/define", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ term: normalized, context: essayContext })
      });
      const data = await response.json();
      if (data.success) {
        setDefinition(data.definition);
      } else {
        setDefinition("A technical term representing tech logic or process within modern agentic architectures.");
      }
    } catch {
      setDefinition("A technical term representing tech logic or process within modern agentic architectures.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <span 
      className="relative border-b border-dashed border-amber-600/80 dark:border-amber-400/80 hover:bg-amber-100/30 hover:dark:bg-amber-950/20 px-0.5 rounded cursor-help transition-all duration-200 inline font-medium text-amber-900 dark:text-amber-400 select-all"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
      {hovered && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950 text-[11px] leading-relaxed shadow-lg rounded border border-zinc-800 dark:border-zinc-200 z-50 text-left font-serif font-normal cursor-text pointer-events-none">
          <span className="block font-mono text-[8px] font-bold text-amber-500 dark:text-amber-600 uppercase tracking-widest mb-1 select-none">
            AI GLOSSARY DEFINITION
          </span>
          {loading ? (
            <span className="flex items-center gap-1 text-zinc-400 font-mono text-[9px] select-none">
              <RefreshCw className="w-2.5 h-2.5 animate-spin" /> Querying AI Lexicon...
            </span>
          ) : (
            <span className="block italic">"{definition}"</span>
          )}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-zinc-950 dark:border-t-zinc-50" />
        </span>
      )}
    </span>
  );
}

function tokenizeWithTooltips(text: string, essayContext?: string): React.ReactNode[] {
  if (!text) return [];
  
  let currentSegment: { type: 'text' | 'jsx'; val: string | React.ReactNode }[] = [{ type: 'text', val: text }];
  
  glossaryTermsList.forEach((term) => {
    const nextSegment: typeof currentSegment = [];
    currentSegment.forEach((seg) => {
      if (seg.type === 'jsx') {
        nextSegment.push(seg);
        return;
      }
      
      const str = seg.val as string;
      const lowerStr = str.toLowerCase();
      
      const index = lowerStr.indexOf(term);
      if (index === -1) {
        nextSegment.push(seg);
        return;
      }
      
      let lastIndex = 0;
      let currentIndex = lowerStr.indexOf(term);
      
      while (currentIndex !== -1) {
        if (currentIndex > lastIndex) {
          nextSegment.push({ type: 'text', val: str.substring(lastIndex, currentIndex) });
        }
        
        const matchedOrig = str.substring(currentIndex, currentIndex + term.length);
        nextSegment.push({
          type: 'jsx',
          val: (
            <span key={`${term}-${currentIndex}`}>
              <GlossaryTooltip term={term} essayContext={essayContext}>{matchedOrig}</GlossaryTooltip>
            </span>
          )
        });
        
        lastIndex = currentIndex + term.length;
        currentIndex = lowerStr.indexOf(term, lastIndex);
      }
      
      if (lastIndex < str.length) {
        nextSegment.push({ type: 'text', val: str.substring(lastIndex) });
      }
    });
    currentSegment = nextSegment;
  });
  
  return currentSegment.map((seg, i) => <React.Fragment key={i}>{seg.val}</React.Fragment>);
}

const stopWords = new Set([
  "the", "a", "an", "of", "and", "in", "to", "is", "on", "it", "that", "this", "our", "their", "are", "with", "how", "as", "by", "for", "from", "at", "we", "you", "or", "was", "be", "were", "has", "have", "had", "not", "but", "about"
]);

function getRelatedEssays(currentEssay: Essay, allEssays: Essay[], count = 3): Essay[] {
  const parseWords = (text: string): string[] => {
    return text
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"“”'’]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length >= 3 && !stopWords.has(w));
  };

  const currentWords = new Set([
    ...parseWords(currentEssay.title),
    ...parseWords(currentEssay.theme || ""),
    ...parseWords(currentEssay.snippet)
  ]);

  const scored = allEssays
    .filter((e) => e.id !== currentEssay.id)
    .map((e) => {
      const eTitleWords = parseWords(e.title);
      const eThemeWords = parseWords(e.theme || "");
      const eSnippetWords = parseWords(e.snippet);

      let score = 0;
      
      eTitleWords.forEach((word) => {
        if (currentWords.has(word)) score += 5;
      });
      eThemeWords.forEach((word) => {
        if (currentWords.has(word)) score += 3;
      });
      eSnippetWords.forEach((word) => {
        if (currentWords.has(word)) score += 1;
      });

      return { essay: e, score };
    });

  scored.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return Math.abs(currentEssay.part - a.essay.part) - Math.abs(currentEssay.part - b.essay.part);
  });

  return scored.slice(0, count).map((item) => item.essay);
}

// Custom hook to calculate the reading progress of a specific article element using window.scrollY
function useReadingProgress(ref: React.RefObject<HTMLDivElement | null>, dependency: any): number {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    setScrollProgress(0);

    const handleScroll = () => {
      if (!ref.current) return;
      
      const rect = ref.current.getBoundingClientRect();
      const contentHeight = rect.height;
      
      // Absolute top of the article element in the document
      const articleTop = rect.top + window.scrollY;
      
      const viewportHeight = window.innerHeight;
      
      // Offset for sticky header/control bars (about 150px)
      const offsetTop = 150; 
      
      // Absolute current scroll position of our reading line threshold
      const currentScroll = window.scrollY + offsetTop;
      const scrolledPastTop = currentScroll - articleTop;
      
      // Total scroll range within the boundaries of the article
      const totalScrollable = contentHeight - (viewportHeight - offsetTop);
      
      if (totalScrollable <= 0) {
        setScrollProgress(0);
        return;
      }
      
      let progress = (scrolledPastTop / totalScrollable) * 100;
      progress = Math.min(Math.max(progress, 0), 100);
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    
    // Initial calculation on load/mount
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [ref, dependency]);

  return scrollProgress;
}

export default function EssayReader({ essay, onBack, onNext, onPrev, allEssays, onSelectEssay }: EssayReaderProps) {
  const [fontSize, setFontSize] = useState<"sm" | "base" | "lg" | "xl">("base");
  const [isSerif, setIsSerif] = useState(true);
  const [isReaderMode, setIsReaderMode] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyToClipboard = async () => {
    const plainText = `${essay.title}\nPart ${essay.part} - Status: ${essay.statusWord}\nPublished: ${essay.publishDate}\nSource: Techbridge AI Blueprint Chronicle\n\n${essay.snippet}\n\n${essay.content}`;
    
    // Prepare HTML content representing beautifully formatted paragraphs, quotes, and lists
    const processedHtmlContent = essay.content.split("\n\n").map(paragraph => {
      const trimmedPara = paragraph.trim();
      if (trimmedPara.startsWith("* ")) {
        const items = trimmedPara.split("\n");
        return `<ul style="padding-left: 20px; margin-bottom: 16px; font-family: Georgia, serif; font-size: 15px; color: #374151;">${items.map(item => `<li style="margin-bottom: 8px;">${item.replace("* ", "")}</li>`).join("")}</ul>`;
      }
      if (trimmedPara.includes("*“") || trimmedPara.includes("*\"")) {
        return `<blockquote style="border-left: 4px solid #d97706; padding-left: 16px; font-style: italic; margin: 20px 0; color: #4b5563; font-family: Georgia, serif; font-size: 15px; background-color: rgba(217, 119, 6, 0.05); padding-top: 6px; padding-bottom: 6px; border-radius: 0 4px 4px 0;">${trimmedPara.replace(/\*/g, "")}</blockquote>`;
      }
      
      let formattedPara = trimmedPara;
      const boldParts = formattedPara.split("**");
      if (boldParts.length > 1) {
        formattedPara = boldParts.map((part, idx) => idx % 2 === 1 ? `<strong>${part}</strong>` : part).join("");
      }
      return `<p style="margin-bottom: 16px; text-align: justify; font-family: Georgia, serif; font-size: 15px; line-height: 1.6; color: #374151;">${formattedPara}</p>`;
    }).join("");

    const htmlText = `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 20px auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px; background-color: #fafaf9; color: #1f2937; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
        <p style="font-family: monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #d97706; margin-bottom: 8px; font-weight: bold; margin-top: 0;">
          PART ${essay.part} // STATUS: ${essay.statusWord}
        </p>
        <h1 style="font-size: 26px; font-weight: bold; margin-top: 0; margin-bottom: 8px; color: #111827; letter-spacing: -0.02em; line-height: 1.2;">
          ${essay.title}
        </h1>
        <p style="font-size: 11px; color: #6b7280; font-family: monospace; margin-bottom: 20px; text-transform: uppercase; tracking: 0.05em;">
          Published: ${essay.publishDate} &bull; Techbridge AI Blueprint Chronicle
        </p>
        <div style="font-style: italic; color: #4b5563; border-left: 2px solid #d97706; padding-left: 12px; margin-bottom: 24px; font-size: 14px; line-height: 1.5;">
          &ldquo;${essay.snippet}&rdquo;
        </div>
        <div style="margin-bottom: 30px;">
          ${processedHtmlContent}
        </div>
        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin-top: 30px; margin-bottom: 12px;" />
        <p style="font-size: 11px; font-family: monospace; color: #9ca3af; text-align: center; margin: 0; text-transform: uppercase; letter-spacing: 0.05em;">
          Source: Techbridge AI Blueprint [TAB] &bull; Chronicle Archive
        </p>
      </div>
    `;

    try {
      const clipboardItem = new ClipboardItem({
        "text/plain": new Blob([plainText], { type: "text/plain" }),
        "text/html": new Blob([htmlText], { type: "text/html" })
      });
      await navigator.clipboard.write([clipboardItem]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn("Failed to write rich HTML to clipboard. Falling back to simple text.", err);
      try {
        await navigator.clipboard.writeText(plainText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err2) {
        console.error("Clipboard fallback failed:", err2);
      }
    }
  };

  const articleRef = useRef<HTMLDivElement>(null);
  const scrollProgress = useReadingProgress(articleRef, essay);

  const list = allEssays || baseEssays;
  const relatedEssays = getRelatedEssays(essay, list);

  const fontSizes = {
    sm: "text-xs sm:text-sm",
    base: "text-sm sm:text-base leading-relaxed",
    lg: "text-base sm:text-lg leading-relaxed",
    xl: "text-lg sm:text-xl leading-relaxed"
  };

  // Helper to parse double line breaks into structured paragraphs
  const renderParagraphs = (text: string) => {
    const essayContext = essay ? `Essay Part ${essay.part}: ${essay.title}\nTheme: ${essay.theme || ""}\nSnippet: ${essay.snippet || ""}\nContent: ${essay.content}` : "";

    return text.split("\n\n").map((para, i) => {
      // Basic formatting checkers
      if (para.startsWith("* ")) {
        // Bullet list
        const items = para.split("\n");
        return (
          <ul key={i} className="list-disc leading-relaxed pl-6 my-4 space-y-2 text-zinc-800 dark:text-zinc-200">
            {items.map((item, key) => (
              <li key={key}>{tokenizeWithTooltips(item.replace("* ", ""), essayContext)}</li>
            ))}
          </ul>
        );
      }
      
      // Inline block checking
      let content: React.ReactNode = para;
      if (para && typeof para === "string" && para.includes("**")) {
        const parts = para.split("**");
        content = parts.map((part, index) => 
          index % 2 === 1 
            ? <strong key={index} className="font-bold text-zinc-950 dark:text-white underline decoration-amber-550/60 decoration-2">{tokenizeWithTooltips(part, essayContext)}</strong> 
            : <React.Fragment key={index}>{tokenizeWithTooltips(part, essayContext)}</React.Fragment>
        );
      } else if (para && typeof para === "string") {
        content = tokenizeWithTooltips(para, essayContext);
      } else {
        content = "";
      }

      if (para && typeof para === "string" && (para.includes("*“") || para.includes("*\""))) {
        return (
          <blockquote key={i} className="border-l-4 border-amber-500 pl-4 py-1 italic font-serif my-5 text-zinc-800 dark:text-zinc-350 bg-amber-50/20 dark:bg-amber-950/10 rounded-r">
            {tokenizeWithTooltips(para.replace(/\*/g, ""), essayContext)}
          </blockquote>
        );
      }

      return (
        <p key={i} className="mb-4 text-justify leading-relaxed">
          {content}
        </p>
      );
    });
  };

  // Helper to render customized, gorgeous SVG diagrams for the visual "Screenshots" description list
  const renderDynamicIllustration = () => {
    switch (essay.part) {
      case 1:
        return (
          <svg viewBox="0 0 400 180" className="w-full h-full max-h-[160px] text-zinc-400 select-none">
            <rect width="100%" height="100%" fill="none" />
            <g transform="translate(10, 10)">
              {/* Human Intention Grid */}
              <rect x="20" y="50" width="100" height="60" rx="4" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
              <text x="70" y="85" textAnchor="middle" fill="currentColor" className="font-mono text-[9px] uppercase font-bold tracking-wider">Human Intention</text>
              
              {/* Trace Path Line */}
              <path d="M 120 80 L 260 80" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" fill="none" />
              <polygon points="260,80 252,76 252,84" fill="currentColor" />
              
              {/* Autonomous Cycle Grid */}
              <rect x="260" y="30" width="110" height="100" rx="4" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
              <text x="315" y="50" textAnchor="middle" fill="#f59e0b" className="font-mono text-[9px] uppercase font-bold tracking-widest">Delegation Loop</text>
              <circle cx="315" cy="90" r="14" fill="none" stroke="currentColor" strokeWidth="1" className="animate-spin-slow" />
              <text x="315" y="93" textAnchor="middle" fill="currentColor" className="font-mono text-[9px]">4 AM</text>
              
              {/* Output status indicator */}
              <text x="200" y="150" textAnchor="middle" fill="#f59e0b" className="font-mono text-[9px] lowercase font-semibold animate-pulse">befuddling speed of delegation...</text>
            </g>
          </svg>
        );
      case 2:
        return (
          <svg viewBox="0 0 400 180" className="w-full h-full max-h-[160px] text-zinc-400 select-none">
            <rect width="100%" height="100%" fill="none" />
            <g transform="translate(20, 20)">
              <text x="180" y="10" textAnchor="middle" fill="currentColor" className="font-mono text-[9px] uppercase tracking-wider font-semibold">Glucose-Token Context Weight (A/B/C)</text>
              
              {/* Bar 1: Structural Guidelines (A) */}
              <rect x="50" y="30" width="40" height="90" fill="none" stroke="currentColor" strokeWidth="1" />
              <rect x="52" y="55" width="36" height="63" fill="#f59e0b" fillOpacity="0.8" />
              <text x="70" y="140" textAnchor="middle" fill="currentColor" className="font-mono text-[9px]">A: Rules (70%)</text>

              {/* Bar 2: System Feedback (B) */}
              <rect x="160" y="30" width="40" height="90" fill="none" stroke="currentColor" strokeWidth="1" />
              <rect x="162" y="75" width="36" height="43" fill="#f59e0b" fillOpacity="0.4" />
              <text x="180" y="140" textAnchor="middle" fill="currentColor" className="font-mono text-[9px]">B: Logs (48%)</text>

              {/* Bar 3: Chat History (C) */}
              <rect x="270" y="30" width="40" height="90" fill="none" stroke="currentColor" strokeWidth="1" />
              <rect x="272" y="38" width="36" height="80" fill="#f59e0b" fillOpacity="0.9" />
              <text x="290" y="140" textAnchor="middle" fill="currentColor" className="font-mono text-[9px]">C: History (89%)</text>
            </g>
          </svg>
        );
      case 3:
        return (
          <svg viewBox="0 0 400 180" className="w-full h-full max-h-[160px] text-zinc-400 select-none">
            <rect width="100%" height="100%" fill="none" />
            <g transform="translate(30, 10)">
              {/* Core database node */}
              <circle cx="170" cy="80" r="24" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
              <text x="170" y="83" textAnchor="middle" fill="#f59e0b" className="font-mono text-[9px] uppercase font-bold">2018 Node</text>

              {/* Linked context paths */}
              <path d="M 70 40 L 148 70" stroke="currentColor" strokeWidth="1" />
              <circle cx="70" cy="40" r="14" fill="none" stroke="currentColor" strokeWidth="1" />
              <text x="70" y="43" textAnchor="middle" fill="currentColor" className="font-mono text-[7px]">Log_Files</text>

              <path d="M 70 120 L 148 90" stroke="currentColor" strokeWidth="1" />
              <circle cx="70" cy="120" r="14" fill="none" stroke="currentColor" strokeWidth="1" />
              <text x="70" y="123" textAnchor="middle" fill="currentColor" className="font-mono text-[7px]">Doc_Wiki</text>

              <path d="M 270 80 L 194 80" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
              <rect x="270" y="65" width="80" height="30" rx="3" fill="none" stroke="currentColor" strokeWidth="1" />
              <text x="310" y="83" textAnchor="middle" fill="currentColor" className="font-mono text-[8px] uppercase font-bold">Query Agent</text>
            </g>
          </svg>
        );
      case 4:
        return (
          <svg viewBox="0 0 400 180" className="w-full h-full max-h-[160px] text-zinc-400 select-none">
            <rect width="100%" height="100%" fill="none" />
            <g transform="translate(20, 20)">
              <text x="180" y="10" textAnchor="middle" fill="currentColor" className="font-mono text-[9px] uppercase tracking-wider font-semibold">Tinkering: Documentation vs Agent Overhead</text>
              {/* Curve chart */}
              <path d="M 50 120 Q 150 40 310 30" fill="none" stroke="currentColor" strokeWidth="1.2" />
              {/* Labels */}
              <text x="60" y="140" fill="currentColor" className="font-mono text-[8px]">Week 0 (High Debt)</text>
              <text x="300" y="140" fill="currentColor" className="font-mono text-[8px]">Week 4 (Tinkered)</text>

              <circle cx="150" cy="65" r="4" fill="#f59e0b" />
              <text x="160" y="65" fill="#f59e0b" className="font-mono text-[8px] font-bold">Debt clearing point</text>
            </g>
          </svg>
        );
      case 5:
        return (
          <svg viewBox="0 0 400 180" className="w-full h-full max-h-[160px] text-zinc-400 select-none">
            <rect width="100%" height="100%" fill="none" />
            <g transform="translate(20, 10)">
              {/* Route line */}
              <line x1="40" y1="80" x2="320" y2="80" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
              
              {/* Gate 1 */}
              <circle cx="80" cy="80" r="16" fill="black" stroke="currentColor" strokeWidth="1" />
              <text x="80" y="83" textAnchor="middle" fill="currentColor" className="font-mono text-[8px]">DNS</text>

              {/* Gate 2 */}
              <circle cx="180" cy="80" r="16" fill="black" stroke="currentColor" strokeWidth="1" />
              <text x="180" y="83" textAnchor="middle" fill="currentColor" className="font-mono text-[8px]">NAT</text>

              {/* Gate 3: Port 3007 (Active highlighted) */}
              <circle cx="280" cy="80" r="20" fill="black" stroke="#10b981" strokeWidth="1.5" className="animate-pulse" />
              <text x="280" y="83" textAnchor="middle" fill="#10b981" className="font-mono text-[8px] font-bold">Port 3007</text>
              <text x="280" y="115" textAnchor="middle" fill="#10b981" className="font-mono text-[7px] uppercase font-semibold">Wide Open</text>
            </g>
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 400 180" className="w-full h-full max-h-[160px] text-zinc-400 select-none">
            <rect width="100%" height="100%" fill="none" />
            <g transform="translate(20, 20)">
              <circle cx="180" cy="70" r="30" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 4" className="animate-spin-slow" />
              <Sparkles className="w-8 h-8 text-amber-500 absolute top-[55px] left-[165px] animate-pulse" />
              <text x="180" y="130" textAnchor="middle" fill="currentColor" className="font-mono text-[9px] uppercase tracking-wider">Dynamic Schema Formulated</text>
            </g>
          </svg>
        );
    }
  };  return (
    <div className={`transition-all duration-300 ${isReaderMode ? "bg-[#FCFAF7] border border-black/10 dark:bg-[#1E1D1C] dark:border-white/10 p-6 sm:p-10 rounded max-w-3xl mx-auto shadow-sm" : "space-y-6"}`}>
      {/* Control bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 pb-3.5 dark:border-white/10">
        <button
          onClick={onBack}
          className="text-xs font-mono text-zinc-550 hover:text-black dark:text-zinc-400 dark:hover:text-[#F5F2EF] flex items-center gap-1 transition-colors cursor-pointer py-2 min-h-[44px]"
        >
          <ChevronLeft className="w-4 h-4" /> Back to list
        </button>

        <div className="flex items-center space-x-3.5">
          {/* Font Type Toggle */}
          <button
            onClick={() => setIsSerif(!isSerif)}
            className={`p-1.5 min-h-[44px] border hover:bg-black/5 rounded text-xs px-2.5 font-mono flex items-center gap-1 dark:border-white/10 dark:hover:bg-white/5 cursor-pointer ${
              isSerif ? "bg-amber-100/40 border-amber-300/60 text-amber-950 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900" : "bg-[#FCFAF7] text-zinc-650 dark:bg-[#1E1D1C]"
            }`}
            title="Toggle Serif/Sans font style"
          >
            <Type className="w-3.5 h-3.5" />
            <span>{isSerif ? "Serif" : "Sans"}</span>
          </button>

          {/* Font Size selectors */}
          <div className="flex items-center space-x-1 border border-black/10 dark:border-white/10 bg-[#FCFAF7] dark:bg-[#1E1D1C] p-1 rounded">
            {(["sm", "base", "lg", "xl"] as const).map((sz) => (
              <button
                key={sz}
                onClick={() => setFontSize(sz)}
                className={`px-2 py-0.5 min-h-[44px] rounded text-[10px] font-mono cursor-pointer flex items-center ${
                  fontSize === sz
                    ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-950"
                    : "text-zinc-500 hover:bg-black/5 dark:hover:bg-white/5"
                }`}
              >
                {sz.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Toggle Full Reader Focus Mode */}
          <button
            onClick={() => setIsReaderMode(!isReaderMode)}
            className={`p-1.5 min-h-[44px] flex items-center justify-center border hover:bg-black/5 rounded text-xs dark:border-white/10 dark:hover:bg-white/5 cursor-pointer ${
              isReaderMode ? "bg-zinc-900 text-white border-zinc-800" : "bg-[#FCFAF7] text-zinc-650 dark:bg-[#1E1D1C]"
            }`}
            title="Toggle Reader focus display"
          >
            <BookOpen className="w-3.5 h-3.5" />
          </button>

          {/* Copy to Clipboard */}
          <button
            onClick={handleCopyToClipboard}
            className={`p-1.5 min-h-[44px] border rounded text-xs px-2.5 font-mono flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
              copied
                ? "bg-emerald-100/50 border-emerald-300 text-emerald-800 dark:bg-emerald-950/30 dark:border-emerald-900 dark:text-emerald-400 font-bold"
                : "bg-[#FCFAF7] border-black/10 text-zinc-650 hover:bg-black/5 dark:bg-[#1E1D1C] dark:border-white/10 dark:hover:bg-white/5"
            }`}
            title="Copy essay contents with rich HTML formatting to clipboard"
            id="copy-to-clipboard-btn"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="hidden sm:inline">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Copy Layout</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Content Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Essay Text Display */}
        <div ref={articleRef} className={`lg:col-span-2 space-y-5 relative ${isReaderMode ? "lg:col-span-3 max-w-2xl mx-auto" : ""}`}>
          
          {/* Subtle Dynamic Scroll Progress Bar */}
          <div 
            className={`sticky top-[135px] md:top-[120px] z-40 py-2.5 px-3 border border-black/10 dark:border-white/10 rounded-md shadow-xs backdrop-blur-md transition-all duration-300 ${
              isReaderMode 
                ? "bg-[#FCFAF7]/95 dark:bg-[#1E1D1C]/95" 
                : "bg-[#F9F7F4]/95 dark:bg-[#121110]/95"
            }`} 
            id="essay-scroll-progress-overlay"
          >
            <div className="flex justify-between items-center text-[9px] font-mono tracking-widest text-zinc-500 uppercase mb-2 select-none">
              <span className="flex items-center gap-1.5 font-bold">
                <span className={`w-1.5 h-1.5 rounded-full animate-pulse transition-colors duration-500 ${
                  scrollProgress >= 90 
                    ? "bg-emerald-500" 
                    : scrollProgress >= 50 
                      ? "bg-yellow-500" 
                      : "bg-amber-600 dark:bg-amber-500"
                }`} />
                <span>Reading Progress : {essay.title}</span>
              </span>
              <span className={`font-bold transition-all duration-500 px-2 py-0.5 rounded font-sans text-[10px] ${
                scrollProgress >= 90
                  ? "text-emerald-600 dark:text-emerald-400 bg-emerald-100/40 dark:bg-emerald-950/30"
                  : scrollProgress >= 50
                    ? "text-yellow-605 dark:text-yellow-400 bg-yellow-100/40 dark:bg-yellow-950/30"
                    : "text-amber-605 dark:text-amber-400 bg-amber-100/40 dark:bg-amber-950/30"
              }`}>
                {Math.round(scrollProgress)}%
              </span>
            </div>
            <div className="w-full bg-black/5 dark:bg-white/5 h-1.5 rounded-full overflow-hidden" id="essay-progress-track">
              <div 
                className="h-full rounded-full transition-all duration-100 ease-out"
                style={{ 
                  width: `${scrollProgress}%`,
                  backgroundImage: "linear-gradient(to right, #d97706, #10b981)",
                  backgroundSize: `${scrollProgress > 0 ? (10000 / scrollProgress) : 100}% 100%`,
                  backgroundPosition: "left center"
                }}
                id="essay-progress-fill"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase text-zinc-450 dark:text-zinc-500">
              <span className="font-semibold text-amber-650 dark:text-amber-400">PART {essay.part}</span>
              <span>// STATUS WORD: <span className="underline font-bold text-zinc-700 dark:text-zinc-300">{essay.statusWord}</span></span>
            </div>
            
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-zinc-900 dark:text-zinc-100 uppercase tracking-tight leading-tight">
              {essay.title}
            </h2>

            <div className="flex items-center gap-3 text-xs text-zinc-450 dark:text-zinc-500 font-mono italic">
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Published {essay.publishDate}</span>
              <span>•</span>
              <span>10 min read</span>
            </div>
          </div>

          <p className="font-serif italic text-sm text-zinc-500 border-l-2 border-zinc-200 pl-3 leading-relaxed dark:border-zinc-800">
            "{essay.snippet}"
          </p>

          <article className={`p-0 text-zinc-800 dark:text-zinc-200 block ${isSerif ? "font-serif" : "font-sans"} ${fontSizes[fontSize]}`}>
            {renderParagraphs(essay.content)}
          </article>

          {/* Related Essays section matching Editorial Aesthetic */}
          {relatedEssays.length > 0 && (
            <div className="border-t border-black/10 dark:border-white/10 mt-12 pt-6">
              <span className="text-[10px] tracking-[0.2em] font-mono font-bold uppercase text-zinc-500 block mb-4">
                Related Essays
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedEssays.map((related) => (
                  <button
                    key={related.id}
                    onClick={() => onSelectEssay?.(related)}
                    className="group border border-black/10 hover:border-black/25 dark:border-white/10 dark:hover:border-white/25 bg-[#FCFAF7] dark:bg-[#1E1D1C] hover:bg-[#F4F1EC] dark:hover:bg-[#252423] p-4 rounded text-left flex flex-col justify-between transition-all duration-300 pointer-events-auto cursor-pointer"
                  >
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono tracking-wider font-bold text-amber-700 dark:text-amber-400 uppercase block">
                        PART {String(related.part).padStart(2, "0")}
                      </span>
                      <h4 className="font-serif font-bold text-xs text-black dark:text-[#F5F2EF] group-hover:text-amber-800 dark:group-hover:text-amber-400 line-clamp-2 transition-colors duration-300">
                        {related.title}
                      </h4>
                    </div>
                    <p className="text-[10px] font-serif italic text-zinc-500 dark:text-zinc-400 line-clamp-2 mt-2 leading-relaxed">
                      {related.snippet}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Marginalia & Accompanying Snapshot visualizer */}
        {!isReaderMode && (
          <div className="lg:col-span-1 space-y-6">
            {/* Visualizer Panel */}
            <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-4 dark:bg-zinc-950 dark:border-zinc-850 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-zinc-200/50 pb-2.5 mb-3.5 dark:border-zinc-850">
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-zinc-500 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-zinc-400" /> Integrated Schematic
                </span>
                <span className="text-[9px] font-mono text-zinc-400 border border-zinc-200 px-1.5 py-0.5 rounded dark:border-zinc-800">
                  FIG. {essay.part}.A
                </span>
              </div>

              {/* Dynamic rendering */}
              <div className="bg-white border border-zinc-200/30 rounded flex items-center justify-center p-3 h-[180px] dark:bg-black/40 dark:border-zinc-900/60 transition-colors">
                {renderDynamicIllustration()}
              </div>

              {/* Captions */}
              <p className="text-[11px] font-mono text-zinc-500 leading-normal mt-3 italic">
                "{essay.screenshotsDescription || "Rendering active system context parameters..."}"
              </p>
            </div>

            {/* Quote of the chronological block */}
            <div className="border border-dotted border-zinc-200/80 p-4 rounded-lg bg-zinc-50/10 dark:border-zinc-800">
              <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest block mb-2">Chronicle Context</span>
              <p className="text-xs font-serif leading-relaxed italic text-zinc-650 dark:text-zinc-400">
                This document exists as an immutable tracing run inside the development pipeline index. It represents actual states in our autonomous delegation trials.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Auxiliary Footer Navigation to jump sequentially */}
      <div className="flex items-center justify-between border-t border-zinc-200 pt-5 mt-8 hover:cursor-pointer dark:border-zinc-850">
        <div>
          {onPrev ? (
            <button
              onClick={onPrev}
              className="px-3.5 py-2 min-h-[44px] border border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900 rounded text-xs font-mono text-zinc-600 dark:text-zinc-400 flex items-center gap-1 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> Previous Chapter
            </button>
          ) : (
            <div />
          )}
        </div>

        <div>
          {onNext ? (
            <button
              onClick={onNext}
              className="px-3.5 py-2 min-h-[44px] border border-zinc-250 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900 rounded text-xs font-mono text-zinc-600 dark:text-zinc-400 flex items-center gap-1 transition-all cursor-pointer"
            >
              Next Chapter <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}
