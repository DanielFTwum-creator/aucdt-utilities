import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, act } from '@testing-library/react';
import { useAuth, AuthProvider } from '../../contexts/AuthContext';

// Silence addLog side effects
vi.mock('../../services/auditLogService', () => ({
  addLog: vi.fn(),
}));

const TestConsumer: React.FC<{ onRender: (ctx: ReturnType<typeof useAuth>) => void }> = ({ onRender }) => {
  const ctx = useAuth();
  onRender(ctx);
  return null;
};

describe('AuthContext', () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    sessionStorage.clear();
    vi.clearAllMocks();
    mockFetch.mockResolvedValue({ ok: true, json: async () => ({}) });
    global.fetch = mockFetch as unknown as typeof fetch;
  });

  it('starts unauthenticated', () => {
    let ctx: any;
    render(
      <AuthProvider>
        <TestConsumer onRender={(c) => { ctx = c; }} />
      </AuthProvider>
    );
    expect(ctx.isAdmin).toBe(false);
    expect(ctx.isAuthenticated).toBe(false);
    expect(ctx.userEmail).toBeNull();
  });

  it('requires a Techbridge email for OTP', async () => {
    let ctx: any;
    render(
      <AuthProvider>
        <TestConsumer onRender={(c) => { ctx = c; }} />
      </AuthProvider>
    );

    const invalid = await ctx.requestOtp('user@gmail.com');
    expect(invalid).toBeNull();
    expect(ctx.isAuthenticated).toBe(false);

    let valid: string | null = null;
    await act(async () => {
      valid = await ctx.requestOtp('student@techbridge.edu.gh');
    });
    expect(valid).toMatch(/^[0-9]{6}$/);
    expect(ctx.pendingEmail).toBe('student@techbridge.edu.gh');
  });

  it('verifies OTP and authenticates the user', async () => {
    let ctx: any;
    render(
      <AuthProvider>
        <TestConsumer onRender={(c) => { ctx = c; }} />
      </AuthProvider>
    );

    let otp: string | null = null;
    await act(async () => {
      otp = await ctx.requestOtp('student@techbridge.edu.gh');
    });

    let verified: boolean;
    act(() => {
      verified = ctx.verifyOtp(otp);
    });

    expect(verified!).toBe(true);
    expect(ctx.isAuthenticated).toBe(true);
    expect(ctx.userEmail).toBe('student@techbridge.edu.gh');
    expect(sessionStorage.getItem('dmcdAI-auth-session')).toBe('true');
    expect(sessionStorage.getItem('dmcdAI-auth-email')).toBe('student@techbridge.edu.gh');
  });

  it('admin login succeeds with correct password', () => {
    let ctx: any;
    render(
      <AuthProvider>
        <TestConsumer onRender={(c) => { ctx = c; }} />
      </AuthProvider>
    );
    let result: boolean;
    act(() => { result = ctx.loginAdmin('dmcdai-admin-2025-secure'); });
    expect(result!).toBe(true);
    expect(ctx.isAdmin).toBe(true);
    expect(ctx.isAuthenticated).toBe(true);
    expect(sessionStorage.getItem('dmcdAI-admin-session')).toBe('true');
  });

  it('admin login fails with wrong password', () => {
    let ctx: any;
    render(
      <AuthProvider>
        <TestConsumer onRender={(c) => { ctx = c; }} />
      </AuthProvider>
    );
    let result: boolean;
    act(() => { result = ctx.loginAdmin('wrong'); });
    expect(result!).toBe(false);
    expect(ctx.isAdmin).toBe(false);
    expect(ctx.isAuthenticated).toBe(false);
  });

  it('logout clears both auth and admin sessions', () => {
    let ctx: any;
    render(
      <AuthProvider>
        <TestConsumer onRender={(c) => { ctx = c; }} />
      </AuthProvider>
    );
    act(() => { ctx.loginAdmin('dmcdai-admin-2025-secure'); });
    act(() => { ctx.logout(); });
    expect(ctx.isAdmin).toBe(false);
    expect(ctx.isAuthenticated).toBe(false);
    expect(sessionStorage.getItem('dmcdAI-admin-session')).toBeNull();
    expect(sessionStorage.getItem('dmcdAI-auth-session')).toBeNull();
  });

  it('restores auth session from sessionStorage on mount', () => {
    sessionStorage.setItem('dmcdAI-auth-session', 'true');
    sessionStorage.setItem('dmcdAI-auth-email', 'student@techbridge.edu.gh');
    let ctx: any;
    render(
      <AuthProvider>
        <TestConsumer onRender={(c) => { ctx = c; }} />
      </AuthProvider>
    );
    expect(ctx.isAuthenticated).toBe(true);
    expect(ctx.userEmail).toBe('student@techbridge.edu.gh');
  });
});
