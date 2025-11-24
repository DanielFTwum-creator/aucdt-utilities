import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

describe('App Component', () => {
  describe('Header', () => {
    it('renders the ThesisAI logo text', () => {
      render(<App />);
      expect(screen.getByText('ThesisAI')).toBeInTheDocument();
    });

    it('renders navigation links', () => {
      render(<App />);
      const featuresLink = screen.getByRole('link', { name: /features/i });
      const aboutLink = screen.getByRole('link', { name: /about/i });

      expect(featuresLink).toBeInTheDocument();
      expect(aboutLink).toBeInTheDocument();
      expect(featuresLink).toHaveAttribute('href', '#features');
      expect(aboutLink).toHaveAttribute('href', '#about');
    });

    it('renders Get Started button in header', () => {
      render(<App />);
      const buttons = screen.getAllByText('Get Started');
      expect(buttons.length).toBeGreaterThan(0);
      expect(buttons[0]).toHaveClass('bg-academic-amber');
    });
  });

  describe('Hero Section', () => {
    it('renders main heading', () => {
      render(<App />);
      const heading = screen.getByText('AI-Powered Thesis Assessment');
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe('H2');
    });

    it('renders hero description', () => {
      render(<App />);
      const description = screen.getByText(/streamline your academic evaluation process/i);
      expect(description).toBeInTheDocument();
    });

    it('renders Start Assessment button', () => {
      render(<App />);
      const button = screen.getByRole('button', { name: /start assessment/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('bg-academic-gold');
    });

    it('Start Assessment button is clickable', async () => {
      const user = userEvent.setup();
      render(<App />);
      const button = screen.getByRole('button', { name: /start assessment/i });

      await user.click(button);
      // Button should remain in the document after click (no navigation yet)
      expect(button).toBeInTheDocument();
    });
  });

  describe('Features Section', () => {
    it('renders all three feature cards', () => {
      render(<App />);

      expect(screen.getByText('Document Analysis')).toBeInTheDocument();
      expect(screen.getByText('AI Evaluation')).toBeInTheDocument();
      expect(screen.getByText('Detailed Feedback')).toBeInTheDocument();
    });

    it('renders feature descriptions', () => {
      render(<App />);

      expect(screen.getByText(/upload thesis documents/i)).toBeInTheDocument();
      expect(screen.getByText(/leverage advanced ai/i)).toBeInTheDocument();
      expect(screen.getByText(/get actionable feedback/i)).toBeInTheDocument();
    });

    it('features section has correct id for anchor navigation', () => {
      const { container } = render(<App />);
      const featuresSection = container.querySelector('#features');
      expect(featuresSection).toBeInTheDocument();
    });
  });

  describe('Footer', () => {
    it('renders copyright text', () => {
      render(<App />);
      expect(screen.getByText(/© 2025 ThesisAI/i)).toBeInTheDocument();
      expect(screen.getByText(/African University College of Digital Technologies/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper semantic HTML structure', () => {
      const { container } = render(<App />);

      expect(container.querySelector('header')).toBeInTheDocument();
      expect(container.querySelector('main')).toBeInTheDocument();
      expect(container.querySelector('footer')).toBeInTheDocument();
      expect(container.querySelector('nav')).toBeInTheDocument();
    });

    it('buttons have accessible text', () => {
      render(<App />);

      const startButton = screen.getByRole('button', { name: /start assessment/i });
      const getStartedButton = screen.getByRole('button', { name: /get started/i });

      expect(startButton).toBeInTheDocument();
      expect(getStartedButton).toBeInTheDocument();
    });

    it('navigation links have accessible text', () => {
      render(<App />);

      expect(screen.getByRole('link', { name: /features/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
    });
  });

  describe('Styling and Layout', () => {
    it('applies gradient background', () => {
      const { container } = render(<App />);
      const mainDiv = container.firstChild as HTMLElement;

      expect(mainDiv).toHaveClass('min-h-screen', 'bg-gradient-to-br', 'from-academic-navy', 'to-academic-blue');
    });

    it('applies responsive grid classes to features', () => {
      const { container } = render(<App />);
      const featuresGrid = container.querySelector('#features');

      expect(featuresGrid).toHaveClass('grid', 'md:grid-cols-3', 'gap-8');
    });
  });

  describe('Integration', () => {
    it('renders complete page structure', () => {
      const { container } = render(<App />);

      // Check all major sections exist
      expect(container.querySelector('header')).toBeInTheDocument();
      expect(container.querySelector('main')).toBeInTheDocument();
      expect(container.querySelector('footer')).toBeInTheDocument();

      // Check content is rendered
      expect(screen.getByText('ThesisAI')).toBeInTheDocument();
      expect(screen.getByText('AI-Powered Thesis Assessment')).toBeInTheDocument();
      expect(screen.getByText('Document Analysis')).toBeInTheDocument();
    });
  });
});
