/**
 * useAudioPlayer — streams PCM audio chunks via the Web Audio API.
 *
 * Pipeline:
 *   base64 chunks → PCM Int16 → Float32 AudioBuffer → AudioContext queue
 *
 * Playback begins automatically after BUFFER_AHEAD_CHUNKS are buffered.
 * Exposes an AnalyserNode for waveform visualisation in StreamPlayer.
 */
import { useRef, useCallback, useState, useEffect } from 'react'
import type { AudioChunkEvent } from '@/types'

const SAMPLE_RATE        = 32000   // AIM outputs 32 kHz PCM
const BUFFER_AHEAD_CHUNKS = 2      // chunks buffered before auto-play starts

interface AudioPlayerState {
  isPlaying:    boolean
  isBuffering:  boolean
  currentTime:  number
  duration:     number
  volume:       number
}

export function useAudioPlayer() {
  const ctxRef      = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const gainRef     = useRef<GainNode | null>(null)
  const queueRef    = useRef<AudioBuffer[]>([])
  const nextTimeRef = useRef(0)   // scheduled end time of last buffer
  const chunkCountRef = useRef(0)

  const [state, setState] = useState<AudioPlayerState>({
    isPlaying:   false,
    isBuffering: true,
    currentTime: 0,
    duration:    0,
    volume:      0.85,
  })

  // ── AudioContext init (deferred to first user gesture) ───────────────────
  const ensureContext = useCallback(() => {
    if (ctxRef.current) return ctxRef.current

    const ctx      = new AudioContext({ sampleRate: SAMPLE_RATE })
    const analyser = ctx.createAnalyser()
    const gain     = ctx.createGain()

    analyser.fftSize        = 2048
    analyser.smoothingTimeConstant = 0.8

    gain.gain.value = state.volume
    gain.connect(analyser)
    analyser.connect(ctx.destination)

    ctxRef.current   = ctx
    analyserRef.current = analyser
    gainRef.current  = gain
    nextTimeRef.current = ctx.currentTime

    return ctx
  }, [state.volume])

  // ── Decode and schedule a chunk ───────────────────────────────────────────
  const pushChunk = useCallback((event: AudioChunkEvent) => {
    const ctx = ensureContext()

    // Decode base64 → Int16 PCM → Float32
    const binary  = atob(event.data)
    const bytes   = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)

    const int16   = new Int16Array(bytes.buffer)
    const float32 = new Float32Array(int16.length)
    for (let i = 0; i < int16.length; i++) float32[i] = int16[i] / 32767

    const buffer  = ctx.createBuffer(1, float32.length, SAMPLE_RATE)
    buffer.copyToChannel(float32, 0)

    queueRef.current.push(buffer)
    chunkCountRef.current++

    // Begin playback once we have enough buffered
    if (chunkCountRef.current >= BUFFER_AHEAD_CHUNKS) {
      setState(s => ({ ...s, isBuffering: false, isPlaying: true }))
      _drainQueue(ctx)
    }
  }, [ensureContext])

  const _drainQueue = useCallback((ctx: AudioContext) => {
    while (queueRef.current.length > 0) {
      const buf    = queueRef.current.shift()!
      const source = ctx.createBufferSource()
      source.buffer = buf
      source.connect(gainRef.current!)

      // Schedule immediately after previous buffer ends
      const startAt = Math.max(nextTimeRef.current, ctx.currentTime)
      source.start(startAt)
      nextTimeRef.current = startAt + buf.duration

      source.onended = () => {
        setState(s => ({ ...s, currentTime: ctx.currentTime }))
      }
    }
  }, [])

  // Drain queue when new chunks arrive during active playback
  useEffect(() => {
    if (state.isPlaying && ctxRef.current) {
      _drainQueue(ctxRef.current)
    }
  })

  // ── Controls ──────────────────────────────────────────────────────────────
  const pause = useCallback(() => {
    void ctxRef.current?.suspend()
    setState(s => ({ ...s, isPlaying: false }))
  }, [])

  const resume = useCallback(() => {
    const ctx = ensureContext()
    void ctx.resume()
    setState(s => ({ ...s, isPlaying: true }))
  }, [ensureContext])

  const setVolume = useCallback((vol: number) => {
    if (gainRef.current) gainRef.current.gain.value = vol
    setState(s => ({ ...s, volume: vol }))
  }, [])

  const reset = useCallback(() => {
    void ctxRef.current?.close()
    ctxRef.current      = null
    analyserRef.current = null
    gainRef.current     = null
    queueRef.current    = []
    chunkCountRef.current = 0
    nextTimeRef.current   = 0
    setState({ isPlaying: false, isBuffering: true, currentTime: 0, duration: 0, volume: 0.85 })
  }, [])

  // ── Waveform data for canvas visualiser ──────────────────────────────────
  const getWaveformData = useCallback((): Float32Array | null => {
    const analyser = analyserRef.current
    if (!analyser) return null
    const data = new Float32Array(analyser.frequencyBinCount)
    analyser.getFloatTimeDomainData(data)
    return data
  }, [])

  const getFrequencyData = useCallback((): Uint8Array | null => {
    const analyser = analyserRef.current
    if (!analyser) return null
    const data = new Uint8Array(analyser.frequencyBinCount)
    analyser.getByteFrequencyData(data)
    return data
  }, [])

  return {
    pushChunk,
    pause,
    resume,
    setVolume,
    reset,
    getWaveformData,
    getFrequencyData,
    analyser: analyserRef.current,
    ...state,
  }
}
