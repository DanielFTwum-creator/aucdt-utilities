import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import { DbMonitor } from './DbMonitor';
import { useThemeStore } from '../../themeStore';

vi.mock('axios');
const mockedAxios = vi.mocked(axios);

describe('DbMonitor', () => {
  const mockDbStats = {
    tables: {
      entities: { count: 125 },
      metrics: { count: 5432 },
      health_scores: { count: 892 },
      audit_logs: { count: 3456 },
    },
    db_size_mb: '45.2',
    db_size_bytes: 47385600,
    recent_entities: [
      { id: 'e1', name: 'Bank A', status: 'active', updated_at: '2026-04-27T16:30:00Z' },
      { id: 'e2', name: 'Bank B', status: 'active', updated_at: '2026-04-27T16:25:00Z' },
    ],
    recent_metrics: [
      { entity_id: 'e1', metric_type: 'health', value: 85.5, timestamp: '2026-04-27T16:35:00Z' },
      { entity_id: 'e2', metric_type: 'latency', value: 42.3, timestamp: '2026-04-27T16:34:00Z' },
    ],
  };

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark', 'high-contrast');
    useThemeStore.getState().setTheme('light');

    vi.clearAllMocks();
    mockedAxios.get.mockResolvedValue({ data: mockDbStats });
  });

  describe('rendering', () => {
    it('should render database monitor heading', async () => {
      render(<DbMonitor />);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /database monitor/i })).toBeInTheDocument();
      });
    });

    it('should display description text', async () => {
      render(<DbMonitor />);

      await waitFor(() => {
        expect(screen.getByText(/sqlite database status/i)).toBeInTheDocument();
      });
    });

    it('should render database monitor region', () => {
      render(<DbMonitor />);
      expect(screen.getByRole('region', { name: /database monitor/i })).toBeInTheDocument();
    });

    it('should render refresh button', () => {
      render(<DbMonitor />);
      expect(screen.getByRole('button', { name: /refresh database stats/i })).toBeInTheDocument();
    });
  });

  describe('database size', () => {
    it('should fetch and display database size', async () => {
      render(<DbMonitor />);

      await waitFor(() => {
        expect(mockedAxios.get).toHaveBeenCalledWith('/api/v1/admin/db-stats');
      });
    });

    it('should display database size in MB', async () => {
      render(<DbMonitor />);

      await waitFor(() => {
        expect(screen.getByText('Database Size')).toBeInTheDocument();
        expect(screen.getByText('45.2 MB')).toBeInTheDocument();
      });
    });

    it('should display database filename', async () => {
      render(<DbMonitor />);

      await waitFor(() => {
        expect(screen.getByText('fde.db')).toBeInTheDocument();
      });
    });
  });

  describe('table statistics', () => {
    it('should display all table counts', async () => {
      render(<DbMonitor />);

      await waitFor(() => {
        // Check for table row count cards
        expect(screen.getByText('125')).toBeInTheDocument();
        expect(screen.getByText('5,432')).toBeInTheDocument();
      });
    });

    it('should display formatted row counts', async () => {
      render(<DbMonitor />);

      await waitFor(() => {
        expect(screen.getByText('125')).toBeInTheDocument();
        expect(screen.getByText('5,432')).toBeInTheDocument();
        expect(screen.getByText('892')).toBeInTheDocument();
        expect(screen.getByText('3,456')).toBeInTheDocument();
      });
    });

    it('should have table icons with appropriate colors', async () => {
      const { container } = render(<DbMonitor />);

      await waitFor(() => {
        const tableIcons = container.querySelectorAll('[class*="text-"]');
        expect(tableIcons.length).toBeGreaterThan(0);
      });
    });

    it('should format table names properly', async () => {
      render(<DbMonitor />);

      await waitFor(() => {
        // Table names should have underscores replaced with spaces
        expect(screen.getByText(/health scores/i)).toBeInTheDocument();
        expect(screen.getByText(/audit logs/i)).toBeInTheDocument();
      });
    });
  });

  describe('recent entities table', () => {
    it('should display recent entities heading', async () => {
      render(<DbMonitor />);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /recent entities/i })).toBeInTheDocument();
      });
    });

    it('should have table with proper role', async () => {
      render(<DbMonitor />);

      await waitFor(() => {
        const tables = screen.getAllByRole('table', { name: /recent entities/i });
        expect(tables.length).toBeGreaterThan(0);
      });
    });

    it('should have table headers', async () => {
      render(<DbMonitor />);

      await waitFor(() => {
        expect(screen.getByRole('columnheader', { name: /id/i })).toBeInTheDocument();
        expect(screen.getByRole('columnheader', { name: /name/i })).toBeInTheDocument();
        expect(screen.getByRole('columnheader', { name: /status/i })).toBeInTheDocument();
        expect(screen.getByRole('columnheader', { name: /updated/i })).toBeInTheDocument();
      });
    });

    it('should display recent entity data', async () => {
      render(<DbMonitor />);

      await waitFor(() => {
        expect(screen.getByText('Bank A')).toBeInTheDocument();
        expect(screen.getByText('Bank B')).toBeInTheDocument();
      });
    });

    it('should display entity status', async () => {
      render(<DbMonitor />);

      await waitFor(() => {
        const statuses = screen.getAllByText('active');
        expect(statuses.length).toBeGreaterThanOrEqual(2);
      });
    });

    it('should display timestamps in table', async () => {
      render(<DbMonitor />);

      await waitFor(() => {
        // Check for updated_at in the table
        const tableRows = screen.getAllByRole('row');
        expect(tableRows.length).toBeGreaterThan(1);
      });
    });
  });

  describe('recent metrics table', () => {
    it('should display recent metrics heading', async () => {
      render(<DbMonitor />);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /recent metrics/i })).toBeInTheDocument();
      });
    });

    it('should have metrics table with proper role', async () => {
      render(<DbMonitor />);

      await waitFor(() => {
        const tables = screen.getAllByRole('table', { name: /recent metrics/i });
        expect(tables.length).toBeGreaterThan(0);
      });
    });

    it('should have metrics table headers', async () => {
      render(<DbMonitor />);

      await waitFor(() => {
        const headers = screen.getAllByRole('columnheader');
        expect(headers.length).toBeGreaterThanOrEqual(4);
      });
    });

    it('should display metric entity IDs', async () => {
      render(<DbMonitor />);

      await waitFor(() => {
        const metrics = screen.getAllByText('e1');
        expect(metrics.length).toBeGreaterThan(0);
      });
    });

    it('should display metric types', async () => {
      render(<DbMonitor />);

      await waitFor(() => {
        expect(screen.getByText('health')).toBeInTheDocument();
        expect(screen.getByText('latency')).toBeInTheDocument();
      });
    });

    it('should display metric values formatted to 2 decimals', async () => {
      render(<DbMonitor />);

      await waitFor(() => {
        expect(screen.getByText('85.50')).toBeInTheDocument();
        expect(screen.getByText('42.30')).toBeInTheDocument();
      });
    });

    it('should display metric timestamps as local time', async () => {
      render(<DbMonitor />);

      await waitFor(() => {
        // Should display times in locale format
        const timeElements = screen.getAllByText(/\d{1,2}:\d{2}:\d{2}/);
        expect(timeElements.length).toBeGreaterThan(0);
      });
    });
  });

  describe('refresh button', () => {
    it('should call refresh on button click', async () => {
      const user = userEvent.setup();
      render(<DbMonitor />);

      const button = screen.getByRole('button', { name: /refresh database stats/i });
      await user.click(button);

      await waitFor(() => {
        expect(mockedAxios.get).toHaveBeenCalledTimes(2); // Once on mount, once on click
      });
    });

    it('should have proper button attributes', () => {
      render(<DbMonitor />);
      const button = screen.getByRole('button', { name: /refresh database stats/i });

      expect(button).toHaveAttribute('aria-label', 'Refresh database stats');
      expect(button).toHaveAttribute('title', 'Refresh');
    });

    it('should have focus ring on button', () => {
      render(<DbMonitor />);
      const button = screen.getByRole('button', { name: /refresh database stats/i });

      expect(button).toHaveClass('focus:ring-2');
    });
  });

  describe('theme support', () => {
    it('should apply light theme to heading', async () => {
      useThemeStore.getState().setTheme('light');
      render(<DbMonitor />);

      await waitFor(() => {
        const heading = screen.getByRole('heading', { name: /database monitor/i });
        expect(heading).toHaveClass('text-slate-900');
      });
    });

    it('should apply dark theme to heading', async () => {
      useThemeStore.getState().setTheme('dark');
      const { rerender } = render(<DbMonitor />);
      rerender(<DbMonitor />);

      await waitFor(() => {
        const heading = screen.getByRole('heading', { name: /database monitor/i });
        expect(heading.className).toMatch(/text-white|text-yellow/);
      });
    });

    it('should render tables with theme-aware styling', async () => {
      render(<DbMonitor />);

      await waitFor(() => {
        const heading = screen.getByRole('heading', { name: /recent entities/i });
        expect(heading).toHaveClass('font-bold');
      });
    });
  });

  describe('accessibility', () => {
    it('should have region role with label', () => {
      render(<DbMonitor />);
      expect(screen.getByRole('region', { name: /database monitor/i })).toBeInTheDocument();
    });

    it('should have proper table roles', async () => {
      render(<DbMonitor />);

      await waitFor(() => {
        const tables = screen.getAllByRole('table');
        expect(tables.length).toBeGreaterThanOrEqual(2);
      });
    });

    it('should have scoped table headers', async () => {
      render(<DbMonitor />);

      await waitFor(() => {
        const headers = screen.getAllByRole('columnheader');
        headers.forEach(header => {
          expect(header).toHaveAttribute('scope', 'col');
        });
      });
    });

    it('should have aria-hidden on decorative icons', async () => {
      const { container } = render(<DbMonitor />);

      await waitFor(() => {
        const icons = container.querySelectorAll('svg[aria-hidden="true"]');
        expect(icons.length).toBeGreaterThan(0);
      });
    });

    it('should have button title for context', () => {
      render(<DbMonitor />);
      const button = screen.getByRole('button', { name: /refresh database stats/i });
      expect(button).toHaveAttribute('title');
    });
  });

  describe('error handling', () => {
    it('should handle fetch error gracefully', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Network error'));

      render(<DbMonitor />);

      // Should not display stats when fetch fails
      await waitFor(() => {
        expect(screen.queryByText('Database Size')).not.toBeInTheDocument();
      }, { timeout: 1000 });
    });

    it('should still show heading even if fetch fails', async () => {
      mockedAxios.get.mockRejectedValue(new Error('API error'));

      render(<DbMonitor />);

      // Heading should always be visible
      expect(screen.getByRole('heading', { name: /database monitor/i })).toBeInTheDocument();
    });
  });

  describe('polling behavior', () => {
    it('should fetch stats on mount', async () => {
      render(<DbMonitor />);

      await waitFor(() => {
        expect(mockedAxios.get).toHaveBeenCalledWith('/api/v1/admin/db-stats');
      });
    });

    it('should set up polling interval', () => {
      const setSpy = vi.spyOn(global, 'setInterval');
      render(<DbMonitor />);

      expect(setSpy).toHaveBeenCalled();
      setSpy.mockRestore();
    });

    it('should clear interval on unmount', () => {
      const clearSpy = vi.spyOn(global, 'clearInterval');
      const { unmount } = render(<DbMonitor />);

      unmount();

      expect(clearSpy).toHaveBeenCalled();
      clearSpy.mockRestore();
    });
  });

  describe('edge cases', () => {
    it('should handle empty recent entities', async () => {
      mockedAxios.get.mockResolvedValue({
        data: { ...mockDbStats, recent_entities: [] }
      });

      render(<DbMonitor />);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /recent entities/i })).toBeInTheDocument();
      });
    });

    it('should handle empty recent metrics', async () => {
      mockedAxios.get.mockResolvedValue({
        data: { ...mockDbStats, recent_metrics: [] }
      });

      render(<DbMonitor />);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /recent metrics/i })).toBeInTheDocument();
      });
    });

    it('should handle very large table row counts', async () => {
      mockedAxios.get.mockResolvedValue({
        data: {
          ...mockDbStats,
          tables: { huge_table: { count: 1000000 } }
        }
      });

      render(<DbMonitor />);

      await waitFor(() => {
        expect(screen.getByText(/1,000,000/)).toBeInTheDocument();
      });
    });

    it('should handle large database sizes', async () => {
      mockedAxios.get.mockResolvedValue({
        data: { ...mockDbStats, db_size_mb: '2048.5' }
      });

      render(<DbMonitor />);

      await waitFor(() => {
        expect(screen.getByText('2048.5 MB')).toBeInTheDocument();
      });
    });

    it('should handle entity names with special characters', async () => {
      mockedAxios.get.mockResolvedValue({
        data: {
          ...mockDbStats,
          recent_entities: [
            { id: 'e1', name: 'Bank & Co. Ltd.', status: 'active', updated_at: '2026-04-27T16:30:00Z' }
          ]
        }
      });

      render(<DbMonitor />);

      await waitFor(() => {
        expect(screen.getByText(/Bank & Co/)).toBeInTheDocument();
      });
    });

    it('should handle long entity names', async () => {
      mockedAxios.get.mockResolvedValue({
        data: {
          ...mockDbStats,
          recent_entities: [
            {
              id: 'e1',
              name: 'This is a very long entity name that should still display properly',
              status: 'active',
              updated_at: '2026-04-27T16:30:00Z'
            }
          ]
        }
      });

      render(<DbMonitor />);

      await waitFor(() => {
        expect(screen.getByText(/very long entity/)).toBeInTheDocument();
      });
    });

    it('should handle zero values in metrics', async () => {
      mockedAxios.get.mockResolvedValue({
        data: {
          ...mockDbStats,
          recent_metrics: [
            { entity_id: 'e1', metric_type: 'test', value: 0, timestamp: '2026-04-27T16:35:00Z' }
          ]
        }
      });

      render(<DbMonitor />);

      await waitFor(() => {
        expect(screen.getByText('0.00')).toBeInTheDocument();
      });
    });
  });

  describe('table styling', () => {
    it('should have proper row borders', async () => {
      const { container } = render(<DbMonitor />);

      await waitFor(() => {
        const rows = container.querySelectorAll('tr');
        expect(rows.length).toBeGreaterThan(0);
      });
    });

    it('should have responsive layout for tables', async () => {
      render(<DbMonitor />);

      await waitFor(() => {
        const container = screen.getByText('Database Size').closest('div');
        expect(container).toBeInTheDocument();
      });
    });
  });

  describe('database name consistency', () => {
    it('should always reference correct database filename', async () => {
      render(<DbMonitor />);

      await waitFor(() => {
        expect(screen.getByText('fde.db')).toBeInTheDocument();
      });
    });
  });
});
