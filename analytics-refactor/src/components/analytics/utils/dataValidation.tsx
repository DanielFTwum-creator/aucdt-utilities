/**
 * Data Validation Utility
 * 
 * Validates admission analytics data for:
 * - Required fields
 * - Data type correctness
 * - Business logic constraints
 * - Date format validation
 * 
 * @module dataValidation
 */

/**
 * Validate data integrity before processing
 * 
 * @param {Array} rawData - Raw data from API
 * @returns {Object} Validation result with errors array
 * 
 * @example
 * const validation = validateDataIntegrity(data);
 * if (!validation.valid) {
 *   console.error('Validation errors:', validation.errors);
 * }
 */
export const validateDataIntegrity = (rawData) => {
  const errors = [];
  
  // Check if data is an array
  if (!Array.isArray(rawData)) {
    return { 
      valid: false, 
      errors: ['Data must be an array'],
      recordCount: 0
    };
  }
  
  // Check if data is not empty
  if (rawData.length === 0) {
    return { 
      valid: false, 
      errors: ['Data array is empty'],
      recordCount: 0
    };
  }
  
  // Helper: resolve a field accepting both UPPERCASE and lowercase key forms
  const val = (record, upper, lower) => (upper in record) ? record[upper] : record[lower];
  const has = (record, upper, lower) => (upper in record) || (lower in record);

  // Validate each record
  rawData.forEach((record, index) => {
    const monthVal = val(record, 'MONTH', 'month');
    const label = monthVal || 'unknown';

    // Check required fields exist (accept either case)
    const requiredPairs = [
      ['MONTH', 'month'],
      ['SIGNUPS', 'signups'],
      ['REGISTERED', 'registered'],
      ['ACCEPTED', 'accepted'],
      ['REJECTED', 'rejected'],
      ['WAITLISTED', 'waitlisted'],
      ['APPLICANTS', 'applicants']
    ];
    requiredPairs.forEach(([upper, lower]) => {
      if (!has(record, upper, lower)) {
        errors.push(`Record ${index} (${label}): Missing required field '${upper}'`);
      }
    });

    // Validate numeric fields
    const numericPairs = requiredPairs.filter(([u]) => u !== 'MONTH');
    numericPairs.forEach(([upper, lower]) => {
      if (has(record, upper, lower)) {
        const value = parseInt(val(record, upper, lower));
        if (isNaN(value) || value < 0) {
          errors.push(`Record ${index} (${label}): Invalid value for '${upper}': ${val(record, upper, lower)}`);
        }
      }
    });

    // Validate month format (YYYY-MM)
    if (monthVal && !/^\d{4}-\d{2}$/.test(monthVal)) {
      errors.push(`Record ${index}: Invalid month format '${monthVal}' (expected YYYY-MM)`);
    }

    // Business logic validations (only if all fields are present and numeric)
    if (requiredPairs.every(([u, l]) => has(record, u, l))) {
      const signups = parseInt(val(record, 'SIGNUPS', 'signups'));
      const applicants = parseInt(val(record, 'APPLICANTS', 'applicants'));
      const accepted = parseInt(val(record, 'ACCEPTED', 'accepted'));
      const rejected = parseInt(val(record, 'REJECTED', 'rejected'));
      const waitlisted = parseInt(val(record, 'WAITLISTED', 'waitlisted'));
      const registered = parseInt(val(record, 'REGISTERED', 'registered'));
      
      // Skip validation if any value is NaN
      if ([signups, applicants, accepted, rejected, waitlisted, registered].every(v => !isNaN(v))) {
        // Applicants generally shouldn't exceed signups (with 10% tolerance)
        if (applicants > signups * 1.1) {
          errors.push(`Record ${index} (${record.MONTH}): Applicants (${applicants}) significantly exceeds Signups (${signups})`);
        }
        
        // Registered can exceed Accepted in a given month (students may register
        // in a later month than they were accepted), so no error — warn instead.
        if (registered > accepted * 1.5) {
          errors.push(`Record ${index} (${label}): Registered (${registered}) is significantly above Accepted (${accepted}) — check for cross-month lag`);
        }
        
        // All processed statuses should sum close to applicants (with tolerance for data lags)
        const processedTotal = accepted + rejected + waitlisted;
        const difference = Math.abs(processedTotal - applicants);
        const tolerance = Math.max(5, applicants * 0.2); // 20% or 5, whichever is larger
        
        if (difference > tolerance) {
          errors.push(
            `Record ${index} (${record.MONTH}): Processed total (${processedTotal}) ` +
            `differs from Applicants (${applicants}) by ${difference}`
          );
        }
      }
    }
  });
  
  // Check for duplicate months
  const months = rawData.map(r => r.MONTH || r.month).filter(Boolean);
  const uniqueMonths = new Set(months);
  if (months.length !== uniqueMonths.size) {
    const duplicates = months.filter((m, i) => months.indexOf(m) !== i);
    errors.push(`Duplicate months found: ${[...new Set(duplicates)].join(', ')}`);
  }
  
  return {
    valid: errors.length === 0,
    errors,
    recordCount: rawData.length,
    summary: {
      totalRecords: rawData.length,
      uniqueMonths: uniqueMonths.size,
      errorCount: errors.length
    }
  };
};

/**
 * Validate a single record
 * Useful for real-time validation in forms
 * 
 * @param {Object} record - Single data record
 * @returns {Object} Validation result
 */
export const validateRecord = (record) => {
  const errors = [];
  
  // Required fields
  const requiredFields = ['MONTH', 'SIGNUPS', 'REGISTERED', 'ACCEPTED', 'REJECTED', 'WAITLISTED', 'APPLICANTS'];
  requiredFields.forEach(field => {
    if (!(field in record) || record[field] === null || record[field] === undefined) {
      errors.push(`Missing required field: ${field}`);
    }
  });
  
  // Month format
  if (record.MONTH && !/^\d{4}-\d{2}$/.test(record.MONTH)) {
    errors.push(`Invalid month format: ${record.MONTH}`);
  }
  
  // Numeric validation
  const numericFields = ['SIGNUPS', 'REGISTERED', 'ACCEPTED', 'REJECTED', 'WAITLISTED', 'APPLICANTS'];
  numericFields.forEach(field => {
    if (field in record) {
      const value = parseInt(record[field]);
      if (isNaN(value)) {
        errors.push(`${field} must be a number`);
      } else if (value < 0) {
        errors.push(`${field} cannot be negative`);
      }
    }
  });
  
  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Generate test data for development and testing
 * 
 * @param {number} monthCount - Number of months to generate
 * @param {Object} options - Generation options
 * @returns {Array} Generated test data
 * 
 * @example
 * const testData = generateTestData(12, { startDate: '2024-01-01' });
 */
export const generateTestData = (monthCount = 12, options = {}) => {
  const data = [];
  const startDate = options.startDate ? new Date(options.startDate) : new Date('2025-01-01');
  const baseSignups = options.baseSignups || 30;
  const variance = options.variance || 0.3; // 30% variance
  
  for (let i = 0; i < monthCount; i++) {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + i);
    const month = date.toISOString().substring(0, 7);
    
    // Generate realistic data with trends
    const trend = 1 + (i / monthCount) * 0.5; // Upward trend
    const seasonality = 1 + Math.sin(i / 12 * 2 * Math.PI) * 0.2; // Seasonal variation
    
    const signups = Math.max(
      5, 
      Math.floor(baseSignups * trend * seasonality * (1 + (Math.random() - 0.5) * variance))
    );
    
    const applicants = Math.floor(signups * (0.6 + Math.random() * 0.3)); // 60-90% conversion
    const accepted = Math.floor(applicants * (0.2 + Math.random() * 0.4)); // 20-60% acceptance
    const rejected = Math.floor(applicants * (0.1 + Math.random() * 0.3)); // 10-40% rejection
    const waitlisted = Math.max(0, applicants - accepted - rejected);
    const registered = Math.floor(accepted * (0.5 + Math.random() * 0.3)); // 50-80% registration
    
    data.push({
      MONTH: month,
      SIGNUPS: signups.toString(),
      APPLICANTS: applicants.toString(),
      ACCEPTED: accepted.toString(),
      REJECTED: rejected.toString(),
      WAITLISTED: waitlisted.toString(),
      REGISTERED: registered.toString()
    });
  }
  
  return data;
};

/**
 * Check for data quality issues
 * Returns warnings (not errors) for suspicious data
 * 
 * @param {Array} processedData - Processed data with calculated metrics
 * @returns {Array} Array of warning messages
 */
export const checkDataQuality = (processedData) => {
  const warnings = [];
  
  if (!processedData || processedData.length === 0) {
    return ['No data to check'];
  }
  
  // Check for unusual conversion rates
  processedData.forEach((record, index) => {
    if (record.conversionRate > 100) {
      warnings.push(`${record.month}: Conversion rate over 100% (${record.conversionRate}%)`);
    }
    
    if (record.acceptanceRate > 80) {
      warnings.push(`${record.month}: Unusually high acceptance rate (${record.acceptanceRate}%)`);
    }
    
    if (record.acceptanceRate < 10 && record.applicants > 10) {
      warnings.push(`${record.month}: Unusually low acceptance rate (${record.acceptanceRate}%)`);
    }
    
    if (record.dropoffRate > 60) {
      warnings.push(`${record.month}: High dropout rate (${record.dropoffRate}%)`);
    }
  });
  
  // Check for data gaps
  const months = processedData.map(d => d.month).sort();
  for (let i = 1; i < months.length; i++) {
    const prev = new Date(months[i - 1] + '-01');
    const curr = new Date(months[i] + '-01');
    const monthsDiff = (curr.getFullYear() - prev.getFullYear()) * 12 + (curr.getMonth() - prev.getMonth());
    
    if (monthsDiff > 2) {
      warnings.push(`Data gap detected between ${months[i - 1]} and ${months[i]} (${monthsDiff} months)`);
    }
  }
  
  // Check for zero values in recent data
  const recentData = processedData.slice(-3);
  recentData.forEach(record => {
    if (record.signups === 0 || record.applicants === 0) {
      warnings.push(`${record.month}: No signups or applicants (possible data collection issue)`);
    }
  });
  
  return warnings;
};
