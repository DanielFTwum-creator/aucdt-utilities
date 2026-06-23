// Relays through the central WMS Gemini proxy (Pattern 11) instead of holding
// a raw Gemini key here. See PATTERNS.md Pattern 11 — the key lives ONLY in
// WMS; this service authenticates with GEMINI_PROXY_KEY, a separate, lower-
// stakes credential. (Previously called @google/genai directly with a
// hardcoded key in deploy.ps1 — the confirmed leak vector for the 22 Jun 2026
// fleet key revocation. Never reintroduce a raw GEMINI_API_KEY here.)
const WMS_GEMINI_URL = process.env.WMS_GEMINI_URL || 'https://wms.techbridge.edu.gh/api/gemini/generate';
const GEMINI_PROXY_KEY = process.env.GEMINI_PROXY_KEY || '';
const GEMINI_MODEL = 'gemini-2.5-flash';

export interface AISignalResult {
  signal: 'buy' | 'sell' | 'hold';
  confidence: number;
  score: number;
  rationale: string;
  keyFactors: string[];
  riskLevel: 'low' | 'medium' | 'high';
  timeHorizon: 'short' | 'medium' | 'long';
}

export async function analyzeStock(
  ticker: string,
  price: number,
  change: number,
  changePercent: number,
  volume: number,
  marketCap: number,
  pe: number | null,
  dayHigh: number,
  dayLow: number,
  fiftyTwoWeekHigh: number,
  fiftyTwoWeekLow: number
): Promise<AISignalResult> {
  if (!GEMINI_PROXY_KEY) {
    throw new Error('GEMINI_PROXY_KEY is not configured on the server.');
  }

  const prompt = `You are a professional stock analyst at a top-tier investment firm. Analyze ${ticker} and provide a structured investment signal.

Current Market Data:
- Ticker: ${ticker}
- Current Price: $${price}
- Day Change: ${change >= 0 ? '+' : ''}$${change.toFixed(2)} (${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%)
- Volume: ${volume.toLocaleString()}
- Market Cap: $${(marketCap / 1e9).toFixed(2)}B
- Day Range: $${dayLow.toFixed(2)} - $${dayHigh.toFixed(2)}
- 52-Week Range: $${fiftyTwoWeekLow.toFixed(2)} - $${fiftyTwoWeekHigh.toFixed(2)}
- P/E Ratio: ${pe !== null ? pe.toFixed(2) : 'N/A'}
- Price vs 52W High: ${(((price - fiftyTwoWeekHigh) / fiftyTwoWeekHigh) * 100).toFixed(1)}%
- Price vs 52W Low: ${(((price - fiftyTwoWeekLow) / fiftyTwoWeekLow) * 100).toFixed(1)}%

Return ONLY a valid JSON object with this exact structure:
{
  "signal": "buy" | "sell" | "hold",
  "confidence": <integer 0-100>,
  "score": <integer 0-100>,
  "rationale": "<2-3 sentence professional analysis>",
  "keyFactors": ["<factor 1>", "<factor 2>", "<factor 3>"],
  "riskLevel": "low" | "medium" | "high",
  "timeHorizon": "short" | "medium" | "long"
}

Rules:
- score ≥ 70 = buy signal; score ≤ 30 = sell signal; 31-69 = hold
- Only mark buy/sell if expected outcome > 0.5% movement
- Consider volume strength, momentum, and valuation
- IMPORTANT: End with the standard disclaimer in rationale`;

  const upstream = await fetch(`${WMS_GEMINI_URL}?model=${encodeURIComponent(GEMINI_MODEL)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Gemini-Proxy-Key': GEMINI_PROXY_KEY },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json' },
    }),
  });

  if (!upstream.ok) {
    throw new Error(`WMS Gemini proxy returned ${upstream.status}: ${await upstream.text()}`);
  }

  const data: any = await upstream.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}';
  const raw = JSON.parse(text);
  return {
    signal: ['buy', 'sell', 'hold'].includes(raw.signal) ? raw.signal : 'hold',
    confidence: Math.max(0, Math.min(100, Number(raw.confidence) || 50)),
    score: Math.max(0, Math.min(100, Number(raw.score) || 50)),
    rationale: String(raw.rationale || 'Analysis unavailable.'),
    keyFactors: Array.isArray(raw.keyFactors) ? raw.keyFactors.slice(0, 5) : [],
    riskLevel: ['low', 'medium', 'high'].includes(raw.riskLevel) ? raw.riskLevel : 'medium',
    timeHorizon: ['short', 'medium', 'long'].includes(raw.timeHorizon) ? raw.timeHorizon : 'short',
  };
}
