import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { pieces } from "../data/pieces";

const HERO_IMAGE = "/media/pots-by-kr/IMG_0183.webp";

const SIGNATURE = [
  { id: "IMG_1016", title: "Archive Study I",   year: "1991", technique: "Wheel-thrown, Wood-fired" },
  { id: "IMG_0183", title: "Market Exhibition", year: "1998", technique: "Hand-built, Pit-fired"   },
  { id: "IMG_0179", title: "Ash Glaze Bowl",    year: "2005", technique: "Wheel-thrown, Reduction" },
];

export default function Home() {
  const forSaleCount = pieces.filter(p => p.status === "For Sale").length;

  return (
    <div className="flex flex-col w-full max-w-[1200px] mx-auto">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="px-5 sm:px-10 pt-16 sm:pt-24 md:pt-32 pb-14 sm:pb-20 md:pb-24 relative z-10 text-center shrink-0 overflow-hidden border-b border-theme-border"
        aria-labelledby="hero-heading"
      >
        {/* Background image */}
        <div className="absolute inset-0 z-0 opacity-20 mix-blend-luminosity pointer-events-none">
          <img src={HERO_IMAGE} alt="" className="w-full h-full object-cover" aria-hidden="true" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-b from-theme-bg/40 via-theme-bg/80 to-theme-bg" />
        </div>

        <div className="relative z-10">
          <p className="font-bebas text-gold tracking-[0.35em] sm:tracking-[0.4em] text-base sm:text-xl mb-5 sm:mb-8" aria-hidden="true">
            A Retrospective Archive
          </p>

          {/* Hero headline — scales from 3rem on mobile to 5.5rem on desktop */}
          <h2
            id="hero-heading"
            className="font-playfair font-black text-[3rem] sm:text-[4.5rem] md:text-[5.5rem] uppercase leading-[0.92] text-theme-text mb-2 tracking-tight"
          >
            Mastery in
          </h2>
          <h2
            className="font-playfair italic text-[3rem] sm:text-[4.5rem] md:text-[5.5rem] text-gold leading-[0.92] tracking-tight"
            aria-hidden="true"
          >
            Earth &amp; Fire
          </h2>

          <p className="font-cormorant font-light text-lg sm:text-2xl text-theme-text max-w-2xl mx-auto mt-7 sm:mt-10 leading-relaxed px-2 sm:px-0">
            Celebrating decades of unparalleled clay artistry — a curated odyssey through form, technique, and the enduring legacy of a master potter.
          </p>

          <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/collection"
              className="inline-block border border-gold px-8 py-4 font-bebas text-gold tracking-[0.25em] text-lg uppercase hover:bg-gold hover:text-ink transition-colors bg-theme-bg/50 backdrop-blur-sm w-full sm:w-auto text-center"
              aria-label="Explore the full pottery collection"
            >
              Explore the Collection
            </Link>
            {forSaleCount > 0 && (
              <Link
                to="/collection"
                onClick={() => {}}
                className="font-cormorant italic text-gold-pale text-base hover:text-gold transition-colors"
              >
                {forSaleCount} pieces available for purchase →
              </Link>
            )}
          </div>
        </div>
      </motion.section>

      {/* ── Stats band ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
        className="mx-4 sm:mx-10 border-y border-theme-border bg-gold/5 py-5 grid grid-cols-2 sm:grid-cols-4 gap-y-5 sm:gap-y-0 relative z-10 shrink-0"
        role="region"
        aria-label="Key Statistics"
      >
        <FeatureItem value="42"     label="Years"       sub="Of Dedication"   />
        <FeatureItem value="1,200+" label="Pieces"      sub="Archived Works"  />
        <FeatureItem value="15"     label="Exhibitions" sub="Global Showcases" />
        <FeatureItem value="8"      label="Techniques"  sub="Mastered Forms"  />
      </motion.div>

      {/* ── Signature Pieces ────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="px-4 sm:px-10 py-14 sm:py-24 relative z-10"
        aria-labelledby="signature-pieces-heading"
      >
        <div className="text-center mb-10 sm:mb-16">
          <h3
            id="signature-pieces-heading"
            className="font-bebas text-gold tracking-[0.35em] text-2xl sm:text-3xl mb-4 border-b border-theme-border pb-3 inline-block uppercase"
          >
            Signature Pieces
          </h3>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 list-none p-0 m-0" aria-label="Featured signature pieces">
          {SIGNATURE.map((piece) => (
            <li key={piece.id}>
            <Link
              to="/collection"
              className="group block"
              aria-label={`View ${piece.title} in collection`}
            >
              <div className="aspect-[3/4] overflow-hidden border border-theme-border relative mb-4">
                <div className="absolute inset-0 bg-theme-bg/20 group-hover:bg-transparent transition-colors z-10" aria-hidden="true" />
                <img
                  src={`/media/pots-by-kr/${piece.id}.webp`}
                  alt={`${piece.title} - ${piece.technique}`}
                  className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  loading="lazy"
                />
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-playfair font-bold text-lg sm:text-xl text-theme-text mb-1">{piece.title}</h4>
                  <p className="font-cormorant italic text-gold-pale text-base sm:text-lg">{piece.technique}</p>
                </div>
                <span className="font-bebas text-gold tracking-widest text-lg" aria-label={`Created in ${piece.year}`}>
                  {piece.year}
                </span>
              </div>
            </Link>
            </li>
          ))}
        </ul>

        <div className="text-center mt-12 sm:mt-16">
          <Link
            to="/collection"
            className="font-bebas tracking-[0.3em] text-gold/60 hover:text-gold text-sm uppercase transition-colors border-b border-transparent hover:border-gold/30 pb-0.5"
          >
            View All 63 Works
          </Link>
        </div>
      </motion.section>
    </div>
  );
}

function FeatureItem({ value, label, sub }: { value: string; label: string; sub: string }) {
  return (
    <div className="flex flex-col items-center text-center px-2" role="group" aria-label={`${value} ${label} - ${sub}`}>
      <div className="font-playfair font-black text-3xl sm:text-4xl text-gold mb-1 leading-none" aria-hidden="true">{value}</div>
      <p className="font-bebas text-gold tracking-[0.25em] text-base sm:text-lg leading-none mb-1 uppercase" aria-hidden="true">{label}</p>
      <p className="font-cormorant italic text-theme-text text-xs sm:text-sm opacity-80 leading-none" aria-hidden="true">{sub}</p>
    </div>
  );
}
