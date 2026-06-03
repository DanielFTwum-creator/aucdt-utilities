// Audio generation runs on the backend (/api/groove) so the GEMINI_API_KEY is
// never bundled into the browser. This module builds the prompt client-side
// and posts it to the proxy.

// ─── Constants ────────────────────────────────────────────────────────────────

const DEFAULT_BPM = 160;
const BPM_MIN = 40;
const BPM_MAX = 300;
const DEFAULT_MIME = "audio/wav" as const;
const TARGET_DURATION_SECONDS = 120 as const; // 2 minutes
const NO_VOCALS_CLAUSE = "purely instrumental — absolutely no vocals, no voice, no singing, no spoken word, no rap, no chanting" as const;

// ─── Types ────────────────────────────────────────────────────────────────────

export type GrooveStyle =
  | "afrobeats"
  | "reggae-dancehall"
  | "highlife"
  | "electronic"
  | "jazz-funk"
  | "neosoul"
  | "hip-hop-trap";

export interface GrooveOptions {
  /** Beats per minute. Clamped to [40–300]. Defaults to 160. */
  bpm?: number;
  /**
   * Musical style / cultural origin of the groove.
   * When omitted, the model draws freely from a globally inclusive palette.
   */
  style?: GrooveStyle;
  /** Optional AbortSignal for cancellation support. */
  signal?: AbortSignal;
}

export interface GrooveResult {
  /** Revocable object URL pointing to the decoded audio Blob. */
  url: string;
  /** Base64 encoded audio data. */
  base64: string;
  /** MIME type reported by the model (e.g. "audio/wav"). */
  mimeType: string;
  /**
   * Call this when the audio is no longer needed to free memory.
   * Equivalent to URL.revokeObjectURL(url).
   */
  revoke: () => void;
}

// ─── Prompt map ───────────────────────────────────────────────────────────────

const STYLE_DESCRIPTORS: Record<GrooveStyle, string> = {
  "afrobeats":        "Afrobeats / Afropop — syncopated percussion, talking-drum patterns, bright guitar skank, West African polyrhythm",
  "reggae-dancehall": "Reggae / Dancehall / Riddim — heavy one-drop or steppers kick, skanking offbeat guitar, deep sub-bass, Jamaican riddim feel",
  "highlife":         "Ghanaian Highlife / Afro-fusion — rolling guitar melodies, clave-driven rhythm section, brass stabs, joyful swing",
  "electronic":       "Electronic / House / Techno — four-on-the-floor kick, synth bassline, hi-hat rolls, evolving filter movement",
  "jazz-funk":        "Jazz-Funk / Soul — swung hi-hats, tight snare ghost notes, walking or slap bass, brass-section punctuation",
  "neosoul":          "Classic Neo Soul — warm Rhodes electric piano, smooth chord extensions, slow-burning pocket groove, lush string pads, subtle wah guitar, and a deep laid-back feel in the tradition of D'Angelo, Erykah Badu, and Musiq Soulchild",
  "hip-hop-trap":     "Hip-Hop / Trap — 808 sub-kick, triplet hi-hat rolls, snappy snare, atmospheric pads",
};

const INCLUSIVE_DEFAULT =
  "drawing freely from a globally inclusive palette of styles — " +
  "Afrobeats, Reggae/Dancehall, Ghanaian Highlife, Electronic/House, " +
  "Jazz-Funk, Classic Neo Soul, and Hip-Hop/Trap — honouring the rhythmic traditions of " +
  "West Africa, the Caribbean, and the African diaspora";

const DYNAMIC_VARIATION =
  "Build in natural dynamic variation: start with a foundation groove, " +
  "introduce fills and instrumental layers in the mid-section, " +
  "and resolve with a satisfying rhythmic conclusion. " +
  "Avoid static, loop-like repetition throughout.";

/**
 * Constructs a culturally inclusive, dynamically varied generation prompt.
 */
function buildGroovePrompt(bpm: number, style?: GrooveStyle): string {
  const styleClause = style
    ? `in the style of ${STYLE_DESCRIPTORS[style]}`
    : INCLUSIVE_DEFAULT;

  return (
    `Generate a ${TARGET_DURATION_SECONDS}-second (2-minute), ${bpm} BPM groove ${styleClause}. ` +
    `The track must be ${NO_VOCALS_CLAUSE}. ` +
    `${DYNAMIC_VARIATION}`
  );
}

/**
 * Validates and clamps BPM to a musically sensible range.
 */
function sanitiseBpm(bpm: number): number {
  if (!Number.isFinite(bpm) || bpm <= 0) {
    throw new RangeError(`BPM must be a positive finite number. Received: ${bpm}`);
  }
  return Math.round(Math.min(BPM_MAX, Math.max(BPM_MIN, bpm)));
}

/**
 * Decodes a base64 string into a Uint8Array.
 * Works in both browser (atob) and Node.js (Buffer) environments.
 */
function base64ToBytes(base64: string): Uint8Array {
  if (typeof Buffer !== "undefined") {
    // Node.js / server-side rendering
    return new Uint8Array(Buffer.from(base64, "base64"));
  }
  if (typeof atob !== "undefined") {
    // Browser
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }
  throw new Error("No base64 decoder available in this environment.");
}

/**
 * Assembles streamed base64 audio chunks into a revocable Blob URL.
 */
function buildBlobUrl(base64: string, mimeType: string): GrooveResult {
  if (!base64) {
    throw new Error("No audio data received from the model.");
  }
  const bytes = base64ToBytes(base64);
  const blob = new Blob([bytes], { type: mimeType });
  const url = URL.createObjectURL(blob);
  return {
    url,
    base64,
    mimeType,
    revoke: () => URL.revokeObjectURL(url),
  };
}

// ─── Core API ─────────────────────────────────────────────────────────────────

/**
 * Streams audio data from Gemini as a base64 string.
 */
async function streamGroove(
  safeBpm: number,
  style?: GrooveStyle,
  signal?: AbortSignal
): Promise<{ base64: string; mimeType: string }> {
  try {
    const res = await fetch(`${import.meta.env.BASE_URL}api/groove`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: buildGroovePrompt(safeBpm, style) }),
      signal,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Groove request failed (${res.status})`);
    }
    const { base64, mimeType } = await res.json();
    return { base64, mimeType: mimeType || DEFAULT_MIME };
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") throw err;
    throw new Error(
      `Groove generation failed: ${err instanceof Error ? err.message : String(err)}`
    );
  }
}

/**
 * Generates an audio groove via the Gemini Lyria model and returns a
 * playable, memory-managed Blob URL.
 *
 * @example
 * const groove = await generateGroove({ bpm: 120 });
 * audioEl.src = groove.url;
 * audioEl.onended = groove.revoke; // clean up when done
 */
export async function generateGroove(
  options: GrooveOptions = {}
): Promise<GrooveResult> {
  const { bpm = DEFAULT_BPM, style, signal } = options;

  // ── Validate inputs ──────────────────────────────────────────────────────
  const safeBpm = sanitiseBpm(bpm);

  // ── Stream audio from Gemini ─────────────────────────────────────────────
  const { base64, mimeType } = await streamGroove(safeBpm, style, signal);

  // ── Decode & return ──────────────────────────────────────────────────────
  return buildBlobUrl(base64, mimeType);
}
