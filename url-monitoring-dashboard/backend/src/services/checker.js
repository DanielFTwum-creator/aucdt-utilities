const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');

const urlsFilePath = path.join(__dirname, '../data/urls.json');
const auditLogPath = path.join(__dirname, '../data/audit-log.json');
const responseLogPath = path.join(__dirname, '../data/response-log.json'); // New log file

// Helper function to write to JSON files
const writeJsonFile = async (filePath, data) => {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
};

// --- NEW: Function to write to the response log ---
const appendToResponseLog = async (logEntry) => {
  let logs = [];
  try {
    const data = await fs.readFile(responseLogPath, 'utf8');
    logs = JSON.parse(data);
  } catch (error) {
    // File doesn't exist, it will be created
  }
  logs.unshift(logEntry); // Add new log to the beginning of the array
  await writeJsonFile(responseLogPath, logs);
};

const checkUrl = async (urlData) => {
  const startTime = Date.now();
  try {
    const response = await axios.get(urlData.url, { timeout: 20000 });
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    const logEntry = {
      url: urlData.url,
      status: 'Up',
      statusCode: response.status,
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString(),
    };
    await appendToResponseLog(logEntry); // Log the successful check

    return { ...urlData, status: 'Up', responseTime: `${responseTime}ms`, lastChecked: new Date().toLocaleString() };
  } catch (error) {
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    const logEntry = {
      url: urlData.url,
      status: 'Down',
      statusCode: error.response ? error.response.status : 'N/A',
      error: error.code || error.message,
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString(),
    };
    await appendToResponseLog(logEntry); // Log the failed check

    return { ...urlData, status: 'Down', responseTime: `${responseTime}ms`, lastChecked: new Date().toLocaleString() };
  }
};

const startUrlChecks = () => {
  setInterval(async () => {
    console.log('Running URL checks...');
    try {
      const data = await fs.readFile(urlsFilePath, 'utf8');
      let urls = JSON.parse(data);

      const checkPromises = urls.map(checkUrl);
      const updatedUrls = await Promise.all(checkPromises);

      await writeJsonFile(urlsFilePath, updatedUrls);
      console.log('URL checks complete.');
    } catch (error) {
      console.error('Error running URL checks:', error);
    }
  }, 60000); // Runs every 60 seconds
};

module.exports = { startUrlChecks };
