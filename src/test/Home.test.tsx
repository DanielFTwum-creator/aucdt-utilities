import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Home from '../pages/Home'

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('Home Page', () => {
  describe('Header', () => {
    it('renders the ThesisAI logo text', () => {
      renderWithRouter(<Home />)
      expect(screen.getByText('ThesisAI')).toBeInTheDocument()
    })

    it('renders navigation links', () => {
      renderWithRouter(<Home />)
      const featuresLink = screen.getByRole('link', { name: /features/i })
      const aboutLink = screen.getByRole('link', { name: /about/i })

      expect(featuresLink).toBeInTheDocument()
      expect(aboutLink).toBeInTheDocument()
      expect(featuresLink).toHaveAttribute('href', '#features')
      expect(aboutLink).toHaveAttribute('href', '#about')
    })

    it('renders Get Started button in header', () => {
      renderWithRouter(<Home />)
      const getStartedLink = screen.getByRole('link', { name: /get started/i })
      expect(getStartedLink).toBeInTheDocument()
      expect(getStartedLink).toHaveAttribute('href', '/login')
    })
  })

  describe('Hero Section', () => {
    it('renders main heading', () => {
      renderWithRouter(<Home />)
      const heading = screen.getByText('AI-Powered Thesis Assessment')
      expect(heading).toBeInTheDocument()
      expect(heading.tagName).toBe('H2')
    })

    it('renders hero description', () => {
      renderWithRouter(<Home />)
      const description = screen.getByText(/streamline your academic evaluation process/i)
      expect(description).toBeInTheDocument()
    })

    it('renders Start Assessment button with link to register', () => {
      renderWithRouter(<Home />)
      const link = screen.getByRole('link', { name: /start assessment/i })
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', '/register')
    })
  })

  describe('Features Section', () => {
    it('renders all three feature cards', () => {
      renderWithRouter(<Home />)

      expect(screen.getByText('Document Analysis')).toBeInTheDocument()
      expect(screen.getByText('AI Evaluation')).toBeInTheDocument()
      expect(screen.getByText('Detailed Feedback')).toBeInTheDocument()
    })

    it('renders feature descriptions', () => {
      renderWithRouter(<Home />)

      expect(screen.getByText(/upload thesis documents/i)).toBeInTheDocument()
      expect(screen.getByText(/leverage advanced ai/i)).toBeInTheDocument()
      expect(screen.getByText(/get actionable feedback/i)).toBeInTheDocument()
    })

    it('features section has correct id for anchor navigation', () => {
      const { container } = renderWithRouter(<Home />)
      const featuresSection = container.querySelector('#features')
      expect(featuresSection).toBeInTheDocument()
    })
  })

  describe('Footer', () => {
    it('renders copyright text', () => {
      renderWithRouter(<Home />)
      expect(screen.getByText(/© 2025 ThesisAI/i)).toBeInTheDocument()
      expect(screen.getByText(/African University College of Digital Technologies/i)).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has proper semantic HTML structure', () => {
      const { container } = renderWithRouter(<Home />)

      expect(container.querySelector('header')).toBeInTheDocument()
      expect(container.querySelector('main')).toBeInTheDocument()
      expect(container.querySelector('footer')).toBeInTheDocument()
      expect(container.querySelector('nav')).toBeInTheDocument()
    })
  })

  describe('Styling and Layout', () => {
    it('applies gradient background', () => {
      const { container } = renderWithRouter(<Home />)
      const mainDiv = container.firstChild as HTMLElement

      expect(mainDiv).toHaveClass('min-h-screen', 'bg-gradient-to-br', 'from-academic-navy', 'to-academic-blue')
    })

    it('applies responsive grid classes to features', () => {
      const { container } = renderWithRouter(<Home />)
      const featuresGrid = container.querySelector('#features')

      expect(featuresGrid).toHaveClass('grid', 'md:grid-cols-3', 'gap-8')
    })
  })
})
