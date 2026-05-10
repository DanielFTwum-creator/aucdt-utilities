import { X, CheckCircle, AlertTriangle, ShieldAlert, Flag, UserX } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Examinee, Alert, AuditEntry, AlertType } from '../../types/proctoring'
import { ALERT_META } from '../../types/proctoring'

interface SessionSummaryModalProps {
  examinees: Examinee[]
  alerts: Alert[]
  auditLog: AuditEntry[]
  sessionName: string
  onClose: () => void
}

function countByType(alerts: Alert[]): Partial<Record<AlertType, number>> {
  return alerts.reduce<Partial<Record<AlertType, number>>>((acc, a) => {
    acc[a.type] = (acc[a.type] ?? 0) + 1
    return acc
  }, {})
}

export function SessionSummaryModal({ examinees, alerts, auditLog, sessionName, onClose }: SessionSummaryModalProps) {
  const totalAlerts   = alerts.length
  const flaggedCount  = examinees.filter(e => e.flagged).length
  const ejectedCount  = examinees.filter(e => e.status === 'EJECTED').length
  const byType        = countByType(alerts)
  const alertTypes    = Object.entries(byType) as [AlertType, number][]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 text-gray-500"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Session Complete</h3>
          </div>
          <p className="text-sm text-gray-500">{sessionName}</p>
        </div>

        {/* Stats */}
        <div className="px-6 py-4 grid grid-cols-2 gap-3">
          <StatCard icon={<AlertTriangle className="w-4 h-4 text-amber-600" />} label="Total Alerts" value={totalAlerts} bg="bg-amber-50" />
          <StatCard icon={<ShieldAlert className="w-4 h-4 text-blue-600" />} label="Examinees" value={examinees.length} bg="bg-blue-50" />
          <StatCard icon={<Flag className="w-4 h-4 text-orange-600" />} label="Flagged" value={flaggedCount} bg="bg-orange-50" />
          <StatCard icon={<UserX className="w-4 h-4 text-red-600" />} label="Ejected" value={ejectedCount} bg="bg-red-50" />
        </div>

        {/* Alert breakdown */}
        {alertTypes.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Alerts by Type</p>
            <div className="space-y-2">
              {alertTypes.map(([type, count]) => {
                const meta = ALERT_META[type]
                return (
                  <div key={type} className="flex items-center justify-between text-sm">
                    <span className={`font-medium ${meta.textColor}`}>{meta.label}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${meta.bgColor} ${meta.textColor}`}>{count}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Audit summary */}
        <div className="px-6 py-4 border-t border-gray-100">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Audit Log</p>
          <p className="text-sm text-gray-600">{auditLog.length} recorded actions during this session.</p>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              const data = JSON.stringify({ examinees, alerts, auditLog }, null, 2)
              const blob = new Blob([data], { type: 'application/json' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = `session-report-${Date.now()}.json`
              a.click()
              URL.revokeObjectURL(url)
            }}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          >
            Export JSON
          </button>
        </div>
      </motion.div>
    </div>
  )
}

function StatCard({ icon, label, value, bg }: { icon: React.ReactNode; label: string; value: number; bg: string }) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl ${bg}`}>
      {icon}
      <div>
        <p className="text-xl font-bold text-gray-900 leading-none">{value}</p>
        <p className="text-xs text-gray-500 mt-0.5">{label}</p>
      </div>
    </div>
  )
}
