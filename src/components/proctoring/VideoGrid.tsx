import { motion } from 'framer-motion'
import type { Examinee, Alert } from '../../types/proctoring'
import { VideoTile } from './VideoTile'

interface VideoGridProps {
  examinees: Examinee[]
  alerts: Alert[]
  gridCols: number
  paused: boolean
  onFocusExaminee: (id: string) => void
}

const COL_CLASSES: Record<number, string> = {
  2: 'grid-cols-2',
  3: 'grid-cols-2 md:grid-cols-3',
  4: 'grid-cols-2 md:grid-cols-4',
}

export function VideoGrid({ examinees, alerts, gridCols, paused, onFocusExaminee }: VideoGridProps) {
  const colClass = COL_CLASSES[gridCols] ?? 'grid-cols-2 md:grid-cols-4'

  if (examinees.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
        No active examinees
      </div>
    )
  }

  return (
    <div className={`grid ${colClass} gap-3`}>
      {examinees.map((examinee) => {
        const activeAlerts = alerts.filter(
          a => a.examineeId === examinee.id && a.status === 'ACTIVE',
        )
        return (
          <motion.div
            key={examinee.id}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <VideoTile
              examinee={examinee}
              activeAlerts={activeAlerts}
              paused={paused}
              onClick={() => onFocusExaminee(examinee.id)}
            />
          </motion.div>
        )
      })}
    </div>
  )
}
