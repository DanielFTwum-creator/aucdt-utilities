import { GoogleGenAI } from '@google/genai';

let client: GoogleGenAI | null = null;

function getClient() {
  if (!client) client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
  return client;
}

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
  const ai = getClient();

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

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
    config: { responseMimeType: 'application/json' },
  });

  const raw = JSON.parse(response.text || '{}');
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
