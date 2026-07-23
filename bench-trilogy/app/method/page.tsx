import type { Metadata } from "next";
import { loadContent } from "@/lib/content";
import BibleView, { type SectionImage } from "@/components/BibleView";

const content = loadContent("method");

export const metadata: Metadata = {
  title: content.title,
  description: content.logline,
};

const images: Record<string, SectionImage[]> = {
  "spectacle-film-1": [
    { src: "/images/fractured_billboard_glow.webp", alt: "Spectacle: fractured billboard glow" },
    { src: "/images/times_square_billboard_photoreal.webp", alt: "Spectacle: photoreal master" },
  ],
  "kit-map": [
    { src: "/images/vfx_tracking_markers.webp", alt: "Kit map: tracking markers" },
    { src: "/images/depth_map_matte.webp", alt: "Kit map: depth matte" },
  ],
};

export default function Page() {
  return (
    <BibleView
      content={content}
      kicker="The Trilogy Method"
      meta="Meta · The bible of bibles"
      images={images}
    />
  );
}
