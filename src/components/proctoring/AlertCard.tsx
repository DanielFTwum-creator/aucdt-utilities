import { AlertTriangle, ShieldAlert, EyeOff, Mic, Smartphone, ShieldX, X, Check, ZoomIn } from 'lucide-react'
import type { Alert, AlertType } from '../../types/proctoring'
import { ALERT_META } from '../../types/proctoring'

const ALERT_ICONS: Record<AlertType, React.ReactNode> = {
  ALERT_MFA:          <AlertTriangle className="w-4 h-4" />,
  ALERT_TSA:          <ShieldAlert className="w-4 h-4" />,
  ALERT_NO_FACE:      <EyeOff className="w-4 h-4" />,
  ALERT_AUDIO:        <Mic className="w-4 h-4" />,
  ALERT_PHONE:        <Smartphone className="w-4 h-4" />,
  ALERT_ID_MISMATCH:  <ShieldX className="w-4 h-4" />,
}

function timeAgo(date: Date): string {
  const secs = Math.floor((Date.now() - date.getTime()) / 1000)
  if (secs < 60) return `${secs}s ago`
  return `${Math.floor(secs / 60)}m ago`
}

interface AlertCardProps {
  alert: Alert
  onAcknowledge: () => void
  onDismiss: () => void
  onFocus: () => void
}

export function AlertCard({ alert, onAcknowledge, onDismiss, onFocus }: AlertCardProps) {
  const meta = ALERT_META[alert.type]

  return (
    <div className={`flex-shrink-0 flex items-start gap-3 px-4 py-3 rounded-xl border ${meta.bgColor} ${meta.borderColor} min-w-[200px] max-w-[240px]`}>
      <div className={`mt-0.5 flex-shrink-0 ${meta.textColor}`}>
        {ALERT_ICONS[alert.type]}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold leading-tight ${meta.textColor}`}>
          {meta.label}
        </p>
        <p className="text-xs text-gray-500 mt-0.5 truncate">
          {alert.segmentId} · {alert.examId}
        </p>
        <p className="text-[10px] text-gray-400 mt-0.5">{timeAgo(alert.timestamp)}</p>
      </div>
      <div className="flex flex-col gap-1 flex-shrink-0">
        <button
          onClick={onFocus}
          className="p-1 rounded hover:bg-black/10 text-gray-500 hover:text-gray-700 transition-colors"
          title="Focus examinee"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onAcknowledge}
          className="p-1 rounded hover:bg-black/10 text-gray-500 hover:text-green-700 transition-colors"
          title="Acknowledge"
        >
          <Check className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onDismiss}
          className="p-1 rounded hover:bg-black/10 text-gray-500 hover:text-red-700 transition-colors"
          title="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
