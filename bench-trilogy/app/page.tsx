import Link from "next/link";
import { FILMS, METHOD } from "@/lib/films";

export default function Home() {
  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-6 pt-24 pb-16 md:pt-32 md:pb-24">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold">
            A Ghanaian Film Trilogy
          </p>
          <h1 className="mt-6 font-display text-6xl leading-[0.95] md:text-8xl">
            One Bench.
            <br />
            <span className="text-gold">Three Worlds.</span>
          </h1>
          <p className="mt-8 max-w-xl text-lg text-paper-dim">
            From a single bench in Labadi to the lights of Times Square, and back
            to a product line carved from Odum wood. Spectacle, intimacy and
            commerce, made in Ghana.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="#films"
              className="rounded-full bg-gold px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest text-ink transition-colors hover:bg-paper"
            >
              The Films
            </Link>
            <Link
              href={METHOD.href}
              className="rounded-full border border-paper-dim/40 px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest text-paper transition-colors hover:border-gold hover:text-gold"
            >
              The Method
            </Link>
          </div>
        </div>
        <div className="gh-rule" />
      </section>

      {/* The Films */}
      <section id="films" className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex items-end justify-between border-b border-paper-dim/20 pb-4">
          <h2 className="font-display text-3xl md:text-4xl">The Films</h2>
          <span className="font-mono text-xs uppercase tracking-widest text-paper-dim">
            In order
          </span>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {FILMS.map((film) => (
            <Link
              key={film.slug}
              href={film.href}
              className="group flex flex-col rounded-2xl border border-paper-dim/20 bg-ink-2 p-6 transition-all hover:-translate-y-1 hover:border-gold/60"
            >
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-xs uppercase tracking-widest text-gold">
                  Film {film.order}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-paper-dim">
                  {film.mode}
                </span>
              </div>
              <h3 className="mt-4 font-display text-2xl leading-tight text-paper group-hover:text-gold">
                {film.title}
              </h3>
              <p className="mt-3 flex-1 text-sm text-paper-dim">{film.logline}</p>
              <span className="mt-6 font-mono text-xs uppercase tracking-widest text-paper group-hover:text-gold">
                Open the bible →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Made in Ghana */}
      <section className="border-t border-paper-dim/20 bg-ink-2">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="font-display text-4xl md:text-5xl">
            Made in <span className="text-gold">Ghana</span>.
          </h2>
          <p className="mt-6 max-w-2xl text-paper-dim">
            Every world is grounded in a specific place, not a generic idea of
            Africa: Labadi Beach, Makola Market, Suame Magazine, Odum wood,
            Adinkra and kente. The trilogy is a method for turning that
            specificity into spectacle, story and a sustainable brand.
          </p>
          <Link
            href={METHOD.href}
            className="mt-8 inline-block font-mono text-xs uppercase tracking-widest text-gold hover:text-paper"
          >
            Read the trilogy method →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-paper-dim/20">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 md:flex-row md:items-center md:justify-between">
          <p className="font-display text-lg">
            THE BENCH TRILOGY
            <span className="ml-3 font-mono text-[10px] uppercase tracking-widest text-paper-dim">
              A TechBridge production
            </span>
          </p>
          <nav className="flex flex-wrap gap-6 font-mono text-xs uppercase tracking-widest text-paper-dim">
            {FILMS.map((f) => (
              <Link key={f.slug} href={f.href} className="hover:text-gold">
                {f.code}
              </Link>
            ))}
            <Link href={METHOD.href} className="hover:text-gold">
              Method
            </Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}
