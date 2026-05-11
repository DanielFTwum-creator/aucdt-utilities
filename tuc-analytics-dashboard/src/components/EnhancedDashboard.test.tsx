import { render, screen, waitFor } from '@testing-library/react';
import { EnhancedDashboard } from './EnhancedDashboard';

describe('EnhancedDashboard', () => {
  it('renders loading state initially', () => {
    render(<EnhancedDashboard />);
    expect(screen.getByText(/Loading comprehensive analytics.../i)).toBeInTheDocument();
  });

  it('renders dashboard content after data loads', async () => {
    render(<EnhancedDashboard />);

    // Wait for the loading state to disappear and main content to appear
    await waitFor(() => {
      expect(screen.queryByText(/Loading comprehensive analytics.../i)).not.toBeInTheDocument();
    });

    // Assert for elements that should be present after data loading
    expect(await screen.findByText(/TUC Registration Funnel Analytics/i)).toBeInTheDocument();
    expect(await screen.findByText(/Comprehensive Student Enrollment Analytics Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/(\d+) Total Signups/i)).toBeInTheDocument();
    expect(await screen.findByText(/(\d+)% Conversion Rate/i)).toBeInTheDocument();
  });
});
