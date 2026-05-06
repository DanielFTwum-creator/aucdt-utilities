import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCartContext } from "../contexts/CartContext";
import CartDrawer from "./CartDrawer";

const NAV_LINKS = [
  { to: "/collection", label: "Collection" },
  { to: "/timeline",   label: "Timeline"   },
  { to: "/artist",     label: "Artist"     },
  { to: "/contact",    label: "Contact"    },
];

export default function Navbar() {
  const { count, openCart } = useCartContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="px-6 md:px-10 py-5 md:pt-10 md:pb-8 flex justify-between items-center border-b border-theme-border relative z-20 shrink-0 bg-theme-bg/95 backdrop-blur-md sticky top-1"
        role="banner"
      >
        {/* Desktop: left nav */}
        <nav className="hidden md:flex w-1/3 items-center justify-start gap-6" aria-label="Main Navigation Left">
          <Link to="/collection" className="font-bebas text-gold tracking-[0.25em] text-sm uppercase hover:text-gold-light transition-colors">Collection</Link>
          <Link to="/timeline"   className="font-bebas text-gold tracking-[0.25em] text-sm uppercase hover:text-gold-light transition-colors">Timeline</Link>
        </nav>

        {/* Logo — always centered */}
        <div className="flex-1 md:w-1/3 text-center flex flex-col items-center">
          <Link to="/" aria-label="KRPots Home">
            <h1 className="font-playfair font-black text-2xl md:text-3xl tracking-[0.15em] uppercase text-theme-text leading-none">KRPots</h1>
            <p className="font-bebas text-gold tracking-[0.35em] text-[0.6rem] mt-1 uppercase">Decades of Clay</p>
          </Link>
        </div>

        {/* Desktop: right nav */}
        <nav className="hidden md:flex w-1/3 items-center justify-end gap-6" aria-label="Main Navigation Right">
          <Link to="/artist"  className="font-bebas text-gold tracking-[0.25em] text-sm uppercase hover:text-gold-light transition-colors">Artist</Link>
          <Link to="/contact" className="font-bebas text-gold tracking-[0.25em] text-sm uppercase hover:text-gold-light transition-colors">Contact</Link>
          <CartButton count={count} openCart={openCart} />
        </nav>

        {/* Mobile: cart + hamburger */}
        <div className="flex md:hidden items-center gap-4">
          <CartButton count={count} openCart={openCart} />
          <button
            type="button"
            onClick={() => setMenuOpen(v => !v)}
            className="text-gold hover:text-gold-light transition-colors"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen ? "true" : "false"}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.header>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="md:hidden sticky top-[calc(1rem+57px)] z-10 bg-theme-bg/98 backdrop-blur-md border-b border-theme-border flex flex-col"
            aria-label="Mobile Navigation"
          >
            {NAV_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={`font-bebas tracking-[0.3em] text-sm uppercase px-8 py-4 border-b border-theme-border/30 transition-colors ${
                  location.pathname === to ? "text-gold bg-gold/5" : "text-gold/70 hover:text-gold hover:bg-gold/5"
                }`}
              >
                {label}
              </Link>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>

      <CartDrawer />
    </>
  );
}

function CartButton({ count, openCart }: { count: number; openCart: () => void }) {
  return (
    <button
      type="button"
      onClick={openCart}
      className="relative text-gold hover:text-gold-light transition-colors"
      aria-label={count > 0 ? `Open cart — ${count} item${count === 1 ? "" : "s"}` : "Open cart"}
    >
      <ShoppingBag size={22} />
      {count > 0 && (
        <span
          className="absolute -top-2 -right-2 bg-gold text-ink font-bebas text-[10px] leading-none rounded-full w-4 h-4 flex items-center justify-center"
          aria-hidden="true"
        >
          {count > 9 ? "9+" : count}
        </span>
      )}
    </button>
  );
}
