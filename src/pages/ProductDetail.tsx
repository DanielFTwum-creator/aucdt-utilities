import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { products } from '../data/mockData';
import { useCart } from '../context/CartContext';
import { motion } from 'motion/react';
import { ChevronRight, Minus, Plus, ShoppingBag } from 'lucide-react';
import { cn } from '../lib/utils';

const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const product = products.find(p => p.slug === slug);
  
  const [selectedVariant, setSelectedVariant] = useState(product?.variants?.[0] || undefined);
  const [customText, setCustomText] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!product) {
      navigate('/shop');
    }
  }, [product, navigate]);

  if (!product) return null;

  const handleAddToCart = () => {
    if (product.requiresCustomInput && !customText.trim()) {
      setError('Please enter your custom text.');
      return;
    }
    
    addToCart(product, quantity, selectedVariant, customText);
    navigate('/cart');
  };

  const currentPrice = selectedVariant?.priceOverride || product.basePrice;

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-sm text-brand-stone mb-12">
        <Link to="/" className="hover:text-tuc-gold transition-colors">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/shop" className="hover:text-tuc-gold transition-colors">Shop</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-brand-charcoal">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        {/* Image Gallery */}
        <div className="space-y-6">
          <div className="aspect-[3/4] bg-brand-leaf overflow-hidden">
            <motion.img 
              key={activeImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              src={product.images[activeImage]} 
              alt={product.name} 
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={cn(
                    "aspect-square bg-brand-leaf overflow-hidden border-2 transition-all",
                    activeImage === idx ? "border-tuc-gold" : "border-transparent"
                  )}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <span className="label-caps text-tuc-gold mb-4">{product.category}</span>
          <h1 className="text-4xl md:text-6xl editorial-heading mb-6">{product.name}</h1>
          <p className="text-3xl font-serif mb-8">${currentPrice}</p>
          
          <div className="prose prose-brand-stone mb-12">
            <p className="text-lg text-brand-stone leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Configurator */}
          <div className="space-y-10 mb-12">
            {product.variants && (
              <div>
                <label className="label-caps mb-4 block">Select Size</label>
                <div className="grid grid-cols-3 gap-4">
                  {product.variants.map(variant => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={cn(
                        "py-3 border text-sm font-medium transition-all",
                        selectedVariant?.id === variant.id 
                          ? "border-tuc-gold bg-brand-leaf text-brand-charcoal" 
                          : "border-brand-linen text-brand-stone hover:border-brand-stone"
                      )}
                    >
                      {variant.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.requiresCustomInput && (
              <div>
                <label className="label-caps mb-4 block">{product.customInputLabel}</label>
                <textarea
                  value={customText}
                  onChange={(e) => {
                    setCustomText(e.target.value);
                    setError(null);
                  }}
                  placeholder="Type here..."
                  className="w-full p-4 border border-brand-linen focus:border-tuc-gold focus:ring-0 outline-none transition-all min-h-[100px] font-serif italic text-lg"
                />
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              </div>
            )}

            <div className="flex items-center space-x-8">
              <div>
                <label className="label-caps mb-4 block">Quantity</label>
                <div className="flex items-center border border-brand-linen">
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="p-3 hover:bg-brand-leaf transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(q => q + 1)}
                    className="p-3 hover:bg-brand-leaf transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={handleAddToCart}
            className="btn-primary w-full flex items-center justify-center space-x-3 py-5"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Add to Cart</span>
          </button>

          {/* Specifications */}
          <div className="mt-12 pt-12 border-t border-brand-linen space-y-8">
            <div>
              <h3 className="label-caps mb-4 text-brand-charcoal">Specifications</h3>
              <div className="grid grid-cols-2 gap-y-4 text-sm">
                {product.dimensions && (
                  <>
                    <span className="text-brand-stone italic">Dimensions</span>
                    <span className="text-brand-charcoal text-right">{product.dimensions}</span>
                  </>
                )}
                {product.material && (
                  <>
                    <span className="text-brand-stone italic">Material</span>
                    <span className="text-brand-charcoal text-right">{product.material}</span>
                  </>
                )}
                {product.estimatedShipping && (
                  <>
                    <span className="text-brand-stone italic">Shipping</span>
                    <span className="text-brand-charcoal text-right">{product.estimatedShipping}</span>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-6 pt-4">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-brand-leaf flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold">01</span>
                </div>
                <div>
                  <h4 className="font-serif italic mb-1 text-brand-charcoal">Handcrafted in NH</h4>
                  <p className="text-sm text-brand-stone leading-relaxed">Meticulously folded by Luciana Frigerio in Lebanon, New Hampshire.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-brand-leaf flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold">02</span>
                </div>
                <div>
                  <h4 className="font-serif italic mb-1 text-brand-charcoal">Sustainable Art</h4>
                  <p className="text-sm text-brand-stone leading-relaxed">We use vintage and repurposed books, giving them a second life as sculpture.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
