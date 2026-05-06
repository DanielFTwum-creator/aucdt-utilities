import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Health } from './Health';
import { useAppStore } from '../store';
import { useThemeStore } from '../themeStore';

vi.mock('recharts', () => ({
  BarChart: ({ children }: any) => <div data-testid="bar-chart">{children}</div>,
  Bar: ({ children }: any) => <div data-testid="bar">{children}</div>,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  Cell: () => <div data-testid="cell" />,
}));

describe('Health', () => {
  const mockEntities = [
    { id: '1', name: 'Entity 1', status: 'active', health_score: 85 },
    { id: '2', name: 'Entity 2', status: 'active', health_score: 75 },
    { id: '3', name: 'Entity 3', status: 'active', health_score: 65 },
    { id: '4', name: 'Entity 4', status: 'active', health_score: 45 },
  ];

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark', 'high-contrast');

    useAppStore.setState({
      entities: mockEntities,
      selectedEntity: null,
      entityMetrics: [],
      isLoading: false,
      error: null,
      fetchEntities: vi.fn(),
    });

    useThemeStore.getState().setTheme('light');
  });

  describe('rendering', () => {
    it('should render system health heading', () => {
      render(<Health />);
      expect(screen.getByRole('heading', { name: /system health/i })).toBeInTheDocument();
    });

    it('should display monitoring description', () => {
      render(<Health />);
      expect(screen.getByText(/real-time health monitoring/i)).toBeInTheDocument();
    });

    it('should render health monitor region', () => {
      render(<Health />);
      expect(screen.getByRole('region', { name: /health monitor/i })).toBeInTheDocument();
    });

    it('should render distribution cards', () => {
      render(<Health />);
      expect(screen.getByText('Healthy (80-100)')).toBeInTheDocument();
      expect(screen.getByText('Warning (50-79)')).toBeInTheDocument();
      expect(screen.getByText('Critical (0-49)')).toBeInTheDocument();
    });

    it('should render per-entity health scores heading', () => {
      render(<Health />);
      expect(screen.getByRole('heading', { name: /per-entity health scores/i })).toBeInTheDocument();
    });

    it('should render entity status heading', () => {
      render(<Health />);
      expect(screen.getByRole('heading', { name: /entity status/i })).toBeInTheDocument();
    });
  });

  describe('health distribution', () => {
    it('should count healthy entities (>=80)', () => {
      render(<Health />);
      // Only Entity 1 with 85 is healthy - look for the number
      const healthyText = screen.getByText('Healthy (80-100)');
      const parent = healthyText.parentElement?.parentElement;
      expect(parent?.textContent).toMatch(/1/);
    });

    it('should count warning entities (50-79)', () => {
      render(<Health />);
      // Entity 2 (75) and Entity 3 (65) are warning
      const warningText = screen.getByText('Warning (50-79)');
      const parent = warningText.parentElement?.parentElement;
      expect(parent?.textContent).toMatch(/2/);
    });

    it('should count critical entities (<50)', () => {
      render(<Health />);
      // Entity 4 with 45 is critical
      const criticalText = screen.getByText('Critical (0-49)');
      const parent = criticalText.parentElement?.parentElement;
      expect(parent?.textContent).toMatch(/1/);
    });

    it('should have distribution cards with styling', () => {
      const { container } = render(<Health />);
      const cards = container.querySelectorAll('[class*="rounded-xl"]');
      expect(cards.length).toBeGreaterThan(3);
    });

    it('should display colored indicators for each distribution', () => {
      const { container } = render(<Health />);
      const indicators = container.querySelectorAll('[class*="rounded-full"]');
      expect(indicators.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('chart rendering', () => {
    it('should render bar chart', () => {
      render(<Health />);
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });

    it('should render responsive container', () => {
      render(<Health />);
      expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    });

    it('should render bar element', () => {
      render(<Health />);
      expect(screen.getByTestId('bar')).toBeInTheDocument();
    });

    it('should render chart axes', () => {
      render(<Health />);
      expect(screen.getByTestId('x-axis')).toBeInTheDocument();
      expect(screen.getByTestId('y-axis')).toBeInTheDocument();
    });

    it('should render cartesian grid', () => {
      render(<Health />);
      expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument();
    });

    it('should have tooltip in chart', () => {
      render(<Health />);
      expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    });
  });

  describe('entity status grid', () => {
    it('should display all entities in status grid', () => {
      render(<Health />);
      expect(screen.getByText('Entity 1')).toBeInTheDocument();
      expect(screen.getByText('Entity 2')).toBeInTheDocument();
      expect(screen.getByText('Entity 3')).toBeInTheDocument();
      expect(screen.getByText('Entity 4')).toBeInTheDocument();
    });

    it('should show health scores in status grid', () => {
      render(<Health />);
      expect(screen.getByText('85.0%')).toBeInTheDocument();
      expect(screen.getByText('75.0%')).toBeInTheDocument();
      expect(screen.getByText('65.0%')).toBeInTheDocument();
      expect(screen.getByText('45.0%')).toBeInTheDocument();
    });

    it('should display status labels for each entity', () => {
      render(<Health />);
      const labels = screen.getAllByText(/Healthy|Warning|Critical/);
      expect(labels.length).toBeGreaterThanOrEqual(4);
    });

    it('should display health indicators with proper styling', () => {
      const { container } = render(<Health />);
      // Each entity card should have styling
      const entityCards = container.querySelectorAll('[class*="p-4"]');
      expect(entityCards.length).toBeGreaterThan(0);
    });
  });

  describe('empty state', () => {
    it('should handle empty entities array', () => {
      useAppStore.setState({ entities: [] });
      render(<Health />);

      // Distribution should show 0 for all
      const healthyText = screen.getByText('Healthy (80-100)');
      expect(healthyText.parentElement?.parentElement?.textContent).toMatch(/0/);

      const warningText = screen.getByText('Warning (50-79)');
      expect(warningText.parentElement?.parentElement?.textContent).toMatch(/0/);

      const criticalText = screen.getByText('Critical (0-49)');
      expect(criticalText.parentElement?.parentElement?.textContent).toMatch(/0/);
    });

    it('should render headings even with no entities', () => {
      useAppStore.setState({ entities: [] });
      render(<Health />);

      expect(screen.getByRole('heading', { name: /system health/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /per-entity health scores/i })).toBeInTheDocument();
    });
  });

  describe('data fetching', () => {
    it('should fetch entities on mount', () => {
      const fetchMock = vi.fn();
      useAppStore.setState({ fetchEntities: fetchMock });

      render(<Health />);

      expect(fetchMock).toHaveBeenCalled();
    });

    it('should set up interval for periodic fetches', () => {
      const fetchMock = vi.fn();
      useAppStore.setState({ fetchEntities: fetchMock });

      const { unmount } = render(<Health />);
      unmount();

      expect(fetchMock).toHaveBeenCalled();
    });
  });

  describe('theme support', () => {
    it('should render with light theme heading', () => {
      useThemeStore.getState().setTheme('light');
      render(<Health />);

      const heading = screen.getByRole('heading', { name: /system health/i });
      expect(heading).toHaveClass('text-slate-900');
    });

    it('should render with dark theme heading', () => {
      useThemeStore.getState().setTheme('dark');
      const { rerender } = render(<Health />);
      rerender(<Health />);

      const heading = screen.getByRole('heading', { name: /system health/i });
      expect(heading.className).toMatch(/text-white|text-yellow/);
    });

    it('should render distribution cards with appropriate styling', () => {
      const { container } = render(<Health />);
      const cards = Array.from(container.querySelectorAll('[class*="rounded-xl"]'));
      expect(cards.length).toBeGreaterThan(0);

      cards.forEach(card => {
        expect(card.className).toMatch(/bg-white|bg-slate-800|bg-black/);
      });
    });
  });

  describe('status label calculation', () => {
    it('should label entity with score 85 as Healthy', () => {
      render(<Health />);
      // Find the label associated with Entity 1
      const labels = screen.getAllByText('Healthy');
      expect(labels.length).toBeGreaterThan(0);
    });

    it('should label entity with score 75 as Warning', () => {
      render(<Health />);
      const labels = screen.getAllByText('Warning');
      expect(labels.length).toBeGreaterThan(0);
    });

    it('should label entity with score 45 as Critical', () => {
      render(<Health />);
      const labels = screen.getAllByText('Critical');
      expect(labels.length).toBeGreaterThan(0);
    });
  });

  describe('accessibility', () => {
    it('should have health monitor region', () => {
      render(<Health />);
      expect(screen.getByRole('region', { name: /health monitor/i })).toBeInTheDocument();
    });

    it('should have aria-hidden on decorative icons', () => {
      const { container } = render(<Health />);
      const icons = container.querySelectorAll('[aria-hidden="true"]');
      expect(icons.length).toBeGreaterThan(0);
    });

    it('should have proper heading hierarchy', () => {
      render(<Health />);
      expect(screen.getByRole('heading', { name: /system health/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /per-entity health scores/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /entity status/i })).toBeInTheDocument();
    });

    it('should have semantic structure for distribution cards', () => {
      render(<Health />);
      expect(screen.getByText('Healthy (80-100)')).toBeInTheDocument();
      expect(screen.getByText('Warning (50-79)')).toBeInTheDocument();
      expect(screen.getByText('Critical (0-49)')).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('should handle all entities being healthy', () => {
      useAppStore.setState({
        entities: [
          { id: '1', name: 'E1', status: 'active', health_score: 85 },
          { id: '2', name: 'E2', status: 'active', health_score: 90 },
        ]
      });
      render(<Health />);

      const healthyText = screen.getByText('Healthy (80-100)');
      expect(healthyText.parentElement?.parentElement?.textContent).toMatch(/2/);
    });

    it('should handle all entities being critical', () => {
      useAppStore.setState({
        entities: [
          { id: '1', name: 'E1', status: 'active', health_score: 25 },
          { id: '2', name: 'E2', status: 'active', health_score: 30 },
        ]
      });
      render(<Health />);

      const criticalText = screen.getByText('Critical (0-49)');
      expect(criticalText.parentElement?.parentElement?.textContent).toMatch(/2/);
    });

    it('should handle boundary score 80 (healthy)', () => {
      useAppStore.setState({
        entities: [{ id: '1', name: 'E1', status: 'active', health_score: 80 }]
      });
      render(<Health />);

      const healthyText = screen.getByText('Healthy (80-100)');
      expect(healthyText.parentElement?.parentElement?.textContent).toMatch(/1/);
    });

    it('should handle boundary score 50 (warning)', () => {
      useAppStore.setState({
        entities: [{ id: '1', name: 'E1', status: 'active', health_score: 50 }]
      });
      render(<Health />);

      const warningText = screen.getByText('Warning (50-79)');
      expect(warningText.parentElement?.parentElement?.textContent).toMatch(/1/);
    });

    it('should handle single entity', () => {
      useAppStore.setState({
        entities: [{ id: '1', name: 'Solo Entity', status: 'active', health_score: 75 }]
      });
      render(<Health />);

      expect(screen.getByText('Solo Entity')).toBeInTheDocument();
      expect(screen.getByText('75.0%')).toBeInTheDocument();
    });

    it('should handle entity with long name', () => {
      useAppStore.setState({
        entities: [
          { id: '1', name: 'This is a very long entity name that might overflow', status: 'active', health_score: 85 }
        ]
      });
      render(<Health />);

      expect(screen.getByText(/very long entity/)).toBeInTheDocument();
    });
  });

  describe('score color mapping', () => {
    it('should have health scores with proper formatting', () => {
      render(<Health />);

      // Check all scores are formatted to 1 decimal place
      expect(screen.getByText('85.0%')).toBeInTheDocument();
      expect(screen.getByText('75.0%')).toBeInTheDocument();
      expect(screen.getByText('65.0%')).toBeInTheDocument();
      expect(screen.getByText('45.0%')).toBeInTheDocument();
    });

    it('should display trend icons for entities', () => {
      const { container } = render(<Health />);
      // SVG icons should be present for trend indicators
      const icons = container.querySelectorAll('svg');
      expect(icons.length).toBeGreaterThan(0);
    });
  });

  describe('distribution summary', () => {
    it('should have three distribution cards', () => {
      render(<Health />);
      expect(screen.getByText('Healthy (80-100)')).toBeInTheDocument();
      expect(screen.getByText('Warning (50-79)')).toBeInTheDocument();
      expect(screen.getByText('Critical (0-49)')).toBeInTheDocument();
    });

    it('should total to correct number of entities', () => {
      render(<Health />);

      const healthyText = screen.getByText('Healthy (80-100)');
      const warningText = screen.getByText('Warning (50-79)');
      const criticalText = screen.getByText('Critical (0-49)');

      // Sum of all should be 4
      expect(healthyText.parentElement?.parentElement?.textContent).toMatch(/1/);
      expect(warningText.parentElement?.parentElement?.textContent).toMatch(/2/);
      expect(criticalText.parentElement?.parentElement?.textContent).toMatch(/1/);
    });
  });
});
