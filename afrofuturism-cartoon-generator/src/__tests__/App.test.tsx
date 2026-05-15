import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

// Mock Gemini service to avoid real API calls in tests
vi.mock('../../services/geminiService', () => ({
  analyseCartoon: vi.fn(),
  quickAnalyse: vi.fn(),
  generateBrief: vi.fn(),
  compareCartoons: vi.fn(),
}));

import App from '../../App';

describe('App', () => {
  it('renders the header title', () => {
    render(<App />);
    expect(screen.getByText('Afrofuturism')).toBeInTheDocument();
  });

  it('renders the main navigation tabs', () => {
    render(<App />);
    expect(screen.getByRole('tab', { name: /analyse/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /generate/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /quick/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /compare/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /library/i })).toBeInTheDocument();
  });

  it('shows the Full Analysis tab by default', () => {
    render(<App />);
    expect(screen.getByText('Full Cartoon Analysis')).toBeInTheDocument();
  });
});
