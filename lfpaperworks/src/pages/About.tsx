import React from 'react';
import { exhibitions } from '../data/mockData';
import { motion } from 'motion/react';

const About: React.FC = () => {
  return (
    <div className="pt-32 pb-24">
      {/* Intro */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto mb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="aspect-[4/5] bg-brand-leaf overflow-hidden">
            <img 
              src="https://picsum.photos/seed/artist2/800/1000" 
              alt="Luciana Frigerio in her studio" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <span className="label-caps text-tuc-gold mb-6 block">The Artist</span>
            <h1 className="text-5xl md:text-7xl editorial-heading mb-8">Luciana Frigerio</h1>
            <div className="prose prose-brand-stone max-w-none">
              <p className="text-xl text-brand-midnight leading-relaxed mb-6 italic">
                "I see books not just as vessels for information, but as physical memories 
                waiting to be reshaped."
              </p>
              <p className="text-lg text-brand-stone leading-relaxed mb-6">
                Luciana Frigerio is an Italian-born artist based in Lebanon, New Hampshire. 
                Her journey into book folding began as an experiment in tactile storytelling, 
                blending her background in photography and design with a deep love for 
                vintage literature.
              </p>
              <p className="text-lg text-brand-stone leading-relaxed">
                Over the past decade, she has refined a technique that requires no cutting 
                or glue, relying solely on the mathematical precision of folding to create 
                complex typography and geometric forms. Her work challenges the viewer to 
                reconsider the book as an object of art, frozen in a moment of transformation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Exhibitions */}
      <section className="bg-brand-leaf py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
            <h2 className="text-4xl md:text-5xl editorial-heading">Selected Exhibitions</h2>
            <p className="label-caps text-tuc-gold">2015 — Present</p>
          </div>

          <div className="space-y-12">
            {exhibitions.map((ex, idx) => (
              <motion.div 
                key={ex.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-brand-linen last:border-0"
              >
                <div className="md:col-span-1">
                  <p className="font-serif text-2xl italic">{ex.year}</p>
                  {ex.date && <p className="text-xs label-caps text-brand-stone mt-2">{ex.date}</p>}
                </div>
                <div className="md:col-span-3">
                  <h3 className="text-2xl font-serif mb-2">{ex.title}</h3>
                  <p className="label-caps text-brand-stone mb-4">{ex.venue}</p>
                  <p className="text-brand-stone leading-relaxed">{ex.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Studio Philosophy */}
      <section className="py-32 px-6 md:px-12 max-w-5xl mx-auto text-center">
        <h2 className="text-4xl editorial-heading mb-12 italic">The Studio Philosophy</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h4 className="label-caps mb-4">Preservation</h4>
            <p className="text-sm text-brand-stone leading-relaxed">
              We exclusively use vintage books that have been retired from libraries or 
              donated, ensuring no new resources are consumed.
            </p>
          </div>
          <div>
            <h4 className="label-caps mb-4">Precision</h4>
            <p className="text-sm text-brand-stone leading-relaxed">
              Every fold is measured to the millimeter. There are no shortcuts in 
              the pursuit of perfect geometry.
            </p>
          </div>
          <div>
            <h4 className="label-caps mb-4">Patience</h4>
            <p className="text-sm text-brand-stone leading-relaxed">
              In a world of mass production, we celebrate the slow, intentional 
              process of creation by hand.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
