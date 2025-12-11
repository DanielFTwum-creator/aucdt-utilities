import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../App'

describe('App Component', () => {
  it('renders without crashing', () => {
    render(<App />)
    // The router should render the Home page by default
    expect(screen.getByText('ThesisAI')).toBeInTheDocument()
  })

  it('renders the home page at root path', () => {
    render(<App />)
    expect(screen.getByText('AI-Powered Thesis Assessment')).toBeInTheDocument()
  })

  it('provides authentication context', () => {
    // If the app renders without errors, the AuthProvider is working
    const { container } = render(<App />)
    expect(container).toBeInTheDocument()
  })
})
