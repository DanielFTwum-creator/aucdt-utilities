import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { RequireAuth } from './RequireAuth';
import { useAuthStore } from '../authStore';

describe('RequireAuth', () => {
  beforeEach(() => {
    const store = useAuthStore.getState();
    store.logout();
  });

  const renderWithRouter = (component: React.ReactNode) => {
    return render(
      <BrowserRouter>
        {component}
      </BrowserRouter>
    );
  };

  describe('when unauthenticated', () => {
    it('should redirect to login page', () => {
      renderWithRouter(
        <RequireAuth>
          <div>Protected Content</div>
        </RequireAuth>
      );

      // When redirected, React Router navigates but we check the component isn't rendered
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('should not render children', () => {
      renderWithRouter(
        <RequireAuth>
          <div data-testid="protected">Protected</div>
        </RequireAuth>
      );

      expect(screen.queryByTestId('protected')).not.toBeInTheDocument();
    });
  });

  describe('when authenticated', () => {
    beforeEach(() => {
      const { login } = useAuthStore.getState();
      login('admin');
    });

    it('should render children', () => {
      renderWithRouter(
        <RequireAuth>
          <div>Protected Content</div>
        </RequireAuth>
      );

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('should render multiple children elements', () => {
      renderWithRouter(
        <RequireAuth>
          <div>Protected Section 1</div>
          <div>Protected Section 2</div>
        </RequireAuth>
      );

      expect(screen.getByText('Protected Section 1')).toBeInTheDocument();
      expect(screen.getByText('Protected Section 2')).toBeInTheDocument();
    });

    it('should render complex component trees', () => {
      renderWithRouter(
        <RequireAuth>
          <div>
            <h1>Admin Panel</h1>
            <nav>
              <ul>
                <li>Item 1</li>
                <li>Item 2</li>
              </ul>
            </nav>
          </div>
        </RequireAuth>
      );

      expect(screen.getByText('Admin Panel')).toBeInTheDocument();
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
    });
  });

  describe('state changes', () => {
    it('should respond to auth state changes', () => {
      const { rerender } = renderWithRouter(
        <RequireAuth>
          <div>Protected</div>
        </RequireAuth>
      );

      expect(screen.queryByText('Protected')).not.toBeInTheDocument();

      const { login } = useAuthStore.getState();
      login('admin');

      // Re-render to pick up state change
      rerender(
        <BrowserRouter>
          <RequireAuth>
            <div>Protected</div>
          </RequireAuth>
        </BrowserRouter>
      );

      expect(screen.getByText('Protected')).toBeInTheDocument();
    });

    it('should hide content on logout', () => {
      const { login } = useAuthStore.getState();
      login('admin');

      const { rerender } = renderWithRouter(
        <RequireAuth>
          <div>Protected</div>
        </RequireAuth>
      );

      expect(screen.getByText('Protected')).toBeInTheDocument();

      const { logout } = useAuthStore.getState();
      logout();

      rerender(
        <BrowserRouter>
          <RequireAuth>
            <div>Protected</div>
          </RequireAuth>
        </BrowserRouter>
      );

      expect(screen.queryByText('Protected')).not.toBeInTheDocument();
    });
  });
});
