export type AlertSeverity = 'NORMAL' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
export type AlertType =
  | 'ALERT_MFA'
  | 'ALERT_TSA'
  | 'ALERT_NO_FACE'
  | 'ALERT_AUDIO'
  | 'ALERT_PHONE'
  | 'ALERT_ID_MISMATCH'
export type AlertStatus = 'ACTIVE' | 'ACKNOWLEDGED' | 'DISMISSED'
export type SessionState = 'SCHEDULED' | 'ACTIVE' | 'PAUSED' | 'ENDED'
export type InterventionAction = 'WARN' | 'CHAT' | 'FLAG' | 'EJECT' | 'REQUEST_ID'
export type ExamineeStatus = 'ONLINE' | 'OFFLINE' | 'FLAGGED' | 'EJECTED'

export interface Examinee {
  id: string
  segmentId: string
  name: string
  examId: string
  status: ExamineeStatus
  alertSeverity: AlertSeverity
  flagged: boolean
  colorIndex: number
  joinedAt: Date
}

export interface Alert {
  id: string
  type: AlertType
  severity: AlertSeverity
  examineeId: string
  examineeName: string
  segmentId: string
  examId: string
  confidence: number
  timestamp: Date
  status: AlertStatus
  dismissReason?: string
}

export interface AuditEntry {
  id: string
  timestamp: Date
  action: InterventionAction | 'SESSION_START' | 'SESSION_PAUSE' | 'SESSION_RESUME' | 'SESSION_END'
  examineeId?: string
  examineeName?: string
  details: string
}

export interface Session {
  id: string
  name: string
  state: SessionState
  startedAt: Date
  scheduledDuration: number
}

export interface AlertMeta {
  label: string
  shortLabel: string
  bgColor: string
  textColor: string
  borderColor: string
  dotColor: string
}

export const ALERT_META: Record<AlertType, AlertMeta> = {
  ALERT_MFA: {
    label: 'Multi-Face Alert',
    shortLabel: 'MFA',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-200',
    dotColor: 'bg-amber-500',
  },
  ALERT_TSA: {
    label: 'Tab Switch Alert',
    shortLabel: 'TSA',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    borderColor: 'border-red-200',
    dotColor: 'bg-red-500',
  },
  ALERT_NO_FACE: {
    label: 'No Face Detected',
    shortLabel: 'NFA',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    borderColor: 'border-red-200',
    dotColor: 'bg-red-500',
  },
  ALERT_AUDIO: {
    label: 'Suspicious Audio',
    shortLabel: 'AUD',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
    borderColor: 'border-orange-200',
    dotColor: 'bg-orange-500',
  },
  ALERT_PHONE: {
    label: 'Device Detected',
    shortLabel: 'DEV',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
    borderColor: 'border-orange-200',
    dotColor: 'bg-orange-500',
  },
  ALERT_ID_MISMATCH: {
    label: 'Identity Mismatch',
    shortLabel: 'IDM',
    bgColor: 'bg-red-50',
    textColor: 'text-red-800',
    borderColor: 'border-red-300',
    dotColor: 'bg-red-600',
  },
}
