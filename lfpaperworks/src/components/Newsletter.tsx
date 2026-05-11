import React, { useState } from 'react';
import { Mail, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus('loading');
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setStatus('success');
    setEmail('');
  };

  return (
    <section className="py-24 px-6 md:px-12 bg-brand-leaf border-y border-brand-linen overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div>
          <span className="label-caps text-tuc-gold mb-6 block">Stay Connected</span>
          <h2 className="text-4xl md:text-6xl editorial-heading mb-8">The Folded Letter</h2>
          <p className="text-lg text-brand-stone leading-relaxed mb-8">
            Subscribe to receive updates on new collections, exhibition announcements, 
            and behind-the-scenes stories from the studio.
          </p>
        </div>

        <div className="bg-white p-10 md:p-16 border border-brand-linen relative">
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 bg-brand-leaf rounded-full flex items-center justify-center mx-auto mb-6 text-tuc-gold">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-serif mb-2 italic">You're on the list</h3>
                <p className="text-brand-stone text-sm">Thank you for joining our community.</p>
                <button 
                  onClick={() => setStatus('idle')}
                  className="mt-8 label-caps text-[10px] text-tuc-gold hover:underline"
                >
                  Add another email
                </button>
              </motion.div>
            ) : (
              <motion.form 
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit} 
                className="space-y-8"
              >
                <div>
                  <label className="label-caps mb-4 block">Email Address</label>
                  <div className="relative">
                    <input 
                      required
                      type="email" 
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full p-4 border-b border-brand-linen focus:border-tuc-gold outline-none transition-all font-serif text-lg"
                      placeholder="jane@example.com"
                    />
                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-linen" />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={status === 'loading'}
                  className="btn-primary w-full py-5 flex items-center justify-center space-x-3 disabled:opacity-50"
                >
                  {status === 'loading' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Join Mailing List</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
                <p className="text-[10px] text-brand-stone text-center uppercase tracking-widest">
                  No spam. Only art. Unsubscribe anytime.
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
