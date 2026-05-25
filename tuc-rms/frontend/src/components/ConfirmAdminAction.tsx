import { useState } from 'react'
import axios from 'axios'
import { API } from '../context/AuthContext'
import toast from 'react-hot-toast'

interface ConfirmAdminActionProps {
  title: string
  message: string
  onConfirm: () => Promise<void>
  onCancel: () => void
  isOpen: boolean
  actionLabel?: string
}

export default function ConfirmAdminAction({
  title,
  message,
  onConfirm,
  onCancel,
  isOpen,
  actionLabel = 'Confirm'
}: ConfirmAdminActionProps) {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password) return toast.error('Password required')

    setLoading(true)
    try {
      // Verify admin password
      await axios.post(`${API}/auth/verify-admin`, { password })

      // If verified, execute the action
      await onConfirm()

      // Reset and close
      setPassword('')
      onCancel()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.currentTarget === e.target) onCancel()
      }}
    >
      <div
        className="modal"
        style={{ maxWidth: 420 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
      >
        <div className="modal-header">
          <h2 className="modal-title" id="confirm-title">
            {title}
          </h2>
          <button
            className="btn-icon"
            onClick={onCancel}
            aria-label="Close dialog"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ width: 18, height: 18 }}
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div style={{ padding: '16px', color: 'var(--tuc-text)', fontSize: '14px', lineHeight: 1.6 }}>
          {message}
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '0 16px 16px' }}>
          <div className="form-group" style={{ marginBottom: 16 }}>
            <label className="form-label">Confirm with your password *</label>
            <input
              className="form-control"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ background: '#dc2626' }}>
              {loading ? 'Verifying...' : actionLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
