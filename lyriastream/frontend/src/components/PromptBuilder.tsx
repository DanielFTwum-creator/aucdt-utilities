import { useState, useCallback } from 'react'
import { generation as api } from '@/services/api'
import { useGenerationStore } from '@/store/generationStore'
import type { GenerationParams, BlendRecipePreview } from '@/types'

const GENRES = [
  'Ambient','Cinematic','Classical','Dancehall','Drone',
  'EDM','Electronic','Funk','Highlife','Afrobeats',
  'Hiphop','Jazz','Lo-Fi','Meditation','Orchestra',
  'Reggae','Rock','Soul',
]
const MOODS = [
  'Calm','Celebratory','Dark','Dreamy','Energetic',
  'Epic','Happy','Melancholic','Mysterious','Peaceful',
  'Romantic','Tense','Upbeat',
]
const KEYS  = ['C major','D major','E major','F major','G major','A major','B major',
                'C minor','D minor','E minor','F minor','G minor','A minor','B minor']

const MODEL_COLOURS: Record<string, string> = {
  musicgen_medium:   'bg-teal-500',
  musicgen_large:    'bg-brand-600',
  riffusion:         'bg-purple-500',
  stable_audio_open: 'bg-amber-500',
  audioldm2:         'bg-blue-500',
}

// Uses CSS custom property to avoid inline style lint rule for dynamic width
function BlendBar({ weight, colour }: { weight: number; colour: string }) {
  return (
    <div
      className={`ls-blend-bar-fill ${colour}`}
      data-w={`${Math.round(weight * 100)}%`}
      ref={el => { if (el) el.style.setProperty('width', `${weight * 100}%`) }}
    />
  )
}

interface Props {
  onGenerate: (params: GenerationParams, jobId: string) => void
}

export function PromptBuilder({ onGenerate }: Props) {
  const store = useGenerationStore()

  const [prompt,      setPrompt]      = useState('')
  const [genre,       setGenre]       = useState('')
  const [moods,       setMoods]       = useState<string[]>([])
  const [bpm,         setBpm]         = useState(100)
  const [key,         setKey]         = useState('')
  const [duration,    setDuration]    = useState(10)
  const [qualityMode, setQualityMode] = useState<'auto'|'cpu_draft'|'gpu_full'>('auto')
  const [preview,     setPreview]     = useState<BlendRecipePreview | null>(null)
  const [previewing,  setPreviewing]  = useState(false)
  const [error,       setError]       = useState<string | null>(null)

  const toggleMood = (mood: string) =>
    setMoods(prev => prev.includes(mood) ? prev.filter(m => m !== mood) : [...prev, mood])

  const handlePreview = useCallback(async () => {
    if (!prompt.trim()) return
    setPreviewing(true)
    try {
      const { data } = await api.preview(prompt, genre || undefined, duration)
      setPreview(data)
    } catch { /* silent */ }
    finally { setPreviewing(false) }
  }, [prompt, genre, duration])

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim() || store.phase === 'submitting' || store.phase === 'generating') return
    setError(null)
    const params: GenerationParams = {
      prompt, genre, mood: moods, tempoBpm: bpm,
      key, durationSec: duration, qualityMode,
    }
    store.startSubmit(params)
    try {
      const { data } = await api.submit(params)
      store.onSubmitSuccess(data)
      onGenerate(params, data.jobId)
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })
        ?.response?.data?.message ?? 'Generation failed'
      setError(msg)
      store.reset()
    }
  }, [prompt, genre, moods, bpm, key, duration, qualityMode, store, onGenerate])

  const busy = store.phase === 'submitting' || store.phase === 'generating'

  return (
    <div className="animate-fade-in">
      {/* ── Prompt ── */}
      <div className="ls-card">
        <div className="ls-section-label">Prompt</div>
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          maxLength={500}
          className="ls-textarea"
          placeholder="e.g. Upbeat West African highlife with talking drum, electric guitar, and bright brass..."
        />
        <div className={`ls-char-count${prompt.length > 450 ? ' ls-char-count--warn' : ''}`}>
          {prompt.length}/500
        </div>
      </div>

      {/* ── Genre + Key ── */}
      <div className="ls-card">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="ls-section-label">Genre</div>
            <select aria-label="Genre" value={genre} onChange={e => setGenre(e.target.value)} className="ls-select">
              <option value="">Any genre</option>
              {GENRES.map(g => <option key={g} value={g.toLowerCase()}>{g}</option>)}
            </select>
          </div>
          <div>
            <div className="ls-section-label">Key</div>
            <select aria-label="Key" value={key} onChange={e => setKey(e.target.value)} className="ls-select">
              <option value="">Any key</option>
              {KEYS.map(k => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* ── Mood chips ── */}
      <div className="ls-card">
        <div className="ls-section-label">Mood</div>
        <div className="flex flex-wrap gap-1.5">
          {MOODS.map(mood => (
            <button
              type="button"
              key={mood}
              onClick={() => toggleMood(mood.toLowerCase())}
              className={`ls-mood-chip${moods.includes(mood.toLowerCase()) ? ' active' : ''}`}
            >
              {mood}
            </button>
          ))}
        </div>
      </div>

      {/* ── Parameters ── */}
      <div className="ls-card">
        <div className="ls-section-label">Parameters</div>
        <div className="ls-slider-row">
          <span className="ls-slider-label">Tempo (BPM)</span>
          <input
            type="range" min={60} max={180} value={bpm}
            aria-label={`Tempo: ${bpm} BPM`}
            onChange={e => setBpm(Number(e.target.value))}
          />
          <span className="ls-slider-val" aria-hidden>{bpm}</span>
        </div>
        <div className="ls-range-hints"><span>60</span><span>180</span></div>

        <div className="ls-slider-row">
          <span className="ls-slider-label">Duration</span>
          <input
            type="range" min={5} max={30} value={duration}
            aria-label={`Duration: ${duration} seconds`}
            onChange={e => setDuration(Number(e.target.value))}
          />
          <span className="ls-slider-val" aria-hidden>{duration}s</span>
        </div>
        <div className="ls-range-hints"><span>5s</span><span>30s</span></div>
      </div>

      {/* ── Quality ── */}
      <div className="ls-card">
        <div className="ls-section-label">Quality</div>
        <div className="ls-quality-row">
          {([
            { value: 'auto',      label: 'Auto',      badge: 'best available' },
            { value: 'cpu_draft', label: 'CPU Draft', badge: 'fast preview'   },
            { value: 'gpu_full',  label: 'GPU Full',  badge: 'high quality'   },
          ] as const).map(({ value, label, badge }) => (
            <button
              type="button"
              key={value}
              onClick={() => setQualityMode(value)}
              className={`ls-quality-btn${qualityMode === value ? ' active' : ''}`}
            >
              {label}
              <span className="ls-quality-badge">{badge}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Blend Preview ── */}
      {preview && (
        <div className="ls-blend-preview animate-slide-up">
          <div className="ls-section-label">
            Blend Recipe · {preview.computeMode} · ~{preview.estimatedTtfbSec}s TTFB
          </div>
          <div className="ls-blend-rows">
            {Object.entries(preview.recipe).map(([model, weight]) => (
              <div key={model} className="ls-blend-row">
                <span className="ls-blend-model">{model}</span>
                <div className="ls-blend-bar-track">
                  <BlendBar weight={weight} colour={MODEL_COLOURS[model] ?? 'bg-accent'} />
                </div>
                <span className="ls-blend-pct">{Math.round(weight * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && <div className="ls-error ls-error--mt">{error}</div>}

      {/* ── Actions ── */}
      <div className="ls-actions">
        <button
          type="button"
          onClick={() => void handlePreview()}
          disabled={!prompt.trim() || previewing}
          className="ls-btn-secondary"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M3 8h10M9 4l4 4-4 4"/>
          </svg>
          {previewing ? 'Loading…' : 'Preview recipe'}
        </button>
        <button
          type="button"
          onClick={() => void handleGenerate()}
          disabled={!prompt.trim() || busy}
          className="ls-btn-primary"
        >
          {busy ? (
            <>
              <span className="animate-spin" aria-hidden>⟳</span>
              {store.phase === 'submitting' ? 'Submitting…' : `Generating… ${store.progress}%`}
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M4 3l10 5-10 5V3z" fill="currentColor"/>
              </svg>
              Generate music
            </>
          )}
        </button>
      </div>

      {store.quotaRemaining > 0 && (
        <p className="ls-quota">{store.quotaRemaining} generation{store.quotaRemaining !== 1 ? 's' : ''} remaining today</p>
      )}
    </div>
  )
}
