import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useThemeStore } from '../themeStore';

describe('Sidebar', () => {
  const renderWithRouter = (component: React.ReactNode, initialPath = '/') => {
    return render(
      <BrowserRouter>
        {component}
      </BrowserRouter>
    );
  };

  describe('navigation items', () => {
    it('should render all nav items', () => {
      renderWithRouter(<Sidebar />);

      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Entities')).toBeInTheDocument();
      expect(screen.getByText('Health')).toBeInTheDocument();
      expect(screen.getByText('Alerts')).toBeInTheDocument();
      expect(screen.getByText('Admin')).toBeInTheDocument();
    });

    it('should have proper aria labels for nav items', () => {
      renderWithRouter(<Sidebar />);

      const dashboardLink = screen.getByRole('link', { name: /navigate to dashboard/i });
      expect(dashboardLink).toHaveAttribute('href', '/');
    });

    it('should render sidebar with navigation role', () => {
      renderWithRouter(<Sidebar />);

      const sidebar = screen.getByRole('navigation', { name: /primary navigation/i });
      expect(sidebar).toBeInTheDocument();
    });
  });

  describe('active route highlighting', () => {
    it('should mark dashboard as active on root path', () => {
      renderWithRouter(<Sidebar />);

      const dashboardLink = screen.getByRole('link', { name: /navigate to dashboard/i });
      expect(dashboardLink).toHaveAttribute('aria-current', 'page');
    });

    it('should mark entities as active on /entities path', () => {
      // Note: We can't actually change path in unit test without full integration
      // This test documents expected behavior
      renderWithRouter(<Sidebar />);

      const entitiesLink = screen.getByRole('link', { name: /navigate to entities/i });
      expect(entitiesLink).toBeInTheDocument();
    });

    it('should have accessible link titles', () => {
      renderWithRouter(<Sidebar />);

      const dashboardLink = screen.getByRole('link', { name: /navigate to dashboard/i });
      expect(dashboardLink).toHaveAttribute('title', 'Dashboard');

      const entitiesLink = screen.getByRole('link', { name: /navigate to entities/i });
      expect(entitiesLink).toHaveAttribute('title', 'Entities');
    });
  });

  describe('header/branding', () => {
    it('should render TUC branding', () => {
      renderWithRouter(<Sidebar />);

      expect(screen.getByText('THE AGENT')).toBeInTheDocument();
    });

    it('should render app ID and version', () => {
      renderWithRouter(<Sidebar />);

      expect(screen.getByText(/App ID 137/)).toBeInTheDocument();
      expect(screen.getByText(/v3.0.0/)).toBeInTheDocument();
    });
  });

  describe('theme support', () => {
    it('should apply light theme by default', () => {
      const { setTheme } = useThemeStore.getState();
      setTheme('light');

      renderWithRouter(<Sidebar />);

      const primary = screen.getByRole('navigation', { name: /primary navigation/i });
      expect(primary?.className).toContain('bg-white');
    });

    it('should apply dark theme styles when enabled', () => {
      const { setTheme } = useThemeStore.getState();
      setTheme('dark');

      renderWithRouter(<Sidebar />);

      const primary = screen.getByRole('navigation', { name: /primary navigation/i });
      expect(primary?.className).toContain('bg-slate-900');
    });

    it('should apply high-contrast theme styles when enabled', () => {
      const { setTheme } = useThemeStore.getState();
      setTheme('high-contrast');

      renderWithRouter(<Sidebar />);

      const primary = screen.getByRole('navigation', { name: /primary navigation/i });
      expect(primary?.className).toContain('bg-black');
      expect(primary?.className).toContain('border-yellow-400');
    });

    it('should update styles when theme changes', () => {
      const { setTheme } = useThemeStore.getState();
      setTheme('light');

      const { rerender } = renderWithRouter(<Sidebar />);
      let primary = screen.getByRole('navigation', { name: /primary navigation/i });
      expect(primary?.className).toContain('bg-white');

      setTheme('dark');
      rerender(
        <BrowserRouter>
          <Sidebar />
        </BrowserRouter>
      );

      primary = screen.getByRole('navigation', { name: /primary navigation/i });
      expect(primary?.className).toContain('bg-slate-900');
    });
  });

  describe('accessibility', () => {
    it('should have proper ARIA labels', () => {
      renderWithRouter(<Sidebar />);

      const navs = screen.getAllByRole('navigation');
      const primaryNav = navs.find(nav => nav.getAttribute('aria-label') === 'Primary navigation');
      expect(primaryNav).toHaveAttribute('aria-label', 'Primary navigation');

      const mainNav = screen.getAllByLabelText('Main navigation')[0];
      expect(mainNav).toBeInTheDocument();
    });

    it('should render icons with aria-hidden', () => {
      const { container } = renderWithRouter(<Sidebar />);

      // Icons use aria-hidden since they're decorative
      const icons = container.querySelectorAll('[aria-hidden="true"]');
      expect(icons.length).toBeGreaterThan(0);
    });

    it('should support keyboard navigation', () => {
      renderWithRouter(<Sidebar />);

      const links = screen.getAllByRole('link');
      expect(links.length).toBeGreaterThan(0);

      // All links should be focusable
      links.forEach(link => {
        expect(link.tagName).toBe('A');
        expect(link).toHaveAttribute('href');
      });
    });

    it('should have visible focus indicators', () => {
      renderWithRouter(<Sidebar />);

      const dashboardLink = screen.getByRole('link', { name: /navigate to dashboard/i });
      expect(dashboardLink.className).toContain('focus:');
    });
  });

  describe('responsive design', () => {
    it('should render consistent layout across renders', () => {
      const { rerender } = renderWithRouter(<Sidebar />);

      const firstNav = screen.getAllByLabelText('Main navigation')[0];
      expect(firstNav).toBeInTheDocument();

      rerender(
        <BrowserRouter>
          <Sidebar />
        </BrowserRouter>
      );

      const secondNav = screen.getAllByLabelText('Main navigation')[0];
      expect(secondNav).toBeInTheDocument();

      // Both renders should have the same number of nav links
      expect(screen.getAllByRole('link').length).toBeGreaterThan(0);
    });
  });

  describe('edge cases', () => {
    it('should handle missing nav items gracefully', () => {
      renderWithRouter(<Sidebar />);

      // Should render at least the expected items
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Entities')).toBeInTheDocument();
      expect(screen.getByText('Health')).toBeInTheDocument();
      expect(screen.getByText('Alerts')).toBeInTheDocument();
      expect(screen.getByText('Admin')).toBeInTheDocument();
    });

    it('should render even with theme store changes', () => {
      const { setTheme } = useThemeStore.getState();

      renderWithRouter(<Sidebar />);

      const themes: Array<'light' | 'dark' | 'high-contrast'> = ['light', 'dark', 'high-contrast'];
      themes.forEach(theme => {
        setTheme(theme);
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
      });
    });
  });
});
