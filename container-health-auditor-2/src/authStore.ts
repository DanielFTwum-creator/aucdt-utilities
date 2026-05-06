import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  user: { name: string; role: string } | null;
  login: (username: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  login: (username: string) => set({ 
    isAuthenticated: true, 
    user: { name: username, role: 'admin' } 
  }),
  logout: () => set({ isAuthenticated: false, user: null }),
}));
