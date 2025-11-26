import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send,
  Upload,
  FileText,
  Brain,
  CheckCircle,
  Loader2,
  AlertCircle,
  BookOpen,
  Sparkles
} from 'lucide-react'

/**
 * Message types for the chat interface
 */
interface Message {
  id: string
  role: 'user' | 'agent' | 'system'
  content: string
  timestamp: Date
  metadata?: {
    analysisType?: 'structure' | 'content' | 'grammar' | 'references'
    confidence?: number
    suggestions?: string[]
  }
}

/**
 * Analysis status tracking
 */
type AnalysisStatus = 'idle' | 'uploading' | 'analyzing' | 'completed' | 'error'

/**
 * Analysis results structure
 */
interface AnalysisResults {
  overallScore: number
  structureScore: number
  contentScore: number
  grammarScore: number
  referencesScore: number
  strengths: string[]
  improvements: string[]
  detailedFeedback: string
}

/**
 * ThesisAssessmentAgent Component
 *
 * Primary AI agent component for thesis assessment and analysis.
 * Provides an interactive interface for document upload, analysis,
 * and detailed feedback generation.
 *
 * Features:
 * - Document upload with drag-and-drop
 * - Real-time chat interface with AI agent
 * - Progress tracking for analysis stages
 * - Detailed results visualization
 * - Conversational feedback and suggestions
 *
 * @component
 * @example
 * ```tsx
 * <ThesisAssessmentAgent
 *   onAnalysisComplete={(results) => console.log(results)}
 * />
 * ```
 */
export default function ThesisAssessmentAgent({
  onAnalysisComplete,
}: {
  onAnalysisComplete?: (results: AnalysisResults) => void
}) {
  // State management
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'agent',
      content: 'Hello! I\'m your ThesisAI Assessment Agent. I can help you analyze and evaluate thesis documents. Upload a document or describe your thesis, and I\'ll provide comprehensive feedback.',
      timestamp: new Date(),
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus>('idle')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  /**
   * Add a new message to the conversation
   */
  const addMessage = (role: Message['role'], content: string, metadata?: Message['metadata']) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date(),
      metadata,
    }
    setMessages(prev => [...prev, newMessage])
  }

  /**
   * Handle user message submission
   */
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!inputMessage.trim() && !uploadedFile) return

    // Add user message
    if (inputMessage.trim()) {
      addMessage('user', inputMessage)
    }

    // If file is uploaded, process it
    if (uploadedFile) {
      await handleFileAnalysis(uploadedFile)
      setUploadedFile(null)
    } else {
      // Simulate AI response for text-based queries
      setTimeout(() => {
        addMessage('agent', getContextualResponse(inputMessage))
      }, 1000)
    }

    setInputMessage('')
  }

  /**
   * Handle file upload and analysis
   */
  const handleFileAnalysis = async (file: File) => {
    setAnalysisStatus('uploading')

    addMessage('system', `Uploading "${file.name}"... (${(file.size / 1024 / 1024).toFixed(2)} MB)`)

    // Simulate upload process
    await new Promise(resolve => setTimeout(resolve, 1500))

    setAnalysisStatus('analyzing')
    addMessage('agent', 'Document uploaded successfully! Starting comprehensive analysis...')

    // Simulate analysis stages
    const analysisStages = [
      { type: 'structure', message: '📋 Analyzing document structure and formatting...' },
      { type: 'content', message: '📝 Evaluating content quality and argumentation...' },
      { type: 'grammar', message: '✍️ Checking grammar, style, and clarity...' },
      { type: 'references', message: '📚 Reviewing citations and references...' },
    ]

    for (const stage of analysisStages) {
      await new Promise(resolve => setTimeout(resolve, 2000))
      addMessage('system', stage.message)
    }

    // Generate mock results
    const results = generateMockAnalysisResults(file.name)
    setAnalysisResults(results)
    setAnalysisStatus('completed')

    // Send detailed feedback
    setTimeout(() => {
      addMessage('agent', formatAnalysisResults(results))
      onAnalysisComplete?.(results)
    }, 500)
  }

  /**
   * Handle file input change
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      validateAndSetFile(file)
    }
  }

  /**
   * Handle drag and drop
   */
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      validateAndSetFile(file)
    }
  }

  /**
   * Validate and set uploaded file
   */
  const validateAndSetFile = (file: File) => {
    // Validate file type
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
    if (!validTypes.includes(file.type)) {
      addMessage('system', '⚠️ Invalid file type. Please upload PDF, DOCX, or TXT files.')
      return
    }

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      addMessage('system', '⚠️ File too large. Maximum size is 50MB.')
      return
    }

    setUploadedFile(file)
    addMessage('system', `✅ File "${file.name}" ready for upload.`)
  }

  /**
   * Get contextual AI response based on user input
   */
  const getContextualResponse = (input: string): string => {
    const lowerInput = input.toLowerCase()

    if (lowerInput.includes('upload') || lowerInput.includes('document') || lowerInput.includes('file')) {
      return 'To upload a document, click the upload button or drag and drop your thesis file (PDF, DOCX, or TXT format, max 50MB). I\'ll analyze the structure, content, grammar, and references to provide comprehensive feedback.'
    }

    if (lowerInput.includes('how') && lowerInput.includes('work')) {
      return 'I analyze thesis documents across four key dimensions:\n\n1. **Structure** - Organization, formatting, chapter flow\n2. **Content** - Argumentation quality, research depth, academic rigor\n3. **Grammar** - Writing clarity, style, language usage\n4. **References** - Citation accuracy, source quality, bibliography\n\nUpload your document to get started!'
    }

    if (lowerInput.includes('score') || lowerInput.includes('grade') || lowerInput.includes('evaluate')) {
      return 'I provide detailed scoring across multiple criteria:\n- Overall Score (0-100)\n- Structure Score\n- Content Quality Score\n- Grammar & Style Score\n- References Score\n\nEach score comes with specific strengths, improvement areas, and actionable recommendations.'
    }

    if (lowerInput.includes('help') || lowerInput.includes('what can you')) {
      return 'I can help you with:\n\n✨ Document Analysis - Upload your thesis for comprehensive evaluation\n📊 Detailed Scoring - Get scores across multiple assessment criteria\n💡 Improvement Suggestions - Receive specific, actionable feedback\n📝 Writing Guidance - Get tips on structure, argumentation, and clarity\n📚 Reference Checking - Validate citations and bibliography\n\nWhat would you like to do?'
    }

    return 'I\'m here to help with your thesis assessment! You can upload a document for analysis, ask questions about the evaluation process, or inquire about specific aspects of thesis writing. How can I assist you today?'
  }

  /**
   * Generate mock analysis results for demonstration
   */
  const generateMockAnalysisResults = (filename: string): AnalysisResults => {
    return {
      overallScore: 78,
      structureScore: 82,
      contentScore: 75,
      grammarScore: 80,
      referencesScore: 76,
      strengths: [
        'Well-organized chapter structure with logical flow',
        'Strong literature review with comprehensive coverage',
        'Clear research methodology and robust data analysis',
        'Appropriate use of academic terminology',
        'Consistent citation format throughout the document'
      ],
      improvements: [
        'Strengthen the theoretical framework in Chapter 2',
        'Expand the discussion of limitations and future research',
        'Improve transitions between major sections',
        'Add more recent references (post-2020) to demonstrate current knowledge',
        'Clarify some complex sentences in the methodology section'
      ],
      detailedFeedback: `Analysis of "${filename}" is complete. Your thesis demonstrates solid academic work with a strong foundation. The document is well-structured and shows good research depth. Focus on enhancing the theoretical framework and incorporating more recent literature to strengthen your contribution to the field.`
    }
  }

  /**
   * Format analysis results for display
   */
  const formatAnalysisResults = (results: AnalysisResults): string => {
    return `
## 📊 Analysis Complete!

**Overall Score: ${results.overallScore}/100**

### Detailed Scores:
- 📋 Structure: ${results.structureScore}/100
- 📝 Content: ${results.contentScore}/100
- ✍️ Grammar: ${results.grammarScore}/100
- 📚 References: ${results.referencesScore}/100

### ✅ Key Strengths:
${results.strengths.map((s, i) => `${i + 1}. ${s}`).join('\n')}

### 💡 Areas for Improvement:
${results.improvements.map((i, idx) => `${idx + 1}. ${i}`).join('\n')}

### 📝 Summary:
${results.detailedFeedback}

Would you like me to elaborate on any specific aspect of the analysis?
    `.trim()
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-academic-navy/5 to-academic-blue/5 rounded-2xl border border-academic-blue/20 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-academic-navy to-academic-blue text-white p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              ThesisAI Assessment Agent
              <Sparkles className="w-4 h-4 text-academic-gold" />
            </h2>
            <p className="text-xs text-white/70">
              {analysisStatus === 'idle' && 'Ready to analyze your thesis'}
              {analysisStatus === 'uploading' && 'Uploading document...'}
              {analysisStatus === 'analyzing' && 'Analysis in progress...'}
              {analysisStatus === 'completed' && 'Analysis complete'}
              {analysisStatus === 'error' && 'An error occurred'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-academic-blue text-white'
                    : message.role === 'agent'
                    ? 'bg-white border border-academic-blue/20 text-academic-navy'
                    : 'bg-academic-gold/10 border border-academic-gold/30 text-academic-slate text-sm'
                }`}
              >
                {/* Message Header */}
                {message.role === 'agent' && (
                  <div className="flex items-center gap-2 mb-2 text-academic-blue">
                    <Brain className="w-4 h-4" />
                    <span className="text-xs font-semibold">AI Agent</span>
                  </div>
                )}

                {/* Message Content */}
                <div className="whitespace-pre-line text-sm leading-relaxed">
                  {message.content}
                </div>

                {/* Timestamp */}
                <div className={`text-xs mt-2 ${
                  message.role === 'user' ? 'text-white/60' : 'text-academic-slate/60'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading Indicator */}
        {(analysisStatus === 'uploading' || analysisStatus === 'analyzing') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-white border border-academic-blue/20 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2 text-academic-blue">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Processing...</span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* File Upload Area */}
      {uploadedFile && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-4 mb-2 p-3 bg-academic-gold/10 border border-academic-gold/30 rounded-xl flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-academic-gold" />
            <span className="text-sm font-medium text-academic-navy">{uploadedFile.name}</span>
            <span className="text-xs text-academic-slate">
              ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
            </span>
          </div>
          <button
            onClick={() => setUploadedFile(null)}
            className="text-academic-slate hover:text-academic-navy transition-colors"
          >
            <AlertCircle className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* Drag and Drop Overlay */}
      {isDragging && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-academic-blue/90 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <div className="text-center text-white">
            <Upload className="w-16 h-16 mx-auto mb-4" />
            <p className="text-xl font-semibold">Drop your thesis here</p>
            <p className="text-sm text-white/70 mt-2">PDF, DOCX, or TXT (max 50MB)</p>
          </div>
        </motion.div>
      )}

      {/* Input Area */}
      <div
        className="border-t border-academic-blue/20 bg-white/50 backdrop-blur-sm p-4"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <form onSubmit={handleSendMessage} className="flex gap-2">
          {/* Upload Button */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={analysisStatus === 'uploading' || analysisStatus === 'analyzing'}
            className="p-3 bg-white border border-academic-blue/20 rounded-xl hover:bg-academic-blue/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Upload document"
          >
            <Upload className="w-5 h-5 text-academic-blue" />
          </button>

          {/* Message Input */}
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask me about thesis assessment or upload a document..."
            disabled={analysisStatus === 'uploading' || analysisStatus === 'analyzing'}
            className="flex-1 px-4 py-3 bg-white border border-academic-blue/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-blue/50 disabled:opacity-50 disabled:cursor-not-allowed"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={(!inputMessage.trim() && !uploadedFile) || analysisStatus === 'uploading' || analysisStatus === 'analyzing'}
            className="p-3 bg-academic-blue text-white rounded-xl hover:bg-academic-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>

        {/* Helper Text */}
        <p className="text-xs text-academic-slate/60 mt-2 text-center">
          Upload a thesis document or ask questions about the assessment process
        </p>
      </div>
    </div>
  )
}
