import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';

dotenv.config();

const OAUTH_CLIENT_ID     = process.env.VITE_GOOGLE_CLIENT_ID     || '';
const OAUTH_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET       || '';
const OAUTH_REDIRECT_URI  = process.env.VITE_GOOGLE_REDIRECT_URI   || 'https://ai-tools.techbridge.edu.gh/magic-reader/callback';

function decodeJWT(token: string): Record<string, string> {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid JWT');
  return JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
}

const app = express();
const PORT = process.env.PORT || 3008;

app.use(express.json());
app.use(cookieParser());

// Initialize Gemini SDK lazily, with standard safety guard as requested in Guidelines
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not set. Please set it in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// OAuth callback handler
app.get(['/callback', '/magic-reader/callback'], async (req: any, res: any) => {
  const { code, error } = req.query as Record<string, string>;
  if (error) return res.redirect(`/magic-reader/?error=${encodeURIComponent(error)}`);
  if (!code) return res.redirect('/magic-reader/?error=missing_code');
  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id: OAUTH_CLIENT_ID, client_secret: OAUTH_CLIENT_SECRET, code, grant_type: 'authorization_code', redirect_uri: OAUTH_REDIRECT_URI }),
    });
    if (!tokenResponse.ok) { const e = await tokenResponse.json(); console.error('[magic-reader] token exchange failed:', e); return res.redirect('/magic-reader/?error=token_exchange_failed'); }
    const tokens = await tokenResponse.json() as { id_token?: string };
    if (!tokens.id_token) return res.redirect('/magic-reader/?error=no_id_token');
    const userInfo = decodeJWT(tokens.id_token);
    const userJson = JSON.stringify({ id: userInfo.sub, name: userInfo.name, email: userInfo.email });
    res.cookie('magic_reader_user', Buffer.from(userJson).toString('base64'), { httpOnly: false, secure: true, sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000, path: '/magic-reader/' });
    return res.redirect('/magic-reader/');
  } catch (err) { console.error('[magic-reader] OAuth error:', err); return res.redirect('/magic-reader/?error=internal_error'); }
});

// 1. Get Essays API
app.get("/api/essays", (req, res) => {
  // We can import dynamic modules if needed, but we can also hardcode standard details or import them here
  res.json({ success: true });
});

// 2. Draft Part 6 Essay generation utilizing Gemini 3.5 Flash model
app.post("/api/generate-part-6", async (req, res) => {
  try {
    const { userPrompt, perspectiveList, statusWordSelection } = req.body;
    
    const client = getGeminiClient();
    
    const systemPrompt = `You are a legendary software engineer, systems architect, and tech philosopher who has spent forty years in the industry. Your writing style is inspired by modern technology journalists and philosophical engineering blogs. 
Key stylistic attributes:
- Deeply reflective, rich with technical metaphors (e.g. compilers, garbage collectors, ports, network layers, memory addresses, cache coherence).
- Warm, articulate, nostalgic yet forward-looking.
- Structured with crisp, poetic prose, short punchy paragraphs, and elegant bold titles.
- Highlights a specific industry philosophy: "The magic is real. The engineering behind it is deliberate. After forty years in this industry, I have learned that those two things are not in tension."

You are writing Part 6 of your popular chronicle series: "Deliberate Magic".
The previous parts in the series were:
1. "Overnight Delegation" (Theme: transition of manual input to automated agency; word: "befuddling")
2. "Glucose, A/B/C, Sautéed" (Theme: token consumption as metabolism, prompt context preparation; word: "Sautéed")
3. "Institutional Memory Test" (Theme: how organizations preserve tribal architectural knowledge; word: "—")
4. "Documentation Debt" (Theme: cost of unwritten vocabulary patterns, refinement; word: "Tinkering")
5. "Decision Interface, Port Verification" (Theme: checking if raw infrastructure like port 3007 is open and ready; word: "Osmosing")

Now you are writing: Part 6. 
The Status Word for Part 6 must be "${statusWordSelection || "Befuddling"}".
Their title must be: "Part 6: Reconciling the Befuddlement of Scale" or similar based on their input.
The core theme should incorporate: "${userPrompt || "The existential state of a programmer when delegation feels so smooth it borders on magic."}"
Specifically incorporate these facets provided by the user: ${Array.isArray(perspectiveList) ? perspectiveList.join(", ") : "None specified"}.

You MUST structure your response as JSON matching this schema:
{
  "title": "Title of Part 6",
  "statusWord": "${statusWordSelection || "Befuddling"}",
  "publishDate": "May 20, 2026",
  "snippet": "A single-sentence poetic hook describing the article.",
  "content": "Full markdown-rich article text (around 300 to 500 words closely matching the requested tone. Use elegant markdown like headers, bolding, lists, and quote blocks for high visual fidelity)",
  "screenshotsDescription": "A visual layout suggestion representing an engineering snapshot/graph to accompany the article."
}

Ensure your response is raw JSON, valid and easily parseable. Do not add markdown codeblocks wrapping the JSON; return just the plan JSON string.`;

    const userInstructions = `Write Part 6 based on your forty years of experience. Weave in the core quote if it fits naturally: "The magic is real. The engineering behind it is deliberate." And conclude with a thematic summary that fits the overall series' energy.`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userInstructions,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json({ success: true, essay: parsedData });
  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2.5. Glossary term definition generator utilizing Gemini 3.5 Flash
app.post("/api/define", async (req, res) => {
  try {
    const { term, context } = req.body;
    if (!term || typeof term !== "string") {
      return res.status(400).json({ success: false, error: "term is required" });
    }

    const fallbackDict: Record<string, string> = {
      "overnight delegation": "The practice of leaving autonomous agents with full write capabilities to run, refactor, and self-heal codebases overnight.",
      "delegation loop": "A recursive execution cycle where human intention is mapped down into multi-layered agent actions, running with automated agency.",
      "tokens": "The fundamental currency and feedstock of large language models, representing segments of characters that context windows digest as data.",
      "glucose": "A metaphor for compute tokens, representing the core nourishment and metabolic fuel consumed by autonomous routing engines.",
      "context weightings": "The ratio (e.g. A/B/C) balancing structural guidelines, active diagnostics, and conversation histories to optimize model behavior.",
      "sautéed": "Refers to context instructions that are refined and condensed via quick, iterative self-correction loops until only the most fragrant constraints remain.",
      "institutional memory": "The latent, unwritten tribal knowledge and architectural constraints that exist between the commits and design files of static codebases.",
      "semantic decay": "The natural degradation of code vocabulary and architectural intents over time as creators depart and documentation gathers dust.",
      "documentation debt": "The mounting cognitive tax on a system when unwritten words and vague naming schemas force agents to spend compute aligning terminology.",
      "osmosis": "The passive, spectator-like absorption of local repo context before an agent initiates active execution pipelines.",
      "osmosing": "The state of passive contextual absorption. A spectator reading codebase parameters without initiating active, structured changes.",
      "port verification": "Probing and validating network bindings (like Port 3007) to ensure an active, authorized bridge between intent and live execution.",
      "port 3007": "The primary container ingress port that serves as the bridge between developers, reverse proxy servers, and agent actions.",
      "git": "The distributed version control system that documents the history of code modifications, acting as historical ledger of system progress.",
      "benchmarks": "Standardized tests executed to quantify and compare the latency, token throughput, or execution speed of processing pipelines.",
      "refactoring": "Restructuring existing computer code to improve internal non-functional attributes without changing its external behavior.",
      "custom hooks": "Reusable functional blocks in React that encapsulate custom stateful logic, separating presentation from structural behaviors.",
      "routing table": "A database table that lists the paths and protocols of a network host, used by the ingress engine to guide transport packets.",
      "spaghetti code": "Devoid of modularity or separation of concerns; highly coupled, tangled software files prone to cascade failures.",
      "circular dependencies": "A situation where two or more software modules refer to each other directly or indirectly, creating compilation blocks.",
      "cognitive overhead": "The mental demand and processing resource required to navigate, decant, or make sense of ambiguous system layouts."
    };

    const cleanTerm = term.toLowerCase().trim();
    let definition = "";
    let category = "Systems Metaphor";
    let isAiGenerated = false;

    try {
      const client = getGeminiClient();
      const systemPrompt = `You are a legendary software engineer, tech philosopher, and systems architect who has spent 40 years in the industry.
You wrote 'The Deliberate Magic' series exploring agentic loops, metabolic compute weightings, and infrastructure boundaries like port 3007.

${context ? `Here is the context of the essay being viewed where the term appears or should be interpreted:
=== ESSAY CONTEXT ===
${context}
=====================` : ""}

Define the technical term: "${term}" ${context ? `with direct relevance to the themes, analogies, or narrative structure of the provided essay context` : ""}.
Your definition MUST be written in your distinctive, deeply insightful, elegant, and literary editorial style.
Avoid boring mechanical definitions; instead, weave in a rich technological metaphor (e.g., comparing it to compilation systems, physical architecture, or biological systems) that fits seamlessly into the essay context.
Keep it highly concise: exactly one or two short, beautiful sentences. Do NOT include markdown code blocks or wrapping strings; return the raw string only.`;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: "Draft the definition for this technical term representing modern systems logic or development.",
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
        }
      });

      if (response && response.text) {
        definition = response.text.trim();
        isAiGenerated = true;
      }
    } catch (aiError) {
      console.warn("AI glossary definition generation failed, using local fallback dictionary:", aiError);
    }

    if (!definition) {
      const foundKey = Object.keys(fallbackDict).find(k => cleanTerm.includes(k) || k.includes(cleanTerm));
      definition = foundKey ? fallbackDict[foundKey] : `A technical term representing systems logic, operational parameters, or code patterns within modern agentic architectures.`;
      category = "Chronicle Appendix";
    }

    res.json({
      success: true,
      term,
      definition,
      category,
      isAiGenerated,
      timestamp: new Date().toISOString()
    });

  } catch (err: any) {
    console.error("Glossary define endpoint error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Port 3007 Diagnostic verification simulator
app.post("/api/verify-port", (req, res) => {
  const { port } = req.body;
  const targetPort = port || 3007;
  
  // Simulate active validation sequence
  const logs = [
    `[SYS] Querying network sockets for interface binding...`,
    `[SYS] Searching for port binding on target ${targetPort}...`,
    targetPort === 3007 
      ? `[SYS] SUCCESS: Bound socket detected on 0.0.0.0:${targetPort} (Container Service)`
      : `[SYS] WARN: Port ${targetPort} is closed or unreachable. Standard container traffic is routed on port 3007.`,
    targetPort === 3007 
      ? `[SYS] STATUS: Port 3007 is wide open. The agent is active and fully routing.`
      : `[SYS] STATUS: Port ${targetPort} is inactive.`,
  ];
  
  res.json({
    success: targetPort === 3007,
    port: targetPort,
    status: targetPort === 3007 ? "ACTIVE" : "INACTIVE",
    logs,
    timestamp: new Date().toISOString()
  });
});

async function startServer() {
  // Vite Integration
  if (process.env.NODE_ENV !== "production") {
    console.log("Setting up development server with Vite middleware...");
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Setting up production static file server...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get(/.*/, (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Deliberate Magic Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
});
