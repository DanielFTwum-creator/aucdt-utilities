export interface ThesisDocument {
  id: string
  title: string
  fileName: string
  fileSize: number
  uploadedAt: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  userId: string
}

export interface ThesisAssessment {
  id: string
  documentId: string
  overallScore: number
  structureScore: number
  contentScore: number
  grammarScore: number
  citationScore: number
  feedback: AssessmentFeedback[]
  createdAt: string
}

export interface AssessmentFeedback {
  category: 'structure' | 'content' | 'grammar' | 'citation' | 'methodology'
  severity: 'critical' | 'major' | 'minor' | 'suggestion'
  message: string
  location?: {
    page?: number
    section?: string
  }
}

export interface UploadProgress {
  loaded: number
  total: number
  percentage: number
}
