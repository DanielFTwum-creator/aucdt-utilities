/**
 * Analytics Calculations Utility
 * 
 * Pure functions for processing admission analytics data
 * All functions are memoization-friendly (no side effects)
 * 
 * @module analyticsCalculations
 */

/**
 * Process raw data from API into structured format with calculated metrics
 * 
 * @param {Array} rawData - Raw data from API
 * @returns {Array} Processed data with calculated rates and metrics
 */
export const processRawData = (rawData) => {
  return rawData
    .filter(d => d.MONTH || d.month) // skip records with no month key at all
    .map(d => {
    // Normalise: accept both UPPERCASE (raw phpMyAdmin) and lowercase (post-import)
    const month = d.MONTH || d.month;
    const signups = parseInt(d.SIGNUPS ?? d.signups);
    const applicants = parseInt(d.APPLICANTS ?? d.applicants);
    const accepted = parseInt(d.ACCEPTED ?? d.accepted);
    const rejected = parseInt(d.REJECTED ?? d.rejected);
    const waitlisted = parseInt(d.WAITLISTED ?? d.waitlisted);
    const registered = parseInt(d.REGISTERED ?? d.registered);

    return {
      month,
      year: month.substring(0, 4),
      monthName: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short' }),
      signups,
      applicants,
      accepted,
      rejected,
      waitlisted,
      registered,
      
      // Calculated rates (as numbers, not strings)
      acceptanceRate: applicants > 0 ? parseFloat((accepted / applicants * 100).toFixed(1)) : 0,
      rejectionRate: applicants > 0 ? parseFloat((rejected / applicants * 100).toFixed(1)) : 0,
      conversionRate: signups > 0 ? parseFloat((applicants / signups * 100).toFixed(1)) : 0,
      successRate: applicants > 0 ? parseFloat(((accepted + waitlisted) / applicants * 100).toFixed(1)) : 0,
      dropoffRate: signups > 0 ? parseFloat(((signups - applicants) / signups * 100).toFixed(1)) : 0,
      registrationRate: accepted > 0 ? parseFloat((registered / accepted * 100).toFixed(1)) : 0,
      efficiency: applicants > 0 ? parseFloat((accepted / (accepted + rejected + waitlisted)).toFixed(2)) : 0
    };
  }).reverse(); // Reverse to get chronological order
};

/**
 * Calculate yearly aggregated data
 * 
 * @param {Array} processedData - Processed monthly data
 * @returns {Array} Yearly aggregated data
 */
export const calculateYearlyData = (processedData) => {
  const yearlyData = processedData.reduce((acc, d) => {
    const existing = acc.find(item => item.year === d.year);
    if (existing) {
      existing.signups += d.signups;
      existing.applicants += d.applicants;
      existing.accepted += d.accepted;
      existing.rejected += d.rejected;
      existing.waitlisted += d.waitlisted;
      existing.registered += d.registered;
    } else {
      acc.push({
        year: d.year,
        signups: d.signups,
        applicants: d.applicants,
        accepted: d.accepted,
        rejected: d.rejected,
        waitlisted: d.waitlisted,
        registered: d.registered
      });
    }
    return acc;
  }, []);

  // Calculate rates for each year
  yearlyData.forEach(y => {
    y.acceptanceRate = y.applicants > 0 ? parseFloat((y.accepted / y.applicants * 100).toFixed(1)) : 0;
    y.registrationRate = y.accepted > 0 ? parseFloat((y.registered / y.accepted * 100).toFixed(1)) : 0;
  });

  return yearlyData;
};

/**
 * Get last 12 months of data for funnel analysis
 * 
 * @param {Array} processedData - Processed monthly data
 * @returns {Array} Last 12 months of data
 */
export const calculateFunnelData = (processedData) => {
  return processedData.slice(-12);
};

/**
 * Filter data for correlation analysis (only months with applicants)
 * 
 * @param {Array} processedData - Processed monthly data
 * @returns {Array} Filtered data with applicants > 0
 */
export const calculateCorrelationData = (processedData) => {
  return processedData.filter(d => d.applicants > 0);
};

/**
 * Calculate seasonal patterns (average by month across all years)
 * 
 * @param {Array} processedData - Processed monthly data
 * @returns {Array} Seasonal averages by month
 */
export const calculateSeasonalData = (processedData) => {
  const seasonalData = processedData.reduce((acc, d) => {
    const existing = acc.find(item => item.month === d.monthName);
    if (existing) {
      existing.avgSignups = ((existing.avgSignups * existing.count) + d.signups) / (existing.count + 1);
      existing.avgAccepted = ((existing.avgAccepted * existing.count) + d.accepted) / (existing.count + 1);
      existing.avgRejected = ((existing.avgRejected * existing.count) + d.rejected) / (existing.count + 1);
      existing.avgApplicants = ((existing.avgApplicants * existing.count) + d.applicants) / (existing.count + 1);
      existing.count++;
    } else {
      acc.push({
        month: d.monthName,
        avgSignups: d.signups,
        avgAccepted: d.accepted,
        avgRejected: d.rejected,
        avgApplicants: d.applicants,
        count: 1
      });
    }
    return acc;
  }, []);

  // Round averages to 1 decimal place
  seasonalData.forEach(s => {
    s.avgSignups = parseFloat(s.avgSignups.toFixed(1));
    s.avgAccepted = parseFloat(s.avgAccepted.toFixed(1));
    s.avgRejected = parseFloat(s.avgRejected.toFixed(1));
    s.avgApplicants = parseFloat(s.avgApplicants.toFixed(1));
  });

  // Sort by month order
  const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  seasonalData.sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));

  return seasonalData;
};

/**
 * Calculate radar chart data (last 6 months performance metrics)
 * 
 * @param {Array} processedData - Processed monthly data
 * @returns {Array} Last 6 months with key metrics
 */
export const calculateRadarData = (processedData) => {
  const recentMonths = processedData.slice(-6);
  
  return recentMonths.map(d => ({
    month: d.month.substring(5), // Just MM part
    'Conversion': d.conversionRate,
    'Acceptance': d.acceptanceRate,
    'Success': d.successRate,
    'Efficiency': d.efficiency * 100
  }));
};

/**
 * Calculate trend comparison between two periods
 * 
 * @param {Object} latestMonth - Most recent month data
 * @param {Object} prevMonth - Previous month data
 * @returns {Object} Trend indicators
 */
export const calculateTrends = (latestMonth, prevMonth) => {
  if (!latestMonth || !prevMonth) {
    return {
      signupChange: 0,
      acceptanceChange: 0,
      registrationChange: 0
    };
  }

  return {
    signupChange: latestMonth.signups - prevMonth.signups,
    acceptanceChange: latestMonth.acceptanceRate - prevMonth.acceptanceRate,
    registrationChange: latestMonth.registrationRate - prevMonth.registrationRate
  };
};

/**
 * Calculate all-time statistics
 * 
 * @param {Array} processedData - All processed data
 * @returns {Object} All-time totals and rates
 */
export const calculateAllTimeStats = (processedData) => {
  const totals = processedData.reduce((acc, d) => {
    acc.signups += d.signups;
    acc.applicants += d.applicants;
    acc.accepted += d.accepted;
    acc.rejected += d.rejected;
    acc.waitlisted += d.waitlisted;
    acc.registered += d.registered;
    return acc;
  }, {
    signups: 0,
    applicants: 0,
    accepted: 0,
    rejected: 0,
    waitlisted: 0,
    registered: 0
  });

  // Calculate all-time rates
  totals.conversionRate = totals.signups > 0 
    ? parseFloat((totals.applicants / totals.signups * 100).toFixed(1))
    : 0;
    
  totals.acceptanceRate = totals.applicants > 0 
    ? parseFloat((totals.accepted / totals.applicants * 100).toFixed(1))
    : 0;
    
  totals.registrationRate = totals.accepted > 0 
    ? parseFloat((totals.registered / totals.accepted * 100).toFixed(1))
    : 0;

  // Date range
  const sortedDates = [...processedData].sort((a, b) => a.month.localeCompare(b.month));
  totals.dateRange = `${sortedDates[0].month} to ${sortedDates[sortedDates.length - 1].month}`;
  totals.startDate = sortedDates[0].month;
  totals.endDate = sortedDates[sortedDates.length - 1].month;

  return totals;
};

/**
 * Calculate summary statistics for a dataset
 * Useful for debugging and reporting
 * 
 * @param {Array} data - Array of numbers
 * @returns {Object} Summary statistics
 */
export const calculateSummaryStats = (data) => {
  if (!data || data.length === 0) {
    return { min: 0, max: 0, mean: 0, median: 0, sum: 0 };
  }

  const sorted = [...data].sort((a, b) => a - b);
  const sum = data.reduce((a, b) => a + b, 0);
  const mean = sum / data.length;
  const median = sorted.length % 2 === 0
    ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
    : sorted[Math.floor(sorted.length / 2)];

  return {
    min: sorted[0],
    max: sorted[sorted.length - 1],
    mean: parseFloat(mean.toFixed(2)),
    median,
    sum,
    count: data.length
  };
};
