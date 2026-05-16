# API Integration Guide — Glucose v1.1.0

---

## Gemini Vision API for Image OCR

The Glucose app uses Google's Gemini 3.1 Pro Vision API to extract glucose readings from handwritten/printed images.

---

## API Selection

### Why Gemini 3.1 Pro?

| Model | Vision | JSON Schema | Stream | Free Tier | Used? |
|-------|--------|------------|--------|-----------|-------|
| **gemini-1.5-flash** | ✅ | ❌ No | ✅ | ✅ | ❌ Not available in free tier |
| **gemini-2.0-flash-exp** | ✅ | ❌ Experimental | ✅ | ✅ | ❌ Experimental |
| **gemini-3.1-pro-preview** | ✅ | ✅ Full support | ✅ | ✅ | ✅ **USED** |

**Selected:** `gemini-3.1-pro-preview`
- Stable production-grade model
- Full JSON schema validation support
- Streaming responses for real-time updates
- Free tier available

---

## Authentication

### API Key Setup

1. **Create project** at https://aistudio.google.com/app/apikey
2. **Generate API key** (no project required for free tier)
3. **Add to .env.local:**
   ```bash
   VITE_GEMINI_API_KEY=your-key-here
   ```
4. **Build and deploy:**
   ```bash
   pnpm run build
   pnpm run deploy
   ```

### Quota Limits (Free Tier)

- **Requests per minute:** 60
- **Requests per day:** 1,500
- **Input tokens per minute:** 1M
- **Characters per request:** ~1M (roughly 10,000 words)

**What we use:** ~1-5 requests per user per day (well within limits)

---

## Request Format

### Basic Structure

```typescript
const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro-preview:generateContentStream?key=${apiKey}`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: { parts: [...] },  // Input
      config: { ... }              // Output configuration
    })
  }
);
```

### Complete Example

```typescript
const scanImage = async (file: File): Promise<Reading[]> => {
  // 1. Convert file to Base64
  const base64 = await fileToBase64(file);
  
  // 2. Build request
  const request = {
    contents: {
      parts: [
        {
          text: `Extract glucose readings from this image. Return as JSON array.
Focus on: date, time, glucose value (mmol/L), meal type (fasting, post-breakfast, etc.)
Only extract clear, legible readings. Skip unclear entries.`
        },
        {
          inlineData: {
            data: base64,
            mimeType: file.type  // e.g., 'image/png'
          }
        }
      ]
    },
    config: {
      temperature: 0,  // Deterministic
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            date: { type: Type.STRING },           // YYYY-MM-DD
            reading_type: { type: Type.STRING },   // fasting, post_breakfast, etc.
            value: { type: Type.NUMBER },          // mmol/L
            confidence: { type: Type.STRING }      // high, medium, low
          },
          required: ['date', 'reading_type', 'value']
        }
      }
    }
  };
  
  // 3. Make request
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro-preview:generateContentStream?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    }
  );
  
  // 4. Stream response
  let fullText = '';
  for await (const chunk of response.body.getReader()) {
    const text = new TextDecoder().decode(chunk.value);
    fullText += text;
  }
  
  // 5. Parse JSON
  const readings = JSON.parse(fullText);
  return readings;
};
```

---

## Request Components

### Contents (Input)

#### Text Prompt

```json
{
  "text": "Extract glucose readings from this handwritten log..."
}
```

**Guidelines:**
- Be specific about what you want to extract
- Include examples of expected output format
- Mention units (mmol/L, mg/dL)
- Specify confidence levels if important

#### Image Data

```json
{
  "inlineData": {
    "data": "base64-encoded-image-string",
    "mimeType": "image/png"  // or image/jpeg, image/webp, image/gif
  }
}
```

**Supported Formats:**
- JPEG
- PNG
- WebP
- GIF

**Size Limits:**
- Maximum 20 MB per request
- Recommended: 100 KB - 5 MB for OCR tasks

### Config (Output Settings)

```json
{
  "temperature": 0,
  "responseMimeType": "application/json",
  "responseSchema": { ... }
}
```

#### Temperature

- **0** = Deterministic (exact same input → exact same output)
- **1.0** = Creative (varies each time)

**For data extraction:** Use `0` (we want consistent results)

#### Response MIME Type

- `application/json` — structured output (required for schema validation)
- `text/plain` — plain text response

**For data extraction:** Use `application/json`

#### Response Schema

Defines the structure of the JSON response:

```json
{
  "type": "ARRAY",
  "items": {
    "type": "OBJECT",
    "properties": {
      "date": {
        "type": "STRING",
        "description": "Date in YYYY-MM-DD format"
      },
      "reading_type": {
        "type": "STRING",
        "description": "Type of reading: fasting, post_breakfast, pre_lunch, post_lunch, pre_dinner, post_dinner",
        "enum": ["fasting", "post_breakfast", "pre_lunch", "post_lunch", "pre_dinner", "post_dinner"]
      },
      "value": {
        "type": "NUMBER",
        "description": "Glucose value in mmol/L"
      },
      "confidence": {
        "type": "STRING",
        "description": "Confidence level",
        "enum": ["high", "medium", "low"]
      }
    },
    "required": ["date", "reading_type", "value"]
  }
}
```

**Schema Types:**
- `STRING` — text
- `NUMBER` — integer or float
- `BOOLEAN` — true/false
- `ARRAY` — list
- `OBJECT` — dictionary/struct
- `ENUM` — restricted values (via `enum` field)

---

## Response Format

### Success Response

```json
[
  {
    "date": "2026-05-16",
    "reading_type": "fasting",
    "value": 7.2,
    "confidence": "high"
  },
  {
    "date": "2026-05-16",
    "reading_type": "post_breakfast",
    "value": 8.5,
    "confidence": "high"
  },
  {
    "date": "2026-05-17",
    "reading_type": "fasting",
    "value": 6.9,
    "confidence": "medium"
  }
]
```

**Always an array** (even if single reading)

### Empty Response

```json
[]
```

When image contains no readable glucose data.

---

## Error Handling

### Network Errors

```typescript
try {
  const response = await fetch(...);
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
} catch (error) {
  if (error.message.includes('NETWORK')) {
    console.error('Network error, try again');
  }
}
```

### Invalid Image

```json
Error response (not JSON):
"Could not process this image. Please ensure image is clear and contains glucose data."
```

**Handling:**
```typescript
try {
  const readings = JSON.parse(responseText);
  // readings is an array (success)
} catch {
  console.error('Could not extract readings from image');
}
```

### Rate Limiting (429)

```
HTTP 429 Too Many Requests
Retry-After: 60
```

**Handling:**
```typescript
if (response.status === 429) {
  const retryAfter = response.headers.get('Retry-After') || '60';
  console.log(`Rate limited. Retrying after ${retryAfter} seconds`);
  await new Promise(r => setTimeout(r, retryAfter * 1000));
  // Retry request
}
```

### Invalid API Key

```
HTTP 403 Forbidden
Error: "API key not valid"
```

**Check:** Verify `VITE_GEMINI_API_KEY` in `.env.local`

---

## Code Integration

### Implementation in App.tsx

```typescript
const scanImage = async (file: File): Promise<void> => {
  setIsScanning(true);
  try {
    // 1. Convert file to Base64
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });

    // 2. Call Gemini API
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('VITE_GEMINI_API_KEY not configured');
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro-preview:generateContentStream?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: {
            parts: [
              {
                text: 'Extract glucose readings from this image...'
              },
              {
                inlineData: {
                  data: base64,
                  mimeType: file.type
                }
              }
            ]
          },
          config: {
            temperature: 0,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.ARRAY,
              items: { ... }
            }
          }
        })
      }
    );

    // 3. Stream and parse response
    let fullText = '';
    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response body');

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      fullText += new TextDecoder().decode(value);
    }

    // 4. Extract JSON from streaming response
    const jsonMatch = fullText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const extractedReadings = JSON.parse(jsonMatch[0]) as ExtractedReading[];

    // 5. Transform and save to IndexedDB
    const readings = extractedReadings.map(r => ({
      id: generateUUID(),
      date: r.date,
      [r.reading_type]: String(r.value),
      createdAt: Date.now(),
      updatedAt: Date.now()
    }));

    await batchUpsertReadings(readings);

    // 6. Update UI
    const updated = await getAllReadings();
    setRows(updated);

  } catch (error) {
    console.error('Scan failed:', error);
    // Show error toast to user
  } finally {
    setIsScanning(false);
  }
};
```

---

## Best Practices

### Prompt Engineering

**❌ Bad:**
```
"Extract glucose readings"
```

**✅ Good:**
```
"Extract glucose readings from this handwritten log image.
Focus on: date (YYYY-MM-DD), meal type, and glucose value in mmol/L.
Return as JSON array with fields: date, reading_type, value, confidence.
Skip any entries that are unclear or partially illegible.
Only include times when meals were eaten (fasting, post-lunch, etc.)."
```

### Error Messages

**❌ Bad:**
```
"API Error"
```

**✅ Good:**
```
if (error.message.includes('INVALID_API_KEY')) {
  showError('API key not configured. Contact administrator.');
} else if (error.message.includes('NETWORK')) {
  showError('Network connection lost. Check your internet.');
} else if (error.message.includes('IMAGE')) {
  showError('Could not read image. Try a clearer photo.');
} else {
  showError('Failed to extract readings. Try again.');
}
```

### Image Quality Guidelines

**Best results:**
- Clear, high-contrast handwriting (black pen on white paper)
- Well-lit photo (no shadows or glare)
- Straight angle (not tilted or skewed)
- Legible numbers (no smudges or crossings)

**Problematic:**
- Faded or light writing
- Colored backgrounds or paper
- Tilted/rotated image
- Multiple pages in one image

---

## Testing & Debugging

### Local Testing

```bash
# 1. Start dev server
pnpm run dev

# 2. Open app in browser
# http://localhost:3010

# 3. Upload test image
# Click "SCAN PHOTO" → select image → wait for extraction

# 4. Check DevTools Console
# Look for API response: right-click → Inspect → Console tab
```

### Debugging API Responses

```typescript
// Log full response for debugging
const fullText = '';
const reader = response.body?.getReader();
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  const chunk = new TextDecoder().decode(value);
  console.log('API chunk:', chunk);  // See streaming response
  fullText += chunk;
}
console.log('Full response:', fullText);
```

### Test Images

Use clear, high-contrast images for best results:
- TUC patient glucose logs (if available)
- Printed glucose monitoring sheets
- Handwritten notes with clear numbers

---

## Rate Limiting & Quotas

### Monitoring Usage

Free tier provides:
- 60 requests per minute
- 1,500 requests per day

**Our usage:** ~1-5 requests per active user per day (easily within limits)

### Exceeding Quota

If you reach limits:
1. Upgrade to paid plan at https://console.cloud.google.com/billing
2. Set billing budget to track costs
3. Monitor usage in API dashboard

**Estimated cost:** $0-5/month (free tier is sufficient for typical usage)

---

## Alternatives (Not Used)

### Why Not OpenAI Vision API?

- Requires paid account ($5+ minimum)
- Less reliable for handwritten text extraction
- Higher latency
- No free tier

### Why Not Cloud Vision API (Google)?

- More expensive ($3.50 per 1K requests)
- Requires setup with service accounts
- No structured JSON output (requires post-processing)
- More complex authentication

**Gemini 3.1 Pro is best balance** of cost, ease, and accuracy.

---

## Support & Issues

### Common Issues

| Issue | Solution |
|-------|----------|
| API key not working | Verify in `.env.local` with correct prefix `VITE_` |
| Rate limiting | Wait 60 seconds, retry. Check quota. |
| Extraction inaccuracy | Improve image quality, adjust prompt |
| Timeout (>30s) | Check network. Try smaller image. |

### Google Support

- **Documentation:** https://ai.google.dev/
- **Forum:** https://groups.google.com/g/google-ai-studio-community
- **Issues:** https://github.com/google-gemini/generative-ai-python/issues

---

*Last updated: May 16, 2026*  
*API integration stable and production-ready*
