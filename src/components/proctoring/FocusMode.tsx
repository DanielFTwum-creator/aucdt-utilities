import { X, AlertTriangle, ShieldAlert, EyeOff, Mic, Smartphone, ShieldX } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Examinee, Alert, AlertType, InterventionAction } from '../../types/proctoring'
import { ALERT_META } from '../../types/proctoring'
import { VideoCanvas } from './VideoCanvas'

const ALERT_ICONS: Record<AlertType, React.ReactNode> = {
  ALERT_MFA:          <AlertTriangle className="w-3.5 h-3.5" />,
  ALERT_TSA:          <ShieldAlert className="w-3.5 h-3.5" />,
  ALERT_NO_FACE:      <EyeOff className="w-3.5 h-3.5" />,
  ALERT_AUDIO:        <Mic className="w-3.5 h-3.5" />,
  ALERT_PHONE:        <Smartphone className="w-3.5 h-3.5" />,
  ALERT_ID_MISMATCH:  <ShieldX className="w-3.5 h-3.5" />,
}

function timeStr(date: Date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

interface FocusModeProps {
  examinee: Examinee
  alertHistory: Alert[]
  paused: boolean
  onClose: () => void
  onIntervene: (action: InterventionAction) => void
}

const INTERVENTIONS: { action: InterventionAction; label: string; style: string }[] = [
  { action: 'WARN',       label: 'Warn',        style: 'bg-amber-100 text-amber-700 hover:bg-amber-200 border border-amber-200' },
  { action: 'REQUEST_ID', label: 'Request ID',  style: 'bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-200' },
  { action: 'FLAG',       label: 'Flag',        style: 'bg-orange-100 text-orange-700 hover:bg-orange-200 border border-orange-200' },
  { action: 'CHAT',       label: 'Chat',        style: 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200' },
  { action: 'EJECT',      label: 'Eject',       style: 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-200' },
]

export function FocusMode({ examinee, alertHistory, paused, onClose, onIntervene }: FocusModeProps) {
  const examineeAlerts = alertHistory.filter(a => a.examineeId === examinee.id)
  const activeAlerts   = examineeAlerts.filter(a => a.status === 'ACTIVE')

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

        {/* Panel */}
        <motion.div
          className="relative z-10 w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Left: video */}
          <div className="relative md:w-3/5 aspect-video bg-gray-900">
            <VideoCanvas colorIndex={examinee.colorIndex} paused={paused} />

            {/* Active alert overlay */}
            {activeAlerts.length > 0 && (
              <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                {activeAlerts.map(a => {
                  const meta = ALERT_META[a.type]
                  return (
                    <div
                      key={a.id}
                      className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${meta.bgColor} ${meta.textColor} ${meta.borderColor}`}
                    >
                      {ALERT_ICONS[a.type]}
                      {meta.label}
                      <span className="opacity-60">·</span>
                      <span className="opacity-70">{Math.round(a.confidence * 100)}%</span>
                    </div>
                  )
                })}
              </div>
            )}

            {/* LIVE badge */}
            <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-red-600/90 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse inline-block" />
              LIVE
            </div>

            {/* Examinee info */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-4 pb-4 pt-8">
              <p className="text-white font-semibold">{examinee.name}</p>
              <p className="text-white/60 text-sm">{examinee.segmentId} · {examinee.examId}</p>
            </div>
          </div>

          {/* Right: controls + history */}
          <div className="md:w-2/5 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Proctor Controls</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {examinee.flagged ? '⚑ Flagged for review' : 'No flags'} · {activeAlerts.length} active alert{activeAlerts.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Intervention buttons */}
            <div className="px-5 py-4 border-b border-gray-100">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Interventions</p>
              <div className="grid grid-cols-2 gap-2">
                {INTERVENTIONS.map(({ action, label, style }) => (
                  <button
                    key={action}
                    onClick={() => onIntervene(action)}
                    disabled={examinee.status === 'EJECTED'}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${style}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Alert history */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                Alert History ({examineeAlerts.length})
              </p>
              {examineeAlerts.length === 0 ? (
                <p className="text-sm text-gray-400">No alerts for this session</p>
              ) : (
                <div className="space-y-2">
                  {examineeAlerts.map(alert => {
                    const meta = ALERT_META[alert.type]
                    return (
                      <div
                        key={alert.id}
                        className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-xs ${
                          alert.status === 'ACTIVE' ? `${meta.bgColor} ${meta.borderColor}` : 'bg-gray-50 border-gray-100'
                        }`}
                      >
                        <span className={alert.status === 'ACTIVE' ? meta.textColor : 'text-gray-400'}>
                          {ALERT_ICONS[alert.type]}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium ${alert.status === 'ACTIVE' ? meta.textColor : 'text-gray-500'}`}>
                            {meta.label}
                          </p>
                          <p className="text-gray-400">{timeStr(alert.timestamp)}</p>
                        </div>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                          alert.status === 'ACTIVE'      ? 'bg-red-100 text-red-600' :
                          alert.status === 'ACKNOWLEDGED' ? 'bg-blue-100 text-blue-600' :
                          'bg-gray-100 text-gray-500'
                        }`}>
                          {alert.status}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
