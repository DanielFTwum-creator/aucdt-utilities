import React, { useState } from 'react';
import { compareCartoons } from '../services/geminiService';
import { CartoonPairAnalysis, CompareFormData } from '../types';
import { saveToLibrary, appendAuditLog, generateId } from '../utils/storage';
import { SpinnerIcon, SaveIcon, CompareIcon } from './icons';
import JsonDisplay from './JsonDisplay';
import ImageUpload from './ImageUpload';

const CompareTab: React.FC = () => {
  const [form, setForm] = useState<CompareFormData>({
    cartoon_a_title: '', cartoon_a_origin: '', cartoon_a_description: '',
    cartoon_b_title: '', cartoon_b_origin: '', cartoon_b_description: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CartoonPairAnalysis | null>(null);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.cartoon_a_title || !form.cartoon_b_title) {
      setError('Please provide titles for both cartoons.');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);
    setSaved(false);
    try {
      const comparison = await compareCartoons(form);
      setResult(comparison);
      appendAuditLog('COMPARE', `A: ${form.cartoon_a_title} | B: ${form.cartoon_b_title}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Comparison failed.');
      appendAuditLog('COMPARE_ERROR', String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!result) return;
    saveToLibrary({
      id: generateId(),
      type: 'comparison',
      title: `${form.cartoon_a_title} vs ${form.cartoon_b_title}`,
      created_at: new Date().toISOString(),
      data: result,
    });
    setSaved(true);
    appendAuditLog('SAVE_COMPARE', `${form.cartoon_a_title} vs ${form.cartoon_b_title}`);
  };

  const cpa = result?.cartoon_pair_analysis;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-amber-300 mb-2">Comparative Analysis</h2>
        <p className="text-purple-300 text-sm">Compare two Afrofuturism cartoons using Template 2 — cross-cultural insights and representation mapping</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cartoon A */}
          <CartoonInputPanel
            label="Cartoon A"
            colour="amber"
            titleValue={form.cartoon_a_title}
            originValue={form.cartoon_a_origin}
            descValue={form.cartoon_a_description}
            imageValue={form.cartoon_a_image}
            onTitle={v => setForm(f => ({ ...f, cartoon_a_title: v }))}
            onOrigin={v => setForm(f => ({ ...f, cartoon_a_origin: v }))}
            onDesc={v => setForm(f => ({ ...f, cartoon_a_description: v }))}
            onImage={(b64, mime) => setForm(f => ({ ...f, cartoon_a_image: b64, cartoon_a_imageMimeType: mime }))}
            onClearImage={() => setForm(f => ({ ...f, cartoon_a_image: undefined, cartoon_a_imageMimeType: undefined }))}
          />
          {/* Cartoon B */}
          <CartoonInputPanel
            label="Cartoon B"
            colour="teal"
            titleValue={form.cartoon_b_title}
            originValue={form.cartoon_b_origin}
            descValue={form.cartoon_b_description}
            imageValue={form.cartoon_b_image}
            onTitle={v => setForm(f => ({ ...f, cartoon_b_title: v }))}
            onOrigin={v => setForm(f => ({ ...f, cartoon_b_origin: v }))}
            onDesc={v => setForm(f => ({ ...f, cartoon_b_description: v }))}
            onImage={(b64, mime) => setForm(f => ({ ...f, cartoon_b_image: b64, cartoon_b_imageMimeType: mime }))}
            onClearImage={() => setForm(f => ({ ...f, cartoon_b_image: undefined, cartoon_b_imageMimeType: undefined }))}
          />
        </div>
        {error && (
          <div role="alert" className="rounded-xl border border-red-700/50 bg-red-950/30 px-4 py-3 text-sm text-red-300">{error}</div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-teal-600 hover:from-amber-500 hover:to-teal-500 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {loading ? <SpinnerIcon /> : <CompareIcon />}
          {loading ? 'Comparing…' : 'Compare Cartoons'}
        </button>
      </form>

      {cpa && result && (
        <div className="space-y-6 animate-fade-in border-t border-purple-800/30 pt-6">
          <h3 className="text-xl font-bold text-amber-300">
            {cpa.cartoon_a.title} <span className="text-purple-500">vs</span> {cpa.cartoon_b.title}
          </h3>

          {/* Similarities & Differences grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <CompareSection label="Similarities" data={cpa.similarities} colour="emerald" icon="≈" />
            <CompareSection label="Differences" data={cpa.differences} colour="rose" icon="≠" />
          </div>

          {/* Cross-cultural insights */}
          <div className="rounded-xl border border-amber-800/30 bg-amber-950/10 p-5">
            <h4 className="text-sm font-semibold text-amber-300 mb-3 uppercase tracking-wider">Cross-Cultural Insights</h4>
            <p className="text-sm text-purple-200 leading-relaxed">{cpa.cross_cultural_insights}</p>
          </div>

          <div className="rounded-xl border border-purple-800/30 bg-purple-950/10 p-5">
            <h4 className="text-sm font-semibold text-purple-300 mb-3 uppercase tracking-wider">Representation Comparison</h4>
            <p className="text-sm text-purple-200 leading-relaxed">{cpa.representation_comparison}</p>
          </div>

          {result.narrative_analysis && (
            <div className="rounded-xl border border-teal-800/30 bg-teal-950/10 p-5">
              <h4 className="text-sm font-semibold text-teal-300 mb-3 uppercase tracking-wider">Narrative Analysis</h4>
              <p className="text-sm text-purple-200 leading-relaxed">{result.narrative_analysis}</p>
            </div>
          )}

          <JsonDisplay data={result} title="Template 2: Comparative Analysis (JSON)" />

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saved}
              className="flex items-center gap-2 px-4 py-2 text-sm border border-purple-600/50 text-purple-300 hover:text-purple-100 hover:border-purple-500 rounded-xl transition-colors disabled:opacity-60"
            >
              <SaveIcon />
              {saved ? 'Saved' : 'Save to Library'}
            </button>
            {saved && <span className="text-xs text-emerald-400">✓ Saved</span>}
          </div>
        </div>
      )}
    </div>
  );
};

interface PanelProps {
  label: string; colour: 'amber' | 'teal';
  titleValue: string; originValue: string; descValue: string; imageValue?: string;
  onTitle: (v: string) => void; onOrigin: (v: string) => void; onDesc: (v: string) => void;
  onImage: (b64: string, mime: string) => void; onClearImage: () => void;
}

const CartoonInputPanel: React.FC<PanelProps> = ({ label, colour, titleValue, originValue, descValue, imageValue, onTitle, onOrigin, onDesc, onImage, onClearImage }) => {
  const borderCls = colour === 'amber' ? 'border-amber-700/30' : 'border-teal-700/30';
  const headingCls = colour === 'amber' ? 'text-amber-300' : 'text-teal-300';
  return (
    <div className={`rounded-xl border ${borderCls} bg-black/20 p-5 space-y-4`}>
      <h3 className={`text-sm font-bold uppercase tracking-wider ${headingCls}`}>{label}</h3>
      <input type="text" value={titleValue} onChange={e => onTitle(e.target.value)} placeholder="Title" required
        className="w-full bg-black/40 border border-purple-700/50 rounded-xl px-4 py-2.5 text-sm text-purple-100 placeholder-purple-600 focus:outline-none focus:border-amber-500/70 transition-colors" />
      <input type="text" value={originValue} onChange={e => onOrigin(e.target.value)} placeholder="Cultural Origin (e.g. West African)"
        className="w-full bg-black/40 border border-purple-700/50 rounded-xl px-4 py-2.5 text-sm text-purple-100 placeholder-purple-600 focus:outline-none focus:border-amber-500/70 transition-colors" />
      <textarea value={descValue} onChange={e => onDesc(e.target.value)} placeholder="Description / visual context..." rows={3}
        className="w-full bg-black/40 border border-purple-700/50 rounded-xl px-4 py-2.5 text-sm text-purple-100 placeholder-purple-600 focus:outline-none focus:border-amber-500/70 resize-none transition-colors" />
      <ImageUpload label="Upload Image (optional)" preview={imageValue} onImage={onImage} onClear={onClearImage} />
    </div>
  );
};

const CompareSection: React.FC<{
  label: string;
  data: { visual: string[]; thematic: string[]; cultural: string[] };
  colour: 'emerald' | 'rose';
  icon: string;
}> = ({ label, data, colour, icon }) => {
  const borderCls = colour === 'emerald' ? 'border-emerald-800/30' : 'border-rose-800/30';
  const bgCls = colour === 'emerald' ? 'bg-emerald-950/10' : 'bg-rose-950/10';
  const headingCls = colour === 'emerald' ? 'text-emerald-300' : 'text-rose-300';
  const tagCls = colour === 'emerald' ? 'bg-emerald-900/30 text-emerald-300 border-emerald-800/40' : 'bg-rose-900/30 text-rose-300 border-rose-800/40';
  return (
    <div className={`rounded-xl border ${borderCls} ${bgCls} p-5 space-y-4`}>
      <h4 className={`text-sm font-semibold uppercase tracking-wider ${headingCls}`}>{icon} {label}</h4>
      {(['visual', 'thematic', 'cultural'] as const).map(cat => (
        <div key={cat}>
          <p className="text-xs text-purple-400 mb-1.5 capitalize">{cat}</p>
          <div className="flex flex-wrap gap-1.5">
            {data[cat].map((item, i) => (
              <span key={i} className={`text-xs px-2 py-0.5 rounded-full border ${tagCls}`}>{item}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CompareTab;
