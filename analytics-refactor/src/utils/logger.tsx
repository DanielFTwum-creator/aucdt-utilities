/**
 * Environment-Aware Logger Utility
 *
 * Provides centralized logging with environment-based levels.
 * In production, only errors are logged. In development, all logs are shown.
 *
 * Features:
 * - Environment-aware logging levels
 * - Structured logging with context
 * - Performance timing utilities
 * - Group logging support
 * - Integration with audit system
 * - Automatic stripping in production builds
 *
 * @module utils/logger
 */

// Determine environment
const isDevelopment = process.env.NODE_ENV === 'development' ||
                      process.env.REACT_APP_DEV_MODE === 'true';

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Log levels
 */
const LogLevel = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  NONE: 4
};

/**
 * Current log level based on environment
 */
const currentLogLevel = isProduction ? LogLevel.ERROR : LogLevel.DEBUG;

/**
 * Log colors for console output (development only)
 */
const LogColors = {
  debug: '#6B7280',    // gray-500
  info: '#3B82F6',     // blue-500
  success: '#10B981',  // green-500
  warn: '#F59E0B',     // amber-500
  error: '#EF4444'     // red-500
};

/**
 * Log icons
 */
const LogIcons = {
  debug: '🔍',
  info: 'ℹ️',
  success: '✅',
  warn: '⚠️',
  error: '❌',
  performance: '⏱️',
  network: '🌐',
  data: '📊',
  user: '👤',
  security: '🔐'
};

/**
 * Format log message with context
 *
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {Object} context - Additional context
 * @returns {Array} Formatted log arguments
 */
const formatMessage = (level, message, context) => {
  const timestamp = new Date().toISOString();
  const icon = LogIcons[level] || '';

  if (isDevelopment && console) {
    const color = LogColors[level] || '#000000';
    const prefix = `%c[${timestamp}] ${icon} ${level.toUpperCase()}`;
    const style = `color: ${color}; font-weight: bold;`;

    if (context) {
      return [prefix, style, message, context];
    }
    return [prefix, style, message];
  }

  // Production: Simple format
  return [`[${level.toUpperCase()}] ${message}`, context].filter(Boolean);
};

/**
 * Logger class
 */
class Logger {
  /**
   * Log debug message (development only)
   *
   * @param {string} message - Debug message
   * @param {Object} context - Additional context
   */
  debug(message, context) {
    if (currentLogLevel <= LogLevel.DEBUG && console.debug) {
      const args = formatMessage('debug', message, context);
      console.debug(...args);
    }
  }

  /**
   * Log info message
   *
   * @param {string} message - Info message
   * @param {Object} context - Additional context
   */
  info(message, context) {
    if (currentLogLevel <= LogLevel.INFO && console.info) {
      const args = formatMessage('info', message, context);
      console.info(...args);
    }
  }

  /**
   * Log success message (development only)
   *
   * @param {string} message - Success message
   * @param {Object} context - Additional context
   */
  success(message, context) {
    if (currentLogLevel <= LogLevel.INFO && console.log) {
      const args = formatMessage('success', message, context);
      console.log(...args);
    }
  }

  /**
   * Log warning message
   *
   * @param {string} message - Warning message
   * @param {Object} context - Additional context
   */
  warn(message, context) {
    if (currentLogLevel <= LogLevel.WARN && console.warn) {
      const args = formatMessage('warn', message, context);
      console.warn(...args);
    }
  }

  /**
   * Log error message (always logged)
   *
   * @param {string} message - Error message
   * @param {Error|Object} error - Error object or context
   */
  error(message, error) {
    if (currentLogLevel <= LogLevel.ERROR && console.error) {
      const args = formatMessage('error', message, error);
      console.error(...args);

      // Log stack trace if available
      if (error && error.stack) {
        console.error('Stack trace:', error.stack);
      }
    }
  }

  /**
   * Log group (development only)
   *
   * @param {string} groupName - Group name
   * @param {Function} callback - Callback function with log statements
   */
  group(groupName, callback) {
    if (isDevelopment && console.group) {
      console.group(groupName);
      try {
        callback();
      } finally {
        console.groupEnd();
      }
    } else if (callback) {
      callback();
    }
  }

  /**
   * Log collapsed group (development only)
   *
   * @param {string} groupName - Group name
   * @param {Function} callback - Callback function with log statements
   */
  groupCollapsed(groupName, callback) {
    if (isDevelopment && console.groupCollapsed) {
      console.groupCollapsed(groupName);
      try {
        callback();
      } finally {
        console.groupEnd();
      }
    } else if (callback) {
      callback();
    }
  }

  /**
   * Log table (development only)
   *
   * @param {Array|Object} data - Data to display as table
   * @param {Array} columns - Columns to display
   */
  table(data, columns) {
    if (isDevelopment && console.table) {
      console.table(data, columns);
    }
  }

  /**
   * Create a performance timer
   *
   * @param {string} label - Timer label
   * @returns {Object} Timer object with end() method
   */
  time(label) {
    const startTime = performance.now();

    return {
      end: () => {
        if (isDevelopment) {
          const duration = (performance.now() - startTime).toFixed(2);
          this.info(`${LogIcons.performance} ${label}: ${duration}ms`);
          return parseFloat(duration);
        }
        return 0;
      }
    };
  }

  /**
   * Log network request
   *
   * @param {string} method - HTTP method
   * @param {string} url - Request URL
   * @param {Object} data - Request data
   */
  network(method, url, data) {
    if (isDevelopment) {
      this.groupCollapsed(`${LogIcons.network} ${method} ${url}`, () => {
        this.debug('Request data:', data);
      });
    }
  }

  /**
   * Log data validation
   *
   * @param {string} operation - Operation name
   * @param {Object} result - Validation result
   */
  validation(operation, result) {
    if (isDevelopment) {
      if (result.valid) {
        this.success(`${LogIcons.data} ${operation}: Valid`, result);
      } else {
        this.warn(`${LogIcons.data} ${operation}: Invalid`, result);
      }
    }
  }

  /**
   * Log user action
   *
   * @param {string} action - Action name
   * @param {Object} context - Action context
   */
  userAction(action, context) {
    if (isDevelopment) {
      this.info(`${LogIcons.user} User action: ${action}`, context);
    }
  }

  /**
   * Log security event
   *
   * @param {string} event - Security event name
   * @param {Object} context - Event context
   */
  security(event, context) {
    // Security events are always logged
    const args = formatMessage('security', `Security: ${event}`, context);
    if (console.warn) {
      console.warn(...args);
    }
  }

  /**
   * Assert condition (development only)
   *
   * @param {boolean} condition - Condition to assert
   * @param {string} message - Error message if assertion fails
   */
  assert(condition, message) {
    if (isDevelopment && console.assert) {
      console.assert(condition, message);
    }
  }

  /**
   * Clear console (development only)
   */
  clear() {
    if (isDevelopment && console.clear) {
      console.clear();
    }
  }
}

// Create singleton logger instance
const logger = new Logger();

export default logger;

/**
 * Convenience methods for direct import
 */
export const {
  debug,
  info,
  success,
  warn,
  error,
  group,
  groupCollapsed,
  table,
  time,
  network,
  validation,
  userAction,
  security,
  assert,
  clear
} = logger;

/**
 * Performance timing decorator
 *
 * @param {Function} fn - Function to measure
 * @param {string} label - Performance label
 * @returns {Function} Wrapped function
 */
export const measurePerformance = (fn, label) => {
  return (...args) => {
    const timer = logger.time(label);
    try {
      const result = fn(...args);

      // Handle promises
      if (result && typeof result.then === 'function') {
        return result.finally(() => timer.end());
      }

      timer.end();
      return result;
    } catch (error) {
      timer.end();
      throw error;
    }
  };
};

/**
 * Create scoped logger
 *
 * @param {string} scope - Logger scope/module name
 * @returns {Logger} Scoped logger
 */
export const createScopedLogger = (scope) => {
  return {
    debug: (message, context) => logger.debug(`[${scope}] ${message}`, context),
    info: (message, context) => logger.info(`[${scope}] ${message}`, context),
    success: (message, context) => logger.success(`[${scope}] ${message}`, context),
    warn: (message, context) => logger.warn(`[${scope}] ${message}`, context),
    error: (message, error) => logger.error(`[${scope}] ${message}`, error),
    time: (label) => logger.time(`[${scope}] ${label}`)
  };
};
