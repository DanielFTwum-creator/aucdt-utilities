import { User, OnboardingData, UserRole } from '../types';
import { AVATAR_PLACEHOLDER_URL } from '../constants';

const USERS_STORAGE_KEY = 'mockUsers';

// Helper to get all mock users
function getMockUsers(): User[] {
  const users = localStorage.getItem(USERS_STORAGE_KEY);
  // Only ensure password_hash is always present when parsing.
  // Onboarding data migration is handled in AuthContext.tsx
  return users ? JSON.parse(users).map((u: User) => ({ ...u, password_hash: u.password_hash || '' })) : [];
}

// Helper to save all mock users
function saveMockUsers(users: User[]) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

// Simulate user registration
export async function register(fullName: string, email: string, password: string): Promise<User | null> {
  const users = getMockUsers();
  if (users.some(user => user.email === email)) {
    throw new Error('User with this email already exists.');
  }

  // Basic password validation
  if (password.length < 8 || !/[A-Z]/.test(password) || !/\d/.test(password)) {
    throw new Error('Password must be at least 8 characters, contain 1 uppercase letter, and 1 number.');
  }

  const newUser: User = {
    id: `user-${Date.now()}`,
    email,
    fullName,
    password_hash: password,
    avatarUrl: AVATAR_PLACEHOLDER_URL,
    role: 'learner', // Default role
    onboardingCompleted: false,
    createdAt: new Date(),
    lastLogin: new Date(),
    onboardingData: { // Initialize onboardingData with new structure
      onboardingUserRole: '',
      experienceLevel: '',
      primaryGoal: '',
      availableHours: '',
      learningStyle: '',
    },
  };

  users.push(newUser);
  saveMockUsers(users);
  return newUser;
}

// Simulate user login
export async function login(email: string, password: string): Promise<User | null> {
  const users = getMockUsers();
  const user = users.find(u => u.email === email && u.password_hash === password); // Simulate password check
  if (user) {
    // Update last login
    const updatedUser = { ...user, lastLogin: new Date() };
    saveMockUsers(users.map(u => (u.id === user.id ? updatedUser : u)));
    return updatedUser;
  }
  return null;
}

// Simulate updating user data (e.g., after onboarding)
export async function updateUser(user: User): Promise<User> {
  const users = getMockUsers();
  const updatedUsers = users.map(u => (u.id === user.id ? user : u));
  saveMockUsers(updatedUsers);
  return user;
}

// Mock initial admin user for testing if none exists
(() => {
  const users = getMockUsers();
  if (!users.some(u => u.role === 'admin')) {
    const adminUser: User = {
      id: 'admin-123',
      email: 'admin@6r.com',
      fullName: 'Admin User',
      password_hash: 'Admin@123',
      avatarUrl: AVATAR_PLACEHOLDER_URL,
      role: 'admin',
      onboardingCompleted: true, // Admins typically skip onboarding
      createdAt: new Date(),
      lastLogin: new Date(),
      onboardingData: { // Initialize onboardingData with new structure
        onboardingUserRole: 'Professional',
        experienceLevel: 'Advanced',
        primaryGoal: 'Education',
        availableHours: '11+',
        learningStyle: 'Interactive Exercises',
      },
    };
    users.push(adminUser);
    saveMockUsers(users);
  }
})();