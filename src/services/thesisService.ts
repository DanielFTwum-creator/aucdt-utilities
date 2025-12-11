import apiClient from './api'
import type { ThesisDocument, ThesisAssessment, ApiResponse, PaginatedResponse, UploadProgress } from '../types'

export const thesisService = {
  async uploadDocument(
    file: File,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<ThesisDocument> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await apiClient.post<ApiResponse<ThesisDocument>>(
      '/thesis/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress: UploadProgress = {
              loaded: progressEvent.loaded,
              total: progressEvent.total,
              percentage: Math.round((progressEvent.loaded * 100) / progressEvent.total),
            }
            onProgress(progress)
          }
        },
      }
    )

    return response.data.data
  },

  async getDocuments(page = 1, pageSize = 10): Promise<PaginatedResponse<ThesisDocument>> {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<ThesisDocument>>>(
      '/thesis/documents',
      {
        params: { page, pageSize },
      }
    )
    return response.data.data
  },

  async getDocument(id: string): Promise<ThesisDocument> {
    const response = await apiClient.get<ApiResponse<ThesisDocument>>(`/thesis/documents/${id}`)
    return response.data.data
  },

  async getAssessment(documentId: string): Promise<ThesisAssessment> {
    const response = await apiClient.get<ApiResponse<ThesisAssessment>>(
      `/thesis/documents/${documentId}/assessment`
    )
    return response.data.data
  },

  async deleteDocument(id: string): Promise<void> {
    await apiClient.delete(`/thesis/documents/${id}`)
  },

  async requestAssessment(documentId: string): Promise<ThesisAssessment> {
    const response = await apiClient.post<ApiResponse<ThesisAssessment>>(
      `/thesis/documents/${documentId}/assess`
    )
    return response.data.data
  },
}
