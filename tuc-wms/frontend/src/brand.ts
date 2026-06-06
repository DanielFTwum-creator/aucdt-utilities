// TUC brand assets — single source of truth.
// Self-hosted 120px crest (17KB) scaled from the official 5334px original — fast everywhere.
export const TUC_LOGO = '/tuc-crest.png';

// All WMS accounts are @techbridge.edu.gh (FR-AUTH-009), so users enter only the
// username part and the domain is appended automatically — fewer typos.
export const TUC_DOMAIN = '@techbridge.edu.gh';

/** Turn a username or full email into the canonical lowercase @techbridge.edu.gh address. */
export function toTucEmail(input: string): string {
  const v = input.trim().toLowerCase();
  if (!v) return '';
  if (v.includes('@')) return v;            // user typed a full address — accept as-is
  return v + TUC_DOMAIN;
}
