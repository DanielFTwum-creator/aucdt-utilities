// Shared client for the app's server-side Gemini relay (/api/generate), which
// forwards to the central WMS Gemini proxy. The Gemini API key is NOT in this
// bundle — it lives only on the server. Browser code calls generateViaProxy().

interface ProxyConfig {
  responseMimeType?: string;
  responseSchema?: unknown;
  temperature?: number;
  maxOutputTokens?: number;
}

/**
 * Send a generateContent request to the local relay and return the model's text.
 * `prompt` is the user turn; `config` maps to Gemini generationConfig.
 */
export async function generateViaProxy(
  prompt: string,
  model: string,
  config: ProxyConfig = {}
): Promise<string> {
  const body = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      ...(config.responseMimeType ? { responseMimeType: config.responseMimeType } : {}),
      ...(config.responseSchema ? { responseSchema: config.responseSchema } : {}),
      ...(config.temperature != null ? { temperature: config.temperature } : {}),
      ...(config.maxOutputTokens != null ? { maxOutputTokens: config.maxOutputTokens } : {}),
    },
  };

  const res = await fetch(`/youtube-genie/api/generate?model=${encodeURIComponent(model)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Proxy returned ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const text: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (text == null) {
    throw new Error('Empty or invalid response from AI service.');
  }
  return text;
}
