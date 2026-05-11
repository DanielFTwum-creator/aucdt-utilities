import { Link, useSearchParams } from "react-router-dom";
import { motion } from "motion/react";
import { CheckCircle } from "lucide-react";
import { useCartContext } from "../contexts/CartContext";
import { useEffect } from "react";

export default function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { clearCart } = useCartContext();

  useEffect(() => {
    // Clear the cart once landing on the success page
    clearCart();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className="w-full max-w-2xl mx-auto px-10 py-24 flex flex-col items-center text-center gap-8"
      role="main"
    >
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.1 }}
      >
        <CheckCircle size={72} className="text-[#c8a84b]" aria-hidden="true" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="space-y-4"
      >
        <h1 className="font-playfair font-black text-4xl uppercase text-theme-text">
          Order Confirmed
        </h1>
        <p className="font-cormorant italic text-[#c8a84b] text-xl">
          Thank you for your order.
        </p>
        <p className="font-cormorant text-[#d4b896] text-lg leading-relaxed max-w-md mx-auto">
          We'll be in touch shortly to arrange shipping. Each piece is wrapped
          with care and sent directly from the studio.
        </p>
        {sessionId && (
          <p className="font-bebas tracking-[0.2em] text-[#c8a84b]/40 text-xs uppercase">
            Session: {sessionId}
          </p>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <Link
          to="/collection"
          className="font-bebas tracking-[0.25em] text-sm uppercase px-8 py-3 border border-[#c8a84b]/50 text-[#c8a84b] hover:bg-[#c8a84b]/10 transition-colors"
          aria-label="Return to collection"
        >
          Return to Collection
        </Link>
      </motion.div>
    </div>
  );
}
