/**
 * Data Import Service
 * 
 * Handles importing analytics data from JSON files exported from phpMyAdmin
 * 
 * Features:
 * - Parse phpMyAdmin JSON export format
 * - Validate data structure
 * - Transform to internal format
 * - Merge with existing data
 * - Handle duplicates
 * - Data validation
 * 
 * Supported formats:
 * - phpMyAdmin JSON export (v5.2.3+)
 * - Custom JSON format
 */

class DataImportService {
  /**
   * Import data from JSON file
   */
  static async importFromJSON(file) {
    console.log('📥 Starting data import from JSON...');
    
    try {
      // Read file
      const fileContent = await this.readFile(file);
      
      // Parse JSON
      const jsonData = JSON.parse(fileContent);
      console.log('✅ JSON parsed successfully');
      
      // Detect format
      const format = this.detectFormat(jsonData);
      console.log(`📋 Detected format: ${format}`);
      
      // Extract data based on format
      let rawData;
      switch (format) {
        case 'phpmyadmin':
          rawData = this.extractPhpMyAdminData(jsonData);
          break;
        case 'custom':
          rawData = this.extractCustomData(jsonData);
          break;
        default:
          throw new Error('Unsupported JSON format');
      }
      
      // Validate data
      const validationResult = this.validateData(rawData);
      if (!validationResult.valid) {
        throw new Error(`Data validation failed: ${validationResult.errors.join(', ')}`);
      }
      
      // Transform to internal format
      const transformedData = this.transformData(rawData);
      
      // Calculate statistics
      const stats = this.calculateImportStats(transformedData);
      
      console.log('✅ Data import successful');
      console.log(`📊 Imported ${stats.recordCount} records`);
      
      return {
        success: true,
        data: transformedData,
        stats,
        format
      };
      
    } catch (error) {
      console.error('❌ Data import failed:', error);
      return {
        success: false,
        error: error.message,
        data: null,
        stats: null
      };
    }
  }
  
  /**
   * Read file as text
   */
  static readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        resolve(e.target.result);
      };
      
      reader.onerror = (e) => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsText(file);
    });
  }
  
  /**
   * Detect JSON format
   */
  static detectFormat(jsonData) {
    // phpMyAdmin format detection
    if (Array.isArray(jsonData) && 
        jsonData.length > 0 && 
        jsonData[0].type === 'header' &&
        jsonData[0].comment?.includes('phpMyAdmin')) {
      return 'phpmyadmin';
    }
    
    // Custom format (array of objects)
    if (Array.isArray(jsonData) && 
        jsonData.length > 0 && 
        jsonData[0].MONTH) {
      return 'custom';
    }
    
    return 'unknown';
  }
  
  /**
   * Extract data from phpMyAdmin JSON export
   */
  static extractPhpMyAdminData(jsonData) {
    // Find the data object
    const dataObject = jsonData.find(item => item.type === 'raw' && item.data);
    
    if (!dataObject || !dataObject.data) {
      throw new Error('No data found in phpMyAdmin export');
    }
    
    return dataObject.data;
  }
  
  /**
   * Extract data from custom JSON format
   */
  static extractCustomData(jsonData) {
    if (!Array.isArray(jsonData)) {
      throw new Error('Custom format must be an array of objects');
    }
    
    return jsonData;
  }
  
  /**
   * Validate imported data
   */
  static validateData(data) {
    const errors = [];
    
    // Check if data is array
    if (!Array.isArray(data)) {
      errors.push('Data must be an array');
      return { valid: false, errors };
    }
    
    // Check if data is not empty
    if (data.length === 0) {
      errors.push('Data array is empty');
      return { valid: false, errors };
    }
    
    // Required fields
    const requiredFields = ['MONTH', 'SIGNUPS', 'APPLICANTS', 'ACCEPTED', 'REGISTERED'];
    
    // Validate each record
    data.forEach((record, index) => {
      // Check required fields
      requiredFields.forEach(field => {
        if (!(field in record)) {
          errors.push(`Record ${index}: Missing required field "${field}"`);
        }
      });
      
      // Validate month format (YYYY-MM)
      if (record.MONTH && !/^\d{4}-\d{2}$/.test(record.MONTH)) {
        errors.push(`Record ${index}: Invalid month format "${record.MONTH}" (expected YYYY-MM)`);
      }
      
      // Validate numeric fields
      const numericFields = ['SIGNUPS', 'APPLICANTS', 'ACCEPTED', 'REJECTED', 'WAITLISTED', 'REGISTERED'];
      numericFields.forEach(field => {
        if (record[field] && isNaN(parseInt(record[field]))) {
          errors.push(`Record ${index}: Invalid numeric value for "${field}"`);
        }
      });
    });
    
    // Check for duplicates
    const months = data.map(r => r.MONTH);
    const duplicates = months.filter((month, index) => months.indexOf(month) !== index);
    if (duplicates.length > 0) {
      errors.push(`Duplicate months found: ${[...new Set(duplicates)].join(', ')}`);
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
  
  /**
   * Transform data to internal format
   */
  static transformData(rawData) {
    return rawData.map(record => ({
      month: record.MONTH,
      signups: parseInt(record.SIGNUPS) || 0,
      applicants: parseInt(record.APPLICANTS) || 0,
      accepted: parseInt(record.ACCEPTED) || 0,
      rejected: parseInt(record.REJECTED) || 0,
      waitlisted: parseInt(record.WAITLISTED) || 0,
      registered: parseInt(record.REGISTERED) || 0
    })).sort((a, b) => a.month.localeCompare(b.month)); // Sort by month ascending
  }
  
  /**
   * Calculate import statistics
   */
  static calculateImportStats(data) {
    const totals = data.reduce((acc, record) => ({
      signups: acc.signups + record.signups,
      applicants: acc.applicants + record.applicants,
      accepted: acc.accepted + record.accepted,
      rejected: acc.rejected + record.rejected,
      waitlisted: acc.waitlisted + record.waitlisted,
      registered: acc.registered + record.registered
    }), {
      signups: 0,
      applicants: 0,
      accepted: 0,
      rejected: 0,
      waitlisted: 0,
      registered: 0
    });
    
    return {
      recordCount: data.length,
      dateRange: {
        start: data[0]?.month,
        end: data[data.length - 1]?.month
      },
      totals,
      conversionRate: totals.signups > 0 
        ? ((totals.applicants / totals.signups) * 100).toFixed(1) 
        : '0.0',
      acceptanceRate: totals.applicants > 0 
        ? ((totals.accepted / totals.applicants) * 100).toFixed(1) 
        : '0.0',
      registrationRate: totals.accepted > 0 
        ? ((totals.registered / totals.accepted) * 100).toFixed(1) 
        : '0.0'
    };
  }
  
  /**
   * Merge imported data with existing data
   */
  static mergeData(existingData, importedData, strategy = 'replace') {
    console.log(`📊 Merging data with strategy: ${strategy}`);
    
    if (strategy === 'replace') {
      // Replace all data with imported data
      return importedData;
    }
    
    if (strategy === 'merge') {
      // Merge imported data, replacing duplicates
      const existingMap = new Map(existingData.map(r => [r.month, r]));
      
      // Update or add imported records
      importedData.forEach(record => {
        existingMap.set(record.month, record);
      });
      
      // Convert back to array and sort
      return Array.from(existingMap.values()).sort((a, b) => 
        a.month.localeCompare(b.month)
      );
    }
    
    if (strategy === 'append') {
      // Append only new months
      const existingMonths = new Set(existingData.map(r => r.month));
      const newRecords = importedData.filter(r => !existingMonths.has(r.month));
      
      return [...existingData, ...newRecords].sort((a, b) => 
        a.month.localeCompare(b.month)
      );
    }
    
    throw new Error(`Unknown merge strategy: ${strategy}`);
  }
  
  /**
   * Export current data to JSON (for backup)
   */
  static exportToJSON(data) {
    const exportData = {
      exportDate: new Date().toISOString(),
      version: '1.0',
      recordCount: data.length,
      data: data.map(record => ({
        MONTH: record.month,
        SIGNUPS: record.signups.toString(),
        APPLICANTS: record.applicants.toString(),
        ACCEPTED: record.accepted.toString(),
        REJECTED: record.rejected.toString(),
        WAITLISTED: record.waitlisted.toString(),
        REGISTERED: record.registered.toString()
      }))
    };
    
    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log('✅ Data exported to JSON');
  }
}

export default DataImportService;
