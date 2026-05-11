import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import axios from 'axios';
import { useSentinelIntegration } from './useSentinelIntegration';

vi.mock('axios');
const mockedAxios = vi.mocked(axios);

describe('useSentinelIntegration', () => {
  const mockHealthResponse = {
    app_id: 137,
    ecosystem_health: {
      overall_score: 85,
    },
    timestamp: '2026-04-27T16:30:00Z',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockedAxios.get.mockResolvedValue({ data: mockHealthResponse });
  });

  describe('initial state', () => {
    it('should start with null health', () => {
      const { result } = renderHook(() => useSentinelIntegration());

      expect(result.current.health).toBeNull();
    });

    it('should start with isLoading true', () => {
      const { result } = renderHook(() => useSentinelIntegration());

      expect(result.current.isLoading).toBe(true);
    });

    it('should start with isConnected false', () => {
      const { result } = renderHook(() => useSentinelIntegration());

      expect(result.current.isConnected).toBe(false);
    });
  });

  describe('health fetching', () => {
    it('should fetch health on mount', async () => {
      renderHook(() => useSentinelIntegration());

      await waitFor(() => {
        expect(mockedAxios.get).toHaveBeenCalledWith('/api/v1/sentinel/health-report');
      });
    });

    it('should set health after successful fetch', async () => {
      const { result } = renderHook(() => useSentinelIntegration());

      await waitFor(() => {
        expect(result.current.health).not.toBeNull();
      });

      expect(result.current.health?.appId).toBe(137);
      expect(result.current.health?.score).toBe(85);
      expect(result.current.health?.status).toBe('healthy');
    });

    it('should set isLoading to false after fetch', async () => {
      const { result } = renderHook(() => useSentinelIntegration());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('should set isConnected to true on successful fetch', async () => {
      const { result } = renderHook(() => useSentinelIntegration());

      await waitFor(() => {
        expect(result.current.isConnected).toBe(true);
      });
    });
  });

  describe('health status classification', () => {
    it('should classify score >= 80 as healthy', async () => {
      mockedAxios.get.mockResolvedValue({
        data: { ...mockHealthResponse, ecosystem_health: { overall_score: 85 } }
      });

      const { result } = renderHook(() => useSentinelIntegration());

      await waitFor(() => {
        expect(result.current.health?.status).toBe('healthy');
      });
    });

    it('should classify score 50-79 as degraded', async () => {
      mockedAxios.get.mockResolvedValue({
        data: { ...mockHealthResponse, ecosystem_health: { overall_score: 65 } }
      });

      const { result } = renderHook(() => useSentinelIntegration());

      await waitFor(() => {
        expect(result.current.health?.status).toBe('degraded');
      });
    });

    it('should classify score < 50 as critical', async () => {
      mockedAxios.get.mockResolvedValue({
        data: { ...mockHealthResponse, ecosystem_health: { overall_score: 30 } }
      });

      const { result } = renderHook(() => useSentinelIntegration());

      await waitFor(() => {
        expect(result.current.health?.status).toBe('critical');
      });
    });

    it('should handle boundary score 80 as healthy', async () => {
      mockedAxios.get.mockResolvedValue({
        data: { ...mockHealthResponse, ecosystem_health: { overall_score: 80 } }
      });

      const { result } = renderHook(() => useSentinelIntegration());

      await waitFor(() => {
        expect(result.current.health?.status).toBe('healthy');
      });
    });

    it('should handle boundary score 50 as degraded', async () => {
      mockedAxios.get.mockResolvedValue({
        data: { ...mockHealthResponse, ecosystem_health: { overall_score: 50 } }
      });

      const { result } = renderHook(() => useSentinelIntegration());

      await waitFor(() => {
        expect(result.current.health?.status).toBe('degraded');
      });
    });

    it('should handle boundary score 49 as critical', async () => {
      mockedAxios.get.mockResolvedValue({
        data: { ...mockHealthResponse, ecosystem_health: { overall_score: 49 } }
      });

      const { result } = renderHook(() => useSentinelIntegration());

      await waitFor(() => {
        expect(result.current.health?.status).toBe('critical');
      });
    });
  });

  describe('polling behavior', () => {
    it('should set up interval on mount', async () => {
      const setSpy = vi.spyOn(global, 'setInterval');

      renderHook(() => useSentinelIntegration());

      await waitFor(() => {
        expect(setSpy).toHaveBeenCalledWith(expect.any(Function), 30000);
      });

      setSpy.mockRestore();
    });

    it('should clear interval on unmount', async () => {
      const clearSpy = vi.spyOn(global, 'clearInterval');

      const { unmount } = renderHook(() => useSentinelIntegration());

      await waitFor(() => {
        expect(mockedAxios.get).toHaveBeenCalled();
      });

      unmount();

      expect(clearSpy).toHaveBeenCalled();

      clearSpy.mockRestore();
    });
  });

  describe('error handling', () => {
    it('should handle fetch errors gracefully', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useSentinelIntegration());

      await waitFor(() => {
        expect(result.current.isConnected).toBe(false);
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.health).toBeNull();
    });

    it('should set isConnected to false on error', async () => {
      mockedAxios.get.mockRejectedValue(new Error('API error'));

      const { result } = renderHook(() => useSentinelIntegration());

      await waitFor(() => {
        expect(result.current.isConnected).toBe(false);
      });
    });

    it('should still set isLoading to false on error', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Fetch failed'));

      const { result } = renderHook(() => useSentinelIntegration());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });
  });

  describe('default values', () => {
    it('should default appId to 137', async () => {
      mockedAxios.get.mockResolvedValue({
        data: { ecosystem_health: { overall_score: 75 } }
      });

      const { result } = renderHook(() => useSentinelIntegration());

      await waitFor(() => {
        expect(result.current.health?.appId).toBe(137);
      });
    });

    it('should default score to 0 if not provided', async () => {
      mockedAxios.get.mockResolvedValue({
        data: { app_id: 200 }
      });

      const { result } = renderHook(() => useSentinelIntegration());

      await waitFor(() => {
        expect(result.current.health?.score).toBe(0);
      });
    });

    it('should use provided timestamp', async () => {
      const timestamp = '2026-04-27T12:00:00Z';
      mockedAxios.get.mockResolvedValue({
        data: {
          app_id: 137,
          ecosystem_health: { overall_score: 85 },
          timestamp
        }
      });

      const { result } = renderHook(() => useSentinelIntegration());

      await waitFor(() => {
        expect(result.current.health?.timestamp).toBe(timestamp);
      });
    });

    it('should generate timestamp if not provided', async () => {
      mockedAxios.get.mockResolvedValue({
        data: { app_id: 137, ecosystem_health: { overall_score: 85 } }
      });

      const { result } = renderHook(() => useSentinelIntegration());

      await waitFor(() => {
        expect(result.current.health?.timestamp).toBeTruthy();
        expect(typeof result.current.health?.timestamp).toBe('string');
      });
    });
  });

  describe('refetch function', () => {
    it('should expose refetch function', async () => {
      const { result } = renderHook(() => useSentinelIntegration());

      expect(result.current.refetch).toBeDefined();
      expect(typeof result.current.refetch).toBe('function');
    });

    it('should refetch on demand', async () => {
      const { result } = renderHook(() => useSentinelIntegration());

      await waitFor(() => {
        expect(mockedAxios.get).toHaveBeenCalledTimes(1);
      });

      await result.current.refetch();

      await waitFor(() => {
        expect(mockedAxios.get).toHaveBeenCalledTimes(2);
      });
    });

    it('should update health on refetch', async () => {
      const { result } = renderHook(() => useSentinelIntegration());

      await waitFor(() => {
        expect(result.current.health?.score).toBe(85);
      });

      mockedAxios.get.mockResolvedValue({
        data: { ...mockHealthResponse, ecosystem_health: { overall_score: 45 } }
      });

      await result.current.refetch();

      await waitFor(() => {
        expect(result.current.health?.score).toBe(45);
        expect(result.current.health?.status).toBe('critical');
      });
    });
  });

  describe('edge cases', () => {
    it('should handle very high score (100)', async () => {
      mockedAxios.get.mockResolvedValue({
        data: { ...mockHealthResponse, ecosystem_health: { overall_score: 100 } }
      });

      const { result } = renderHook(() => useSentinelIntegration());

      await waitFor(() => {
        expect(result.current.health?.status).toBe('healthy');
        expect(result.current.health?.score).toBe(100);
      });
    });

    it('should handle zero score', async () => {
      mockedAxios.get.mockResolvedValue({
        data: { ...mockHealthResponse, ecosystem_health: { overall_score: 0 } }
      });

      const { result } = renderHook(() => useSentinelIntegration());

      await waitFor(() => {
        expect(result.current.health?.status).toBe('critical');
        expect(result.current.health?.score).toBe(0);
      });
    });

    it('should handle decimal scores', async () => {
      mockedAxios.get.mockResolvedValue({
        data: { ...mockHealthResponse, ecosystem_health: { overall_score: 75.5 } }
      });

      const { result } = renderHook(() => useSentinelIntegration());

      await waitFor(() => {
        expect(result.current.health?.score).toBe(75.5);
        expect(result.current.health?.status).toBe('degraded');
      });
    });

    it('should handle large appId values', async () => {
      mockedAxios.get.mockResolvedValue({
        data: { ...mockHealthResponse, app_id: 999999 }
      });

      const { result } = renderHook(() => useSentinelIntegration());

      await waitFor(() => {
        expect(result.current.health?.appId).toBe(999999);
      });
    });
  });

  describe('state consistency', () => {
    it('should return consistent health object structure', async () => {
      const { result } = renderHook(() => useSentinelIntegration());

      await waitFor(() => {
        expect(result.current.health).toHaveProperty('appId');
        expect(result.current.health).toHaveProperty('status');
        expect(result.current.health).toHaveProperty('score');
        expect(result.current.health).toHaveProperty('timestamp');
      });
    });

    it('should have valid status values', async () => {
      const validStatuses = ['healthy', 'degraded', 'critical'];

      const { result } = renderHook(() => useSentinelIntegration());

      await waitFor(() => {
        expect(validStatuses).toContain(result.current.health?.status);
      });
    });
  });
});
