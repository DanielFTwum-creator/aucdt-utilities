import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';
import { Login } from './Login';
import { useAuthStore } from '../authStore';

vi.mock('axios');
const mockedAxios = vi.mocked(axios);

describe('Login', () => {
  beforeEach(() => {
    useAuthStore.getState().logout();
    vi.clearAllMocks();
    mockedAxios.post.mockResolvedValue({ data: { success: true } });
  });

  const renderLogin = () => {
    return render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
  };

  describe('rendering', () => {
    it('should render fraud detection engine heading', () => {
      renderLogin();
      expect(screen.getByRole('heading', { name: /fraud detection engine/i })).toBeInTheDocument();
    });

    it('should render username and password inputs', () => {
      renderLogin();
      const inputs = screen.getAllByRole('textbox');
      expect(inputs.length).toBeGreaterThanOrEqual(1);
    });

    it('should render password input', () => {
      renderLogin();
      const inputs = screen.getAllByRole('textbox');
      const passwordInput = Array.from(document.querySelectorAll('input[type="password"]'));
      expect(passwordInput.length).toBeGreaterThanOrEqual(1);
    });

    it('should render sign in button', () => {
      renderLogin();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('should display company info text', () => {
      renderLogin();
      expect(screen.getByText(/financial technology/i)).toBeInTheDocument();
    });
  });

  describe('form interaction', () => {
    it('should accept typed input in username field', async () => {
      const user = userEvent.setup();
      renderLogin();

      const usernameInputs = screen.getAllByRole('textbox');
      const usernameInput = usernameInputs[0] as HTMLInputElement;
      await user.type(usernameInput, 'testuser');

      expect(usernameInput.value).toBe('testuser');
    });

    it('should accept typed input in password field', async () => {
      const user = userEvent.setup();
      renderLogin();

      const passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement;
      await user.type(passwordInput, 'testpass');

      expect(passwordInput.value).toBe('testpass');
    });

    it('should clear username field', async () => {
      const user = userEvent.setup();
      renderLogin();

      const usernameInputs = screen.getAllByRole('textbox');
      const usernameInput = usernameInputs[0] as HTMLInputElement;
      await user.type(usernameInput, 'admin');
      await user.clear(usernameInput);

      expect(usernameInput.value).toBe('');
    });
  });

  describe('authentication', () => {
    it('should authenticate with admin/admin credentials', async () => {
      const user = userEvent.setup();
      renderLogin();

      const usernameInputs = screen.getAllByRole('textbox');
      const usernameInput = usernameInputs[0] as HTMLInputElement;
      const passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement;
      const button = screen.getByRole('button', { name: /sign in/i });

      await user.type(usernameInput, 'admin');
      await user.type(passwordInput, 'admin');
      await user.click(button);

      await waitFor(() => {
        const { isAuthenticated } = useAuthStore.getState();
        expect(isAuthenticated).toBe(true);
      });
    });

    it('should reject wrong password', async () => {
      const user = userEvent.setup();
      renderLogin();

      const usernameInputs = screen.getAllByRole('textbox');
      const usernameInput = usernameInputs[0] as HTMLInputElement;
      const passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement;
      const button = screen.getByRole('button', { name: /sign in/i });

      await user.type(usernameInput, 'admin');
      await user.type(passwordInput, 'wrong');
      await user.click(button);

      const { isAuthenticated } = useAuthStore.getState();
      expect(isAuthenticated).toBe(false);
    });

    it('should reject empty submission', async () => {
      const user = userEvent.setup();
      renderLogin();

      const button = screen.getByRole('button', { name: /sign in/i });
      await user.click(button);

      const { isAuthenticated } = useAuthStore.getState();
      expect(isAuthenticated).toBe(false);
    });
  });

  describe('accessibility', () => {
    it('should have focusable form fields', async () => {
      const user = userEvent.setup();
      renderLogin();

      const usernameInputs = screen.getAllByRole('textbox');
      const usernameInput = usernameInputs[0];

      await user.tab();
      expect(document.activeElement).toBe(usernameInput);
    });

    it('should submit form with enter key', async () => {
      const user = userEvent.setup();
      renderLogin();

      const usernameInputs = screen.getAllByRole('textbox');
      const usernameInput = usernameInputs[0] as HTMLInputElement;
      const passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement;

      await user.type(usernameInput, 'admin');
      await user.type(passwordInput, 'admin');
      await user.keyboard('{Enter}');

      await waitFor(() => {
        const { isAuthenticated } = useAuthStore.getState();
        expect(isAuthenticated).toBe(true);
      });
    });

    it('should have descriptive button text', () => {
      renderLogin();
      const button = screen.getByRole('button');
      expect(button.textContent).toMatch(/sign in/i);
    });
  });

  describe('form state', () => {
    it('should maintain username during typing', async () => {
      const user = userEvent.setup();
      renderLogin();

      const usernameInputs = screen.getAllByRole('textbox');
      const usernameInput = usernameInputs[0] as HTMLInputElement;
      await user.type(usernameInput, 'admin123');

      expect(usernameInput.value).toBe('admin123');
    });

    it('should handle backspace in input', async () => {
      const user = userEvent.setup();
      renderLogin();

      const usernameInputs = screen.getAllByRole('textbox');
      const usernameInput = usernameInputs[0] as HTMLInputElement;
      await user.type(usernameInput, 'admin');
      await user.type(usernameInput, '{backspace}');

      expect(usernameInput.value).toBe('admi');
    });
  });

  describe('edge cases', () => {
    it('should be case-sensitive for username', async () => {
      const user = userEvent.setup();
      renderLogin();

      const usernameInputs = screen.getAllByRole('textbox');
      const usernameInput = usernameInputs[0] as HTMLInputElement;
      const passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement;
      const button = screen.getByRole('button', { name: /sign in/i });

      await user.type(usernameInput, 'Admin');
      await user.type(passwordInput, 'admin');
      await user.click(button);

      const { isAuthenticated } = useAuthStore.getState();
      expect(isAuthenticated).toBe(false);
    });

    it('should be case-sensitive for password', async () => {
      const user = userEvent.setup();
      renderLogin();

      const usernameInputs = screen.getAllByRole('textbox');
      const usernameInput = usernameInputs[0] as HTMLInputElement;
      const passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement;
      const button = screen.getByRole('button', { name: /sign in/i });

      await user.type(usernameInput, 'admin');
      await user.type(passwordInput, 'Admin');
      await user.click(button);

      const { isAuthenticated } = useAuthStore.getState();
      expect(isAuthenticated).toBe(false);
    });

    it('should reject password with trailing whitespace', async () => {
      const user = userEvent.setup();
      renderLogin();

      const usernameInputs = screen.getAllByRole('textbox');
      const usernameInput = usernameInputs[0] as HTMLInputElement;
      const passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement;
      const button = screen.getByRole('button', { name: /sign in/i });

      await user.type(usernameInput, 'admin');
      await user.type(passwordInput, 'admin ');
      await user.click(button);

      const { isAuthenticated } = useAuthStore.getState();
      expect(isAuthenticated).toBe(false);
    });
  });
});
