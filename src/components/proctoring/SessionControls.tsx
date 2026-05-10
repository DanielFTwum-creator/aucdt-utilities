import { Play, Pause, Square, LayoutGrid } from 'lucide-react'
import type { Session } from '../../types/proctoring'

interface SessionControlsProps {
  session: Session
  gridCols: number
  onPause: () => void
  onResume: () => void
  onEnd: () => void
  onGridColsChange: (cols: number) => void
}

const GRID_OPTIONS = [
  { cols: 2, label: '2×2' },
  { cols: 3, label: '3×3' },
  { cols: 4, label: '4×4' },
]

export function SessionControls({ session, gridCols, onPause, onResume, onEnd, onGridColsChange }: SessionControlsProps) {
  const isActive = session.state === 'ACTIVE'
  const isPaused = session.state === 'PAUSED'
  const isEnded  = session.state === 'ENDED'

  return (
    <div className="px-6 py-3 border-b border-gray-100 flex items-center justify-between gap-4 bg-gray-50/40">
      <div className="flex items-center gap-2">
        {/* Pause / Resume */}
        {(isActive || isPaused) && (
          <button
            onClick={isActive ? onPause : onResume}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isActive ? 'Pause' : 'Resume'}
          </button>
        )}

        {/* End session */}
        {!isEnded && (
          <button
            onClick={onEnd}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
          >
            <Square className="w-3.5 h-3.5 fill-red-700" />
            End Session
          </button>
        )}

        {isEnded && (
          <span className="text-sm text-gray-400 italic">Session ended</span>
        )}
      </div>

      {/* Grid layout selector */}
      <div className="flex items-center gap-2">
        <LayoutGrid className="w-3.5 h-3.5 text-gray-400" />
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
          {GRID_OPTIONS.map(({ cols, label }) => (
            <button
              key={cols}
              onClick={() => onGridColsChange(cols)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                gridCols === cols
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
