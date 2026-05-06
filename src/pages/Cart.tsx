import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const Cart: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="pt-48 pb-24 px-6 text-center">
        <div className="max-w-md mx-auto">
          <ShoppingBag className="w-16 h-16 mx-auto text-brand-linen mb-8" />
          <h1 className="text-4xl editorial-heading mb-6">Your cart is empty</h1>
          <p className="text-brand-stone mb-12">
            It looks like you haven't added any book sculptures to your collection yet.
          </p>
          <Link to="/shop" className="btn-primary inline-block">
            Start Browsing
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
      <h1 className="text-5xl editorial-heading mb-16">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-10">
          <AnimatePresence>
            {cart.map(item => (
              <motion.div 
                key={item.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col md:flex-row gap-8 pb-10 border-b border-brand-linen"
              >
                <div className="w-full md:w-40 aspect-[3/4] bg-brand-leaf overflow-hidden flex-shrink-0">
                  <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                </div>
                
                <div className="flex-grow flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-serif mb-1">{item.productName}</h3>
                      {item.selectedVariant && (
                        <p className="text-sm text-brand-stone mb-1">
                          Size: <span className="text-brand-charcoal font-medium">{item.selectedVariant.label}</span>
                        </p>
                      )}
                      {item.customText && (
                        <p className="text-sm text-brand-stone italic">
                          Custom Text: <span className="text-brand-charcoal font-medium not-italic">"{item.customText}"</span>
                        </p>
                      )}
                    </div>
                    <p className="text-xl font-serif">${item.price * item.quantity}</p>
                  </div>

                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center border border-brand-linen">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-2 hover:bg-brand-leaf transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-2 hover:bg-brand-leaf transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-brand-stone hover:text-red-500 transition-colors flex items-center space-x-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="label-caps text-[10px]">Remove</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-10 border border-brand-linen sticky top-32">
            <h2 className="label-caps mb-8">Order Summary</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-brand-stone">
                <span>Subtotal</span>
                <span>${cartTotal}</span>
              </div>
              <div className="flex justify-between text-brand-stone">
                <span>Shipping</span>
                <span className="italic">Calculated at checkout</span>
              </div>
            </div>

            <div className="pt-8 border-t border-brand-linen flex justify-between items-end mb-10">
              <span className="label-caps">Total</span>
              <span className="text-3xl font-serif">${cartTotal}</span>
            </div>

            <Link 
              to="/checkout" 
              className="btn-primary w-full flex items-center justify-center space-x-3 py-5"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <p className="text-xs text-brand-stone text-center mt-6 leading-relaxed">
              Phase 1: Checkout will submit an inquiry. Payment integration coming in Phase 4.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
