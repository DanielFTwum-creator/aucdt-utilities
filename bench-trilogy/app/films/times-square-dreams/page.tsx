import type { Metadata } from "next";
import { loadContent } from "@/lib/content";
import BibleView, { type SectionImage } from "@/components/BibleView";

const content = loadContent("times-square-dreams");

export const metadata: Metadata = {
  title: content.title,
  description: content.logline,
};

const images: Record<string, SectionImage[]> = {
  cover: [
    { src: "/images/times_square_billboard_photoreal.webp", alt: "Sistah Onyx billboard, 8K photoreal master over Times Square" },
  ],
  "visual-language": [
    { src: "/images/fractured_billboard_glow.webp", alt: "Fractured double-exposure glow pass" },
    { src: "/images/vertical_billboard_portrait.webp", alt: "Golden backlight portrait study" },
  ],
  "lookbook-gallery": [
    { src: "/images/rainy_times_square_reflection.webp", alt: "Wet Times Square reflection variant" },
    { src: "/images/times_square_billboard_photoreal.webp", alt: "Photoreal billboard master" },
  ],
  "vfx-kit": [
    { src: "/images/vfx_tracking_markers.webp", alt: "VFX tracking markers plate" },
    { src: "/images/depth_map_matte.webp", alt: "Depth map matte pass" },
  ],
};

export default function Page() {
  return (
    <BibleView
      content={content}
      kicker="Director's Cut Bible"
      meta="Film 01 · Spectacle"
      images={images}
    />
  );
}
