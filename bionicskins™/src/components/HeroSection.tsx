import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <>
      {/* Full-width hero with background image */}
      <section className="relative h-[75vh] flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.squarespace-cdn.com/content/v1/65d385945c1b7165dd6ac28a/5540ffb4-eb38-4860-8f63-4ef21775b73a/Bostons+Best+Prosthetics+Bionic+Skins.png')`,
          }}
        />
        {/* Dark overlay for text legibility */}
        <div className="absolute inset-0 bg-black/30" />
      </section>

      {/* "Now Accepting Patients" CTA — below hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex justify-center py-10 bg-white"
      >
        <Link
          to="/become-a-patient"
          className="bg-[#16426C] text-white px-10 py-4 text-lg font-sans font-medium rounded-[4px] hover:bg-[#2A5171] transition-all duration-300 tracking-wide"
        >
          Now Accepting Patients
        </Link>
      </motion.div>
    </>
  );
}
