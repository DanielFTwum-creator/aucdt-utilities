/**
 * Session Service — IndexedDB-backed user session management
 * Provides persistent session storage with automatic expiration handling
 */

import {
  saveUserSession,
  getUserSession,
  updateUserSessionActivity,
  deleteUserSession,
  cleanupExpiredSessions,
  getAllUserSessions,
  UserSession,
} from '../lib/db';

const SESSION_CHECK_INTERVAL = 5 * 60 * 1000; // Check every 5 minutes
let sessionCheckTimer: NodeJS.Timeout | null = null;

export const initSessionService = async () => {
  // Clean up expired sessions on init
  await cleanupExpiredSessions();

  // Set up periodic cleanup
  sessionCheckTimer = setInterval(async () => {
    await cleanupExpiredSessions();
  }, SESSION_CHECK_INTERVAL);
};

export const createSession = async (email: string, name?: string): Promise<UserSession> => {
  return saveUserSession(email, name);
};

export const restoreSession = async (email: string): Promise<UserSession | null> => {
  const session = await getUserSession(email);
  if (session) {
    await updateUserSessionActivity(email);
  }
  return session || null;
};

export const updateSession = async (email: string): Promise<void> => {
  await updateUserSessionActivity(email);
};

export const destroySession = async (email: string): Promise<void> => {
  await deleteUserSession(email);
};

export const getAllActiveSessions = async (): Promise<UserSession[]> => {
  return getAllUserSessions();
};

export const stopSessionService = () => {
  if (sessionCheckTimer) {
    clearInterval(sessionCheckTimer);
    sessionCheckTimer = null;
  }
};

export const isSessionValid = async (email: string): Promise<boolean> => {
  const session = await restoreSession(email);
  return session !== null;
};

export const getSessionDuration = (session: UserSession): { days: number; hours: number } => {
  const expiresAt = new Date(session.expiresAt);
  const now = new Date();
  const diffMs = expiresAt.getTime() - now.getTime();

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  return { days, hours };
};
