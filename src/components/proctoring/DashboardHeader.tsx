import { useState, useEffect } from 'react'
import { Monitor, Shield, Settings, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Session } from '../../types/proctoring'

interface DashboardHeaderProps {
  session: Session
  liveCount: number
}

function elapsed(startedAt: Date): string {
  const totalSecs = Math.floor((Date.now() - startedAt.getTime()) / 1000)
  const h = Math.floor(totalSecs / 3600)
  const m = Math.floor((totalSecs % 3600) / 60)
  const s = totalSecs % 60
  if (h > 0) return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function statusChip(state: Session['state']) {
  switch (state) {
    case 'ACTIVE':    return { label: 'Active',   dot: 'bg-green-500', bg: 'bg-green-50',  text: 'text-green-700'  }
    case 'PAUSED':    return { label: 'Paused',   dot: 'bg-amber-500', bg: 'bg-amber-50',  text: 'text-amber-700'  }
    case 'ENDED':     return { label: 'Ended',    dot: 'bg-gray-400',  bg: 'bg-gray-100',  text: 'text-gray-600'   }
    case 'SCHEDULED': return { label: 'Scheduled',dot: 'bg-blue-500',  bg: 'bg-blue-50',   text: 'text-blue-700'   }
  }
}

export function DashboardHeader({ session, liveCount }: DashboardHeaderProps) {
  const [tick, setTick] = useState(0)
  const chip = statusChip(session.state)

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1000)
    return () => clearInterval(id)
  }, [])

  // suppress unused warning — tick just triggers re-render for the clock
  void tick

  return (
    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-3">
        <Link to="/" className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <Monitor className="w-5 h-5 text-gray-700" />
        <div>
          <h1 className="text-lg font-semibold text-gray-900 leading-tight">Live Proctoring Dashboard</h1>
          <p className="text-xs text-gray-400">{session.name} · {session.id}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        {session.state === 'ACTIVE' && (
          <div className="text-sm text-gray-500 font-mono tabular-nums">
            {elapsed(session.startedAt)}
            <span className="text-gray-300 mx-1">/</span>
            <span className="text-gray-400">{session.scheduledDuration}m</span>
          </div>
        )}

        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${chip.bg} ${chip.text}`}>
          <span className={`w-2 h-2 rounded-full inline-block ${chip.dot} ${session.state === 'ACTIVE' ? 'animate-pulse' : ''}`} />
          {chip.label}
        </div>

        <div className="text-xs text-gray-500 px-2 py-1 bg-gray-50 rounded-lg">
          <span className="font-semibold text-gray-700">{liveCount.toLocaleString()}</span> live
        </div>

        <div className="flex items-center gap-1.5 text-sm text-gray-500 px-3 py-1 bg-gray-50 rounded-lg">
          <Shield className="w-3.5 h-3.5" />
          Proctor
        </div>

        <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
