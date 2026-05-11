import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OverviewTab } from './OverviewTab';
import { vi } from 'vitest';

// Mock child components that might render charts or complex UI
vi.mock('../charts/TimeSeriesChart', () => ({
  TimeSeriesChart: () => <div>TimeSeriesChart Mock</div>,
}));
vi.mock('../charts/ConversionRateChart', () => ({
  ConversionRateChart: () => <div>ConversionRateChart Mock</div>,
}));
vi.mock('../charts/DonutChart', () => ({
  DonutChart: () => <div>DonutChart Mock</div>,
}));
vi.mock('../TrendlineControls', () => ({
  TrendlineControls: ({ onToggleTrendlines }) => (
    <button onClick={() => onToggleTrendlines(true)}>Toggle Trendlines</button>
  ),
}));

const mockData = {
  timeSeriesData: [
    { month: '2023-01', signups: 100, applicants: 50, accepted: 25, registered: 10 },
  ],
  totalMetrics: {
    totalSignups: 100,
    totalApplicants: 50,
    totalAccepted: 25,
    totalRegistered: 10,
    acceptedNotRegistered: 15,
    signupsNeverApplied: 50,
    overallConversionRate: 10,
  },
  conversionRates: {
    signupToApplication: 50,
    applicationToAcceptance: 50,
    acceptanceToRegistration: 40,
  },
  funnelBreakdown: {
    registered: 10,
    acceptedNotRegistered: 15,
    rejected: 10,
    waitlisted: 5,
  },
  important_correction: {
    correction_date: '2025-06-08',
    correction_reason: 'Previous analysis incorrectly mixed student and sponsor/guardian data',
    corrected_analysis: 'Students: 96.9% domestic, 3.1% international. Sponsors/guardians provide international support network.',
    key_finding: 'TUC is primarily a domestic Ghanaian institution with a global family support network',
  },
  corrected_multi_party_demographics: {
    student_demographics: {
      total_students: 1000,
      true_international_students: {
        domestic_students_percentage: 96.9,
        international_students_percentage: 3.1,
      },
    },
    sponsor_guardian_demographics: {
      domestic_vs_international_support: {
        international_percentage: 37.5,
      },
    },
  },
};

const mockSetShowTrendlines = vi.fn();
const mockSetTrendlineOptions = vi.fn();
const mockSetActiveTrendlines = vi.fn();

describe('OverviewTab', () => {
  const defaultProps = {
    data: mockData,
    timeRange: 'all',
    showTrendlines: false,
    setShowTrendlines: mockSetShowTrendlines,
    trendlineOptions: { type: 'linear' },
    setTrendlineOptions: mockSetTrendlineOptions,
    activeTrendlines: { signups: true, applicants: true, accepted: true, registered: true },
    setActiveTrendlines: mockSetActiveTrendlines,
  };

  it('renders "No data available" when data is null', () => {
    render(<OverviewTab {...defaultProps} data={null} />);
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('renders KPI cards with correct data', async () => {
    render(<OverviewTab {...defaultProps} />);

    // KPI Cards
    expect(await screen.findByText('100', { selector: '.text-2xl.font-bold' })).toBeInTheDocument(); // Total Signups
    expect(await screen.findByText(/50% conversion from signups/i)).toBeInTheDocument(); // Signup -> Application conversion
    expect(await screen.findByText('25', { selector: '.text-2xl.font-bold' })).toBeInTheDocument(); // Total Accepted
    expect(await screen.findByText(/10% overall conversion/i)).toBeInTheDocument(); // Overall conversion
  });

  it('renders critical correction notice when present', async () => {
    render(<OverviewTab {...defaultProps} />);
    expect(await screen.findByText(/Important Correction/i)).toBeInTheDocument();
    expect(await screen.findByText(/Previous analysis incorrectly mixed student and sponsor\/guardian data/i)).toBeInTheDocument();
  });

  it('renders corrected student demographics KPIs when present', async () => {
    render(<OverviewTab {...defaultProps} />);
    expect(await screen.findByText(/Corrected Student Demographics/i)).toBeInTheDocument();
    const domesticStudentsCard = (await screen.findByText('Domestic Students')).closest('div[class*="card"]');
    expect(await within(domesticStudentsCard as HTMLElement).findByText(/96.9%/i)).toBeInTheDocument();
    const internationalStudentsCard = (await screen.findByText('International Students')).closest('div[class*="card"]');
    expect(await within(internationalStudentsCard as HTMLElement).findByText(/3.1%/i)).toBeInTheDocument();
    const totalStudentsCard = (await screen.findByText('Total Students')).closest('div[class*="card"]');
    expect(await within(totalStudentsCard as HTMLElement).findByText('1,000')).toBeInTheDocument();
    const supportNetworkCard = (await screen.findByText('Support Network')).closest('div[class*="card"]');
    expect(await within(supportNetworkCard as HTMLElement).findByText(/37.5%/i)).toBeInTheDocument();
  });

  it('renders child chart components', async () => {
    render(<OverviewTab {...defaultProps} />);
    expect(await screen.findByText('TimeSeriesChart Mock')).toBeInTheDocument();
    expect(await screen.findByText('ConversionRateChart Mock')).toBeInTheDocument();
    expect(await screen.findByText('DonutChart Mock')).toBeInTheDocument();
  });

  it('calls setShowTrendlines when Toggle Trendlines button is clicked', async () => {
    const user = userEvent.setup();
    render(<OverviewTab {...defaultProps} showTrendlines={false} />);
    const toggleButton = screen.getByText('Toggle Trendlines');
    await user.click(toggleButton);
    expect(mockSetShowTrendlines).toHaveBeenCalledWith(true);
  });
});
