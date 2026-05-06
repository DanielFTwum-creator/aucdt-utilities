const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const multer = require('multer');

const router = express.Router();
const dataDir = path.join(__dirname, '../data');
const urlsFilePath = path.join(dataDir, 'urls.json');
const auditLogPath = path.join(dataDir, 'audit-log.json');
const responseLogPath = path.join(dataDir, 'response-log.json'); // Path to the new log

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads/')),
  filename: (req, file, cb) => cb(null, file.originalname),
});
const upload = multer({ storage });

// Helper to read JSON files
const readJsonFile = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') return []; // Return empty array if file doesn't exist
    throw error;
  }
};

// Helper to write JSON files
const writeJsonFile = async (filePath, data) => {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
};

// --- NEW: Endpoint to get response logs ---
router.get('/logs', async (req, res) => {
  try {
    const logs = await readJsonFile(responseLogPath);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching response logs', error: error.message });
  }
});

// Existing endpoints for URLs
router.get('/urls', async (req, res) => {
  const urls = await readJsonFile(urlsFilePath);
  res.json(urls);
});

router.post('/urls/import', upload.single('file'), async (req, res) => {
  const filePath = req.file.path;
  try {
    const data = await fs.readFile(filePath, 'utf8');
    const newUrls = JSON.parse(data);
    await writeJsonFile(urlsFilePath, newUrls);
    await fs.unlink(filePath); // Clean up uploaded file
    res.status(200).json({ message: 'URLs imported successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error processing file', error: error.message });
  }
});

router.get('/urls/export', async (req, res) => {
  res.download(urlsFilePath, 'urls-backup.json');
});

module.exports = router;
