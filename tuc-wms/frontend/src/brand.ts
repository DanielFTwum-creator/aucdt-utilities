// TUC brand assets — single source of truth.
// Official Techbridge University College crest (maroon/gold, "Design and Build a Nation").
export const TUC_LOGO = 'https://techbridge.edu.gh/static/TUC_LOGO_1.png';

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
