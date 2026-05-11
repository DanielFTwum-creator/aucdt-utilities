const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { name, version } = require('../package.json');

// Create necessary directories if they don't exist
const dataDir = path.join(__dirname, 'data');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

const apiRoutes = require('./api/routes');
const { startUrlChecks } = require('./services/checker');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// --- Backend Homepage Route (with Link to Dashboard) ---
app.get('/', (req, res) => {
  const initialUptimeSeconds = process.uptime();

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>API Status</title>
      <style>
        body { font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8f8f8; color: #333; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
        .container { text-align: center; background: white; padding: 40px 50px; border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); border-top: 5px solid #5a0001; }
        h1 { color: #5a0001; margin-top: 0; font-size: 2em; }
        .status { display: inline-block; background-color: #28a745; color: white; padding: 10px 20px; border-radius: 20px; font-weight: 600; margin: 20px 0; }
        p { margin: 10px 0; font-size: 1.1em; }
        code { background: #eee; padding: 2px 6px; border-radius: 4px; }
        footer { margin-top: 30px; font-size: 0.9em; color: #888; }
        
        /* --- NEW: Style for the Dashboard Link Button --- */
        .dashboard-link {
          display: inline-block;
          text-decoration: none;
          background-color: #5a0001;
          color: white;
          padding: 12px 25px;
          border-radius: 5px;
          font-weight: 600;
          margin-top: 25px;
          transition: all 0.3s ease;
        }
        .dashboard-link:hover {
          background-color: #fecb00;
          color: #5a0001;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
      </style>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&display=swap" rel="stylesheet">
    </head>
    <body>
      <div class="container">
        <h1>URL Monitoring Dashboard API</h1>
        <div class="status">OPERATIONAL</div>
        <p>The API service is running correctly.</p>
        <p id="uptime">Server Uptime: Loading...</p>
        
        <!-- NEW: Link to the Frontend Dashboard -->
        <a href="http://localhost:3000" class="dashboard-link" target="_blank">Go to Dashboard</a>

        <footer>
          <p>Service: <code>${name}</code> | Version: <code>${version}</code></p>
        </footer>
      </div>

      <script>
        const uptimeElement = document.getElementById('uptime' );
        let uptimeSeconds = ${initialUptimeSeconds};
        function formatUptime() {
          const h = Math.floor(uptimeSeconds / 3600);
          const m = Math.floor((uptimeSeconds % 3600) / 60);
          const s = Math.floor(uptimeSeconds % 60);
          uptimeElement.textContent = \`Server Uptime: \${h}h \${m}m \${s}s\`;
        }
        setInterval(() => {
          uptimeSeconds++;
          formatUptime();
        }, 1000);
        formatUptime();
      </script>
    </body>
    </html>
  `;
  res.send(html);
});

app.use('/api', apiRoutes);

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}` );
  startUrlChecks();
});
