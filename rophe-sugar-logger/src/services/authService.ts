const TOKEN_KEY = 'rophe_sugar_logger_token';
const USERS_KEY = 'rophe_sugar_logger_users';

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

const getStoredUsers = (): Record<string, { password: string; user: User }> => {
  try {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : {};
  } catch {
    return {};
  }
};

const setStoredUsers = (users: Record<string, { password: string; user: User }>) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const generateToken = (userId: string): string => {
  return `${userId}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

export const AuthService = {
  async register(username: string, email: string, password: string): Promise<AuthResponse> {
    const users = getStoredUsers();

    if (users[username] || Object.values(users).some(u => u.user.email === email)) {
      return { success: false, message: 'Username or email already exists' };
    }

    const userId = `user-${Date.now()}`;
    const user: User = { id: userId, username, email };
    users[username] = { password, user };
    setStoredUsers(users);

    const token = generateToken(userId);
    localStorage.setItem(TOKEN_KEY, token);

    return { success: true, message: 'Registration successful', token, user };
  },

  async login(username: string, password: string): Promise<AuthResponse> {
    const users = getStoredUsers();
    const userRecord = users[username];

    if (!userRecord || userRecord.password !== password) {
      return { success: false, message: 'Invalid username or password' };
    }

    const token = generateToken(userRecord.user.id);
    localStorage.setItem(TOKEN_KEY, token);

    return { success: true, message: 'Login successful', token, user: userRecord.user };
  },

  async validateToken(token: string) {
    try {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      if (storedToken === token) {
        const users = getStoredUsers();
        const user = Object.values(users).find(u => u.user.id === token.split('-')[0])?.user;
        return { success: true, valid: true, user };
      }
      return { success: false, valid: false };
    } catch {
      return { success: false, valid: false };
    }
  },

  logout: () => localStorage.removeItem(TOKEN_KEY),
  isAuthenticated: () => !!localStorage.getItem(TOKEN_KEY),
  getToken: () => localStorage.getItem(TOKEN_KEY),
};
