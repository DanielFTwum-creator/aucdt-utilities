import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';
import { programmes, lecturers, courses, sampleEvaluations } from './constants';

// FIX: Replaced 'global' with 'globalThis' for cross-environment compatibility.
const mockFetch = globalThis.fetch as ReturnType<typeof vi.fn>;

describe('App component', () => {
    beforeEach(() => {
        mockFetch.mockClear();
        // Mock the initial data load which is now from constants.
        // We only need to mock API calls made by user actions.
    });

    it('should render the welcome screen and the assessment form by default', async () => {
        render(<App />);
        // Check for welcome text on the left
        expect(await screen.findByRole('heading', { name: /Shape Your Education/i })).toBeInTheDocument();
        
        // Check for the form on the right
        expect(screen.getByRole('heading', { name: /Feedback Questions/i })).toBeInTheDocument();
    });

    it('should open the login modal when Admin button is clicked', async () => {
        const user = userEvent.setup();
        render(<App />);
        
        const adminButton = await screen.findByRole('button', { name: /Admin/i });
        await user.click(adminButton);

        expect(screen.getByRole('heading', { name: /Admin Login/i })).toBeInTheDocument();
    });

    it('should show an error for incorrect password', async () => {
        const user = userEvent.setup();
        render(<App />);

        mockFetch.mockResolvedValueOnce({ ok: false, status: 401 });

        await user.click(await screen.findByRole('button', { name: /Admin/i }));
        await user.type(screen.getByLabelText(/Password/i), 'wrongpassword');
        await user.click(screen.getByRole('button', { name: /Login/i }));

        expect(await screen.findByText(/Invalid password/i)).toBeInTheDocument();
    });

    it('should switch to the dashboard view on successful login', async () => {
        const user = userEvent.setup();
        render(<App />);

        // Mock login and dashboard data fetch
        mockFetch.mockResolvedValueOnce({ ok: true }); // Login success
        mockFetch.mockResolvedValueOnce({ 
            ok: true, 
            json: async () => ({ evaluations: sampleEvaluations, auditLogs: [] }) 
        });

        await user.click(await screen.findByRole('button', { name: /Admin/i }));
        await user.type(screen.getByLabelText(/Password/i), 'admin123');
        await user.click(screen.getByRole('button', { name: /Login/i }));

        expect(await screen.findByRole('heading', { name: /Lecturer Evaluation Dashboard/i })).toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: /Shape Your Education/i })).not.toBeInTheDocument();
        expect(screen.getByText('Total Evaluations').nextElementSibling).toHaveTextContent(sampleEvaluations.length.toString());
    });

    it('should log out and return to the main evaluation screen', async () => {
        const user = userEvent.setup();
        render(<App />);

        // Log in first
        mockFetch.mockResolvedValueOnce({ ok: true });
        mockFetch.mockResolvedValueOnce({ ok: true, json: async () => ({ evaluations: [], auditLogs: [] }) });
        await user.click(await screen.findByRole('button', { name: /Admin/i }));
        await user.type(screen.getByLabelText(/Password/i), 'admin123');
        await user.click(screen.getByRole('button', { name: /Login/i }));

        // Now log out
        const logoutButton = await screen.findByRole('button', { name: /Logout/i });
        await user.click(logoutButton);

        expect(await screen.findByRole('heading', { name: /Shape Your Education/i })).toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: /Lecturer Evaluation Dashboard/i })).not.toBeInTheDocument();
    });
});