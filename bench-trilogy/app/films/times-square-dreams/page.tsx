import type { Metadata } from "next";
import { FILMS } from "@/lib/films";
import BiblePage from "@/components/BiblePage";

const film = FILMS.find((f) => f.slug === "times-square-dreams")!;

export const metadata: Metadata = { title: film.title, description: film.logline };

export default function Page() {
  return (
    <BiblePage
      kicker="Director's Cut Bible"
      meta={`Film ${film.order} · ${film.mode}`}
      title={film.title}
      logline={film.logline}
      sections={film.sections}
    />
  );
}
