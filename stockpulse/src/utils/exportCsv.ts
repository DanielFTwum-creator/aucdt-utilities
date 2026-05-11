import type { PortfolioPosition } from '../types';

function cell(v: string | number | null | undefined): string {
  if (v === null || v === undefined) return '';
  const s = String(v);
  return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s;
}

export function exportPortfolioCsv(positions: PortfolioPosition[]): void {
  const headers = [
    'Ticker', 'Shares', 'Avg Cost', 'Purchase Date',
    'Current Price', 'Value', 'Unrealized P&L', 'Return %',
    'Day Gain', 'Day Gain %', 'Allocation %',
  ];

  const rows = positions.map(p => [
    cell(p.ticker),
    cell(p.shares.toFixed(4)),
    cell(p.avgCost.toFixed(2)),
    cell(p.purchase_date ?? ''),
    cell(p.currentPrice.toFixed(2)),
    cell(p.value.toFixed(2)),
    cell(p.unrealizedPL.toFixed(2)),
    cell(p.unrealizedPLPercent.toFixed(2)),
    cell(p.dayGain !== null ? p.dayGain.toFixed(2) : ''),
    cell(p.dayGainPercent !== null ? p.dayGainPercent.toFixed(2) : ''),
    cell((p.allocation ?? 0).toFixed(1)),
  ].join(','));

  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `portfolio-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
