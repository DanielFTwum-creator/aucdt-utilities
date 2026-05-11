import { useEffect, useRef, useCallback } from 'react'
import { useSSEStream }      from '@/hooks/useSSEStream'
import { useAudioPlayer }    from '@/hooks/useAudioPlayer'
import { useGenerationStore } from '@/store/generationStore'
import { generation }        from '@/services/api'
import type { GenerationParams } from '@/types'

const MODEL_COLOURS: Record<string, string> = {
  musicgen_medium:   '#0e7c6e',
  musicgen_large:    '#1e6b3a',
  riffusion:         '#7c3aed',
  stable_audio_open: '#d97706',
  audioldm2:         '#2563eb',
}

interface Props {
  jobId:  string
  params: GenerationParams
}

export function StreamPlayer({ jobId, params }: Props) {
  const store  = useGenerationStore()
  const player = useAudioPlayer()

  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const rafRef     = useRef<number>(0)

  // ── Waveform animation loop ───────────────────────────────────────────────
  const drawWaveform = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx    = canvas.getContext('2d')!
    const data   = player.getWaveformData()
    const W = canvas.width, H = canvas.height

    ctx.clearRect(0, 0, W, H)

    if (!data || store.phase === 'idle') {
      // Idle: static baseline
      ctx.strokeStyle = '#1e3a5f'
      ctx.lineWidth   = 1.5
      ctx.beginPath()
      ctx.moveTo(0, H / 2)
      ctx.lineTo(W, H / 2)
      ctx.stroke()
    } else {
      // Live waveform
      const gradient = ctx.createLinearGradient(0, 0, W, 0)
      gradient.addColorStop(0,   '#0e7c6e')
      gradient.addColorStop(0.5, '#2dd4bf')
      gradient.addColorStop(1,   '#0e7c6e')
      ctx.strokeStyle = gradient
      ctx.lineWidth   = 1.5
      ctx.beginPath()
      const step = W / data.length
      for (let i = 0; i < data.length; i++) {
        const x = i * step
        const y = (data[i] * 0.9 + 1) / 2 * H
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.stroke()
    }

    rafRef.current = requestAnimationFrame(drawWaveform)
  }, [player, store.phase])

  useEffect(() => {
    rafRef.current = requestAnimationFrame(drawWaveform)
    return () => cancelAnimationFrame(rafRef.current)
  }, [drawWaveform])

  // ── SSE stream ────────────────────────────────────────────────────────────
  useSSEStream({
    jobId,
    enabled: store.phase === 'generating' || store.phase === 'streaming',
    onProgress:    store.onProgress,
    onBlendUpdate: store.onBlendUpdate,
    onAudioChunk:  (e) => { void player.pushChunk(e) },
    onDone:        store.onDone,
    onError:       store.onError,
  })

  const downloadUrl = (fmt: string) => generation.downloadUrl(jobId, fmt)
  const done = store.phase === 'complete'

  return (
    <div className="rounded-2xl border border-navy-600 bg-navy-800 p-6 space-y-5 animate-slide-up">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-white">
          {done ? '✅ Generation Complete' : '🎵 Generating…'}
        </h3>
        {store.computeMode && (
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-navy-700 text-brand-400">
            {store.computeMode}
          </span>
        )}
      </div>

      {/* ── Waveform canvas ── */}
      <div className="relative rounded-xl bg-navy-900 overflow-hidden h-24">
        <canvas ref={canvasRef} width={700} height={96} className="w-full h-full" />

        {/* Buffering overlay */}
        {player.isBuffering && store.phase !== 'idle' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex gap-1 items-end h-8">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-brand-500 rounded-full animate-waveform"
                  style={{ animationDelay: `${i * 0.12}s`, height: `${20 + i * 8}px` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Progress bar ── */}
      {!done && (
        <div className="space-y-1">
          <div className="h-1.5 rounded-full bg-navy-700 overflow-hidden">
            <div
              className="h-full rounded-full bg-brand-500 transition-all duration-500"
              style={{ width: `${store.progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>{store.progress}%</span>
            {store.etaMs > 0 && <span>~{Math.ceil(store.etaMs / 1000)}s remaining</span>}
          </div>
        </div>
      )}

      {/* ── Live blend recipe ── */}
      {Object.keys(store.blendRecipe).length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Model Blend</p>
          {Object.entries(store.blendRecipe).map(([model, weight]) => (
            <div key={model} className="flex items-center gap-3">
              <div
                className="w-2 h-2 rounded-full flex-none"
                style={{ background: MODEL_COLOURS[model] ?? '#0e7c6e' }}
              />
              <span className={`text-xs w-36 truncate transition-colors
                ${store.activeModel === model ? 'text-white font-medium' : 'text-gray-400'}`}>
                {model}
                {store.activeModel === model && (
                  <span className="ml-1 text-brand-400 animate-pulse">▶</span>
                )}
              </span>
              <div className="flex-1 h-1.5 rounded-full bg-navy-700 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${weight * 100}%`,
                    background: MODEL_COLOURS[model] ?? '#0e7c6e',
                  }}
                />
              </div>
              <span className="text-xs font-mono text-gray-500 w-8 text-right">
                {Math.round(weight * 100)}%
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ── Playback controls ── */}
      <div className="flex items-center gap-4">
        <button
          onClick={player.isPlaying ? player.pause : player.resume}
          disabled={player.isBuffering && !done}
          className="w-10 h-10 rounded-full bg-brand-500 hover:bg-brand-600
                     disabled:opacity-40 flex items-center justify-center
                     text-white text-lg transition"
        >
          {player.isPlaying ? '⏸' : '▶'}
        </button>

        {/* Volume */}
        <div className="flex items-center gap-2 text-gray-400">
          <span className="text-sm">🔊</span>
          <input
            type="range" min={0} max={1} step={0.05}
            value={player.volume}
            onChange={e => player.setVolume(Number(e.target.value))}
            className="w-20 accent-brand-500"
          />
        </div>

        {/* Download buttons (available when done) */}
        {done && (
          <div className="flex gap-2 ml-auto">
            {(['MP3', 'WAV', 'OGG'] as const).map(fmt => (
              <a
                key={fmt}
                href={downloadUrl(fmt)}
                download
                className="px-3 py-1.5 rounded-lg bg-navy-700 hover:bg-navy-600
                           text-xs font-medium text-gray-200 transition"
              >
                ⬇ {fmt}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* ── Prompt recap ── */}
      <p className="text-xs text-gray-600 italic truncate">"{params.prompt}"</p>
    </div>
  )
}
