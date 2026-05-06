import React from 'react';
import { CartItem, SERVICE_CHARGE_RATE } from '../types';
import { X, Trash2, ArrowRight } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, items, onRemoveItem, onCheckout }) => {
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const serviceCharge = subtotal * SERVICE_CHARGE_RATE;
  const total = subtotal + serviceCharge;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="absolute inset-y-0 right-0 max-w-md w-full flex">
        <div className="w-full bg-white shadow-2xl flex flex-col h-full transform transition-transform animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white z-10">
            <h2 className="text-xl font-bold text-gray-800">Your Selection</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X size={24} className="text-gray-500" />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <ShoppingCartIcon className="w-16 h-16 mb-4 opacity-20" />
                <p>Your cart is empty</p>
                <button onClick={onClose} className="mt-4 text-emerald-600 hover:underline">
                  Browse Properties
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex flex-col bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-800 pr-4">{item.title}</h4>
                    <button 
                      onClick={() => onRemoveItem(item.id)}
                      className="text-red-400 hover:text-red-600 transition-colors p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="px-2 py-1 bg-white rounded text-gray-600 text-xs border border-gray-200">
                      {item.serviceType}
                    </span>
                    <span className="font-bold text-gray-900">Gh₵ {item.price.toLocaleString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-gray-100 p-6 bg-gray-50">
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>Gh₵ {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Service Charge (5%)</span>
                  <span>Gh₵ {serviceCharge.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-4 border-t border-gray-200">
                  <span>Total</span>
                  <span>Gh₵ {total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
              
              <button
                onClick={onCheckout}
                className="w-full bg-gray-900 text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform active:scale-[0.98]"
              >
                Proceed to Checkout
                <ArrowRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper component for empty state
const ShoppingCartIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

export default CartDrawer;