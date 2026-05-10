import { User, Flag, AlertTriangle } from 'lucide-react'
import type { Examinee, Alert } from '../../types/proctoring'
import { ALERT_META } from '../../types/proctoring'
import { VideoCanvas } from './VideoCanvas'

interface VideoTileProps {
  examinee: Examinee
  activeAlerts: Alert[]
  paused: boolean
  onClick: () => void
}

function borderClass(examinee: Examinee): string {
  if (examinee.status === 'EJECTED') return 'border-gray-500'
  switch (examinee.alertSeverity) {
    case 'CRITICAL': return 'border-red-600 shadow-red-500/40 shadow-lg'
    case 'HIGH':     return 'border-red-400'
    case 'MEDIUM':   return 'border-amber-400'
    default:         return 'border-transparent'
  }
}

function statusDotClass(examinee: Examinee): string {
  if (examinee.status === 'EJECTED') return 'bg-gray-400'
  switch (examinee.alertSeverity) {
    case 'CRITICAL':
    case 'HIGH':   return 'bg-red-500'
    case 'MEDIUM': return 'bg-amber-500'
    default:       return 'bg-green-500'
  }
}

export function VideoTile({ examinee, activeAlerts, paused, onClick }: VideoTileProps) {
  const topAlert = activeAlerts[0]
  const isEjected = examinee.status === 'EJECTED'

  return (
    <div
      className={`relative aspect-video rounded-xl overflow-hidden border-2 cursor-pointer group transition-all duration-300 ${borderClass(examinee)}`}
      onClick={isEjected ? undefined : onClick}
      title={isEjected ? 'Examinee ejected' : `Click to focus — ${examinee.name}`}
    >
      <VideoCanvas colorIndex={examinee.colorIndex} paused={paused || isEjected} />

      {/* Person silhouette */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <User className="w-14 h-14 text-white/15" strokeWidth={1} />
      </div>

      {/* LIVE badge */}
      {!isEjected && (
        <div className="absolute top-2 left-2 flex items-center gap-1 bg-red-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse inline-block" />
          LIVE
        </div>
      )}

      {/* Ejected overlay */}
      {isEjected && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <span className="text-white/70 text-xs font-semibold bg-black/50 px-3 py-1 rounded-full">EJECTED</span>
        </div>
      )}

      {/* Status dot */}
      <div className="absolute top-2 right-2">
        <span className={`w-3 h-3 rounded-full block ${statusDotClass(examinee)} ${examinee.alertSeverity !== 'NORMAL' ? 'animate-pulse' : ''}`} />
      </div>

      {/* Alert badge */}
      {topAlert && !isEjected && (
        <div className={`absolute top-2 right-7 flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded ${ALERT_META[topAlert.type].bgColor} ${ALERT_META[topAlert.type].textColor}`}>
          <AlertTriangle className="w-2.5 h-2.5" />
          {ALERT_META[topAlert.type].shortLabel}
        </div>
      )}

      {/* Flag indicator */}
      {examinee.flagged && !isEjected && (
        <div className="absolute bottom-8 right-2">
          <Flag className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
        </div>
      )}

      {/* Bottom info bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-3 py-2">
        <p className="text-white text-xs font-semibold truncate leading-tight">{examinee.name}</p>
        <p className="text-white/60 text-[10px]">{examinee.segmentId} · {examinee.examId}</p>
      </div>

      {/* Hover focus overlay */}
      {!isEjected && (
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs bg-black/60 px-3 py-1 rounded-full font-medium">
            Focus View
          </span>
        </div>
      )}
    </div>
  )
}
