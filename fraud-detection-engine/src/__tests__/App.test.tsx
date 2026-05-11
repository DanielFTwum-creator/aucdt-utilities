import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

/**
 * Smoke test — verifies the root App component renders without throwing.
 * TUC Phase 3 scaffold — extend with project-specific assertions.
 */
describe('App', () => {
  it('renders without crashing', () => {
    const { container } = render(<App />);
    expect(container).toBeDefined();
    expect(container.firstChild).not.toBeNull();
  });

  it('renders main app components', () => {
    render(<App />);
    // Check that key components render
    expect(screen.getByText('THE AGENT')).toBeInTheDocument();
    const navs = screen.getAllByRole('navigation');
    expect(navs.length).toBeGreaterThan(0);
  });

  it('renders at least one navigation link', () => {
    render(<App />);
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });
});
