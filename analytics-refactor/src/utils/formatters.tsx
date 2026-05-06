/**
 * Formatting Utilities for Magazine-Quality Display
 * 
 * Professional number, date, and text formatting
 * following editorial standards
 */

/**
 * Format number with thousand separators
 * @param {number|string} num - Number to format
 * @returns {string} Formatted number (e.g., "1,234")
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  
  // If it's already a formatted string with commas, return as-is
  if (typeof num === 'string' && num.includes(',')) {
    return num;
  }
  
  // Convert to number if it's a string
  const numValue = typeof num === 'string' ? parseFloat(num.replace(/,/g, '')) : num;
  
  // Check if conversion was successful
  if (isNaN(numValue)) return '0';
  
  return numValue.toLocaleString('en-US');
};

/**
 * Format percentage with consistent decimal places
 * @param {number|string} value - Percentage value (0-100)
 * @param {number} decimals - Number of decimal places (default: 1)
 * @returns {string} Formatted percentage (e.g., "65.3%")
 */
export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined) return '0.0%';
  
  // If it's already a formatted percentage string, return as-is
  if (typeof value === 'string' && value.includes('%')) {
    return value;
  }
  
  // Convert to number if it's a string
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  // Check if conversion was successful
  if (isNaN(numValue)) return '0.0%';
  
  return numValue.toFixed(decimals) + '%';
};

/**
 * Format month string to full month name
 * @param {string|object} monthStr - Month string (e.g., "2026-01") or month object
 * @returns {string} Formatted month (e.g., "January 2026")
 */
export const formatMonth = (monthStr) => {
  if (!monthStr) return '';
  
  // If it's already a formatted string (contains space), return as-is
  if (typeof monthStr === 'string' && monthStr.includes(' ')) {
    return monthStr;
  }
  
  // If it's an object with month/year properties
  if (typeof monthStr === 'object' && monthStr !== null) {
    // If month is a full date string like "2026-01", extract the month part
    if (monthStr.month && monthStr.month.includes('-')) {
      const [year, month] = monthStr.month.split('-');
      const date = new Date(year, parseInt(month) - 1);
      return date.toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
      });
    }
    
    // If month and year are separate numeric properties
    if (monthStr.month && monthStr.year) {
      const monthNum = typeof monthStr.month === 'string' ? parseInt(monthStr.month) : monthStr.month;
      const date = new Date(monthStr.year, monthNum - 1);
      return date.toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
      });
    }
    
    // Return empty if object doesn't have expected properties
    return '';
  }
  
  // Handle string format "YYYY-MM"
  if (typeof monthStr === 'string') {
    const [year, month] = monthStr.split('-');
    if (!year || !month) return monthStr; // Return as-is if not in expected format
    
    const date = new Date(year, parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  }
  
  // Fallback: return as string
  return String(monthStr);
};

/**
 * Format month string to short format
 * @param {string} monthStr - Month string (e.g., "2026-01")
 * @returns {string} Formatted month (e.g., "Jan 2026")
 */
export const formatMonthShort = (monthStr) => {
  if (!monthStr) return '';
  
  const [year, month] = monthStr.split('-');
  const date = new Date(year, parseInt(month) - 1);
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    year: 'numeric' 
  });
};

/**
 * Format date range for display
 * @param {string} startMonth - Start month (e.g., "2017-09")
 * @param {string} endMonth - End month (e.g., "2026-01")
 * @returns {string} Formatted range (e.g., "September 2017 to January 2026")
 */
export const formatDateRange = (startMonth, endMonth) => {
  if (!startMonth || !endMonth) return '';
  
  const start = formatMonth(startMonth);
  const end = formatMonth(endMonth);
  
  return `${start} to ${end}`;
};

/**
 * Format trend indicator with context
 * @param {number} value - Trend value
 * @param {string} label - Label for trend (e.g., "signups")
 * @returns {object} { text, isPositive, description }
 */
export const formatTrend = (value, label = '') => {
  if (value === null || value === undefined) {
    return { text: '—', isPositive: null, description: 'No change' };
  }
  
  const isPositive = value > 0;
  const arrow = isPositive ? '↑' : value < 0 ? '↓' : '→';
  const absValue = Math.abs(value);
  
  return {
    text: `${arrow} ${absValue}`,
    isPositive,
    description: isPositive 
      ? `Up ${absValue} ${label} this month`
      : value < 0
        ? `Down ${absValue} ${label} this month`
        : 'No change this month'
  };
};

/**
 * Calculate growth percentage
 * @param {number} current - Current value
 * @param {number} previous - Previous value
 * @returns {string} Formatted growth (e.g., "+15.3%")
 */
export const formatGrowth = (current, previous) => {
  if (!previous || previous === 0) return '—';
  
  const growth = ((current - previous) / previous) * 100;
  const sign = growth > 0 ? '+' : '';
  
  return `${sign}${growth.toFixed(1)}%`;
};

/**
 * Format large numbers with K/M suffix
 * @param {number} num - Number to format
 * @returns {string} Formatted number (e.g., "1.2K", "1.5M")
 */
export const formatCompactNumber = (num) => {
  if (num === null || num === undefined) return '0';
  
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

/**
 * Add ordinal suffix to number
 * @param {number} num - Number to format
 * @returns {string} Number with ordinal (e.g., "1st", "2nd", "3rd")
 */
export const formatOrdinal = (num) => {
  if (num === null || num === undefined) return '';
  
  const j = num % 10;
  const k = num % 100;
  
  if (j === 1 && k !== 11) return num + 'st';
  if (j === 2 && k !== 12) return num + 'nd';
  if (j === 3 && k !== 13) return num + 'rd';
  return num + 'th';
};

/**
 * Format time duration in a readable way
 * @param {number} months - Number of months
 * @returns {string} Formatted duration (e.g., "9 years, 4 months")
 */
export const formatDuration = (months) => {
  if (!months) return '';
  
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  
  if (years === 0) {
    return `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
  }
  
  if (remainingMonths === 0) {
    return `${years} year${years !== 1 ? 's' : ''}`;
  }
  
  return `${years} year${years !== 1 ? 's' : ''}, ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
};

/**
 * Generate contextual insight for a statistic
 * @param {number} value - Stat value
 * @param {string} type - Type of stat ('signups', 'conversion', 'acceptance')
 * @returns {string} Contextual insight
 */
export const generateInsight = (value, type) => {
  switch (type) {
    case 'conversion':
      if (value >= 70) return 'Excellent conversion rate';
      if (value >= 60) return 'Strong conversion performance';
      if (value >= 50) return 'Good conversion rate';
      return 'Room for improvement';
      
    case 'acceptance':
      if (value >= 40) return 'Highly selective';
      if (value >= 30) return 'Selective admissions';
      if (value >= 20) return 'Moderately selective';
      return 'Very selective';
      
    case 'registration':
      if (value >= 70) return 'Exceptional yield rate';
      if (value >= 60) return 'Strong yield rate';
      if (value >= 50) return 'Good yield rate';
      return 'Competitive yield';
      
    default:
      return '';
  }
};

/**
 * Calculate years between dates
 * @param {string} startMonth - Start month (YYYY-MM)
 * @param {string} endMonth - End month (YYYY-MM)
 * @returns {number} Years (with decimals)
 */
export const calculateYears = (startMonth, endMonth) => {
  if (!startMonth || !endMonth) return 0;
  
  const [startYear, startMon] = startMonth.split('-').map(Number);
  const [endYear, endMon] = endMonth.split('-').map(Number);
  
  const months = (endYear - startYear) * 12 + (endMon - startMon);
  return (months / 12).toFixed(1);
};

/**
 * Format context for statistics
 * @param {number} count - Number of items
 * @param {string} singular - Singular form
 * @param {string} plural - Plural form
 * @returns {string} Formatted text
 */
export const pluralize = (count, singular, plural) => {
  return count === 1 ? `${count} ${singular}` : `${count} ${plural || singular + 's'}`;
};
