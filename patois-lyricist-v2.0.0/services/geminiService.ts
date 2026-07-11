import {
  GenrePack, LanguagePack, Persona,
  getGenrePack, getLanguagePack, getPersona,
} from './lyricistPacks';

export interface GeneratedSong {
  title: string;
  lyrics: string;
}

export interface GenerationOptions {
  /** Runs a second critique+revise pass against the 6R checklist. Costs one extra API call. Default: true. */
  twoPassRefine?: boolean;
  /** Sampling temperature forwarded to the model. Default: 0.95 (favors variety over the single safest completion). */
  temperature?: number;
}

const MAX_RETRIES = 3;
const BACKOFF_MS = 1000;
const MEMORY_KEY = "lyricist_memory_v1";
const MEMORY_LIMIT = 40; // how many past titles/hooks/proverbs to keep avoiding

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ─── Utility: seeded pool rotation ─────────────────────────────────────────
// Shuffles an array and returns a slice, so repeated calls draw from different
// subsets instead of the model gravitating to the same 2-3 items every time.
function pickSubset<T>(pool: T[], count: number): T[] {
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, pool.length));
}

// ─── Utility: cross-song memory ────────────────────────────────────────────
interface SongMemory {
  titles: string[];
  hooks: string[];
  proverbs: string[];
}

function loadMemory(): SongMemory {
  try {
    const raw = window.localStorage.getItem(MEMORY_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // localStorage unavailable — proceed without cross-song memory
  }
  return { titles: [], hooks: [], proverbs: [] };
}

function saveMemory(mem: SongMemory): void {
  try {
    const trimmed: SongMemory = {
      titles: mem.titles.slice(-MEMORY_LIMIT),
      hooks: mem.hooks.slice(-MEMORY_LIMIT),
      proverbs: mem.proverbs.slice(-MEMORY_LIMIT),
    };
    window.localStorage.setItem(MEMORY_KEY, JSON.stringify(trimmed));
  } catch {
    // best-effort only
  }
}

function extractChorusHook(lyrics: string): string | null {
  const match = lyrics.match(/\(Chorus\)[^\n]*\n([^\n]+)/i);
  return match ? match[1].trim() : null;
}

// ─── R2: Regional Reality — draw a random subset from the pack ─────────────
function buildRegionalChecklist(pack: GenrePack): string {
  const places = pickSubset(pack.regionalPlaces, 5);
  const items = pickSubset(pack.regionalItems, 5);
  return `
MANDATORY REGIONAL CHECKLIST — you MUST reference at least 3 of the following:
Places: ${places.map(p => `"${p}"`).join(", ")}
Everyday items: ${items.map(i => `"${i}"`).join(", ")}
`;
}

// ─── R3: Raw Texture — rotate the pack's sensory registers ─────────────────
function buildTextureTemplate(pack: GenrePack): { domain: string; block: string } {
  const domains = Object.keys(pack.metaphorDomains);
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return {
    domain,
    block: `
SENSORY TEMPLATE — metaphor domain for THIS song: ${domain.replace(/_/g, " ").toUpperCase()}
Match this register exactly:
${pack.metaphorDomains[domain]}
Every verse must contain at least 1 sound-cue parenthetical drawn from (or in the spirit of) the cues above.
`,
  };
}

// ─── Shared brevity mandate (genre-agnostic) ───────────────────────────────
const BREVITY_MANDATE = `
- Absolute scarcity of words = higher impact. If you can say it in 3 words, do NOT use 4.
- Anchor on short staccato lines (3–5 words); release into longer melodic runs.
- Do NOT drown the listener in verbosity. If a verse feels dense, add a [Stage Direction] to force silence and rhythm.
`;

function buildSystemInstruction(
  pack: GenrePack,
  language: LanguagePack,
  persona: Persona,
  regionalChecklist: string,
  textureBlock: string,
  proverbSubset: string[],
  avoidTitles: string[],
  avoidHooks: string[],
  avoidProverbs: string[]
): string {
  const availableProverbs = proverbSubset.filter(p => !avoidProverbs.includes(p));
  const proverbList = (availableProverbs.length > 0 ? availableProverbs : proverbSubset)
    .map(p => `- "${p}"`)
    .join("\n");

  const avoidBlock = (avoidTitles.length || avoidHooks.length)
    ? `
═══════════════════════════════════════════════════
ALREADY USED — DO NOT REPEAT (from prior songs in this catalog)
═══════════════════════════════════════════════════
Titles already used, do NOT reuse or closely paraphrase: ${avoidTitles.length ? avoidTitles.join(" | ") : "(none yet)"}
Chorus hooks already used, do NOT reuse or closely paraphrase: ${avoidHooks.length ? avoidHooks.join(" | ") : "(none yet)"}
`
    : "";

  return `
${pack.producerFraming}
Your job is not just to write lyrics — script a sonic experience worthy of a master recording.

═══════════════════════════════════════════════════
THE PRODUCER'S 6R PROTOCOL (${pack.label})
═══════════════════════════════════════════════════

### R1 — REJECT THE EXPECTED (Anti-Cliché Firewall)
BANNED — using any of these is an automatic DISQUALIFICATION:
${pack.bannedPhrases.join(', ')}
If it sounds like a tourist postcard or a stereotype, DELETE IT.

### R2 — REGIONAL REALITY (Set the Scene)
${regionalChecklist}

### R3 — RAW TEXTURE (Sensory Details)
${textureBlock}

### R4 — RHYTHM & FLOW
${pack.rhythmRules}

### R5 — ROLEPLAY DEPTH (Method Acting)
${pack.stageRules}
PERSONA — perform this archetype fully, ${persona.lineage} (honour the lineage; do NOT imitate or name the real artist):
"${persona.label}" — ${persona.direction}

### R6 — REWIND FACTOR (The Hook)
${pack.hookNote}
- Label the chorus clearly: (Chorus). After it, add a line: [CROWD RESPONSE TEST: ___________] — what 2,000 people would shout back.

### R7 — BREVITY MANDATE
${BREVITY_MANDATE}

═══════════════════════════════════════════════════
LEXICON & IMAGERY
═══════════════════════════════════════════════════
${pack.lexicon}

═══════════════════════════════════════════════════
DICTION
═══════════════════════════════════════════════════
${pack.grammar}
LANGUAGE SETTING: ${language.label} — ${language.dictionGuidance}
- REPETITION BAN: do NOT repeat the user's provided input lyrics verbatim; generate original variations only.
- LOOP PREVENTION: do not repeat a generated line later in the song.

═══════════════════════════════════════════════════
PROVERBIAL PILLARS — weave in exactly ONE naturally
═══════════════════════════════════════════════════
Choose ONLY ONE of the following (or none, if it doesn't fit):
${proverbList}
${avoidBlock}`;
}

// ─── Self-Audit Block (genre-agnostic) ─────────────────────────────────────
const SELF_AUDIT = `
═══════════════════════════════════════════════════
SELF-AUDIT — complete this checklist BEFORE outputting the final lyrics
═══════════════════════════════════════════════════
Before you finalize, verify silently:
[ ] No banned phrases from R1 appear anywhere
[ ] At least 3 items from the Regional Checklist (R2) are present
[ ] At least 1 sound-cue parenthetical per verse, matching the assigned metaphor domain (R3)
[ ] The flow follows R4 — no nursery-rhyme AABB dominating
[ ] At least 4 [Stage Direction] blocks, fully in the chosen persona (R5)
[ ] Chorus is labelled (Chorus) and has a [CROWD RESPONSE TEST] line (R6)
[ ] Exactly 1 proverb woven in naturally
[ ] A character/alias is used — NOT "Me" or "The Artist" — and the real artist is never named
[ ] Title and chorus hook do NOT closely match anything in the "ALREADY USED" list

If any box is unchecked, revise before outputting.
Do NOT include the checklist in your output — only the final lyrics.
`;

// ─── Critique + revise pass (two-pass refinement) ──────────────────────────
const CRITIQUE_INSTRUCTION = `
You are now the Executive Producer reviewing a draft against the 6R Protocol.
Grade the draft strictly against R1–R7. For anything that is generic, cliché,
under-textured, or repeats a banned phrase, REWRITE that section — do not just
flag it. Preserve everything that already scores well. Output ONLY the final,
revised lyrics in the same format as the draft (Title on line 1 in quotes,
then the full song). Do not include your grading notes in the output.
`;

async function callGeminiProxy(
  prompt: string,
  systemInstruction: string,
  temperature: number
): Promise<string> {
  const basePath = window.location.pathname.replace(/\/$/, '') || '';

  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      const response = await fetch(`${basePath}/api/gemini/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, systemInstruction, temperature })
      });

      if (!response.ok) {
        throw new Error(`Proxy error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.text ?? "";
    } catch (err: unknown) {
      if (i === MAX_RETRIES - 1) {
        console.error("API error after max retries:", err);
        throw err;
      }
      await delay(BACKOFF_MS * Math.pow(2, i));
    }
  }
  throw new Error("Lyric generation failed after multiple attempts.");
}

function parseSong(text: string): GeneratedSong {
  const lines = text.trim().split("\n");
  const titleMatch = lines[0].match(/"([^"]+)"/);
  const title = titleMatch ? titleMatch[1] : "Untitled";
  const lyrics = titleMatch
    ? lines.slice(1).join("\n").trim()
    : text.trim();
  return { title, lyrics };
}

export const generateLyrics = async (
  theme: string,
  rhymeScheme: string,
  genreId: string,
  languageId: string,
  personaId: string,
  songStructure: string[],
  songDescription: string = "",
  options: GenerationOptions = {}
): Promise<GeneratedSong> => {
  const { twoPassRefine = true, temperature = 0.95 } = options;

  const pack = getGenrePack(genreId);
  const language = getLanguagePack(languageId);
  const persona = getPersona(genreId, personaId);

  const memory = loadMemory();
  const regionalChecklist = buildRegionalChecklist(pack);
  const { block: textureBlock } = buildTextureTemplate(pack);
  const proverbSubset = pickSubset(pack.proverbs, 5);

  const systemInstruction = buildSystemInstruction(
    pack, language, persona,
    regionalChecklist, textureBlock, proverbSubset,
    memory.titles, memory.hooks, memory.proverbs
  );

  const prompt = `
${pack.sceneFraming}
PRODUCER: "Give me something original. No tourist stuff, no stereotype. Make it hit."

─── TRACK BRIEF ───────────────────────────────────
Genre         : ${pack.label}
Title concept : Punchy, idiom-based — NOT a generic phrase
Topic         : ${theme}
Mood          : ${songDescription || "Authentic, raw, cinematic"}
Flow/Rhythm   : ${rhymeScheme}
Persona       : "${persona.label}" (${persona.lineage}) — commit to this character through every line
Structure     : ${songStructure.join(' → ')}

─── FORMAT ────────────────────────────────────────
Line 1        : "Title" (in quotes, idiom-based)
[Brackets]    : Stage directions / vocal cues
(Parentheses) : Ad-libs and sound effects
Section labels: (Verse 1), (Chorus), (Bridge), etc.

─── REGIONAL OBLIGATION ───────────────────────────
${regionalChecklist}

ACTION: Write the master recording now.
${SELF_AUDIT}
`;

  let rawText = await callGeminiProxy(prompt, systemInstruction, temperature);

  if (twoPassRefine) {
    const critiquePrompt = `
DRAFT LYRICS TO REVIEW:
${rawText}

${CRITIQUE_INSTRUCTION}
`;
    try {
      const revised = await callGeminiProxy(critiquePrompt, systemInstruction, Math.max(0.3, temperature - 0.3));
      if (revised.trim().length > 0) {
        rawText = revised;
      }
    } catch (err) {
      console.warn("Critique pass failed, using original draft:", err);
    }
  }

  const song = parseSong(rawText);

  const hook = extractChorusHook(song.lyrics);
  const usedProverb = pack.proverbs.find(p => song.lyrics.includes(p));
  saveMemory({
    titles: [...memory.titles, song.title],
    hooks: hook ? [...memory.hooks, hook] : memory.hooks,
    proverbs: usedProverb ? [...memory.proverbs, usedProverb] : memory.proverbs,
  });

  return song;
};

// ─── Optional: expose memory controls for a settings/debug UI ─────────────
export const clearLyricMemory = (): void => {
  try {
    window.localStorage.removeItem(MEMORY_KEY);
  } catch {
    // no-op
  }
};

export const getLyricMemory = (): SongMemory => loadMemory();
