import React, { useState, useRef, useEffect } from 'react';
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
      // AI calls run server-side via the WMS Gemini relay (Pattern 11);
      // this bundle holds no key and no SDK.
      const API_BASE = window.location.pathname.startsWith('/smartscale-ai-presentation-platform')
        ? '/smartscale-ai-presentation-platform/api'
        : '/api';
      const callGemini = async (model: string, body: unknown) => {
        const r = await fetch(`${API_BASE}/gemini/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ model, body }),
        });
        if (!r.ok) throw new Error(`AI request failed: ${r.status}`);
        return (await r.json()) as {
          candidates?: Array<{ content?: { parts?: Array<{ text?: string; inlineData?: { data?: string } }> } }>;
        };
      };

      if (currentMode === 'text') {
        const response = await callGemini('gemini-3-flash-preview', {
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          systemInstruction: { parts: [{ text: "You are a specialized AI business consultant for West African SMEs. Provide practical, concise, and highly relevant business advice, scripts, or plans." }] },
        });
        const text = (response.candidates?.[0]?.content?.parts ?? []).map(p => p.text ?? '').join('');
        setResultText(text || 'No response generated.');
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

        const response = await callGemini('gemini-2.5-flash-image', {
          contents: [{ role: 'user', parts: [{ text: finalPrompt }] }],
          generationConfig: {
            imageConfig: {
              aspectRatio: aspectRatio,
            },
          },
        });

        const part = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
        if (part?.inlineData) {
          setResultImage(`data:image/png;base64,${part.inlineData.data}`);
        } else {
          throw new Error("No image data found in response. Try a different prompt.");
        }
      }
    } catch (err: any) {
      console.error("AI Generation Error:", err);
      setError(err.message || "An error occurred during generation. Please check your connection and try again.");
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
