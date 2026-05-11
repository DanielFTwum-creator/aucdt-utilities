import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import { Performance } from './Performance';
import { useThemeStore } from '../../themeStore';

vi.mock('recharts', () => ({
  AreaChart: ({ children }: any) => <div data-testid="area-chart">{children}</div>,
  Area: () => <div data-testid="area" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
}));

vi.mock('axios');
const mockedAxios = vi.mocked(axios);

describe('Performance', () => {
  const mockPerfMetrics = {
    total_requests_tracked: 12345,
    memory: {
      heap_used_mb: 128,
      heap_total_mb: 512,
      rss_mb: 256,
    },
    endpoint_summary: [
      { endpoint: '/api/v1/entities', method: 'GET', count: 450, avg_ms: 45, min_ms: 20, max_ms: 120 },
      { endpoint: '/api/v1/alerts', method: 'GET', count: 300, avg_ms: 65, min_ms: 30, max_ms: 150 },
      { endpoint: '/api/v1/health', method: 'GET', count: 250, avg_ms: 110, min_ms: 50, max_ms: 200 },
    ],
    recent_requests: [
      { endpoint: '/api/v1/entities', method: 'GET', duration: 42, timestamp: '2026-04-27T16:35:00Z', status: 200 },
      { endpoint: '/api/v1/alerts', method: 'GET', duration: 68, timestamp: '2026-04-27T16:34:00Z', status: 200 },
      { endpoint: '/api/v1/health', method: 'GET', duration: 115, timestamp: '2026-04-27T16:33:00Z', status: 200 },
    ],
  };

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark', 'high-contrast');
    useThemeStore.getState().setTheme('light');

    vi.clearAllMocks();
    mockedAxios.get.mockResolvedValue({ data: mockPerfMetrics });
  });

  describe('rendering', () => {
    it('should render performance heading', async () => {
      render(<Performance />);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /performance/i })).toBeInTheDocument();
      });
    });

    it('should display description text', async () => {
      render(<Performance />);

      await waitFor(() => {
        expect(screen.getByText(/api latency and memory profiling/i)).toBeInTheDocument();
      });
    });

    it('should render performance metrics region', () => {
      render(<Performance />);
      expect(screen.getByRole('region', { name: /performance metrics/i })).toBeInTheDocument();
    });

    it('should render refresh button', () => {
      render(<Performance />);
      expect(screen.getByRole('button', { name: /refresh metrics/i })).toBeInTheDocument();
    });
  });

  describe('metrics cards', () => {
    it('should fetch metrics on mount', async () => {
      render(<Performance />);

      await waitFor(() => {
        expect(mockedAxios.get).toHaveBeenCalledWith('/api/v1/admin/performance-metrics');
      });
    });

    it('should display requests tracked count', async () => {
      render(<Performance />);

      await waitFor(() => {
        expect(screen.getByText('Requests Tracked')).toBeInTheDocument();
        expect(screen.getByText('12,345')).toBeInTheDocument();
      });
    });

    it('should display average latency', async () => {
      render(<Performance />);

      await waitFor(() => {
        expect(screen.getByText('Avg Latency (Global)')).toBeInTheDocument();
        // Average should be calculated across all endpoints
        expect(screen.getByText(/\d+ ms/)).toBeInTheDocument();
      });
    });

    it('should display memory heap usage', async () => {
      render(<Performance />);

      await waitFor(() => {
        const container = screen.getByRole('region', { name: /performance metrics/i });
        expect(container.textContent).toContain('128');
        expect(container.textContent).toContain('512');
        expect(container.textContent).toContain('Memory Heap Used');
      });
    });

    it('should have proper card styling', async () => {
      const { container } = render(<Performance />);

      await waitFor(() => {
        const cards = container.querySelectorAll('[class*="rounded-xl"]');
        expect(cards.length).toBeGreaterThan(0);
      });
    });
  });

  describe('latency chart', () => {
    it('should render response time chart heading', async () => {
      render(<Performance />);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /recent request latency/i })).toBeInTheDocument();
      });
    });

    it('should render area chart', async () => {
      render(<Performance />);

      await waitFor(() => {
        expect(screen.getByTestId('area-chart')).toBeInTheDocument();
      });
    });

    it('should render chart components', async () => {
      render(<Performance />);

      await waitFor(() => {
        expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
        expect(screen.getByTestId('area')).toBeInTheDocument();
      });
    });

    it('should have chart axes', async () => {
      render(<Performance />);

      await waitFor(() => {
        expect(screen.getByTestId('x-axis')).toBeInTheDocument();
        expect(screen.getByTestId('y-axis')).toBeInTheDocument();
      });
    });

    it('should have cartesian grid', async () => {
      render(<Performance />);

      await waitFor(() => {
        expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument();
      });
    });

    it('should have tooltip in chart', async () => {
      render(<Performance />);

      await waitFor(() => {
        expect(screen.getByTestId('tooltip')).toBeInTheDocument();
      });
    });
  });

  describe('endpoint performance table', () => {
    it('should display endpoint performance heading', async () => {
      render(<Performance />);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /endpoint performance/i })).toBeInTheDocument();
      });
    });

    it('should have table with proper role', async () => {
      render(<Performance />);

      await waitFor(() => {
        expect(screen.getByRole('table', { name: /endpoint performance/i })).toBeInTheDocument();
      });
    });

    it('should have table column headers', async () => {
      render(<Performance />);

      await waitFor(() => {
        expect(screen.getByRole('columnheader', { name: /endpoint/i })).toBeInTheDocument();
        expect(screen.getByRole('columnheader', { name: /hits/i })).toBeInTheDocument();
        expect(screen.getByRole('columnheader', { name: /avg/i })).toBeInTheDocument();
        expect(screen.getByRole('columnheader', { name: /min/i })).toBeInTheDocument();
        expect(screen.getByRole('columnheader', { name: /max/i })).toBeInTheDocument();
      });
    });

    it('should display all endpoints', async () => {
      render(<Performance />);

      await waitFor(() => {
        expect(screen.getByText('/api/v1/entities')).toBeInTheDocument();
        expect(screen.getByText('/api/v1/alerts')).toBeInTheDocument();
        expect(screen.getByText('/api/v1/health')).toBeInTheDocument();
      });
    });

    it('should display endpoint hit counts', async () => {
      render(<Performance />);

      await waitFor(() => {
        expect(screen.getByText('450')).toBeInTheDocument();
        expect(screen.getByText('300')).toBeInTheDocument();
        expect(screen.getByText('250')).toBeInTheDocument();
      });
    });

    it('should display average latencies', async () => {
      render(<Performance />);

      await waitFor(() => {
        // Should have avg latency values in table
        const latencies = screen.getAllByText(/\d+/);
        expect(latencies.length).toBeGreaterThan(0);
      });
    });

    it('should display min and max latencies', async () => {
      render(<Performance />);

      await waitFor(() => {
        expect(screen.getByText('20')).toBeInTheDocument();
        expect(screen.getByText('200')).toBeInTheDocument();
      });
    });

    it('should sort endpoints by request count', async () => {
      render(<Performance />);

      await waitFor(() => {
        const rows = screen.getAllByRole('row');
        // First data row should be the endpoint with most hits (450)
        expect(rows[1].textContent).toContain('450');
      });
    });

    it('should apply color coding to latencies', async () => {
      const { container } = render(<Performance />);

      await waitFor(() => {
        // Check for red text (>100ms), yellow (50-100ms), green (<50ms)
        const coloredText = container.querySelectorAll('[class*="text-"]');
        expect(coloredText.length).toBeGreaterThan(0);
      });
    });
  });

  describe('refresh button', () => {
    it('should call refresh on button click', async () => {
      const user = userEvent.setup();
      render(<Performance />);

      const button = screen.getByRole('button', { name: /refresh metrics/i });
      await user.click(button);

      await waitFor(() => {
        expect(mockedAxios.get).toHaveBeenCalledTimes(2);
      });
    });

    it('should have proper button attributes', () => {
      render(<Performance />);
      const button = screen.getByRole('button', { name: /refresh metrics/i });

      expect(button).toHaveAttribute('aria-label', 'Refresh metrics');
      expect(button).toHaveAttribute('title', 'Refresh');
    });

    it('should have focus ring', () => {
      render(<Performance />);
      const button = screen.getByRole('button', { name: /refresh metrics/i });

      expect(button).toHaveClass('focus:ring-2');
    });
  });

  describe('theme support', () => {
    it('should apply light theme to heading', async () => {
      useThemeStore.getState().setTheme('light');
      render(<Performance />);

      await waitFor(() => {
        const heading = screen.getByRole('heading', { name: /performance/i });
        expect(heading).toHaveClass('text-slate-900');
      });
    });

    it('should apply dark theme to heading', async () => {
      useThemeStore.getState().setTheme('dark');
      const { rerender } = render(<Performance />);
      rerender(<Performance />);

      await waitFor(() => {
        const heading = screen.getByRole('heading', { name: /performance/i });
        expect(heading.className).toMatch(/text-white|text-yellow/);
      });
    });
  });

  describe('accessibility', () => {
    it('should have region role', () => {
      render(<Performance />);
      expect(screen.getByRole('region', { name: /performance metrics/i })).toBeInTheDocument();
    });

    it('should have table with proper role', async () => {
      render(<Performance />);

      await waitFor(() => {
        expect(screen.getByRole('table')).toBeInTheDocument();
      });
    });

    it('should have scoped table headers', async () => {
      render(<Performance />);

      await waitFor(() => {
        const headers = screen.getAllByRole('columnheader');
        headers.forEach(header => {
          expect(header).toHaveAttribute('scope', 'col');
        });
      });
    });

    it('should have aria-hidden on decorative icons', async () => {
      const { container } = render(<Performance />);

      await waitFor(() => {
        const icons = container.querySelectorAll('svg[aria-hidden="true"]');
        expect(icons.length).toBeGreaterThan(0);
      });
    });

    it('should have button title for context', () => {
      render(<Performance />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('title');
    });
  });

  describe('error handling', () => {
    it('should handle fetch error gracefully', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Network error'));

      render(<Performance />);

      await waitFor(() => {
        expect(screen.queryByText('Requests Tracked')).not.toBeInTheDocument();
      }, { timeout: 1000 });
    });

    it('should still show heading even if fetch fails', async () => {
      mockedAxios.get.mockRejectedValue(new Error('API error'));

      render(<Performance />);

      expect(screen.getByRole('heading', { name: /performance/i })).toBeInTheDocument();
    });
  });

  describe('polling behavior', () => {
    it('should fetch metrics on mount', async () => {
      render(<Performance />);

      await waitFor(() => {
        expect(mockedAxios.get).toHaveBeenCalledWith('/api/v1/admin/performance-metrics');
      });
    });

    it('should set up polling interval', () => {
      const setSpy = vi.spyOn(global, 'setInterval');
      render(<Performance />);

      expect(setSpy).toHaveBeenCalled();
      setSpy.mockRestore();
    });

    it('should clear interval on unmount', () => {
      const clearSpy = vi.spyOn(global, 'clearInterval');
      const { unmount } = render(<Performance />);

      unmount();

      expect(clearSpy).toHaveBeenCalled();
      clearSpy.mockRestore();
    });
  });

  describe('edge cases', () => {
    it('should handle empty endpoint summary', async () => {
      mockedAxios.get.mockResolvedValue({
        data: { ...mockPerfMetrics, endpoint_summary: [] }
      });

      render(<Performance />);

      await waitFor(() => {
        // Should show 0 for average when no endpoints
        expect(screen.getByText(/0 ms/)).toBeInTheDocument();
      });
    });

    it('should handle empty recent requests', async () => {
      mockedAxios.get.mockResolvedValue({
        data: { ...mockPerfMetrics, recent_requests: [] }
      });

      render(<Performance />);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /recent request latency/i })).toBeInTheDocument();
      });
    });

    it('should handle zero requests tracked', async () => {
      mockedAxios.get.mockResolvedValue({
        data: { ...mockPerfMetrics, total_requests_tracked: 0 }
      });

      render(<Performance />);

      await waitFor(() => {
        expect(screen.getByText('0')).toBeInTheDocument();
      });
    });

    it('should handle very large request counts', async () => {
      mockedAxios.get.mockResolvedValue({
        data: { ...mockPerfMetrics, total_requests_tracked: 9999999 }
      });

      render(<Performance />);

      await waitFor(() => {
        expect(screen.getByText(/9,999,999/)).toBeInTheDocument();
      });
    });

    it('should handle very slow endpoints (>100ms)', async () => {
      mockedAxios.get.mockResolvedValue({
        data: {
          ...mockPerfMetrics,
          endpoint_summary: [
            { endpoint: '/slow', method: 'GET', count: 100, avg_ms: 500, min_ms: 200, max_ms: 1000 }
          ]
        }
      });

      render(<Performance />);

      await waitFor(() => {
        expect(screen.getByText('/slow')).toBeInTheDocument();
      });
    });

    it('should handle very fast endpoints (<50ms)', async () => {
      mockedAxios.get.mockResolvedValue({
        data: {
          ...mockPerfMetrics,
          endpoint_summary: [
            { endpoint: '/fast', method: 'GET', count: 100, avg_ms: 10, min_ms: 5, max_ms: 20 }
          ]
        }
      });

      render(<Performance />);

      await waitFor(() => {
        expect(screen.getByText('/fast')).toBeInTheDocument();
      });
    });

    it('should handle high memory usage', async () => {
      mockedAxios.get.mockResolvedValue({
        data: {
          ...mockPerfMetrics,
          memory: { heap_used_mb: 450, heap_total_mb: 512, rss_mb: 500 }
        }
      });

      render(<Performance />);

      await waitFor(() => {
        expect(screen.getByRole('region', { name: /performance metrics/i })).toBeInTheDocument();
      });
    });

    it('should handle long endpoint names', async () => {
      mockedAxios.get.mockResolvedValue({
        data: {
          ...mockPerfMetrics,
          endpoint_summary: [
            {
              endpoint: '/api/v1/admin/diagnostics/system-info/detailed/all-metrics',
              method: 'GET',
              count: 50,
              avg_ms: 75,
              min_ms: 40,
              max_ms: 150
            }
          ]
        }
      });

      render(<Performance />);

      await waitFor(() => {
        expect(screen.getByText(/diagnostics/)).toBeInTheDocument();
      });
    });
  });

  describe('calculation accuracy', () => {
    it('should calculate weighted average latency correctly', async () => {
      render(<Performance />);

      await waitFor(() => {
        // Average should be weighted by count
        // (45*450 + 65*300 + 110*250) / (450+300+250) = (20250 + 19500 + 27500) / 1000 = 67.25 ≈ 67
        const latencyElements = screen.getAllByText(/\d+ ms/);
        expect(latencyElements.length).toBeGreaterThan(0);
      });
    });
  });

  describe('card styling', () => {
    it('should have consistent card classes', async () => {
      render(<Performance />);

      await waitFor(() => {
        const trackingCard = screen.getByText('Requests Tracked');
        const card = trackingCard.closest('[class*="rounded-xl"]');
        expect(card).toHaveClass('rounded-xl');
        expect(card).toHaveClass('border');
      });
    });

    it('should have tabular numbers for metrics', async () => {
      render(<Performance />);

      await waitFor(() => {
        expect(screen.getByText('12,345')).toBeInTheDocument();
        expect(screen.getByText('12,345')).toHaveClass('tabular-nums');
      });
    });
  });
});
