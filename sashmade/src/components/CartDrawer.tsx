import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, X, Plus, Minus, Send } from 'lucide-react';
import { useCart } from '../context/CartContext';

export function CartDrawer() {
  const { isCartOpen, setIsCartOpen, cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();

  const handleWhatsAppCheckout = () => {
    const phoneNumber = "233247139986"; // Formatted for WhatsApp
    
    let message = "Hi SashMade! I would like to order:\n\n";
    cartItems.forEach(item => {
      message += `- ${item.quantity}x ${item.product.name} (₵${item.product.price})\n`;
    });
    message += `\n*Total: ₵${cartTotal}*\n\nPlease let me know the next steps for payment.`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-stone-900 shadow-2xl z-[101] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-[#4A5340] dark:text-[#D97706]" />
                <h2 className="font-serif text-xl font-bold text-[#4A5340] dark:text-[#D97706]">Your Cart</h2>
                <span className="bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-xs px-2 py-0.5 rounded-full ml-2">
                  {cartItems.length} items
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors text-stone-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-stone-500 space-y-4">
                  <ShoppingCart className="w-12 h-12 opacity-20" />
                  <p>Your cart is empty.</p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="px-6 py-2 bg-[#4A5340] text-white rounded-full text-sm font-medium hover:bg-[#3A4232] transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.product.id} className="flex gap-4 p-4 bg-stone-50 dark:bg-stone-800/50 rounded-2xl border border-stone-100 dark:border-stone-700/50">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-xl bg-white dark:bg-stone-900"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-[#4A5340] dark:text-white leading-tight">
                            {item.product.name}
                          </h3>
                          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                            {item.product.category}
                          </p>
                        </div>
                        <p className="font-bold text-[#D97706]">
                          ₵{item.product.price}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-700 p-1">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 hover:bg-stone-100 dark:hover:bg-stone-800 rounded transition-colors text-stone-600 dark:text-stone-400"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 hover:bg-stone-100 dark:hover:bg-stone-800 rounded transition-colors text-stone-600 dark:text-stone-400"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-xs text-red-500 hover:text-red-600 font-medium hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/50">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-stone-600 dark:text-stone-300 font-medium">Subtotal</span>
                  <span className="font-serif text-2xl font-bold text-[#4A5340] dark:text-[#D97706]">
                    ₵{cartTotal}
                  </span>
                </div>
                <p className="text-xs text-stone-500 mb-6 font-medium">
                  Taxes and shipping calculated at checkout.
                </p>
                <button
                  onClick={handleWhatsAppCheckout}
                  className="w-full flex items-center justify-center gap-2 bg-[#16a34a] hover:bg-[#15803d] text-white py-4 rounded-xl font-bold transition-colors shadow-lg shadow-green-500/20"
                >
                  <Send className="w-5 h-5" />
                  Order via WhatsApp
                </button>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-full mt-3 py-3 text-sm font-bold text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
