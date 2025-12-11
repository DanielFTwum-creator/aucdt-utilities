import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  GraduationCap,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
} from 'lucide-react'
import FileUpload from '../components/FileUpload'
import LoadingSpinner from '../components/LoadingSpinner'
import { useThesisAssessment } from '../hooks'

export default function Assessment() {
  const { documentId } = useParams<{ documentId?: string }>()
  const [currentDocId, setCurrentDocId] = useState<string | null>(documentId || null)
  const { assessment, isLoading, error, fetchAssessment } = useThesisAssessment(currentDocId)

  useEffect(() => {
    if (currentDocId) {
      fetchAssessment()
    }
  }, [currentDocId])

  const handleUploadComplete = (newDocId: string) => {
    setCurrentDocId(newDocId)
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="w-5 h-5 text-red-600" />
      case 'major':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />
      case 'minor':
        return <Info className="w-5 h-5 text-blue-600" />
      case 'suggestion':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      default:
        return <Info className="w-5 h-5 text-gray-600" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-50 border-red-200'
      case 'major':
        return 'bg-orange-50 border-orange-200'
      case 'minor':
        return 'bg-blue-50 border-blue-200'
      case 'suggestion':
        return 'bg-green-50 border-green-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-blue-600'
    if (score >= 40) return 'text-orange-600'
    return 'text-red-600'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="text-academic-slate hover:text-academic-navy transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div className="flex items-center gap-3">
              <GraduationCap className="w-8 h-8 text-academic-blue" />
              <h1 className="text-2xl font-serif font-bold text-academic-navy">Thesis Assessment</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Upload Section */}
        {!currentDocId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl font-serif font-bold text-academic-navy mb-6">
              Upload Your Thesis
            </h2>
            <FileUpload onUploadComplete={handleUploadComplete} />
          </motion.div>
        )}

        {/* Assessment Results */}
        {currentDocId && (
          <div className="space-y-6">
            {isLoading ? (
              <LoadingSpinner fullScreen={false} size="lg" message="Analyzing your thesis..." />
            ) : error ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-xl border border-gray-200 p-12 text-center"
              >
                <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-academic-navy mb-2">
                  Assessment Not Available
                </h3>
                <p className="text-academic-slate mb-6">{error}</p>
                <button
                  onClick={() => setCurrentDocId(null)}
                  className="bg-academic-blue text-white px-6 py-2 rounded-lg hover:bg-academic-navy transition-colors"
                >
                  Upload Another Document
                </button>
              </motion.div>
            ) : assessment ? (
              <>
                {/* Score Overview */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl border border-gray-200 p-8"
                >
                  <h2 className="text-2xl font-serif font-bold text-academic-navy mb-6">
                    Assessment Results
                  </h2>

                  <div className="grid md:grid-cols-5 gap-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold mb-2">
                        <span className={getScoreColor(assessment.overallScore)}>
                          {assessment.overallScore}%
                        </span>
                      </div>
                      <p className="text-sm text-academic-slate">Overall</p>
                    </div>
                    <div className="text-center">
                      <div className={`text-3xl font-bold mb-2 ${getScoreColor(assessment.structureScore)}`}>
                        {assessment.structureScore}%
                      </div>
                      <p className="text-sm text-academic-slate">Structure</p>
                    </div>
                    <div className="text-center">
                      <div className={`text-3xl font-bold mb-2 ${getScoreColor(assessment.contentScore)}`}>
                        {assessment.contentScore}%
                      </div>
                      <p className="text-sm text-academic-slate">Content</p>
                    </div>
                    <div className="text-center">
                      <div className={`text-3xl font-bold mb-2 ${getScoreColor(assessment.grammarScore)}`}>
                        {assessment.grammarScore}%
                      </div>
                      <p className="text-sm text-academic-slate">Grammar</p>
                    </div>
                    <div className="text-center">
                      <div className={`text-3xl font-bold mb-2 ${getScoreColor(assessment.citationScore)}`}>
                        {assessment.citationScore}%
                      </div>
                      <p className="text-sm text-academic-slate">Citations</p>
                    </div>
                  </div>
                </motion.div>

                {/* Detailed Feedback */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-xl border border-gray-200 p-8"
                >
                  <h3 className="text-xl font-semibold text-academic-navy mb-6">Detailed Feedback</h3>

                  <div className="space-y-4">
                    {assessment.feedback.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * index }}
                        className={`border rounded-lg p-4 ${getSeverityColor(item.severity)}`}
                      >
                        <div className="flex items-start gap-3">
                          {getSeverityIcon(item.severity)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="px-2 py-1 bg-white/50 rounded text-xs font-medium capitalize">
                                {item.category}
                              </span>
                              <span className="px-2 py-1 bg-white/50 rounded text-xs font-medium capitalize">
                                {item.severity}
                              </span>
                              {item.location && (
                                <span className="text-xs text-gray-600">
                                  {item.location.page && `Page ${item.location.page}`}
                                  {item.location.section && ` - ${item.location.section}`}
                                </span>
                              )}
                            </div>
                            <p className="text-academic-navy">{item.message}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex gap-4"
                >
                  <button
                    onClick={() => setCurrentDocId(null)}
                    className="flex-1 bg-academic-blue text-white font-semibold py-3 rounded-lg hover:bg-academic-navy transition-colors"
                  >
                    Upload Another Document
                  </button>
                  <Link
                    to="/dashboard"
                    className="flex-1 bg-gray-100 text-academic-navy font-semibold py-3 rounded-lg hover:bg-gray-200 transition-colors text-center"
                  >
                    Back to Dashboard
                  </Link>
                </motion.div>
              </>
            ) : null}
          </div>
        )}
      </main>
    </div>
  )
}
