import express from 'express';
import { createServer as createViteServer } from 'vite';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Proxy Route to bypass CORS
  app.post('/api/submit-evaluation', async (req, res) => {
    console.log('Received submission request');
    try {
      const externalResponse = await fetch('https://portal.aucdt.edu.gh/aucdt-dev/sendMail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      });

      const responseText = await externalResponse.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse external response as JSON:', responseText);
        // If external response is not JSON, return it as a string in a JSON object
        // Use 502 Bad Gateway if the upstream service returns invalid data
        return res.status(502).json({
          message: 'External service returned non-JSON response',
          body: responseText.substring(0, 500) // Truncate to avoid huge payloads
        });
      }
      
      if (!externalResponse.ok) {
        return res.status(externalResponse.status).json(data);
      }

      res.json(data);
    } catch (error: any) {
      console.error('Proxy Error:', error);
      res.status(500).json({ message: 'Internal Server Error during proxying', details: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static file serving would go here (not needed for dev preview)
    app.use(express.static('dist'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
