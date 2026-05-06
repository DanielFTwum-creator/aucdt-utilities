import React from 'react';
import { Link } from 'react-router-dom';
import { products } from '../data/mockData';
import { motion } from 'motion/react';

const Shop: React.FC = () => {
  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
      <header className="mb-16">
        <span className="label-caps text-tuc-gold mb-4 block">The Collection</span>
        <h1 className="text-5xl md:text-7xl editorial-heading mb-6">Browse Art</h1>
        <p className="text-lg text-brand-stone max-w-2xl leading-relaxed">
          Explore our collection of handcrafted book sculptures. From ready-to-ship geometric 
          designs to bespoke personalized creations, each piece is a unique narrative.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
        {products.map((product, index) => (
          <motion.div 
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
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
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-serif mb-2">{product.name}</h3>
                  <p className="label-caps text-brand-stone">{product.category}</p>
                </div>
                <p className="font-serif text-xl">
                  {product.variants ? `From $${product.basePrice}` : `$${product.basePrice}`}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Shop;
