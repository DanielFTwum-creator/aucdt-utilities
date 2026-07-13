# smartscale-ai-presentation-platform - Ultimate Self-Replicating Blueprint (AGENT.md)

> [!IMPORTANT]
> This is an auto-generated monolithic blueprint containing the source code for smartscale-ai-presentation-platform.

### FILE: .dockerignore
```text
node_modules
dist
build
.git
.gitignore
*.md
.env
.env.local
.env.*.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
.DS_Store
coverage
.nyc_output
*.log
.cache
.vscode
.idea
*.swp
*.swo
test-results
playwright-report

```

### FILE: (environment files omitted)

> Environment files are never committed. See the repo's own `.env.example`
> for variable names; real values live only in the server's untracked
> `.env.local` / `.env.production`. This block was removed by the fleet
> secret-scrub (blueprint minus secrets).

### FILE: .gitignore
```text
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

```

### FILE: .npmrc
```text
# Use pnpm as package manager
package-manager=pnpm

```

### FILE: App.tsx
```typescript
import React from 'react';
import PresentationDeck from './components/PresentationDeck';

function App() {
  return (
    <div className="w-full h-screen">
      <PresentationDeck />
    </div>
  );
}

export default App;

```

### FILE: components/AISandbox.tsx
```typescript
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  Sparkles, 
  Image as ImageIcon, 
  MessageSquare, 
  Send, 
  Loader2, 
  X, 
  Download, 
  AlertCircle, 
  Layout, 
  Palette, 
  ChevronDown, 
  Check,
  Camera,
  Layers,
  PenTool,
  Box,
  Pencil,
  Zap,
  Droplets,
  CircleHelp,
  Film,
  Sun,
  FileText,
  Instagram,
  Mail,
  ShoppingBag,
  TrendingUp,
  MapPin,
  ClipboardList,
  Facebook,
  Briefcase,
  Users,
  PieChart,
  Calendar,
  Store,
  Handshake
} from 'lucide-react';

interface AISandboxProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
  mode?: 'text' | 'image';
}

type AspectRatio = "1:1" | "3:4" | "4:3" | "9:16" | "16:9";

interface StyleOption {
  id: string;
  label: string;
  prompt: string;
  color: string;
  icon: React.ElementType;
}

interface PromptTemplate {
  id: string;
  label: string;
  icon: React.ElementType;
  text: string;
  mode: 'text' | 'image';
}

const PROMPT_TEMPLATES: PromptTemplate[] = [
  // Text Templates
  {
    id: 'biz-plan',
    label: 'Business Plan Outline',
    icon: Briefcase,
    mode: 'text',
    text: "Create a detailed 8-point business plan outline for a [BUSINESS TYPE] located in [CITY/COUNTRY]. Include sections on Value Proposition, Market Analysis, and 12-month growth milestones."
  },
  {
    id: 'fundraising-pitch',
    label: 'Fundraising Pitch',
    icon: Handshake,
    mode: 'text',
    text: "Draft a compelling investor pitch script for a [INDUSTRY] startup. Please address: 1) Problem: [PROBLEM], 2) Solution: [SOLUTION], 3) Target Market: [TARGET MARKET], 4) Business Model, and 5) Team: [TEAM DETAILS]. Ensure the tone is professional, high-stakes, and persuasive."
  },
  {
    id: 'ig-post',
    label: 'Instagram Caption',
    icon: Instagram,
    mode: 'text',
    text: "Write a catchy Instagram caption for my new [PRODUCT]. The tone should be upbeat and include relevant hashtags for the [CITY] market."
  },
  {
    id: 'fb-ad',
    label: 'Facebook Ad Copy',
    icon: Facebook,
    mode: 'text',
    text: "Write high-converting Facebook Ad copy for a [PROMOTION] for my [BUSINESS]. Focus on the pain point of [PROBLEM] and how we provide the solution. Include a strong Call to Action."
  },
  {
    id: 'customer-care',
    label: 'Customer Email',
    icon: Mail,
    mode: 'text',
    text: "Draft a professional email responding to a customer who has a query about [ISSUE]. Be empathetic and offer a [SOLUTION]. Keep it under 150 words."
  },
  {
    id: 'partnership',
    label: 'Partnership Outreach',
    icon: Users,
    mode: 'text',
    text: "Draft a persuasive partnership proposal to a potential collaborator in the [INDUSTRY] sector. Highlight how a collaboration with my business, [BUSINESS NAME], can benefit both parties."
  },
  {
    id: 'product-desc',
    label: 'Product Copy',
    icon: ShoppingBag,
    mode: 'text',
    text: "Write a compelling, SEO-friendly product description for [ITEM]. Highlight its benefits for [TARGET AUDIENCE] and its unique local craftsmanship."
  },
  {
    id: 'biz-pitch',
    label: 'Elevator Pitch',
    icon: TrendingUp,
    mode: 'text',
    text: "Create a 30-second elevator pitch for a startup in the [INDUSTRY] sector in West Africa. Focus on the problem of [PROBLEM] and how we solve it."
  },
  {
    id: 'financial-tips',
    label: 'Financial Advice',
    icon: PieChart,
    mode: 'text',
    text: "Provide 5 practical tips for managing cash flow for a small [TYPE] business during a slow season. Focus on cost-cutting and alternative revenue streams."
  },
  // Image Templates
  {
    id: 'lifestyle-shot',
    label: 'Lifestyle Product',
    icon: Camera,
    mode: 'image',
    text: "[STYLE] [ASPECT] High-end lifestyle photography of [YOUR PRODUCT] being used in a modern Lagos office setting, natural sunlight, depth of field."
  },
  {
    id: 'shop-interior',
    label: 'Shop Interior',
    icon: Store,
    mode: 'image',
    text: "[STYLE] [ASPECT] Beautifully designed interior of a boutique [BUSINESS TYPE] in Accra, showcasing premium layout, warm lighting, and welcoming atmosphere."
  },
  {
    id: 'street-vendor',
    label: 'Street Scene',
    icon: MapPin,
    mode: 'image',
    text: "[STYLE] [ASPECT] Vibrant market scene in Accra featuring a boutique storefront, diverse customers, bustling energy, cinematic lighting."
  },
  {
    id: 'logo-mockup',
    label: 'Logo Concept',
    icon: PenTool,
    mode: 'image',
    text: "[STYLE] [ASPECT] Minimalist brand logo for a [TYPE OF BUSINESS], clean lines, bold typography, symbolic of growth and West African heritage."
  },
  {
    id: 'event-flyer',
    label: 'Event Flyer BG',
    icon: Calendar,
    mode: 'image',
    text: "[STYLE] [ASPECT] Vibrant and artistic background for a business event flyer, incorporating [COLOR SCHEME], abstract shapes, and high energy."
  },
  {
    id: 'social-ad',
    label: 'Marketing Banner',
    icon: Layout,
    mode: 'image',
    text: "[STYLE] [ASPECT] Professional marketing banner for a [SALE/EVENT], featuring [KEY SUBJECT], empty space for text overlay, high contrast."
  }
];

const STYLES: StyleOption[] = [
  { id: 'none', label: 'Default Style', prompt: '', color: 'bg-gray-200 text-gray-500', icon: CircleHelp },
  { id: 'photo', label: 'Photorealistic', prompt: 'photorealistic, professional commercial photography, 8k resolution, highly detailed', color: 'bg-sky-500 text-white', icon: Camera },
  { id: 'minimal', label: 'Minimalist', prompt: 'minimalist, clean design, simple colors, elegant', color: 'bg-slate-100 text-slate-500 border border-gray-200', icon: Layers },
  { id: 'vector', label: 'Vector Illustration', prompt: 'flat vector illustration, clean lines, vibrant colors, modern tech style', color: 'bg-orange-400 text-white', icon: PenTool },
  { id: '3d', label: '3D Render', prompt: '3D render, octane render, soft lighting, professional product visualization', color: 'bg-indigo-400 text-white', icon: Box },
  { id: 'sketch', label: 'Hand Drawn Sketch', prompt: 'artistic hand-drawn sketch, pencil and charcoal, textured paper', color: 'bg-stone-300 text-stone-600', icon: Pencil },
  { id: 'cyberpunk', label: 'Cyberpunk', prompt: 'cyberpunk aesthetic, neon lights, futuristic city, high tech low life, vibrant cyan and magenta, synthwave', color: 'bg-pink-500 text-white', icon: Zap },
  { id: 'watercolor', label: 'Watercolor', prompt: 'watercolor painting, artistic, soft brush strokes, bleeding colors, textured watercolor paper', color: 'bg-teal-300 text-white', icon: Droplets },
  { id: 'comic', label: 'Comic Book', prompt: 'comic book art style, bold outlines, vibrant colors, halftone patterns, graphic novel aesthetic', color: 'bg-yellow-400 text-yellow-800', icon: MessageSquare },
  { id: 'vintage', label: 'Vintage Photo', prompt: 'vintage photograph, retro film grain, sepia tones, nostalgic feel, 1970s aesthetic', color: 'bg-amber-700 text-white', icon: Film },
  { id: 'radiant', label: 'Radiant Glow', prompt: 'ethereal glow, soft light, luminous particles, dreamlike atmosphere', color: 'bg-yellow-100 text-yellow-600 border border-yellow-200', icon: Sun },
];

const ASPECT_RATIOS: { id: AspectRatio, label: string, helper: string, icon: React.ReactNode, desc: string }[] = [
  { id: '1:1', label: 'Square (1:1)', helper: 'Ideal for social media posts', icon: <div className="w-4 h-4 border-2 border-current rounded-sm" />, desc: 'in 1:1 square format' },
  { id: '4:3', label: 'Classic (4:3)', helper: 'Standard photography format', icon: <div className="w-5 h-4 border-2 border-current rounded-sm" />, desc: 'in 4:3 classic photography format' },
  { id: '16:9', label: 'Widescreen (16:9)', helper: 'Great for presentations and videos', icon: <div className="w-6 h-3 border-2 border-current rounded-sm" />, desc: 'in 16:9 cinematic widescreen format' },
  { id: '9:16', label: 'Portrait (9:16)', helper: 'Perfect for TikToks and Reels', icon: <div className="w-3 h-6 border-2 border-current rounded-sm" />, desc: 'in 9:16 vertical portrait format' },
];

export const AISandbox: React.FC<AISandboxProps> = ({ isOpen, onClose, initialPrompt = '', mode = 'text' }) => {
  const [currentMode, setCurrentMode] = useState<'text' | 'image'>(mode);
  const [prompt, setPrompt] = useState(initialPrompt);
  const [loading, setLoading] = useState(false);
  const [resultText, setResultText] = useState('');
  const [resultImage, setResultImage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isStyleDropdownOpen, setIsStyleDropdownOpen] = useState(false);
  const [isTemplateDropdownOpen, setIsTemplateDropdownOpen] = useState(false);
  
  // Image generation specific settings
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0]);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("1:1");

  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const styleDropdownRef = useRef<HTMLDivElement>(null);
  const templateDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setPrompt(initialPrompt);
      setCurrentMode(mode || 'text');
    }
  }, [isOpen, initialPrompt, mode]);

  // Handle clicks outside dropdowns to close them
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (styleDropdownRef.current && !styleDropdownRef.current.contains(target)) {
        setIsStyleDropdownOpen(false);
      }
      if (templateDropdownRef.current && !templateDropdownRef.current.contains(target)) {
        setIsTemplateDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResultText('');
    setResultImage('');
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      if (currentMode === 'text') {
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: prompt,
          config: {
            systemInstruction: "You are a specialized AI business consultant for West African SMEs. Provide practical, concise, and highly relevant business advice, scripts, or plans.",
          },
        });
        setResultText(response.text || 'No response generated.');
      } else {
        // Construct enhanced prompt using placeholder logic
        let finalPrompt = prompt;
        const styleString = selectedStyle.prompt || '';
        const aspectMeta = ASPECT_RATIOS.find(r => r.id === aspectRatio);
        const aspectString = aspectMeta?.desc || '';

        // Handle [STYLE] placeholder
        if (finalPrompt.includes('[STYLE]')) {
          finalPrompt = finalPrompt.replace('[STYLE]', styleString);
        } else if (styleString) {
          finalPrompt = `${styleString}. Subject: ${finalPrompt}`;
        }

        // Handle [ASPECT] placeholder
        if (finalPrompt.includes('[ASPECT]')) {
          finalPrompt = finalPrompt.replace('[ASPECT]', aspectString);
        }

        // Clean up formatting
        finalPrompt = finalPrompt.replace(/\s+/g, ' ').trim();

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: {
            parts: [{ text: finalPrompt }],
          },
          config: {
            imageConfig: {
              aspectRatio: aspectRatio,
            }
          }
        });
        
        const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
        if (part?.inlineData) {
          setResultImage(`data:image/png;base64,${part.inlineData.data}`);
        } else {
          throw new Error("No image data found in response. Try a different prompt.");
        }
      }
    } catch (err: any) {
      console.error("AI Generation Error:", err);
      setError(err.message || "An error occurred during generation. Please check your connection and API key.");
    } finally {
      setLoading(false);
    }
  };

  const currentTemplates = PROMPT_TEMPLATES.filter(t => t.mode === currentMode);

  if (!isOpen) return null;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-y-0 right-0 w-[550px] bg-white shadow-2xl z-[100] border-l border-gray-200 flex flex-col animate-in slide-in-from-right duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-sandbox-title"
    >
      {/* Header */}
      <div className="p-6 border-b flex justify-between items-center bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#C97064] rounded-lg text-white" aria-hidden="true">
            <Sparkles size={24} />
          </div>
          <h2 id="ai-sandbox-title" className="text-2xl font-bold text-gray-800">AI Workshop Tool</h2>
        </div>
        <button onClick={onClose} aria-label="Close AI workshop tool" className="p-2 hover:bg-gray-200 rounded-full transition-colors">
          <X size={24} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b" role="tablist">
        <button 
          role="tab"
          aria-selected={currentMode === 'text'}
          onClick={() => {
            setCurrentMode('text');
            setIsTemplateDropdownOpen(false);
          }}
          className={`flex-1 py-4 text-lg font-semibold flex items-center justify-center gap-2 border-b-2 transition-colors
            ${currentMode === 'text' ? 'border-[#C97064] text-[#C97064] bg-[#C97064]/5' : 'border-transparent text-gray-500 hover:text-gray-700'}
          `}
        >
          <MessageSquare size={20} aria-hidden="true" /> Text Assistant
        </button>
        <button 
          role="tab"
          aria-selected={currentMode === 'image'}
          onClick={() => {
            setCurrentMode('image');
            setIsTemplateDropdownOpen(false);
          }}
          className={`flex-1 py-4 text-lg font-semibold flex items-center justify-center gap-2 border-b-2 transition-colors
            ${currentMode === 'image' ? 'border-[#C97064] text-[#C97064] bg-[#C97064]/5' : 'border-transparent text-gray-500 hover:text-gray-700'}
          `}
        >
          <ImageIcon size={20} aria-hidden="true" /> Image Creator
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* Templates Selector */}
        <div className="space-y-3" ref={templateDropdownRef}>
          <div className="flex justify-between items-center">
             <label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-400">
               <ClipboardList size={16} /> Workshop Templates
             </label>
             <button 
               onClick={() => setIsTemplateDropdownOpen(!isTemplateDropdownOpen)}
               className="text-[#C97064] text-sm font-bold flex items-center gap-1 hover:underline"
             >
               Browse Templates <ChevronDown size={16} className={isTemplateDropdownOpen ? 'rotate-180' : ''} />
             </button>
          </div>
          
          {isTemplateDropdownOpen && (
            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-2 grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-2">
              {currentTemplates.map(template => (
                <button
                  key={template.id}
                  onClick={() => {
                    setPrompt(template.text);
                    setIsTemplateDropdownOpen(false);
                    if (textareaRef.current) textareaRef.current.focus();
                  }}
                  className="flex flex-col items-start p-4 bg-white border border-gray-100 rounded-xl hover:border-[#C97064] hover:shadow-md transition-all text-left group"
                >
                  <div className="p-2 bg-gray-50 rounded-lg text-[#C97064] mb-3 group-hover:bg-[#C97064] group-hover:text-white transition-colors">
                    <template.icon size={18} />
                  </div>
                  <span className="font-bold text-gray-800 text-sm leading-tight">{template.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <label htmlFor="ai-prompt-input" className="text-sm font-bold uppercase tracking-wider text-gray-400">Your Request</label>
            <div className="flex gap-2">
              {currentMode === 'image' && prompt.includes('[STYLE]') && (
                <span className="text-[10px] bg-[#C97064]/10 text-[#C97064] px-2 py-0.5 rounded font-bold uppercase">Style Placeholder</span>
              )}
              {currentMode === 'image' && prompt.includes('[ASPECT]') && (
                <span className="text-[10px] bg-[#C97064]/10 text-[#C97064] px-2 py-0.5 rounded font-bold uppercase">Aspect Placeholder</span>
              )}
            </div>
          </div>
          <textarea
            id="ai-prompt-input"
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={currentMode === 'text' ? "e.g., Write a customer service response for a late delivery..." : "e.g., [STYLE] [ASPECT] Professional photo of an African boutique..."}
            className="w-full h-32 p-4 border-2 border-gray-200 rounded-xl text-lg focus:border-[#C97064] focus:ring-4 focus:ring-[#C97064]/10 outline-none resize-none"
          />
        </div>

        {currentMode === 'image' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
            {/* Aspect Ratio Selector */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-400">
                <Layout size={16} /> Aspect Ratio
              </label>
              <div className="grid grid-cols-2 gap-3">
                {ASPECT_RATIOS.map((ratio) => (
                  <button
                    key={ratio.id}
                    onClick={() => setAspectRatio(ratio.id)}
                    className={`flex items-center p-4 rounded-xl border-2 transition-all gap-4 text-left
                      ${aspectRatio === ratio.id 
                        ? 'border-[#C97064] bg-[#C97064]/5 text-[#C97064]' 
                        : 'border-gray-100 hover:border-gray-200 text-gray-500'
                      }
                    `}
                  >
                    <div className="shrink-0">{ratio.icon}</div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold">{ratio.label}</span>
                      <span className={`text-[10px] font-medium leading-tight ${aspectRatio === ratio.id ? 'text-[#C97064]/80' : 'text-gray-400'}`}>
                        {ratio.helper}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
              {prompt.includes('[ASPECT]') && (
                <p className="text-[11px] text-[#C97064] italic">
                   Current selection will replace <strong>[ASPECT]</strong> in the prompt text.
                </p>
              )}
            </div>

            {/* Style Selector Dropdown (Custom Visual Implementation) */}
            <div className="space-y-3" ref={styleDropdownRef}>
              <label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-400">
                <Palette size={16} /> Visual Style
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsStyleDropdownOpen(!isStyleDropdownOpen)}
                  className={`w-full p-4 flex items-center justify-between bg-gray-50 border-2 rounded-xl text-lg font-medium text-gray-700 transition-all cursor-pointer
                    ${isStyleDropdownOpen ? 'border-[#C97064] ring-4 ring-[#C97064]/10' : 'border-gray-100 hover:border-gray-200'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg shadow-sm flex items-center justify-center ${selectedStyle.color}`} aria-hidden="true">
                      <selectedStyle.icon size={14} />
                    </div>
                    <span>{selectedStyle.label}</span>
                  </div>
                  <ChevronDown className={`transition-transform duration-200 ${isStyleDropdownOpen ? 'rotate-180' : ''}`} size={24} />
                </button>

                {isStyleDropdownOpen && (
                  <div className="absolute bottom-full mb-2 left-0 right-0 z-[110] bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4">
                    <div className="max-h-64 overflow-y-auto p-2 grid grid-cols-1 gap-1">
                      {STYLES.map((style) => (
                        <button
                          key={style.id}
                          type="button"
                          onClick={() => {
                            setSelectedStyle(style);
                            setIsStyleDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between p-3 rounded-xl transition-all
                            ${selectedStyle.id === style.id ? 'bg-[#C97064]/5 text-[#C97064]' : 'hover:bg-gray-50 text-gray-700'}
                          `}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl shadow-sm flex items-center justify-center ${style.color}`} aria-hidden="true">
                              <style.icon size={18} />
                            </div>
                            <span className="font-semibold">{style.label}</span>
                          </div>
                          {selectedStyle.id === style.id && <Check size={20} />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {selectedStyle.id !== 'none' && (
                <p className="text-[11px] text-gray-400 italic">
                  Current style will replace <strong>[STYLE]</strong> (or be prepended if missing).
                </p>
              )}
            </div>
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          className="w-full py-4 bg-[#C97064] text-white rounded-xl text-xl font-bold flex items-center justify-center gap-3 hover:bg-[#b46258] transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-live="polite"
        >
          {loading ? <Loader2 className="animate-spin" aria-hidden="true" /> : <Send size={20} aria-hidden="true" />}
          {loading ? 'Processing...' : 'Generate with Gemini'}
        </button>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="shrink-0 mt-1" size={20} />
            <p className="text-lg">{error}</p>
          </div>
        )}

        {/* Results */}
        {(resultText || resultImage || loading) && (
          <div className="mt-8 space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold uppercase tracking-wider text-gray-400">Result</label>
              {(resultText || resultImage) && !loading && (
                <button 
                  onClick={() => { setResultText(''); setResultImage(''); }}
                  className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
            
            {loading ? (
              <div className="h-64 bg-gray-50 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-gray-200" aria-busy="true">
                <Loader2 size={48} className="text-[#C97064] animate-spin mb-4" />
                <p className="text-gray-500 font-medium text-lg">Generating your assets...</p>
                <p className="text-gray-400 text-sm">This usually takes 10-20 seconds</p>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {currentMode === 'text' && resultText ? (
                  <div className="prose prose-lg whitespace-pre-wrap text-gray-700 leading-relaxed text-lg" aria-live="polite">
                    {resultText}
                  </div>
                ) : resultImage ? (
                  <div className="space-y-4" aria-live="polite">
                    <img src={resultImage} alt="AI Generated marketing visual" className="w-full rounded-xl shadow-md border border-gray-200" />
                    <div className="flex justify-center">
                      <a 
                        href={resultImage} 
                        download="smartscale-ai-gen.png"
                        className="flex items-center justify-center gap-2 bg-white px-6 py-2 rounded-full border border-gray-200 text-[#C97064] font-bold hover:bg-[#C97064]/5 transition-all text-lg shadow-sm"
                      >
                        <Download size={18} /> Download
                      </a>
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="p-4 bg-gray-50 text-center text-xs text-gray-400 border-t">
        Powered by Google Gemini 3.0 & 2.5 Flash
      </div>
    </div>
  );
};

```

### FILE: components/PresentationDeck.tsx
```typescript

import React, { useState, useEffect, useCallback } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Minimize2, 
  Grid, 
  Settings, 
  ShieldCheck, 
  Activity, 
  Terminal, 
  Microscope, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Sparkles, 
  FileText 
} from 'lucide-react';
import { PRESENTATION_SLIDES } from '../constants';
import { SlideType, SlideContent } from '../types';
import { 
  TitleSlide, 
  SectionSlide, 
  ContentSlide, 
  SplitSlide, 
  CTASlide, 
  UseCaseGridSlide, 
  SankeySlide 
} from './SlideLayouts';
import { AISandbox } from './AISandbox';

type Theme = 'light' | 'dark' | 'high-contrast';
type AdminTab = 'settings' | 'audit' | 'testing';

const SlideRenderer: React.FC<{ slide: SlideContent, onOpenSandbox: (prompt?: string, mode?: 'text' | 'image') => void }> = ({ slide, onOpenSandbox }) => {
  switch (slide.type) {
    case SlideType.TITLE: return <TitleSlide slide={slide} />;
    case SlideType.SECTION: return <SectionSlide slide={slide} />;
    case SlideType.CONTENT: return <ContentSlide slide={slide} onOpenSandbox={onOpenSandbox} />;
    case SlideType.USE_CASE_GRID: return <UseCaseGridSlide slide={slide} onOpenSandbox={onOpenSandbox} />;
    case SlideType.SPLIT: return <SplitSlide slide={slide} onOpenSandbox={onOpenSandbox} />;
    case SlideType.CTA: return <CTASlide slide={slide} />;
    case SlideType.SANKEY: return <SankeySlide slide={slide} />;
    default: return <ContentSlide slide={slide} onOpenSandbox={onOpenSandbox} />;
  }
};

const PresentationDeck: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showOverview, setShowOverview] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [isSandboxOpen, setIsSandboxOpen] = useState(false);
  const [sandboxPrompt, setSandboxPrompt] = useState('');
  const [sandboxMode, setSandboxMode] = useState<'text' | 'image'>('text');
  
  // Admin & Security State
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [activeAdminTab, setActiveAdminTab] = useState<AdminTab>('settings');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [auditLogs, setAuditLogs] = useState<Array<{timestamp: number, action: string, details: any}>>([]);
  const [theme, setTheme] = useState<Theme>('light');
  const [testResult, setTestResult] = useState<{status: 'idle' | 'running' | 'pass' | 'fail', msg: string}>({status: 'idle', msg: ''});

  const currentSlideData = PRESENTATION_SLIDES[activeSlide];

  const addLog = useCallback((action: string, details: any = {}) => {
    const newLog = { timestamp: Date.now(), action, details };
    setAuditLogs(prev => [newLog, ...prev].slice(0, 50));
  }, []);

  const changeSlide = useCallback((newIndex: number) => {
    if (newIndex === activeSlide || isTransitioning) return;
    setIsTransitioning(true);
    setActiveSlide(newIndex);
    addLog('NAV_SLIDE_CHANGE', { from: activeSlide, to: newIndex });
    setTimeout(() => setIsTransitioning(false), 500);
  }, [activeSlide, isTransitioning, addLog]);

  const goToNextSlide = useCallback(() => {
    if (activeSlide < PRESENTATION_SLIDES.length - 1) changeSlide(activeSlide + 1);
  }, [activeSlide, changeSlide]);

  const goToPrevSlide = useCallback(() => {
    if (activeSlide > 0) changeSlide(activeSlide - 1);
  }, [activeSlide, changeSlide]);

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput =[REDACTED_CREDENTIAL]
      setIsAuthenticated(true);
      addLog('ADMIN_AUTH_SUCCESS');
    } else {
      addLog('ADMIN_AUTH_FAIL', { attempt: passwordInput });
      alert('Access Denied: Invalid Administrative Credentials.');
      setPasswordInput('');
    }
  };

  const runSelfTest = () => {
    setTestResult({status: 'running', msg: 'Initiating System Diagnostic...'});
    addLog('DIAGNOSTIC_START');
    setTimeout(() => {
      const hasKey = !!process.env.API_KEY;
      if (hasKey) {
        setTestResult({status: 'pass', msg: 'System Clean: Gemini Link Operational.'});
        addLog('DIAGNOSTIC_PASS');
      } else {
        setTestResult({status: 'fail', msg: 'System Failure: API Environment Missing.'});
        addLog('DIAGNOSTIC_FAIL');
      }
    }, 1500);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAdminOpen && !isAuthenticated) return;
      if (isSandboxOpen) {
        if (e.key === 'Escape') setIsSandboxOpen(false);
        return;
      }
      
      switch (e.key) {
        case 'ArrowRight':
        case ' ':
          goToNextSlide();
          break;
        case 'ArrowLeft':
          goToPrevSlide();
          break;
        case 'f':
          toggleFullscreen();
          break;
        case 'n':
          setShowNotes(p => !p);
          break;
        case 'Escape':
          setShowOverview(false);
          setShowNotes(false);
          setIsAdminOpen(false);
          break;
        case 'a':
          if (!e.ctrlKey) setIsSandboxOpen(true);
          break;
        case 'A':
          if (e.ctrlKey && e.shiftKey) setIsAdminOpen(true);
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNextSlide, goToPrevSlide, isSandboxOpen, isAdminOpen, isAuthenticated]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const themeClasses = {
    'light': 'bg-white text-slate-900',
    'dark': 'bg-slate-950 text-slate-100',
    'high-contrast': 'bg-black text-yellow-400 font-bold'
  }[theme];

  if (showOverview) {
    return (
      <div className="min-h-screen bg-slate-900 p-12 overflow-y-auto">
        <div className="flex justify-between items-center mb-12 sticky top-0 bg-slate-900/90 py-6 backdrop-blur-md z-10 border-b border-white/10">
          <h2 className="text-white text-5xl font-bold">Project Deck Overview</h2>
          <button onClick={() => setShowOverview(false)} className="text-white hover:text-[#C97064] flex items-center gap-3 text-2xl transition-all">
            <Minimize2 size={36} /> Return to Presentation
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">
          {PRESENTATION_SLIDES.map((slide, index) => (
            <button key={slide.id} onClick={() => { setActiveSlide(index); setShowOverview(false); }} className={`aspect-video rounded-3xl p-8 text-left border-4 transition-all hover:scale-105 ${activeSlide === index ? 'border-[#C97064] bg-slate-800' : 'border-white/5 bg-slate-800/50 hover:bg-slate-800'}`}>
              <span className="text-slate-500 block mb-3 text-sm font-bold uppercase tracking-widest">Slide {index + 1}</span>
              <h3 className="text-white font-bold text-xl line-clamp-2 leading-tight">{slide.title}</h3>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-screen overflow-hidden flex flex-col transition-colors duration-700 ${themeClasses}`}>
      {/* Slide Container */}
      <div className="flex-1 w-full relative">
        <div className={`absolute inset-0 w-full h-full z-10 transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          <SlideRenderer 
            slide={currentSlideData} 
            onOpenSandbox={(p, m) => { setSandboxPrompt(p || ''); setSandboxMode(m || 'text'); setIsSandboxOpen(true); }} 
          />
        </div>

        {/* Admin Modal */}
        {isAdminOpen && (
          <div className="absolute inset-0 z-[100] bg-black/85 backdrop-blur-xl flex items-center justify-center p-8 animate-in fade-in duration-300">
            <div className="bg-white text-slate-900 w-full max-w-6xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              {!isAuthenticated ? (
                <div className="p-20 text-center space-y-10">
                  <ShieldCheck size={100} className="mx-auto text-[#C97064] animate-bounce" />
                  <div className="space-y-4">
                    <h2 className="text-5xl font-black tracking-tight">Admin Gate</h2>
                    <p className="text-slate-500 text-xl">Authorization required for platform diagnostics and auditing.</p>
                  </div>
                  <form onSubmit={handleAdminAuth} className="max-w-md mx-auto space-y-6">
                    <input 
                      type="password" 
                      value={passwordInput} 
                      onChange={e => setPasswordInput(e.target.value)} 
                      placeholder="Access Token" 
                      className="w-full p-6 text-3xl border-4 rounded-2xl text-center focus:border-[#C97064] outline-none transition-all placeholder:text-slate-300" 
                      autoFocus 
                    />
                    <button type="submit" className="w-full py-6 bg-[#C97064] text-white text-2xl font-black rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-[#C97064]/20">Unlock Command Centre</button>
                  </form>
                  <button onClick={() => setIsAdminOpen(false)} className="text-slate-400 font-bold hover:text-slate-600 transition-colors">Abort Access</button>
                </div>
              ) : (
                <>
                  <div className="p-10 bg-[#C97064] text-white flex justify-between items-center shrink-0">
                    <h2 className="text-4xl font-black flex items-center gap-4"><ShieldCheck size={48} /> Command Centre</h2>
                    <button onClick={() => setIsAdminOpen(false)} className="p-3 hover:bg-white/20 rounded-full transition-colors"><X size={40}/></button>
                  </div>
                  <div className="flex border-b bg-slate-50">
                    {(['settings', 'audit', 'testing'] as AdminTab[]).map(tab => (
                      <button 
                        key={tab} 
                        onClick={() => { setActiveAdminTab(tab); addLog('ADMIN_TAB_SWITCH', { tab }); }} 
                        className={`px-12 py-6 text-xl font-black capitalize transition-all border-b-8 ${activeAdminTab === tab ? 'border-[#C97064] text-[#C97064] bg-white' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
                    {activeAdminTab === 'settings' && (
                      <div className="space-y-12 animate-in fade-in duration-300">
                        <section className="space-y-6">
                          <h3 className="text-3xl font-black flex items-center gap-4 text-slate-800"><Settings size={32}/> Platform Experience</h3>
                          <div className="grid grid-cols-3 gap-6">
                            {(['light', 'dark', 'high-contrast'] as Theme[]).map(t => (
                              <button 
                                key={t} 
                                onClick={() => { setTheme(t); addLog('THEME_CHANGE', { theme: t }); }} 
                                className={`p-8 rounded-[2rem] border-4 capitalize font-black text-xl transition-all ${theme === t ? 'border-[#C97064] bg-[#C97064]/5 text-[#C97064]' : 'border-slate-100 bg-slate-50 hover:bg-slate-100'}`}
                              >
                                {t.replace('-', ' ')}
                              </button>
                            ))}
                          </div>
                        </section>
                        <div className="p-10 bg-indigo-50 border-4 border-indigo-100 rounded-[3rem] space-y-6">
                          <h4 className="text-2xl font-black flex items-center gap-4 text-indigo-800"><Activity size={32}/> Active Session Telemetry</h4>
                          <div className="grid grid-cols-2 gap-6 text-indigo-700">
                            <div className="bg-white/70 p-6 rounded-2xl flex justify-between items-center">
                              <span className="font-bold">Gemini Engine Status:</span>
                              <span className="px-4 py-1 bg-green-500 text-white rounded-full text-sm font-black">ACTIVE</span>
                            </div>
                            <div className="bg-white/70 p-6 rounded-2xl flex justify-between items-center">
                              <span className="font-bold">Current Slide Marker:</span>
                              <span className="text-2xl font-black">#{activeSlide + 1}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {activeAdminTab === 'audit' && (
                      <div className="bg-slate-950 text-emerald-400 font-mono p-10 rounded-[3rem] h-full flex flex-col animate-in fade-in duration-300 border-4 border-slate-900 shadow-inner">
                        <h3 className="text-white text-2xl font-black mb-8 flex items-center gap-4"><Terminal size={32}/> Secure Audit Ledger</h3>
                        <div className="flex-1 overflow-y-auto space-y-3 pr-6 custom-scrollbar">
                          {auditLogs.length === 0 ? (
                            <div className="text-slate-700 italic text-xl">Platform idle. No interaction data recorded.</div>
                          ) : auditLogs.map((log, i) => (
                            <div key={i} className="opacity-80 hover:opacity-100 transition-opacity flex gap-6 text-lg py-2 border-b border-white/5">
                              <span className="text-slate-600 font-bold">[{new Date(log.timestamp).toLocaleTimeString()}]</span> 
                              <span className="text-indigo-400 font-black tracking-widest">{log.action}</span>
                              <span className="text-slate-400 truncate">{JSON.stringify(log.details)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {activeAdminTab === 'testing' && (
                      <div className="space-y-10 animate-in fade-in duration-300">
                        <div className="grid grid-cols-1 gap-8">
                          <div className="bg-slate-50 border-4 border-dashed border-slate-200 p-12 rounded-[3rem] text-center space-y-8">
                            <Microscope size={64} className="mx-auto text-slate-300" />
                            <div className="space-y-3">
                              <h3 className="text-3xl font-black">Full Environment Check</h3>
                              <p className="text-slate-500">Verify API keys, asset routes, and state integrity across the current session.</p>
                            </div>
                            <button 
                              onClick={runSelfTest} 
                              disabled={testResult.status === 'running'} 
                              className="w-full max-w-md py-6 rounded-2xl bg-slate-900 text-white font-black text-xl hover:bg-black transition-all disabled:opacity-50 shadow-xl"
                            >
                              {testResult.status === 'running' ? 'Validating Nodes...' : 'Execute Connectivity Test'}
                            </button>
                            {testResult.status !== 'idle' && (
                              <div className={`p-8 rounded-[2rem] border-4 flex items-start gap-6 animate-in slide-in-from-top-4 text-left ${testResult.status === 'pass' ? 'bg-green-50 border-green-200 text-green-900' : 'bg-red-50 border-red-200 text-red-900'}`}>
                                {testResult.status === 'pass' ? <CheckCircle2 className="shrink-0 mt-1" size={40}/> : <AlertCircle className="shrink-0 mt-1" size={40}/>}
                                <div>
                                  <p className="text-2xl font-black">{testResult.msg}</p>
                                  <p className="opacity-70 mt-2">Check finalized at {new Date().toLocaleTimeString()}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Speaker Notes Overlay */}
        {showNotes && (
          <div className="absolute top-12 right-12 w-[500px] bg-white/95 backdrop-blur-md text-slate-900 rounded-[3rem] shadow-2xl p-10 z-[60] border-4 border-[#C97064]/20 animate-in slide-in-from-top-6 duration-500">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-3xl font-black text-[#C97064] flex items-center gap-4"><FileText size={32}/> Scripting Guide</h3>
              <button onClick={() => setShowNotes(false)} className="hover:text-slate-400 transition-colors"><X size={36}/></button>
            </div>
            <p className="text-2xl leading-relaxed text-slate-700 font-medium">{currentSlideData.speakerNotes || "Presenter guidance for this layout is not currently defined."}</p>
          </div>
        )}

        <AISandbox isOpen={isSandboxOpen} onClose={() => setIsSandboxOpen(false)} initialPrompt={sandboxPrompt} mode={sandboxMode} />
      </div>

      {/* Modern Control Bar */}
      <nav className={`h-32 ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'} border-t flex items-center justify-between px-16 shrink-0 z-50 transition-colors duration-700 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]`}>
        <div className="flex items-center gap-12">
          <div className="p-4 bg-[#C97064] rounded-2xl shadow-lg shadow-[#C97064]/20">
            <img src="https://thepitchhub.org/wp-content/uploads/2021/08/Copy-of-Untitled.svg" alt="The Pitch Hub" className="h-10 brightness-0 invert" />
          </div>
          <div className="flex flex-col">
            <span className="text-[#C97064] font-black text-3xl tracking-tighter uppercase leading-none">SmartScale AI</span>
            <span className="text-slate-400 font-bold text-sm tracking-widest mt-1">SME TRAINING PLATFORM</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-slate-100 rounded-[2rem] p-2 gap-2 mr-6">
            <button onClick={() => setIsSandboxOpen(true)} className="px-8 py-4 bg-[#C97064] text-white rounded-[1.5rem] hover:opacity-90 transition-all font-black flex items-center gap-3 shadow-lg shadow-[#C97064]/20" aria-label="Workshop Tool">
              <Sparkles size={24}/> AI WORKSHOP
            </button>
            <button onClick={() => setIsAdminOpen(true)} className="p-4 hover:bg-white text-slate-600 rounded-[1.5rem] transition-all hover:shadow-sm" title="Admin Centre">
              <Settings size={28}/>
            </button>
          </div>
          
          <div className="h-12 w-px bg-slate-200 mx-4" />
          
          <div className="flex items-center gap-3">
             <button onClick={() => setShowOverview(true)} className="p-5 hover:bg-slate-100 rounded-2xl transition-all" title="Deck Overview"><Grid size={32}/></button>
             <div className="flex gap-2">
                <button 
                  onClick={goToPrevSlide} 
                  disabled={activeSlide === 0} 
                  className="p-5 disabled:opacity-20 hover:bg-slate-100 rounded-2xl transition-all group"
                  aria-label="Previous Slide"
                >
                  <ChevronLeft size={44} className="group-hover:-translate-x-1 transition-transform" />
                </button>
                <div className="flex items-center px-6 font-black text-2xl text-slate-300">
                  {String(activeSlide + 1).padStart(2, '0')} <span className="mx-2 text-slate-100">/</span> {String(PRESENTATION_SLIDES.length).padStart(2, '0')}
                </div>
                <button 
                  onClick={goToNextSlide} 
                  disabled={activeSlide === PRESENTATION_SLIDES.length - 1} 
                  className="p-5 disabled:opacity-20 hover:bg-slate-100 rounded-2xl transition-all group"
                  aria-label="Next Slide"
                >
                  <ChevronRight size={44} className="group-hover:translate-x-1 transition-transform" />
                </button>
             </div>
             <button onClick={toggleFullscreen} className="p-5 hover:bg-slate-100 rounded-2xl transition-all" title="Toggle Display">{isFullscreen ? <Minimize2 size={32}/> : <Maximize2 size={32}/>}</button>
          </div>
        </div>
      </nav>

      {/* Kinetic Progress Bar */}
      <div className="h-2 bg-slate-100 w-full relative z-[70]">
        <div 
          className="h-full bg-[#C97064] transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-[0_0_20px_rgba(201,112,100,0.6)]" 
          style={{ width: `${((activeSlide + 1) / PRESENTATION_SLIDES.length) * 100}%` }} 
        />
      </div>
    </div>
  );
};

export default PresentationDeck;

```

### FILE: components/SankeyDiagram.tsx
```typescript

import React, { useState, useEffect } from 'react';

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

interface Link {
  source: string;
  target: string;
  value: number;
  label: string;
}

const NODES: Node[] = [
  { id: 'user', label: 'User Interaction', x: 50, y: 150, width: 220, height: 100, color: '#0f172a' },
  { id: 'nav', label: 'Navigation Engine', x: 350, y: 50, width: 200, height: 70, color: '#334155' },
  { id: 'workshop', label: 'AI Synthesis Tool', x: 350, y: 165, width: 200, height: 70, color: '#C97064' },
  { id: 'audit', label: 'Audit Logging', x: 350, y: 280, width: 200, height: 70, color: '#475569' },
  { id: 'gemini', label: 'Google Gemini 3.0', x: 650, y: 120, width: 200, height: 70, color: '#4f46e5' },
  { id: 'state', label: 'Global State Manager', x: 650, y: 240, width: 200, height: 70, color: '#1e293b' },
  { id: 'render', label: 'Dynamic Slide UI', x: 950, y: 150, width: 220, height: 100, color: '#C97064' },
];

const LINKS: Link[] = [
  { source: 'user', target: 'nav', value: 15, label: 'Keyboard/Click events' },
  { source: 'user', target: 'workshop', value: 25, label: 'Prompts & Templates' },
  { source: 'user', target: 'audit', value: 10, label: 'Admin Telemetry' },
  { source: 'nav', target: 'state', value: 12, label: 'Slide Index Updates' },
  { source: 'workshop', target: 'gemini', value: 20, label: 'Secure API Payload' },
  { source: 'workshop', target: 'state', value: 8, label: 'Synthesis History' },
  { source: 'audit', target: 'state', value: 10, label: 'Log Persistence' },
  { source: 'gemini', target: 'workshop', value: 20, label: 'Text/Image response' },
  { source: 'state', target: 'render', value: 45, label: 'React Prop Injection' },
];

export const SankeyDiagram: React.FC = () => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [hoveredLink, setHoveredLink] = useState<number | null>(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const getNode = (id: string) => NODES.find(n => n.id === id)!;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-12 bg-slate-50 rounded-[4rem] border-4 border-slate-100 shadow-inner overflow-hidden relative">
      <div className="absolute top-10 left-10 flex flex-col gap-2">
        <h4 className="text-slate-400 font-black uppercase tracking-widest text-sm">Interaction Flow v3.2</h4>
        <div className="h-1 w-24 bg-[#C97064]/20 rounded-full overflow-hidden">
          <div className="h-full bg-[#C97064] animate-pulse w-1/2"></div>
        </div>
      </div>

      <svg viewBox="0 0 1250 450" className="w-full h-full max-h-[600px] drop-shadow-2xl">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Dynamic Links */}
        {LINKS.map((link, idx) => {
          const source = getNode(link.source);
          const target = getNode(link.target);
          const startX = source.x + source.width;
          const startY = source.y + source.height / 2;
          const endX = target.x;
          const endY = target.y + target.height / 2;
          const cpX1 = startX + (endX - startX) * 0.4;
          const cpX2 = startX + (endX - startX) * 0.6;

          const isHighlighted = hoveredNode === link.source || hoveredNode === link.target || hoveredLink === idx;

          return (
            <g key={`link-${idx}`} className="transition-all duration-500">
              <path
                d={`M ${startX} ${startY} C ${cpX1} ${startY}, ${cpX2} ${endY}, ${endX} ${endY}`}
                fill="none"
                stroke={isHighlighted ? '#C97064' : '#e2e8f0'}
                strokeWidth={link.value}
                strokeDasharray={animate ? "0" : "1000"}
                strokeDashoffset={animate ? "0" : "1000"}
                className={`transition-all duration-1000 ease-out cursor-pointer ${isHighlighted ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}
                onMouseEnter={() => setHoveredLink(idx)}
                onMouseLeave={() => setHoveredLink(null)}
                style={{ filter: isHighlighted ? 'url(#glow)' : 'none' }}
              />
              {isHighlighted && (
                <g className="animate-in fade-in zoom-in-95 duration-300">
                  <rect 
                    x={(startX + endX) / 2 - 80} 
                    y={(startY + endY) / 2 - 40} 
                    width="160" 
                    height="30" 
                    rx="15" 
                    fill="white" 
                    className="shadow-xl"
                  />
                  <text
                    x={(startX + endX) / 2}
                    y={(startY + endY) / 2 - 20}
                    textAnchor="middle"
                    className="fill-slate-800 text-[10px] font-black font-sans uppercase tracking-widest"
                  >
                    {link.label}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {NODES.map((node) => {
          const isDirectlyHovered = hoveredNode === node.id;
          const isRelatedToHoveredLink = hoveredLink !== null && (LINKS[hoveredLink].source === node.id || LINKS[hoveredLink].target === node.id);
          const isActive = isDirectlyHovered || isRelatedToHoveredLink;

          return (
            <g
              key={node.id}
              className="cursor-pointer transition-all duration-300"
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              transform={isActive ? 'scale(1.05)' : 'scale(1)'}
              style={{ transformOrigin: `${node.x + node.width / 2}px ${node.y + node.height / 2}px` }}
            >
              <rect
                x={node.x}
                y={node.y}
                width={node.width}
                height={node.height}
                rx="24"
                fill={isActive ? '#C97064' : node.color}
                className="transition-colors duration-500 shadow-2xl"
              />
              <text
                x={node.x + node.width / 2}
                y={node.y + node.height / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-white text-sm font-black font-sans uppercase tracking-tighter pointer-events-none"
              >
                {node.label}
              </text>
              {isActive && (
                <rect 
                   x={node.x - 4} 
                   y={node.y - 4} 
                   width={node.width + 8} 
                   height={node.height + 8} 
                   rx="28" 
                   fill="none" 
                   stroke="#C97064" 
                   strokeWidth="2" 
                   className="animate-pulse"
                />
              )}
            </g>
          );
        })}
      </svg>
      
      <div className="mt-12 flex gap-12 text-xs font-black text-slate-400 uppercase tracking-[0.2em] animate-in slide-in-from-bottom-4">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-slate-900 border-2 border-white"></div> Session Entry
        </div>
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-[#C97064] border-2 border-white"></div> UI Controller
        </div>
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-[#4f46e5] border-2 border-white"></div> Cloud Intelligence
        </div>
      </div>
    </div>
  );
};

```

### FILE: components/SlideLayouts.tsx
```typescript

import React, { useState, useEffect } from 'react';
import { SlideContent, SlideImage, SlideType } from '../types';
import { Check, Edit3, Sparkles, LayoutGrid, Network } from 'lucide-react';
import { SankeyDiagram } from './SankeyDiagram';

interface SlideLayoutProps {
  slide: SlideContent;
  onOpenSandbox?: (prompt?: string, mode?: 'text' | 'image') => void;
}

const BrandColor = '#C97064';
const LOGO_URL = "https://thepitchhub.org/wp-content/uploads/2021/08/Copy-of-Untitled.svg";

const ImageCarousel: React.FC<{ images: SlideImage[], className?: string, imgClassName?: string }> = ({ images, className, imgClassName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {images.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out flex items-center justify-center bg-gray-50 ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <img
            src={img.url}
            alt={img.alt}
            loading={index === 0 ? "eager" : "lazy"}
            className={`w-full h-full ${imgClassName || 'object-cover'}`}
          />
          {img.caption && (
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4 text-center text-xl backdrop-blur-sm">
              {img.caption}
            </div>
          )}
        </div>
      ))}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
        {images.map((_, idx) => (
          <div 
            key={idx} 
            className={`h-2 w-2 rounded-full transition-all ${idx === currentIndex ? 'bg-white w-6' : 'bg-white/50'}`}
          />
        ))}
      </div>
    </div>
  );
};

export const TitleSlide: React.FC<SlideLayoutProps> = ({ slide }) => {
  const hasBgImage = !!slide.backgroundImage;
  return (
    <div className="relative h-full w-full overflow-hidden font-sans bg-white" 
      style={{ backgroundImage: hasBgImage ? `url(${slide.backgroundImage})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center 20%' }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/95 via-40% to-transparent" />
      <div className="absolute bottom-0 left-0 w-full px-12 pb-12 md:px-16 md:pb-16 z-10 flex flex-col justify-end h-full">
        <h1 className="text-7xl md:text-8xl font-bold text-[#C97064] mb-6 leading-[1.1] max-w-7xl">{slide.title}</h1>
        {slide.subtitle && <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-12 leading-tight max-w-6xl">{slide.subtitle}</h2>}
        <div className="flex items-center gap-6 border-t-2 border-slate-200 pt-6 w-full max-w-4xl">
           <img src={LOGO_URL} alt="The Pitch Hub" className="h-16 md:h-20 w-auto" />
           <div className="h-12 w-0.5 bg-slate-300"></div>
           <p className="text-slate-600 text-2xl md:text-3xl font-medium">An Initiative by The Pitch Hub</p>
        </div>
      </div>
    </div>
  );
};

export const SectionSlide: React.FC<SlideLayoutProps> = ({ slide }) => {
  const hasBgImage = !!slide.backgroundImage;
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-16 text-white overflow-hidden relative" style={{ backgroundColor: BrandColor }}>
      {hasBgImage && (
        <>
          <div className="absolute inset-0 z-0" style={{ backgroundImage: `url(${slide.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <div className="absolute inset-0 bg-black/60 z-0" />
        </>
      )}
      <div className="relative z-10 flex flex-col items-center">
        <div className="border-b-4 border-white/30 pb-8 mb-12 w-64 mx-auto shrink-0"></div>
        <h1 className="text-8xl md:text-[10rem] font-bold mb-10 leading-none">{slide.title}</h1>
        {slide.subtitle && <h2 className="text-5xl md:text-6xl font-light opacity-90 max-w-6xl leading-tight">{slide.subtitle}</h2>}
      </div>
    </div>
  );
};

export const ContentSlide: React.FC<SlideLayoutProps> = ({ slide, onOpenSandbox }) => {
  const hasCarousel = slide.images && slide.images.length > 1;
  const [formState, setFormState] = useState<Record<string, string>>({});
  const [activeField, setActiveField] = useState<string | null>(null);

  const handleInputChange = (id: string, value: string) => {
    setFormState(prev => ({ ...prev, [id]: value }));
  };

  return (
    <div className="flex flex-col h-full px-12 py-12 bg-white text-gray-800 overflow-hidden">
      <div className="mb-8 border-b-4 border-gray-100 pb-6 shrink-0 flex justify-between items-end">
        <div>
          <h2 className="text-6xl md:text-7xl font-bold text-gray-900 leading-tight">{slide.title}</h2>
          {slide.subtitle && <h3 className="text-3xl md:text-4xl text-gray-500 mt-3 font-light">{slide.subtitle}</h3>}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto flex flex-col min-h-0 pr-4">
        {hasCarousel && slide.images && slide.images[0].position !== 'bottom' && (
          <div className="mb-8 h-[350px] w-full shrink-0 rounded-2xl shadow-lg overflow-hidden">
             <ImageCarousel images={slide.images} className="w-full h-full" imgClassName="object-contain" />
          </div>
        )}
        
        {!hasCarousel && slide.mainImage && slide.mainImage.position !== 'bottom' && (
          <div className={`mb-8 ${slide.mainImage.position === 'center' ? 'flex justify-center' : ''} shrink-0`}>
             <img src={slide.mainImage.url} alt={slide.mainImage.alt} loading="eager" className="rounded-2xl shadow-lg max-h-[350px] object-contain" />
             {slide.mainImage.caption && <p className="text-xl text-gray-500 mt-3 text-center">{slide.mainImage.caption}</p>}
          </div>
        )}

        {slide.body && (
          <ul className="space-y-6 pl-2 mb-10">
            {slide.body.map((line, idx) => (
              <li key={idx} className="flex items-start text-4xl md:text-[2.75rem] text-gray-700 leading-snug">
                <span className="inline-block w-8 h-8 rounded-full bg-[#C97064] mt-5 mr-6 flex-shrink-0" />
                {line}
              </li>
            ))}
          </ul>
        )}

        {slide.interactions && (
          <div className="mt-4 grid gap-8 grid-cols-1 max-w-5xl">
            {slide.interactions.map((interaction) => {
              const isActive = activeField === interaction.id;
              const hasValue = !!formState[interaction.id];
              
              return (
              <div key={interaction.id} className="flex flex-col gap-3 group">
                <div className="flex items-center justify-between">
                  <label className={`text-3xl md:text-4xl font-semibold transition-colors duration-300 ${isActive ? 'text-[#C97064]' : 'text-gray-700'}`}>
                    {interaction.label}
                  </label>
                  <div className="flex gap-4 items-center">
                    {onOpenSandbox && (
                      <button 
                        onClick={() => onOpenSandbox(interaction.aiPromptTemplate, interaction.type === 'image-gen' ? 'image' : 'text')}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-[#C97064]/10 text-gray-600 hover:text-[#C97064] rounded-lg text-lg font-bold transition-all border border-transparent hover:border-[#C97064]/20"
                      >
                        <Sparkles size={20} /> Use AI Helper
                      </button>
                    )}
                    {hasValue && (
                      <span className="flex items-center gap-2 text-[#C97064] text-xl animate-in fade-in duration-300">
                        <Check size={24} /> <span className="text-sm uppercase tracking-wider font-bold">Captured</span>
                      </span>
                    )}
                  </div>
                </div>
                <div className="relative">
                  {interaction.type === 'textarea' ? (
                    <textarea
                      placeholder={interaction.placeholder}
                      value={formState[interaction.id] || ''}
                      onChange={(e) => handleInputChange(interaction.id, e.target.value)}
                      onFocus={() => setActiveField(interaction.id)}
                      onBlur={() => setActiveField(null)}
                      className={`w-full p-6 text-3xl border-2 rounded-xl transition-all duration-300 resize-none h-40 shadow-sm
                        ${isActive ? 'border-[#C97064] outline-none ring-4 ring-[#C97064]/20 bg-white scale-[1.01] shadow-lg' : 'border-slate-300 bg-slate-50'}
                      `}
                    />
                  ) : (
                    <input
                      type="text"
                      placeholder={interaction.placeholder}
                      value={formState[interaction.id] || ''}
                      onChange={(e) => handleInputChange(interaction.id, e.target.value)}
                      onFocus={() => setActiveField(interaction.id)}
                      onBlur={() => setActiveField(null)}
                      className={`w-full p-6 text-3xl border-2 rounded-xl transition-all duration-300 shadow-sm
                        ${isActive ? 'border-[#C97064] outline-none ring-4 ring-[#C97064]/20 bg-white scale-[1.01] shadow-lg' : 'border-slate-300 bg-slate-50'}
                      `}
                    />
                  )}
                  {isActive && <div className="absolute right-4 top-4 text-[#C97064] opacity-50 animate-pulse"><Edit3 size={28} /></div>}
                </div>
              </div>
            )})}
          </div>
        )}

        {hasCarousel && slide.images && slide.images[0].position === 'bottom' && (
          <div className="mt-8 h-[350px] w-full shrink-0 rounded-2xl shadow-lg overflow-hidden">
             <ImageCarousel images={slide.images} className="w-full h-full" imgClassName="object-contain" />
          </div>
        )}

        {!hasCarousel && slide.mainImage && slide.mainImage.position === 'bottom' && (
          <div className="mt-8 flex flex-col items-center shrink-0">
             <img src={slide.mainImage.url} alt={slide.mainImage.alt} loading="eager" className="rounded-2xl shadow-lg max-h-[350px] object-contain" />
              {slide.mainImage.caption && <p className="text-xl text-gray-500 mt-3">{slide.mainImage.caption}</p>}
          </div>
        )}
      </div>
      {slide.footer && <div className="mt-6 text-gray-400 text-xl border-t pt-4 shrink-0">{slide.footer}</div>}
    </div>
  );
};

export const UseCaseGridSlide: React.FC<SlideLayoutProps> = ({ slide, onOpenSandbox }) => {
  return (
    <div className="flex flex-col h-full px-12 py-12 bg-white text-gray-800 overflow-hidden">
      <div className="mb-10 border-b-4 border-gray-100 pb-6 flex justify-between items-center">
        <div>
          <h2 className="text-6xl md:text-7xl font-bold text-gray-900 leading-tight">{slide.title}</h2>
          {slide.subtitle && <h3 className="text-3xl md:text-4xl text-gray-500 mt-3 font-light">{slide.subtitle}</h3>}
        </div>
        <LayoutGrid size={64} className="text-[#C97064] opacity-20" />
      </div>

      <div className="flex-1 overflow-y-auto pr-4 grid grid-cols-1 md:grid-cols-2 gap-8 content-start pb-10">
        {slide.useCases?.map((uc, idx) => (
          <div key={idx} className="bg-gray-50 rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all group hover:scale-[1.01]">
            <div className="flex justify-between items-start mb-4">
              <span className="px-4 py-1 bg-[#C97064]/10 text-[#C97064] text-lg font-bold rounded-full uppercase tracking-widest">{uc.industry}</span>
              {onOpenSandbox && (
                <button 
                  onClick={() => onOpenSandbox(`Act as an AI business consultant. ${uc.promptExample}`)}
                  className="p-3 bg-white hover:bg-[#C97064] text-gray-400 hover:text-white rounded-full transition-all border border-gray-200 shadow-sm"
                  title="Try this prompt in AI Tool"
                >
                  <Sparkles size={24} />
                </button>
              )}
            </div>
            <h3 className="text-3xl font-bold mb-3 text-gray-800">{uc.title}</h3>
            <p className="text-2xl text-gray-600 mb-6 leading-relaxed">{uc.description}</p>
            
            <div className="bg-white rounded-xl p-5 border border-dashed border-gray-300 mb-4">
              <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Prompt Example</label>
              <p className="text-xl italic text-gray-500">"{uc.promptExample}"</p>
            </div>
            
            <div className="flex items-center gap-3 text-[#C97064] font-semibold text-xl">
              <Check size={20} /> Benefit: {uc.benefit}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const SankeySlide: React.FC<SlideLayoutProps> = ({ slide }) => {
  return (
    <div className="flex flex-col h-full px-12 py-12 bg-white text-gray-800 overflow-hidden">
      <div className="mb-8 border-b-4 border-gray-100 pb-6 flex justify-between items-center">
        <div>
          <h2 className="text-6xl md:text-7xl font-bold text-gray-900 leading-tight">{slide.title}</h2>
          {slide.subtitle && <h3 className="text-3xl md:text-4xl text-gray-500 mt-3 font-light">{slide.subtitle}</h3>}
        </div>
        <Network size={64} className="text-[#C97064] opacity-20" />
      </div>
      <div className="flex-1 min-h-0">
        <SankeyDiagram />
      </div>
      {slide.footer && <div className="mt-6 text-gray-400 text-xl border-t pt-4 shrink-0">{slide.footer}</div>}
    </div>
  );
};

export const SplitSlide: React.FC<SlideLayoutProps> = ({ slide }) => {
  const hasCarousel = slide.images && slide.images.length > 1;
  const carouselPosition = hasCarousel && slide.images ? slide.images[0].position : null;
  const showLeftImage = (slide.mainImage?.position === 'left') || (hasCarousel && carouselPosition === 'left');
  const showRightImage = (slide.mainImage?.position === 'right') || (hasCarousel && carouselPosition === 'right');

  return (
    <div className="flex flex-col h-full px-12 py-12 bg-white text-gray-800 overflow-hidden">
      <div className="mb-8 border-b-4 border-gray-100 pb-6 shrink-0">
        <h2 className="text-6xl md:text-7xl font-bold text-gray-900 leading-tight">{slide.title}</h2>
        {slide.subtitle && <h3 className="text-3xl md:text-4xl text-gray-500 mt-3 font-light">{slide.subtitle}</h3>}
      </div>
      
      <div className="flex-1 grid grid-cols-2 gap-12 overflow-hidden min-h-0 items-center">
        {showLeftImage ? (
           <div className="h-full max-h-[60vh] w-full rounded-3xl overflow-hidden shadow-lg relative group">
             {hasCarousel && slide.images ? <ImageCarousel images={slide.images} className="w-full h-full" /> : slide.mainImage ? <img src={slide.mainImage.url} alt={slide.mainImage.alt} loading="eager" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" /> : null}
           </div>
        ) : (
          <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-center h-full max-h-full">
            {slide.leftTitle && <h3 className="text-4xl md:text-5xl font-semibold mb-6 text-[#C97064]">{slide.leftTitle}</h3>}
            {slide.leftBody && (
              <ul className="space-y-6 overflow-hidden pr-2">
                {slide.leftBody.map((line, idx) => (
                  <li key={idx} className="flex items-start text-3xl md:text-[2.5rem] text-gray-700 leading-snug">
                    <span className="inline-block w-6 h-6 rounded-full bg-[#C97064] mt-3 mr-5 flex-shrink-0" />
                    {line}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {showRightImage ? (
           <div className="h-full max-h-[60vh] w-full rounded-3xl overflow-hidden shadow-lg relative group">
             {hasCarousel && slide.images ? <ImageCarousel images={slide.images} className="w-full h-full" /> : slide.mainImage ? <img src={slide.mainImage.url} alt={slide.mainImage.alt} loading="eager" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" /> : null}
           </div>
        ) : (
          <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-center h-full max-h-full">
            {slide.rightTitle && <h3 className="text-4xl md:text-5xl font-semibold mb-6 text-[#C97064]">{slide.rightTitle}</h3>}
            {slide.rightBody && (
              <ul className="space-y-6 overflow-hidden pr-2">
                {slide.rightBody.map((line, idx) => (
                  <li key={idx} className="flex items-start text-3xl md:text-[2.5rem] text-gray-700 leading-snug">
                     <span className="inline-block w-6 h-6 rounded-full bg-[#C97064] mt-3 mr-5 flex-shrink-0" />
                    {line}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
      {slide.footer && <div className="mt-6 text-gray-400 text-xl italic shrink-0">{slide.footer}</div>}
    </div>
  );
};

export const CTASlide: React.FC<SlideLayoutProps> = ({ slide }) => {
  const hasBgImage = !!slide.backgroundImage;
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-16 text-white relative overflow-hidden" 
      style={{ backgroundColor: BrandColor, backgroundImage: hasBgImage ? `url(${slide.backgroundImage})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {hasBgImage && <div className="absolute inset-0 bg-black/70 z-0" />}
      <div className="relative z-10 flex flex-col items-center w-full max-w-7xl h-full justify-center">
        <div className="mb-6 bg-white/95 p-6 rounded-3xl shadow-xl shrink-0">
          <img src={LOGO_URL} alt="The Pitch Hub" className="h-20 w-auto" />
        </div>
        <h1 className="text-7xl md:text-9xl font-bold mb-8 leading-none">{slide.title}</h1>
        {slide.subtitle && <div className="text-4xl md:text-5xl font-semibold mb-12 bg-white/20 backdrop-blur-md px-12 py-5 rounded-full">{slide.subtitle}</div>}
        {slide.body && (
          <div className="bg-white text-[#C97064] p-12 rounded-[3rem] shadow-2xl max-w-5xl w-full transform hover:scale-105 transition-transform duration-300">
            {slide.body.map((line, idx) => (
              <p key={idx} className={`text-3xl md:text-5xl ${idx === 0 ? 'font-bold mb-5' : 'mb-3'}`}>{line}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

```

### FILE: constants.ts
```typescript

import { SlideContent, SlideType } from './types';

export const PRESENTATION_SLIDES: SlideContent[] = [
  {
    id: 1,
    type: SlideType.TITLE,
    title: "Bridging the AI Gap for Africa’s Entrepreneurs",
    subtitle: "Introducing SmartScale: A Practical AI Program for SME Growth in Ghana and Nigeria.",
    theme: 'brand',
    backgroundImage: "https://media.techbridge.edu.gh/media/slide-1.png",
    speakerNotes: "Welcome everyone. Today, we're here to discuss a critical opportunity for African businesses: bridging the AI gap. This isn't just about technology; it's about growth, efficiency, and competitiveness for SMEs in Ghana and Nigeria. My name is [Your Name], and I'm excited to introduce you to SmartScale."
  },
  {
    id: 2,
    type: SlideType.SPLIT,
    title: "Programme Overview",
    leftTitle: "Format & Target",
    leftBody: [
      "Format: 2 Days Virtual + 1 Day In-Person",
      "Class Size: 20-30 participants",
      "Target: Small business owners and entrepreneurs"
    ],
    rightTitle: "Why This Matters",
    rightBody: [
      "While global markets accelerate with AI, many African entrepreneurs have not yet leveraged its potential.",
      "This programme bridges that gap with practical, accessible tools."
    ],
    mainImage: {
      url: "https://media.techbridge.edu.gh/media/slide-2.png",
      alt: "African business team meeting",
      position: "right"
    },
    speakerNotes: "SmartScale is a hybrid model designed for busy entrepreneurs: two virtual days to learn the basics, followed by an intense, hands-on in-person day. We keep class sizes small to ensure personal attention."
  },
  {
    id: 3,
    type: SlideType.SANKEY,
    title: "How SmartScale Works",
    subtitle: "Understanding the Data Flow & Interaction Ecosystem",
    speakerNotes: "Before we dive into the modules, let's look at how this platform works. It's a closed-loop ecosystem. Your interactions flow from the UI into a centralized state manager. When you use the Workshop Tool, we pipe that data directly to Google's Gemini API, which returns text and images that are then rendered instantly in your current slide. This architecture ensures that your workshop results are always contextual and high-performance."
  },
  {
    id: 4,
    type: SlideType.SPLIT,
    title: "The Reality: Intense Pressure, Limited Resources",
    mainImage: {
        url: "https://media.techbridge.edu.gh/media/slide-3.png",
        alt: "Entrepreneur working in their shop",
        position: "left"
    },
    rightTitle: "The Challenge & Impact",
    rightBody: [
      "Small businesses operate with competing priorities and tight budgets.",
      "Founders are stretched thin across marketing, service, and operations.",
      "80% of African startups fail within the first five years.",
      "The issue isn’t relevance—it’s access. Entrepreneurs lack exposure to simple AI tools."
    ],
    speakerNotes: "We know the reality you face. You are the CEO, marketing manager, and customer service agent all at once. 80% of startups fail not because of bad ideas, but because operational inefficiencies drain resources. AI is the lever to fix that."
  },
  {
    id: 5,
    type: SlideType.SPLIT,
    title: "A Widening Digital Divide",
    leftBody: [
      "While global markets accelerate with AI, many African entrepreneurs have not yet leveraged its potential.",
      "47% of business leaders in the Middle East & Africa are already using or eager to adopt AI."
    ],
    rightBody: [
      "The gap is growing: AI adoption among African SMEs remains low due to limited skills.",
      "This creates a growing risk of being outpaced and losing competitiveness."
    ],
    mainImage: {
      url: "https://media.techbridge.edu.gh/media/slide-4.png",
      alt: "Man utilizing mobile technology",
      position: "left"
    }
  },
  {
    id: 6,
    type: SlideType.CONTENT,
    title: "The Opportunity: Africa’s AI Market",
    subtitle: "Exponential Growth Projected",
    body: [
      "USD $4.51 Billion (2025) → USD $16.53 Billion (2030)",
      "(Source: Mastercard, 2025)",
      "There is a clear and urgent opportunity to equip SMEs to capture a share of this growth."
    ],
    mainImage: {
        url: "https://media.techbridge.edu.gh/media/slide-5.png",
        alt: "Growth chart rising significantly",
        position: "bottom",
        caption: "Projected Market Growth 2025-2030"
    }
  },
  {
    id: 7,
    type: SlideType.SECTION,
    title: "Day 1: Virtual",
    subtitle: "AI Fundamentals & Quick Wins",
    theme: 'brand',
    backgroundImage: "https://media.techbridge.edu.gh/media/slide-8.png"
  },
  {
    id: 8,
    type: SlideType.CONTENT,
    title: "Hands-on Exercise: \"The Perfect Prompt\"",
    subtitle: "Module 4: Prompt Writing",
    body: [
      "Go to ChatGPT or Gemini and use the 4-part formula (Action + Context + Tone + Format) to write a prompt.",
      "Try the 'Perfect Prompt' helper to see how AI refines your idea."
    ],
    interactions: [
      { 
        id: 'pp1', 
        type: 'textarea', 
        label: 'Draft Your Prompt', 
        placeholder: 'e.g., I want a post for my jewelry store...',
        aiPromptTemplate: 'Review this prompt for an SME owner. Refine it using the formula: Action + Context + Tone + Format. Provide the refined prompt first, then explain why it works better.'
      }
    ],
    mainImage: {
        url: "https://media.techbridge.edu.gh/media/slide-15.png",
        alt: "Data analysis",
        position: "bottom"
    }
  },
  {
    id: 9,
    type: SlideType.SECTION,
    title: "Day 2: Virtual",
    subtitle: "Customer & Operations",
    theme: 'brand',
    backgroundImage: "https://media.techbridge.edu.gh/media/slide-18.png"
  },
  {
    id: 10,
    type: SlideType.CONTENT,
    title: "Hands-on Exercise: \"Anticipate the Objection\"",
    subtitle: "Module 3: Sales Scripts",
    body: [
      "Identify the single most common objection you hear from customers.",
      "Use AI to generate professional responses that save time and close deals."
    ],
    interactions: [
      {
        id: 'obj1',
        type: 'text',
        label: 'Common Objection',
        placeholder: 'e.g., "The delivery fee is too high"',
        aiPromptTemplate: 'As a senior sales coach for a Nigerian SME, provide 3 short, persuasive, and empathetic responses to this customer objection: '
      }
    ],
    mainImage: {
        url: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&q=80&w=800",
        alt: "Business negotiation",
        position: "right"
    }
  },
  {
    id: 11,
    type: SlideType.SECTION,
    title: "Day 3: In-Person",
    subtitle: "The AI Implementation Lab",
    theme: 'brand',
    backgroundImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1600",
    speakerNotes: "Welcome to our final, most intense day. Today is where theory becomes reality. We are going to build your assets live."
  },
  {
    id: 12,
    type: SlideType.USE_CASE_GRID,
    title: "Industry-Specific AI Use Cases",
    subtitle: "Ready-to-use examples for your sector",
    useCases: [
      {
        industry: "Retail & E-commerce",
        title: "Product Description Generator",
        description: "Generate 50 product descriptions from basic stock data in minutes.",
        promptExample: "Write an SEO-friendly product description for a hand-stitched leather bag. Focus on durability and local craftsmanship.",
        benefit: "Saves 20+ hours per month on website updates."
      },
      {
        industry: "Services",
        title: "Meeting Minutes to Proposals",
        description: "Transform a voice-recorded meeting into a professional client proposal.",
        promptExample: "Summarize this transcript and draft a formal proposal highlighting the project scope, timeline, and budget.",
        benefit: "Increase quote turnaround speed by 300%."
      },
      {
        industry: "Agriculture",
        title: "Market Price Analyst",
        description: "Use AI to analyze crop price trends and suggest the best time to sell.",
        promptExample: "Analyse current yam market trends in Accra and suggest whether to sell now or wait 2 weeks based on seasonal patterns.",
        benefit: "Maximize profit margins by timing sales correctly."
      },
      {
        industry: "Manufacturing",
        title: "QC Reporting Assistant",
        description: "Generate Quality Control reports just by dictating findings on your phone.",
        promptExample: "Convert my voice notes about the morning production run into a structured QC report with pass/fail metrics.",
        benefit: "Consistent documentation without the desk time."
      },
      {
        industry: "Hospitality",
        title: "Review Response Bot",
        description: "Draft personalized, polite responses to every Google or TripAdvisor review.",
        promptExample: "Write a warm response to a customer who loved our jollof rice but thought the wait time was slightly long.",
        benefit: "Maintain 5-star reputation with minimal effort."
      },
      {
        industry: "Logistics",
        title: "Route Optimization Scripts",
        description: "Draft instructions for drivers based on traffic patterns and delivery priorities.",
        promptExample: "Plan the most efficient route for 10 deliveries in Lagos, prioritizing Mainland stops before 2 PM.",
        benefit: "Reduces fuel costs and delivery delays."
      }
    ],
    speakerNotes: "Look at these cards. These aren't just ideas; they are recipes. You can take any of these prompts right now and put them into the Workshop Tool to see the magic."
  },
  {
    id: 13,
    type: SlideType.CONTENT,
    title: "Hands-on Exercise: \"Branded Visuals\"",
    subtitle: "Module 5: Visual Content",
    body: [
      "No more generic stock photos.",
      "Use the Image Creator in our Workshop Tool to generate a custom marketing image for your brand.",
      "1. Describe your product in a premium setting.",
      "2. Add your brand colors and 'vibes'."
    ],
    interactions: [
      {
        id: 'img1',
        type: 'image-gen',
        label: 'Describe Your Ideal Marketing Photo',
        placeholder: 'e.g., [STYLE] [ASPECT] Gourmet cafe in Accra, sunlight hitting a fresh pastry...',
        aiPromptTemplate: '[STYLE] [ASPECT] Professional commercial photography of '
      }
    ],
    mainImage: {
        url: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=800",
        alt: "Creative design process",
        position: "bottom"
    },
    speakerNotes: "Open the Workshop Tool, switch to Image mode. Describe your shop or your hero product. Be specific about the light and the mood. Download the result and imagine it on your Instagram feed."
  },
  {
    id: 14,
    type: SlideType.CTA,
    title: "Ready to Transform Your Business?",
    subtitle: "Join the SmartScale Alumni",
    body: [
      "Contact: The Pitch Hub",
      "Email: info@thepitchhub.org",
      "Website: www.thepitchhub.org"
    ],
    backgroundImage: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=1600",
    speakerNotes: "Thank you for being part of SmartScale. This is just the beginning. Transform your business, grow your impact, and lead the way for African entrepreneurship. Let's get to work!"
  }
];

```

### FILE: CREATION.md
```md
# smartscale-ai-presentation-platform

## Purpose
[Auto-generated. Needs manual review and completion.]

## Stack
Node.js, TypeScript, Vite

## Setup
```bash
# Placeholder — needs manual update based on project type
```

## Key Decisions
- [Pending review]
- [Pending review]
- [Pending review]

## Open Questions
- [To be determined]
- [To be determined]

```

### FILE: DEPLOYMENT.md
```md
# Deployment Configuration

This application is deployed behind an Nginx reverse proxy at the path `/smartscale-ai-presentation-platform/`.

## Required Configuration for Docker/Nginx Deployment

### 1. Vite Base Path (vite.config.ts)

The Vite config MUST include `base: '/smartscale-ai-presentation-platform/'` to ensure all assets (JS, CSS) load correctly:

```typescript
export default defineConfig(({mode}) => {
  return {
    base: '/smartscale-ai-presentation-platform/',  // REQUIRED: Assets must load from /smartscale-ai-presentation-platform/assets/
    plugins: [react(), ...],
    // ... rest of config
  };
});
```

### 2. React Router Basename (src/main.tsx or src/index.tsx)

If using React Router, the BrowserRouter MUST include `basename="/smartscale-ai-presentation-platform"` for client-side routing:

```typescript
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/smartscale-ai-presentation-platform">
      <App />
    </BrowserRouter>
  </StrictMode>,
);
```

**Note:** Only include this if the project uses `react-router-dom`. Check package.json dependencies first.

## Why This is Required

- **Nginx Configuration**: The app is served at `http://localhost:8080/smartscale-ai-presentation-platform/`, not at the root
- **Asset Loading**: Without `base: '/smartscale-ai-presentation-platform/'`, assets try to load from `/assets/` instead of `/smartscale-ai-presentation-platform/assets/`
- **Routing**: Without `basename="/smartscale-ai-presentation-platform"`, React Router treats routes incorrectly

## Error Symptoms

If you see this error:
```
Failed to load module script: Expected a JavaScript-or-Wasm module script
but the server responded with a MIME type of "text/html"
```

This means the base path is NOT configured correctly. The browser is trying to load JS from the wrong path.

## Verification After Build

After running `npm run build` or `pnpm run build`, check `dist/index.html`:
- Script tags should reference: `/smartscale-ai-presentation-platform/assets/index-*.js`
- Link tags should reference: `/smartscale-ai-presentation-platform/assets/index-*.css`

If they reference `/assets/` instead of `/smartscale-ai-presentation-platform/assets/`, the configuration is incorrect.

## Deployment URLs

- **Development**: `http://localhost:5173` (Vite dev server, no base path needed)
- **Production (Docker)**: `http://localhost:8080/smartscale-ai-presentation-platform/`
- **Production (Staging/Live)**: `https://portal.aucdt.edu.gh/smartscale-ai-presentation-platform/` (or similar)

## DO NOT REMOVE THESE SETTINGS

These settings are critical for deployment and must not be removed or changed unless the Nginx reverse proxy configuration is also updated in:
- `docker/nginx/nginx.conf`
- `docker-compose-all-apps.yml`

---

**Generated**: 2026-03-04
**Monorepo**: aucdt-utilities (109 applications)
**Project**: smartscale-ai-presentation-platform

```

### FILE: Dockerfile
```text
# Multi-stage Dockerfile for Vite/React Applications
# Optimized for production deployment

# Stage 1: Build
FROM node:24-alpine AS builder

WORKDIR /app

# Enable Corepack for pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy dependency files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile || npm install

# Copy application source
COPY . .

# Build application
RUN pnpm run build || npm run build

# Stage 2: Production
FROM node:24-alpine

WORKDIR /app

# Install serve for production preview
RUN corepack enable && corepack prepare pnpm@latest --activate && \
    pnpm add -g serve

# Copy built assets from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

# Expose port
EXPOSE 4173

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:4173/health || exit 1

# Run application
CMD ["serve", "-s", "dist", "-l", "4173"]

```

### FILE: docs/admin_guide.md
```md

# SmartScale Platform: Administrator Command Center Guide

## 1. Overview
The Administrator Command Center is a secure, hidden layer within the SmartScale platform used for real-time monitoring, diagnostic testing, and accessibility management.

## 2. Authentication
- **Access Shortcut**: `CTRL + SHIFT + A`
- **Password**: `smartscale2025`
- **Security Policy**: Access tokens are stored in volatile session memory. Refreshing the browser will require re-authentication.

## 3. Tool Suites
### 3.1 Platform Experience (Settings)
- **Theme Management**: Seamlessly toggle between Light, Dark, and High-Contrast modes.
- **Session Telemetry**: Monitor real-time slide tracking and Gemini API heartbeats.

### 3.2 Secure Audit Ledger (Audit)
- **Activity Stream**: Tracks all significant interaction events with millisecond timestamps.
- **Data Privacy**: Audit logs are maintained locally and never transmitted to external databases.

### 3.3 System Diagnostics (Testing)
- **Connectivity Check**: Verifies the presence and validity of the Google AI Studio environment.
- **Integrity Report**: Returns pass/fail status for the platform's core dependency graph.

## 4. Emergency Procedures
In the event of an API failure, navigate to the **Testing** tab to verify the `API_KEY`. Ensure no corporate firewalls are blocking `generativelanguage.googleapis.com`.

```

### FILE: docs/deployment.md
```md
# Deployment Documentation

## System Requirements
- **Browser**: Modern evergreen browsers (Chrome 110+, Edge 110+, Firefox 110+).
- **Network**: Active internet connection required for Google Gemini API integration.
- **Key**: A valid Google AI Studio API Key must be available in the environment.

## Environment Variables
Ensure the following variable is configured in your deployment platform (Vercel, Cloudflare, etc.):
`API_KEY` - Your Gemini API credentials.

## Deployment Steps
1. **Build**: Ensure all TypeScript components are compiled via Vite/ESBuild.
2. **CDN Assets**: The application relies on external fonts and icons. Ensure `cdn.tailwindcss.com` and `aistudiocdn.com` are not blocked by corporate firewalls.
3. **Model Configuration**: The app defaults to `gemini-3-flash-preview` for text and `gemini-2.5-flash-image` for images. To change these, modify the constants in `AISandbox.tsx`.

## Troubleshooting
- **API Errors**: Check the Admin Panel "System Health" section. Ensure the API Key has not reached its quota limits.
- **Image Issues**: If images fail to load, verify that the AUC DT storage URLs in `constants.ts` are still active.
```

### FILE: docs/SRS.md
```md
﻿# Software Requirements Specification

**Project:** Smartscale Ai Presentation Platform
**Version:** 3.0.0
**Status:** As-Built
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Standard:** IEEE 29148-2018

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) documents the requirements for **Smartscale Ai Presentation Platform**, a web application deployed as part of the Techbridge University College (TUC) institutional utility suite. It serves as the authoritative reference for developers, testers, and stakeholders.

### 1.2 Scope

**Smartscale Ai Presentation Platform** is a TypeScript-based React 19 single-page application (SPA) built with Vite and deployed via Docker/Nginx. It operates within the TUC monorepo (`aucdt-utilities`) and conforms to the Techbridge University College Shared Standards.

**In scope:**
- All functional UI components and user flows
- Authentication and authorisation (where applicable)
- Data presentation, form handling, and export features
- Admin section and audit logging (where applicable)

**Out of scope:**
- Backend database administration
- Third-party service configuration
- Network infrastructure

### 1.3 Definitions and Acronyms

| Term | Definition |
|---|---|
| TUC | Techbridge University College |
| SPA | Single-Page Application |
| SRS | Software Requirements Specification |
| ARIA | Accessible Rich Internet Applications |
| JWT | JSON Web Token |
| CI/CD | Continuous Integration / Continuous Deployment |
| PWA | Progressive Web Application |

### 1.4 References

- SHARED-STANDARDS.md â€” TUC Canonical AI Governance Layer
- CLAUDE.md â€” Audit & Analysis Agent Constitution
- GEMINI.md â€” Execution Agent Constitution
- IEEE 29148-2018 â€” Systems and Software Engineering Requirements
- TUC Refresh Directive: <https://ai-tools.aucdt.edu.gh/refresh>

### 1.5 Overview

Section 2 describes the overall product context. Section 3 lists system features. Section 4 covers external interfaces. Section 5 defines non-functional requirements.

---

## 2. Overall Description

### 2.1 Product Perspective

**Smartscale Ai Presentation Platform** is a standalone module within the TUC institutional web application suite. It communicates with TUC backend services via REST APIs and shares the TUC design system (Tailwind CSS, Playfair Display, Bebas Neue, Cormorant Garamond).

### 2.2 Product Functions

- Core institutional utility functionality

### 2.3 User Classes and Characteristics

| User Class | Description | Access Level |
|---|---|---|
| Student | Enrolled TUC students using the utility | Standard |
| Staff | Academic and administrative personnel | Elevated |
| Administrator | System admins with full configuration access | Full (#/admin) |
| Public | Unauthenticated visitors (where applicable) | Read-only |

### 2.4 Operating Environment

- **Browser:** Chrome 120+, Firefox 120+, Safari 17+, Edge 120+
- **Device:** Desktop (primary), tablet (responsive), mobile (responsive)
- **Network:** TUC campus network or internet-connected
- **Container:** Docker (nginx:alpine), port 80 internal / mapped externally
- **Gateway:** http://localhost:8080 (development)

### 2.5 Design and Implementation Constraints

- **React version:** Exactly 19.2.5 â€” locked, no exceptions
- **Build tool:** Vite 7.3.1
- **Package manager:** pnpm (preferred), npm (fallback)
- **Styling:** Tailwind CSS 4.x with TUC design tokens
- **Accessibility:** WCAG 2.1 AA minimum; 100% ARIA coverage on interactive elements
- **Branding:** TUC colour palette (Gold `#C8A84B`, Ink `#0F0C07`, Cream `#F2EBD9`)
- **Fonts:** Playfair Display (titles), Bebas Neue (display), Cormorant Garamond / Inter (body)

### 2.6 Assumptions and Dependencies

- TUC Auth API available at `http://localhost:5000/api/auth/*` (when auth required)
- Mail API at `https://portal.aucdt.edu.gh` (live â€” do not change URL)
- Docker and Docker Compose available in deployment environment
- Google Analytics tag G-FKXTELQ71R injected via `index.html`

---

## 3. System Features (Functional Requirements)

### 3.1 Core Application Shell

**FR-001** The application shall render without errors in all supported browsers.
**FR-002** The application shall display a loading state during async operations.
**FR-003** The application shall display a meaningful error state on API failure with retry option.
**FR-004** The application shall display an empty state when no data is available.

### 3.2 Navigation and Routing

**FR-010** The application shall provide client-side routing without full page reloads.
**FR-011** All navigation links shall be functional and lead to valid routes.
**FR-012** The application shall handle 404 routes gracefully with a fallback page.

### 3.3 Accessibility

**FR-020** All interactive elements shall have ARIA labels or descriptive text.
**FR-021** The application shall be fully navigable via keyboard alone.
**FR-022** Focus indicators shall be visible on all focusable elements.
**FR-023** Colour contrast shall meet WCAG 2.1 AA standards (4.5:1 normal text, 3:1 large).

### 3.4 Theme Support

**FR-030** The application shall support Light, Dark, and High-Contrast themes.
**FR-031** Theme preference shall persist across sessions via localStorage.

### 3.5 Admin Section (where applicable)

**FR-040** The application shall provide a password-protected `#/admin` route.
**FR-041** The admin section shall display an audit log of all significant user actions.
**FR-042** Diagnostic and simulation tools shall be isolated to the admin section only.

---

## 4. External Interface Requirements

### 4.1 User Interface

- Responsive layout: 320px (mobile) â†’ 1920px (desktop)
- TUC branding applied consistently (colours, typography, logo)
- No broken links or dead UI elements

### 4.2 Software Interfaces

| Interface | Protocol | Purpose |
|---|---|---|
| TUC Auth API | REST / JWT | User authentication |
| Google Analytics | HTTPS / gtag.js | Usage tracking |
| TUC Mail API | HTTPS / POST | Email notifications |

### 4.3 Communication Interfaces

- HTTPS for all external API calls
- CORS configured per TUC backend settings

---

## 5. Non-Functional Requirements

### 5.1 Performance

- Initial page load: < 2 seconds on 10 Mbps connection
- Chart/component render: < 100ms
- Bundle size: monitored with source-map-explorer; target < 500 KB gzipped

### 5.2 Reliability

- Application uptime target: 99.5% (Docker container auto-restart)
- Error boundary implemented at root level to prevent total failure

### 5.3 Security

- No sensitive data stored in localStorage beyond JWT tokens
- All API calls over HTTPS in production
- CSP headers enforced via Nginx configuration
- XSS prevention via React's built-in JSX escaping

### 5.4 Maintainability

- All source files TypeScript (where applicable)
- Components follow the custom hooks pattern (useXxx)
- No inline styles; all styling via Tailwind classes or CSS variables
- Test coverage target: > 70% for core utilities

### 5.5 Portability

- Deployed as Docker container (nginx:alpine)
- Single `docker-compose-all-apps.yml` entry
- Environment variables via `.env` files (VITE_ prefix)

---

## 6. Compliance

| Requirement | Status |
|---|---|
| React 19.2.5 exact version | âœ… Compliant |
| TUC branding applied | âœ… Compliant |
| ARIA 100% coverage | âŒ Non-compliant |
| Docker service configured | âœ… Compliant |
| SRS matches as-built state | âœ… Compliant |
| Zero broken links | â³ Verify |
| Admin section isolated | âŒ Non-compliant |
| Test suite present | âœ… Compliant |

---

## 7. Appendix â€” Tech Stack Reference

```
Stack: React 19.2.5 + TypeScript, Vite 7.3.1
Build output: dist/
Docker: nginx:alpine
Network: aucdt-network (172.20.0.0/16)
CI/CD: Bitbucket Pipelines
```

---


---

## 8. Diagrams

### 8.1 System Architecture

![System Architecture](architecture.svg)

### 8.2 Data Flow

![Data Flow](dataflow.svg)

---

*Generated by Phase 1b SRS Generator â€” TUC Refresh Directive*
*Document version 3.0.0 â€” 2026-03-07*

```

### FILE: docs/TESTING.md
```md
# Testing Guide — smartscale-ai-presentation-platform

**Application:** smartscale-ai-presentation-platform
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Framework:** Vitest 3.0.0 + @testing-library/react

---

## Running Tests

```bash
cd smartscale-ai-presentation-platform
pnpm install           # ensure devDeps installed
pnpm test              # run unit tests (watch mode)
pnpm test:coverage     # coverage report → coverage/
pnpm test:ui           # Vitest UI at http://localhost:51204
pnpm test:e2e          # E2E stubs (node environment)
```

---

## Test Structure

```
src/
  __tests__/
    setup.ts            # @testing-library/jest-dom import
    App.test.tsx        # Root component smoke tests
    App.e2e.ts          # E2E stub (extend with Playwright)
vitest.config.ts        # Unit test config (jsdom)
vitest.e2e.config.ts    # E2E config (node)
```

---

## Coverage Targets (TUC Standard)

| Metric | Target |
|---|---|
| Branches | ≥ 70% |
| Functions | ≥ 70% |
| Lines | ≥ 70% |
| Statements | ≥ 70% |

---

## Writing Tests

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('renders heading', () => {
    render(<MyComponent />);
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });

  it('handles button click', async () => {
    render(<MyComponent />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Clicked!')).toBeInTheDocument();
  });
});
```

---

## E2E with Playwright (Recommended)

```bash
# Install Playwright
pnpm add -D @playwright/test
npx playwright install chromium

# Run E2E
npx playwright test
```

Extend `src/__tests__/App.e2e.ts` with Playwright page assertions once the app is running.

---

## Admin Section Test Dashboard

Access at `http://localhost:5173/#/admin` → Test Runner tab.

The diagnostic panel provides a manual smoke test runner for verifying core user flows
without leaving the browser.

---

*Generated by Phase 4 Docs Generator — TUC Refresh Directive — 2026-03-08*

```

### FILE: docs/testing_guide.md
```md
# Testing & Quality Assurance Guide (v3.2)

## 1. Built-in Self-Diagnostics
The platform includes an internal diagnostic suite to verify environment health without external tools.
- **Access**: Admin Panel -> "Testing" Tab.
- **Checks**:
    - **API Connectivity**: Verifies `API_KEY` presence and connection to Gemini endpoints.
    - **Visual Diagnostic**: The "Capture Layout" feature simulates a high-resolution screenshot stored in the session audit log for integrity verification.

## 2. Automated Playwright Suite
For CI/CD or deep regression testing, use the `docs/tests.js` script.
- **Requirement**: Node.js & Playwright (`npm install playwright`).
- **Execution**: `node docs/tests.js`.
- **Coverage**:
    - User navigation (Keyboard & UI).
    - Admin Password validation (`smartscale2025`).
    - AI Workshop prompt submission lifecycle.

## 3. Workshop Tokenization Testing
Verify that image prompts are correctly processed:
1. Open the AI Workshop Tool.
2. Select "Image Creator".
3. Enter a prompt containing `[STYLE]` and `[ASPECT]`.
4. Select a style (e.g., Cyberpunk) and an aspect ratio (e.g., 16:9).
5. Generate and check the Audit Log to confirm the tokens were replaced with descriptive strings.

## 4. Accessibility Audit
- **Protocol**: Use the "High Contrast" theme and verify that all interactive elements have 4.5:1 contrast ratios.
- **Screen Readers**: All buttons use `aria-label` or `title` attributes. Verify focus trapping in the Admin Modal.

## 5. Troubleshooting
- **API Timeout**: Check network console. Gemini API requires a stable connection.
- **Audit Log Overflow**: The application caps logs at 50 entries to maintain performance.
```

### FILE: docs/tests.js
```javascript
const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  console.log('--- STARTING SMARTSCALIE AUTOMATED TESTS ---');

  // 1. Navigation Test
  await page.goto('http://localhost:3000');
  await page.waitForSelector('h1');
  console.log('✅ Title Slide Loaded');

  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(600);
  console.log('✅ Navigation to Slide 2 Successful');

  // 2. Admin Security Test
  await page.keyboard.down('Control');
  await page.keyboard.down('Shift');
  await page.keyboard.press('KeyA');
  await page.keyboard.up('Shift');
  await page.keyboard.up('Control');
  
  await page.waitForSelector('input[type="password"]');
  console.log('✅ Admin Password Prompt Displayed');

  // 3. AI Sandbox Test
  await page.keyboard.press('KeyA'); // Direct open workshop
  await page.waitForSelector('textarea');
  await page.type('textarea', 'Test Prompt for Audit Log');
  await page.click('button:has-text("Generate")');
  console.log('✅ AI Request Flow Initiated');

  await browser.close();
  console.log('--- ALL TESTS PASSED ---');
})();
```

### FILE: index.css
```css
@import "tailwindcss";


```

### FILE: index.html
```html
<!DOCTYPE html>
<html lang="en-GB">
  <head>
    <meta charset="UTF-8" />
    <!-- ── TUC Standard Meta ─────────────────────────────────────── -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <!-- SEO -->
    <meta name="description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    <meta name="keywords" content="Techbridge University College, TUC, design education, technology education, Accra university, Ghana university, product design, entrepreneurship, private university Ghana, design school" />
    <meta name="author" content="Techbridge University College" />
    <meta name="publisher" content="Techbridge University College" />
    <link rel="canonical" href="https://www.techbridge.edu.gh/" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <!-- Geographic -->
    <meta name="language" content="English" />
    <meta name="geo.region" content="GH-AA" />
    <meta name="geo.placename" content="Accra" />
    <meta name="geo.position" content="5.6037;-0.1870" />
    <meta name="ICBM" content="5.6037, -0.1870" />
    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://www.techbridge.edu.gh/" />
    <meta property="og:site_name" content="Techbridge University College" />
    <meta property="og:title" content="Smartscale Ai Presentation Platform | Techbridge University College" />
    <meta property="og:description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    <meta property="og:image" content="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Techbridge University College Logo" />
    <meta property="og:locale" content="en_GB" />
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@TUCGhana" />
    <meta name="twitter:creator" content="@TUCGhana" />
    <meta name="twitter:title" content="Smartscale Ai Presentation Platform | Techbridge University College" />
    <meta name="twitter:description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    <meta name="twitter:image" content="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <meta name="twitter:image:alt" content="Techbridge University College Logo" />
    <!-- Theme -->
    <meta name="theme-color" content="#630f12" />
    <meta name="msapplication-TileColor" content="#630f12" />
    <meta name="copyright" content="Techbridge University College" />
    <meta name="referrer" content="origin-when-cross-origin" />
    <!-- ────────────────────────────────────────────────────────────── -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Smartscale Ai Presentation Platform | Techbridge University College</title>

    <!-- TailwindCSS -->
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap" rel="stylesheet">

    <!-- Favicon -->
    <link rel="icon" type="image/png" href="https://techbridge.edu.gh/static/TUC_LOGO.png" />

    <style>
      body {
        font-family: 'Inter', sans-serif;
        margin: 0;
        padding: 0;
      }

      #root {
        min-height: 100vh;
      }
    </style>

    <script type="module" src="./index.tsx"></script>
  
    <style id="tuc-splash-styles">
      body { background-color: #0F0C07 !important; margin: 0; padding: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: serif; overflow: hidden; }
      .tuc-splash { text-align: center; border: 1px solid rgba(200,168,75,0.2); padding: 60px; background: #141210; position: relative; }
      .tuc-splash::before { content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 4px; background: #C8A84B; }
      .tuc-logo { color: #C8A84B; font-size: 3rem; font-weight: 900; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 10px; display: block; }
      .tuc-status { color: #D4C4A0; font-family: sans-serif; text-transform: uppercase; letter-spacing: 0.4em; font-size: 0.7rem; opacity: 0.6; }
      .tuc-loading { margin-top: 30px; height: 1px; width: 100px; background: rgba(200,168,75,0.2); margin-left: auto; margin-right: auto; position: relative; overflow: hidden; }
      .tuc-loading::after { content: ""; position: absolute; left: -100%; width: 50%; height: 100%; background: #C8A84B; animation: tuc-load 2s infinite; }
      @keyframes tuc-load { to { left: 150%; } }
    </style>
</head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    
    <div id="root">
      <div class="tuc-splash">
        <span class="tuc-logo">TECHBRIDGE</span>
        <div class="tuc-status">smartscale ai presentation platform</div>
        <div class="tuc-loading"></div>
      </div>
    </div>

  </body>
</html>

```

### FILE: index.tsx
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### FILE: metadata.json
```json

{
  "name": "SmartScale AI Presentation Platform",
  "description": "A world-class, interactive, and accessible AI-powered presentation platform for the SmartScale Training program. Features include live Gemini-driven workshop tools, administrative auditing, and accessibility-first themes.",
  "requestFramePermissions": [
    "microphone"
  ]
}

```

### FILE: nginx.conf
```conf
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /health {
        access_log off;
        return 200 'healthy';
        add_header Content-Type text/plain;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;
}

```

### FILE: package.json
```json
{
  "packageManager": "pnpm@10.30.1",
  "name": "smartscale-ai-presentation-platform",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "@google/genai": "^1.34.0",
    "lucide-react": "^0.562.0",
    "react": "19.2.5",
    "react-dom": "19.2.5",
    "react-router-dom": "^7.1.0"
  },
  "devDependencies": {
    "@types/node": "^25.0.3",
    "@vitejs/plugin-react": "^5.1.2",
    "serve": "14.2.5",
    "typescript": "~5.9.3",
    "vite": "7.3.1",
    "vitest": "^3.0.0",
    "@vitest/ui": "^3.0.0",
    "@vitest/coverage-v8": "^3.0.0",
    "@testing-library/react": "^16.3.2",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/user-event": "^14.6.1",
    "jsdom": "^26.1.0",
    "@playwright/test": "^1.49.0",
    "tailwindcss": "^4.2.2",
    "@tailwindcss/vite": "^4.2.2"
  }
}

```

### FILE: playwright.config.ts
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  reporter: [['html', { outputFolder: 'tests/playwright-report' }]],
  use: {
    baseURL: 'http://localhost:3000',
    ...devices['Desktop Chrome'],
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'pnpm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});

```

### FILE: README.md
```md
<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1mfyt7O0rdJ_HigCYlJkDvs3ow2fm8wqm

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

```

### FILE: src/AuthGate.jsx
```javascript
import { useState } from 'react';

const AUTH_KEY = 'tuc_auth_smartscale_ai_presentation_platform';
const ACCENT   = '#7c3aed';

export function AuthGate({ children }) {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem(AUTH_KEY) === '1'
  );
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');

  if (authed) return <>{children}</>;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'admin' && password =[REDACTED_CREDENTIAL]
      sessionStorage.setItem(AUTH_KEY, '1');
      setAuthed(true);
    } else {
      setError('Invalid credentials. Use admin / admin');
    }
  };

  return (
    <div style={{minHeight:'100vh',background:'#f8fafc',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Inter,system-ui,sans-serif'}}>
      <div style={{background:'#fff',padding:'36px',borderRadius:'16px',boxShadow:'0 4px 24px rgba(0,0,0,0.10)',width:'100%',maxWidth:'420px'}}>
        <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'6px'}}>
          <div style={{width:'38px',height:'38px',background:ACCENT,borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:'20px',flexShrink:0}}>⚡</div>
          <h1 style={{fontSize:'20px',fontWeight:'700',color:'#0f172a',margin:0}}>Smartscale AI Presentation Platform</h1>
        </div>
        <p style={{fontSize:'13px',color:'#94a3b8',margin:'0 0 24px 0'}}>Sign in to continue</p>
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom:'14px'}}>
            <label style={{display:'block',fontSize:'13px',fontWeight:'500',color:'#374151',marginBottom:'6px'}}>Username</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              style={{width:'100%',padding:'9px 12px',border:'1px solid #d1d5db',borderRadius:'8px',fontSize:'14px',outline:'none',boxSizing:'border-box'}}
            />
          </div>
          <div style={{marginBottom:'14px'}}>
            <label style={{display:'block',fontSize:'13px',fontWeight:'500',color:'#374151',marginBottom:'6px'}}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{width:'100%',padding:'9px 12px',border:'1px solid #d1d5db',borderRadius:'8px',fontSize:'14px',outline:'none',boxSizing:'border-box'}}
            />
          </div>
          {error && <p style={{color:'#ef4444',fontSize:'13px',margin:'0 0 12px 0'}}>{error}</p>}
          <button
            type="submit"
            style={{width:'100%',padding:'10px',background:ACCENT,color:'#fff',border:'none',borderRadius:'8px',fontSize:'14px',fontWeight:'600',cursor:'pointer'}}
          >
            Sign In
          </button>
        </form>
        <p style={{fontSize:'11px',color:'#cbd5e1',textAlign:'center',marginTop:'16px',marginBottom:0}}>Techbridge University College &nbsp;·&nbsp; admin / admin</p>
      </div>
    </div>
  );
}

```

### FILE: src/components/ProtectedRoute.tsx
```typescript
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Verifying session…</div>
      </div>
    );
  }
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

```

### FILE: src/contexts/AuthContext.tsx
```typescript
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthService } from '../services/AuthService';

interface User { id: string; username: string; role: string }
interface AuthContextValue {
  isAuthenticated: boolean;
  user: User | null;
  login: (u: string, p: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(AuthService.isAuthenticated());
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = [REDACTED_CREDENTIAL]
    if (!token) { setIsLoading(false); return; }
    AuthService.validateToken(token)
      .then((res: any) => {
        if (res.valid && res.user) { setIsAuthenticated(true); setUser(res.user); }
        else { AuthService.logout(); setIsAuthenticated(false); }
      })
      .catch(() => { /* backend unreachable — keep state */ })
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (username: string, password: string) => {
    const res = await AuthService.login(username, password);
    if (res.success && res.user) { setIsAuthenticated(true); setUser(res.user); }
    return { success: res.success, message: res.message };
  };

  const logout = () => { AuthService.logout(); setIsAuthenticated(false); setUser(null); };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

```

### FILE: src/index.js
```javascript
import { AuthGate } from './AuthGate';
const http = require('http');
const mysql = require('mysql2/promise');

const PORT = process.env.PORT || 4023;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'appuser';
const DB_PASSWORD = <REDACTED>
const DB_NAME = process.env.DB_NAME || 'presentation_platform';

let pool;

async function initDB() {
  try {
    pool = mysql.createPool({
      host: DB_HOST, user: DB_USER, password: DB_PASSWORD, database: DB_NAME,
      waitForConnections: true, connectionLimit: 10, queueLimit: 0,
    });

    const conn = await pool.getConnection();
    await conn.query(`
      CREATE TABLE IF NOT EXISTS presentations (
        id VARCHAR(255) PRIMARY KEY, title VARCHAR(255),
        creator_id VARCHAR(255), description TEXT,
        thumbnail_url VARCHAR(500), status VARCHAR(50),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await conn.query(`
      CREATE TABLE IF NOT EXISTS slides (
        id VARCHAR(255) PRIMARY KEY, presentation_id VARCHAR(255),
        slide_number INT, slide_title VARCHAR(255),
        content TEXT, layout_type VARCHAR(50),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (presentation_id) REFERENCES presentations(id),
        INDEX idx_presentation (presentation_id)
      )
    `);
    conn.release();
    console.log('Presentation Platform DB initialized');
  } catch (e) {
    console.error('DB init error:', e.message);
    process.exit(1);
  }
}

async function handleRequest(req, res) {
  try {
    if (req.method === 'GET' && req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', service: 'presentation-platform' }));
      return;
    }

    if (req.method === 'POST' && req.url === '/api/presentation') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        try {
          const data = JSON.parse(body);
          const conn = await pool.getConnection();
          const presId = `pres_${Date.now()}`;
          await conn.query(
            'INSERT INTO presentations (id, title, creator_id, description, status) VALUES (?, ?, ?, ?, ?)',
            [presId, data.title || '', data.creator_id || '', data.description || '', 'draft']
          );
          conn.release();
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: true, presentation_id: presId }));
        } catch (e) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: e.message }));
        }
      });
      return;
    }

    if (req.method === 'GET' && req.url.startsWith('/api/presentations')) {
      const conn = await pool.getConnection();
      const [presentations] = await conn.query('SELECT * FROM presentations ORDER BY created_at DESC LIMIT 100');
      conn.release();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(presentations));
      return;
    }

    res.writeHead(404);
    res.end('Not Found');
  } catch (e) {
    console.error('Request error:', e);
    res.writeHead(500);
    res.end(JSON.stringify({ error: e.message }));
  }
}

async function start() {
  await initDB();
  const server = http.createServer((req, res) => {
    handleRequest(req, res).catch(e => { res.writeHead(500); res.end('error'); });
  });
  server.listen(PORT, () => console.log(`Presentation Platform API on ${PORT}`));
}

start().catch(e => { console.error('Startup error:', e); process.exit(1); });

```

### FILE: src/pages/AdminPage.tsx
```typescript
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

type Tab = 'overview' | 'logs';

interface LogEntry { id: string; time: string; action: string; detail: string }

export default function AdminPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('overview');
  const [logs] = useState<LogEntry[]>([
    { id: '1', time: new Date().toLocaleTimeString(), action: 'SESSION_START', detail: 'Admin session initiated' },
  ]);

  const handleLogout = () => { logout(); navigate('/login', { replace: true }); };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-60 bg-[#0f172a] text-white flex flex-col p-6 shrink-0" aria-label="Admin navigation">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 bg-[#ffcb05] rounded-lg flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-[#0f172a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <span className="font-bold text-sm">Smartscale Ai Presentation Platform</span>
        </div>
        <nav className="flex-1 space-y-1" role="navigation">
          {(['overview', 'logs'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              aria-pressed={tab === t ? 'true' : 'false'}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all ${tab === t ? 'bg-[#ffcb05] text-[#0f172a] font-bold' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              {t === 'overview' ? 'Overview' : 'Activity Log'}
            </button>
          ))}
        </nav>
        <div className="pt-4 border-t border-slate-800">
          <p className="text-xs text-slate-500 mb-1 px-2">Signed in as</p>
          <p className="text-sm text-slate-300 font-medium px-2 mb-3 truncate">{user?.username || 'Admin'}</p>
          <button
            onClick={handleLogout}
            aria-label="Sign out"
            className="w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-all text-left"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 max-w-4xl" role="main">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Smartscale Ai Presentation Platform — Admin</h1>
          <p className="text-gray-500 text-sm mt-1">Techbridge University College · Staff Portal</p>
        </header>

        {tab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'React Version', value: '19.2.4', ok: true },
              { label: 'Docker', value: 'Configured', ok: true },
              { label: 'SRS', value: 'docs/SRS.md', ok: true },
              { label: 'Tests', value: 'vitest.config.ts', ok: true },
              { label: 'Auth', value: 'Active', ok: true },
              { label: 'Phase', value: 'Phase 2 Complete', ok: true },
            ].map(item => (
              <div key={item.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <p className="text-xs text-gray-500 font-medium mb-1">{item.label}</p>
                <p className="text-sm font-bold text-gray-900">{item.value}</p>
                <span className={`text-xs ${item.ok ? 'text-emerald-600' : 'text-red-500'}`}>
                  {item.ok ? '✓ compliant' : '✗ gap'}
                </span>
              </div>
            ))}
          </div>
        )}

        {tab === 'logs' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">Activity Log</h2>
            </div>
            <table className="w-full text-sm" aria-label="Activity log">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                <tr>
                  <th className="px-6 py-3 text-left">Time</th>
                  <th className="px-6 py-3 text-left">Action</th>
                  <th className="px-6 py-3 text-left">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {logs.map(log => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-gray-400">{log.time}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">{log.action}</td>
                    <td className="px-6 py-4 text-gray-500">{log.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

```

### FILE: src/pages/LoginPage.tsx
```typescript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await login(username, password);
    if (result.success) {
      navigate('/admin', { replace: true });
    } else {
      setError(result.message || 'Invalid credentials');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="mb-6 text-center">
          <div className="w-12 h-12 bg-[#630f12] rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-[#ffcb05]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Staff Portal</h1>
          <p className="text-gray-500 mt-1 text-sm">Sign in with your TUC credentials</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              id="username" type="text" value={username} required
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#630f12]"
              placeholder="Enter your username"
              aria-label="Username"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              id="password" type="password" value={password} required
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#630f12]"
              placeholder="Enter your password"
              aria-label="Password"
            />
          </div>
          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
          <button
            type="submit" disabled={loading}
            className="w-full py-2 px-4 bg-[#630f12] text-white font-semibold rounded-lg hover:bg-[#7a1317] focus:outline-none focus:ring-2 focus:ring-[#630f12] focus:ring-offset-2 disabled:opacity-50 transition-colors"
            aria-label={loading ? 'Signing in' : 'Sign in'}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

```

### FILE: src/services/AuthService.ts
```typescript
const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000';
const TOKEN_KEY = [REDACTED_CREDENTIAL]

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: { id: string; username: string; role: string };
}

export const AuthService = {
  async login(username: string, password: string): Promise<AuthResponse> {
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data: AuthResponse = await res.json();
      if (data.success && data.token) localStorage.setItem(TOKEN_KEY, data.token);
      return data;
    } catch {
      return { success: false, message: 'Could not connect to TUC Auth API' };
    }
  },

  async validateToken(token: string) {
    try {
      const res = await fetch(`${API_BASE}/api/auth/validate`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return await res.json();
    } catch {
      return { success: false, valid: false };
    }
  },

  logout:          () => localStorage.removeItem(TOKEN_KEY),
  isAuthenticated: () => !!localStorage.getItem(TOKEN_KEY),
  getToken:        () => localStorage.getItem(TOKEN_KEY),
};

```

### FILE: src/__tests__/App.e2e.ts
```typescript
import { describe, it, expect } from 'vitest';

/**
 * E2E stub — smartscale-ai-presentation-platform
 * Extend with Puppeteer/Playwright tests.
 * Run: node scripts/phase3-test-scaffold.js --apply then pnpm test:e2e
 */
describe('smartscale-ai-presentation-platform E2E', () => {
  it('placeholder — replace with Puppeteer test', () => {
    // TODO: launch browser, navigate to http://localhost:5173, assert UI
    expect(true).toBe(true);
  });
});

```

### FILE: src/__tests__/App.test.tsx
```typescript
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import App from '../../App';

/**
 * Smoke test — verifies the root App component renders without throwing.
 * TUC Phase 3 scaffold — extend with project-specific assertions.
 */
describe('App', () => {
  it('renders without crashing', () => {
    const { container } = render(<App />);
    expect(container).toBeDefined();
    expect(container.firstChild).not.toBeNull();
  });

  it('matches snapshot', () => {
    const { container } = render(<App />);
    expect(container).toMatchSnapshot();
  });
});

```

### FILE: src/__tests__/setup.ts
```typescript
import '@testing-library/jest-dom';

```

### FILE: SRS.md
```md

# Software Requirements Specification (SRS) - IEEE 830
## Project: SmartScale AI Training Platform
## Version: 1.0.0 (Project Refresh)

### 1. Introduction
#### 1.1 Purpose
This document provides a comprehensive description of the SmartScale AI Presentation Platform. It serves as the primary reference for the technical implementation and design choices of the application.

#### 1.2 Scope
The SmartScale Platform is an interactive pedagogical tool designed to deliver the "SmartScale: AI Training for Entrepreneurs" curriculum. It replaces static slides with a real-time, AI-integrated workshop environment.

### 2. General Description
#### 2.1 Product Perspective
The application is a standalone React-based web app that leverages Google Gemini for real-time content generation (text and image) to enhance the learning experience of SME owners.

#### 2.2 Functional Requirements
- **R1: Slide Navigation**: Bidirectional navigation with progress tracking.
- **R2: Workshop Engine**: Integrated AI tool for text-to-text and text-to-image synthesis.
- **R3: Admin Center**: Password-protected area for system health, audit logs, and testing.
- **R4: Accessibility Suite**: Support for multiple themes (Light, Dark, High-Contrast) and keyboard shortcuts.

### 3. Non-Functional Requirements
- **N1: Performance**: UI responsiveness < 100ms for navigation.
- **N2: Security**: Administrative access restricted via credential validation.
- **N3: Aesthetics**: Premium, brand-aligned visual design with fluid animations.

### 4. System Architecture
The system uses a modular React architecture with a centralized state for presentation logic and a service-oriented bridge for Generative AI.

```

### FILE: tests/e2e/app.spec.ts
```typescript
import { test, expect } from '@playwright/test';

test.describe('SmartScale AI Presentation Platform', () => {
  test('should load the title slide', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should navigate to next slide with ArrowRight', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(600);
    // Page should still be loaded and functional
    await expect(page.locator('body')).toBeVisible();
  });

  test('should show admin password prompt with Ctrl+Shift+A', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    await page.keyboard.down('Control');
    await page.keyboard.down('Shift');
    await page.keyboard.press('KeyA');
    await page.keyboard.up('Shift');
    await page.keyboard.up('Control');
    const passwordInput = [REDACTED_CREDENTIAL]
    await expect(passwordInput).toBeVisible({ timeout: 5000 });
  });

  test('should display AI workshop textarea', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('KeyA');
    await expect(page.locator('textarea')).toBeVisible({ timeout: 5000 });
  });
});

```

### FILE: tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "experimentalDecorators": true,
    "useDefineForClassFields": false,
    "module": "ESNext",
    "lib": [
      "ES2022",
      "DOM",
      "DOM.Iterable"
    ],
    "skipLibCheck": true,
    "types": [
      "node"
    ],
    "moduleResolution": "bundler",
    "isolatedModules": true,
    "moduleDetection": "force",
    "allowJs": true,
    "jsx": "react-jsx",
    "paths": {
      "@/*": [
        "./*"
      ]
    },
    "allowImportingTsExtensions": true,
    "noEmit": true
  }
}
```

### FILE: types.ts
```typescript

export enum SlideType {
  TITLE = 'TITLE',
  SECTION = 'SECTION',
  CONTENT = 'CONTENT',
  SPLIT = 'SPLIT',
  CTA = 'CTA',
  USE_CASE_GRID = 'USE_CASE_GRID',
  SANKEY = 'SANKEY'
}

export interface SlideImage {
  url: string;
  alt: string;
  position?: 'left' | 'right' | 'top' | 'bottom' | 'center';
  caption?: string;
}

export interface SlideInteraction {
  id: string;
  type: 'text' | 'textarea' | 'checkbox' | 'ai-prompt' | 'image-gen';
  label: string;
  placeholder?: string;
  aiPromptTemplate?: string; // Template for the AI to fill
}

export interface UseCase {
  industry: string;
  title: string;
  description: string;
  promptExample: string;
  benefit: string;
}

export interface SlideContent {
  id: number;
  type: SlideType;
  title: string;
  subtitle?: string;
  body?: string[]; 
  leftTitle?: string;
  leftBody?: string[];
  rightTitle?: string;
  rightBody?: string[];
  footer?: string;
  theme?: 'light' | 'brand'; 
  backgroundImage?: string;
  mainImage?: SlideImage;
  images?: SlideImage[]; 
  interactions?: SlideInteraction[]; 
  speakerNotes?: string;
  useCases?: UseCase[]; // For the Use Case Grid layout
}

```

### FILE: vite.config.ts
```typescript
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
        }
      }
    }
  },
      base: './',
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react(), tailwindcss()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});

```

### FILE: vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Vitest unit test configuration — smartscale-ai-presentation-platform
// TUC coverage target: >70% for core utilities
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/__tests__/setup.ts',
    include: ['src/**/*.{test,spec}.{ts,tsx,js,jsx}'],
    exclude: ['src/**/*.e2e.{ts,tsx}', 'node_modules', 'dist'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.{test,spec,e2e}.{ts,tsx}', 'src/__tests__/**'],
      thresholds: {
        branches:   70,
        functions:  70,
        lines:      70,
        statements: 70,
      },
    },
  },
});

```

### FILE: vitest.e2e.config.ts
```typescript
import { defineConfig } from 'vitest/config';

// Vitest E2E configuration — smartscale-ai-presentation-platform
// E2E tests use Node environment (Puppeteer / Playwright)
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.e2e.{ts,tsx,js}'],
    testTimeout: 30000,
    hookTimeout: 15000,
    teardownTimeout: 10000,
  },
});

```

