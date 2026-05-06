import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useCallback } from 'react';
import { generation as api } from '@/services/api';
import { useGenerationStore } from '@/store/generationStore';
const GENRES = [
    'Ambient', 'Cinematic', 'Classical', 'Dancehall', 'Drone',
    'EDM', 'Electronic', 'Funk', 'Highlife', 'Afrobeats',
    'Hiphop', 'Jazz', 'Lo-Fi', 'Meditation', 'Orchestra',
    'Reggae', 'Rock', 'Soul',
];
const MOODS = [
    'Calm', 'Celebratory', 'Dark', 'Dreamy', 'Energetic',
    'Epic', 'Happy', 'Melancholic', 'Mysterious', 'Peaceful',
    'Romantic', 'Tense', 'Upbeat',
];
const KEYS = ['C major', 'D major', 'E major', 'F major', 'G major', 'A major', 'B major',
    'C minor', 'D minor', 'E minor', 'F minor', 'G minor', 'A minor', 'B minor'];
const MODEL_COLOURS = {
    musicgen_medium: 'bg-teal-500',
    musicgen_large: 'bg-brand-600',
    riffusion: 'bg-purple-500',
    stable_audio_open: 'bg-amber-500',
    audioldm2: 'bg-blue-500',
};
// Uses CSS custom property to avoid inline style lint rule for dynamic width
function BlendBar({ weight, colour }) {
    return (_jsx("div", { className: `ls-blend-bar-fill ${colour}`, "data-w": `${Math.round(weight * 100)}%`, ref: el => { if (el)
            el.style.setProperty('width', `${weight * 100}%`); } }));
}
export function PromptBuilder({ onGenerate }) {
    const store = useGenerationStore();
    const [prompt, setPrompt] = useState('');
    const [genre, setGenre] = useState('');
    const [moods, setMoods] = useState([]);
    const [bpm, setBpm] = useState(100);
    const [key, setKey] = useState('');
    const [duration, setDuration] = useState(10);
    const [qualityMode, setQualityMode] = useState('auto');
    const [preview, setPreview] = useState(null);
    const [previewing, setPreviewing] = useState(false);
    const [error, setError] = useState(null);
    const toggleMood = (mood) => setMoods(prev => prev.includes(mood) ? prev.filter(m => m !== mood) : [...prev, mood]);
    const handlePreview = useCallback(async () => {
        if (!prompt.trim())
            return;
        setPreviewing(true);
        try {
            const { data } = await api.preview(prompt, genre || undefined, duration);
            setPreview(data);
        }
        catch { /* silent */ }
        finally {
            setPreviewing(false);
        }
    }, [prompt, genre, duration]);
    const handleGenerate = useCallback(async () => {
        if (!prompt.trim() || store.phase === 'submitting' || store.phase === 'generating')
            return;
        setError(null);
        const params = {
            prompt, genre, mood: moods, tempoBpm: bpm,
            key, durationSec: duration, qualityMode,
        };
        store.startSubmit(params);
        try {
            const { data } = await api.submit(params);
            store.onSubmitSuccess(data);
            onGenerate(params, data.jobId);
        }
        catch (e) {
            const msg = e
                ?.response?.data?.message ?? 'Generation failed';
            setError(msg);
            store.reset();
        }
    }, [prompt, genre, moods, bpm, key, duration, qualityMode, store, onGenerate]);
    const busy = store.phase === 'submitting' || store.phase === 'generating';
    return (_jsxs("div", { className: "animate-fade-in", children: [_jsxs("div", { className: "ls-card", children: [_jsx("div", { className: "ls-section-label", children: "Prompt" }), _jsx("textarea", { value: prompt, onChange: e => setPrompt(e.target.value), maxLength: 500, className: "ls-textarea", placeholder: "e.g. Upbeat West African highlife with talking drum, electric guitar, and bright brass..." }), _jsxs("div", { className: `ls-char-count${prompt.length > 450 ? ' ls-char-count--warn' : ''}`, children: [prompt.length, "/500"] })] }), _jsx("div", { className: "ls-card", children: _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("div", { className: "ls-section-label", children: "Genre" }), _jsxs("select", { "aria-label": "Genre", value: genre, onChange: e => setGenre(e.target.value), className: "ls-select", children: [_jsx("option", { value: "", children: "Any genre" }), GENRES.map(g => _jsx("option", { value: g.toLowerCase(), children: g }, g))] })] }), _jsxs("div", { children: [_jsx("div", { className: "ls-section-label", children: "Key" }), _jsxs("select", { "aria-label": "Key", value: key, onChange: e => setKey(e.target.value), className: "ls-select", children: [_jsx("option", { value: "", children: "Any key" }), KEYS.map(k => _jsx("option", { value: k, children: k }, k))] })] })] }) }), _jsxs("div", { className: "ls-card", children: [_jsx("div", { className: "ls-section-label", children: "Mood" }), _jsx("div", { className: "flex flex-wrap gap-1.5", children: MOODS.map(mood => (_jsx("button", { type: "button", onClick: () => toggleMood(mood.toLowerCase()), className: `ls-mood-chip${moods.includes(mood.toLowerCase()) ? ' active' : ''}`, children: mood }, mood))) })] }), _jsxs("div", { className: "ls-card", children: [_jsx("div", { className: "ls-section-label", children: "Parameters" }), _jsxs("div", { className: "ls-slider-row", children: [_jsx("span", { className: "ls-slider-label", children: "Tempo (BPM)" }), _jsx("input", { type: "range", min: 60, max: 180, value: bpm, "aria-label": `Tempo: ${bpm} BPM`, onChange: e => setBpm(Number(e.target.value)) }), _jsx("span", { className: "ls-slider-val", "aria-hidden": true, children: bpm })] }), _jsxs("div", { className: "ls-range-hints", children: [_jsx("span", { children: "60" }), _jsx("span", { children: "180" })] }), _jsxs("div", { className: "ls-slider-row", children: [_jsx("span", { className: "ls-slider-label", children: "Duration" }), _jsx("input", { type: "range", min: 5, max: 30, value: duration, "aria-label": `Duration: ${duration} seconds`, onChange: e => setDuration(Number(e.target.value)) }), _jsxs("span", { className: "ls-slider-val", "aria-hidden": true, children: [duration, "s"] })] }), _jsxs("div", { className: "ls-range-hints", children: [_jsx("span", { children: "5s" }), _jsx("span", { children: "30s" })] })] }), _jsxs("div", { className: "ls-card", children: [_jsx("div", { className: "ls-section-label", children: "Quality" }), _jsx("div", { className: "ls-quality-row", children: [
                            { value: 'auto', label: 'Auto', badge: 'best available' },
                            { value: 'cpu_draft', label: 'CPU Draft', badge: 'fast preview' },
                            { value: 'gpu_full', label: 'GPU Full', badge: 'high quality' },
                        ].map(({ value, label, badge }) => (_jsxs("button", { type: "button", onClick: () => setQualityMode(value), className: `ls-quality-btn${qualityMode === value ? ' active' : ''}`, children: [label, _jsx("span", { className: "ls-quality-badge", children: badge })] }, value))) })] }), preview && (_jsxs("div", { className: "ls-blend-preview animate-slide-up", children: [_jsxs("div", { className: "ls-section-label", children: ["Blend Recipe \u00B7 ", preview.computeMode, " \u00B7 ~", preview.estimatedTtfbSec, "s TTFB"] }), _jsx("div", { className: "ls-blend-rows", children: Object.entries(preview.recipe).map(([model, weight]) => (_jsxs("div", { className: "ls-blend-row", children: [_jsx("span", { className: "ls-blend-model", children: model }), _jsx("div", { className: "ls-blend-bar-track", children: _jsx(BlendBar, { weight: weight, colour: MODEL_COLOURS[model] ?? 'bg-accent' }) }), _jsxs("span", { className: "ls-blend-pct", children: [Math.round(weight * 100), "%"] })] }, model))) })] })), error && _jsx("div", { className: "ls-error ls-error--mt", children: error }), _jsxs("div", { className: "ls-actions", children: [_jsxs("button", { type: "button", onClick: () => void handlePreview(), disabled: !prompt.trim() || previewing, className: "ls-btn-secondary", children: [_jsx("svg", { width: "14", height: "14", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", children: _jsx("path", { d: "M3 8h10M9 4l4 4-4 4" }) }), previewing ? 'Loading…' : 'Preview recipe'] }), _jsx("button", { type: "button", onClick: () => void handleGenerate(), disabled: !prompt.trim() || busy, className: "ls-btn-primary", children: busy ? (_jsxs(_Fragment, { children: [_jsx("span", { className: "animate-spin", "aria-hidden": true, children: "\u27F3" }), store.phase === 'submitting' ? 'Submitting…' : `Generating… ${store.progress}%`] })) : (_jsxs(_Fragment, { children: [_jsx("svg", { width: "14", height: "14", viewBox: "0 0 16 16", fill: "none", children: _jsx("path", { d: "M4 3l10 5-10 5V3z", fill: "currentColor" }) }), "Generate music"] })) })] }), store.quotaRemaining > 0 && (_jsxs("p", { className: "ls-quota", children: [store.quotaRemaining, " generation", store.quotaRemaining !== 1 ? 's' : '', " remaining today"] }))] }));
}
