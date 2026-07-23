"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { BibleContent } from "@/lib/content";

export type SectionImage = { src: string; alt: string };

export default function BibleView({
  content,
  kicker,
  meta,
  images = {},
}: {
  content: BibleContent;
  kicker: string;
  meta: string;
  images?: Record<string, SectionImage[]>;
}) {
  const [active, setActive] = useState(content.sections[0]?.id ?? "");

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

      <div className="mx-auto max-w-4xl px-6 pt-14 pb-20">
        {/* Hero */}
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold">
          {kicker}
        </p>
        <h1 className="mt-6 font-display text-5xl leading-tight md:text-7xl">
          {content.title}
        </h1>
        {content.logline && (
          <p className="mt-6 max-w-2xl text-lg text-paper-dim">{content.logline}</p>
        )}
        {content.intro && (
          <div className="prose prose-invert mt-4 max-w-none text-sm prose-p:text-paper-dim">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content.intro}</ReactMarkdown>
          </div>
        )}
        <div className="gh-rule mt-10" />

        {/* Sticky section tabs */}
        <nav
          aria-label="Sections"
          className="sticky top-0 z-20 -mx-6 mt-8 mb-10 flex gap-1 overflow-x-auto border-b border-paper-dim/20 bg-ink/90 px-6 py-3 backdrop-blur"
        >
          {content.sections.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setActive(s.id)}
              aria-current={active === s.id}
              className={`shrink-0 rounded-full px-4 py-1.5 font-mono text-[11px] uppercase tracking-widest transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                active === s.id ? "bg-gold text-ink" : "text-paper-dim hover:text-gold"
              }`}
            >
              <span className="mr-1.5 opacity-60">{String(i + 1).padStart(2, "0")}</span>
              {s.label}
            </button>
          ))}
        </nav>

        {/* All panels rendered (crawlable); inactive ones hidden. */}
        {content.sections.map((s) => (
          <section key={s.id} hidden={active !== s.id} aria-labelledby={`h-${s.id}`}>
            <h2
              id={`h-${s.id}`}
              className="font-display text-3xl text-gold md:text-4xl"
            >
              {s.label}
            </h2>

            {images[s.id]?.length ? (
              <div className="my-8 grid gap-4 sm:grid-cols-2">
                {images[s.id].map((img) => (
                  <div
                    key={img.src}
                    className="relative aspect-video overflow-hidden rounded-xl border border-paper-dim/20"
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : null}

            <div className="prose prose-invert mt-4 max-w-none prose-headings:font-display prose-headings:text-paper prose-h3:text-xl prose-a:text-gold prose-strong:text-paper prose-li:text-paper-dim prose-p:text-paper-dim">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{s.body}</ReactMarkdown>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
