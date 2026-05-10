import { useProctoringStore } from '../../hooks/useProctoringStore'
import { DashboardHeader } from './DashboardHeader'
import { SessionControls } from './SessionControls'
import { VideoGrid } from './VideoGrid'
import { AlertTray } from './AlertTray'
import { FocusMode } from './FocusMode'
import { InterventionModal } from './InterventionModal'
import { SessionSummaryModal } from './SessionSummaryModal'

export default function ProctoringDashboard() {
  const { state, dispatch } = useProctoringStore()
  const {
    session, examinees, alerts, auditLog,
    focusedExamineeId, interventionTarget,
    showSummary, gridCols, liveCount,
  } = state

  const focusedExaminee  = focusedExamineeId ? examinees.find(e => e.id === focusedExamineeId) : undefined
  const interventionExaminee = interventionTarget ? examinees.find(e => e.id === interventionTarget.examineeId) : undefined
  const isPaused = session.state === 'PAUSED'

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 flex items-start justify-center">
      <div className="w-full max-w-7xl bg-white rounded-2xl shadow-xl overflow-hidden">

        <DashboardHeader session={session} liveCount={liveCount} />

        <SessionControls
          session={session}
          gridCols={gridCols}
          onPause={() => dispatch({ type: 'SESSION_PAUSE' })}
          onResume={() => dispatch({ type: 'SESSION_RESUME' })}
          onEnd={() => dispatch({ type: 'SESSION_END' })}
          onGridColsChange={cols => dispatch({ type: 'SET_GRID_COLS', cols })}
        />

        <div className="p-4 md:p-6">
          <VideoGrid
            examinees={examinees}
            alerts={alerts}
            gridCols={gridCols}
            paused={isPaused}
            onFocusExaminee={id => dispatch({ type: 'FOCUS_EXAMINEE', id })}
          />
        </div>

        <AlertTray
          alerts={alerts}
          liveCount={liveCount}
          onAcknowledge={alertId => dispatch({ type: 'ACKNOWLEDGE_ALERT', alertId })}
          onDismiss={alertId => dispatch({ type: 'DISMISS_ALERT', alertId, reason: 'Dismissed by proctor' })}
          onFocusExaminee={examineeId => dispatch({ type: 'FOCUS_EXAMINEE', id: examineeId })}
        />
      </div>

      {/* Focus mode overlay */}
      {focusedExaminee && (
        <FocusMode
          examinee={focusedExaminee}
          alertHistory={alerts}
          paused={isPaused}
          onClose={() => dispatch({ type: 'FOCUS_EXAMINEE', id: null })}
          onIntervene={action => {
            dispatch({ type: 'FOCUS_EXAMINEE', id: null })
            dispatch({ type: 'OPEN_INTERVENTION', examineeId: focusedExaminee.id, action })
          }}
        />
      )}

      {/* Intervention modal */}
      {interventionTarget && interventionExaminee && (
        <InterventionModal
          examinee={interventionExaminee}
          action={interventionTarget.action}
          onConfirm={details =>
            dispatch({
              type: 'EXECUTE_INTERVENTION',
              examineeId: interventionTarget.examineeId,
              action: interventionTarget.action,
              details,
            })
          }
          onCancel={() => dispatch({ type: 'CLOSE_INTERVENTION' })}
        />
      )}

      {/* Session summary */}
      {showSummary && (
        <SessionSummaryModal
          examinees={examinees}
          alerts={alerts}
          auditLog={auditLog}
          sessionName={session.name}
          onClose={() => dispatch({ type: 'CLOSE_SUMMARY' })}
        />
      )}
    </div>
  )
}
