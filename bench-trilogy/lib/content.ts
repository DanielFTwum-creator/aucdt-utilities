import fs from "node:fs";
import path from "node:path";

export type Section = { id: string; label: string; body: string };
export type BibleContent = {
  title: string;
  logline: string;
  intro: string;
  sections: Section[];
};

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// Read a source draft (content/<slug>.md) at build time and split it into the
// title, logline, intro blurb and the "## " sections that drive the tabs.
export function loadContent(slug: string): BibleContent {
  const file = path.join(process.cwd(), "content", `${slug}.md`);
  const raw = fs.readFileSync(file, "utf8");

  const parts = raw.split(/\n(?=## )/); // split before each "## " heading
  const head = parts.shift() ?? "";

  const title = head.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? slug;
  const logline = head.match(/^>\s+(.+)$/m)?.[1]?.trim() ?? "";
  const intro = head
    .replace(/^#\s+.+$/m, "")
    .replace(/^>\s+.+$/m, "")
    .trim();

  const sections: Section[] = parts.map((block) => {
    const label = block.match(/^##\s+(.+)$/m)?.[1]?.trim() ?? "Section";
    const body = block.replace(/^##\s+.+$/m, "").trim();
    return { id: slugify(label), label, body };
  });

  return { title, logline, intro, sections };
}
