import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { products, testimonials } from '../data/mockData';
import { ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';
import InstagramFeed from '../components/InstagramFeed';
import Newsletter from '../components/Newsletter';

const Home: React.FC = () => {
  return (
    <div className="pt-0">
      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-tuc-ink">
        <div className="absolute inset-0 opacity-40">
          <img 
            src="https://picsum.photos/seed/book-bees/1920/1080" 
            alt="Handcrafted Paper Art" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white text-6xl md:text-9xl font-serif tracking-tight mb-8"
          >
            LFPaperWorks
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-white text-xl md:text-2xl font-serif italic mb-12 leading-relaxed opacity-90"
          >
            Exploring the intersection of object, sculpture, and photography.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col md:flex-row items-center justify-center gap-6"
          >
            <Link to="/shop" className="bg-white text-brand-charcoal px-10 py-4 rounded-sm font-sans font-medium transition-all hover:bg-brand-leaf active:scale-[0.98] min-w-[200px]">
              View Portfolio
            </Link>
            <Link to="/shop" className="border border-white text-white px-10 py-4 rounded-sm font-sans font-medium transition-all hover:bg-white/10 active:scale-[0.98] min-w-[200px]">
              Shop Books
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-24 px-6 bg-brand-leaf text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-2xl md:text-3xl font-serif leading-relaxed text-brand-midnight">
            "I believe every book has a second life. Through meticulous folding, 
            I transform vintage pages into sculptures that celebrate memory, 
            connection, and the enduring beauty of the written word."
          </p>
          <p className="label-caps mt-8 text-tuc-gold">— Luciana Frigerio</p>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="label-caps text-tuc-gold mb-4 block">Curated Selection</span>
            <h2 className="text-4xl md:text-5xl editorial-heading">Featured Works</h2>
          </div>
          <Link to="/shop" className="hidden md:flex items-center text-brand-stone hover:text-tuc-gold transition-colors">
            <span className="label-caps mr-2">Shop All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {products.filter(p => p.featured).slice(0, 3).map((product, index) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <Link to={`/product/${product.slug}`}>
                <div className="aspect-[3/4] overflow-hidden bg-brand-leaf mb-6">
                  <img 
                    src={product.images[0]} 
                    alt={product.name} 
                    className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h3 className="text-xl font-serif mb-2">{product.name}</h3>
                <p className="label-caps text-brand-stone">From ${product.basePrice}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Artist Statement / About Preview */}
      <section className="py-24 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="order-2 md:order-1">
            <span className="label-caps text-tuc-gold mb-6 block">The Artist</span>
            <h2 className="text-4xl md:text-6xl editorial-heading mb-8">Luciana Frigerio</h2>
            <p className="text-lg text-brand-stone leading-relaxed mb-8">
              Based in the quiet hills of Lebanon, New Hampshire, Luciana has spent over a decade 
              perfecting the art of book folding. Her work has been featured in international 
              publications and sits in private collections worldwide.
            </p>
            <Link to="/about" className="btn-secondary">
              Learn More
            </Link>
          </div>
          <div className="order-1 md:order-2 aspect-[4/5] bg-brand-leaf overflow-hidden">
            <img 
              src="https://picsum.photos/seed/artist/800/1000" 
              alt="Luciana Frigerio" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 px-6 md:px-12 bg-brand-ivory">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="label-caps text-tuc-gold mb-4 block">The Craft</span>
            <h2 className="text-4xl md:text-5xl editorial-heading">Meticulous by Design</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="aspect-video bg-brand-leaf overflow-hidden">
              <img 
                src="https://picsum.photos/seed/process1/1200/800" 
                alt="Folding Process" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h3 className="text-2xl font-serif mb-6 italic">No pages are cut. No glue is used.</h3>
              <p className="text-brand-stone leading-relaxed">
                Each sculpture is created by precisely folding every single page of a book. 
                Depending on the complexity of the design, a single piece can take anywhere 
                from 10 to 40 hours of focused manual labor. This commitment to traditional 
                craft ensures that each piece is not just art, but a testament to patience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 md:px-12 bg-white border-y border-brand-linen">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {testimonials.map((t, index) => (
              <div key={t.id} className={cn("p-12", index === 0 && "md:border-r border-brand-linen")}>
                <p className="text-2xl font-serif italic mb-8">"{t.quote}"</p>
                <div>
                  <p className="label-caps text-brand-charcoal">{t.customerName}</p>
                  <p className="text-sm text-brand-stone italic">
                    Purchased: {t.productPurchased} {t.date && `— ${t.date}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Feed */}
      <InstagramFeed />

      {/* Newsletter */}
      <Newsletter />

      {/* Final CTA */}
      <section className="relative py-32 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/seed/cta/1920/1080?blur=5" 
            alt="Background" 
            className="w-full h-full object-cover opacity-20"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-6xl editorial-heading mb-8">Ready to start your story?</h2>
          <p className="text-lg text-brand-stone mb-12">
            Browse our ready-to-ship collection or commission a custom piece uniquely yours.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-6">
            <Link to="/shop" className="btn-primary">Shop Collection</Link>
            <Link to="/contact" className="btn-secondary">Custom Commission</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
