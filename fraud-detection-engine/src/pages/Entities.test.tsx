import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Entities } from './Entities';
import { useAppStore } from '../store';
import { useThemeStore } from '../themeStore';

describe('Entities', () => {
  const mockEntities = [
    { id: '1', name: 'Bank A', status: 'active', health_score: 85 },
    { id: '2', name: 'Bank B', status: 'active', health_score: 65 },
    { id: '3', name: 'Bank C', status: 'inactive', health_score: 45 },
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
    it('should render entities heading', () => {
      render(<Entities />);
      expect(screen.getByRole('heading', { name: /entities/i })).toBeInTheDocument();
    });

    it('should display entity count', () => {
      render(<Entities />);
      expect(screen.getByText(/manage all 3 entities/i)).toBeInTheDocument();
    });

    it('should render entity list region', () => {
      render(<Entities />);
      expect(screen.getByRole('region', { name: /entity list/i })).toBeInTheDocument();
    });

    it('should render all entities', () => {
      render(<Entities />);
      expect(screen.getByText('Bank A')).toBeInTheDocument();
      expect(screen.getByText('Bank B')).toBeInTheDocument();
      expect(screen.getByText('Bank C')).toBeInTheDocument();
    });

    it('should display entity IDs', () => {
      render(<Entities />);
      expect(screen.getByText('ID: 1')).toBeInTheDocument();
      expect(screen.getByText('ID: 2')).toBeInTheDocument();
      expect(screen.getByText('ID: 3')).toBeInTheDocument();
    });
  });

  describe('entity status display', () => {
    it('should display active status for active entities', () => {
      render(<Entities />);
      const statuses = screen.getAllByText('active');
      expect(statuses.length).toBe(2);
    });

    it('should display inactive status for inactive entities', () => {
      render(<Entities />);
      expect(screen.getByText('inactive')).toBeInTheDocument();
    });

    it('should show correct status badge styling', () => {
      render(<Entities />);
      const activeStatus = screen.getAllByText('active')[0];
      expect(activeStatus).toHaveClass('rounded-full');
      expect(activeStatus).toHaveClass('text-sm');
    });
  });

  describe('health score display', () => {
    it('should display health scores for all entities', () => {
      render(<Entities />);
      expect(screen.getByText('85.0%')).toBeInTheDocument();
      expect(screen.getByText('65.0%')).toBeInTheDocument();
      expect(screen.getByText('45.0%')).toBeInTheDocument();
    });

    it('should show health score label', () => {
      render(<Entities />);
      const labels = screen.getAllByText(/health score/i);
      expect(labels.length).toBe(3);
    });

    it('should apply healthy color (>=80) to health score text', () => {
      const { container } = render(<Entities />);
      const scoreTexts = Array.from(container.querySelectorAll('.text-emerald-500'));
      expect(scoreTexts.length).toBeGreaterThan(0);
    });

    it('should apply warning color (50-80) to health score text', () => {
      const { container } = render(<Entities />);
      const scoreTexts = Array.from(container.querySelectorAll('.text-yellow-500'));
      expect(scoreTexts.length).toBeGreaterThan(0);
    });

    it('should apply critical color (<50) to health score text', () => {
      const { container } = render(<Entities />);
      const scoreTexts = Array.from(container.querySelectorAll('.text-red-500'));
      expect(scoreTexts.length).toBeGreaterThan(0);
    });
  });

  describe('loading state', () => {
    it('should show loading spinner when isLoading is true', () => {
      useAppStore.setState({ isLoading: true });
      const { container } = render(<Entities />);

      const spinner = container.querySelector('svg.animate-spin');
      expect(spinner).toBeInTheDocument();
    });

    it('should not show entity list when loading', () => {
      useAppStore.setState({ isLoading: true });
      render(<Entities />);

      expect(screen.queryByText('Bank A')).not.toBeInTheDocument();
    });

    it('should show entity list when not loading', () => {
      useAppStore.setState({ isLoading: false });
      render(<Entities />);

      expect(screen.getByText('Bank A')).toBeInTheDocument();
    });
  });

  describe('empty state', () => {
    it('should handle empty entities array', () => {
      useAppStore.setState({ entities: [] });
      render(<Entities />);

      expect(screen.getByText(/manage all 0 entities/i)).toBeInTheDocument();
      expect(screen.queryByText(/bank a|bank b|bank c/i)).not.toBeInTheDocument();
    });

    it('should still render heading for empty state', () => {
      useAppStore.setState({ entities: [] });
      render(<Entities />);

      expect(screen.getByRole('heading', { name: /entities/i })).toBeInTheDocument();
    });
  });

  describe('theme support', () => {
    it('should render heading with styling classes', () => {
      render(<Entities />);
      const heading = screen.getByRole('heading', { name: /entities/i });
      expect(heading).toHaveClass('text-2xl');
      expect(heading).toHaveClass('font-bold');
    });

    it('should render spinner when loading', () => {
      useAppStore.setState({ isLoading: true });
      const { container } = render(<Entities />);

      const spinner = container.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
      expect(spinner?.tagName).toBe('svg');
    });

    it('should apply styling to entity cards', () => {
      render(<Entities />);
      const cards = screen.getAllByRole('listitem');
      expect(cards.length).toBeGreaterThan(0);

      cards.forEach(card => {
        expect(card).toHaveClass('rounded-xl');
        expect(card).toHaveClass('border');
      });
    });
  });

  describe('data fetching', () => {
    it('should fetch entities on mount', async () => {
      const fetchEntitiesMock = vi.fn();
      useAppStore.setState({ fetchEntities: fetchEntitiesMock });

      render(<Entities />);

      await waitFor(() => {
        expect(fetchEntitiesMock).toHaveBeenCalled();
      });
    });

    it('should call fetchEntities only once on mount', async () => {
      const fetchEntitiesMock = vi.fn();
      useAppStore.setState({ fetchEntities: fetchEntitiesMock });

      render(<Entities />);

      await waitFor(() => {
        expect(fetchEntitiesMock).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('accessibility', () => {
    it('should have proper ARIA label on region', () => {
      render(<Entities />);
      expect(screen.getByRole('region', { name: /entity list/i })).toBeInTheDocument();
    });

    it('should have listitem role for each entity', () => {
      render(<Entities />);
      const items = screen.getAllByRole('listitem');
      expect(items.length).toBe(3);
    });

    it('should have aria-label for each entity', () => {
      render(<Entities />);
      expect(screen.getByRole('listitem', { name: /entity bank a/i })).toBeInTheDocument();
      expect(screen.getByRole('listitem', { name: /entity bank b/i })).toBeInTheDocument();
    });

    it('should have hidden database icon', () => {
      const { container } = render(<Entities />);
      const icons = container.querySelectorAll('[aria-hidden="true"]');
      expect(icons.length).toBeGreaterThan(0);
    });
  });

  describe('entity card structure', () => {
    it('should display entity name and ID together', () => {
      render(<Entities />);

      const bankAName = screen.getByText('Bank A');
      const bankAId = screen.getByText('ID: 1');

      expect(bankAName).toBeInTheDocument();
      expect(bankAId).toBeInTheDocument();
    });

    it('should display status and health score on right side', () => {
      render(<Entities />);

      const status = screen.getAllByText('active')[0];
      const healthScore = screen.getByText('85.0%');

      expect(status).toBeInTheDocument();
      expect(healthScore).toBeInTheDocument();
    });

    it('should have transition-colors class for hover effect', () => {
      const { container } = render(<Entities />);
      const cards = container.querySelectorAll('[role="listitem"]');

      cards.forEach(card => {
        expect(card).toHaveClass('transition-colors');
      });
    });
  });

  describe('multiple entities', () => {
    it('should render correct number of entities', () => {
      render(<Entities />);
      const items = screen.getAllByRole('listitem');
      expect(items.length).toBe(3);
    });

    it('should maintain entity order', () => {
      const { container } = render(<Entities />);
      const listitems = container.querySelectorAll('[role="listitem"]');

      expect(listitems[0]).toHaveTextContent('Bank A');
      expect(listitems[1]).toHaveTextContent('Bank B');
      expect(listitems[2]).toHaveTextContent('Bank C');
    });

    it('should handle large entity lists', () => {
      const largeEntityList = Array.from({ length: 20 }, (_, i) => ({
        id: `${i}`,
        name: `Entity ${i}`,
        status: 'active',
        health_score: 80 + Math.random() * 20,
      }));

      useAppStore.setState({ entities: largeEntityList });
      render(<Entities />);

      const items = screen.getAllByRole('listitem');
      expect(items.length).toBe(20);
    });
  });

  describe('edge cases', () => {
    it('should handle entity with 100% health score', () => {
      useAppStore.setState({
        entities: [
          { id: '1', name: 'Perfect Entity', status: 'active', health_score: 100 }
        ]
      });
      render(<Entities />);

      expect(screen.getByText('100.0%')).toBeInTheDocument();
    });

    it('should handle entity with 0% health score', () => {
      useAppStore.setState({
        entities: [
          { id: '1', name: 'Dead Entity', status: 'inactive', health_score: 0 }
        ]
      });
      render(<Entities />);

      expect(screen.getByText('0.0%')).toBeInTheDocument();
    });

    it('should handle entity with boundary health score (80)', () => {
      useAppStore.setState({
        entities: [
          { id: '1', name: 'Boundary Entity', status: 'active', health_score: 80 }
        ]
      });
      render(<Entities />);

      expect(screen.getByText('80.0%')).toBeInTheDocument();
    });

    it('should handle entity with boundary health score (50)', () => {
      useAppStore.setState({
        entities: [
          { id: '1', name: 'Warning Boundary', status: 'active', health_score: 50 }
        ]
      });
      render(<Entities />);

      expect(screen.getByText('50.0%')).toBeInTheDocument();
    });

    it('should handle entity names with special characters', () => {
      useAppStore.setState({
        entities: [
          { id: '1', name: 'Bank & Co. #1', status: 'active', health_score: 85 }
        ]
      });
      render(<Entities />);

      expect(screen.getByText('Bank & Co. #1')).toBeInTheDocument();
    });

    it('should handle very long entity names', () => {
      useAppStore.setState({
        entities: [
          {
            id: '1',
            name: 'This is a very long entity name that should still display properly in the interface',
            status: 'active',
            health_score: 85
          }
        ]
      });
      render(<Entities />);

      expect(screen.getByText(/very long entity name/)).toBeInTheDocument();
    });
  });

  describe('status color coding', () => {
    it('should render status badges with appropriate styling', () => {
      const { container } = render(<Entities />);

      const statusBadges = Array.from(container.querySelectorAll('span')).filter(
        el => el.textContent === 'active' || el.textContent === 'inactive'
      );

      expect(statusBadges.length).toBeGreaterThan(0);
      statusBadges.forEach(badge => {
        expect(badge.className).toMatch(/bg-|text-/);
      });
    });

    it('should distinguish active from inactive status visually', () => {
      render(<Entities />);

      const activeStatuses = screen.getAllByText('active');
      const inactiveStatuses = screen.getAllByText('inactive');

      expect(activeStatuses.length).toBe(2);
      expect(inactiveStatuses.length).toBe(1);

      // Active and inactive have different classes
      expect(activeStatuses[0].className).not.toBe(inactiveStatuses[0].className);
    });

    it('should apply rounded-full class to status badges', () => {
      const { container } = render(<Entities />);

      const statusBadges = Array.from(container.querySelectorAll('span')).filter(
        el => el.textContent === 'active' || el.textContent === 'inactive'
      );

      statusBadges.forEach(badge => {
        expect(badge).toHaveClass('rounded-full');
      });
    });
  });
});
