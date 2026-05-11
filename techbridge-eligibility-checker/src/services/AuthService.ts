const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000';
const TOKEN_KEY = 'tuc_eligibility_token';

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    username: string;
    role: string;
  };
}

export interface ValidationResponse {
  success: boolean;
  valid: boolean;
  user?: {
    id: string;
    username: string;
    role: string;
  };
}

export const AuthService = {
  async login(username: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data: AuthResponse = await response.json();
      if (data.success && data.token) {
        localStorage.setItem(TOKEN_KEY, data.token);
      }
      return data;
    } catch {
      return { success: false, message: 'Could not connect to TUC Auth API' };
    }
  },

  async validateToken(token: string): Promise<ValidationResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/validate`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return await response.json();
    } catch {
      return { success: false, valid: false };
    }
  },

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem(TOKEN_KEY);
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },
};
