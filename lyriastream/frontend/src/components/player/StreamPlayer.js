import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useCallback } from 'react';
import { useSSEStream } from '@/hooks/useSSEStream';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { useGenerationStore } from '@/store/generationStore';
import { generation } from '@/services/api';
const MODEL_COLOURS = {
    musicgen_medium: '#0e7c6e',
    musicgen_large: '#1e6b3a',
    riffusion: '#7c3aed',
    stable_audio_open: '#d97706',
    audioldm2: '#2563eb',
};
export function StreamPlayer({ jobId, params }) {
    const store = useGenerationStore();
    const player = useAudioPlayer();
    const canvasRef = useRef(null);
    const rafRef = useRef(0);
    // ── Waveform animation loop ───────────────────────────────────────────────
    const drawWaveform = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas)
            return;
        const ctx = canvas.getContext('2d');
        const data = player.getWaveformData();
        const W = canvas.width, H = canvas.height;
        ctx.clearRect(0, 0, W, H);
        if (!data || store.phase === 'idle') {
            // Idle: static baseline
            ctx.strokeStyle = '#1e3a5f';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(0, H / 2);
            ctx.lineTo(W, H / 2);
            ctx.stroke();
        }
        else {
            // Live waveform
            const gradient = ctx.createLinearGradient(0, 0, W, 0);
            gradient.addColorStop(0, '#0e7c6e');
            gradient.addColorStop(0.5, '#2dd4bf');
            gradient.addColorStop(1, '#0e7c6e');
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            const step = W / data.length;
            for (let i = 0; i < data.length; i++) {
                const x = i * step;
                const y = (data[i] * 0.9 + 1) / 2 * H;
                i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
            }
            ctx.stroke();
        }
        rafRef.current = requestAnimationFrame(drawWaveform);
    }, [player, store.phase]);
    useEffect(() => {
        rafRef.current = requestAnimationFrame(drawWaveform);
        return () => cancelAnimationFrame(rafRef.current);
    }, [drawWaveform]);
    // ── SSE stream ────────────────────────────────────────────────────────────
    useSSEStream({
        jobId,
        enabled: store.phase === 'generating' || store.phase === 'streaming',
        onProgress: store.onProgress,
        onBlendUpdate: store.onBlendUpdate,
        onAudioChunk: (e) => { void player.pushChunk(e); },
        onDone: store.onDone,
        onError: store.onError,
    });
    const downloadUrl = (fmt) => generation.downloadUrl(jobId, fmt);
    const done = store.phase === 'complete';
    return (_jsxs("div", { className: "rounded-2xl border border-navy-600 bg-navy-800 p-6 space-y-5 animate-slide-up", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "font-semibold text-white", children: done ? '✅ Generation Complete' : '🎵 Generating…' }), store.computeMode && (_jsx("span", { className: "text-xs font-mono px-2 py-0.5 rounded bg-navy-700 text-brand-400", children: store.computeMode }))] }), _jsxs("div", { className: "relative rounded-xl bg-navy-900 overflow-hidden h-24", children: [_jsx("canvas", { ref: canvasRef, width: 700, height: 96, className: "w-full h-full" }), player.isBuffering && store.phase !== 'idle' && (_jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: _jsx("div", { className: "flex gap-1 items-end h-8", children: Array.from({ length: 5 }).map((_, i) => (_jsx("div", { className: "w-1 bg-brand-500 rounded-full animate-waveform", style: { animationDelay: `${i * 0.12}s`, height: `${20 + i * 8}px` } }, i))) }) }))] }), !done && (_jsxs("div", { className: "space-y-1", children: [_jsx("div", { className: "h-1.5 rounded-full bg-navy-700 overflow-hidden", children: _jsx("div", { className: "h-full rounded-full bg-brand-500 transition-all duration-500", style: { width: `${store.progress}%` } }) }), _jsxs("div", { className: "flex justify-between text-xs text-gray-500", children: [_jsxs("span", { children: [store.progress, "%"] }), store.etaMs > 0 && _jsxs("span", { children: ["~", Math.ceil(store.etaMs / 1000), "s remaining"] })] })] })), Object.keys(store.blendRecipe).length > 0 && (_jsxs("div", { className: "space-y-1.5", children: [_jsx("p", { className: "text-xs text-gray-500 uppercase tracking-wide font-medium", children: "Model Blend" }), Object.entries(store.blendRecipe).map(([model, weight]) => (_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-2 h-2 rounded-full flex-none", style: { background: MODEL_COLOURS[model] ?? '#0e7c6e' } }), _jsxs("span", { className: `text-xs w-36 truncate transition-colors
                ${store.activeModel === model ? 'text-white font-medium' : 'text-gray-400'}`, children: [model, store.activeModel === model && (_jsx("span", { className: "ml-1 text-brand-400 animate-pulse", children: "\u25B6" }))] }), _jsx("div", { className: "flex-1 h-1.5 rounded-full bg-navy-700 overflow-hidden", children: _jsx("div", { className: "h-full rounded-full transition-all duration-700", style: {
                                        width: `${weight * 100}%`,
                                        background: MODEL_COLOURS[model] ?? '#0e7c6e',
                                    } }) }), _jsxs("span", { className: "text-xs font-mono text-gray-500 w-8 text-right", children: [Math.round(weight * 100), "%"] })] }, model)))] })), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("button", { onClick: player.isPlaying ? player.pause : player.resume, disabled: player.isBuffering && !done, className: "w-10 h-10 rounded-full bg-brand-500 hover:bg-brand-600\n                     disabled:opacity-40 flex items-center justify-center\n                     text-white text-lg transition", children: player.isPlaying ? '⏸' : '▶' }), _jsxs("div", { className: "flex items-center gap-2 text-gray-400", children: [_jsx("span", { className: "text-sm", children: "\uD83D\uDD0A" }), _jsx("input", { type: "range", min: 0, max: 1, step: 0.05, value: player.volume, onChange: e => player.setVolume(Number(e.target.value)), className: "w-20 accent-brand-500" })] }), done && (_jsx("div", { className: "flex gap-2 ml-auto", children: ['MP3', 'WAV', 'OGG'].map(fmt => (_jsxs("a", { href: downloadUrl(fmt), download: true, className: "px-3 py-1.5 rounded-lg bg-navy-700 hover:bg-navy-600\n                           text-xs font-medium text-gray-200 transition", children: ["\u2B07 ", fmt] }, fmt))) }))] }), _jsxs("p", { className: "text-xs text-gray-600 italic truncate", children: ["\"", params.prompt, "\""] })] }));
}
