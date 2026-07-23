import Link from "next/link";

type BibleProps = {
  kicker: string; // e.g. "Director's Cut Bible" / "The Trilogy Method"
  meta: string; // e.g. "Film 01 · Spectacle"
  title: string;
  logline: string;
  sections: string[];
};

// Shared shell for a film bible / method page. Renders the section index now;
// the full section copy and visuals are migrated per page in the content phase.
export default function BiblePage({ kicker, meta, title, logline, sections }: BibleProps) {
  return (
    <main className="flex-1">
      <header className="border-b border-paper-dim/20">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-5">
          <Link
            href="/"
            className="font-mono text-xs uppercase tracking-widest text-paper-dim hover:text-gold"
          >
            ← The Bench Trilogy
          </Link>
          <span className="font-mono text-xs uppercase tracking-widest text-gold">
            {meta}
          </span>
        </div>
      </header>

      <article className="mx-auto max-w-4xl px-6 py-16">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold">
          {kicker}
        </p>
        <h1 className="mt-6 font-display text-5xl leading-tight md:text-7xl">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-paper-dim">{logline}</p>
        <div className="gh-rule mt-10" />

        <section className="mt-12">
          <h2 className="font-mono text-xs uppercase tracking-widest text-paper-dim">
            Contents
          </h2>
          <ol className="mt-4 grid gap-2 sm:grid-cols-2">
            {sections.map((s, i) => (
              <li
                key={s}
                className="flex items-baseline gap-3 rounded-lg border border-paper-dim/15 bg-ink-2 px-4 py-3"
              >
                <span className="font-mono text-xs text-gold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-sm text-paper">{s}</span>
              </li>
            ))}
          </ol>
          <p className="mt-8 text-sm text-paper-dim">
            Full section copy and visuals are being migrated from the source
            director&apos;s-cut bible.
          </p>
        </section>
      </article>
    </main>
  );
}
