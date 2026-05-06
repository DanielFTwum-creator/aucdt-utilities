/**
 * Input Validation Utilities
 *
 * Provides comprehensive input validation and sanitization for user inputs,
 * file uploads, and data imports to prevent security vulnerabilities.
 *
 * SECURITY FEATURES:
 * - XSS prevention through HTML sanitization
 * - SQL injection prevention (field validation)
 * - File type validation
 * - File size limits
 * - JSON structure validation
 * - Data integrity checks
 *
 * @module utils/inputValidation
 */

/**
 * Maximum file size for uploads (5MB)
 */
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * Allowed file extensions for data import
 */
export const ALLOWED_FILE_TYPES = ['.json', '.csv'];

/**
 * Required fields for analytics data records
 */
export const REQUIRED_ANALYTICS_FIELDS = [
  'MONTH',
  'SIGNUPS',
  'APPLICANTS',
  'ACCEPTED',
  'REJECTED',
  'WAITLISTED',
  'REGISTERED'
];

/**
 * Sanitize string input to prevent XSS attacks
 *
 * @param {string} input - Input string to sanitize
 * @returns {string} Sanitized string
 */
export const sanitizeString = (input) => {
  if (typeof input !== 'string') return '';

  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
};

/**
 * Validate file for upload
 *
 * @param {File} file - File object to validate
 * @returns {Object} Validation result { valid: boolean, error?: string }
 */
export const validateFile = (file) => {
  if (!file) {
    return { valid: false, error: 'No file selected' };
  }

  // Check file type
  const fileName = file.name.toLowerCase();
  const hasValidExtension = ALLOWED_FILE_TYPES.some(ext => fileName.endsWith(ext));

  if (!hasValidExtension) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}`
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    const maxSizeMB = (MAX_FILE_SIZE / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File too large. Maximum size: ${maxSizeMB}MB`
    };
  }

  // Check for empty file
  if (file.size === 0) {
    return { valid: false, error: 'File is empty' };
  }

  return { valid: true };
};

/**
 * Validate JSON data structure for analytics import
 *
 * @param {*} data - Parsed JSON data
 * @returns {Object} Validation result { valid: boolean, error?: string, data?: Array }
 */
export const validateAnalyticsJSON = (data) => {
  // Check if data exists
  if (!data) {
    return { valid: false, error: 'No data provided' };
  }

  // Convert to array if single object
  let records = Array.isArray(data) ? data : [data];

  // Handle phpMyAdmin export format (object with table name as key)
  if (!Array.isArray(data) && typeof data === 'object') {
    // Find array in object properties
    const keys = Object.keys(data);
    for (const key of keys) {
      if (Array.isArray(data[key])) {
        records = data[key];
        break;
      }
    }
  }

  // Validate array
  if (!Array.isArray(records) || records.length === 0) {
    return { valid: false, error: 'Data must be a non-empty array of records' };
  }

  // Limit number of records
  if (records.length > 10000) {
    return { valid: false, error: 'Too many records. Maximum: 10,000 records' };
  }

  // Validate each record
  const errors = [];
  const validRecords = [];

  records.forEach((record, index) => {
    const recordValidation = validateAnalyticsRecord(record, index);

    if (recordValidation.valid) {
      validRecords.push(recordValidation.sanitized);
    } else {
      errors.push(recordValidation.error);
    }
  });

  // Allow some errors but not too many
  const errorRate = errors.length / records.length;
  if (errorRate > 0.1) { // More than 10% error rate
    return {
      valid: false,
      error: `Too many invalid records (${errors.length}/${records.length}). First error: ${errors[0]}`
    };
  }

  if (validRecords.length === 0) {
    return { valid: false, error: 'No valid records found' };
  }

  return {
    valid: true,
    data: validRecords,
    warnings: errors.length > 0 ? `${errors.length} records skipped due to validation errors` : null
  };
};

/**
 * Validate a single analytics data record
 *
 * @param {Object} record - Record to validate
 * @param {number} index - Record index (for error reporting)
 * @returns {Object} Validation result { valid: boolean, error?: string, sanitized?: Object }
 */
export const validateAnalyticsRecord = (record, index = 0) => {
  if (!record || typeof record !== 'object') {
    return { valid: false, error: `Record ${index + 1}: Not an object` };
  }

  // Check required fields
  const missingFields = REQUIRED_ANALYTICS_FIELDS.filter(field => !(field in record));

  if (missingFields.length > 0) {
    return {
      valid: false,
      error: `Record ${index + 1}: Missing required fields: ${missingFields.join(', ')}`
    };
  }

  // Sanitize and validate each field
  const sanitized = {};

  try {
    // Validate MONTH format (YYYY-MM)
    const month = String(record.MONTH).trim();
    if (!/^\d{4}-\d{2}$/.test(month)) {
      return {
        valid: false,
        error: `Record ${index + 1}: Invalid MONTH format. Expected YYYY-MM, got: ${month}`
      };
    }
    sanitized.MONTH = month;

    // Validate numeric fields
    const numericFields = ['SIGNUPS', 'APPLICANTS', 'ACCEPTED', 'REJECTED', 'WAITLISTED', 'REGISTERED'];

    for (const field of numericFields) {
      const value = parseNumericField(record[field]);

      if (value === null || value < 0) {
        return {
          valid: false,
          error: `Record ${index + 1}: Invalid ${field} value. Must be non-negative number, got: ${record[field]}`
        };
      }

      if (value > 1000000) {
        return {
          valid: false,
          error: `Record ${index + 1}: ${field} value too large (max: 1,000,000)`
        };
      }

      sanitized[field] = value;
    }

    // Logical validation: applicants should be <= signups
    if (sanitized.APPLICANTS > sanitized.SIGNUPS) {
      return {
        valid: false,
        error: `Record ${index + 1}: APPLICANTS (${sanitized.APPLICANTS}) cannot exceed SIGNUPS (${sanitized.SIGNUPS})`
      };
    }

    // Logical validation: accepted + rejected + waitlisted should be <= applicants (with tolerance)
    const total = sanitized.ACCEPTED + sanitized.REJECTED + sanitized.WAITLISTED;
    const tolerance = Math.max(5, sanitized.APPLICANTS * 0.2); // 20% tolerance or 5
    if (total > sanitized.APPLICANTS + tolerance) {
      return {
        valid: false,
        error: `Record ${index + 1}: Sum of outcomes (${total}) significantly exceeds APPLICANTS (${sanitized.APPLICANTS})`
      };
    }

    // Logical validation: registered should be <= accepted
    if (sanitized.REGISTERED > sanitized.ACCEPTED) {
      return {
        valid: false,
        error: `Record ${index + 1}: REGISTERED (${sanitized.REGISTERED}) cannot exceed ACCEPTED (${sanitized.ACCEPTED})`
      };
    }

    return { valid: true, sanitized };
  } catch (error) {
    return {
      valid: false,
      error: `Record ${index + 1}: Validation error - ${error.message}`
    };
  }
};

/**
 * Parse numeric field value
 *
 * @param {*} value - Value to parse
 * @returns {number|null} Parsed number or null if invalid
 */
const parseNumericField = (value) => {
  // Handle null/undefined
  if (value === null || value === undefined) return 0;

  // Handle string
  if (typeof value === 'string') {
    // Remove commas and whitespace
    const cleaned = value.replace(/,/g, '').trim();

    // Check if empty
    if (cleaned === '') return 0;

    // Parse as integer
    const parsed = parseInt(cleaned, 10);
    return isNaN(parsed) ? null : parsed;
  }

  // Handle number
  if (typeof value === 'number') {
    return isNaN(value) ? null : Math.floor(value);
  }

  return null;
};

/**
 * Validate username/password input
 *
 * @param {string} username - Username to validate
 * @param {string} password - Password to validate
 * @returns {Object} Validation result { valid: boolean, errors: Array }
 */
export const validateCredentials = (username, password) => {
  const errors = [];

  if (!username || username.trim().length === 0) {
    errors.push('Username is required');
  } else if (username.length < 3) {
    errors.push('Username must be at least 3 characters');
  } else if (username.length > 50) {
    errors.push('Username must be less than 50 characters');
  } else if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    errors.push('Username can only contain letters, numbers, hyphens, and underscores');
  }

  if (!password || password.length === 0) {
    errors.push('Password is required');
  } else if (password.length < 6) {
    errors.push('Password must be at least 6 characters');
  } else if (password.length > 128) {
    errors.push('Password must be less than 128 characters');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Sanitize filter inputs
 *
 * @param {Object} filters - Filter object
 * @returns {Object} Sanitized filters
 */
export const sanitizeFilters = (filters) => {
  if (!filters || typeof filters !== 'object') return {};

  const sanitized = {};

  for (const [key, value] of Object.entries(filters)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else if (value instanceof Date) {
      sanitized[key] = value;
    } else if (typeof value === 'number') {
      sanitized[key] = isFinite(value) ? value : 0;
    } else if (typeof value === 'boolean') {
      sanitized[key] = value;
    } else if (Array.isArray(value)) {
      sanitized[key] = value.filter(v => typeof v === 'string').map(sanitizeString);
    }
  }

  return sanitized;
};

/**
 * Validate date range
 *
 * @param {Date|string} startDate - Start date
 * @param {Date|string} endDate - End date
 * @returns {Object} Validation result { valid: boolean, error?: string }
 */
export const validateDateRange = (startDate, endDate) => {
  try {
    const start = startDate instanceof Date ? startDate : new Date(startDate);
    const end = endDate instanceof Date ? endDate : new Date(endDate);

    if (isNaN(start.getTime())) {
      return { valid: false, error: 'Invalid start date' };
    }

    if (isNaN(end.getTime())) {
      return { valid: false, error: 'Invalid end date' };
    }

    if (start > end) {
      return { valid: false, error: 'Start date cannot be after end date' };
    }

    // Check for reasonable date range (not too far in past or future)
    const now = new Date();
    const tenYearsAgo = new Date(now.getFullYear() - 10, 0, 1);
    const oneYearAhead = new Date(now.getFullYear() + 1, 11, 31);

    if (start < tenYearsAgo) {
      return { valid: false, error: 'Start date is too far in the past (max: 10 years ago)' };
    }

    if (end > oneYearAhead) {
      return { valid: false, error: 'End date is too far in the future (max: 1 year ahead)' };
    }

    return { valid: true };
  } catch (error) {
    return { valid: false, error: 'Invalid date format' };
  }
};

export default {
  sanitizeString,
  validateFile,
  validateAnalyticsJSON,
  validateAnalyticsRecord,
  validateCredentials,
  sanitizeFilters,
  validateDateRange,
  MAX_FILE_SIZE,
  ALLOWED_FILE_TYPES,
  REQUIRED_ANALYTICS_FIELDS
};
