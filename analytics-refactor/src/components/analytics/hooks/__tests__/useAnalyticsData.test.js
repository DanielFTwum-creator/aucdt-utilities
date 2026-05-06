import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// Minimal stub CSV that useAnalyticsData would fetch
const MOCK_CSV = [
  'MONTH,SIGNUPS,APPLICANTS,ACCEPTED,REJECTED,WAITLISTED,REGISTERED',
  '2023-01,100,50,25,15,10,20',
  '2023-02,120,60,30,18,12,24',
].join('\n');

describe('useAnalyticsData', () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(MOCK_CSV),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('starts in loading state', async () => {
    const { useAnalyticsData } = await import('../useAnalyticsData');
    const { result } = renderHook(() =>
      useAnalyticsData({ dateRange: { start: null, end: null }, selectedMetrics: ['all'] })
    );
    expect(result.current.loading).toBe(true);
  });

  it('transitions from loading to loaded', async () => {
    const { useAnalyticsData } = await import('../useAnalyticsData');
    const { result } = renderHook(() =>
      useAnalyticsData({ dateRange: { start: null, end: null }, selectedMetrics: ['all'] })
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    }, { timeout: 5000 });

    expect(result.current.error).toBeNull();
    expect(result.current.data).not.toBeNull();
  });

  it('returns processedMetrics after load', async () => {
    const { useAnalyticsData } = await import('../useAnalyticsData');
    const { result } = renderHook(() =>
      useAnalyticsData({ dateRange: { start: null, end: null }, selectedMetrics: ['all'] })
    );

    await waitFor(() => expect(result.current.loading).toBe(false), { timeout: 5000 });

    expect(result.current.processedMetrics).toBeDefined();
  });

  it('handles fetch error gracefully without crashing', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));
    const { useAnalyticsData } = await import('../useAnalyticsData');
    const { result } = renderHook(() =>
      useAnalyticsData({ dateRange: { start: null, end: null }, selectedMetrics: ['all'] })
    );

    await waitFor(() => expect(result.current.loading).toBe(false), { timeout: 5000 });

    // Hook should not throw; either error is set or fallback data is used
    expect(result.current).toBeDefined();
    expect(typeof result.current.loading).toBe('boolean');
  });
});
