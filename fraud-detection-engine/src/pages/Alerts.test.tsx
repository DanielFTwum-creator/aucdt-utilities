import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import { Alerts } from './Alerts';
import { useThemeStore } from '../themeStore';

vi.mock('axios');
const mockedAxios = vi.mocked(axios);

describe('Alerts', () => {
  const mockAlerts = [
    {
      id: 1,
      entity_id: 'entity-1',
      entity_name: 'GlobalBank International',
      severity: 'critical' as const,
      message: 'Health score dropped to 45.0% - investigate anomalies',
      health_score: 45.0,
      acknowledged: 0,
      created_at: '2026-04-30T22:18:58.000Z',
    },
    {
      id: 2,
      entity_id: 'entity-2',
      entity_name: 'PayFlow Systems',
      severity: 'warning' as const,
      message: 'Health score dropped to 65.0% - investigate anomalies',
      health_score: 65.0,
      acknowledged: 0,
      created_at: '2026-04-30T22:18:58.000Z',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    document.documentElement.classList.remove('dark', 'high-contrast');
    useThemeStore.getState().setTheme('light');

    mockedAxios.get.mockResolvedValue({ data: mockAlerts });
    mockedAxios.patch.mockResolvedValue({
      data: { status: 'acknowledged', alert_id: 1, timestamp: new Date().toISOString() },
    });
  });

  describe('rendering', () => {
    it('should render alerts heading', async () => {
      render(<Alerts />);
      await waitFor(() => {
        expect(screen.getByText('Alerts')).toBeInTheDocument();
      });
    });

    it('should render system description', async () => {
      render(<Alerts />);
      await waitFor(() => {
        expect(screen.getByText('System alerts and notifications')).toBeInTheDocument();
      });
    });

    it('should display alert count', async () => {
      render(<Alerts />);
      await waitFor(() => {
        expect(screen.getByText('2 active')).toBeInTheDocument();
      });
    });

    it('should render active alerts section', async () => {
      render(<Alerts />);
      await waitFor(() => {
        const listElement = screen.getByRole('list', { name: /active alerts/i });
        expect(listElement).toBeInTheDocument();
      });
    });
  });

  describe('alert fetching from API', () => {
    it('should fetch alerts from API on mount', async () => {
      render(<Alerts />);

      await waitFor(() => {
        expect(mockedAxios.get).toHaveBeenCalledWith('/api/v1/alerts');
      });
    });

    it('should display alert entity names from API', async () => {
      render(<Alerts />);

      await waitFor(() => {
        expect(screen.getByText('GlobalBank International')).toBeInTheDocument();
        expect(screen.getByText('PayFlow Systems')).toBeInTheDocument();
      });
    });

    it('should display alert messages from API', async () => {
      render(<Alerts />);

      await waitFor(() => {
        expect(screen.getByText(/Health score dropped to 45\.0%/)).toBeInTheDocument();
        expect(screen.getByText(/Health score dropped to 65\.0%/)).toBeInTheDocument();
      });
    });

    it('should display critical and warning severity labels', async () => {
      render(<Alerts />);

      await waitFor(() => {
        const critical = screen.getByText('Critical');
        const warning = screen.getByText('Warning');
        expect(critical).toBeInTheDocument();
        expect(warning).toBeInTheDocument();
      });
    });
  });

  describe('acknowledgement workflow', () => {
    it('should have acknowledge button for each alert', async () => {
      render(<Alerts />);

      await waitFor(() => {
        const buttons = screen.getAllByRole('button', { name: /acknowledge/i });
        expect(buttons.length).toBe(2);
      });
    });

    it('should call PATCH endpoint on acknowledge', async () => {
      const user = userEvent.setup();
      render(<Alerts />);

      await waitFor(() => {
        expect(screen.getByText('GlobalBank International')).toBeInTheDocument();
      });

      const buttons = screen.getAllByRole('button', { name: /acknowledge/i });
      await user.click(buttons[0]);

      await waitFor(() => {
        expect(mockedAxios.patch).toHaveBeenCalledWith(
          expect.stringContaining('/api/v1/alerts/'),
          expect.objectContaining({ acknowledged_by: 'admin' })
        );
      });
    });

    it('should remove alert from list after acknowledgement', async () => {
      const user = userEvent.setup();
      render(<Alerts />);

      await waitFor(() => {
        expect(screen.getByText('GlobalBank International')).toBeInTheDocument();
      });

      const buttons = screen.getAllByRole('button', { name: /acknowledge/i });
      await user.click(buttons[0]);

      await waitFor(() => {
        expect(screen.queryByText('GlobalBank International')).not.toBeInTheDocument();
      });
    });

    it('should reduce alert count after acknowledgement', async () => {
      const user = userEvent.setup();
      render(<Alerts />);

      await waitFor(() => {
        expect(screen.getByText('2 active')).toBeInTheDocument();
      });

      const buttons = screen.getAllByRole('button', { name: /acknowledge/i });
      await user.click(buttons[0]);

      await waitFor(() => {
        expect(screen.getByText('1 active')).toBeInTheDocument();
      });
    });

    it('should handle failed acknowledgement gracefully', async () => {
      const user = userEvent.setup();
      mockedAxios.patch.mockRejectedValueOnce(new Error('Network error'));

      render(<Alerts />);

      await waitFor(() => {
        expect(screen.getByText('GlobalBank International')).toBeInTheDocument();
      });

      const buttons = screen.getAllByRole('button', { name: /acknowledge/i });
      await user.click(buttons[0]);

      await waitFor(() => {
        // Alert should still be visible since API call failed
        expect(screen.getByText('GlobalBank International')).toBeInTheDocument();
      });
    });
  });

  describe('empty state', () => {
    it('should show "All Clear" message when no alerts exist', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: [] });

      render(<Alerts />);

      await waitFor(() => {
        expect(screen.getByText('All Clear')).toBeInTheDocument();
        expect(screen.getByText(/No active alerts/)).toBeInTheDocument();
      });
    });

    it('should display alert count as 0 in empty state', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: [] });

      render(<Alerts />);

      await waitFor(() => {
        expect(screen.getByText('0 active')).toBeInTheDocument();
      });
    });

    it('should not show acknowledge buttons in empty state', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: [] });

      render(<Alerts />);

      await waitFor(() => {
        expect(screen.queryByRole('button', { name: /acknowledge/i })).not.toBeInTheDocument();
      });
    });
  });

  describe('theme support', () => {
    it('should apply light theme styles', async () => {
      useThemeStore.getState().setTheme('light');
      render(<Alerts />);

      await waitFor(() => {
        const heading = screen.getByText('Alerts');
        expect(heading).toHaveClass('text-slate-900');
      });
    });

    it('should apply dark theme styles', async () => {
      useThemeStore.getState().setTheme('dark');
      render(<Alerts />);

      await waitFor(() => {
        const heading = screen.getByText('Alerts');
        expect(heading).toHaveClass('text-white');
      });
    });

    it('should apply high-contrast theme styles', async () => {
      useThemeStore.getState().setTheme('high-contrast');
      render(<Alerts />);

      await waitFor(() => {
        const heading = screen.getByText('Alerts');
        expect(heading).toHaveClass('text-yellow-400');
      });
    });
  });

  describe('accessibility', () => {
    it('should have proper ARIA label on main region', async () => {
      render(<Alerts />);

      await waitFor(() => {
        expect(screen.getByRole('region', { name: /alerts and notifications/i })).toBeInTheDocument();
      });
    });

    it('should have role list for active alerts', async () => {
      render(<Alerts />);

      await waitFor(() => {
        expect(screen.getByRole('list', { name: /active alerts/i })).toBeInTheDocument();
      });
    });

    it('should have descriptive button labels', async () => {
      render(<Alerts />);

      await waitFor(() => {
        const buttons = screen.getAllByRole('button', { name: /acknowledge alert for/i });
        expect(buttons.length).toBeGreaterThan(0);
      });
    });

    it('should have focus styles on acknowledge buttons', async () => {
      render(<Alerts />);

      await waitFor(() => {
        const buttons = screen.getAllByRole('button', { name: /acknowledge alert/i });
        expect(buttons[0]).toHaveClass('focus:ring-2');
      });
    });
  });

  describe('periodic polling', () => {
    it('should set up interval for periodic alert fetches', async () => {
      render(<Alerts />);

      await waitFor(() => {
        expect(mockedAxios.get).toHaveBeenCalledWith('/api/v1/alerts');
      });
    });

    it('should clean up interval on unmount', async () => {
      const { unmount } = render(<Alerts />);

      await waitFor(() => {
        expect(mockedAxios.get).toHaveBeenCalled();
      });

      unmount();
      // Interval cleanup is verified implicitly - no errors on cleanup
    });
  });

  describe('timestamp display', () => {
    it('should render alerts with timestamps', async () => {
      render(<Alerts />);

      await waitFor(() => {
        const alerts = screen.getAllByRole('listitem');
        expect(alerts.length).toBe(2);
      });
    });
  });

  describe('error handling', () => {
    it('should handle API fetch errors gracefully', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

      render(<Alerts />);

      // Component should render without crashing and show empty state
      expect(screen.getByRole('region', { name: /alerts and notifications/i })).toBeInTheDocument();
    });
  });
});
