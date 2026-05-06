import React, { useState, useMemo, useEffect } from 'react';
import { MOCK_PROPERTIES, REGIONS, TOWNS } from './constants';
import { Property, CartItem, OrderFormValues, SERVICE_CHARGE_RATE, ThemeMode, AuditLogEntry } from './types';
import PropertyCard from './components/PropertyCard';
import CartDrawer from './components/CartDrawer';
import Hero from './components/Hero';
import Footer from './components/Footer';
import AIAssistant from './components/AIAssistant';
import AdminDashboard from './components/AdminDashboard';
import ThemeToggle from './components/ThemeToggle';
import TestingSuite from './components/TestingSuite';
import { ShoppingCart, Menu, Search, Filter, FlaskConical } from 'lucide-react';

function App() {
  // App State
  const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [view, setView] = useState<'home' | 'checkout' | 'success' | 'admin' | 'admin-login' | 'testing'>('home');
  const [theme, setTheme] = useState<ThemeMode>('light');
  
  // Admin State
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [adminError, setAdminError] = useState('');

  // Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTown, setSelectedTown] = useState('');
  
  // Form State
  const [formValues, setFormValues] = useState<OrderFormValues>({
    name: '', email: '', phone: '', region: 'Accra', town: 'Adenta', area: '', addressType: 'Home'
  });

  // Effect: Handle Theme Changes
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark', 'high-contrast');
    root.classList.add(theme);
    
    // Accessibility: Reduced motion if needed
  }, [theme]);

  // Helper: Log Actions
  const logAction = (action: string, details: string, user: string = 'System') => {
    const newLog: AuditLogEntry = {
      id: Date.now().toString(),
      timestamp: new Date(),
      action,
      details,
      user
    };
    setAuditLogs(prev => [...prev, newLog]);
  };

  // Calculate totals
  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.price, 0);
  const cartTotal = cartSubtotal + (cartSubtotal * SERVICE_CHARGE_RATE);

  // Filtering Logic
  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTown = selectedTown ? p.location.includes(selectedTown) : true;
      return matchesSearch && matchesTown;
    });
  }, [properties, searchQuery, selectedTown]);

  const handleAddToCart = (property: Property, type: 'main' | 'view') => {
    const isView = type === 'view';
    const newItem: CartItem = {
      id: `${property.id}_${type}`,
      propertyId: property.id,
      title: `${property.title} (${isView ? 'Visit' : 'Acquire'})`,
      serviceType: isView ? 'Drive-to-View' : 'Purchase/Rent',
      price: isView ? property.driveToViewPrice : property.price
    };

    setCartItems(prev => {
      if (prev.find(item => item.id === newItem.id)) {
        alert("This item is already in your cart.");
        return prev;
      }
      setIsCartOpen(true);
      return [...prev, newItem];
    });
    logAction('Cart Add', `Added ${property.title} (${type})`, 'Guest');
  };

  const handleRemoveFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setView('success');
    window.scrollTo(0, 0);
    logAction('Checkout', `Order placed by ${formValues.name} for Gh₵${cartTotal}`, 'Guest');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  // Admin Handlers
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPasswordInput === 'pama123') { 
      setView('admin');
      setAdminError('');
      setAdminPasswordInput('');
      logAction('Login', 'Admin logged in successfully', 'Admin');
    } else {
      setAdminError('Invalid credentials');
      logAction('Login Failed', 'Invalid password attempt', 'Unknown');
    }
  };

  const handleAddProperty = (newProp: Property) => {
    setProperties(prev => [newProp, ...prev]);
    logAction('Property Create', `Created property: ${newProp.title}`, 'Admin');
  };

  const handleDeleteProperty = (id: string) => {
    const prop = properties.find(p => p.id === id);
    if(prop) {
      setProperties(prev => prev.filter(p => p.id !== id));
      logAction('Property Delete', `Deleted: ${prop.title}`, 'Admin');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-900 font-sans transition-colors duration-300">
      
      {/* Sticky Header (Hidden in Admin Mode) */}
      {view !== 'admin' && (
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              
              {/* Logo */}
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
                 <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-600/20">
                   P
                 </div>
                 <span className="text-xl font-bold text-gray-900 dark:text-white hidden sm:block">Pama Realtor</span>
              </div>

              {/* Desktop Nav */}
              <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-600 dark:text-gray-300">
                <a href="#top" onClick={() => setView('home')} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Home</a>
                <a href="#top" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Rent</a>
                <a href="#top" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Buy</a>
                <a href="#top" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">About Us</a>
              </nav>

              {/* Actions */}
              <div className="flex items-center gap-4">
                <ThemeToggle currentTheme={theme} onThemeChange={setTheme} />
                
                <button 
                  onClick={() => setIsCartOpen(true)}
                  className="relative p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors group"
                  aria-label="Open Cart"
                >
                  <ShoppingCart className="text-gray-700 dark:text-gray-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" size={24} />
                  {cartItems.length > 0 && (
                    <span className="absolute top-1 right-0 w-5 h-5 bg-red-500 border-2 border-white dark:border-slate-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                      {cartItems.length}
                    </span>
                  )}
                </button>
                <button className="md:hidden p-2">
                  <Menu className="text-gray-700 dark:text-gray-300" size={24} />
                </button>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main className="flex-grow animate-in fade-in duration-500 relative">
        
        {view === 'testing' && (
          <TestingSuite onClose={() => setView('home')} />
        )}

        {view === 'admin' && (
          <div className="relative">
             <AdminDashboard 
              properties={properties}
              auditLogs={auditLogs}
              onAddProperty={handleAddProperty}
              onDeleteProperty={handleDeleteProperty}
              onLogout={() => {
                setView('home');
                logAction('Logout', 'Admin logged out', 'Admin');
              }}
            />
            {/* Secret button to launch testing suite from admin */}
            <button 
              onClick={() => setView('testing')}
              className="fixed bottom-6 right-6 z-50 p-3 bg-gray-900 text-white rounded-full hover:bg-black shadow-lg"
              title="Launch Testing Suite"
            >
              <FlaskConical size={20} />
            </button>
          </div>
        )}

        {view === 'admin-login' && (
          <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 px-4">
            <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-slate-700">
               <div className="text-center mb-8">
                 <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                 </div>
                 <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Access</h1>
                 <p className="text-gray-500 dark:text-gray-400">Restricted Area. Authorized Personnel Only.</p>
               </div>
               <form onSubmit={handleAdminLogin} className="space-y-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                   <input 
                      type="password"
                      value={adminPasswordInput}
                      onChange={(e) => setAdminPasswordInput(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-shadow"
                      placeholder="••••••••"
                   />
                 </div>
                 {adminError && (
                   <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg flex items-center gap-2">
                     <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                     {adminError}
                   </div>
                 )}
                 <button type="submit" className="w-full bg-gray-900 dark:bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-gray-800 dark:hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl active:scale-[0.98]">
                   Access Dashboard
                 </button>
                 <button 
                  type="button" 
                  onClick={() => setView('home')}
                  className="w-full text-gray-500 dark:text-gray-400 py-2 text-sm hover:underline"
                 >
                   Return to Home
                 </button>
               </form>
            </div>
          </div>
        )}
        
        {view === 'home' && (
          <>
            <Hero />
            
            {/* Filter Bar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10 mb-12">
              <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-xl flex flex-col md:flex-row gap-4 items-center border border-gray-100 dark:border-slate-700 backdrop-blur-sm">
                <div className="flex-1 w-full relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
                  <input 
                    type="text"
                    placeholder="Search by location or property type..."
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-slate-600 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="w-full md:w-auto min-w-[200px] relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <select 
                    className="w-full pl-10 pr-8 py-3 rounded-lg border border-gray-200 dark:border-slate-600 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none cursor-pointer hover:border-emerald-500 transition-colors"
                    value={selectedTown}
                    onChange={(e) => setSelectedTown(e.target.value)}
                    aria-label="Filter by Town"
                  >
                    <option value="">All Towns</option>
                    {TOWNS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Property Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Featured Properties</h2>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">Discover your next dream home or investment</p>
                </div>
                <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 text-sm font-semibold px-3 py-1 rounded-full">
                  {filteredProperties.length} listings
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProperties.map(property => (
                  <PropertyCard 
                    key={property.id} 
                    property={property} 
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
              
              {filteredProperties.length === 0 && (
                <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-gray-300 dark:border-slate-700">
                  <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
                     <Search className="text-gray-400" size={24} />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-lg">No properties match your search.</p>
                  <button 
                    onClick={() => {setSearchQuery(''); setSelectedTown('');}}
                    className="mt-4 text-emerald-600 hover:underline font-medium"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {view === 'checkout' && (
          <div className="max-w-3xl mx-auto px-4 py-12">
            <button 
              onClick={() => setView('home')}
              className="mb-8 text-gray-500 dark:text-gray-400 hover:text-emerald-600 font-medium flex items-center gap-2 group"
            >
              <span className="transform group-hover:-translate-x-1 transition-transform">←</span> Back to listings
            </button>
            
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Secure Checkout</h1>
            
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
              <div className="p-8 border-b border-gray-100 dark:border-slate-700">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Order Summary</h2>
                <div className="space-y-3">
                   {cartItems.map(item => (
                     <div key={item.id} className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                       <span>{item.title}</span>
                       <span className="font-medium text-gray-900 dark:text-white">Gh₵ {item.price.toLocaleString()}</span>
                     </div>
                   ))}
                   <div className="pt-4 mt-4 border-t border-dashed border-gray-200 dark:border-slate-700 flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                     <span>Total Due</span>
                     <span>Gh₵ {cartTotal.toLocaleString()}</span>
                   </div>
                </div>
              </div>

              <div className="p-8 bg-gray-50/50 dark:bg-slate-900/50">
                <form onSubmit={handleCheckoutSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                      <input 
                        required 
                        name="name"
                        value={formValues.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none" 
                        placeholder="John Doe" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                      <input 
                        required 
                        type="email" 
                        name="email"
                        value={formValues.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none" 
                        placeholder="john@example.com" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                      <input 
                        required 
                        type="tel" 
                        name="phone"
                        value={formValues.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none" 
                        placeholder="024 123 4567" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Region</label>
                      <select 
                        name="region"
                        value={formValues.region}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      >
                        {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Address Type</label>
                     <div className="flex gap-6">
                       {['Home', 'Office', 'Campus'].map((type) => (
                         <label key={type} className="flex items-center cursor-pointer group">
                           <div className="relative flex items-center">
                             <input 
                                type="radio" 
                                name="addressType" 
                                value={type}
                                checked={formValues.addressType === type}
                                onChange={handleInputChange}
                                className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-gray-300" 
                             />
                           </div>
                           <span className="ml-2 text-gray-700 dark:text-gray-300 group-hover:text-emerald-600 transition-colors">{type}</span>
                         </label>
                       ))}
                     </div>
                  </div>

                  <button type="submit" className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg hover:shadow-xl hover:shadow-emerald-500/20 mt-6 active:scale-[0.99]">
                    Confirm Order & Pay
                  </button>
                  <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                    By confirming, you agree to our terms of service. Secure payment processing powered by PayStack/Flutterwave.
                  </p>
                </form>
              </div>
            </div>
          </div>
        )}

        {view === 'success' && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center animate-in zoom-in duration-300">
            <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6 animate-bounce">
              <svg className="w-12 h-12 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Order Confirmed!</h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-md mb-8">
              Thank you, {formValues.name}. We have received your order request. Our team will contact you shortly at {formValues.phone} to finalize the arrangements.
            </p>
            <div className="space-x-4">
              <button 
                onClick={() => {
                  setCartItems([]);
                  setView('home');
                }}
                className="bg-gray-900 dark:bg-white dark:text-gray-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors shadow-lg hover:shadow-xl"
              >
                Return Home
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Footer handles its own view logic, only hides when in admin mode */}
      {view !== 'admin' && view !== 'testing' && <Footer onAdminClick={() => setView('admin-login')} />}
      
      {/* AI Assistant available everywhere except strictly excluded views */}
      {view !== 'admin' && view !== 'testing' && <AIAssistant />}

      {/* Floating Action Button - WhatsApp (Hidden in Admin/Testing) */}
      {view !== 'admin' && view !== 'testing' && (
        <a 
          href="https://wa.me/233277351121" 
          target="_blank" 
          rel="noopener noreferrer"
          className="fixed bottom-6 left-6 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:bg-[#128C7E] transition-all z-40 flex items-center gap-2 group hover:shadow-[#25D366]/40"
          aria-label="Chat on WhatsApp"
        >
          <img src="https://img.icons8.com/ios-filled/50/ffffff/whatsapp--v1.png" className="w-6 h-6" alt="" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap font-medium">Chat with us</span>
        </a>
      )}

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cartItems}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={() => {
          setIsCartOpen(false);
          setView('checkout');
        }}
      />
    </div>
  );
}

export default App;