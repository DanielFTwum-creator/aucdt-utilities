import { useState, useRef, useEffect } from 'react';
import { Play, Sparkles, AlertTriangle, ArrowRight, CornerDownRight, Copy, Check, Save, RotateCcw, MessageSquare, Info } from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';
import { SavedArtefact } from '../types';

interface ExercisePlaygroundProps {
  key?: any;
  id: string;
  title: string;
  subtitle: string;
  description: string;
  defaultPrompt: string;
  placeholders?: { label: string; fieldName: string; defaultVal: string; placeholder?: string; description?: string }[];
  category: 'outline' | 'quiz' | 'rubric' | 'slides' | 'feedback' | 'polish' | 'analysis' | 'custom';
  onSaveArtefact?: (artefact: SavedArtefact) => void;
  teachingPoint?: string;
  followUpSuggestions?: string[];
}

export default function ExercisePlayground({
  id,
  title,
  subtitle,
  description,
  defaultPrompt,
  placeholders = [],
  category,
  onSaveArtefact,
  teachingPoint,
  followUpSuggestions = [],
}: ExercisePlaygroundProps) {
  // Setup local values for placeholders
  const [fields, setFields] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    placeholders.forEach((p) => {
      initial[p.fieldName] = p.defaultVal;
    });
    return initial;
  });

  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [response, setResponse] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  
  // Follow-up chat states
  const [followUpText, setFollowUpText] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'model'; text: string }[]>([]);
  const [isRefining, setIsRefining] = useState(false);

  const responseEndRef = useRef<HTMLDivElement>(null);

  // Re-generate computed prompt text based on custom fields
  const getComputedPrompt = () => {
    let result = defaultPrompt;
    Object.entries(fields).forEach(([key, val]) => {
      // replace all instances of [key]
      const regex = new RegExp(`\\[${key}\\]`, 'g');
      result = result.replace(regex, (val as string) || `[${key}]`);
    });
    return result;
  };

  // Sync computed prompt to customPrompt text area initially or when fields change
  useEffect(() => {
    setCustomPrompt(getComputedPrompt());
  }, [fields, defaultPrompt]);

  const handleFieldChange = (fieldName: string, value: string) => {
    setFields((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleRunPrompt = async () => {
    setIsGenerating(true);
    setError('');
    setSaved(false);
    
    try {
      const res = await fetch(`${import.meta.env.BASE_URL}api/gemini/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: customPrompt,
          systemInstruction: "You are a professional educational consultant specializing in Ghanaian higher education. Provide response strictly formatted in beautiful Markdown."
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setResponse(data.text);
        setChatHistory([
          { role: 'user', text: customPrompt },
          { role: 'model', text: data.text }
        ]);
      } else {
        setError(data.error || 'Failed to generate response. Check your API configuration.');
      }
    } catch (err: any) {
      setError(err.message || 'Network error connecting to Express server.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFollowUpRefine = async (textToSend?: string) => {
    const query = textToSend || followUpText;
    if (!query.trim()) return;

    setIsRefining(true);
    setError('');
    setSaved(false);

    const updatedHistory = [...chatHistory, { role: 'user' as const, text: query }];
    setChatHistory(updatedHistory);
    if (!textToSend) setFollowUpText('');

    try {
      // Compile entire history as prompt or send historical context
      const fullPromptContext = updatedHistory.map(item => `${item.role === 'user' ? 'Lecturer Prompt' : 'AI Assistant Output'}:\n${item.text}`).join('\n\n') + '\n\nGenerate the next improved version reflecting the command: ' + query;

      const res = await fetch(`${import.meta.env.BASE_URL}api/gemini/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: fullPromptContext,
          systemInstruction: "You are editing the previous output based on the user's instructions. Provide the updated complete educational content, formatted cleanly in Markdown."
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setResponse(data.text);
        setChatHistory([...updatedHistory, { role: 'model' as const, text: data.text }]);
      } else {
        setError(data.error || 'Failed to refine response.');
      }
    } catch (err: any) {
      setError(err.message || 'Network error during follow-up query.');
    } finally {
      setIsRefining(false);
    }
  };

  const handleSave = () => {
    if (!response || !onSaveArtefact) return;
    
    const titleFromCategory = fields.COURSE 
      ? `${fields.COURSE} ${category.toUpperCase()}`
      : fields.TOPIC 
        ? `${fields.TOPIC} ${category.toUpperCase()}`
        : `${title} Output`;

    onSaveArtefact({
      id: `${id}-${Date.now()}`,
      title: titleFromCategory,
      type: category === 'custom' ? 'custom' : category,
      content: response,
      createdAt: new Date().toLocaleString(),
    });
    setSaved(true);
  };

  const copyResponse = () => {
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    const initial: Record<string, string> = {};
    placeholders.forEach((p) => {
      initial[p.fieldName] = p.defaultVal;
    });
    setFields(initial);
    setCustomPrompt(defaultPrompt);
    setResponse('');
    setError('');
    setChatHistory([]);
    setSaved(false);
  };

  return (
    <div className="bg-white border border-editorial-border rounded-2xl p-5 sm:p-7 space-y-6">
      {/* Exercise Subtitle Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-editorial-secondary border border-editorial-border text-editorial-accent text-[10.5px] font-bold uppercase tracking-widest font-sans">
            ✍ Interactive Workspace
          </div>
          <h4 className="text-base font-bold text-editorial-accent font-serif">{title}</h4>
          <p className="text-xs text-editorial-text-medium leading-relaxed font-sans">{description}</p>
        </div>
        <button 
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-editorial-border hover:border-editorial-text-muted hover:bg-editorial-secondary text-editorial-text-medium rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer self-start"
        >
          <RotateCcw size={12} />
          Reset
        </button>
      </div>

      {/* Input controls form */}
      {placeholders.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-editorial-secondary/30 border border-editorial-border rounded-xl p-4 sm:p-5 shadow-sm">
          {placeholders.map((p) => (
            <div key={p.fieldName} className="space-y-1.5">
              <label className="block text-xs font-bold text-editorial-accent font-serif uppercase tracking-wider">
                {p.label}
              </label>
              {p.fieldName === 'ASSIGNMENT' || p.fieldName === 'PASTE' || p.fieldName === 'PASTE_ROUGH_NOTES' ? (
                <textarea
                  rows={3}
                  value={fields[p.fieldName] || ''}
                  onChange={(e) => handleFieldChange(p.fieldName, e.target.value)}
                  className="w-full text-xs font-sans rounded-lg border border-editorial-border bg-white px-3 py-2 focus:ring-2 focus:ring-editorial-accent/10 focus:border-editorial-accent outline-none text-editorial-text-dark transition-all"
                  placeholder={p.placeholder}
                />
              ) : (
                <input
                  type="text"
                  value={fields[p.fieldName] || ''}
                  onChange={(e) => handleFieldChange(p.fieldName, e.target.value)}
                  className="w-full text-xs font-sans rounded-lg border border-editorial-border bg-white px-3 py-2.5 focus:ring-2 focus:ring-editorial-accent/10 focus:border-editorial-accent outline-none text-editorial-text-dark transition-all"
                  placeholder={p.placeholder}
                />
              )}
              {p.description && (
                <p className="text-[10px] text-editorial-text-light font-sans">{p.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Compiled Prompt Editor */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-editorial-accent font-serif tracking-wider uppercase">
            COMPILE COMPANION PROMPT:
          </label>
          <span className="text-[10px] text-editorial-text-muted font-sans italic">You can edit this prompt directly below</span>
        </div>
        <textarea
          rows={4}
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          className="w-full text-xs font-mono rounded-xl border border-editorial-border p-4 focus:ring-2 focus:ring-editorial-accent/10 focus:border-editorial-accent outline-none transition-all bg-[#1e1d1a] text-[#f2efe9] leading-relaxed shadow-inner"
        />
      </div>

      {/* Run Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-1 border-t border-editorial-border/60">
        <p className="text-xs text-editorial-text-light leading-normal max-w-sm font-sans">
          Uses <strong className="text-editorial-accent font-medium">Gemini 3.5 Flash</strong>. Outputs are fully aligned with TUC guidelines and local Ghanaian academic standards.
        </p>
        <button
          onClick={handleRunPrompt}
          disabled={isGenerating || !customPrompt.trim()}
          className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold uppercase tracking-wider text-white shadow-sm transition-all ${
            isGenerating || !customPrompt.trim()
              ? 'bg-editorial-border text-editorial-text-muted cursor-not-allowed shadow-none'
              : 'bg-[#002147] hover:bg-[#003166] hover:shadow-md cursor-pointer'
          }`}
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Analyzing & Structuring...</span>
            </>
          ) : (
            <>
              <Play size={15} fill="currentColor" />
              <span>Run Prompt in AI</span>
            </>
          )}
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl bg-[#FFF9E6] border border-[#FFE69C] text-xs text-[#664D03] font-sans leading-relaxed flex items-start gap-2.5">
          <AlertTriangle size={16} className="text-[#B06000] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="font-semibold block text-[#664D03]">Workspace Warning:</strong>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Generated Response Dashboard */}
      {response && (
        <div className="bg-white border border-editorial-border rounded-xl overflow-hidden shadow-sm space-y-6">
          {/* Section Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-editorial-border bg-editorial-secondary/50">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-editorial-accent/10 text-editorial-accent">
                <Sparkles size={14} />
              </span>
              <h5 className="text-xs font-bold text-editorial-accent font-serif uppercase tracking-wider">AI Generated Artefact</h5>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={copyResponse}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-editorial-border rounded-lg text-xs font-semibold uppercase tracking-wider text-editorial-text-medium hover:bg-editorial-secondary bg-white transition-colors cursor-pointer"
                title="Copy markdown text"
              >
                {copied ? (
                  <>
                    <Check size={12} className="text-[#137333]" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    <span>Copy Text</span>
                  </>
                )}
              </button>

              {onSaveArtefact && (
                <button
                  onClick={handleSave}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                    saved 
                      ? 'bg-[#E6F4EA] border-[#B7E1CD] text-[#137333]' 
                      : 'border-editorial-border text-editorial-text-medium hover:bg-editorial-secondary bg-white'
                  }`}
                >
                  <Save size={12} />
                  <span>{saved ? 'Saved' : 'Save'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Actual text body */}
          <div className="px-6 py-1 overflow-y-auto max-h-[500px]">
            <MarkdownRenderer content={response} />
            <div ref={responseEndRef} />
          </div>

          {/* Interactive Follow-Up Habit Trainer */}
          <div className="border-t border-editorial-border px-6 py-5 bg-editorial-secondary/30 space-y-4">
            <div className="flex items-start gap-2.5">
              <Info size={16} className="text-editorial-accent shrink-0 mt-0.5" />
              <div className="space-y-1">
                <strong className="text-xs font-bold text-editorial-accent font-serif uppercase tracking-wider block">
                  Interactive Exercise 1.2 — The Follow-Up Habit
                </strong>
                <p className="text-xs text-editorial-text-medium leading-normal font-sans">
                  The first output is just a draft, not the final answer. Master the habit of iterating with AI instead of restarting. Use conversational follow-up commands to polish your syllabus, change criteria weights, or add quiz questions.
                </p>
              </div>
            </div>

            {/* Suggestions buttons */}
            {followUpSuggestions.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {followUpSuggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    disabled={isRefining}
                    onClick={() => handleFollowUpRefine(suggestion)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-editorial-border hover:border-editorial-accent text-xs font-sans text-editorial-text-medium hover:text-editorial-accent transition-colors shadow-sm cursor-pointer"
                  >
                    <CornerDownRight size={10} className="text-editorial-accent" />
                    <span>"{suggestion}"</span>
                  </button>
                ))}
              </div>
            )}

            {/* Chat prompt input */}
            <div className="flex gap-2 items-center">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={followUpText}
                  onChange={(e) => setFollowUpText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleFollowUpRefine()}
                  placeholder='Instruct AI to iterate (e.g., "Add one question that tests application, not recall")'
                  disabled={isRefining}
                  className="w-full text-xs font-sans rounded-lg border border-editorial-border pl-10 pr-4 py-3 focus:ring-2 focus:ring-editorial-accent/10 focus:border-editorial-accent outline-none text-editorial-text-dark transition-all bg-white"
                />
                <MessageSquare size={14} className="absolute left-3.5 top-3.5 text-editorial-text-light" />
              </div>
              <button
                onClick={() => handleFollowUpRefine()}
                disabled={isRefining || !followUpText.trim()}
                className={`px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-wider text-white transition-colors shrink-0 cursor-pointer ${
                  isRefining || !followUpText.trim()
                    ? 'bg-editorial-border text-editorial-text-muted cursor-not-allowed'
                    : 'bg-editorial-accent hover:bg-editorial-accent/90'
                }`}
              >
                {isRefining ? 'Iterating...' : 'Refine'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Standard text teaching point block */}
      {teachingPoint && !response && (
        <div className="p-4 rounded-xl bg-[#FFF9E6] border border-[#FFE69C] text-[#664D03] flex items-start gap-2.5">
          <Info size={16} className="text-[#B06000] shrink-0 mt-0.5" />
          <p className="text-xs leading-normal font-sans">
            <strong className="font-bold">Teaching Point:</strong> {teachingPoint}
          </p>
        </div>
      )}
    </div>
  );
}
