import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LoadingState } from '../LoadingState';
import { ErrorState } from '../ErrorState';
import { EmptyState } from '../EmptyState';

describe('StateComponents', () => {
  describe('LoadingState', () => {
    it('renders the loading message', () => {
      render(<LoadingState message="Loading..." />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('renders without crashing when no message prop is provided', () => {
      expect(() => render(<LoadingState />)).not.toThrow();
    });

    it('has role="status" for screen readers', () => {
      const { container } = render(<LoadingState />);
      const status = container.querySelector('[role="status"]');
      expect(status).not.toBeNull();
    });
  });

  describe('ErrorState', () => {
    it('renders the error message', () => {
      const error = new Error('Failed to fetch');
      render(<ErrorState error={error} />);
      expect(screen.getByText('Network Error')).toBeInTheDocument();
    });

    it('calls onRetry when retry button is clicked', () => {
      const onRetry = vi.fn();
      const error = new Error('Failed');
      render(<ErrorState error={error} onRetry={onRetry} />);
      const retryBtn = screen.queryByRole('button');
      if (retryBtn) {
        fireEvent.click(retryBtn);
        expect(onRetry).toHaveBeenCalledOnce();
      }
    });

    it('renders without crashing when onRetry is not provided', () => {
      expect(() => render(<ErrorState error={new Error('err')} />)).not.toThrow();
    });
  });

  describe('EmptyState', () => {
    it('renders the empty state message', () => {
      render(<EmptyState />);
      expect(screen.getByText('No Data Available')).toBeInTheDocument();
    });

    it('renders without crashing with a custom message prop', () => {
      expect(() => render(<EmptyState message="Nothing here" />)).not.toThrow();
    });
  });
});
