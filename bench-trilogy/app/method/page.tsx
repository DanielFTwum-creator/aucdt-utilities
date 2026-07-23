import type { Metadata } from "next";
import { METHOD } from "@/lib/films";
import BiblePage from "@/components/BiblePage";

export const metadata: Metadata = { title: METHOD.title, description: METHOD.tagline };

export default function Page() {
  return (
    <BiblePage
      kicker="The Trilogy Method"
      meta="Meta · The bible of bibles"
      title={METHOD.title}
      logline={METHOD.tagline}
      sections={METHOD.sections}
    />
  );
}
