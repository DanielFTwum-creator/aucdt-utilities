import type { Metadata } from "next";
import { loadContent } from "@/lib/content";
import BibleView from "@/components/BibleView";
import JsonLd from "@/components/JsonLd";
import { FILMS } from "@/lib/films";
import { filmMovieJsonLd } from "@/lib/seo";

const content = loadContent("puzzle-game-of-love");
const film = FILMS.find((f) => f.slug === "puzzle-game-of-love")!;

export const metadata: Metadata = {
  title: content.title,
  description: content.logline,
};

export default function Page() {
  return (
    <>
      <JsonLd data={filmMovieJsonLd(film, `${content.logline} ${content.intro}`)} />
      <BibleView
        content={content}
        kicker="Director's Cut Bible"
        meta="Film 02 · Intimacy"
      />
    </>
  );
}
