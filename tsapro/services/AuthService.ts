/**
 * AuthService
 * Handles communications with the TUC-Auth-API
 */

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000';

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    username: string;
    role: string;
    name?: string;
  };
}

export interface ValidationResponse {
  success: boolean;
  valid: boolean;
  user?: {
    id: string;
    username: string;
    role: string;
    name?: string;
  };
}

export const authService = {
  /**
   * Login with username and password
   */
  async login(password: string): Promise<AuthResponse> {
    try {
      // In TSAPRO, the user logs in with just a password usually, 
      // but the API expects a username. We'll use 'admin' as default
      // or we might need to update the UI to ask for username.
      // For now, let's assume 'admin' if only password is provided.
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: 'admin', password }),
      });

      return await response.json();
    } catch (error) {
      console.error('AuthService.login error:', error);
      return { success: false, message: 'Could not connect to authentication server' };
    }
  },

  /**
   * Validate current JWT token
   */
  async validateToken(token: string): Promise<ValidationResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/validate`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return await response.json();
    } catch (error) {
      console.error('AuthService.validateToken error:', error);
      return { success: false, valid: false };
    }
  },

  /**
   * Logout
   */
  async logout(): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('AuthService.logout error:', error);
    }
  }
};
