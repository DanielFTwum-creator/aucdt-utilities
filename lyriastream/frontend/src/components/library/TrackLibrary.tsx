import { useState, useEffect } from 'react'
import { tracks as trackApi, licences as licenceApi } from '@/services/api'
import type { Track, LicenceCertificate } from '@/types'

export function TrackLibrary() {
  const [trackList, setTrackList]   = useState<Track[]>([])
  const [loading, setLoading]       = useState(true)
  const [licence, setLicence]       = useState<LicenceCertificate | null>(null)
  const [licenceTrack, setLicenceTrack] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await trackApi.list()
      setTrackList(data.content ?? [])
    } catch { /* silent */ }
    finally { setLoading(false) }
  }

  useEffect(() => { void load() }, [])

  const handleDelete = async (uuid: string) => {
    if (!confirm('Delete this track? You have 30 days to recover it.')) return
    await trackApi.delete(uuid)
    setTrackList(prev => prev.filter(t => t.uuid !== uuid))
  }

  const handleLicence = async (uuid: string) => {
    setLicenceTrack(uuid)
    try {
      const { data } = await licenceApi.get(uuid)
      setLicence(data)
    } catch { setLicence(null) }
  }


  if (loading) return (
    <div className="flex items-center justify-center h-40 text-gray-500">
      <span className="animate-spin mr-2">⟳</span> Loading library…
    </div>
  )

  if (trackList.length === 0) return (
    <div className="text-center py-16 text-gray-600">
      <p className="text-4xl mb-3">🎵</p>
      <p>No tracks yet — generate your first one above!</p>
    </div>
  )

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {trackList.map(track => (
          <TrackCard
            key={track.uuid}
            track={track}
            onDelete={(uuid) => void handleDelete(uuid)}
            onLicence={(uuid) => void handleLicence(uuid)}
          />
        ))}
      </div>

      {/* ── Licence modal ── */}
      {licence && licenceTrack && (
        <LicenceModal
          cert={licence}
          onClose={() => { setLicence(null); setLicenceTrack(null) }}
        />
      )}
    </>
  )
}

// ── Track card ────────────────────────────────────────────────────────────────
function TrackCard({
  track, onDelete, onLicence,
}: {
  track: Track
  onDelete: (uuid: string) => void
  onLicence: (uuid: string) => void
}) {
  const fmtDuration = (s: number) => `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`

  return (
    <div className="rounded-xl bg-navy-800 border border-navy-700 p-4
                    hover:border-brand-600 transition-colors group animate-fade-in">
      {/* Artwork placeholder */}
      <div className="h-28 rounded-lg bg-gradient-to-br from-navy-700 to-brand-900
                      flex items-center justify-center mb-3 overflow-hidden">
        <span className="text-4xl opacity-50 group-hover:opacity-80 transition">🎵</span>
      </div>

      {/* Meta */}
      <p className="text-sm font-semibold text-white truncate">{track.title}</p>
      <p className="text-xs text-gray-500 mt-0.5 truncate">{track.prompt}</p>

      <div className="flex items-center gap-2 mt-2 flex-wrap">
        {track.genre && (
          <span className="px-2 py-0.5 bg-brand-900 text-brand-300 rounded-full text-[10px]">
            {track.genre}
          </span>
        )}
        <span className="text-[10px] text-gray-600 font-mono">
          {fmtDuration(track.durationSeconds)}
        </span>
        {track.tempoBpm && (
          <span className="text-[10px] text-gray-600">{track.tempoBpm} BPM</span>
        )}
        <span className={`text-[10px] px-1.5 rounded font-mono
          ${track.qualityMode === 'gpu_full' ? 'bg-green-900 text-green-300' : 'bg-gray-800 text-gray-400'}`}>
          {track.qualityMode}
        </span>
      </div>

      {/* Blend recipe mini-bar */}
      {track.blendRecipe && Object.keys(track.blendRecipe).length > 0 && (
        <div className="flex h-1.5 rounded-full overflow-hidden mt-3 gap-px">
          {Object.entries(track.blendRecipe).map(([m, w]) => (
            <div key={m} className="rounded-full" style={{
              flex: w,
              background: { musicgen_medium:'#0e7c6e', riffusion:'#7c3aed',
                            musicgen_large:'#1e6b3a', stable_audio_open:'#d97706',
                            audioldm2:'#2563eb' }[m] ?? '#0e7c6e',
            }} title={`${m}: ${Math.round(w * 100)}%`} />
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 mt-3">
        <a
          href={`/api/v1/audio/${track.uuid}/download?format=mp3`}
          download
          className="flex-1 text-center text-xs py-1.5 rounded-lg bg-navy-700
                     hover:bg-navy-600 text-gray-300 transition"
        >
          ⬇ MP3
        </a>
        <button
          onClick={() => onLicence(track.uuid)}
          title="View royalty-free licence"
          className="px-2.5 py-1.5 rounded-lg bg-navy-700 hover:bg-brand-800
                     text-gray-300 text-xs transition"
        >
          📜
        </button>
        <button
          onClick={() => onDelete(track.uuid)}
          className="px-2.5 py-1.5 rounded-lg bg-navy-700 hover:bg-red-900
                     text-gray-400 hover:text-red-300 text-xs transition"
        >
          🗑
        </button>
      </div>
    </div>
  )
}

// ── Licence modal ─────────────────────────────────────────────────────────────
function LicenceModal({ cert, onClose }: { cert: LicenceCertificate; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50
                 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-navy-800 rounded-2xl border border-brand-700 p-6 max-w-md w-full
                   animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white">📜 Royalty-Free Licence</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white">✕</button>
        </div>

        <div className="space-y-3 text-sm">
          <Row label="Licence UUID"  value={cert.licenceUuid} mono />
          <Row label="Track UUID"    value={cert.trackUuid}   mono />
          <Row label="Licence Type"  value={cert.licenceType} />
          <Row label="SPDX ID"       value={cert.spdxIdentifier} mono />
          <Row label="Issued"        value={new Date(cert.generationTimestamp).toLocaleString()} />
          <Row label="SHA-256"       value={cert.sha256Hash.slice(0, 16) + '…'} mono />
        </div>

        {cert.modelLicences?.length > 0 && (
          <div className="mt-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Model Licences</p>
            {cert.modelLicences.map(ml => (
              <div key={ml.modelId}
                   className="flex justify-between text-xs text-gray-400 py-1
                              border-b border-navy-700 last:border-0">
                <span>{ml.modelId}</span>
                <span className="font-mono text-brand-400">{ml.spdxIdentifier}</span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-5 p-3 rounded-lg bg-brand-900/40 border border-brand-800">
          <p className="text-xs text-brand-300">
            ✅ This track is royalty-free. You may use it commercially, distribute it,
            and modify it. S-Rail attribution required if Stable Audio model was used.
          </p>
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full py-2 rounded-lg bg-navy-700 hover:bg-navy-600
                     text-sm text-gray-300 transition"
        >
          Close
        </button>
      </div>
    </div>
  )
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-gray-500 flex-none">{label}</span>
      <span className={`text-gray-200 truncate text-right ${mono ? 'font-mono text-xs' : ''}`}>
        {value}
      </span>
    </div>
  )
}
