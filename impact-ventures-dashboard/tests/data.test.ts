import { describe, it, expect } from 'vitest';
import { APP_DATA, STRATEGIC_OBSERVATIONS, type AppRanking } from '../src/data';

const VALID_CATEGORIES: AppRanking['category'][] = [
  'FinTech', 'HealthTech', 'EdTech', 'AgriTech', 'LegalTech',
  'Compliance', 'Logistics', 'Infrastructure', 'Media',
];

describe('APP_DATA integrity', () => {
  it('has at least 30 entries (registry advertises "30 LIVE ASSETS")', () => {
    expect(APP_DATA.length).toBeGreaterThanOrEqual(30);
  });

  it('has unique ranks', () => {
    const ranks = APP_DATA.map(a => a.rank);
    expect(new Set(ranks).size).toBe(ranks.length);
  });

  it('has ranks numbered 1..N with no gaps', () => {
    const sorted = [...APP_DATA].map(a => a.rank).sort((a, b) => a - b);
    sorted.forEach((rank, i) => expect(rank).toBe(i + 1));
  });

  it('every entry has all required fields populated', () => {
    APP_DATA.forEach(a => {
      expect(a.name, `rank ${a.rank} name`).toBeTruthy();
      expect(a.description, `rank ${a.rank} description`).toBeTruthy();
      expect(a.why, `rank ${a.rank} why`).toBeTruthy();
    });
  });

  it('M (monetisation) is integer in [1,5] for every entry', () => {
    APP_DATA.forEach(a => {
      expect(Number.isInteger(a.m), `rank ${a.rank} m=${a.m}`).toBe(true);
      expect(a.m).toBeGreaterThanOrEqual(1);
      expect(a.m).toBeLessThanOrEqual(5);
    });
  });

  it('G (social good) is integer in [1,5] for every entry', () => {
    APP_DATA.forEach(a => {
      expect(Number.isInteger(a.g), `rank ${a.rank} g=${a.g}`).toBe(true);
      expect(a.g).toBeGreaterThanOrEqual(1);
      expect(a.g).toBeLessThanOrEqual(5);
    });
  });

  it('tier is integer in [1,4]', () => {
    APP_DATA.forEach(a => {
      expect([1, 2, 3, 4]).toContain(a.tier);
    });
  });

  it('every category is one of the 9 declared values', () => {
    APP_DATA.forEach(a => {
      expect(VALID_CATEGORIES).toContain(a.category);
    });
  });
});

describe('STRATEGIC_OBSERVATIONS', () => {
  it('has at least one observation', () => {
    expect(STRATEGIC_OBSERVATIONS.length).toBeGreaterThan(0);
  });

  it('every observation has title, observation text, and items[]', () => {
    STRATEGIC_OBSERVATIONS.forEach(o => {
      expect(o.title).toBeTruthy();
      expect(o.observation).toBeTruthy();
      expect(Array.isArray(o.items)).toBe(true);
      expect(o.items.length).toBeGreaterThan(0);
    });
  });
});
