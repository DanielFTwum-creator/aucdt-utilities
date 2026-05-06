import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import HoldingsTable from './HoldingsTable';
import type { PortfolioPosition } from '../../types';

let _isAddedToday = false;

vi.mock('../../utils/marketTime', () => ({
  isAddedToday: () => _isAddedToday,
}));

function makePosition(overrides: Partial<PortfolioPosition> = {}): PortfolioPosition {
  return {
    ticker: 'TEST',
    shares: 10,
    avgCost: 100,
    currentPrice: 105,
    value: 1050,
    unrealizedPL: 50,
    unrealizedPLPercent: 5,
    allocation: 100,
    previousClose: 100,
    dayGain: 50,
    dayGainPercent: 5,
    createdAt: '2024-01-01 09:00:00',
    ...overrides,
  };
}

function renderTable(positions: PortfolioPosition[]) {
  render(
    <HoldingsTable
      positions={positions}
      rawPositions={positions.map((p, i) => ({ id: i + 1, ticker: p.ticker }))}
      onDelete={vi.fn()}
    />,
  );
}

// ─── Day Gain cell: null / undefined / NaN → shows dash ─────────────────────

describe('HoldingsTable – DayGainCell NaN/null guard', () => {
  it('shows dash when dayGain is null', () => {
    renderTable([makePosition({ dayGain: null, dayGainPercent: null })]);
    const dashes = screen.getAllByText('—');
    expect(dashes.length).toBeGreaterThanOrEqual(1);
  });

  it('shows dash when dayGain is undefined', () => {
    renderTable([makePosition({ dayGain: undefined as unknown as null })]);
    const dashes = screen.getAllByText('—');
    expect(dashes.length).toBeGreaterThanOrEqual(1);
  });

  it('shows dash when dayGain is NaN', () => {
    renderTable([makePosition({ dayGain: NaN })]);
    const dashes = screen.getAllByText('—');
    expect(dashes.length).toBeGreaterThanOrEqual(1);
  });

  it('does NOT render $NaN in the table for any guard case', () => {
    const { container } = render(
      <HoldingsTable
        positions={[
          makePosition({ dayGain: null }),
          makePosition({ ticker: 'T2', dayGain: NaN }),
          makePosition({ ticker: 'T3', dayGain: undefined as unknown as null }),
        ]}
        rawPositions={[
          { id: 1, ticker: 'TEST' },
          { id: 2, ticker: 'T2' },
          { id: 3, ticker: 'T3' },
        ]}
        onDelete={vi.fn()}
      />,
    );
    expect(container.textContent).not.toContain('NaN');
  });

  it('renders actual gain value when dayGain is a valid number', () => {
    renderTable([makePosition({ dayGain: 12.5, dayGainPercent: 2.5 })]);
    expect(screen.getByText(/\+\$12\.50/)).toBeInTheDocument();
  });

  it('renders negative gain correctly', () => {
    renderTable([makePosition({ dayGain: -8, dayGainPercent: -1.5 })]);
    expect(screen.getByText(/\$8\.00/)).toBeInTheDocument();
  });
});

// ─── "Added today" badge ─────────────────────────────────────────────────────

describe('HoldingsTable – Added today badge', () => {
  it('shows "Added today" badge and suppresses day gain columns', () => {
    _isAddedToday = true;
    const pos = makePosition({ dayGain: 99 });
    render(
      <HoldingsTable
        positions={[pos]}
        rawPositions={[{ id: 1, ticker: pos.ticker }]}
        onDelete={vi.fn()}
      />,
    );
    expect(screen.getByText('Added today')).toBeInTheDocument();
    expect(screen.queryByText(/\$99/)).not.toBeInTheDocument();
    _isAddedToday = false;
  });
});
