import React, { useState } from 'react';
import { analyseCartoon } from '../services/geminiService';
import { CartoonAnalysis, AnalyseFormData } from '../types';
import { saveToLibrary, appendAuditLog, generateId } from '../utils/storage';
import { SpinnerIcon, SaveIcon } from './icons';
import JsonDisplay from './JsonDisplay';
import ScoreCard from './ScoreCard';
import ImageUpload from './ImageUpload';

const CHECKLIST = [
  'Image source identified and credited',
  'Cultural origins researched and noted',
  'Artistic technique documented',
  'Creator information (if available)',
  'Historical/contemporary context understood',
];

const AnalyseTab: React.FC = () => {
  const [form, setForm] = useState<AnalyseFormData>({ title: '', creator: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CartoonAnalysis | null>(null);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [checks, setChecks] = useState<boolean[]>(new Array(CHECKLIST.length).fill(false));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() && !form.description.trim() && !form.image) {
      setError('Please provide a title, description, or image to analyse.');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);
    setSaved(false);
    try {
      const analysis = await analyseCartoon(form);
      setResult(analysis);
      appendAuditLog('FULL_ANALYSIS', `Title: ${form.title}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed. Please check your API key and try again.');
      appendAuditLog('ANALYSIS_ERROR', String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!result) return;
    saveToLibrary({
      id: generateId(),
      type: 'full_analysis',
      title: result.metadata.title || form.title || 'Untitled Analysis',
      cultural_origin: result.cultural_context.region,
      created_at: new Date().toISOString(),
      data: result,
    });
    setSaved(true);
    appendAuditLog('SAVE_ANALYSIS', result.metadata.title);
  };

  const field = (label: string, key: keyof AnalyseFormData, opts?: { multiline?: boolean; placeholder?: string; required?: boolean }) => (
    <div>
      <label className="block text-sm font-medium text-purple-200 mb-1.5">{label}{opts?.required && <span className="text-amber-400 ml-1">*</span>}</label>
      {opts?.multiline ? (
        <textarea
          value={form[key] as string}
          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          placeholder={opts.placeholder}
          rows={5}
          className="w-full bg-black/40 border border-purple-700/50 rounded-xl px-4 py-3 text-sm text-purple-100 placeholder-purple-600 focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/30 resize-none transition-colors"
        />
      ) : (
        <input
          type="text"
          value={form[key] as string}
          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          placeholder={opts?.placeholder}
          className="w-full bg-black/40 border border-purple-700/50 rounded-xl px-4 py-3 text-sm text-purple-100 placeholder-purple-600 focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/30 transition-colors"
        />
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-amber-300 mb-2">Full Cartoon Analysis</h2>
        <p className="text-purple-300 text-sm">Apply all three analysis directives: Cultural Authenticity · Afrofuturism Authenticity · Representation Quality</p>
      </div>

      {/* Pre-analysis checklist */}
      <div className="rounded-xl border border-purple-800/30 bg-purple-950/20 p-5">
        <h3 className="text-sm font-semibold text-amber-300 mb-4 uppercase tracking-wider">Pre-Analysis Checklist</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {CHECKLIST.map((item, i) => (
            <label key={i} className="flex items-start gap-3 cursor-pointer group">
              <div className={`mt-0.5 w-5 h-5 rounded flex-shrink-0 flex items-center justify-center border transition-all ${
                checks[i] ? 'bg-emerald-600 border-emerald-500' : 'border-purple-600 group-hover:border-purple-400'
              }`}
                onClick={() => setChecks(c => c.map((v, j) => j === i ? !v : v))}
              >
                {checks[i] && <span className="text-white text-xs">✓</span>}
              </div>
              <span className={`text-sm transition-colors ${checks[i] ? 'text-emerald-300 line-through' : 'text-purple-300'}`}>{item}</span>
            </label>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {field('Cartoon Title', 'title', { placeholder: 'e.g. Wakanda Rush Hour', required: true })}
          {field('Creator / Artist', 'creator', { placeholder: 'e.g. Stacey Robinson' })}
        </div>
        {field('Description / Visual Context', 'description', {
          multiline: true,
          placeholder: 'Describe what you see: characters, setting, colours, cultural elements, mood...'
        })}
        <ImageUpload
          label="Upload Cartoon Image (optional — enhances analysis)"
          preview={form.image}
          onImage={(base64, mimeType) => setForm(f => ({ ...f, image: base64, imageMimeType: mimeType }))}
          onClear={() => setForm(f => ({ ...f, image: undefined, imageMimeType: undefined }))}
        />
        {error && (
          <div role="alert" className="rounded-xl border border-red-700/50 bg-red-950/30 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-900/30"
        >
          {loading ? <SpinnerIcon /> : <span className="text-lg">🔍</span>}
          {loading ? 'Analysing…' : 'Run Full Analysis'}
        </button>
      </form>

      {result && (
        <div className="space-y-6 animate-fade-in">
          <div className="border-t border-purple-800/30 pt-6">
            <h3 className="text-xl font-bold text-amber-300 mb-6">Analysis Results</h3>

            {/* Score card */}
            <ScoreCard scores={result.directive_scores} />

            {/* Narrative analysis */}
            {result.narrative_analysis && (
              <div className="mt-5 rounded-xl border border-purple-800/30 bg-gradient-to-br from-purple-950/40 to-black/40 p-5">
                <h4 className="text-sm font-semibold text-amber-300 mb-3 uppercase tracking-wider">Narrative Analysis</h4>
                <p className="text-sm text-purple-200 leading-relaxed">{result.narrative_analysis}</p>
              </div>
            )}

            {/* Key cultural elements */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoCard title="Cultural Context" items={[
                { label: 'Region', value: result.cultural_context.region },
                { label: 'Cultures', value: result.cultural_context.specific_cultures.join(', ') },
                { label: 'Diaspora', value: result.cultural_context.diaspora_connection || 'Not specified' },
              ]} />
              <InfoCard title="Visual Style" items={[
                { label: 'Technique', value: result.visual_style.artistic_technique },
                { label: 'Palette', value: result.visual_style.color_palette.slice(0, 4).join(', ') },
                { label: 'Mood', value: result.visual_style.visual_mood },
              ]} />
              <InfoCard title="Narrative" items={[
                { label: 'Theme', value: result.narrative_layer.theme },
                { label: 'Tone', value: result.classification.tone },
                { label: 'Subgenre', value: result.classification.subgenre },
              ]} />
              <InfoCard title="Characters" items={
                result.characters.slice(0, 3).map((c, i) => ({
                  label: `Character ${c.identifier}`,
                  value: `${c.cultural_identity} · ${c.agency} agency`,
                }))
              } />
            </div>

            {/* Afrofuturism elements */}
            <div className="mt-4 rounded-xl border border-cyan-800/30 bg-cyan-950/10 p-5">
              <h4 className="text-sm font-semibold text-cyan-300 mb-3 uppercase tracking-wider">Afrofuturism Elements</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <TagList label="Futuristic Aspects" tags={result.afrofuturism_elements.futuristic_aspects} colour="cyan" />
                <TagList label="Cultural Celebrations" tags={result.afrofuturism_elements.cultural_celebrations} colour="amber" />
                <TagList label="Speculative Elements" tags={result.afrofuturism_elements.speculative_elements} colour="purple" />
              </div>
              <p className="mt-3 text-xs text-cyan-300/70 italic">{result.afrofuturism_elements.contemporary_relevance}</p>
            </div>

            {/* JSON */}
            <div className="mt-5">
              <JsonDisplay data={result} title="Template 1: Basic Cartoon Description (JSON)" />
            </div>

            {/* Save */}
            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={handleSave}
                disabled={saved}
                className="flex items-center gap-2 px-4 py-2 text-sm border border-purple-600/50 text-purple-300 hover:text-purple-100 hover:border-purple-500 rounded-xl transition-colors disabled:opacity-60"
              >
                <SaveIcon />
                {saved ? 'Saved to Library' : 'Save to Library'}
              </button>
              {saved && <span className="text-xs text-emerald-400">✓ Saved</span>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const InfoCard: React.FC<{ title: string; items: { label: string; value: string }[] }> = ({ title, items }) => (
  <div className="rounded-xl border border-purple-800/30 bg-black/30 p-4 space-y-2">
    <h4 className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-3">{title}</h4>
    {items.map(({ label, value }) => (
      <div key={label} className="flex gap-2">
        <span className="text-xs text-purple-500 flex-shrink-0 w-20">{label}</span>
        <span className="text-xs text-purple-200">{value}</span>
      </div>
    ))}
  </div>
);

const TagList: React.FC<{ label: string; tags: string[]; colour: 'cyan' | 'amber' | 'purple' }> = ({ label, tags, colour }) => {
  const cls = {
    cyan: 'bg-cyan-900/30 text-cyan-300 border-cyan-800/40',
    amber: 'bg-amber-900/30 text-amber-300 border-amber-800/40',
    purple: 'bg-purple-900/30 text-purple-300 border-purple-800/40',
  }[colour];
  return (
    <div>
      <p className="text-xs text-purple-400 mb-2 font-medium">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {tags.slice(0, 4).map((t, i) => (
          <span key={i} className={`text-xs px-2 py-0.5 rounded-full border ${cls}`}>{t}</span>
        ))}
      </div>
    </div>
  );
};

export default AnalyseTab;
