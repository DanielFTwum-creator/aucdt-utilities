export interface OhlcvBar {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export type ChartPoint = Record<string, number | string>;

/** Cumulative VWAP from the first bar in the series. */
export function computeVwap(bars: OhlcvBar[]): number[] {
  let cumTP = 0, cumVol = 0;
  return bars.map(b => {
    const tp = (b.high + b.low + b.close) / 3;
    cumTP += tp * (b.volume || 1);
    cumVol += b.volume || 1;
    return cumTP / cumVol;
  });
}

/**
 * Merge two OHLCV series into combined chart points with VWAP ±envelope bands.
 * Points with no matching timestamp in the second series are dropped.
 */
export function mergeData(
  t1: string,
  bars1: OhlcvBar[],
  t2: string,
  bars2: OhlcvBar[],
  envelopePct = 0.02,
): ChartPoint[] {
  const vwap1 = computeVwap(bars1);
  const vwap2 = computeVwap(bars2);

  const map2 = new Map<string, { bar: OhlcvBar; vwap: number }>();
  bars2.forEach((b, i) => map2.set(b.date, { bar: b, vwap: vwap2[i] }));

  return bars1
    .map((b1, i) => {
      const v1 = vwap1[i];
      const entry2 = map2.get(b1.date);
      if (!entry2) return null;
      const { bar: b2, vwap: v2 } = entry2;
      return {
        date: b1.date,
        [t1]: b1.close,
        [t2]: b2.close,
        volume: (b1.volume + b2.volume) / 2,
        [`envUpper${t1}`]: v1 * (1 + envelopePct),
        [`envLower${t1}`]: v1 * (1 - envelopePct),
        [`envUpper${t2}`]: v2 * (1 + envelopePct),
        [`envLower${t2}`]: v2 * (1 - envelopePct),
      } as ChartPoint;
    })
    .filter((d): d is ChartPoint => d !== null);
}
