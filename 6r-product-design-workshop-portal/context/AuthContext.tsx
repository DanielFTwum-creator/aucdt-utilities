import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, OnboardingData, AuthContextType } from '../types';
import * as authService from '../services/authService';
import { AVATAR_PLACEHOLDER_URL } from '../constants';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);

      // --- Robust LocalStorage Onboarding Data Migration ---
      // Check if onboardingData exists and if it contains the old 'role' property
      if (parsedUser.onboardingData && 'role' in parsedUser.onboardingData) {
        // Migrate old 'role' to new 'onboardingUserRole'
        parsedUser.onboardingData.onboardingUserRole = parsedUser.onboardingData.role;
        delete parsedUser.onboardingData.role; // Remove the old property
      }
      // Ensure onboardingData is fully initialized to the new structure if it's missing or incomplete
      if (!parsedUser.onboardingData || typeof parsedUser.onboardingData.onboardingUserRole === 'undefined') {
        parsedUser.onboardingData = {
          onboardingUserRole: parsedUser.onboardingData?.onboardingUserRole || '',
          experienceLevel: parsedUser.onboardingData?.experienceLevel || '',
          primaryGoal: parsedUser.onboardingData?.primaryGoal || '',
          availableHours: parsedUser.onboardingData?.availableHours || '',
          learningStyle: parsedUser.onboardingData?.learningStyle || '',
        };
      }
      // --- End Migration Logic ---

      setUser(parsedUser);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const loggedInUser = await authService.login(email, password);
      if (loggedInUser) {
        setUser(loggedInUser);
        setIsAuthenticated(true);
        localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (fullName: string, email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const newUser = await authService.register(fullName, email, password);
      if (newUser) {
        // Automatically log in after registration
        setUser(newUser);
        setIsAuthenticated(true);
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userProgress'); // Clear progress on logout
  }, []);

  const updateUserOnboarding = useCallback(async (data: OnboardingData): Promise<boolean> => {
    if (!user) return false;
    setLoading(true);
    try {
      const updatedUser = {
        ...user,
        onboardingCompleted: true,
        onboardingData: data, // data now correctly contains onboardingUserRole
        avatarUrl: AVATAR_PLACEHOLDER_URL, // Set a default avatar on onboarding completion
      };
      await authService.updateUser(updatedUser); // Simulate API call to update user
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      return true;
    } catch (error) {
      console.error('Failed to update onboarding data:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const value = React.useMemo(() => ({
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateUserOnboarding,
    setLoading,
    setUser,
  }), [user, isAuthenticated, isLoading, login, register, logout, updateUserOnboarding]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};