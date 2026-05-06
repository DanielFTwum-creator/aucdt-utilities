import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import { Testing } from './Testing';
import { useThemeStore } from '../../themeStore';

vi.mock('axios');
const mockedAxios = vi.mocked(axios);

describe('Testing', () => {
  const mockTestResults = {
    results: [
      { name: 'Database Connection', status: 'pass' as const, duration: 145, message: 'Connected successfully' },
      { name: 'API Health Check', status: 'pass' as const, duration: 98, message: 'All endpoints responsive' },
      { name: 'Cache Validation', status: 'fail' as const, duration: 234, message: 'Redis connection timeout' },
    ],
    summary: { total: 3, passed: 2, failed: 1 }
  };

  const mockE2EResults = {
    success: true,
    stdout: 'Running login flow... ✓\nRunning entity list... ✓\nAll tests passed',
    results: { stats: { expected: 5, unexpected: 0 } }
  };

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark', 'high-contrast');
    useThemeStore.getState().setTheme('light');

    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render testing suite heading', () => {
      render(<Testing />);
      expect(screen.getByRole('heading', { name: /testing suite/i })).toBeInTheDocument();
    });

    it('should display description text', () => {
      render(<Testing />);
      expect(screen.getByText(/end-to-end and component diagnostics/i)).toBeInTheDocument();
    });

    it('should render system testing region', () => {
      render(<Testing />);
      expect(screen.getByRole('region', { name: /system testing/i })).toBeInTheDocument();
    });

    it('should render run diagnostics button', () => {
      render(<Testing />);
      expect(screen.getByRole('button', { name: /run backend diagnostics/i })).toBeInTheDocument();
    });

    it('should render run E2E button', () => {
      render(<Testing />);
      expect(screen.getByRole('button', { name: /run E2E UI Tests/i })).toBeInTheDocument();
    });
  });

  describe('test results section', () => {
    it('should display initial no tests message', () => {
      render(<Testing />);
      expect(screen.getByText(/no tests run yet/i)).toBeInTheDocument();
    });

    it('should display Run Test Suite prompt', () => {
      render(<Testing />);
      expect(screen.getByText(/click 'run test suite' to begin/i)).toBeInTheDocument();
    });

    it('should have test results heading', () => {
      render(<Testing />);
      expect(screen.getByRole('heading', { name: /test results/i })).toBeInTheDocument();
    });

    it('should display results after running tests', async () => {
      mockedAxios.post.mockResolvedValue({ data: mockTestResults });

      render(<Testing />);

      const runButton = screen.getByRole('button', { name: /run backend diagnostics/i });
      await userEvent.click(runButton);

      await waitFor(() => {
        expect(screen.getByText('Database Connection')).toBeInTheDocument();
        expect(screen.getByText('API Health Check')).toBeInTheDocument();
        expect(screen.getByText('Cache Validation')).toBeInTheDocument();
      });
    });

    it('should display test durations', async () => {
      mockedAxios.post.mockResolvedValue({ data: mockTestResults });

      render(<Testing />);

      const runButton = screen.getByRole('button', { name: /run backend diagnostics/i });
      await userEvent.click(runButton);

      await waitFor(() => {
        expect(screen.getByText('145ms')).toBeInTheDocument();
        expect(screen.getByText('98ms')).toBeInTheDocument();
        expect(screen.getByText('234ms')).toBeInTheDocument();
      });
    });

    it('should display test messages', async () => {
      mockedAxios.post.mockResolvedValue({ data: mockTestResults });

      render(<Testing />);

      const runButton = screen.getByRole('button', { name: /run backend diagnostics/i });
      await userEvent.click(runButton);

      await waitFor(() => {
        expect(screen.getByText(/connected successfully/i)).toBeInTheDocument();
        expect(screen.getByText(/all endpoints responsive/i)).toBeInTheDocument();
        expect(screen.getByText(/redis connection timeout/i)).toBeInTheDocument();
      });
    });
  });

  describe('E2E results section', () => {
    it('should have E2E results heading', () => {
      render(<Testing />);
      expect(screen.getByRole('heading', { name: /playwright e2e results/i })).toBeInTheDocument();
    });

    it('should display E2E prompt when not run', () => {
      render(<Testing />);
      expect(screen.getByText(/click 'run e2e suite'/i)).toBeInTheDocument();
    });

    it('should display E2E results after running', async () => {
      mockedAxios.post.mockResolvedValue({ data: mockE2EResults });

      render(<Testing />);

      const e2eButton = screen.getByRole('button', { name: /run E2E UI Tests/i });
      await userEvent.click(e2eButton);

      await waitFor(() => {
        expect(screen.getByText(/suite passed/i)).toBeInTheDocument();
      });
    });

    it('should display E2E stdout output', async () => {
      mockedAxios.post.mockResolvedValue({ data: mockE2EResults });

      const { container } = render(<Testing />);

      const e2eButton = screen.getByRole('button', { name: /run E2E UI Tests/i });
      await userEvent.click(e2eButton);

      await waitFor(() => {
        const pre = container.querySelector('pre');
        expect(pre?.textContent).toContain('Running login flow');
      });
    });

    it('should display E2E test counts', async () => {
      mockedAxios.post.mockResolvedValue({ data: mockE2EResults });

      render(<Testing />);

      const e2eButton = screen.getByRole('button', { name: /run E2E UI Tests/i });
      await userEvent.click(e2eButton);

      await waitFor(() => {
        expect(screen.getByText(/5 passed, 0 failed/)).toBeInTheDocument();
      });
    });
  });

  describe('summary section', () => {
    it('should have summary heading', () => {
      render(<Testing />);
      expect(screen.getByRole('heading', { name: /summary/i })).toBeInTheDocument();
    });

    it('should display run tests prompt initially', () => {
      render(<Testing />);
      expect(screen.getByText(/run tests to see summary/i)).toBeInTheDocument();
    });

    it('should display total tests count', async () => {
      mockedAxios.post.mockResolvedValue({ data: mockTestResults });

      render(<Testing />);

      const runButton = screen.getByRole('button', { name: /run backend diagnostics/i });
      await userEvent.click(runButton);

      await waitFor(() => {
        expect(screen.getByText('Total Tests')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument();
      });
    });

    it('should display passed count', async () => {
      mockedAxios.post.mockResolvedValue({ data: mockTestResults });

      render(<Testing />);

      const runButton = screen.getByRole('button', { name: /run backend diagnostics/i });
      await userEvent.click(runButton);

      await waitFor(() => {
        expect(screen.getByText('Passed')).toBeInTheDocument();
        expect(screen.getAllByText('2')).toBeDefined();
      });
    });

    it('should display failed count', async () => {
      mockedAxios.post.mockResolvedValue({ data: mockTestResults });

      render(<Testing />);

      const runButton = screen.getByRole('button', { name: /run backend diagnostics/i });
      await userEvent.click(runButton);

      await waitFor(() => {
        expect(screen.getByText('Failed')).toBeInTheDocument();
        expect(screen.getAllByText('1')).toBeDefined();
      });
    });

    it('should display status message when all pass', async () => {
      const allPassResults = {
        results: [
          { name: 'Test 1', status: 'pass' as const, duration: 100, message: 'OK' },
        ],
        summary: { total: 1, passed: 1, failed: 0 }
      };

      mockedAxios.post.mockResolvedValue({ data: allPassResults });

      render(<Testing />);

      const runButton = screen.getByRole('button', { name: /run backend diagnostics/i });
      await userEvent.click(runButton);

      await waitFor(() => {
        expect(screen.getByText(/all systems go/i)).toBeInTheDocument();
      });
    });

    it('should display status message when tests fail', async () => {
      mockedAxios.post.mockResolvedValue({ data: mockTestResults });

      render(<Testing />);

      const runButton = screen.getByRole('button', { name: /run backend diagnostics/i });
      await userEvent.click(runButton);

      await waitFor(() => {
        expect(screen.getByText(/system needs attention/i)).toBeInTheDocument();
      });
    });
  });

  describe('running states', () => {
    it('should show executing message while running diagnostics', async () => {
      mockedAxios.post.mockImplementation(() =>
        new Promise(resolve => setTimeout(() => resolve({ data: mockTestResults }), 100))
      );

      render(<Testing />);

      const runButton = screen.getByRole('button', { name: /run backend diagnostics/i });
      await userEvent.click(runButton);

      expect(screen.getByText(/executing test suite/i)).toBeInTheDocument();
    });

    it('should disable both buttons while running diagnostics', async () => {
      mockedAxios.post.mockImplementation(() =>
        new Promise(resolve => setTimeout(() => resolve({ data: mockTestResults }), 100))
      );

      render(<Testing />);

      const runButton = screen.getByRole('button', { name: /run backend diagnostics/i });
      await userEvent.click(runButton);

      const e2eButton = screen.getByRole('button', { name: /run E2E UI Tests/i });
      expect(e2eButton).toBeDisabled();
    });

    it('should show Running Playwright message while running E2E', async () => {
      mockedAxios.post.mockImplementation(() =>
        new Promise(resolve => setTimeout(() => resolve({ data: mockE2EResults }), 100))
      );

      render(<Testing />);

      const e2eButton = screen.getByRole('button', { name: /run E2E UI Tests/i });
      await userEvent.click(e2eButton);

      expect(screen.getByText(/running playwright/i)).toBeInTheDocument();
    });
  });

  describe('button states', () => {
    it('should show Run Diagnostics text initially', () => {
      render(<Testing />);
      expect(screen.getByText('Run Diagnostics')).toBeInTheDocument();
    });

    it('should show Executing text while running', async () => {
      mockedAxios.post.mockImplementation(() =>
        new Promise(resolve => setTimeout(() => resolve({ data: mockTestResults }), 100))
      );

      render(<Testing />);

      const runButton = screen.getByRole('button', { name: /run backend diagnostics/i });
      await userEvent.click(runButton);

      expect(screen.getByText('Executing...')).toBeInTheDocument();
    });

    it('should have proper focus ring on diagnostics button', () => {
      render(<Testing />);
      const runButton = screen.getByRole('button', { name: /run backend diagnostics/i });
      expect(runButton).toHaveClass('focus:ring-2');
    });

    it('should have proper focus ring on E2E button', () => {
      render(<Testing />);
      const e2eButton = screen.getByRole('button', { name: /run E2E UI Tests/i });
      expect(e2eButton).toHaveClass('focus:ring-2');
    });
  });

  describe('export report button', () => {
    it('should have export report heading', () => {
      render(<Testing />);
      expect(screen.getByRole('heading', { name: /export report/i })).toBeInTheDocument();
    });

    it('should have download button', () => {
      render(<Testing />);
      expect(screen.getByText('Download PDF Report')).toBeInTheDocument();
    });

    it('should disable download button when no tests run', () => {
      render(<Testing />);
      const downloadButton = screen.getByText('Download PDF Report') as HTMLButtonElement;
      expect(downloadButton.disabled).toBe(true);
    });

    it('should enable download button after tests run', async () => {
      mockedAxios.post.mockResolvedValue({ data: mockTestResults });

      render(<Testing />);

      const runButton = screen.getByRole('button', { name: /run backend diagnostics/i });
      await userEvent.click(runButton);

      await waitFor(() => {
        const downloadButton = screen.getByText('Download PDF Report') as HTMLButtonElement;
        expect(downloadButton.disabled).toBe(false);
      });
    });
  });

  describe('error handling', () => {
    it('should handle diagnostics API error', async () => {
      mockedAxios.post.mockRejectedValue(new Error('API error'));

      render(<Testing />);

      const runButton = screen.getByRole('button', { name: /run backend diagnostics/i });
      await userEvent.click(runButton);

      await waitFor(() => {
        expect(screen.getByText('Diagnostics API')).toBeInTheDocument();
        expect(screen.getByText(/failed to reach api endpoint/i)).toBeInTheDocument();
      });
    });

    it('should handle E2E API error', async () => {
      mockedAxios.post.mockRejectedValue(new Error('E2E error'));

      render(<Testing />);

      const e2eButton = screen.getByRole('button', { name: /run E2E UI Tests/i });
      await userEvent.click(e2eButton);

      await waitFor(() => {
        expect(screen.getByText(/suite failed/i)).toBeInTheDocument();
      });
    });

    it('should mark failed E2E as Suite Failed', async () => {
      const failedE2E = { success: false, stderr: 'Browser crashed' };
      mockedAxios.post.mockResolvedValue({ data: failedE2E });

      render(<Testing />);

      const e2eButton = screen.getByRole('button', { name: /run E2E UI Tests/i });
      await userEvent.click(e2eButton);

      await waitFor(() => {
        expect(screen.getByText(/suite failed/i)).toBeInTheDocument();
      });
    });
  });

  describe('theme support', () => {
    it('should apply light theme to heading', () => {
      useThemeStore.getState().setTheme('light');
      render(<Testing />);

      const heading = screen.getByRole('heading', { name: /testing suite/i });
      expect(heading).toHaveClass('text-slate-900');
    });

    it('should apply dark theme to heading', () => {
      useThemeStore.getState().setTheme('dark');
      const { rerender } = render(<Testing />);
      rerender(<Testing />);

      const heading = screen.getByRole('heading', { name: /testing suite/i });
      expect(heading.className).toMatch(/text-white|text-yellow/);
    });

    it('should render buttons with theme-aware styling', () => {
      render(<Testing />);
      const runButton = screen.getByRole('button', { name: /run backend diagnostics/i });
      expect(runButton).toHaveClass('rounded-lg');
    });
  });

  describe('accessibility', () => {
    it('should have system testing region', () => {
      render(<Testing />);
      expect(screen.getByRole('region', { name: /system testing/i })).toBeInTheDocument();
    });

    it('should have proper button labels', () => {
      render(<Testing />);
      expect(screen.getByRole('button', { name: /run backend diagnostics/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /run E2E UI Tests/i })).toBeInTheDocument();
    });

    it('should have button titles', () => {
      render(<Testing />);
      const runButton = screen.getByRole('button', { name: /run backend diagnostics/i });
      expect(runButton).toHaveAttribute('title', 'Run diagnostics');
    });

    it('should have aria-hidden on decorative icons', () => {
      render(<Testing />);
      const { container } = render(<Testing />);
      const icons = container.querySelectorAll('[aria-hidden="true"]');
      expect(icons.length).toBeGreaterThan(0);
    });

    it('should have test results list with role', async () => {
      mockedAxios.post.mockResolvedValue({ data: mockTestResults });

      render(<Testing />);

      const runButton = screen.getByRole('button', { name: /run backend diagnostics/i });
      await userEvent.click(runButton);

      await waitFor(() => {
        expect(screen.getByRole('list', { name: /test result items/i })).toBeInTheDocument();
      });
    });
  });

  describe('edge cases', () => {
    it('should handle empty test results', async () => {
      const emptyResults = { results: [], summary: { total: 0, passed: 0, failed: 0 } };
      mockedAxios.post.mockResolvedValue({ data: emptyResults });

      render(<Testing />);

      const runButton = screen.getByRole('button', { name: /run backend diagnostics/i });
      await userEvent.click(runButton);

      await waitFor(() => {
        expect(screen.getByText('Total Tests')).toBeInTheDocument();
      });
    });

    it('should handle very long test names', async () => {
      const longNameResults = {
        results: [
          { name: 'This is a very long test name that should still display properly', status: 'pass' as const, duration: 100, message: 'OK' },
        ],
        summary: { total: 1, passed: 1, failed: 0 }
      };
      mockedAxios.post.mockResolvedValue({ data: longNameResults });

      render(<Testing />);

      const runButton = screen.getByRole('button', { name: /run backend diagnostics/i });
      await userEvent.click(runButton);

      await waitFor(() => {
        expect(screen.getByText(/very long test name/)).toBeInTheDocument();
      });
    });

    it('should handle large durations', async () => {
      const slowResults = {
        results: [
          { name: 'Slow Test', status: 'pass' as const, duration: 5000, message: 'Completed' },
        ],
        summary: { total: 1, passed: 1, failed: 0 }
      };
      mockedAxios.post.mockResolvedValue({ data: slowResults });

      render(<Testing />);

      const runButton = screen.getByRole('button', { name: /run backend diagnostics/i });
      await userEvent.click(runButton);

      await waitFor(() => {
        expect(screen.getByText('5000ms')).toBeInTheDocument();
      });
    });

    it('should handle E2E results with high test count', async () => {
      const manyTests = {
        ...mockE2EResults,
        results: { stats: { expected: 150, unexpected: 5 } }
      };
      mockedAxios.post.mockResolvedValue({ data: manyTests });

      render(<Testing />);

      const e2eButton = screen.getByRole('button', { name: /run E2E UI Tests/i });
      await userEvent.click(e2eButton);

      await waitFor(() => {
        expect(screen.getByText(/150 passed, 5 failed/)).toBeInTheDocument();
      });
    });

    it('should handle E2E without stdout', async () => {
      const noStdout = { success: true };
      mockedAxios.post.mockResolvedValue({ data: noStdout });

      render(<Testing />);

      const e2eButton = screen.getByRole('button', { name: /run E2E UI Tests/i });
      await userEvent.click(e2eButton);

      await waitFor(() => {
        expect(screen.getByText(/suite passed/i)).toBeInTheDocument();
      });
    });
  });

  describe('multiple test runs', () => {
    it('should clear results when running tests again', async () => {
      mockedAxios.post.mockResolvedValue({ data: mockTestResults });

      render(<Testing />);

      const runButton = screen.getByRole('button', { name: /run backend diagnostics/i });

      // First run
      await userEvent.click(runButton);
      await waitFor(() => {
        expect(screen.getByText('Database Connection')).toBeInTheDocument();
      });

      // Mock different results for second run
      const newResults = {
        results: [
          { name: 'New Test', status: 'pass' as const, duration: 50, message: 'New result' },
        ],
        summary: { total: 1, passed: 1, failed: 0 }
      };
      mockedAxios.post.mockResolvedValue({ data: newResults });

      // Second run
      await userEvent.click(runButton);
      await waitFor(() => {
        expect(screen.getByText('New Test')).toBeInTheDocument();
      });
    });
  });
});
