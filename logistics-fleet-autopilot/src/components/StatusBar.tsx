import { Wifi, WifiOff, AlertCircle, CheckCircle } from 'lucide-react'

interface StatusBarProps {
  health?: { status: string; score: number }
  isConnected: boolean
}

export default function StatusBar({ health, isConnected }: StatusBarProps) {
  const getStatusColor = () => {
    if (!health) return 'gray'
    if (health.score >= 90) return 'green'
    if (health.score >= 75) return 'blue'
    if (health.score >= 60) return 'yellow'
    return 'red'
  }

  const color = getStatusColor()

  return (
    <div className="flex items-center gap-3">
      {/* Connection Status */}
      <div className="flex items-center gap-2">
        {isConnected ? (
          <Wifi className="w-4 h-4 text-green-500" />
        ) : (
          <WifiOff className="w-4 h-4 text-red-500" />
        )}
        <span className="text-sm text-gray-600">
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>

      {/* Health Status */}
      {health && (
        <div className="flex items-center gap-2">
          {health.score >= 75 ? (
            <CheckCircle className={`w-4 h-4 text-${color}-500`} />
          ) : (
            <AlertCircle className={`w-4 h-4 text-${color}-500`} />
          )}
          <span className="text-sm font-medium text-gray-900">
            Health: {health.score}%
          </span>
        </div>
      )}
    </div>
  )
}
