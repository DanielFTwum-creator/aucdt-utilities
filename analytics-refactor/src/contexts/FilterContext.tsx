import React, { createContext, useContext, useState, useCallback } from 'react';

/**
 * Filter Context
 * 
 * Manages advanced filtering for dashboard data:
 * - Date range selection
 * - Metric selection (which data series to display)
 * - Year comparison
 * - Saved filter presets
 * 
 * Features:
 * - Quick presets (Last 30 days, Last 6 months, etc.)
 * - Custom date ranges
 * - Metric toggles
 * - Filter persistence
 */

const FilterContext = createContext();

// Predefined filter presets
export const FILTER_PRESETS = {
  ALL_TIME: 'all-time',
  LAST_30_DAYS: 'last-30-days',
  LAST_3_MONTHS: 'last-3-months',
  LAST_6_MONTHS: 'last-6-months',
  LAST_12_MONTHS: 'last-12-months',
  THIS_YEAR: 'this-year',
  LAST_YEAR: 'last-year',
  CUSTOM: 'custom'
};

// Available metrics to filter
export const AVAILABLE_METRICS = {
  SIGNUPS: 'signups',
  APPLICANTS: 'applicants',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  WAITLISTED: 'waitlisted',
  REGISTERED: 'registered'
};

export function FilterProvider({ children }) {
  // Filter state
  const [dateRangePreset, setDateRangePreset] = useState(FILTER_PRESETS.ALL_TIME);
  const [customDateRange, setCustomDateRange] = useState({ start: null, end: null });
  const [selectedMetrics, setSelectedMetrics] = useState(Object.values(AVAILABLE_METRICS));
  const [compareYears, setCompareYears] = useState([]);
  const [savedPresets, setSavedPresets] = useState([]);

  /**
   * Get date range based on preset
   */
  const getDateRangeFromPreset = useCallback((preset) => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    switch (preset) {
      case FILTER_PRESETS.LAST_30_DAYS:
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);
        return {
          start: thirtyDaysAgo,
          end: today
        };

      case FILTER_PRESETS.LAST_3_MONTHS:
        const threeMonthsAgo = new Date(currentYear, currentMonth - 3, 1);
        return {
          start: threeMonthsAgo,
          end: today
        };

      case FILTER_PRESETS.LAST_6_MONTHS:
        const sixMonthsAgo = new Date(currentYear, currentMonth - 6, 1);
        return {
          start: sixMonthsAgo,
          end: today
        };

      case FILTER_PRESETS.LAST_12_MONTHS:
        const twelveMonthsAgo = new Date(currentYear, currentMonth - 12, 1);
        return {
          start: twelveMonthsAgo,
          end: today
        };

      case FILTER_PRESETS.THIS_YEAR:
        return {
          start: new Date(currentYear, 0, 1),
          end: today
        };

      case FILTER_PRESETS.LAST_YEAR:
        return {
          start: new Date(currentYear - 1, 0, 1),
          end: new Date(currentYear - 1, 11, 31)
        };

      case FILTER_PRESETS.CUSTOM:
        return customDateRange;

      case FILTER_PRESETS.ALL_TIME:
      default:
        return { start: null, end: null };
    }
  }, [customDateRange]);

  /**
   * Apply date range preset
   */
  const applyPreset = useCallback((preset) => {
    setDateRangePreset(preset);
    console.log(`📅 Filter preset applied: ${preset}`);
  }, []);

  /**
   * Set custom date range
   */
  const setCustomRange = useCallback((start, end) => {
    setCustomDateRange({ start, end });
    setDateRangePreset(FILTER_PRESETS.CUSTOM);
    console.log(`📅 Custom date range set: ${start} to ${end}`);
  }, []);

  /**
   * Toggle metric selection
   */
  const toggleMetric = useCallback((metric) => {
    setSelectedMetrics(prev => {
      if (prev.includes(metric)) {
        // Don't allow removing all metrics
        if (prev.length === 1) {
          console.warn('⚠️ Cannot deselect all metrics');
          return prev;
        }
        return prev.filter(m => m !== metric);
      } else {
        return [...prev, metric];
      }
    });
    console.log(`📊 Metric toggled: ${metric}`);
  }, []);

  /**
   * Select all metrics
   */
  const selectAllMetrics = useCallback(() => {
    setSelectedMetrics(Object.values(AVAILABLE_METRICS));
    console.log('📊 All metrics selected');
  }, []);

  /**
   * Clear all metrics (reset to all)
   */
  const clearMetrics = useCallback(() => {
    setSelectedMetrics(Object.values(AVAILABLE_METRICS));
    console.log('📊 Metrics reset to all');
  }, []);

  /**
   * Add year for comparison
   */
  const addComparisonYear = useCallback((year) => {
    setCompareYears(prev => {
      if (prev.includes(year)) {
        return prev;
      }
      return [...prev, year].sort((a, b) => b - a);
    });
    console.log(`📈 Comparison year added: ${year}`);
  }, []);

  /**
   * Remove year from comparison
   */
  const removeComparisonYear = useCallback((year) => {
    setCompareYears(prev => prev.filter(y => y !== year));
    console.log(`📈 Comparison year removed: ${year}`);
  }, []);

  /**
   * Clear all comparison years
   */
  const clearComparisons = useCallback(() => {
    setCompareYears([]);
    console.log('📈 All comparison years cleared');
  }, []);

  /**
   * Save current filter as preset
   */
  const savePreset = useCallback((name) => {
    const preset = {
      id: Date.now().toString(),
      name,
      dateRangePreset,
      customDateRange,
      selectedMetrics,
      compareYears,
      createdAt: new Date().toISOString()
    };

    setSavedPresets(prev => [...prev, preset]);
    console.log(`💾 Filter preset saved: ${name}`);
    return preset;
  }, [dateRangePreset, customDateRange, selectedMetrics, compareYears]);

  /**
   * Load saved preset
   */
  const loadPreset = useCallback((presetId) => {
    const preset = savedPresets.find(p => p.id === presetId);
    if (preset) {
      setDateRangePreset(preset.dateRangePreset);
      setCustomDateRange(preset.customDateRange);
      setSelectedMetrics(preset.selectedMetrics);
      setCompareYears(preset.compareYears);
      console.log(`📂 Filter preset loaded: ${preset.name}`);
    }
  }, [savedPresets]);

  /**
   * Delete saved preset
   */
  const deletePreset = useCallback((presetId) => {
    setSavedPresets(prev => prev.filter(p => p.id !== presetId));
    console.log(`🗑️ Filter preset deleted: ${presetId}`);
  }, []);

  /**
   * Reset all filters
   */
  const resetFilters = useCallback(() => {
    setDateRangePreset(FILTER_PRESETS.ALL_TIME);
    setCustomDateRange({ start: null, end: null });
    setSelectedMetrics(Object.values(AVAILABLE_METRICS));
    setCompareYears([]);
    console.log('🔄 All filters reset to defaults');
  }, []);

  /**
   * Filter data based on current settings
   */
  const filterData = useCallback((data) => {
    if (!data || data.length === 0) return data;

    let filtered = [...data];

    // Apply date range filter
    const dateRange = getDateRangeFromPreset(dateRangePreset);
    if (dateRange.start || dateRange.end) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.month + '-01');
        
        if (dateRange.start && itemDate < dateRange.start) return false;
        if (dateRange.end && itemDate > dateRange.end) return false;
        
        return true;
      });
    }

    // Note: Metric filtering is handled at display level, not data filtering
    // compareYears is also handled at display level for overlay

    return filtered;
  }, [dateRangePreset, getDateRangeFromPreset]);

  /**
   * Check if metric is selected
   */
  const isMetricSelected = useCallback((metric) => {
    return selectedMetrics.includes(metric);
  }, [selectedMetrics]);

  /**
   * Get active filter count
   */
  const getActiveFilterCount = useCallback(() => {
    let count = 0;
    
    if (dateRangePreset !== FILTER_PRESETS.ALL_TIME) count++;
    if (selectedMetrics.length < Object.values(AVAILABLE_METRICS).length) count++;
    if (compareYears.length > 0) count++;
    
    return count;
  }, [dateRangePreset, selectedMetrics, compareYears]);

  const value = {
    // State
    dateRangePreset,
    customDateRange,
    selectedMetrics,
    compareYears,
    savedPresets,
    
    // Date range functions
    applyPreset,
    setCustomRange,
    getDateRangeFromPreset,
    
    // Metric functions
    toggleMetric,
    selectAllMetrics,
    clearMetrics,
    isMetricSelected,
    
    // Comparison functions
    addComparisonYear,
    removeComparisonYear,
    clearComparisons,
    
    // Preset management
    savePreset,
    loadPreset,
    deletePreset,
    
    // Utility functions
    resetFilters,
    filterData,
    getActiveFilterCount,
    
    // Constants
    FILTER_PRESETS,
    AVAILABLE_METRICS
  };

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilter() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
}

export default FilterContext;
