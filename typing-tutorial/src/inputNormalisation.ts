/**
 * Normalisation applied to everything the student types, before matching.
 *
 * OS and browser "smart punctuation" (Windows text suggestions, Grammarly-style
 * extensions, mobile keyboards) silently rewrite plain keystrokes: "-" becomes
 * an em-dash, straight quotes become curly quotes. The student pressed the
 * right key, so the tutor must judge the keystroke, not the autocorrection.
 * Observed live on 3 Jul 2026: a typed hyphen arrived as U+2014 and failed the
 * Ultimate Drill (TUC-ICT-FIX-2026-VTX-HYPHEN follow-up).
 */
export const SMART_PUNCTUATION: Record<string, string> = {
  "—": "-", // em dash
  "–": "-", // en dash
  "−": "-", // minus sign
  "‒": "-", // figure dash
  "―": "-", // horizontal bar
  "‘": "'", // left single curly quote
  "’": "'", // right single curly quote / apostrophe
  "‚": "'", // single low quote
  "“": '"', // left double curly quote
  "”": '"', // right double curly quote
  "„": '"', // double low quote
  "\u00A0": " ", // no-break space
};

/**
 * Normalise a typed string: undo smart punctuation, then apply the lesson's
 * own key substitutions (e.g. the Ghanaian-language map, 3 -> ɛ).
 * Characters typed natively from special keyboard layouts pass through.
 */
export function normaliseTypedInput(raw: string, inputMap?: Record<string, string>): string {
  return raw
    .split("")
    .map((c) => {
      const straight = SMART_PUNCTUATION[c] ?? c;
      return inputMap?.[straight] ?? straight;
    })
    .join("");
}
