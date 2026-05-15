import React, { useState } from 'react';
import { generateBrief } from '../services/geminiService';
import { GenerationBrief, GenerateBriefFormData } from '../types';
import { saveToLibrary, appendAuditLog, generateId } from '../utils/storage';
import { SpinnerIcon, SaveIcon } from './icons';
import JsonDisplay from './JsonDisplay';

const CHECKLIST = [
  'Cultural authenticity verified (not stereotypical)',
  'Afrofuturism elements integrated meaningfully',
  'Character agency established',
  'Visual style cohesive and intentional',
  'Message/narrative clear',
  'Respectful representation of all groups depicted',
  'Diverse representation within African diaspora',
  'Originality vs. derivative elements balanced',
];

const CULTURAL_REGIONS = [
  'West African (Ghana, Nigeria, Senegal)',
  'East African (Kenya, Ethiopia, Tanzania)',
  'Southern African (South Africa, Zimbabwe)',
  'North African (Egypt, Morocco)',
  'Central African (Congo, Cameroon)',
  'Caribbean (Jamaica, Trinidad, Haiti)',
  'African American / US Diaspora',
  'Afro-Latin (Brazil, Cuba, Colombia)',
  'Pan-African / Diaspora Blend',
];

const THEMES = [
  'Technology & Innovation', 'Wellness & Healing', 'Fashion & Identity',
  'Music & Sound', 'Spirituality & Ancestors', 'Education & Knowledge',
  'Community & Collective', 'Migration & Belonging', 'Resistance & Liberation',
  'Love & Relationships', 'Environmental Justice', 'Afro-Cosmic / Space',
];

const MOODS = [
  'Aspirational', 'Celebratory', 'Critical', 'Hopeful', 'Mystical',
  'Playful', 'Solemn', 'Triumphant', 'Contemplative', 'Revolutionary',
];

const SETTINGS = [
  'Futuristic African Megacity', 'Space Station', 'Neo-traditional Village',
  'Coastal Biopunk Harbour', 'Underground Resistance HQ', 'Ancestral Spirit Realm',
  'Tech Hub / Maker Space', 'Floating Market', 'Quantum Research Lab',
  'Post-apocalyptic Reclaimed Land', 'Digital Afro-Metaverse', 'Interplanetary Colony',
];

const GenerateBriefTab: React.FC = () => {
  const [form, setForm] = useState<GenerateBriefFormData>({
    cultural_origin: '',
    setting: '',
    theme: '',
    mood: '',
    narrative_focus: '',
    characters: '',
    futuristic_elements: '',
    social_message: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerationBrief | null>(null);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [checks, setChecks] = useState<boolean[]>(new Array(CHECKLIST.length).fill(false));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.cultural_origin || !form.theme || !form.mood) {
      setError('Please provide at least Cultural Origin, Theme, and Mood.');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);
    setSaved(false);
    try {
      const brief = await generateBrief(form);
      setResult(brief);
      appendAuditLog('GENERATE_BRIEF', `Origin: ${form.cultural_origin} | Theme: ${form.theme}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed. Please check your API key and try again.');
      appendAuditLog('GENERATE_ERROR', String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!result) return;
    saveToLibrary({
      id: generateId(),
      type: 'generation_brief',
      title: result.generation_brief.title,
      cultural_origin: result.generation_brief.cultural_origin,
      created_at: new Date().toISOString(),
      data: result,
    });
    setSaved(true);
    appendAuditLog('SAVE_BRIEF', result.generation_brief.title);
  };

  const selectField = (label: string, key: keyof GenerateBriefFormData, options: string[], placeholder: string) => (
    <div>
      <label className="block text-sm font-medium text-purple-200 mb-1.5">{label}<span className="text-amber-400 ml-1">*</span></label>
      <select
        value={form[key]}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        className="w-full bg-black/40 border border-purple-700/50 rounded-xl px-4 py-3 text-sm text-purple-100 focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/30 transition-colors appearance-none cursor-pointer"
      >
        <option value="" className="bg-gray-900">{placeholder}</option>
        {options.map(o => <option key={o} value={o} className="bg-gray-900">{o}</option>)}
      </select>
    </div>
  );

  const textField = (label: string, key: keyof GenerateBriefFormData, placeholder: string, required = false) => (
    <div>
      <label className="block text-sm font-medium text-purple-200 mb-1.5">{label}{required && <span className="text-amber-400 ml-1">*</span>}</label>
      <input
        type="text"
        value={form[key]}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        placeholder={placeholder}
        className="w-full bg-black/40 border border-purple-700/50 rounded-xl px-4 py-3 text-sm text-purple-100 placeholder-purple-600 focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/30 transition-colors"
      />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-amber-300 mb-2">Creative Brief Generator</h2>
        <p className="text-purple-300 text-sm">Design a new Afrofuturism cartoon using Prompt Set 2 — Creation Prompts and Template 3</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {selectField('Cultural Origin', 'cultural_origin', CULTURAL_REGIONS, 'Select region or culture...')}
          {selectField('Setting', 'setting', SETTINGS, 'Select setting...')}
          {selectField('Primary Theme', 'theme', THEMES, 'Select theme...')}
          {selectField('Mood / Tone', 'mood', MOODS, 'Select mood...')}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {textField('Narrative Focus', 'narrative_focus', 'e.g. A grandmother teaching her grandchild ancient code', true)}
          {textField('Character Description', 'characters', 'e.g. Two elders, a young engineer, community members')}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {textField('Futuristic Elements', 'futuristic_elements', 'e.g. Biopunk textiles, neural interfaces, solar-punk architecture')}
          {textField('Social Message (optional)', 'social_message', 'e.g. Technology as an extension of community, not replacement')}
        </div>
        {error && (
          <div role="alert" className="rounded-xl border border-red-700/50 bg-red-950/30 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-black font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-teal-900/30"
        >
          {loading ? <SpinnerIcon /> : <span className="text-lg">✨</span>}
          {loading ? 'Generating Brief…' : 'Generate Creative Brief'}
        </button>
      </form>

      {result && (
        <div className="space-y-5 animate-fade-in border-t border-purple-800/30 pt-6">
          <h3 className="text-xl font-bold text-amber-300">{result.generation_brief.title}</h3>

          {/* Visual description */}
          <div className="rounded-xl border border-teal-800/30 bg-teal-950/10 p-5">
            <h4 className="text-sm font-semibold text-teal-300 mb-3 uppercase tracking-wider">Visual Description</h4>
            <p className="text-sm text-purple-200 leading-relaxed">{result.visual_description}</p>
          </div>

          {/* Art direction */}
          {result.art_direction_notes && (
            <div className="rounded-xl border border-amber-800/30 bg-amber-950/10 p-5">
              <h4 className="text-sm font-semibold text-amber-300 mb-3 uppercase tracking-wider">Art Direction Notes</h4>
              <p className="text-sm text-purple-200 leading-relaxed">{result.art_direction_notes}</p>
            </div>
          )}

          {/* Key brief details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <BriefDetail label="Temporal Setting" value={result.generation_brief.temporal_setting} />
            <BriefDetail label="Mood Target" value={result.generation_brief.mood_target} />
            <BriefDetail label="Target Characters" value={result.generation_brief.target_characters} />
            {result.generation_brief.social_message && (
              <BriefDetail label="Social Message" value={result.generation_brief.social_message} />
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <TagSection label="Key Elements" tags={result.generation_brief.key_elements} colour="amber" />
            <TagSection label="Visual Style Refs" tags={result.generation_brief.visual_style_ref} colour="purple" />
            <TagSection label="Inspirations" tags={result.generation_brief.inspirations} colour="teal" />
          </div>

          {result.generation_brief.constraints.length > 0 && (
            <div className="rounded-xl border border-red-800/20 bg-red-950/10 p-4">
              <p className="text-xs font-semibold text-red-300 uppercase tracking-wider mb-2">Constraints</p>
              <ul className="space-y-1">
                {result.generation_brief.constraints.map((c, i) => (
                  <li key={i} className="text-sm text-purple-200 flex items-start gap-2">
                    <span className="text-red-400 flex-shrink-0">•</span> {c}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Generation Quality Checklist */}
          <div className="rounded-xl border border-purple-800/30 bg-purple-950/20 p-5">
            <h4 className="text-sm font-semibold text-amber-300 mb-4 uppercase tracking-wider">Generation Quality Checklist</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CHECKLIST.map((item, i) => (
                <label key={i} className="flex items-start gap-3 cursor-pointer group">
                  <div
                    className={`mt-0.5 w-5 h-5 rounded flex-shrink-0 flex items-center justify-center border transition-all ${checks[i] ? 'bg-emerald-600 border-emerald-500' : 'border-purple-600 group-hover:border-purple-400'}`}
                    onClick={() => setChecks(c => c.map((v, j) => j === i ? !v : v))}
                  >
                    {checks[i] && <span className="text-white text-xs">✓</span>}
                  </div>
                  <span className={`text-xs transition-colors ${checks[i] ? 'text-emerald-300 line-through' : 'text-purple-300'}`}>{item}</span>
                </label>
              ))}
            </div>
          </div>

          <JsonDisplay data={result} title="Template 3: Creative Generation Brief (JSON)" />

          <div className="flex items-center gap-3">
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
      )}
    </div>
  );
};

const BriefDetail: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="rounded-xl border border-purple-800/30 bg-black/30 p-4">
    <p className="text-xs text-purple-400 uppercase tracking-wider mb-1">{label}</p>
    <p className="text-sm text-purple-100">{value}</p>
  </div>
);

const TagSection: React.FC<{ label: string; tags: string[]; colour: 'amber' | 'purple' | 'teal' }> = ({ label, tags, colour }) => {
  const cls = {
    amber: 'bg-amber-900/30 text-amber-300 border-amber-800/40',
    purple: 'bg-purple-900/30 text-purple-300 border-purple-800/40',
    teal: 'bg-teal-900/30 text-teal-300 border-teal-800/40',
  }[colour];
  return (
    <div className="rounded-xl border border-purple-800/30 bg-black/30 p-4">
      <p className="text-xs text-purple-400 uppercase tracking-wider mb-2">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {tags.map((t, i) => (
          <span key={i} className={`text-xs px-2 py-0.5 rounded-full border ${cls}`}>{t}</span>
        ))}
      </div>
    </div>
  );
};

export default GenerateBriefTab;
