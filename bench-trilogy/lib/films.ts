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
};

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
  },
];

export const METHOD = {
  title: "The Trilogy Method",
  href: "/method",
  tagline: "One bench, three worlds — how the spectacle, the intimacy and the commerce lock together.",
  sections: ["Core Loop", "Spectacle", "Intimacy", "Commerce", "Meta", "Playbook", "Kit Map"],
};
