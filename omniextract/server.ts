import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PORT = Number(process.env.PORT) || 3009;
const GOOGLE_CLIENT_ID     = process.env.VITE_GOOGLE_CLIENT_ID     || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET       || '';
const REDIRECT_URI         = process.env.VITE_GOOGLE_REDIRECT_URI   || 'https://ai-tools.techbridge.edu.gh/omniextract/callback';

// Phase 2 migration: OmniExtract no longer calls Gemini directly and no longer
// holds the API key — not even temporarily. All generateContent calls are
// forwarded to WMS /api/gemini/generate, which holds the key server-side and
// relays to Google. The GEMINI_PROXY_KEY is a service credential (not the API key)
// used only to authenticate this server with WMS.
const WMS = process.env.VITE_WMS_BASE ?? 'https://wms.techbridge.edu.gh';

// JSON schema for invoice/receipt extraction sent as part of the Gemini request.
// Type values use the Gemini REST API string format (not SDK enums).
const invoiceSchema = {
  type: 'OBJECT',
  properties: {
    isInvoice:    { type: 'BOOLEAN', description: "Is the document an invoice or receipt? Responds false if it's not." },
    vendorName:   { type: 'STRING',  description: 'The name of the business issuing the invoice.' },
    customerName: { type: 'STRING',  description: "The name of the customer. Should be 'N/A' if not present." },
    invoiceId:    { type: 'STRING',  description: 'The invoice number or ID.' },
    issueDate:    { type: 'STRING',  description: 'The date the invoice was issued.' },
    lineItems: {
      type: 'ARRAY',
      description: 'A list of all purchased items or services.',
      items: {
        type: 'OBJECT',
        properties: {
          quantity:    { type: 'NUMBER', description: 'The quantity of the item.' },
          description: { type: 'STRING', description: 'The description of the item.' },
          unitPrice:   { type: 'NUMBER', description: 'The price per unit (Rate).' },
          total:       { type: 'NUMBER', description: 'The total price for the line item.' },
        },
        required: ['quantity', 'description', 'unitPrice', 'total'],
      },
    },
    subtotal:   { type: 'NUMBER', description: 'The total amount before discounts or taxes.' },
    discount:   { type: 'NUMBER', description: 'The total discount amount applied. 0 if not present.' },
    grandTotal: { type: 'NUMBER', description: 'The final amount to be paid.' },
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
// All AI key handling is inside WMS. Frontend extracts PDF text/images in the
// browser and posts them here. This server builds the Gemini request body and
// forwards it to WMS /api/gemini/generate — the API key never leaves WMS.
// Accepts either { text } (text-based PDFs) or { imagePart: { inlineData } }.
app.post(['/api/extract', '/omniextract/api/extract'], async (req, res) => {
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

    const geminiBody = {
      contents: [{ role: 'user', parts }],
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: invoiceSchema,
      },
    };

    const proxyKey = process.env.GEMINI_PROXY_KEY;
    if (!proxyKey) {
      console.error('[OmniExtract] GEMINI_PROXY_KEY is not set');
      return res.status(503).json({ error: 'Gemini proxy not configured.' });
    }

    const wmsRes = await fetch(`${WMS}/api/gemini/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Gemini-Proxy-Key': proxyKey,
      },
      body: JSON.stringify(geminiBody),
    });

    if (!wmsRes.ok) {
      const errBody = await wmsRes.text();
      console.error(`[OmniExtract] WMS generate failed ${wmsRes.status}: ${errBody}`);
      return res.status(502).json({ error: 'AI extraction failed.' });
    }

    // WMS relays the raw Gemini REST response verbatim.
    const geminiResponse = await wmsRes.json() as {
      candidates?: Array<{ content: { parts: Array<{ text: string }> } }>;
    };

    const rawText = geminiResponse.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!rawText) {
      console.error('[OmniExtract] Empty or unexpected Gemini response:', JSON.stringify(geminiResponse));
      return res.status(502).json({ error: 'AI returned an empty response.' });
    }

    const parsed = JSON.parse(rawText);
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
