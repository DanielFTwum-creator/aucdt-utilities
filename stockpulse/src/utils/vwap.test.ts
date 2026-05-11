import { describe, it, expect } from 'vitest';
import { computeVwap, mergeData, type OhlcvBar } from './vwap';

function bar(date: string, close: number, volume = 1000, high?: number, low?: number): OhlcvBar {
  return { date, open: close, high: high ?? close, low: low ?? close, close, volume };
}

// ─── computeVwap ────────────────────────────────────────────────────────────

describe('computeVwap', () => {
  it('returns a value for each bar', () => {
    const bars = [bar('t1', 100), bar('t2', 110), bar('t3', 105)];
    expect(computeVwap(bars)).toHaveLength(3);
  });

  it('equals close price when high=low=close (flat bar)', () => {
    const bars = [bar('t1', 50), bar('t2', 50)];
    const vwap = computeVwap(bars);
    vwap.forEach(v => expect(v).toBeCloseTo(50, 5));
  });

  it('is cumulative — later bars shift vwap toward recent price', () => {
    const bars = [
      bar('t1', 100, 1000),
      bar('t2', 120, 1000),
    ];
    const [v1, v2] = computeVwap(bars);
    expect(v1).toBeCloseTo(100, 5);
    // cumulative after 2 bars: (100*1000 + 120*1000) / 2000 = 110
    expect(v2).toBeCloseTo(110, 5);
  });

  it('weights by volume — high-volume bar dominates', () => {
    const bars = [
      bar('t1', 100, 100),   // low volume
      bar('t2', 200, 10000), // high volume
    ];
    const [, v2] = computeVwap(bars);
    // vwap should be pulled strongly toward 200
    expect(v2).toBeGreaterThan(190);
  });

  it('handles zero volume bars without crashing (uses 1 as floor)', () => {
    const bars = [bar('t1', 50, 0), bar('t2', 60, 0)];
    expect(() => computeVwap(bars)).not.toThrow();
    const vwap = computeVwap(bars);
    expect(vwap).toHaveLength(2);
    expect(vwap.every(v => isFinite(v))).toBe(true);
  });

  it('returns empty array for empty input', () => {
    expect(computeVwap([])).toEqual([]);
  });
});

// ─── mergeData ───────────────────────────────────────────────────────────────

describe('mergeData', () => {
  const t1Bars = [
    bar('2024-01-01T09:30:00Z', 40, 500, 42, 39),
    bar('2024-01-01T09:45:00Z', 41, 600, 43, 40),
    bar('2024-01-01T10:00:00Z', 39, 400, 41, 38),
  ];
  const t2Bars = [
    bar('2024-01-01T09:30:00Z', 20, 300, 21, 19),
    bar('2024-01-01T09:45:00Z', 22, 400, 23, 21),
    bar('2024-01-01T10:00:00Z', 21, 350, 22, 20),
  ];

  it('produces one point per matching timestamp', () => {
    const result = mergeData('SOXL', t1Bars, 'SOXS', t2Bars);
    expect(result).toHaveLength(3);
  });

  it('each point contains both ticker close prices', () => {
    const result = mergeData('SOXL', t1Bars, 'SOXS', t2Bars);
    result.forEach(pt => {
      expect(pt).toHaveProperty('SOXL');
      expect(pt).toHaveProperty('SOXS');
    });
  });

  it('each point contains all four envelope band keys', () => {
    const result = mergeData('SOXL', t1Bars, 'SOXS', t2Bars);
    result.forEach(pt => {
      expect(pt).toHaveProperty('envUpperSOXL');
      expect(pt).toHaveProperty('envLowerSOXL');
      expect(pt).toHaveProperty('envUpperSOXS');
      expect(pt).toHaveProperty('envLowerSOXS');
    });
  });

  it('envelope upper is always greater than envelope lower', () => {
    const result = mergeData('SOXL', t1Bars, 'SOXS', t2Bars);
    result.forEach(pt => {
      expect(pt.envUpperSOXL as number).toBeGreaterThan(pt.envLowerSOXL as number);
      expect(pt.envUpperSOXS as number).toBeGreaterThan(pt.envLowerSOXS as number);
    });
  });

  it('envelope width equals 2× the specified percentage', () => {
    const pct = 0.03;
    const result = mergeData('A', t1Bars, 'B', t2Bars, pct);
    result.forEach(pt => {
      const upper = pt.envUpperA as number;
      const lower = pt.envLowerA as number;
      const width = upper - lower;
      const expectedWidth = upper / (1 + pct) * 2 * pct;
      expect(width).toBeCloseTo(expectedWidth, 4);
    });
  });

  it('drops points where ticker2 has no matching timestamp', () => {
    const sparse2 = [t2Bars[0]]; // only the first bar
    const result = mergeData('SOXL', t1Bars, 'SOXS', sparse2);
    expect(result).toHaveLength(1);
    expect(result[0].date).toBe('2024-01-01T09:30:00Z');
  });

  it('volume is averaged across both series', () => {
    const result = mergeData('SOXL', t1Bars, 'SOXS', t2Bars);
    expect(result[0].volume).toBeCloseTo((500 + 300) / 2, 5);
  });

  it('returns empty array when either series is empty', () => {
    expect(mergeData('A', [], 'B', t2Bars)).toEqual([]);
    expect(mergeData('A', t1Bars, 'B', [])).toEqual([]);
  });

  it('uses dynamic ticker names — not hardcoded SOXL/SOXS', () => {
    const result = mergeData('TSLA', t1Bars, 'NVDA', t2Bars);
    expect(result[0]).toHaveProperty('TSLA');
    expect(result[0]).toHaveProperty('NVDA');
    expect(result[0]).toHaveProperty('envUpperTSLA');
    expect(result[0]).toHaveProperty('envLowerNVDA');
    expect(result[0]).not.toHaveProperty('SOXL');
  });
});
