import type { Examinee, Alert, AlertType, AlertSeverity, Session } from '../types/proctoring'

export const MOCK_SESSION: Session = {
  id: 'SES-2026-001',
  name: 'Final Examinations 2026',
  state: 'ACTIVE',
  startedAt: new Date(Date.now() - 45 * 60 * 1000),
  scheduledDuration: 120,
}

export const MOCK_EXAMINEES: Examinee[] = [
  { id: 'e1', segmentId: 'S1', name: 'Kwame Asante',     examId: 'Exam 1247', status: 'ONLINE',  alertSeverity: 'NORMAL', flagged: false, colorIndex: 0, joinedAt: new Date(Date.now() - 44 * 60 * 1000) },
  { id: 'e2', segmentId: 'S2', name: 'Amara Diallo',     examId: 'Exam 1247', status: 'FLAGGED', alertSeverity: 'HIGH',   flagged: true,  colorIndex: 1, joinedAt: new Date(Date.now() - 44 * 60 * 1000) },
  { id: 'e3', segmentId: 'S3', name: 'Yaw Mensah',       examId: 'Exam 1248', status: 'ONLINE',  alertSeverity: 'HIGH',   flagged: false, colorIndex: 2, joinedAt: new Date(Date.now() - 43 * 60 * 1000) },
  { id: 'e4', segmentId: 'S4', name: 'Aisha Osei',       examId: 'Exam 1248', status: 'ONLINE',  alertSeverity: 'NORMAL', flagged: false, colorIndex: 3, joinedAt: new Date(Date.now() - 43 * 60 * 1000) },
  { id: 'e5', segmentId: 'S5', name: 'Kofi Boateng',     examId: 'Exam 1249', status: 'ONLINE',  alertSeverity: 'NORMAL', flagged: false, colorIndex: 4, joinedAt: new Date(Date.now() - 42 * 60 * 1000) },
  { id: 'e6', segmentId: 'S6', name: 'Fatima Traore',    examId: 'Exam 1249', status: 'ONLINE',  alertSeverity: 'NORMAL', flagged: false, colorIndex: 5, joinedAt: new Date(Date.now() - 42 * 60 * 1000) },
  { id: 'e7', segmentId: 'S7', name: 'Emmanuel Nkrumah', examId: 'Exam 1250', status: 'ONLINE',  alertSeverity: 'NORMAL', flagged: false, colorIndex: 6, joinedAt: new Date(Date.now() - 41 * 60 * 1000) },
  { id: 'e8', segmentId: 'S8', name: 'Serena Adjei',     examId: 'Exam 1250', status: 'ONLINE',  alertSeverity: 'NORMAL', flagged: false, colorIndex: 7, joinedAt: new Date(Date.now() - 41 * 60 * 1000) },
]

export const INITIAL_ALERTS: Alert[] = [
  {
    id: 'alert-init-1',
    type: 'ALERT_MFA',
    severity: 'HIGH',
    examineeId: 'e2',
    examineeName: 'Amara Diallo',
    segmentId: 'S2',
    examId: 'Exam 1247',
    confidence: 0.87,
    timestamp: new Date(Date.now() - 3 * 60 * 1000),
    status: 'ACTIVE',
  },
  {
    id: 'alert-init-2',
    type: 'ALERT_TSA',
    severity: 'HIGH',
    examineeId: 'e3',
    examineeName: 'Yaw Mensah',
    segmentId: 'S3',
    examId: 'Exam 1248',
    confidence: 0.95,
    timestamp: new Date(Date.now() - 60 * 1000),
    status: 'ACTIVE',
  },
]

const ALERT_POOL: { type: AlertType; severity: AlertSeverity }[] = [
  { type: 'ALERT_MFA',      severity: 'HIGH' },
  { type: 'ALERT_MFA',      severity: 'HIGH' },
  { type: 'ALERT_TSA',      severity: 'HIGH' },
  { type: 'ALERT_TSA',      severity: 'HIGH' },
  { type: 'ALERT_NO_FACE',  severity: 'HIGH' },
  { type: 'ALERT_AUDIO',    severity: 'MEDIUM' },
  { type: 'ALERT_PHONE',    severity: 'MEDIUM' },
]

export function generateRandomAlert(examinees: Examinee[]): Alert {
  const online = examinees.filter(e => e.status === 'ONLINE' || e.status === 'FLAGGED')
  if (online.length === 0) return generateRandomAlert(examinees.slice())
  const examinee = online[Math.floor(Math.random() * online.length)]
  const { type, severity } = ALERT_POOL[Math.floor(Math.random() * ALERT_POOL.length)]
  return {
    id: `alert-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type,
    severity,
    examineeId: examinee.id,
    examineeName: examinee.name,
    segmentId: examinee.segmentId,
    examId: examinee.examId,
    confidence: 0.70 + Math.random() * 0.28,
    timestamp: new Date(),
    status: 'ACTIVE',
  }
}

export const LIVE_COUNT = 1247
