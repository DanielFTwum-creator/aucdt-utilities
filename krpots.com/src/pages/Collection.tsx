import { motion } from "motion/react";
import { useState, useMemo } from "react";
import { ShoppingCart, Lock } from "lucide-react";
import { pieces } from "../data/pieces";
import type { Status, Category, Piece } from "../data/pieces";
import { useCartContext } from "../contexts/CartContext";

const STATUS_FILTERS: Array<"All" | Status> = ["All", "For Sale", "Private Collection"];

const CATEGORY_FILTERS: Array<"All" | Category> = [
  "All",
  "Vessels & Vases",
  "Bowls",
  "Mugs & Cups",
  "Pitchers & Jugs",
  "Platters & Dishes",
  "Sculptural Works",
  "Studio & Exhibition",
];

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(0)}`;
}

export default function Collection() {
  const [statusFilter, setStatusFilter]     = useState<"All" | Status>("All");
  const [categoryFilter, setCategoryFilter] = useState<"All" | Category>("All");
  const { addItem } = useCartContext();

  const filtered = useMemo(() => pieces.filter((p) => {
    const statusMatch = statusFilter === "All" || p.status === statusFilter;
    const catMatch    = categoryFilter === "All" || p.category === categoryFilter;
    return statusMatch && catMatch;
  }), [statusFilter, categoryFilter]);

  const forSaleCount = useMemo(
    () => filtered.filter((p) => p.status === "For Sale").length,
    [filtered]
  );

  return (
    <div className="w-full max-w-[1400px] mx-auto" role="main" aria-labelledby="collection-heading">

      {/* ── Sticky filter bar ──────────────────────────────────── */}
      <div className="sticky top-[57px] z-10 bg-theme-bg/95 backdrop-blur-md border-b border-theme-border px-4 sm:px-6 md:px-10 pt-5 pb-4 md:pt-8 md:pb-6">

        {/* Title + count */}
        <div className="flex items-baseline justify-between gap-2 mb-4 md:mb-6">
          <div>
            <h2 id="collection-heading" className="font-playfair font-black text-3xl md:text-5xl uppercase text-theme-text leading-none">
              The Archive
            </h2>
            <p className="font-cormorant italic text-gold-pale text-base md:text-xl mt-1 hidden sm:block">
              Decades of Form &amp; Function
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="font-cormorant italic text-gold-pale text-xs sm:text-sm">
              <span className="font-bebas text-gold text-sm sm:text-base tracking-[0.15em]">{filtered.length}</span>
              {" "}{filtered.length === 1 ? "piece" : "pieces"}
            </p>
            {forSaleCount > 0 && (
              <p className="font-cormorant italic text-gold-pale/70 text-xs">
                {forSaleCount} for sale
              </p>
            )}
          </div>
        </div>

        {/* Status — equal 3-col on mobile */}
        <div
          className="grid grid-cols-3 md:flex md:flex-wrap gap-2 md:gap-3 mb-3"
          role="group"
          aria-label="Filter by availability"
        >
          {STATUS_FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setStatusFilter(f)}
              className={`font-bebas tracking-[0.12em] md:tracking-[0.2em] text-[11px] md:text-sm uppercase px-1 md:px-4 py-2.5 border transition-colors text-center leading-tight ${
                statusFilter === f
                  ? "bg-gold text-ink border-gold"
                  : "border-theme-border text-gold hover:bg-gold/10"
              }`}
              aria-pressed={statusFilter === f ? "true" : "false"}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Category — horizontal scroll, no visible scrollbar */}
        <div
          className="flex overflow-x-auto gap-2 pb-1 md:flex-wrap md:overflow-visible md:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="group"
          aria-label="Filter by category"
        >
          {CATEGORY_FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setCategoryFilter(f)}
              className={`font-bebas tracking-[0.12em] text-[11px] uppercase px-3 py-1.5 border transition-colors whitespace-nowrap shrink-0 ${
                categoryFilter === f
                  ? "bg-gold/20 text-gold border-gold/60"
                  : "border-theme-border/40 text-gold/50 hover:text-gold hover:border-theme-border"
              }`}
              aria-pressed={categoryFilter === f ? "true" : "false"}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* ── Grid ──────────────────────────────────────────────── */}
      <div className="px-4 sm:px-6 md:px-10 py-6 md:py-10">
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-cormorant italic text-gold-pale text-xl">No pieces match the current filters.</p>
          </div>
        ) : (
          /* 2-col on mobile → 3-col sm → 4-col xl */
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5 md:gap-8">
            {filtered.map((piece: Piece, i: number) => {
              const isStudio  = piece.category === "Studio & Exhibition";
              const isForSale = piece.status === "For Sale";

              return (
                <motion.div
                  key={piece.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: Math.min(i * 0.03, 0.5) }}
                  className="group"
                >
                  {/* Image */}
                  <div className="aspect-[3/4] overflow-hidden border border-theme-border relative mb-2 md:mb-4">
                    <div className="absolute inset-0 bg-theme-bg/30 group-hover:bg-transparent transition-colors duration-500 z-10" aria-hidden="true" />
                    <img
                      src={piece.image}
                      alt={`${piece.title} — ${piece.technique}`}
                      className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                      loading="lazy"
                    />

                    {/* Status badge */}
                    {!isStudio && (
                      <div className="absolute top-2 left-2 z-20">
                        {isForSale ? (
                          <span className="bg-gold text-ink font-bebas tracking-[0.15em] text-[9px] md:text-[10px] uppercase px-1.5 py-0.5 md:px-2 md:py-1">
                            For Sale
                          </span>
                        ) : (
                          <span className="bg-theme-bg/80 border border-theme-border/50 text-gold/50 font-bebas tracking-[0.12em] text-[9px] md:text-[10px] uppercase px-1.5 py-0.5 md:px-2 md:py-1 flex items-center gap-1">
                            <Lock size={7} aria-hidden="true" />
                            Private
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="space-y-0.5 md:space-y-1">
                    <h4 className="font-playfair font-bold text-sm md:text-base text-theme-text leading-tight line-clamp-1">
                      {piece.title}
                    </h4>

                    {/* Category/technique — hidden on mobile 2-col to keep cards clean */}
                    <p className="hidden sm:block font-cormorant italic text-gold-pale text-xs md:text-sm">
                      {isStudio ? piece.category : `${piece.category} · ${piece.technique}`}
                    </p>

                    {/* Description — desktop only */}
                    {!isStudio && (
                      <p className="hidden md:block font-cormorant text-gold-pale/70 text-xs leading-snug line-clamp-2 pt-0.5">
                        {piece.description}
                      </p>
                    )}

                    {/* Price + Add to Cart */}
                    {isForSale && piece.price !== undefined && (
                      <div className="flex items-center justify-between pt-1.5 md:pt-2 gap-1">
                        <span className="font-bebas tracking-[0.15em] text-gold text-base md:text-lg">
                          {formatPrice(piece.price)}
                        </span>
                        {/* Mobile: icon-only button; Desktop: full label */}
                        <button
                          type="button"
                          onClick={() => addItem(piece)}
                          className="flex items-center gap-1 font-bebas tracking-[0.1em] text-[10px] md:text-xs uppercase border border-gold/40 text-gold hover:bg-gold/10 hover:border-gold transition-colors
                            px-2 py-2 md:px-3 md:py-1.5 min-h-[36px] md:min-h-0"
                          aria-label={`Add ${piece.title} to cart`}
                        >
                          <ShoppingCart size={11} aria-hidden="true" />
                          <span className="hidden sm:inline">Add</span>
                          <span className="hidden md:inline"> to Cart</span>
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
