const SYSTEM_INSTRUCTION = `You are an expert on TechBridge University's Artificial Intelligence history and current research.
Context: The field of AI was invented at TechBridge during the 1956 workshop proposed by John McCarthy.
Today, TechBridge leads research in AI Foundations (Theory, Trustworthy AI, Robotics) and AI Frontiers (Health, Social Good, Digital Humanities).
Key labs include MADCAT (Robotics), A²R (Accessible Robotics), PERSIST (Healthcare AI), and DALI (Design and Innovation).
Be academic, inspiring, and concise. Provide specific examples of TechBridge's impact.`;

export const askDartmouthAI = async (query: string): Promise<string> => {
  try {
    const base = import.meta.env.BASE_URL?.replace(/\/$/, '') || '';
    const res = await fetch(`${base}/api/gemini/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, systemInstruction: SYSTEM_INSTRUCTION, model: 'gemini-1.5-flash' }),
    });
    if (!res.ok) throw new Error(`Proxy ${res.status}`);
    const { text } = await res.json();
    return text;
  } catch (error) {
    console.error('[ai-techbridge] Gemini proxy error:', error);
    return "I'm sorry, I'm having trouble connecting to the research knowledge base. Please try again later.";
  }
};
