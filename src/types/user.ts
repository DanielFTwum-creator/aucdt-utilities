export interface User {
  id: string
  email: string
  name: string
  role: 'student' | 'instructor' | 'admin'
  createdAt: string
  updatedAt: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  name: string
  role?: 'student' | 'instructor'
}

export interface AuthResponse {
  user: User
  token: string
}
