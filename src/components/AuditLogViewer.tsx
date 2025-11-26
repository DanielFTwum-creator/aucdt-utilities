import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Filter, Download } from 'lucide-react'
import { useAdmin } from '../contexts/AdminContext'

export function AuditLogViewer() {
  const { auditLogs, clearAuditLogs, addAuditLog } = useAdmin()
  const [filter, setFilter] = useState('')
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  const filteredLogs = auditLogs.filter(
    log =>
      log.action.toLowerCase().includes(filter.toLowerCase()) ||
      log.details.toLowerCase().includes(filter.toLowerCase()) ||
      log.user.toLowerCase().includes(filter.toLowerCase())
  )

  const handleClearLogs = () => {
    clearAuditLogs()
    setShowClearConfirm(false)
  }

  const handleExportLogs = () => {
    const dataStr = JSON.stringify(auditLogs, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `audit-logs-${new Date().toISOString()}.json`
    link.click()
    URL.revokeObjectURL(url)
    addAuditLog('EXPORT_LOGS', `Exported ${auditLogs.length} audit logs`)
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const getActionColor = (action: string) => {
    if (action.includes('LOGIN')) return 'text-green-600 dark:text-green-400 high-contrast:text-green-300'
    if (action.includes('LOGOUT')) return 'text-blue-600 dark:text-blue-400 high-contrast:text-blue-300'
    if (action.includes('FAILED') || action.includes('CLEAR')) return 'text-red-600 dark:text-red-400 high-contrast:text-red-300'
    if (action.includes('PASSWORD')) return 'text-orange-600 dark:text-orange-400 high-contrast:text-orange-300'
    return 'text-gray-600 dark:text-gray-400 high-contrast:text-gray-300'
  }

  return (
    <div
      className="bg-white dark:bg-gray-800 high-contrast:bg-black high-contrast:border-2 high-contrast:border-yellow-400 rounded-xl shadow-lg p-6"
      role="region"
      aria-label="Audit log viewer"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white high-contrast:text-yellow-400">
          Audit Logs
        </h2>
        <div className="flex gap-3">
          <button
            onClick={handleExportLogs}
            className="flex items-center gap-2 bg-academic-blue hover:bg-academic-navy high-contrast:bg-yellow-400 high-contrast:hover:bg-yellow-300 high-contrast:text-black text-white px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-academic-blue high-contrast:focus:ring-yellow-400"
            aria-label="Export audit logs to JSON"
            disabled={auditLogs.length === 0}
          >
            <Download className="w-5 h-5" aria-hidden="true" />
            <span>Export</span>
          </button>
          <button
            onClick={() => setShowClearConfirm(true)}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 high-contrast:bg-red-500 high-contrast:hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
            aria-label="Clear all audit logs"
            disabled={auditLogs.length === 0}
          >
            <Trash2 className="w-5 h-5" aria-hidden="true" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Filter Input */}
      <div className="mb-6">
        <label htmlFor="audit-filter" className="sr-only">
          Filter audit logs
        </label>
        <div className="relative">
          <Filter
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 high-contrast:text-yellow-400"
            aria-hidden="true"
          />
          <input
            id="audit-filter"
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter logs by action, details, or user..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 high-contrast:border-yellow-400 high-contrast:border-2 rounded-lg focus:ring-2 focus:ring-academic-blue high-contrast:focus:ring-yellow-400 focus:border-transparent bg-white dark:bg-gray-700 high-contrast:bg-black text-gray-900 dark:text-white high-contrast:text-yellow-400"
            aria-label="Filter audit logs"
          />
        </div>
      </div>

      {/* Logs List */}
      <div
        className="space-y-3 max-h-[600px] overflow-y-auto"
        role="log"
        aria-live="polite"
        aria-label="Audit log entries"
      >
        {filteredLogs.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 high-contrast:text-white py-8">
            {auditLogs.length === 0 ? 'No audit logs yet' : 'No logs match your filter'}
          </p>
        ) : (
          <AnimatePresence>
            {filteredLogs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="border border-gray-200 dark:border-gray-700 high-contrast:border-yellow-400 high-contrast:border-2 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 high-contrast:hover:bg-gray-900 transition-colors"
                role="article"
                aria-label={`Audit log entry: ${log.action}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span
                        className={`font-mono text-sm font-semibold ${getActionColor(log.action)}`}
                      >
                        {log.action}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 high-contrast:text-gray-300">
                        {log.user}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 high-contrast:text-white">
                      {log.details}
                    </p>
                  </div>
                  <time
                    className="text-xs text-gray-500 dark:text-gray-400 high-contrast:text-gray-300 whitespace-nowrap"
                    dateTime={log.timestamp}
                  >
                    {formatTimestamp(log.timestamp)}
                  </time>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Clear Confirmation Dialog */}
      <AnimatePresence>
        {showClearConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="clear-confirm-title"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white dark:bg-gray-800 high-contrast:bg-black high-contrast:border-2 high-contrast:border-yellow-400 rounded-xl shadow-2xl p-6 max-w-md w-full"
            >
              <h3
                id="clear-confirm-title"
                className="text-xl font-semibold text-gray-900 dark:text-white high-contrast:text-yellow-400 mb-4"
              >
                Clear All Audit Logs?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 high-contrast:text-white mb-6">
                This action cannot be undone. All audit log entries will be permanently deleted.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 high-contrast:bg-gray-800 high-contrast:hover:bg-gray-700 high-contrast:border-2 high-contrast:border-yellow-400 text-gray-900 dark:text-white high-contrast:text-yellow-400 font-semibold px-6 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 high-contrast:focus:ring-yellow-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearLogs}
                  className="bg-red-600 hover:bg-red-700 high-contrast:bg-red-500 high-contrast:hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                  Clear All
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
