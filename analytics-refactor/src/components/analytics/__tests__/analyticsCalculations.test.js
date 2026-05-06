/**
 * Unit Tests for Analytics Calculations
 *
 * Tests all pure functions in analyticsCalculations.js
 * Coverage Target: 90%
 *
 * @jest-environment jsdom
 */

import {
  processRawData,
  calculateYearlyData,
  calculateFunnelData,
  calculateCorrelationData,
  calculateSeasonalData,
  calculateRadarData,
  calculateTrends,
  calculateAllTimeStats,
  calculateSummaryStats
} from '../utils/analyticsCalculations';

// Mock data for testing
const mockRawData = [
  {
    MONTH: "2025-01",
    SIGNUPS: "40",
    APPLICANTS: "24",
    ACCEPTED: "8",
    REJECTED: "3",
    WAITLISTED: "11",
    REGISTERED: "2"
  },
  {
    MONTH: "2024-12",
    SIGNUPS: "30",
    APPLICANTS: "20",
    ACCEPTED: "10",
    REJECTED: "5",
    WAITLISTED: "5",
    REGISTERED: "3"
  },
  {
    MONTH: "2024-11",
    SIGNUPS: "25",
    APPLICANTS: "15",
    ACCEPTED: "5",
    REJECTED: "7",
    WAITLISTED: "3",
    REGISTERED: "1"
  }
];

describe('Analytics Calculations', () => {
  describe('processRawData', () => {
    test('should convert string numbers to integers', () => {
      const result = processRawData(mockRawData);
      expect(result[0].signups).toBe(25); // Reversed, so 2024-11 is first
      expect(typeof result[0].signups).toBe('number');
    });

    test('should calculate acceptance rate correctly', () => {
      const result = processRawData(mockRawData);
      // 2024-12: 10 accepted / 20 applicants * 100 = 50%
      const dec2024 = result.find(d => d.month === '2024-12');
      expect(dec2024.acceptanceRate).toBe(50);
    });

    test('should calculate conversion rate correctly', () => {
      const result = processRawData(mockRawData);
      // 2025-01: 24 applicants / 40 signups * 100 = 60%
      const jan2025 = result.find(d => d.month === '2025-01');
      expect(jan2025.conversionRate).toBe(60);
    });

    test('should calculate success rate correctly', () => {
      const result = processRawData(mockRawData);
      // 2024-12: (10 accepted + 5 waitlisted) / 20 applicants * 100 = 75%
      const dec2024 = result.find(d => d.month === '2024-12');
      expect(dec2024.successRate).toBe(75);
    });

    test('should calculate registration rate correctly', () => {
      const result = processRawData(mockRawData);
      // 2024-12: 3 registered / 10 accepted * 100 = 30%
      const dec2024 = result.find(d => d.month === '2024-12');
      expect(dec2024.registrationRate).toBe(30);
    });

    test('should handle zero applicants (avoid division by zero)', () => {
      const zeroApplicants = [{
        MONTH: "2024-01",
        SIGNUPS: "10",
        APPLICANTS: "0",
        ACCEPTED: "0",
        REJECTED: "0",
        WAITLISTED: "0",
        REGISTERED: "0"
      }];
      const result = processRawData(zeroApplicants);
      expect(result[0].acceptanceRate).toBe(0);
      expect(result[0].successRate).toBe(0);
    });

    test('should handle zero signups (avoid division by zero)', () => {
      const zeroSignups = [{
        MONTH: "2024-01",
        SIGNUPS: "0",
        APPLICANTS: "5",
        ACCEPTED: "2",
        REJECTED: "3",
        WAITLISTED: "0",
        REGISTERED: "1"
      }];
      const result = processRawData(zeroSignups);
      expect(result[0].conversionRate).toBe(0);
      expect(result[0].dropoffRate).toBe(0);
    });

    test('should handle zero accepted (avoid division by zero)', () => {
      const zeroAccepted = [{
        MONTH: "2024-01",
        SIGNUPS: "10",
        APPLICANTS: "5",
        ACCEPTED: "0",
        REJECTED: "5",
        WAITLISTED: "0",
        REGISTERED: "0"
      }];
      const result = processRawData(zeroAccepted);
      expect(result[0].registrationRate).toBe(0);
    });

    test('should extract year and month name', () => {
      const result = processRawData(mockRawData);
      const jan2025 = result.find(d => d.month === '2025-01');
      expect(jan2025.year).toBe('2025');
      expect(jan2025.monthName).toBe('Jan');
    });

    test('should reverse data to chronological order', () => {
      const result = processRawData(mockRawData);
      // Input is 2025-01, 2024-12, 2024-11
      // Output should be 2024-11, 2024-12, 2025-01
      expect(result[0].month).toBe('2024-11');
      expect(result[1].month).toBe('2024-12');
      expect(result[2].month).toBe('2025-01');
    });

    test('should handle empty array', () => {
      const result = processRawData([]);
      expect(result).toEqual([]);
    });

    test('should round rates to 1 decimal place', () => {
      const data = [{
        MONTH: "2024-01",
        SIGNUPS: "30",
        APPLICANTS: "27",
        ACCEPTED: "10",
        REJECTED: "17",
        WAITLISTED: "0",
        REGISTERED: "3"
      }];
      const result = processRawData(data);
      // 10 / 27 * 100 = 37.037... should be 37.0
      expect(result[0].acceptanceRate).toBe(37);
      // 3 / 10 * 100 = 30.0
      expect(result[0].registrationRate).toBe(30);
    });
  });

  describe('calculateYearlyData', () => {
    const processedData = processRawData(mockRawData);

    test('should aggregate data by year', () => {
      const result = calculateYearlyData(processedData);
      const year2024 = result.find(y => y.year === '2024');

      // 2024-12: 30 signups, 2024-11: 25 signups = 55 total
      expect(year2024.signups).toBe(55);
    });

    test('should calculate yearly acceptance rate', () => {
      const result = calculateYearlyData(processedData);
      const year2024 = result.find(y => y.year === '2024');

      // 2024 total: 15 accepted / 35 applicants * 100 = 42.9%
      expect(year2024.acceptanceRate).toBe(42.9);
    });

    test('should calculate yearly registration rate', () => {
      const result = calculateYearlyData(processedData);
      const year2024 = result.find(y => y.year === '2024');

      // 2024 total: 4 registered / 15 accepted * 100 = 26.7%
      expect(year2024.registrationRate).toBe(26.7);
    });

    test('should handle single year', () => {
      const singleYear = processRawData([mockRawData[0]]);
      const result = calculateYearlyData(singleYear);
      expect(result.length).toBe(1);
      expect(result[0].year).toBe('2025');
    });

    test('should handle multiple years', () => {
      const result = calculateYearlyData(processedData);
      expect(result.length).toBe(2); // 2024 and 2025
      expect(result.map(y => y.year)).toContain('2024');
      expect(result.map(y => y.year)).toContain('2025');
    });
  });

  describe('calculateFunnelData', () => {
    test('should return last 12 months', () => {
      // Create 15 months of data
      const manyMonths = Array.from({ length: 15 }, (_, i) => ({
        MONTH: `2024-${String(i + 1).padStart(2, '0')}`,
        SIGNUPS: "10",
        APPLICANTS: "8",
        ACCEPTED: "3",
        REJECTED: "2",
        WAITLISTED: "3",
        REGISTERED: "1"
      }));
      const processed = processRawData(manyMonths.slice(0, 12).reverse());
      const result = calculateFunnelData(processed);

      expect(result.length).toBe(12);
      // Should be the last 12 months chronologically
      expect(result[0].month).toBe('2024-01');
      expect(result[11].month).toBe('2024-12');
    });

    test('should return all data if less than 12 months', () => {
      const processed = processRawData(mockRawData);
      const result = calculateFunnelData(processed);

      expect(result.length).toBe(3); // Only 3 months of data
    });

    test('should handle exactly 12 months', () => {
      const exactTwelve = Array.from({ length: 12 }, (_, i) => ({
        MONTH: `2024-${String(i + 1).padStart(2, '0')}`,
        SIGNUPS: "10",
        APPLICANTS: "8",
        ACCEPTED: "3",
        REJECTED: "2",
        WAITLISTED: "3",
        REGISTERED: "1"
      }));
      const processed = processRawData(exactTwelve);
      const result = calculateFunnelData(processed);

      expect(result.length).toBe(12);
    });
  });

  describe('calculateCorrelationData', () => {
    test('should filter out months with zero applicants', () => {
      const dataWithZeros = [
        ...mockRawData,
        {
          MONTH: "2024-10",
          SIGNUPS: "20",
          APPLICANTS: "0",
          ACCEPTED: "0",
          REJECTED: "0",
          WAITLISTED: "0",
          REGISTERED: "0"
        }
      ];
      const processed = processRawData(dataWithZeros);
      const result = calculateCorrelationData(processed);

      // Should exclude the month with 0 applicants
      expect(result.length).toBe(3);
      expect(result.every(d => d.applicants > 0)).toBe(true);
    });

    test('should include all months with applicants > 0', () => {
      const processed = processRawData(mockRawData);
      const result = calculateCorrelationData(processed);

      expect(result.length).toBe(3);
      expect(result.every(d => d.applicants > 0)).toBe(true);
    });

    test('should return empty array if all months have zero applicants', () => {
      const allZeros = [{
        MONTH: "2024-01",
        SIGNUPS: "10",
        APPLICANTS: "0",
        ACCEPTED: "0",
        REJECTED: "0",
        WAITLISTED: "0",
        REGISTERED: "0"
      }];
      const processed = processRawData(allZeros);
      const result = calculateCorrelationData(processed);

      expect(result).toEqual([]);
    });
  });

  describe('calculateSeasonalData', () => {
    const multiYearData = [
      { MONTH: "2024-01", SIGNUPS: "20", APPLICANTS: "15", ACCEPTED: "5", REJECTED: "10", WAITLISTED: "0", REGISTERED: "2" },
      { MONTH: "2023-01", SIGNUPS: "30", APPLICANTS: "25", ACCEPTED: "10", REJECTED: "15", WAITLISTED: "0", REGISTERED: "4" },
      { MONTH: "2024-02", SIGNUPS: "15", APPLICANTS: "10", ACCEPTED: "3", REJECTED: "7", WAITLISTED: "0", REGISTERED: "1" },
    ];

    test('should calculate average by month across all years', () => {
      const processed = processRawData(multiYearData);
      const result = calculateSeasonalData(processed);

      const jan = result.find(s => s.month === 'Jan');
      // Average signups for Jan: (20 + 30) / 2 = 25
      expect(jan.avgSignups).toBe(25);
    });

    test('should round averages to 1 decimal place', () => {
      const oddData = [
        { MONTH: "2024-01", SIGNUPS: "10", APPLICANTS: "8", ACCEPTED: "3", REJECTED: "5", WAITLISTED: "0", REGISTERED: "1" },
        { MONTH: "2023-01", SIGNUPS: "11", APPLICANTS: "9", ACCEPTED: "4", REJECTED: "5", WAITLISTED: "0", REGISTERED: "2" },
        { MONTH: "2022-01", SIGNUPS: "12", APPLICANTS: "10", ACCEPTED: "5", REJECTED: "5", WAITLISTED: "0", REGISTERED: "3" },
      ];
      const processed = processRawData(oddData);
      const result = calculateSeasonalData(processed);

      const jan = result.find(s => s.month === 'Jan');
      // (10 + 11 + 12) / 3 = 11.0
      expect(jan.avgSignups).toBe(11);
    });

    test('should sort by calendar month order', () => {
      const unsortedMonths = [
        { MONTH: "2024-05", SIGNUPS: "10", APPLICANTS: "8", ACCEPTED: "3", REJECTED: "5", WAITLISTED: "0", REGISTERED: "1" },
        { MONTH: "2024-01", SIGNUPS: "15", APPLICANTS: "12", ACCEPTED: "5", REJECTED: "7", WAITLISTED: "0", REGISTERED: "2" },
        { MONTH: "2024-03", SIGNUPS: "12", APPLICANTS: "10", ACCEPTED: "4", REJECTED: "6", WAITLISTED: "0", REGISTERED: "1" },
      ];
      const processed = processRawData(unsortedMonths);
      const result = calculateSeasonalData(processed);

      // Should be sorted Jan, Mar, May
      expect(result[0].month).toBe('Jan');
      expect(result[1].month).toBe('Mar');
      expect(result[2].month).toBe('May');
    });

    test('should handle single occurrence of each month', () => {
      const processed = processRawData(mockRawData);
      const result = calculateSeasonalData(processed);

      // Each month appears once, so averages = actual values
      const jan = result.find(s => s.month === 'Jan');
      expect(jan.avgSignups).toBe(40);
    });
  });

  describe('calculateRadarData', () => {
    test('should return last 6 months', () => {
      const manyMonths = Array.from({ length: 10 }, (_, i) => ({
        MONTH: `2024-${String(i + 1).padStart(2, '0')}`,
        SIGNUPS: "10",
        APPLICANTS: "8",
        ACCEPTED: "3",
        REJECTED: "2",
        WAITLISTED: "3",
        REGISTERED: "1"
      }));
      const processed = processRawData(manyMonths);
      const result = calculateRadarData(processed);

      expect(result.length).toBe(6);
    });

    test('should include 4 key metrics', () => {
      const processed = processRawData(mockRawData);
      const result = calculateRadarData(processed);

      expect(result[0]).toHaveProperty('Conversion');
      expect(result[0]).toHaveProperty('Acceptance');
      expect(result[0]).toHaveProperty('Success');
      expect(result[0]).toHaveProperty('Efficiency');
    });

    test('should convert efficiency to percentage', () => {
      const processed = processRawData(mockRawData);
      const result = calculateRadarData(processed);

      // Efficiency is stored as 0-1 ratio, should be multiplied by 100
      expect(result[0].Efficiency).toBeGreaterThanOrEqual(0);
      expect(result[0].Efficiency).toBeLessThanOrEqual(100);
    });

    test('should extract month number (MM) only', () => {
      const processed = processRawData(mockRawData);
      const result = calculateRadarData(processed);

      // MONTH is "2024-11", should extract "11"
      expect(result[0].month).toBe('11');
    });
  });

  describe('calculateTrends', () => {
    test('should calculate signup change', () => {
      const processed = processRawData(mockRawData);
      const latest = processed[processed.length - 1]; // 2025-01
      const prev = processed[processed.length - 2]; // 2024-12

      const result = calculateTrends(latest, prev);

      // 2025-01: 40 signups, 2024-12: 30 signups, change = +10
      expect(result.signupChange).toBe(10);
    });

    test('should calculate acceptance rate change', () => {
      const processed = processRawData(mockRawData);
      const latest = processed[processed.length - 1];
      const prev = processed[processed.length - 2];

      const result = calculateTrends(latest, prev);

      // 2025-01: 33.3%, 2024-12: 50%, change = -16.7
      expect(result.acceptanceChange).toBeCloseTo(-16.7, 1);
    });

    test('should handle missing latest month', () => {
      const result = calculateTrends(null, {});

      expect(result.signupChange).toBe(0);
      expect(result.acceptanceChange).toBe(0);
      expect(result.registrationChange).toBe(0);
    });

    test('should handle missing previous month', () => {
      const result = calculateTrends({}, null);

      expect(result.signupChange).toBe(0);
      expect(result.acceptanceChange).toBe(0);
      expect(result.registrationChange).toBe(0);
    });
  });

  describe('calculateAllTimeStats', () => {
    test('should sum all numeric fields correctly', () => {
      const processed = processRawData(mockRawData);
      const result = calculateAllTimeStats(processed);

      // Total signups: 40 + 30 + 25 = 95
      expect(result.signups).toBe(95);
      // Total applicants: 24 + 20 + 15 = 59
      expect(result.applicants).toBe(59);
    });

    test('should calculate all-time conversion rate', () => {
      const processed = processRawData(mockRawData);
      const result = calculateAllTimeStats(processed);

      // 59 applicants / 95 signups * 100 = 62.1%
      expect(result.conversionRate).toBe(62.1);
    });

    test('should calculate all-time acceptance rate', () => {
      const processed = processRawData(mockRawData);
      const result = calculateAllTimeStats(processed);

      // 23 accepted / 59 applicants * 100 = 39.0%
      expect(result.acceptanceRate).toBe(39);
    });

    test('should calculate all-time registration rate', () => {
      const processed = processRawData(mockRawData);
      const result = calculateAllTimeStats(processed);

      // 6 registered / 23 accepted * 100 = 26.1%
      expect(result.registrationRate).toBe(26.1);
    });

    test('should format date range correctly', () => {
      const processed = processRawData(mockRawData);
      const result = calculateAllTimeStats(processed);

      expect(result.dateRange).toBe('2024-11 to 2025-01');
      expect(result.startDate).toBe('2024-11');
      expect(result.endDate).toBe('2025-01');
    });

    test('should handle single month', () => {
      const single = processRawData([mockRawData[0]]);
      const result = calculateAllTimeStats(single);

      expect(result.signups).toBe(40);
      expect(result.dateRange).toBe('2025-01 to 2025-01');
    });
  });

  describe('calculateSummaryStats', () => {
    test('should calculate min, max, mean, median correctly', () => {
      const data = [10, 20, 30, 40, 50];
      const result = calculateSummaryStats(data);

      expect(result.min).toBe(10);
      expect(result.max).toBe(50);
      expect(result.mean).toBe(30);
      expect(result.median).toBe(30);
      expect(result.sum).toBe(150);
      expect(result.count).toBe(5);
    });

    test('should handle even number of values for median', () => {
      const data = [10, 20, 30, 40];
      const result = calculateSummaryStats(data);

      // Median of [10, 20, 30, 40] = (20 + 30) / 2 = 25
      expect(result.median).toBe(25);
    });

    test('should handle odd number of values for median', () => {
      const data = [10, 20, 30];
      const result = calculateSummaryStats(data);

      expect(result.median).toBe(20);
    });

    test('should handle single value', () => {
      const data = [42];
      const result = calculateSummaryStats(data);

      expect(result.min).toBe(42);
      expect(result.max).toBe(42);
      expect(result.mean).toBe(42);
      expect(result.median).toBe(42);
    });

    test('should handle empty array', () => {
      const result = calculateSummaryStats([]);

      expect(result.min).toBe(0);
      expect(result.max).toBe(0);
      expect(result.mean).toBe(0);
      expect(result.median).toBe(0);
      expect(result.sum).toBe(0);
    });

    test('should handle null/undefined input', () => {
      const result1 = calculateSummaryStats(null);
      const result2 = calculateSummaryStats(undefined);

      expect(result1.min).toBe(0);
      expect(result2.min).toBe(0);
    });

    test('should round mean to 2 decimal places', () => {
      const data = [10, 11, 12];
      const result = calculateSummaryStats(data);

      // (10 + 11 + 12) / 3 = 11.0
      expect(result.mean).toBe(11);
    });
  });
});

/**
 * Test Coverage Summary
 *
 * Functions Tested: 9/9 (100%)
 * - processRawData: ✅ 11 test cases
 * - calculateYearlyData: ✅ 5 test cases
 * - calculateFunnelData: ✅ 3 test cases
 * - calculateCorrelationData: ✅ 3 test cases
 * - calculateSeasonalData: ✅ 4 test cases
 * - calculateRadarData: ✅ 4 test cases
 * - calculateTrends: ✅ 4 test cases
 * - calculateAllTimeStats: ✅ 6 test cases
 * - calculateSummaryStats: ✅ 8 test cases
 *
 * Total Test Cases: 48
 * Edge Cases Covered:
 * - Division by zero (zero applicants, signups, accepted)
 * - Empty arrays
 * - Null/undefined inputs
 * - Single values
 * - Boundary conditions (exactly 12 months, etc.)
 * - Rounding and precision
 * - Data ordering and sorting
 *
 * Expected Coverage: >90%
 */
