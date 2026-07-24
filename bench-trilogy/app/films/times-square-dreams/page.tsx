import type { Metadata } from "next";
import { loadContent } from "@/lib/content";
import BibleView, { type SectionImage } from "@/components/BibleView";
import JsonLd from "@/components/JsonLd";
import { FILMS } from "@/lib/films";
import { filmMovieJsonLd } from "@/lib/seo";

const content = loadContent("times-square-dreams");
const film = FILMS.find((f) => f.slug === "times-square-dreams")!;

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
    { src: "/images/golden_billboard_portrait.webp", alt: "Sistah Onyx golden-hour billboard portrait key art" },
    { src: "/images/times_square_double_exposure.webp", alt: "Times Square double-exposure composite of Sistah Onyx" },
  ],
  // Section id is "lookbook" (was mis-keyed "lookbook-gallery", which never rendered).
  lookbook: [
    { src: "/images/rainy_times_square_reflection.webp", alt: "Wet Times Square reflection variant" },
    { src: "/images/times_square_billboard_photoreal.webp", alt: "Photoreal billboard master over Times Square" },
    { src: "/images/dry_evening_cityscape.webp", alt: "Dry evening Times Square cityscape plate" },
    { src: "/images/vintage_tv_broadcast.webp", alt: "Vintage TV broadcast treatment of the Sistah Onyx billboard" },
  ],
  "vfx-kit": [
    { src: "/images/vfx_tracking_markers.webp", alt: "VFX tracking markers plate" },
    { src: "/images/depth_map_matte.webp", alt: "Depth map matte pass" },
    { src: "/images/billboard_alpha_matte.webp", alt: "Billboard alpha matte pass" },
    { src: "/images/times_square_clean_plate_log.webp", alt: "Times Square clean plate in log colour" },
  ],
};

export default function Page() {
  return (
    <>
      <JsonLd data={filmMovieJsonLd(film, `${content.logline} ${content.intro}`)} />
      <BibleView
        content={content}
        kicker="Director's Cut Bible"
        meta="Film 01 · Spectacle"
        images={images}
        video={
          film.video && {
            src: film.video.src,
            poster: film.poster,
            label: "Animated preview · B-cut",
          }
        }
      />
    </>
  );
}
