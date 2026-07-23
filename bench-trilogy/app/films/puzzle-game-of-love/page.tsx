import type { Metadata } from "next";
import { loadContent } from "@/lib/content";
import BibleView from "@/components/BibleView";

const content = loadContent("puzzle-game-of-love");

export const metadata: Metadata = {
  title: content.title,
  description: content.logline,
};

export default function Page() {
  return (
    <BibleView
      content={content}
      kicker="Director's Cut Bible"
      meta="Film 02 · Intimacy"
    />
  );
}
