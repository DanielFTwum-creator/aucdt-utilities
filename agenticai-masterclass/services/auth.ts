import { LogEntry } from '../types';

export interface User {
  id: string;
  username: string;
  role: 'admin' | 'editor';
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Simulated secure credentials (in a real app, this would be validated against a hashed DB entry)
const MOCK_CREDS = {
    username: 'admin',
    password: 'Password123!' 
};

export const AuthService = {
  /**
   * Simulates a secure backend login process returning a JWT
   */
  login: async (username: string, password: string): Promise<AuthResponse> => {
    // Simulate network latency typical of cryptographic operations
    await new Promise(resolve => setTimeout(resolve, 800));

    if (username === MOCK_CREDS.username && password === MOCK_CREDS.password) {
       // Simulate JWT Generation (Header.Payload.Signature)
       const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
       const payload = btoa(JSON.stringify({ 
           sub: "1001", 
           name: "System Administrator", 
           role: "admin", 
           iat: Math.floor(Date.now() / 1000),
           exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour expiration
       }));
       const signature = btoa("mock-signature-hash-verification"); 
       const token = `${header}.${payload}.${signature}`;

       const user: User = { id: '1001', username: 'admin', role: 'admin' };
       
       // Persist session (Simulated)
       sessionStorage.setItem('auth_token', token);
       sessionStorage.setItem('auth_user', JSON.stringify(user));

       return { token, user };
    }

    throw new Error('Invalid credentials');
  },

  logout: () => {
      sessionStorage.removeItem('auth_token');
      sessionStorage.removeItem('auth_user');
  },

  getCurrentUser: (): User | null => {
      const u = sessionStorage.getItem('auth_user');
      return u ? JSON.parse(u) : null;
  }
};