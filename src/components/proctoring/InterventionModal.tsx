import { useState } from 'react'
import { X, AlertTriangle } from 'lucide-react'
import { motion } from 'framer-motion'
import type { InterventionAction, Examinee } from '../../types/proctoring'

interface InterventionModalProps {
  examinee: Examinee
  action: InterventionAction
  onConfirm: (details: string) => void
  onCancel: () => void
}

const CONFIG: Record<InterventionAction, {
  title: string
  description: string
  inputLabel: string | null
  inputPlaceholder?: string
  confirmLabel: string
  confirmStyle: string
  dangerous?: boolean
}> = {
  WARN: {
    title: 'Send Warning',
    description: 'Send an on-screen warning message to the examinee.',
    inputLabel: 'Warning message',
    inputPlaceholder: 'e.g. Please ensure only you are visible on camera.',
    confirmLabel: 'Send Warning',
    confirmStyle: 'bg-amber-500 hover:bg-amber-600 text-white',
  },
  FLAG: {
    title: 'Flag for Review',
    description: 'Mark this examinee\'s submission for post-exam review. The exam will continue.',
    inputLabel: 'Reason (optional)',
    inputPlaceholder: 'Reason for flagging...',
    confirmLabel: 'Flag Examinee',
    confirmStyle: 'bg-orange-500 hover:bg-orange-600 text-white',
  },
  EJECT: {
    title: 'Eject Examinee',
    description: 'This will terminate the examinee\'s session and lock their submission. This action cannot be undone.',
    inputLabel: 'Reason for ejection (required)',
    inputPlaceholder: 'State the reason for ejection...',
    confirmLabel: 'Confirm Eject',
    confirmStyle: 'bg-red-600 hover:bg-red-700 text-white',
    dangerous: true,
  },
  REQUEST_ID: {
    title: 'Request ID Verification',
    description: 'Prompt the examinee to hold their ID document up to the camera.',
    inputLabel: null,
    confirmLabel: 'Send Request',
    confirmStyle: 'bg-blue-600 hover:bg-blue-700 text-white',
  },
  CHAT: {
    title: 'Open Chat',
    description: 'Chat functionality is not available in this demo session.',
    inputLabel: null,
    confirmLabel: 'OK',
    confirmStyle: 'bg-gray-600 hover:bg-gray-700 text-white',
  },
}

export function InterventionModal({ examinee, action, onConfirm, onCancel }: InterventionModalProps) {
  const [input, setInput] = useState('')
  const [ejectionConfirmed, setEjectionConfirmed] = useState(false)
  const cfg = CONFIG[action]

  const canConfirm =
    action === 'EJECT'
      ? ejectionConfirmed && input.trim().length > 0
      : action === 'WARN'
        ? input.trim().length > 0
        : true

  function handleConfirm() {
    if (!canConfirm) return
    onConfirm(input.trim() || cfg.confirmLabel)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <motion.div
        className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl p-6"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.15 }}
      >
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 text-gray-500"
        >
          <X className="w-4 h-4" />
        </button>

        {cfg.dangerous && (
          <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <p className="text-xs text-red-700 font-medium">This is an irreversible action</p>
          </div>
        )}

        <h3 className="text-lg font-semibold text-gray-900 mb-1">{cfg.title}</h3>
        <p className="text-sm text-gray-500 mb-1">
          <span className="font-medium text-gray-700">{examinee.name}</span>
          {' '}({examinee.segmentId} · {examinee.examId})
        </p>
        <p className="text-sm text-gray-500 mb-5">{cfg.description}</p>

        {cfg.inputLabel && (
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-700 mb-1.5">{cfg.inputLabel}</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder={cfg.inputPlaceholder}
              value={input}
              onChange={e => setInput(e.target.value)}
              autoFocus
            />
          </div>
        )}

        {action === 'EJECT' && (
          <label className="flex items-start gap-2.5 mb-5 cursor-pointer">
            <input
              type="checkbox"
              checked={ejectionConfirmed}
              onChange={e => setEjectionConfirmed(e.target.checked)}
              className="mt-0.5 accent-red-600"
            />
            <span className="text-sm text-gray-700">
              I confirm this examinee should be ejected and understand this cannot be undone.
            </span>
          </label>
        )}

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!canConfirm}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${cfg.confirmStyle}`}
          >
            {cfg.confirmLabel}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
