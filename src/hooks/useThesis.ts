import { useState } from 'react'
import { thesisService } from '../services'
import type { ThesisDocument, ThesisAssessment, UploadProgress } from '../types'

export function useThesisUpload() {
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState<UploadProgress | null>(null)
  const [error, setError] = useState<string | null>(null)

  const uploadDocument = async (file: File): Promise<ThesisDocument | null> => {
    setIsUploading(true)
    setProgress(null)
    setError(null)

    try {
      const document = await thesisService.uploadDocument(file, (progress) => {
        setProgress(progress)
      })
      return document
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload document'
      setError(errorMessage)
      return null
    } finally {
      setIsUploading(false)
    }
  }

  const reset = () => {
    setIsUploading(false)
    setProgress(null)
    setError(null)
  }

  return {
    uploadDocument,
    isUploading,
    progress,
    error,
    reset,
  }
}

export function useThesisAssessment(documentId: string | null) {
  const [assessment, setAssessment] = useState<ThesisAssessment | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAssessment = async () => {
    if (!documentId) return

    setIsLoading(true)
    setError(null)

    try {
      const data = await thesisService.getAssessment(documentId)
      setAssessment(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch assessment'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const requestAssessment = async () => {
    if (!documentId) return

    setIsLoading(true)
    setError(null)

    try {
      const data = await thesisService.requestAssessment(documentId)
      setAssessment(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to request assessment'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    assessment,
    isLoading,
    error,
    fetchAssessment,
    requestAssessment,
  }
}
