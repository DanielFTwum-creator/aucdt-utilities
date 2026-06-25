export interface GeneratedSong {
  title: string;
  lyrics: string;
}

const MAX_RETRIES = 3;
const BACKOFF_MS = 1000;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ─── R1: Reject the Expected ───────────────────────────────────────────────
const BANNED_PHRASES = [
  '"Yeah mon"', '"One Love" (as filler)', '"Irie" (generic)',
  '"Jammin"', '"Island vibes"', '"Feeling irie"',
  '"Everything is alright"', '"No worries mon"',
  '"time longer dan rope"', '"zinc fence"',
];

// ─── R2: Regional Reality ──────────────────────────────────────────────────
const REGIONAL_CHECKLIST = `
MANDATORY REGIONAL CHECKLIST — you MUST reference at least 3 of the following:
Places: "Half Way Tree", "Papine", "Portmore Causeway", "Red Hills Road",
        "Tivoli Gardens", "Jungle", "St. Thomas", "August Town", "Seaview Gardens"
Transport/Items: "Coaster bus", "Honda Fit", "Route taxi", "Magnum",
                 "Box food", "Zinc fence", "Craven A", "Supligen"
`;

// ─── R3: Raw Texture ───────────────────────────────────────────────────────
const TEXTURE_TEMPLATES = `
SENSORY TEMPLATES — match this register exactly:
✗ WEAK : "It was very hot outside."
✓ STRONG: "Sun hot like zinc roof in August — di road a shimmer."
✗ WEAK : "I haven't eaten."
✓ STRONG: "Belly a growl like duppy inna empty house."
✗ WEAK : "The night was tense."
✓ STRONG: "Air thick like before lightning lick — (Siren wails far off)."
SOUND CUES: Every verse must contain at least 1 parenthetical: (Lighter flicks), 
(Bass drop), (Crowd a bawl), (Selector rewind), (Gunshot inna di sky).
`;

// ─── R4: Rhythmic Syncopation ──────────────────────────────────────────────
const RHYTHM_RULES = `
RHYTHM LAW — the skank lives on the off-beat:
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

const SYSTEM_INSTRUCTION = `
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
${REGIONAL_CHECKLIST}

### R3 — RAW TEXTURE (Sensory Details)
${TEXTURE_TEMPLATES}

### R4 — RHYTHMIC SYNCOPATION (The Skank)
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
- "Wha sweet nanny goat a go run him belly."
- "Every hoe have dem stick a bush."
- "Sorry fi mawga dog, him tun round bite yuh."
- "New broom sweep clean, but old broom know di corner."
- "Trouble nuh set like rain."
- "Time longer dan rope."
- "One one coco full basket."
- "Coward man keep sound bone."
- "Puss and dog nuh have di same luck."
- "If yuh nuh mash ant, yuh nuh find him gut."
`;

// ─── Self-Audit Block ─────────────────────────────────────────────────────
const SELF_AUDIT = `
═══════════════════════════════════════════════════
SELF-AUDIT — complete this checklist BEFORE outputting the final lyrics
═══════════════════════════════════════════════════
Before you finalize, verify silently:
[ ] No banned phrases from R1 appear anywhere
[ ] At least 3 items from the Regional Checklist (R2) are present
[ ] At least 1 sound-cue parenthetical per verse (R3)
[ ] No AABB rhyme scheme dominates (R4)
[ ] At least 5 [Stage Direction] blocks (R5)
[ ] Chorus has a [CROWD RESPONSE TEST] line (R6)
[ ] Exactly 1 proverb woven in naturally
[ ] DJ alias invented — NOT "Me" or "The Artist"

If any box is unchecked, revise before outputting.
Do NOT include the checklist in your output — only the final lyrics.
`;

export const generateLyrics = async (
  theme: string,
  rhymeScheme: string,
  djPersona: string,
  songStructure: string[],
  songDescription: string = ""
): Promise<GeneratedSong> => {

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
${REGIONAL_CHECKLIST}

ACTION: Write the master recording now.
${SELF_AUDIT}
`;

  const basePath = window.location.pathname.replace(/\/$/, '') || '';

  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      const response = await fetch(`${basePath}/api/gemini/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          systemInstruction: SYSTEM_INSTRUCTION
        })
      });

      if (!response.ok) {
        throw new Error(`Proxy error: ${response.statusText}`);
      }

      const data = await response.json();
      const text = data.text ?? "";
      
      const lines = text.trim().split("\n");
      const titleMatch = lines[0].match(/"([^"]+)"/);
      const title = titleMatch ? titleMatch[1] : "Untitled Riddim";
      const lyrics = titleMatch
        ? lines.slice(1).join("\n").trim()
        : text.trim();

      return { title, lyrics };
    } catch (err: unknown) {
      if (i === MAX_RETRIES - 1) {
        console.error("API error after max retries:", err);
        throw err;
      }
      await delay(BACKOFF_MS * Math.pow(2, i));
    }
  }

  throw new Error("Lyric generation failed after multiple attempts.");
};