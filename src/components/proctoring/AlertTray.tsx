import { CheckCircle, Bell } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Alert } from '../../types/proctoring'
import { AlertCard } from './AlertCard'

interface AlertTrayProps {
  alerts: Alert[]
  liveCount: number
  onAcknowledge: (alertId: string) => void
  onDismiss: (alertId: string) => void
  onFocusExaminee: (examineeId: string) => void
}

export function AlertTray({ alerts, liveCount, onAcknowledge, onDismiss, onFocusExaminee }: AlertTrayProps) {
  const active = alerts.filter(a => a.status === 'ACTIVE')

  return (
    <div className="border-t border-gray-100 px-4 py-3 bg-gray-50/50">
      <div className="flex items-center gap-2 mb-2">
        <Bell className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          Active Alerts
        </span>
        {active.length > 0 && (
          <span className="text-xs bg-red-100 text-red-600 font-semibold px-1.5 py-0.5 rounded-full">
            {active.length}
          </span>
        )}
      </div>

      <div className="flex items-start gap-3 overflow-x-auto pb-1">
        <AnimatePresence initial={false}>
          {active.map(alert => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <AlertCard
                alert={alert}
                onAcknowledge={() => onAcknowledge(alert.id)}
                onDismiss={() => onDismiss(alert.id)}
                onFocus={() => onFocusExaminee(alert.examineeId)}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* System status card */}
        <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-xl border bg-green-50 border-green-200 min-w-[190px]">
          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-green-700 leading-tight">System Operational</p>
            <p className="text-xs text-green-600 font-medium mt-0.5">
              {liveCount.toLocaleString()} Live
            </p>
          </div>
        </div>

        {active.length === 0 && (
          <p className="text-sm text-gray-400 py-3 pl-1">No active alerts</p>
        )}
      </div>
    </div>
  )
}
