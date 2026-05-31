import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import App from '../../App';
import { AuthProvider } from '../auth/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';

/**
 * Smoke test — verifies the root App component renders without throwing.
 * TUC Phase 3 scaffold — extend with project-specific assertions.
 */
describe('App', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <ThemeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    );
    expect(container).toBeDefined();
    expect(container.firstChild).not.toBeNull();
  });

  it('matches snapshot', () => {
    const { container } = render(
      <ThemeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });
});
