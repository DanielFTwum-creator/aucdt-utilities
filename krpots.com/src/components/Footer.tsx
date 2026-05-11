import { motion } from "motion/react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <motion.footer 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative z-10 shrink-0 mt-auto"
      role="contentinfo"
    >
      <div className="h-px w-full bg-gradient-to-r from-transparent via-gold to-transparent opacity-30" aria-hidden="true" />
      <div className="px-10 py-8 flex justify-between items-center bg-theme-bg">
        <p className="font-cormorant italic text-gold-pale text-xl">A Legacy in Clay.</p>
        <div className="flex gap-6 items-center">
          <Link to="/admin" className="font-dmsans text-gold/50 hover:text-gold text-[0.65rem] uppercase tracking-[0.25em] font-medium transition-colors" aria-label="Admin Login">Admin</Link>
          <p className="font-dmsans text-gold text-[0.65rem] uppercase tracking-[0.25em] font-medium">krpots.com</p>
        </div>
      </div>
      {/* Bottom Gold Accent Bar */}
      <div className="h-1 w-full bg-gold" aria-hidden="true" />
    </motion.footer>
  );
}
