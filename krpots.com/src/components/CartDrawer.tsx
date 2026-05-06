import { motion, AnimatePresence } from "motion/react";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { useCartContext } from "../contexts/CartContext";

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function CartDrawer() {
  const {
    isOpen,
    closeCart,
    items,
    removeItem,
    updateQty,
    total,
    checkout,
    checkoutLoading,
  } = useCartContext();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/70 z-40 backdrop-blur-sm"
            onClick={closeCart}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.aside
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35, ease: "easeInOut" }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#111008] border-l border-[#c8a84b]/30 z-50 flex flex-col shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#c8a84b]/20 shrink-0">
              <div className="flex items-center gap-3">
                <ShoppingBag className="text-[#c8a84b]" size={20} aria-hidden="true" />
                <h2 className="font-bebas tracking-[0.25em] text-[#c8a84b] text-xl uppercase">
                  Your Collection
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="text-[#c8a84b]/60 hover:text-[#c8a84b] transition-colors p-1 rounded"
                aria-label="Close cart"
              >
                <X size={22} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-16">
                  <ShoppingBag size={48} className="text-[#c8a84b]/20" aria-hidden="true" />
                  <p className="font-bebas tracking-[0.2em] text-[#c8a84b]/40 text-lg uppercase">
                    Your collection is empty
                  </p>
                  <p className="font-cormorant italic text-[#d4b896]/40 text-base">
                    Add pieces from the archive to begin.
                  </p>
                </div>
              ) : (
                items.map(({ piece, quantity }) => (
                  <div
                    key={piece.id}
                    className="flex gap-4 border border-[#c8a84b]/15 bg-[#1a1508]/60 p-3"
                  >
                    {/* Thumbnail */}
                    <img
                      src={piece.image}
                      alt={piece.title}
                      className="w-20 h-24 object-cover shrink-0 border border-[#c8a84b]/20"
                    />

                    {/* Info */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <h3 className="font-playfair font-bold text-[#e8dcc8] text-sm leading-tight mb-0.5 truncate">
                          {piece.title}
                        </h3>
                        <p className="font-cormorant italic text-[#c8a84b]/60 text-xs">
                          {piece.technique}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Qty controls */}
                        <div className="flex items-center gap-1 border border-[#c8a84b]/30">
                          <button
                            onClick={() => updateQty(piece.id, quantity - 1)}
                            className="px-2 py-1 text-[#c8a84b]/70 hover:text-[#c8a84b] hover:bg-[#c8a84b]/10 transition-colors"
                            aria-label={`Decrease quantity of ${piece.title}`}
                          >
                            <Minus size={12} />
                          </button>
                          <span className="font-bebas text-[#e8dcc8] tracking-wider text-sm px-2">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateQty(piece.id, quantity + 1)}
                            className="px-2 py-1 text-[#c8a84b]/70 hover:text-[#c8a84b] hover:bg-[#c8a84b]/10 transition-colors"
                            aria-label={`Increase quantity of ${piece.title}`}
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        {/* Price + remove */}
                        <div className="flex items-center gap-3">
                          <span className="font-bebas text-[#c8a84b] tracking-wider text-base">
                            {formatPrice((piece.price ?? 0) * quantity)}
                          </span>
                          <button
                            onClick={() => removeItem(piece.id)}
                            className="text-[#c8a84b]/30 hover:text-red-400 transition-colors"
                            aria-label={`Remove ${piece.title} from cart`}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-[#c8a84b]/20 shrink-0 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-bebas tracking-[0.2em] text-[#c8a84b]/70 text-sm uppercase">
                    Subtotal
                  </span>
                  <span className="font-playfair font-bold text-[#e8dcc8] text-lg">
                    {formatPrice(total)}
                  </span>
                </div>
                <p className="font-cormorant italic text-[#c8a84b]/40 text-xs">
                  Shipping and taxes calculated at checkout.
                </p>
                <button
                  onClick={checkout}
                  disabled={checkoutLoading}
                  className="w-full bg-[#c8a84b] text-[#111008] font-bebas tracking-[0.3em] text-sm uppercase py-4 hover:bg-[#d4b96a] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  aria-label="Proceed to Stripe checkout"
                >
                  {checkoutLoading ? "Redirecting…" : "Checkout with Stripe"}
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
