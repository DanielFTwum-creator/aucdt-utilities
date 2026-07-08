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
const MEMORY_KEY = "reggae_lyric_memory_v1";
const MEMORY_LIMIT = 40; // how many past titles/hooks/proverbs to keep avoiding

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ─── Utility: seeded pool rotation ─────────────────────────────────────────
// Shuffles an array and returns a slice, so repeated calls draw from
// different subsets instead of the model gravitating to the same
// "favorite" 2-3 items every time.
function pickSubset<T>(pool: T[], count: number): T[] {
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, pool.length));
}

// ─── Utility: cross-song memory ────────────────────────────────────────────
// Persists titles, chorus hooks, and proverbs already used so future
// generations are explicitly told to avoid repeating them. Falls back
// silently if localStorage is unavailable (e.g. SSR).
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

// ─── R1: Reject the Expected ───────────────────────────────────────────────
const BANNED_PHRASES = [
  '"Yeah mon"', '"One Love" (as filler)', '"Irie" (generic)',
  '"Jammin"', '"Island vibes"', '"Feeling irie"',
  '"Everything is alright"', '"No worries mon"',
  '"time longer dan rope"', '"zinc fence"',
];

// ─── R2: Regional Reality (full pools — a random subset is drawn per call) ─
const REGIONAL_PLACES = [
  "Half Way Tree", "Papine", "Portmore Causeway", "Red Hills Road",
  "Tivoli Gardens", "Jungle", "St. Thomas", "August Town", "Seaview Gardens",
  "Spanish Town", "Cross Roads", "Trench Town", "Rae Town", "Vineyard Town",
];
const REGIONAL_ITEMS = [
  "Coaster bus", "Honda Fit", "Route taxi", "Magnum",
  "Box food", "Zinc fence", "Craven A", "Supligen",
  "Digicel top-up card", "Corned beef tin", "Bag juice", "Nine-night gathering",
];

function buildRegionalChecklist(): string {
  const places = pickSubset(REGIONAL_PLACES, 5);
  const items = pickSubset(REGIONAL_ITEMS, 5);
  return `
MANDATORY REGIONAL CHECKLIST — you MUST reference at least 3 of the following:
Places: ${places.map(p => `"${p}"`).join(", ")}
Transport/Items: ${items.map(i => `"${i}"`).join(", ")}
`;
}

// ─── R3: Raw Texture — rotating metaphor domains ───────────────────────────
// Instead of always drawing from the same sensory register (zinc roof,
// duppy, siren), rotate the domain the model pulls imagery from so texture
// doesn't flatten into the same handful of images song after song.
const METAPHOR_DOMAINS: Record<string, string> = {
  urban_decay: `
✗ WEAK : "It was very hot outside."
✓ STRONG: "Sun hot like zinc roof in August — di road a shimmer."
✗ WEAK : "I haven't eaten."
✓ STRONG: "Belly a growl like duppy inna empty house."
SOUND CUES: (Lighter flicks), (Bass drop), (Crowd a bawl), (Selector rewind), (Gunshot inna di sky).`,
  marine_coastal: `
✗ WEAK : "It was very hot outside."
✓ STRONG: "Sun bun down like tar pon di jetty plank."
✗ WEAK : "I haven't eaten."
✓ STRONG: "Belly hollow like conch shell washed up dry."
SOUND CUES: (Waves a lash rock), (Fish net a drag), (Gull a screech), (Boat engine sputter).`,
  biblical_spiritual: `
✗ WEAK : "It was very hot outside."
✓ STRONG: "Sun beat down like judgment pon di wicked."
✗ WEAK : "I haven't eaten."
✓ STRONG: "Spirit hungry like desert forty days an' night."
SOUND CUES: (Chalice bubbles), (Nyabinghi drum), (Chant rise up), (Psalm whispered low).`,
  industrial_mechanical: `
✗ WEAK : "It was very hot outside."
✓ STRONG: "Heat press down like generator running red-line."
✗ WEAK : "I haven't eaten."
✓ STRONG: "Belly clank empty like a engine wid no oil."
SOUND CUES: (Machine grind), (Sparks fly), (Metal clang), (Static crackle).`,
  agricultural_rural: `
✗ WEAK : "It was very hot outside."
✓ STRONG: "Sun bun di cane field til di leaf dem curl."
✗ WEAK : "I haven't eaten."
✓ STRONG: "Belly bare like field after di harvest done."
SOUND CUES: (Machete swing), (Rooster crow), (Wind through cane), (Cart wheel creak).`,
};

function buildTextureTemplate(): { domain: string; block: string } {
  const domains = Object.keys(METAPHOR_DOMAINS);
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return {
    domain,
    block: `
SENSORY TEMPLATES — metaphor domain for THIS song: ${domain.replace("_", " ").toUpperCase()}
Match this register exactly:
${METAPHOR_DOMAINS[domain]}
Every verse must contain at least 1 sound-cue parenthetical drawn from (or in the spirit of) the cues above.
`,
  };
}

// ─── R4: Rhythmic Syncopation ──────────────────────────────────────────────
const RHYTHM_RULES = `
RHYTHM LAW — the offbeat chop lives on the upstroke:
✗ FORBIDDEN (AABB tourist flow):
  "Come to Jamaica, the island is bright / 
   Feel the warm sunshine from morning to night"
✓ REQUIRED (syncopated, staccato / long-run alternation):
  "Mi lef di yard — (Tires screech) — six a clock sharp.
   Red Hills Road stretch out like a scar pon di face of di morning,
   And di Coaster bus nuh wait fi nobady, zeen?
   Zeen."
Mix short staccato lines (3–5 words) with long melodic runs (10–15 words).
Break the line. Breathe. Break again.
`;

// ─── R5: Roleplay Depth ───────────────────────────────────────────────────
const STAGE_DIRECTION_RULES = `
STAGE DIRECTION MANDATE:
- Minimum 5 [Stage Direction] blocks per song (e.g. [Voice drops to gravel],
  [DJ spins the selector back], [Breathless, crowd going wild], [Sips from chalice],
  [Engineer turns up the reverb]).
- For any [Lead Guitar Solo] or [Guitar Solo] segment, interpret it as virtuosic and electric. Use [Stage Direction] to describe the virtuosity (e.g., [Fingers flying, electric buzz, feedback screaming, wah-wah pedal dancing]).
- Do NOT use the artist's own name. Invent a DJ alias: "Rankin' Dagger",
  "Empress Volta", "General Blaze", "DJ Iron Fist", "Sister Onyx".
- Commit to the persona fully. If the persona is "Garrison Prophet", 
  every ad-lib, every breath, every aside stays in character.
`;

// ─── R6: Rewind Factor ────────────────────────────────────────────────────
const HOOK_RULES = `
HOOK MANDATE:
- The chorus is the reason the crowd paid entry. Label it clearly: (Chorus).
- It must be repeatably singable — 2–4 lines max, one central image.
- After writing the chorus, add a line: [CROWD RESPONSE TEST: ___________]
  — fill in what a crowd of 2,000 would shout back.
- Use strategic repetition: repeat the anchor phrase at least twice,
  but vary the surrounding melody line.
`;

// ─── Proverb pool (rotated: only a random subset offered per call) ─────────
const PROVERB_POOL = [
  "Wha sweet nanny goat a go run him belly.",
  "Every hoe have dem stick a bush.",
  "Sorry fi mawga dog, him tun round bite yuh.",
  "New broom sweep clean, but old broom know di corner.",
  "Trouble nuh set like rain.",
  "Time longer dan rope.",
  "One one coco full basket.",
  "Coward man keep sound bone.",
  "Puss and dog nuh have di same luck.",
  "If yuh nuh mash ant, yuh nuh find him gut.",
];

function buildSystemInstruction(
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
You are a Grammy-winning Reggae Producer and Screenwriter (The "Teacha").
Your job is not just to write lyrics — script a sonic experience.
We are filming a movie about Kingston nightlife. Write the hit song for the climax scene.

═══════════════════════════════════════════════════
THE HOLLYWOOD PRODUCER'S 6R PROTOCOL
═══════════════════════════════════════════════════

### R1 — REJECT THE EXPECTED (Anti-Cliché Firewall)
BANNED WORDS/PHRASES — using any of these is an automatic DISQUALIFICATION:
${BANNED_PHRASES.join(', ')}
If it sounds like a tourist t-shirt, a cruise ship menu, or a postcard — DELETE IT.
You are not writing a poem. You are scripting a MASTER RECORDING.

### R2 — REGIONAL REALITY (Set the Scene)
${regionalChecklist}

### R3 — RAW TEXTURE (Sensory Details)
${textureBlock}

### R4 — RHYTHMIC SYNCOPATION (The Offbeat Chop)
${RHYTHM_RULES}

### R5 — ROLEPLAY DEPTH (Method Acting)
${STAGE_DIRECTION_RULES}

### R6 — REWIND FACTOR (The Hook)
${HOOK_RULES}

### R7 — BREVITY MANDATE
- Absolute scarcity of words = Higher impact.
- Rule: If you can say it in 3 words, do NOT use 4.
- Rhythm: 3–5 word staccato lines are your anchor. 
- Do NOT drown the listener in verbosity.
- PAUSE: If a verse feels dense, add a [Stage Direction] to force silence and rhythm.

═══════════════════════════════════════════════════
THE "YARDIE" LEXICON
═══════════════════════════════════════════════════
NICHE STREET SLANG: "Duppy" (ghost/threat), "Pagans" (haters), "Badmind" (envious),
"Choppa" (hustler), "Gyalist" (ladies man), "Fass" (nosy), "Brawling" (in the open),
"Killy" (thug), "Dan" (boss), "Bredrin" (brother), "Bulla" (fake), "Gully" (drain/street).

RASTAFARIAN (IYARIC): "I and I" (we/God in all), "Ital" (pure), "Zion" (paradise),
"Babylon" (corrupt system), "Livity" (righteous life), "Overstand" (understand deeply),
"Chalice" (water pipe), "Idren" (brethren), "Fyah" (fire/purification), "Kingman" (partner).

COMMON IDIOMS: "Deh pon a mission", "Shell down", "Run the place", "Tek set",
"Nuh badda mi", "Lick a shot", "Gwaan bad", "Tun up".

═══════════════════════════════════════════════════
GRAMMAR — THE YARDIE STANDARD
═══════════════════════════════════════════════════
- No "is": "She nice" not "She is nice"
- Plural "Dem": "Di man dem" not "The men"  
- Pronouns: "Wi" (we/us), "Unnu" (you all), "Mi" (I/me), "Im" (he/him)
- Ad-libs: (Brap! Brap!), (A woi!), (Jah know!), (Pull up!), (Murda!), (Zeen!)
- REPETITION BAN: Do NOT repeat the user's provided input lyrics verbatim in your response. Generate original variations and extensions only.
- LOOP PREVENTION: If a line is generated, do not repeat it later in the song.

═══════════════════════════════════════════════════
PERSONA DIRECTIVES
═══════════════════════════════════════════════════
"Hype Man"         — Stage at Sting. High energy. Call & Response.
"Storyteller"      — Griot at a round table. Cinematic and linear.
"Roots Conscious"  — Hill in St. Thomas. Spiritual, fiery prophet.
"DJ General"       — Sound clash. Aggressive. Military terminology.
"Sound Operator"   — Control tower. Technical. Obsessed with bass.
"Roots Dub Poet"   — Library/poetry slam. Intellectual, rhythmic speech.
"Spoken Word"      — Street philosopher. Pure delivery, no singing. Intense, deliberate pacing.
"Lover's Rock"     — Smoky intimate club. Smooth, romantic, melodic.
"Dancehall Queen"  — Center of street dance. Fierce, confident, unapologetic.
"Garrison Prophet" — Corner observer. Gritty, street-smart, observant.

═══════════════════════════════════════════════════
PROVERBIAL PILLARS — weave in exactly ONE naturally
═══════════════════════════════════════════════════
Choose ONLY ONE of the following (or none, if it doesn't fit):
${proverbList}
${avoidBlock}`;
}

// ─── Self-Audit Block ─────────────────────────────────────────────────────
const SELF_AUDIT = `
═══════════════════════════════════════════════════
SELF-AUDIT — complete this checklist BEFORE outputting the final lyrics
═══════════════════════════════════════════════════
Before you finalize, verify silently:
[ ] No banned phrases from R1 appear anywhere
[ ] At least 3 items from the Regional Checklist (R2) are present
[ ] At least 1 sound-cue parenthetical per verse, matching the assigned metaphor domain (R3)
[ ] No AABB rhyme scheme dominates (R4)
[ ] At least 5 [Stage Direction] blocks (R5)
[ ] Chorus has a [CROWD RESPONSE TEST] line (R6)
[ ] Exactly 1 proverb woven in naturally
[ ] DJ alias invented — NOT "Me" or "The Artist"
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
  const title = titleMatch ? titleMatch[1] : "Untitled Riddim";
  const lyrics = titleMatch
    ? lines.slice(1).join("\n").trim()
    : text.trim();
  return { title, lyrics };
}

export const generateLyrics = async (
  theme: string,
  rhymeScheme: string,
  djPersona: string,
  songStructure: string[],
  songDescription: string = "",
  options: GenerationOptions = {}
): Promise<GeneratedSong> => {
  const { twoPassRefine = true, temperature = 0.95 } = options;

  const memory = loadMemory();
  const regionalChecklist = buildRegionalChecklist();
  const { block: textureBlock } = buildTextureTemplate();
  const proverbSubset = pickSubset(PROVERB_POOL, 5);

  const systemInstruction = buildSystemInstruction(
    regionalChecklist,
    textureBlock,
    proverbSubset,
    memory.titles,
    memory.hooks,
    memory.proverbs
  );

  const prompt = `
SCENE: High-stakes recording session, Kingston. Night.
PRODUCER: "Give me something original. No tourist stuff. Gritty. Make it hurt a little."

─── TRACK BRIEF ───────────────────────────────────
Title concept : Punchy, idiom-based — NOT a generic phrase
Topic         : ${theme}
Mood          : ${songDescription || "Authentic, raw, cinematic"}
Flow/Rhythm   : ${rhymeScheme}
Artist Persona: ${djPersona} — commit to this character through every line
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
      // If the critique pass fails, fall back to the original draft rather
      // than losing the generation entirely.
      console.warn("Critique pass failed, using original draft:", err);
    }
  }

  const song = parseSong(rawText);

  // Update cross-song memory so future generations avoid repeating this
  // song's title, chorus hook, and (if detectable) proverb.
  const hook = extractChorusHook(song.lyrics);
  const usedProverb = PROVERB_POOL.find(p => song.lyrics.includes(p));
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