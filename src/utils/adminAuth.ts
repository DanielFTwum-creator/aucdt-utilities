import { auditLogger } from './auditLogger'

export interface AdminConfig {
  passwordHash: string
  isConfigured: boolean
  lastPasswordChange: string
}

class AdminAuth {
  private readonly CONFIG_KEY = 'admin_config'
  private readonly SESSION_KEY = 'admin_session'
  private readonly SESSION_DURATION = 3600000 // 1 hour in milliseconds

  private async hashPassword(password: string): Promise<string> {
    // Simple hash using Web Crypto API
    const encoder = new TextEncoder()
    const data = encoder.encode(password)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }

  async setPassword(newPassword: string): Promise<void> {
    if (newPassword.length < 8) {
      throw new Error('Password must be at least 8 characters long')
    }

    const hash = await this.hashPassword(newPassword)
    const config: AdminConfig = {
      passwordHash: hash,
      isConfigured: true,
      lastPasswordChange: new Date().toISOString()
    }

    localStorage.setItem(this.CONFIG_KEY, JSON.stringify(config))
    auditLogger.log(
      'password_change',
      'Admin password was changed',
      'security',
      'warning'
    )
  }

  async verifyPassword(password: string): Promise<boolean> {
    const config = this.getConfig()
    if (!config || !config.isConfigured) {
      auditLogger.log(
        'auth_attempt',
        'Login attempted but no password configured',
        'auth',
        'warning'
      )
      return false
    }

    const hash = await this.hashPassword(password)
    const isValid = hash === config.passwordHash

    if (isValid) {
      auditLogger.log(
        'login_success',
        'Admin logged in successfully',
        'auth',
        'info'
      )
    } else {
      auditLogger.log(
        'login_failed',
        'Failed login attempt',
        'auth',
        'warning'
      )
    }

    return isValid
  }

  createSession(): void {
    const session = {
      timestamp: Date.now(),
      expiresAt: Date.now() + this.SESSION_DURATION
    }
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(session))
    auditLogger.log(
      'session_created',
      'New admin session created',
      'auth',
      'info'
    )
  }

  isSessionValid(): boolean {
    try {
      const sessionStr = localStorage.getItem(this.SESSION_KEY)
      if (!sessionStr) return false

      const session = JSON.parse(sessionStr)
      return Date.now() < session.expiresAt
    } catch {
      return false
    }
  }

  logout(): void {
    localStorage.removeItem(this.SESSION_KEY)
    auditLogger.log(
      'logout',
      'Admin logged out',
      'auth',
      'info'
    )
  }

  getConfig(): AdminConfig | null {
    try {
      const configStr = localStorage.getItem(this.CONFIG_KEY)
      return configStr ? JSON.parse(configStr) : null
    } catch {
      return null
    }
  }

  isConfigured(): boolean {
    const config = this.getConfig()
    return config?.isConfigured ?? false
  }
}

export const adminAuth = new AdminAuth()
