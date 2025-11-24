import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Upload, FileText, CheckCircle, AlertCircle, Loader2, Send } from 'lucide-react'
import axios from 'axios'

/**
 * AI Agent Status Types
 */
export type AgentStatus = 'idle' | 'processing' | 'completed' | 'error'

/**
 * Thesis Analysis Result Interface
 */
export interface AnalysisResult {
  documentId: string
  timestamp: Date
  overallScore: number
  structureAnalysis: {
    score: number
    issues: string[]
    suggestions: string[]
  }
  contentAnalysis: {
    score: number
    strengths: string[]
    weaknesses: string[]
    improvements: string[]
  }
  academicRigor: {
    score: number
    citations: number
    methodology: string
    feedback: string[]
  }
  feedback: {
    summary: string
    detailedComments: string[]
    gradingCriteria: Record<string, number>
  }
}

/**
 * AI Agent Configuration
 */
export interface AIAgentConfig {
  apiEndpoint?: string
  maxFileSize?: number
  supportedFormats?: string[]
  timeoutMs?: number
}

/**
 * AI Agent Props
 */
export interface AIAgentProps {
  config?: AIAgentConfig
  onAnalysisComplete?: (result: AnalysisResult) => void
  onError?: (error: Error) => void
}

/**
 * Default Configuration
 */
const DEFAULT_CONFIG: AIAgentConfig = {
  apiEndpoint: '/api/thesis/analyze',
  maxFileSize: 10 * 1024 * 1024, // 10MB
  supportedFormats: ['.pdf', '.docx', '.doc'],
  timeoutMs: 120000 // 2 minutes
}

/**
 * AIAgent Component
 *
 * Primary AI agent for thesis assessment and analysis.
 * Provides document upload, AI processing, and detailed feedback generation.
 *
 * @component
 * @example
 * ```tsx
 * <AIAgent
 *   config={{ apiEndpoint: '/api/analyze' }}
 *   onAnalysisComplete={(result) => console.log(result)}
 *   onError={(error) => console.error(error)}
 * />
 * ```
 */
export function AIAgent({ config, onAnalysisComplete, onError }: AIAgentProps) {
  const [status, setStatus] = useState<AgentStatus>('idle')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [processingStage, setProcessingStage] = useState<string>('')

  const agentConfig = { ...DEFAULT_CONFIG, ...config }

  /**
   * Handle file selection
   */
  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) return

    // Validate file size
    if (file.size > (agentConfig.maxFileSize || 0)) {
      const maxSizeMB = ((agentConfig.maxFileSize || 0) / (1024 * 1024)).toFixed(0)
      setErrorMessage(`File size exceeds maximum allowed size of ${maxSizeMB}MB`)
      setStatus('error')
      return
    }

    // Validate file format
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
    if (!agentConfig.supportedFormats?.includes(fileExtension)) {
      setErrorMessage(`Unsupported file format. Please upload: ${agentConfig.supportedFormats?.join(', ')}`)
      setStatus('error')
      return
    }

    setSelectedFile(file)
    setStatus('idle')
    setErrorMessage('')
    setAnalysisResult(null)
  }, [agentConfig])

  /**
   * Process thesis document with AI
   */
  const processDocument = useCallback(async () => {
    if (!selectedFile) return

    try {
      setStatus('processing')
      setUploadProgress(0)
      setErrorMessage('')

      // Create form data
      const formData = new FormData()
      formData.append('document', selectedFile)

      // Stage 1: Upload
      setProcessingStage('Uploading document...')

      const response = await axios.post<AnalysisResult>(
        agentConfig.apiEndpoint || '',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          timeout: agentConfig.timeoutMs,
          onUploadProgress: (progressEvent) => {
            const progress = progressEvent.total
              ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
              : 0
            setUploadProgress(progress)
          }
        }
      )

      // Stage 2: AI Processing
      setProcessingStage('Analyzing document structure...')
      await simulateProcessingDelay(1000)

      setProcessingStage('Evaluating content quality...')
      await simulateProcessingDelay(1500)

      setProcessingStage('Assessing academic rigor...')
      await simulateProcessingDelay(1500)

      setProcessingStage('Generating detailed feedback...')
      await simulateProcessingDelay(1000)

      // Complete
      const result: AnalysisResult = {
        ...response.data,
        timestamp: new Date()
      }

      setAnalysisResult(result)
      setStatus('completed')
      setProcessingStage('Analysis complete')

      onAnalysisComplete?.(result)

    } catch (error) {
      const err = error as Error
      setStatus('error')
      setErrorMessage(err.message || 'An error occurred during analysis')
      onError?.(err)
    }
  }, [selectedFile, agentConfig, onAnalysisComplete, onError])

  /**
   * Reset agent to initial state
   */
  const resetAgent = useCallback(() => {
    setStatus('idle')
    setSelectedFile(null)
    setUploadProgress(0)
    setAnalysisResult(null)
    setErrorMessage('')
    setProcessingStage('')
  }, [])

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* Agent Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Brain className="w-12 h-12 text-academic-gold" />
          <h2 className="text-3xl font-serif font-bold text-academic-navy">
            AI Thesis Assessor
          </h2>
        </div>
        <p className="text-academic-slate text-lg">
          Upload your thesis document for comprehensive AI-powered analysis
        </p>
      </motion.div>

      {/* Upload Section */}
      <AnimatePresence mode="wait">
        {status === 'idle' && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-lg p-8 border-2 border-dashed border-academic-blue/30"
          >
            <div className="text-center">
              <Upload className="w-16 h-16 mx-auto mb-4 text-academic-blue" />

              <label
                htmlFor="file-upload"
                className="cursor-pointer inline-block"
              >
                <input
                  id="file-upload"
                  type="file"
                  accept={agentConfig.supportedFormats?.join(',')}
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <div className="bg-academic-blue hover:bg-academic-navy text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Select Document
                </div>
              </label>

              {selectedFile && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6"
                >
                  <div className="bg-academic-blue/10 rounded-lg p-4 mb-4">
                    <p className="font-semibold text-academic-navy">{selectedFile.name}</p>
                    <p className="text-sm text-academic-slate">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>

                  <button
                    onClick={processDocument}
                    className="bg-academic-gold hover:bg-academic-amber text-academic-navy px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    Start Analysis
                  </button>
                </motion.div>
              )}

              <p className="text-sm text-academic-slate mt-4">
                Supported formats: {agentConfig.supportedFormats?.join(', ')} (Max {((agentConfig.maxFileSize || 0) / (1024 * 1024)).toFixed(0)}MB)
              </p>
            </div>
          </motion.div>
        )}

        {/* Processing Section */}
        {status === 'processing' && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="inline-block mb-6"
              >
                <Loader2 className="w-16 h-16 text-academic-blue" />
              </motion.div>

              <h3 className="text-2xl font-serif font-bold text-academic-navy mb-2">
                Processing Your Thesis
              </h3>
              <p className="text-academic-slate mb-6">{processingStage}</p>

              {/* Progress Bar */}
              <div className="w-full bg-academic-blue/20 rounded-full h-3 mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                  className="bg-academic-blue h-3 rounded-full"
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-sm text-academic-slate">{uploadProgress}% uploaded</p>
            </div>
          </motion.div>
        )}

        {/* Results Section */}
        {status === 'completed' && analysisResult && (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-500" />
                <h3 className="text-2xl font-serif font-bold text-academic-navy">
                  Analysis Complete
                </h3>
              </div>
              <button
                onClick={resetAgent}
                className="text-academic-blue hover:text-academic-navy transition-colors"
              >
                Analyze Another
              </button>
            </div>

            {/* Overall Score */}
            <div className="bg-gradient-to-br from-academic-navy to-academic-blue rounded-xl p-6 mb-6 text-white">
              <p className="text-sm opacity-80 mb-2">Overall Score</p>
              <p className="text-5xl font-bold">{analysisResult.overallScore}/100</p>
            </div>

            {/* Analysis Details */}
            <div className="space-y-4">
              <AnalysisSection
                title="Structure Analysis"
                score={analysisResult.structureAnalysis.score}
                items={analysisResult.structureAnalysis.suggestions}
              />
              <AnalysisSection
                title="Content Quality"
                score={analysisResult.contentAnalysis.score}
                items={analysisResult.contentAnalysis.improvements}
              />
              <AnalysisSection
                title="Academic Rigor"
                score={analysisResult.academicRigor.score}
                items={analysisResult.academicRigor.feedback}
              />
            </div>

            {/* Feedback Summary */}
            <div className="mt-6 p-6 bg-academic-blue/10 rounded-xl">
              <h4 className="font-semibold text-academic-navy mb-3">Summary Feedback</h4>
              <p className="text-academic-slate">{analysisResult.feedback.summary}</p>
            </div>
          </motion.div>
        )}

        {/* Error Section */}
        {status === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <div className="text-center">
              <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
              <h3 className="text-2xl font-serif font-bold text-academic-navy mb-2">
                Analysis Failed
              </h3>
              <p className="text-academic-slate mb-6">{errorMessage}</p>
              <button
                onClick={resetAgent}
                className="bg-academic-blue hover:bg-academic-navy text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Try Again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/**
 * Analysis Section Component
 */
interface AnalysisSectionProps {
  title: string
  score: number
  items: string[]
}

function AnalysisSection({ title, score, items }: AnalysisSectionProps) {
  return (
    <div className="border border-academic-blue/20 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-academic-navy">{title}</h4>
        <span className="text-academic-blue font-bold">{score}/100</span>
      </div>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-academic-slate">
            <CheckCircle className="w-4 h-4 text-academic-gold mt-0.5 flex-shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * Simulate processing delay for demo purposes
 */
function simulateProcessingDelay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export default AIAgent
