import type { Metadata } from "next";
import { loadContent } from "@/lib/content";
import BibleView, { type SectionImage } from "@/components/BibleView";
import JsonLd from "@/components/JsonLd";
import { FILMS } from "@/lib/films";
import { filmMovieJsonLd } from "@/lib/seo";

const content = loadContent("bench-to-brand");
const film = FILMS.find((f) => f.slug === "bench-to-brand")!;

export const metadata: Metadata = {
  title: content.title,
  description: content.logline,
};

const images: Record<string, SectionImage[]> = {
  "01-logline": [
    { src: "/images/times_square_billboard_photoreal.webp", alt: "The Bench Trilogy hero billboard" },
  ],
};

export default function Page() {
  return (
    <>
      <JsonLd data={filmMovieJsonLd(film, `${content.logline} ${content.intro}`)} />
      <BibleView
        content={content}
        kicker="Director's Cut Bible"
        meta="Film 03 · Commerce"
        images={images}
      />
    </>
  );
}
