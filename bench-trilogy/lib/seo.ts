// JSON-LD builders for The Bench Trilogy. Everything derives from lib/films.ts
// so the structured data can never drift from the site content.
//
// The films are unreleased (director's-cut bibles), so each Movie carries
// creativeWorkStatus "Pre-production" and NO trailer/video yet. When the videos
// exist, give each film a `video` entry in FILMS and populate `film.video`
// below — see the marked hook in filmMovieJsonLd.
import { FILMS, SITE, type Film } from "./films";

const abs = (path: string) => `${SITE.url}${path}`;

const ORG_ID = `${SITE.url}/#organization`;
const SERIES_ID = `${SITE.url}/#series`;

function organization() {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE.shortName,
    url: SITE.url,
    description: SITE.description,
    image: abs(SITE.ogImage),
  };
}

/** Site-wide graph rendered once in the root layout: publisher + site + series. */
export function trilogyGraphJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      organization(),
      {
        "@type": "WebSite",
        "@id": `${SITE.url}/#website`,
        url: SITE.url,
        name: SITE.name,
        description: SITE.description,
        inLanguage: SITE.locale,
        publisher: { "@id": ORG_ID },
      },
      {
        "@type": "CreativeWorkSeries",
        "@id": SERIES_ID,
        name: SITE.shortName,
        alternateName: SITE.name,
        url: SITE.url,
        description: SITE.description,
        inLanguage: SITE.locale,
        countryOfOrigin: { "@type": "Country", name: "Ghana" },
        image: abs(SITE.ogImage),
        creator: { "@id": ORG_ID },
        hasPart: FILMS.map((f) => ({
          "@type": "Movie",
          "@id": `${abs(f.href)}#movie`,
          name: f.title,
          url: abs(f.href),
          position: Number(f.order),
        })),
      },
    ],
  };
}

/** Per-film Movie schema. `description` uses the fuller page copy when available. */
export function filmMovieJsonLd(film: Film, description?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Movie",
    "@id": `${abs(film.href)}#movie`,
    name: film.title,
    alternateName: film.code,
    url: abs(film.href),
    description: (description ?? film.logline).trim(),
    image: abs(film.poster),
    inLanguage: SITE.locale,
    countryOfOrigin: { "@type": "Country", name: "Ghana" },
    creativeWorkStatus: film.status,
    keywords: [film.mode, "Ghanaian cinema", "The Bench Trilogy"],
    position: Number(film.order),
    isPartOf: { "@id": SERIES_ID },
    creator: { "@id": ORG_ID },
    productionCompany: { "@id": ORG_ID },
    // HOOK (add when trailers exist): once a film has a YouTube URL, attach a
    // trailer VideoObject here, e.g.:
    //   trailer: {
    //     "@type": "VideoObject",
    //     name: `${film.title} — Trailer`,
    //     description: film.logline,
    //     thumbnailUrl: abs(film.poster),
    //     uploadDate: "2026-…",
    //     contentUrl: "https://…", embedUrl: "https://www.youtube.com/embed/…",
    //   },
  };
}
