import { Logger } from './logger';

const AUTH_KEY = 'admin_auth_token';
const DEMO_TOKEN = 'demo-token-123';

export const AuthService = {
  login: (password: string): boolean => {
    // In a real app, this would hit an API.
    // For this client-side demo, we use a hardcoded password.
    if (password === 'admin123') {
      localStorage.setItem(AUTH_KEY, DEMO_TOKEN);
      Logger.log('LOGIN_SUCCESS', 'User logged in successfully');
      return true;
    }
    Logger.log('LOGIN_FAILED', 'Invalid password attempt', 'system');
    return false;
  },

  logout: () => {
    localStorage.removeItem(AUTH_KEY);
    Logger.log('LOGOUT', 'User logged out');
  },

  isAuthenticated: (): boolean => {
    return localStorage.getItem(AUTH_KEY) === DEMO_TOKEN;
  }
};
