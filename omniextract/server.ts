import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI, SchemaType, type ResponseSchema } from '@google/generative-ai';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PORT = Number(process.env.PORT) || 3009;
const GOOGLE_CLIENT_ID     = process.env.VITE_GOOGLE_CLIENT_ID     || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET       || '';
const REDIRECT_URI         = process.env.VITE_GOOGLE_REDIRECT_URI   || 'https://ai-tools.techbridge.edu.gh/omniextract/callback';
const GEMINI_API_KEY       = process.env.GEMINI_API_KEY            || process.env.API_KEY || '';

// Gemini client is server-side only — the key must NEVER reach the browser bundle.
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// JSON schema for the invoice/receipt extraction (moved server-side from the
// former client-side invoiceExtractor.ts).
const invoiceSchema = {
  type: SchemaType.OBJECT,
  properties: {
    isInvoice:    { type: SchemaType.BOOLEAN, description: "Is the document an invoice or receipt? Responds false if it's not." },
    vendorName:   { type: SchemaType.STRING,  description: 'The name of the business issuing the invoice.' },
    customerName: { type: SchemaType.STRING,  description: "The name of the customer. Should be 'N/A' if not present." },
    invoiceId:    { type: SchemaType.STRING,  description: 'The invoice number or ID.' },
    issueDate:    { type: SchemaType.STRING,  description: 'The date the invoice was issued.' },
    lineItems: {
      type: SchemaType.ARRAY,
      description: 'A list of all purchased items or services.',
      items: {
        type: SchemaType.OBJECT,
        properties: {
          quantity:    { type: SchemaType.NUMBER, description: 'The quantity of the item.' },
          description: { type: SchemaType.STRING, description: 'The description of the item.' },
          unitPrice:   { type: SchemaType.NUMBER, description: 'The price per unit (Rate).' },
          total:       { type: SchemaType.NUMBER, description: 'The total price for the line item.' },
        },
        required: ['quantity', 'description', 'unitPrice', 'total'],
      },
    },
    subtotal:   { type: SchemaType.NUMBER, description: 'The total amount before discounts or taxes.' },
    discount:   { type: SchemaType.NUMBER, description: 'The total discount amount applied. 0 if not present.' },
    grandTotal: { type: SchemaType.NUMBER, description: 'The final amount to be paid.' },
  },
  required: ['isInvoice', 'vendorName', 'invoiceId', 'issueDate', 'lineItems', 'subtotal', 'grandTotal'],
};

const SYSTEM_PROMPT = `You are an expert invoice and receipt data extractor. Your task is to accurately pull out the key information according to the provided JSON schema. Pay close attention to line items, totals, and invoice details. If the document does not seem to be an invoice or a receipt, set 'isInvoice' to false and leave other fields blank.`;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  console.warn('[OmniExtract] WARNING: VITE_GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET not set — OAuth will fail');
}

function decodeJWT(token: string): Record<string, string> {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid JWT');
  return JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
}

const app = express();
// Image-based extraction sends base64 page renders, so allow larger bodies.
app.use(express.json({ limit: '25mb' }));
app.use(cookieParser());

// ── OAuth callback — handles both path variants Apache may forward ──
app.get(['/callback', '/omniextract/callback'], async (req, res) => {
  const { code, error } = req.query as Record<string, string>;

  if (error) {
    console.error('[OmniExtract] OAuth error from Google:', error);
    return res.redirect(`/omniextract/?error=${encodeURIComponent(error)}`);
  }

  if (!code) {
    return res.redirect('/omniextract/?error=missing_code');
  }

  try {
    // Exchange auth code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id:     GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        code,
        grant_type:    'authorization_code',
        redirect_uri:  REDIRECT_URI,
      }),
    });

    if (!tokenResponse.ok) {
      const err = await tokenResponse.json();
      console.error('[OmniExtract] Token exchange failed:', err);
      return res.redirect('/omniextract/?error=token_exchange_failed');
    }

    const tokens = await tokenResponse.json() as { id_token?: string; access_token?: string };

    // Decode user info from JWT — no extra round-trip needed
    if (!tokens.id_token) {
      console.error('[OmniExtract] No id_token in response');
      return res.redirect('/omniextract/?error=no_id_token');
    }

    const userInfo = decodeJWT(tokens.id_token);

    const userJson = JSON.stringify({
      id:    userInfo.sub,
      name:  userInfo.name,
      email: userInfo.email,
    });
    
    const b64User = Buffer.from(userJson).toString('base64');

    // Cookie readable by JS so AuthContext can hydrate user on page load
    res.cookie('omniextract_user', b64User, {
      httpOnly: false,
      secure:   true,
      sameSite: 'lax',
      maxAge:   7 * 24 * 60 * 60 * 1000, // 7 days
      path:     '/omniextract/',
    });

    // Fallback parameter for cookie-blocking browsers (Safari/iframes)
    return res.redirect(`/omniextract/?user=${encodeURIComponent(b64User)}`);
  } catch (err) {
    console.error('[OmniExtract] OAuth callback error:', err);
    return res.redirect('/omniextract/?error=internal_error');
  }
});

// ── Health check ──
app.get(['/api/health', '/omniextract/api/health'], (_req, res) => {
  res.json({ ok: true, service: 'omniextract', port: PORT });
});

// ── Invoice extraction proxy ──
// Keeps the Gemini API key server-side. Frontend extracts PDF text/images in
// the browser, then posts them here for AI analysis. Accepts either
// { text } (text-based PDFs) or { imagePart: { inlineData } } (scanned pages).
app.post(['/api/extract', '/omniextract/api/extract'], async (req, res) => {
  if (!GEMINI_API_KEY) {
    return res.status(503).json({ error: 'GEMINI_API_KEY not configured on the server.' });
  }
  try {
    const { text, imagePart } = req.body as {
      text?: string;
      imagePart?: { inlineData: { mimeType: string; data: string } };
    };

    if (!imagePart && !text) {
      return res.status(400).json({ error: 'Provide either text or imagePart.' });
    }

    const parts = imagePart
      ? [{ text: `${SYSTEM_PROMPT} Extract data for the single invoice in the provided image.` }, imagePart]
      : [{ text: `${SYSTEM_PROMPT} Text from PDF: ${text ?? ''}` }];

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: { responseMimeType: 'application/json', responseSchema: invoiceSchema as ResponseSchema },
    });
    const result = await model.generateContent({ contents: [{ role: 'user', parts }] });

    const parsed = JSON.parse((await result.response).text().trim());
    return res.json({ result: parsed });
  } catch (err) {
    console.error('[OmniExtract] extract error:', err);
    return res.status(500).json({ error: 'AI extraction failed.' });
  }
});

// ── Serve SPA — index.html with strict no-cache ──
const distDir = path.join(__dirname, 'dist');

app.use('/omniextract', express.static(distDir, {
  maxAge: '1y',
  immutable: true,
  index: false, // We handle index.html manually to set no-cache
  setHeaders(res, filePath) {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
  },
}));

app.get(['/omniextract', '/omniextract/*path'], (_req, res) => {
  const indexPath = path.join(distDir, 'index.html');
  if (!fs.existsSync(indexPath)) {
    return res.status(404).send('App not built — run pnpm build');
  }
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.sendFile(indexPath);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[OmniExtract] Server listening on http://localhost:${PORT}`);
  console.log(`[OmniExtract] Redirect URI: ${REDIRECT_URI}`);
});
