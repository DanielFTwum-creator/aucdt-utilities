import { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  processRawData, 
  calculateYearlyData, 
  calculateFunnelData,
  calculateCorrelationData,
  calculateSeasonalData,
  calculateRadarData 
} from '../utils/analyticsCalculations';
import { validateDataIntegrity } from '../utils/dataValidation';

/**
 * Custom hook for fetching and processing analytics data
 * 
 * Features:
 * - Automatic data fetching on mount
 * - Data validation before processing
 * - Memoized calculations for performance
 * - Loading and error state management
 * - Refetch capability
 * 
 * @param {Object} options - Configuration options
 * @param {Object} options.dateRange - Start and end date filters
 * @param {Array} options.selectedMetrics - Metrics to include
 * @returns {Object} Data, loading state, error state, and helper functions
 * 
 * @example
 * const { data, loading, error, processedMetrics } = useAnalyticsData({
 *   dateRange: { start: new Date('2024-01-01'), end: new Date('2024-12-31') },
 *   selectedMetrics: ['all']
 * });
 */
export const useAnalyticsData = ({ dateRange, selectedMetrics }) => {
  const [rawData, setRawData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);

  /**
   * Fetch data from API or use fallback data
   * In production, replace with actual API endpoint
   */
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: Replace with actual API endpoint
      // const response = await fetch('/api/analytics/admission-data');
      
      // For now, simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check for imported data in localStorage first
      const importedDataStr = localStorage.getItem('imported_analytics_data');
      let data;
      
      if (importedDataStr) {
        try {
          data = JSON.parse(importedDataStr);
          const importTimestamp = localStorage.getItem('data_import_timestamp');
          console.log(`📥 Using imported data from localStorage (imported: ${importTimestamp})`);
          console.log(`📊 Imported data: ${data.length} records`);
        } catch (parseError) {
          console.error('❌ Failed to parse imported data, using fallback');
          data = getFallbackData();
        }
      } else {
        // Use fallback data (in production, this comes from API)
        data = getFallbackData();
      }
      
      // Validate data integrity before processing
      const validation = validateDataIntegrity(data);
      if (!validation.valid) {
        console.warn('⚠️ Data validation warnings:', validation.errors);
        console.warn('Proceeding with data despite validation warnings...');
        // In development, we proceed with the data even if validation has warnings
        // In production, you may want to throw an error here
      }
      
      setRawData(data);
      setLastFetch(new Date());
      
      console.log('✅ Analytics data loaded successfully:', {
        records: validation.recordCount,
        timestamp: new Date().toISOString()
      });
      
    } catch (err) {
      console.error('❌ Analytics data fetch error:', err);
      setError(err);
      
      // On error, still try to use cached data if available
      if (rawData.length === 0) {
        // No cached data, use fallback
        setRawData(getFallbackData());
      }
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange]); // Re-fetch when date range changes (rawData intentionally excluded to prevent loops)

  // Initial data fetch on mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /**
   * Memoized processed data - only recalculates when dependencies change
   * This is critical for performance with large datasets
   */
  const processedMetrics = useMemo(() => {
    if (!rawData?.length) return null;
    
    console.log('🔄 Processing analytics data...');
    const startTime = performance.now();
    
    // Step 1: Process raw data (parse numbers, calculate rates)
    const processed = processRawData(rawData);
    
    // Step 2: Apply date range filter if specified
    const dateFiltered = dateRange.start && dateRange.end
      ? processed.filter(d => {
          const date = new Date(d.month + '-01');
          return date >= dateRange.start && date <= dateRange.end;
        })
      : processed;

    // Step 3: Apply metric filter — zero out metrics not selected
    const metricKeys = ['signups', 'applicants', 'accepted', 'rejected', 'waitlisted', 'registered'];
    const hasMetricFilter = Array.isArray(selectedMetrics) && !selectedMetrics.includes('all');

    const filtered = hasMetricFilter
      ? dateFiltered.map(record => {
          const out = { ...record };
          metricKeys.forEach(key => {
            if (!selectedMetrics.includes(key)) {
              out[key] = 0;
            }
          });
          return out;
        })
      : dateFiltered;

    // Step 4: Calculate different data views for each chart
    const result = {
      raw: filtered,
      yearlyData: calculateYearlyData(filtered),
      funnelData: calculateFunnelData(filtered),
      correlationData: calculateCorrelationData(filtered),
      seasonalData: calculateSeasonalData(filtered),
      radarData: calculateRadarData(filtered)
    };

    const endTime = performance.now();
    console.log(`✅ Data processing complete in ${(endTime - startTime).toFixed(2)}ms`);

    return result;
  }, [rawData, dateRange, selectedMetrics]);

  /**
   * Manual refetch function
   * Useful for retry button in error state
   */
  const refetch = useCallback(() => {
    console.log('🔄 Manual refetch triggered');
    fetchData();
  }, [fetchData]);

  /**
   * Get cache info for debugging
   */
  const cacheInfo = useMemo(() => ({
    lastFetch,
    recordCount: rawData.length,
    cacheAge: lastFetch ? Date.now() - lastFetch.getTime() : null
  }), [rawData, lastFetch]);

  return {
    // Processed data
    data: processedMetrics?.raw || [],
    processedMetrics,
    
    // State management
    loading,
    error,
    
    // Actions
    refetch,
    
    // Debugging info
    cacheInfo
  };
};

/**
 * Fallback data for development/testing
 * In production, this is replaced by API data
 * 
 * @private
 */
export function getFallbackData() {
  // Updated data from export (6).json - February 4, 2026
  return [
    {"MONTH":"2026-02","SIGNUPS":"2","REGISTERED":"0","ACCEPTED":"0","REJECTED":"0","WAITLISTED":"0","APPLICANTS":"0"},
    {"MONTH":"2026-01","SIGNUPS":"47","REGISTERED":"6","ACCEPTED":"11","REJECTED":"8","WAITLISTED":"4","APPLICANTS":"29"},
    {"MONTH":"2025-12","SIGNUPS":"33","REGISTERED":"12","ACCEPTED":"8","REJECTED":"7","WAITLISTED":"4","APPLICANTS":"31"},
    {"MONTH":"2025-11","SIGNUPS":"21","REGISTERED":"7","ACCEPTED":"8","REJECTED":"2","WAITLISTED":"1","APPLICANTS":"18"},
    {"MONTH":"2025-10","SIGNUPS":"27","REGISTERED":"4","ACCEPTED":"8","REJECTED":"9","WAITLISTED":"3","APPLICANTS":"24"},
    {"MONTH":"2025-09","SIGNUPS":"11","REGISTERED":"2","ACCEPTED":"3","REJECTED":"3","WAITLISTED":"2","APPLICANTS":"10"},
    {"MONTH":"2025-08","SIGNUPS":"13","REGISTERED":"3","ACCEPTED":"5","REJECTED":"2","WAITLISTED":"1","APPLICANTS":"11"},
    {"MONTH":"2025-07","SIGNUPS":"22","REGISTERED":"4","ACCEPTED":"11","REJECTED":"4","WAITLISTED":"0","APPLICANTS":"19"},
    {"MONTH":"2025-06","SIGNUPS":"21","REGISTERED":"11","ACCEPTED":"11","REJECTED":"6","WAITLISTED":"0","APPLICANTS":"28"},
    {"MONTH":"2025-05","SIGNUPS":"23","REGISTERED":"1","ACCEPTED":"2","REJECTED":"3","WAITLISTED":"0","APPLICANTS":"6"},
    {"MONTH":"2025-04","SIGNUPS":"15","REGISTERED":"2","ACCEPTED":"3","REJECTED":"4","WAITLISTED":"0","APPLICANTS":"9"},
    {"MONTH":"2025-03","SIGNUPS":"14","REGISTERED":"2","ACCEPTED":"5","REJECTED":"5","WAITLISTED":"0","APPLICANTS":"12"},
    {"MONTH":"2025-02","SIGNUPS":"17","REGISTERED":"3","ACCEPTED":"5","REJECTED":"6","WAITLISTED":"0","APPLICANTS":"14"},
    {"MONTH":"2025-01","SIGNUPS":"47","REGISTERED":"12","ACCEPTED":"16","REJECTED":"18","WAITLISTED":"0","APPLICANTS":"46"},
    {"MONTH":"2024-12","SIGNUPS":"23","REGISTERED":"4","ACCEPTED":"6","REJECTED":"5","WAITLISTED":"2","APPLICANTS":"17"},
    {"MONTH":"2024-11","SIGNUPS":"32","REGISTERED":"4","ACCEPTED":"5","REJECTED":"11","WAITLISTED":"4","APPLICANTS":"24"},
    {"MONTH":"2024-10","SIGNUPS":"35","REGISTERED":"5","ACCEPTED":"3","REJECTED":"15","WAITLISTED":"7","APPLICANTS":"30"},
    {"MONTH":"2024-09","SIGNUPS":"25","REGISTERED":"3","ACCEPTED":"4","REJECTED":"6","WAITLISTED":"5","APPLICANTS":"18"},
    {"MONTH":"2024-08","SIGNUPS":"17","REGISTERED":"4","ACCEPTED":"3","REJECTED":"4","WAITLISTED":"2","APPLICANTS":"13"},
    {"MONTH":"2024-07","SIGNUPS":"16","REGISTERED":"1","ACCEPTED":"3","REJECTED":"10","WAITLISTED":"1","APPLICANTS":"15"},
    {"MONTH":"2024-06","SIGNUPS":"12","REGISTERED":"2","ACCEPTED":"2","REJECTED":"3","WAITLISTED":"5","APPLICANTS":"12"},
    {"MONTH":"2024-05","SIGNUPS":"10","REGISTERED":"1","ACCEPTED":"3","REJECTED":"2","WAITLISTED":"4","APPLICANTS":"10"},
    {"MONTH":"2024-04","SIGNUPS":"6","REGISTERED":"1","ACCEPTED":"1","REJECTED":"2","WAITLISTED":"0","APPLICANTS":"4"},
    {"MONTH":"2024-03","SIGNUPS":"6","REGISTERED":"1","ACCEPTED":"0","REJECTED":"2","WAITLISTED":"2","APPLICANTS":"5"},
    {"MONTH":"2024-02","SIGNUPS":"9","REGISTERED":"2","ACCEPTED":"0","REJECTED":"2","WAITLISTED":"4","APPLICANTS":"8"},
    {"MONTH":"2024-01","SIGNUPS":"33","REGISTERED":"9","ACCEPTED":"12","REJECTED":"3","WAITLISTED":"4","APPLICANTS":"29"},
    {"MONTH":"2023-12","SIGNUPS":"19","REGISTERED":"4","ACCEPTED":"6","REJECTED":"8","WAITLISTED":"0","APPLICANTS":"18"},
    {"MONTH":"2023-11","SIGNUPS":"12","REGISTERED":"4","ACCEPTED":"3","REJECTED":"6","WAITLISTED":"0","APPLICANTS":"13"},
    {"MONTH":"2023-10","SIGNUPS":"15","REGISTERED":"3","ACCEPTED":"0","REJECTED":"11","WAITLISTED":"0","APPLICANTS":"14"},
    {"MONTH":"2023-09","SIGNUPS":"10","REGISTERED":"1","ACCEPTED":"1","REJECTED":"6","WAITLISTED":"0","APPLICANTS":"8"},
    {"MONTH":"2023-08","SIGNUPS":"7","REGISTERED":"3","ACCEPTED":"0","REJECTED":"2","WAITLISTED":"0","APPLICANTS":"5"},
    {"MONTH":"2023-07","SIGNUPS":"13","REGISTERED":"2","ACCEPTED":"3","REJECTED":"7","WAITLISTED":"0","APPLICANTS":"12"},
    {"MONTH":"2023-06","SIGNUPS":"19","REGISTERED":"4","ACCEPTED":"5","REJECTED":"9","WAITLISTED":"0","APPLICANTS":"18"},
    {"MONTH":"2023-05","SIGNUPS":"6","REGISTERED":"1","ACCEPTED":"2","REJECTED":"4","WAITLISTED":"0","APPLICANTS":"7"},
    {"MONTH":"2023-04","SIGNUPS":"9","REGISTERED":"1","ACCEPTED":"0","REJECTED":"1","WAITLISTED":"0","APPLICANTS":"2"},
    {"MONTH":"2023-03","SIGNUPS":"18","REGISTERED":"4","ACCEPTED":"2","REJECTED":"5","WAITLISTED":"0","APPLICANTS":"11"},
    {"MONTH":"2023-02","SIGNUPS":"27","REGISTERED":"2","ACCEPTED":"4","REJECTED":"3","WAITLISTED":"0","APPLICANTS":"9"},
    {"MONTH":"2023-01","SIGNUPS":"57","REGISTERED":"5","ACCEPTED":"9","REJECTED":"15","WAITLISTED":"0","APPLICANTS":"29"},
    {"MONTH":"2022-12","SIGNUPS":"33","REGISTERED":"5","ACCEPTED":"11","REJECTED":"5","WAITLISTED":"0","APPLICANTS":"21"},
    {"MONTH":"2022-11","SIGNUPS":"39","REGISTERED":"5","ACCEPTED":"9","REJECTED":"8","WAITLISTED":"0","APPLICANTS":"22"},
    {"MONTH":"2022-10","SIGNUPS":"12","REGISTERED":"1","ACCEPTED":"2","REJECTED":"3","WAITLISTED":"1","APPLICANTS":"7"},
    {"MONTH":"2022-09","SIGNUPS":"6","REGISTERED":"0","ACCEPTED":"0","REJECTED":"1","WAITLISTED":"0","APPLICANTS":"1"},
    {"MONTH":"2022-08","SIGNUPS":"18","REGISTERED":"5","ACCEPTED":"6","REJECTED":"1","WAITLISTED":"0","APPLICANTS":"12"},
    {"MONTH":"2022-07","SIGNUPS":"27","REGISTERED":"2","ACCEPTED":"2","REJECTED":"2","WAITLISTED":"1","APPLICANTS":"7"},
    {"MONTH":"2022-06","SIGNUPS":"40","REGISTERED":"0","ACCEPTED":"0","REJECTED":"6","WAITLISTED":"1","APPLICANTS":"7"},
    {"MONTH":"2022-05","SIGNUPS":"6","REGISTERED":"0","ACCEPTED":"0","REJECTED":"0","WAITLISTED":"0","APPLICANTS":"0"},
    {"MONTH":"2022-04","SIGNUPS":"13","REGISTERED":"1","ACCEPTED":"0","REJECTED":"2","WAITLISTED":"1","APPLICANTS":"4"},
    {"MONTH":"2022-03","SIGNUPS":"16","REGISTERED":"1","ACCEPTED":"0","REJECTED":"0","WAITLISTED":"1","APPLICANTS":"2"},
    {"MONTH":"2022-02","SIGNUPS":"9","REGISTERED":"0","ACCEPTED":"0","REJECTED":"0","WAITLISTED":"1","APPLICANTS":"1"},
    {"MONTH":"2022-01","SIGNUPS":"4","REGISTERED":"2","ACCEPTED":"1","REJECTED":"0","WAITLISTED":"0","APPLICANTS":"3"},
    {"MONTH":"2021-11","SIGNUPS":"2","REGISTERED":"0","ACCEPTED":"0","REJECTED":"0","WAITLISTED":"0","APPLICANTS":"0"},
    {"MONTH":"2021-05","SIGNUPS":"1","REGISTERED":"0","ACCEPTED":"0","REJECTED":"0","WAITLISTED":"0","APPLICANTS":"0"},
    {"MONTH":"2021-04","SIGNUPS":"2","REGISTERED":"0","ACCEPTED":"0","REJECTED":"2","WAITLISTED":"0","APPLICANTS":"2"},
    {"MONTH":"2021-02","SIGNUPS":"3","REGISTERED":"0","ACCEPTED":"0","REJECTED":"0","WAITLISTED":"0","APPLICANTS":"0"},
    {"MONTH":"2021-01","SIGNUPS":"1","REGISTERED":"0","ACCEPTED":"0","REJECTED":"0","WAITLISTED":"0","APPLICANTS":"0"},
    {"MONTH":"2020-12","SIGNUPS":"1","REGISTERED":"0","ACCEPTED":"0","REJECTED":"0","WAITLISTED":"0","APPLICANTS":"0"},
    {"MONTH":"2020-11","SIGNUPS":"2","REGISTERED":"1","ACCEPTED":"0","REJECTED":"0","WAITLISTED":"0","APPLICANTS":"1"},
    {"MONTH":"2020-10","SIGNUPS":"2","REGISTERED":"0","ACCEPTED":"0","REJECTED":"0","WAITLISTED":"0","APPLICANTS":"0"},
    {"MONTH":"2020-01","SIGNUPS":"0","REGISTERED":"2","ACCEPTED":"0","REJECTED":"0","WAITLISTED":"0","APPLICANTS":"2"},
    {"MONTH":"2018-01","SIGNUPS":"0","REGISTERED":"0","ACCEPTED":"1","REJECTED":"0","WAITLISTED":"0","APPLICANTS":"1"},
    {"MONTH":"2017-09","SIGNUPS":"0","REGISTERED":"1","ACCEPTED":"0","REJECTED":"0","WAITLISTED":"0","APPLICANTS":"1"}
  ];
}
