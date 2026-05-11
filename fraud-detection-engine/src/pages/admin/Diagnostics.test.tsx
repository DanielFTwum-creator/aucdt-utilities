import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import { Diagnostics } from './Diagnostics';
import { useThemeStore } from '../../themeStore';

vi.mock('axios');
const mockedAxios = vi.mocked(axios);

describe('Diagnostics', () => {
  const mockSystemInfo = {
    server: {
      uptime_formatted: '5d 12h 34m',
      started_at: '2026-04-21T12:00:00Z',
      node_version: 'v18.16.0',
      platform: 'linux',
      pid: 12345,
    },
    memory: {
      rss_mb: '256.5',
      heap_used_mb: '128.3',
      heap_total_mb: '512.0',
      external_mb: '8.2',
    },
    app: {
      name: 'Fraud Detection Engine',
      app_id: 1,
      version: '3.0.0',
      environment: 'production',
    },
  };

  const mockTestResults = [
    { name: 'Database Connection', status: 'pass' as const, duration: 145, message: 'Connected successfully' },
    { name: 'API Health', status: 'pass' as const, duration: 89, message: 'All endpoints responding' },
    { name: 'Memory Usage', status: 'warn' as const, duration: 34, message: 'Heap at 65% capacity' },
  ];

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark', 'high-contrast');
    useThemeStore.getState().setTheme('light');

    vi.clearAllMocks();
    mockedAxios.get.mockResolvedValue({ data: mockSystemInfo });
    mockedAxios.post.mockResolvedValue({ data: { results: mockTestResults } });
  });

  describe('rendering', () => {
    it('should render diagnostics heading', async () => {
      render(<Diagnostics />);

      await waitFor(() => {
        const heading = screen.getByRole('heading', { name: /diagnostics/i });
        expect(heading).toBeInTheDocument();
      });
    });

    it('should display description text', async () => {
      render(<Diagnostics />);

      await waitFor(() => {
        expect(screen.getByText(/system health and diagnostic tests/i)).toBeInTheDocument();
      });
    });

    it('should render system diagnostics region', () => {
      render(<Diagnostics />);
      expect(screen.getByRole('region', { name: /system diagnostics/i })).toBeInTheDocument();
    });

    it('should render run diagnostics button', () => {
      render(<Diagnostics />);
      expect(screen.getByRole('button', { name: /run diagnostic tests/i })).toBeInTheDocument();
    });

    it('should display button text correctly', () => {
      render(<Diagnostics />);
      expect(screen.getByText('Run Diagnostics')).toBeInTheDocument();
    });
  });

  describe('system info cards', () => {
    it('should fetch and display system info on mount', async () => {
      render(<Diagnostics />);

      await waitFor(() => {
        expect(mockedAxios.get).toHaveBeenCalledWith('/api/v1/admin/system-info');
      });
    });

    it('should display uptime card', async () => {
      render(<Diagnostics />);

      await waitFor(() => {
        expect(screen.getByText('Uptime')).toBeInTheDocument();
        expect(screen.getByText('5d 12h 34m')).toBeInTheDocument();
      });
    });

    it('should display heap used card', async () => {
      render(<Diagnostics />);

      await waitFor(() => {
        expect(screen.getByText('Heap Used')).toBeInTheDocument();
        expect(screen.getByText('128.3 MB')).toBeInTheDocument();
      });
    });

    it('should display RSS memory card', async () => {
      render(<Diagnostics />);

      await waitFor(() => {
        expect(screen.getByText('RSS Memory')).toBeInTheDocument();
        expect(screen.getByText('256.5 MB')).toBeInTheDocument();
      });
    });

    it('should display Node.js version card', async () => {
      render(<Diagnostics />);

      await waitFor(() => {
        expect(screen.getByText('Node.js')).toBeInTheDocument();
        expect(screen.getByText('v18.16.0')).toBeInTheDocument();
      });
    });

    it('should display platform and PID information', async () => {
      render(<Diagnostics />);

      await waitFor(() => {
        expect(screen.getByText(/linux.*PID 12345/)).toBeInTheDocument();
      });
    });
  });

  describe('app info section', () => {
    it('should display application heading', async () => {
      render(<Diagnostics />);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /application/i })).toBeInTheDocument();
      });
    });

    it('should display app name', async () => {
      render(<Diagnostics />);

      await waitFor(() => {
        expect(screen.getByText('Fraud Detection Engine')).toBeInTheDocument();
      });
    });

    it('should display app ID', async () => {
      render(<Diagnostics />);

      await waitFor(() => {
        expect(screen.getByText(/app id/i)).toBeInTheDocument();
        expect(screen.getByText(/^1$/, { selector: 'div' })).toBeInTheDocument();
      });
    });

    it('should display version', async () => {
      render(<Diagnostics />);

      await waitFor(() => {
        expect(screen.getByText('3.0.0')).toBeInTheDocument();
      });
    });

    it('should display environment', async () => {
      render(<Diagnostics />);

      await waitFor(() => {
        expect(screen.getByText('production')).toBeInTheDocument();
      });
    });
  });

  describe('diagnostic tests', () => {
    it('should not show results initially', () => {
      render(<Diagnostics />);
      expect(screen.queryByText('Diagnostic Results')).not.toBeInTheDocument();
    });

    it('should run diagnostics on button click', async () => {
      const user = userEvent.setup();
      render(<Diagnostics />);

      const button = screen.getByRole('button', { name: /run diagnostic tests/i });
      await user.click(button);

      await waitFor(() => {
        expect(mockedAxios.post).toHaveBeenCalledWith('/api/v1/admin/run-diagnostics');
      });
    });

    it('should display test results after running', async () => {
      const user = userEvent.setup();
      render(<Diagnostics />);

      const button = screen.getByRole('button', { name: /run diagnostic tests/i });
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByText('Diagnostic Results')).toBeInTheDocument();
      });
    });

    it('should display individual test results', async () => {
      const user = userEvent.setup();
      render(<Diagnostics />);

      const button = screen.getByRole('button', { name: /run diagnostic tests/i });
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByText('Database Connection')).toBeInTheDocument();
        expect(screen.getByText('API Health')).toBeInTheDocument();
        expect(screen.getByText('Memory Usage')).toBeInTheDocument();
      });
    });

    it('should display test messages', async () => {
      const user = userEvent.setup();
      render(<Diagnostics />);

      const button = screen.getByRole('button', { name: /run diagnostic tests/i });
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByText('Connected successfully')).toBeInTheDocument();
        expect(screen.getByText('All endpoints responding')).toBeInTheDocument();
        expect(screen.getByText('Heap at 65% capacity')).toBeInTheDocument();
      });
    });

    it('should display test durations', async () => {
      const user = userEvent.setup();
      render(<Diagnostics />);

      const button = screen.getByRole('button', { name: /run diagnostic tests/i });
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByText('145ms')).toBeInTheDocument();
        expect(screen.getByText('89ms')).toBeInTheDocument();
        expect(screen.getByText('34ms')).toBeInTheDocument();
      });
    });
  });

  describe('button states', () => {
    it('should have run diagnostics text initially', () => {
      render(<Diagnostics />);
      expect(screen.getByText('Run Diagnostics')).toBeInTheDocument();
    });

    it('should show running state while executing', async () => {
      const user = userEvent.setup();
      mockedAxios.post.mockImplementation(() => new Promise(resolve => {
        setTimeout(() => resolve({ data: { results: mockTestResults } }), 100);
      }));

      render(<Diagnostics />);

      const button = screen.getByRole('button', { name: /run diagnostic tests/i });
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByText('Running...')).toBeInTheDocument();
      });
    });

    it('should disable button while running', async () => {
      const user = userEvent.setup();
      mockedAxios.post.mockImplementation(() => new Promise(resolve => {
        setTimeout(() => resolve({ data: { results: [] } }), 100);
      }));

      render(<Diagnostics />);

      const button = screen.getByRole('button', { name: /run diagnostic tests/i });
      await user.click(button);

      expect(button).toBeDisabled();
    });

    it('should have proper button styling', () => {
      render(<Diagnostics />);
      const button = screen.getByRole('button', { name: /run diagnostic tests/i });
      expect(button).toHaveClass('rounded-lg');
      expect(button).toHaveClass('font-medium');
    });

    it('should have focus ring on button', () => {
      render(<Diagnostics />);
      const button = screen.getByRole('button', { name: /run diagnostic tests/i });
      expect(button).toHaveClass('focus:ring-2');
    });
  });

  describe('theme support', () => {
    it('should apply light theme to heading', () => {
      useThemeStore.getState().setTheme('light');
      render(<Diagnostics />);

      const heading = screen.getByRole('heading', { name: /diagnostics/i });
      expect(heading).toHaveClass('text-slate-900');
    });

    it('should apply dark theme to heading', () => {
      useThemeStore.getState().setTheme('dark');
      const { rerender } = render(<Diagnostics />);
      rerender(<Diagnostics />);

      const heading = screen.getByRole('heading', { name: /diagnostics/i });
      expect(heading.className).toMatch(/text-white|text-yellow/);
    });

    it('should render cards with theme-aware styling', async () => {
      render(<Diagnostics />);

      await waitFor(() => {
        const uptime = screen.getByText('Uptime');
        const card = uptime.closest('[class*="rounded-xl"]');
        expect(card).toHaveClass('rounded-xl');
        expect(card?.className).toMatch(/bg-white|bg-slate-800|bg-black/);
      });
    });
  });

  describe('accessibility', () => {
    it('should have proper ARIA label on button', () => {
      render(<Diagnostics />);
      const button = screen.getByRole('button', { name: /run diagnostic tests/i });
      expect(button).toHaveAttribute('aria-label');
    });

    it('should have title attribute on button', () => {
      render(<Diagnostics />);
      const button = screen.getByRole('button', { name: /run diagnostic tests/i });
      expect(button).toHaveAttribute('title', 'Run diagnostic tests');
    });

    it('should have proper region role', () => {
      render(<Diagnostics />);
      expect(screen.getByRole('region', { name: /system diagnostics/i })).toBeInTheDocument();
    });

    it('should have test results as list items', async () => {
      const user = userEvent.setup();
      render(<Diagnostics />);

      const button = screen.getByRole('button', { name: /run diagnostic tests/i });
      await user.click(button);

      await waitFor(() => {
        const items = screen.getAllByRole('listitem');
        expect(items.length).toBe(3);
      });
    });

    it('should have aria labels for test status icons', async () => {
      const user = userEvent.setup();
      render(<Diagnostics />);

      const button = screen.getByRole('button', { name: /run diagnostic tests/i });
      await user.click(button);

      await waitFor(() => {
        const passedLabels = screen.getAllByLabelText('Passed');
        const failedLabels = screen.getAllByLabelText('Failed');
        expect(passedLabels.length + failedLabels.length).toBeGreaterThan(0);
      });
    });

    it('should have decorative icons in system info', async () => {
      const { container } = render(<Diagnostics />);

      await waitFor(() => {
        // SVG icons from lucide-react should be present
        const icons = container.querySelectorAll('svg[aria-hidden="true"]');
        expect(icons.length).toBeGreaterThan(0);
      });
    });
  });

  describe('error handling', () => {
    it('should handle system info fetch error gracefully', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Network error'));

      render(<Diagnostics />);

      // Should not show system info cards
      await waitFor(() => {
        expect(screen.queryByText('Uptime')).not.toBeInTheDocument();
      }, { timeout: 1000 });
    });

    it('should handle diagnostics run error', async () => {
      const user = userEvent.setup();
      mockedAxios.post.mockRejectedValue(new Error('API error'));

      render(<Diagnostics />);

      const button = screen.getByRole('button', { name: /run diagnostic tests/i });
      await user.click(button);

      await waitFor(() => {
        // Button should return to normal state
        expect(screen.getByText('Run Diagnostics')).toBeInTheDocument();
      });
    });
  });

  describe('test status icons', () => {
    it('should display pass icon for passing tests', async () => {
      const user = userEvent.setup();
      render(<Diagnostics />);

      const button = screen.getByRole('button', { name: /run diagnostic tests/i });
      await user.click(button);

      await waitFor(() => {
        const passedLabels = screen.getAllByLabelText('Passed');
        expect(passedLabels.length).toBeGreaterThan(0);
      });
    });

    it('should use appropriate colors for pass status', async () => {
      const user = userEvent.setup();
      const { container } = render(<Diagnostics />);

      const button = screen.getByRole('button', { name: /run diagnostic tests/i });
      await user.click(button);

      await waitFor(() => {
        const icons = container.querySelectorAll('[class*="text-emerald"]');
        expect(icons.length).toBeGreaterThan(0);
      });
    });
  });

  describe('polling behavior', () => {
    it('should set up interval for system info polling', () => {
      const setSpy = vi.spyOn(global, 'setInterval');
      render(<Diagnostics />);

      expect(setSpy).toHaveBeenCalled();
      setSpy.mockRestore();
    });

    it('should clear interval on unmount', () => {
      const clearSpy = vi.spyOn(global, 'clearInterval');
      const { unmount } = render(<Diagnostics />);

      unmount();

      expect(clearSpy).toHaveBeenCalled();
      clearSpy.mockRestore();
    });
  });

  describe('edge cases', () => {
    it('should handle empty test results', async () => {
      const user = userEvent.setup();
      mockedAxios.post.mockResolvedValue({ data: { results: [] } });

      render(<Diagnostics />);

      const button = screen.getByRole('button', { name: /run diagnostic tests/i });
      await user.click(button);

      // Results section should not display
      await waitFor(() => {
        expect(screen.queryByText('Diagnostic Results')).not.toBeInTheDocument();
      }, { timeout: 1000 });
    });

    it('should handle very long test names', async () => {
      const user = userEvent.setup();
      const longNameResults = [
        {
          name: 'This is a very long diagnostic test name that should still display correctly',
          status: 'pass' as const,
          duration: 100,
          message: 'Test passed',
        },
      ];
      mockedAxios.post.mockResolvedValue({ data: { results: longNameResults } });

      render(<Diagnostics />);

      const button = screen.getByRole('button', { name: /run diagnostic tests/i });
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByText(/very long diagnostic/)).toBeInTheDocument();
      });
    });

    it('should handle large duration values', async () => {
      const user = userEvent.setup();
      const slowResults = [
        {
          name: 'Slow Test',
          status: 'pass' as const,
          duration: 5000,
          message: 'Completed',
        },
      ];
      mockedAxios.post.mockResolvedValue({ data: { results: slowResults } });

      render(<Diagnostics />);

      const button = screen.getByRole('button', { name: /run diagnostic tests/i });
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByText('5000ms')).toBeInTheDocument();
      });
    });

    it('should handle warning status in tests', async () => {
      const user = userEvent.setup();
      render(<Diagnostics />);

      const button = screen.getByRole('button', { name: /run diagnostic tests/i });
      await user.click(button);

      await waitFor(() => {
        // Warning test should still display
        expect(screen.getByText('Memory Usage')).toBeInTheDocument();
      });
    });
  });

  describe('card styling', () => {
    it('should have consistent card classes', async () => {
      render(<Diagnostics />);

      await waitFor(() => {
        const uptimeText = screen.getByText('Uptime');
        const card = uptimeText.closest('[class*="rounded-xl"]');
        expect(card).toHaveClass('rounded-xl');
        expect(card).toHaveClass('border');
      });
    });

    it('should have proper label styling', async () => {
      render(<Diagnostics />);

      await waitFor(() => {
        const label = screen.getByText('Uptime');
        expect(label.className).toMatch(/uppercase/);
        expect(label.className).toMatch(/tracking-wider/);
      });
    });

    it('should have tabular numbers for values', async () => {
      render(<Diagnostics />);

      await waitFor(() => {
        const value = screen.getByText('5d 12h 34m');
        expect(value.className).toMatch(/tabular-nums/);
      });
    });
  });
});
