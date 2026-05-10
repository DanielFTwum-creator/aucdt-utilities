import { useReducer, useEffect, useRef } from 'react'
import type {
  Examinee, Alert, AuditEntry, Session,
  AlertSeverity, InterventionAction,
} from '../types/proctoring'
import { MOCK_SESSION, MOCK_EXAMINEES, INITIAL_ALERTS, generateRandomAlert, LIVE_COUNT } from '../data/mockData'

export interface ProctoringState {
  session: Session
  examinees: Examinee[]
  alerts: Alert[]
  auditLog: AuditEntry[]
  focusedExamineeId: string | null
  interventionTarget: { examineeId: string; action: InterventionAction } | null
  showSummary: boolean
  gridCols: number
  liveCount: number
}

type Action =
  | { type: 'SIMULATION_ALERT'; alert: Alert }
  | { type: 'ACKNOWLEDGE_ALERT'; alertId: string }
  | { type: 'DISMISS_ALERT'; alertId: string; reason: string }
  | { type: 'FOCUS_EXAMINEE'; id: string | null }
  | { type: 'OPEN_INTERVENTION'; examineeId: string; action: InterventionAction }
  | { type: 'CLOSE_INTERVENTION' }
  | { type: 'EXECUTE_INTERVENTION'; examineeId: string; action: InterventionAction; details: string }
  | { type: 'SESSION_PAUSE' }
  | { type: 'SESSION_RESUME' }
  | { type: 'SESSION_END' }
  | { type: 'CLOSE_SUMMARY' }
  | { type: 'SET_GRID_COLS'; cols: number }

function topSeverity(alerts: Alert[], examineeId: string): AlertSeverity {
  const active = alerts.filter(a => a.examineeId === examineeId && a.status === 'ACTIVE')
  if (active.some(a => a.severity === 'CRITICAL')) return 'CRITICAL'
  if (active.some(a => a.severity === 'HIGH'))     return 'HIGH'
  if (active.some(a => a.severity === 'MEDIUM'))   return 'MEDIUM'
  return 'NORMAL'
}

function audit(
  action: AuditEntry['action'],
  details: string,
  examineeId?: string,
  examineeName?: string,
): AuditEntry {
  return {
    id: `aud-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: new Date(),
    action,
    examineeId,
    examineeName,
    details,
  }
}

function reducer(state: ProctoringState, action: Action): ProctoringState {
  switch (action.type) {
    case 'SIMULATION_ALERT': {
      const alerts = [action.alert, ...state.alerts]
      const examinees = state.examinees.map(e =>
        e.id === action.alert.examineeId
          ? { ...e, alertSeverity: topSeverity(alerts, e.id) }
          : e,
      )
      return { ...state, alerts, examinees }
    }

    case 'ACKNOWLEDGE_ALERT': {
      const alerts = state.alerts.map(a =>
        a.id === action.alertId ? { ...a, status: 'ACKNOWLEDGED' as const } : a,
      )
      const examinees = state.examinees.map(e => ({
        ...e,
        alertSeverity: topSeverity(alerts, e.id),
      }))
      return { ...state, alerts, examinees }
    }

    case 'DISMISS_ALERT': {
      const alerts = state.alerts.map(a =>
        a.id === action.alertId
          ? { ...a, status: 'DISMISSED' as const, dismissReason: action.reason }
          : a,
      )
      const examinees = state.examinees.map(e => ({
        ...e,
        alertSeverity: topSeverity(alerts, e.id),
      }))
      const entry = audit('SESSION_RESUME', `Alert dismissed: ${action.reason || 'no reason given'}`)
      return { ...state, alerts, examinees, auditLog: [entry, ...state.auditLog] }
    }

    case 'FOCUS_EXAMINEE':
      return { ...state, focusedExamineeId: action.id }

    case 'OPEN_INTERVENTION':
      return { ...state, interventionTarget: { examineeId: action.examineeId, action: action.action } }

    case 'CLOSE_INTERVENTION':
      return { ...state, interventionTarget: null }

    case 'EXECUTE_INTERVENTION': {
      const examinee = state.examinees.find(e => e.id === action.examineeId)
      if (!examinee) return state

      let examinees = state.examinees
      if (action.action === 'FLAG') {
        examinees = examinees.map(e =>
          e.id === action.examineeId ? { ...e, flagged: true, status: 'FLAGGED' as const } : e,
        )
      } else if (action.action === 'EJECT') {
        examinees = examinees.map(e =>
          e.id === action.examineeId ? { ...e, status: 'EJECTED' as const, alertSeverity: 'NORMAL' as const } : e,
        )
      }

      const entry = audit(
        action.action,
        action.details,
        examinee.id,
        examinee.name,
      )
      return {
        ...state,
        examinees,
        auditLog: [entry, ...state.auditLog],
        interventionTarget: null,
      }
    }

    case 'SESSION_PAUSE': {
      const entry = audit('SESSION_PAUSE', 'Session paused by proctor')
      return {
        ...state,
        session: { ...state.session, state: 'PAUSED' },
        auditLog: [entry, ...state.auditLog],
      }
    }

    case 'SESSION_RESUME': {
      const entry = audit('SESSION_RESUME', 'Session resumed by proctor')
      return {
        ...state,
        session: { ...state.session, state: 'ACTIVE' },
        auditLog: [entry, ...state.auditLog],
      }
    }

    case 'SESSION_END': {
      const entry = audit('SESSION_END', 'Session ended by proctor')
      return {
        ...state,
        session: { ...state.session, state: 'ENDED' },
        showSummary: true,
        auditLog: [entry, ...state.auditLog],
      }
    }

    case 'CLOSE_SUMMARY':
      return { ...state, showSummary: false }

    case 'SET_GRID_COLS':
      return { ...state, gridCols: action.cols }

    default:
      return state
  }
}

const INITIAL_STATE: ProctoringState = {
  session: MOCK_SESSION,
  examinees: MOCK_EXAMINEES,
  alerts: INITIAL_ALERTS,
  auditLog: [],
  focusedExamineeId: null,
  interventionTarget: null,
  showSummary: false,
  gridCols: 4,
  liveCount: LIVE_COUNT,
}

export function useProctoringStore() {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)
  const examineesRef = useRef(state.examinees)
  examineesRef.current = state.examinees
  const sessionStateRef = useRef(state.session.state)
  sessionStateRef.current = state.session.state

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>

    const schedule = () => {
      const delay = 9000 + Math.random() * 11000
      timeoutId = setTimeout(() => {
        if (sessionStateRef.current === 'ACTIVE') {
          const alert = generateRandomAlert(examineesRef.current)
          dispatch({ type: 'SIMULATION_ALERT', alert })
        }
        schedule()
      }, delay)
    }

    schedule()
    return () => clearTimeout(timeoutId)
  }, [])

  return { state, dispatch }
}
