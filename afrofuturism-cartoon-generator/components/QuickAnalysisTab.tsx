import React, { useState } from 'react';
import { quickAnalyse } from '../services/geminiService';
import { QuickAnalysis } from '../types';
import { saveToLibrary, appendAuditLog, generateId } from '../utils/storage';
import { SpinnerIcon, SaveIcon, StarIcon } from './icons';
import JsonDisplay from './JsonDisplay';
import ImageUpload from './ImageUpload';

const QuickAnalysisTab: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | undefined>();
  const [imageMimeType, setImageMimeType] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<QuickAnalysis | null>(null);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !description.trim() && !image) {
      setError('Please provide a title, description, or image.');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);
    setSaved(false);
    try {
      const qa = await quickAnalyse(title || 'Untitled', description, image, imageMimeType);
      setResult(qa);
      appendAuditLog('QUICK_ANALYSIS', `Title: ${title}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Quick analysis failed.');
      appendAuditLog('QUICK_ANALYSIS_ERROR', String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!result) return;
    saveToLibrary({
      id: generateId(),
      type: 'quick_analysis',
      title: result.quick_analysis.title,
      cultural_origin: result.quick_analysis.cultural_origin,
      created_at: new Date().toISOString(),
      data: result,
    });
    setSaved(true);
    appendAuditLog('SAVE_QUICK', result.quick_analysis.title);
  };

  const qa = result?.quick_analysis;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-amber-300 mb-2">⚡ Quick Analysis — 3 Minutes</h2>
        <p className="text-purple-300 text-sm">Fast-track analysis for on-the-go assessments. Scores + headline insights.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-purple-200 mb-1.5">Cartoon Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Nairobi 2149"
            className="w-full bg-black/40 border border-purple-700/50 rounded-xl px-4 py-3 text-sm text-purple-100 placeholder-purple-600 focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/30 transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-purple-200 mb-1.5">Quick Description <span className="text-purple-500 text-xs">(optional)</span></label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Brief description of what you see — characters, setting, colours, key elements..."
            rows={3}
            className="w-full bg-black/40 border border-purple-700/50 rounded-xl px-4 py-3 text-sm text-purple-100 placeholder-purple-600 focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/30 resize-none transition-colors"
          />
        </div>
        <ImageUpload
          label="Upload Image (optional)"
          preview={image}
          onImage={(b64, mime) => { setImage(b64); setImageMimeType(mime); }}
          onClear={() => { setImage(undefined); setImageMimeType(undefined); }}
        />
        {error && (
          <div role="alert" className="rounded-xl border border-red-700/50 bg-red-950/30 px-4 py-3 text-sm text-red-300">{error}</div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-900/30"
        >
          {loading ? <SpinnerIcon /> : <span className="text-lg">⚡</span>}
          {loading ? 'Analysing…' : 'Quick Analyse'}
        </button>
      </form>

      {qa && (
        <div className="space-y-5 animate-fade-in border-t border-purple-800/30 pt-6">
          <div className="rounded-xl border border-amber-700/40 bg-gradient-to-br from-amber-950/40 to-black p-6 space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-amber-300">{qa.title}</h3>
                <p className="text-sm text-purple-300 mt-1">{qa.cultural_origin}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-purple-400 uppercase tracking-wider mb-1">Quick Score</p>
                <p className="text-3xl font-bold text-amber-300">{((qa.afrofuturism_score + qa.cultural_authenticity_score) / 2).toFixed(1)}</p>
                <p className="text-xs text-purple-500">avg / 5</p>
              </div>
            </div>

            {/* Score bars */}
            <div className="grid grid-cols-2 gap-5">
              <ScoreBar label="Afrofuturism" score={qa.afrofuturism_score} colour="amber" />
              <ScoreBar label="Cultural Auth." score={qa.cultural_authenticity_score} colour="teal" />
            </div>

            {/* Visual standouts */}
            <div>
              <p className="text-xs text-purple-400 uppercase tracking-wider mb-2">Three Visual Standouts</p>
              <div className="grid grid-cols-3 gap-2">
                {qa.three_visual_standouts.map((v, i) => (
                  <div key={i} className="rounded-lg border border-purple-700/30 bg-purple-950/30 px-3 py-2 text-center">
                    <p className="text-xs text-amber-400 font-bold mb-1">{i + 1}</p>
                    <p className="text-xs text-purple-200">{v}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="border-t border-purple-800/30 pt-4 space-y-2">
              <p className="text-sm text-purple-200 italic">"{qa.one_sentence_summary}"</p>
              <p className="text-xs text-teal-300 font-medium">Key Takeaway: {qa.key_takeaway}</p>
            </div>
          </div>

          <JsonDisplay data={result} title="Quick Analysis JSON" />

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

const ScoreBar: React.FC<{ label: string; score: number; colour: 'amber' | 'teal' }> = ({ label, score, colour }) => {
  const barCls = colour === 'amber' ? 'bg-amber-500' : 'bg-teal-500';
  const textCls = colour === 'amber' ? 'text-amber-300' : 'text-teal-300';
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <p className="text-xs text-purple-400">{label}</p>
        <p className={`text-sm font-bold ${textCls}`}>{score}/5</p>
      </div>
      <div className="h-2 bg-purple-900/50 rounded-full overflow-hidden">
        <div className={`h-full ${barCls} rounded-full transition-all`} style={{ width: `${(score / 5) * 100}%` }} />
      </div>
      <div className="flex mt-1">
        {[1, 2, 3, 4, 5].map(n => (
          <StarIcon key={n} filled={n <= score} className={`w-3.5 h-3.5 ${n <= score ? textCls : 'text-purple-800'}`} />
        ))}
      </div>
    </div>
  );
};

export default QuickAnalysisTab;
