import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tooltip } from './Tooltip';
import { useThemeStore } from '../themeStore';

describe('Tooltip', () => {
  beforeEach(() => {
    useThemeStore.getState().setTheme('light');
  });

  describe('rendering', () => {
    it('should render children', () => {
      render(
        <Tooltip text="Test tooltip">
          <button>Hover me</button>
        </Tooltip>
      );
      expect(screen.getByText('Hover me')).toBeInTheDocument();
    });

    it('should not show tooltip initially', () => {
      render(
        <Tooltip text="Hidden tooltip">
          <button>Hover me</button>
        </Tooltip>
      );
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });

    it('should show tooltip on mouse enter', async () => {
      const user = userEvent.setup();
      render(
        <Tooltip text="Visible tooltip">
          <button>Hover me</button>
        </Tooltip>
      );

      const button = screen.getByText('Hover me');
      await user.hover(button);

      expect(screen.getByRole('tooltip')).toBeInTheDocument();
      expect(screen.getByText('Visible tooltip')).toBeInTheDocument();
    });

    it('should hide tooltip on mouse leave', async () => {
      const user = userEvent.setup();
      render(
        <Tooltip text="Temporary tooltip">
          <button>Hover me</button>
        </Tooltip>
      );

      const button = screen.getByText('Hover me');
      await user.hover(button);
      expect(screen.getByRole('tooltip')).toBeInTheDocument();

      await user.unhover(button);
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  describe('positioning', () => {
    it('should render with top position by default', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Tooltip text="Top tooltip">
          <button>Hover</button>
        </Tooltip>
      );

      await user.hover(screen.getByText('Hover'));
      const tooltip = screen.getByRole('tooltip');
      expect(tooltip.className).toContain('bottom-full');
    });

    it('should render with bottom position when specified', async () => {
      const user = userEvent.setup();
      render(
        <Tooltip text="Bottom tooltip" position="bottom">
          <button>Hover</button>
        </Tooltip>
      );

      await user.hover(screen.getByText('Hover'));
      const tooltip = screen.getByRole('tooltip');
      expect(tooltip.className).toContain('top-full');
    });

    it('should render with left position when specified', async () => {
      const user = userEvent.setup();
      render(
        <Tooltip text="Left tooltip" position="left">
          <button>Hover</button>
        </Tooltip>
      );

      await user.hover(screen.getByText('Hover'));
      const tooltip = screen.getByRole('tooltip');
      expect(tooltip.className).toContain('right-full');
    });

    it('should render with right position when specified', async () => {
      const user = userEvent.setup();
      render(
        <Tooltip text="Right tooltip" position="right">
          <button>Hover</button>
        </Tooltip>
      );

      await user.hover(screen.getByText('Hover'));
      const tooltip = screen.getByRole('tooltip');
      expect(tooltip.className).toContain('left-full');
    });
  });

  describe('theme support', () => {
    it('should apply light theme styles', async () => {
      const user = userEvent.setup();
      useThemeStore.getState().setTheme('light');
      render(
        <Tooltip text="Light tooltip">
          <button>Hover</button>
        </Tooltip>
      );

      await user.hover(screen.getByText('Hover'));
      const tooltip = screen.getByRole('tooltip');
      expect(tooltip.className).toContain('bg-slate-900');
      expect(tooltip.className).toContain('text-white');
    });

    it('should apply dark theme styles', async () => {
      const user = userEvent.setup();
      useThemeStore.getState().setTheme('dark');
      render(
        <Tooltip text="Dark tooltip">
          <button>Hover</button>
        </Tooltip>
      );

      await user.hover(screen.getByText('Hover'));
      const tooltip = screen.getByRole('tooltip');
      expect(tooltip.className).toContain('bg-slate-700');
      expect(tooltip.className).toContain('text-white');
    });

    it('should apply high-contrast theme styles', async () => {
      const user = userEvent.setup();
      useThemeStore.getState().setTheme('high-contrast');
      render(
        <Tooltip text="High-contrast tooltip">
          <button>Hover</button>
        </Tooltip>
      );

      await user.hover(screen.getByText('Hover'));
      const tooltip = screen.getByRole('tooltip');
      expect(tooltip.className).toContain('bg-yellow-400');
      expect(tooltip.className).toContain('text-black');
    });
  });

  describe('accessibility', () => {
    it('should have tooltip role', async () => {
      const user = userEvent.setup();
      render(
        <Tooltip text="Accessible tooltip">
          <button>Hover</button>
        </Tooltip>
      );

      await user.hover(screen.getByText('Hover'));
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });

    it('should work with keyboard navigation', async () => {
      const user = userEvent.setup();
      render(
        <Tooltip text="Keyboard tooltip">
          <button>Hover me</button>
        </Tooltip>
      );

      const button = screen.getByText('Hover me');
      await user.tab();

      // After tabbing, button should be focused and tooltip should appear
      expect(document.activeElement).toBe(button);
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });

    it('should hide tooltip when focus moves away', async () => {
      const user = userEvent.setup();
      render(
        <>
          <Tooltip text="First tooltip">
            <button>Button 1</button>
          </Tooltip>
          <Tooltip text="Second tooltip">
            <button>Button 2</button>
          </Tooltip>
        </>
      );

      await user.tab();
      expect(screen.getByText('First tooltip')).toBeInTheDocument();

      await user.tab();
      expect(screen.queryByText('First tooltip')).not.toBeInTheDocument();
      expect(screen.getByText('Second tooltip')).toBeInTheDocument();
    });
  });

  describe('multiple tooltips', () => {
    it('should handle multiple tooltips on same page', async () => {
      const user = userEvent.setup();
      render(
        <>
          <Tooltip text="First tooltip">
            <button>Button 1</button>
          </Tooltip>
          <Tooltip text="Second tooltip">
            <button>Button 2</button>
          </Tooltip>
        </>
      );

      await user.hover(screen.getByText('Button 1'));
      expect(screen.getByText('First tooltip')).toBeInTheDocument();
      expect(screen.queryByText('Second tooltip')).not.toBeInTheDocument();

      await user.unhover(screen.getByText('Button 1'));
      await user.hover(screen.getByText('Button 2'));
      expect(screen.queryByText('First tooltip')).not.toBeInTheDocument();
      expect(screen.getByText('Second tooltip')).toBeInTheDocument();
    });
  });

  describe('text content', () => {
    it('should display exact tooltip text', async () => {
      const user = userEvent.setup();
      const tooltipText = 'This is a detailed explanation';
      render(
        <Tooltip text={tooltipText}>
          <button>Hover</button>
        </Tooltip>
      );

      await user.hover(screen.getByText('Hover'));
      expect(screen.getByText(tooltipText)).toBeInTheDocument();
    });

    it('should handle long tooltip text', async () => {
      const user = userEvent.setup();
      const longText = 'This is a very long tooltip that explains the purpose and behavior of this interactive element in great detail';
      render(
        <Tooltip text={longText}>
          <button>Hover</button>
        </Tooltip>
      );

      await user.hover(screen.getByText('Hover'));
      expect(screen.getByText(longText)).toBeInTheDocument();
    });
  });
});
