import { motion } from 'motion/react';

export default function Banner() {
  return (
    <section className="py-12 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[16/9] md:aspect-[21/9]"
        >
          <img
            src="https://media.techbridge.edu.gh/media/banner5.jpeg"
            alt="Creative Studio"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex items-center p-8 md:p-16">
            <div className="max-w-xl text-white">
              <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4">Capturing the Essence of Your Brand</h2>
              <p className="text-lg text-white/90">
                Every pixel matters. We ensure your visual identity resonates with your audience.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
