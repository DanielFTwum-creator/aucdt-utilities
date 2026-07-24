// The trilogy, in order, plus the meta "method" doc. Shared by the hub and the
// per-film pages. Loglines are distilled from the source director's-cut bibles;
// full section copy is migrated per page in the content phase.
export type Film = {
  slug: string;
  order: string; // "01"
  code: string; // short billing name
  title: string;
  mode: string; // Spectacle / Intimacy / Commerce
  logline: string;
  href: string;
  sections: string[];
  // SEO/GEO fields (drive the Movie JSON-LD). Films are unreleased, so status
  // stays "Pre-production" until the trailers are cut; poster is the shared
  // trilogy key art for now (swap in per-film art when it exists).
  poster: string;
  status: string;
  // Optional self-hosted preview/trailer. Drives both the in-page player and
  // the Movie trailer VideoObject. Absent until a film has a cut.
  video?: { src: string; name: string; uploadDate: string };
};

const HERO = "/images/times_square_billboard_photoreal.webp";

export const FILMS: Film[] = [
  {
    slug: "times-square-dreams",
    order: "01",
    code: "ONYX",
    title: "Sistah Onyx: Times Square Dreams",
    mode: "Spectacle",
    logline: "From a Labadi garden bench to the lights of Times Square. One dream.",
    href: "/films/times-square-dreams",
    sections: ["Logline", "Visual Language", "Lookbook", "VFX Kit", "Shot List", "Camera", "Crew", "Deliverables"],
    poster: HERO,
    status: "Pre-production",
    video: {
      src: "https://thebench.techbridge.edu.gh/media/Animate_for_a_Hollywood_B_cut.mp4",
      name: "Sistah Onyx: Times Square Dreams — Animated Preview",
      uploadDate: "2026-07-24",
    },
  },
  {
    slug: "puzzle-game-of-love",
    order: "02",
    code: "PUZZLE",
    title: "Puzzle Game Love",
    mode: "Intimacy",
    logline: "Some pieces only fit after fifty years. The sequel, on the same bench.",
    href: "/films/puzzle-game-of-love",
    sections: ["Logline & Theme", "Character Breakdown", "Key Art Gallery", "Puzzle Deconstruction", "The Bench", "Shot List", "Colour & Texture", "Crew Notes", "Deliverables"],
    poster: HERO,
    status: "Pre-production",
  },
  {
    slug: "bench-to-brand",
    order: "03",
    code: "BRAND",
    title: "From Bench to Brand",
    mode: "Commerce",
    logline: "We turned the art into a product. Made in Ghana, from Odum wood.",
    href: "/films/bench-to-brand",
    sections: ["Logline", "Market", "Hero SKUs", "Why Buy", "Flywheel", "Shot List", "Go-to-Market", "Crew & Math", "Author's Note"],
    poster: HERO,
    status: "Pre-production",
  },
];

export const METHOD = {
  title: "The Trilogy Method",
  href: "/method",
  tagline: "One bench, three worlds — how the spectacle, the intimacy and the commerce lock together.",
  sections: ["Core Loop", "Spectacle", "Intimacy", "Commerce", "Meta", "Playbook", "Kit Map"],
};

// Brand / site identity: single source of truth for metadata and JSON-LD.
export const SITE = {
  url: "https://thebench.techbridge.edu.gh",
  name: "THE BENCH TRILOGY",
  shortName: "The Bench Trilogy",
  tagline: "One Bench. Three Worlds. Made in Ghana.",
  description:
    "A Ghanaian film trilogy that travels from a single Labadi bench to Times Square: SISTAH ONYX (Times Square Dreams), PUZZLE GAME LOVE, and FROM BENCH TO BRAND. Director's-cut bibles, the VFX kit, and the trilogy method.",
  ogImage: HERO,
  locale: "en-GH",
  // thebench's OWN media path (nginx serves /media/ from a persistent dir
  // outside the deploy, so large films survive `rsync --delete`). Small clips
  // stay in the repo; large films set video.src to `${mediaBase}/<file>` and are
  // uploaded with scripts/push-asset.ps1. Never another project's host, never Drive.
  mediaBase: "https://thebench.techbridge.edu.gh/media",
};
