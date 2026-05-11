import { motion } from "motion/react";

export default function Artist() {
  return (
    <div className="w-full max-w-[1200px] mx-auto px-10 py-16 flex gap-16" role="main" aria-labelledby="artist-heading">
      {/* Left Col - Image */}
      <motion.div 
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-5/12 shrink-0"
      >
        <div className="aspect-[3/4] border border-theme-border p-4 bg-gold/5 relative">
          <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-gold -mt-2 -mr-2" aria-hidden="true" />
          <div className="absolute bottom-0 left-0 w-16 h-16 border-b border-l border-gold -mb-2 -ml-2" aria-hidden="true" />
          <img 
            src="/media/pots-by-kr/IMG_0178.webp"
            alt="Featured ceramic piece in the studio"
            className="w-full h-full object-cover grayscale-[30%]"
          />
        </div>
        <div className="mt-8 border-l border-gold pl-6">
          <p className="font-cormorant italic text-gold-pale text-xl leading-relaxed">
            "Clay is not merely material; it is memory. Every touch, every firing, records a moment in time that outlasts us all."
          </p>
        </div>
      </motion.div>

      {/* Right Col - Bio */}
      <motion.div 
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="w-7/12 pt-8"
      >
        <h2 className="font-bebas text-gold tracking-[0.4em] text-xl mb-4 uppercase" aria-hidden="true">The Curator</h2>
        <h1 id="artist-heading" className="font-playfair font-black text-6xl text-theme-text mb-10 leading-none">Master of the Kiln</h1>
        
        <div className="space-y-6 font-cormorant font-light text-xl text-theme-text leading-[1.8]">
          <p>
            For over four decades, the studio has been a sanctuary of transformation. What began as a pursuit of functional perfection evolved into a lifelong dialogue with earth, water, and fire.
          </p>
          <p>
            The work is characterized by a deep reverence for traditional techniques, seamlessly interwoven with a contemporary sculptural sensibility. Early years were defined by rigorous mastery of the wheel and high-fire stoneware, producing vessels that spoke of utility and grace.
          </p>
          <p>
            As the practice matured, the focus shifted toward the unpredictable alchemy of Raku and wood-firing. Here, control is relinquished to the flames, resulting in surfaces that map the chaotic beauty of the firing process itself.
          </p>
        </div>

        <div className="mt-16 pt-12 border-t border-theme-border grid grid-cols-2 gap-12">
          <section aria-labelledby="exhibitions-heading">
            <h3 id="exhibitions-heading" className="font-bebas text-gold tracking-[0.2em] text-2xl mb-6 uppercase">Selected Exhibitions</h3>
            <ul className="space-y-4 font-cormorant text-lg text-gold-pale" aria-label="List of selected exhibitions">
              <li><span className="text-theme-text mr-4" aria-label="Year 2025">2025</span> The Vessel Reimagined, London</li>
              <li><span className="text-theme-text mr-4" aria-label="Year 2018">2018</span> Earth & Alchemy Retrospective, NY</li>
              <li><span className="text-theme-text mr-4" aria-label="Year 2012">2012</span> Biennale of Contemporary Clay</li>
              <li><span className="text-theme-text mr-4" aria-label="Year 2005">2005</span> Masters of Raku, Kyoto</li>
            </ul>
          </section>
          <section aria-labelledby="collections-heading">
            <h3 id="collections-heading" className="font-bebas text-gold tracking-[0.2em] text-2xl mb-6 uppercase">Collections</h3>
            <ul className="space-y-4 font-cormorant text-lg text-gold-pale" aria-label="List of permanent collections">
              <li>National Museum of Modern Art</li>
              <li>The Victoria & Albert Museum</li>
              <li>Private Collection, Geneva</li>
              <li>Foundation for Ceramic Arts</li>
            </ul>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
