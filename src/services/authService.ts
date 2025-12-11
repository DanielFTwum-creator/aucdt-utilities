import apiClient from './api'
import type { LoginCredentials, RegisterData, AuthResponse, User, ApiResponse } from '../types'

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', credentials)
    const { user, token } = response.data.data

    // Store token and user in localStorage
    localStorage.setItem('auth_token', token)
    localStorage.setItem('user', JSON.stringify(user))

    return response.data.data
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', data)
    const { user, token } = response.data.data

    // Store token and user in localStorage
    localStorage.setItem('auth_token', token)
    localStorage.setItem('user', JSON.stringify(user))

    return response.data.data
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout')
    } finally {
      // Clear local storage regardless of API response
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
    }
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>('/auth/me')
    return response.data.data
  },

  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user')
    if (!userStr) return null

    try {
      return JSON.parse(userStr) as User
    } catch {
      return null
    }
  },

  getStoredToken(): string | null {
    return localStorage.getItem('auth_token')
  },

  isAuthenticated(): boolean {
    return !!this.getStoredToken()
  },
}
