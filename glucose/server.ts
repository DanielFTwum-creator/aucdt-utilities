import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const app = express();
app.use(express.json({ limit: '10mb' }));

const client = new Anthropic({
  apiKey: process.env.VITE_ANTHROPIC_API_KEY,
});

interface ScanRequest {
  imageData: string;
  mimeType: string;
}

interface ReadingData {
  date: string;
  fasting: string;
  post_breakfast: string;
  pre_lunch: string;
  post_lunch: string;
  pre_dinner: string;
  post_dinner: string;
}

app.post('/api/scan-glucose', async (req, res) => {
  console.log('[SCAN-API] Received POST request');
  console.log('[SCAN-API] Content-Type:', req.get('content-type'));
  console.log('[SCAN-API] Body size:', JSON.stringify(req.body).length, 'bytes');

  try {
    const { imageData, mimeType } = req.body as ScanRequest;

    if (!imageData || !mimeType) {
      console.error('[SCAN-API] Missing required fields');
      return res.status(400).json({ error: 'Missing imageData or mimeType' });
    }

    console.log('[SCAN-API] Processing image, size:', imageData.length, 'chars');

    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mimeType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
                data: imageData,
              },
            },
            {
              type: 'text',
              text: `Extract all handwritten blood glucose readings from this image.
Return ONLY a JSON array with no markdown formatting.
Each object: {date: "MM/DD/YYYY", fasting: "X.X", post_breakfast: "X.X", pre_lunch: "X.X", post_lunch: "X.X", pre_dinner: "X.X", post_dinner: "X.X"}
Empty fields as "". Include only rows with at least one reading. Values in mmol/L.`,
            },
          ],
        },
      ],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    console.log('[SCAN-API] Response received, length:', text.length);

    if (!text.trim()) {
      return res.status(400).json({ error: 'No data extracted from image' });
    }

    const cleanText = text.replace(/```json\n?/gi, '').replace(/```/g, '').trim();
    const readings: ReadingData[] = JSON.parse(cleanText);

    if (!readings || readings.length === 0) {
      return res.status(400).json({ error: 'No readings found in image' });
    }

    console.log('[SCAN-API] Extracted', readings.length, 'readings');
    res.json({ success: true, readings });
  } catch (error) {
    console.error('[SCAN-API] Error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : '';
    console.error('[SCAN-API] Stack:', errorStack);
    res.status(500).json({
      error: 'Failed to process image',
      details: errorMessage,
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[GLUCOSE-API] Server running on http://0.0.0.0:${PORT}`);
  console.log(`[GLUCOSE-API] Claude API key configured: ${!!process.env.VITE_ANTHROPIC_API_KEY}`);
});
