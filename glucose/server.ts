import express from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const app = express();
app.use(express.json({ limit: '10mb' }));

const client = new GoogleGenAI({
  apiKey: process.env.VITE_GEMINI_API_KEY,
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

app.post(['/api/scan-glucose', '/glucose/api/scan-glucose'], async (req, res) => {
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

    const responseStream = await client.models.generateContentStream({
      model: 'gemini-3.1-pro-preview',
      contents: {
        parts: [
          {
            text: `Role: You are a highly accurate clinical data entry assistant.
Request: Extract all handwritten blood glucose reading logs from the attached photo.
Result: A valid JSON array of objects.
Requirements:
- Each object must map to a row containing these keys: date, fasting, post_breakfast, pre_lunch, post_lunch, pre_dinner, post_dinner.
- Format the date appropriately to MM/DD/YYYY if possible.
- The values are blood glucose measurements in mmol/L. Keep decimals exactly as written.
Rules:
- Leave fields empty (as an empty string "") if there is no reading recorded in that cell.
- Ignore blank rows completely. Only return rows with at least one reading.
Restrictions:
- ONLY output the JSON array. Make sure the output precisely matches the JSON response schema.`,
          },
          {
            inlineData: {
              data: imageData,
              mimeType: mimeType,
            },
          },
        ],
      },
      config: {
        temperature: 0,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              date: { type: Type.STRING },
              fasting: { type: Type.STRING },
              post_breakfast: { type: Type.STRING },
              pre_lunch: { type: Type.STRING },
              post_lunch: { type: Type.STRING },
              pre_dinner: { type: Type.STRING },
              post_dinner: { type: Type.STRING },
            },
            required: ['date'],
          },
        },
      },
    });

    let text = '';
    for await (const chunk of responseStream) {
      if (chunk.text) {
        text += chunk.text;
      }
    }

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
  console.log(`[GLUCOSE-API] Gemini API key configured: ${!!process.env.VITE_GEMINI_API_KEY}`);
});
