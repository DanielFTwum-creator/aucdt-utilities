import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import LoadingSpinner from '../components/LoadingSpinner'

describe('LoadingSpinner Component', () => {
  it('renders with default props', () => {
    const { container } = render(<LoadingSpinner />)
    expect(container.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('renders with custom message', () => {
    render(<LoadingSpinner message="Loading data..." />)
    expect(screen.getByText('Loading data...')).toBeInTheDocument()
  })

  it('renders in fullscreen mode by default', () => {
    const { container } = render(<LoadingSpinner />)
    expect(container.querySelector('.min-h-screen')).toBeInTheDocument()
  })

  it('renders without fullscreen when specified', () => {
    const { container } = render(<LoadingSpinner fullScreen={false} />)
    expect(container.querySelector('.min-h-screen')).not.toBeInTheDocument()
  })

  it('applies correct size classes', () => {
    const { container: containerSm } = render(<LoadingSpinner size="sm" />)
    expect(containerSm.querySelector('.w-6')).toBeInTheDocument()

    const { container: containerMd } = render(<LoadingSpinner size="md" />)
    expect(containerMd.querySelector('.w-10')).toBeInTheDocument()

    const { container: containerLg } = render(<LoadingSpinner size="lg" />)
    expect(containerLg.querySelector('.w-16')).toBeInTheDocument()
  })
})
