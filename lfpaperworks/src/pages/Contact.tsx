import React, { useState } from 'react';
import { Mail, MapPin, Send } from 'lucide-react';

const Contact: React.FC = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In Phase 1, we just simulate submission
    setSubmitted(true);
  };

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        {/* Contact Info */}
        <div>
          <span className="label-caps text-tuc-gold mb-6 block">Get in Touch</span>
          <h1 className="text-5xl md:text-7xl editorial-heading mb-12">Commissions & Inquiries</h1>
          
          <div className="space-y-12 mb-16">
            <div className="flex items-start space-x-6">
              <div className="w-12 h-12 bg-brand-leaf flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-brand-midnight" />
              </div>
              <div>
                <h4 className="label-caps mb-2">Email</h4>
                <a href="mailto:info@lfpaperworks.com" className="text-xl font-serif italic hover:text-tuc-gold transition-colors">
                  info@lfpaperworks.com
                </a>
              </div>
            </div>
            
            <div className="flex items-start space-x-6">
              <div className="w-12 h-12 bg-brand-leaf flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-brand-midnight" />
              </div>
              <div>
                <h4 className="label-caps mb-2">Studio Location</h4>
                <p className="text-xl font-serif italic">Lebanon, New Hampshire</p>
                <p className="text-brand-stone">United States</p>
              </div>
            </div>
          </div>

          <div className="p-10 bg-brand-leaf border border-brand-linen">
            <h3 className="font-serif text-2xl mb-4 italic">Custom Commissions</h3>
            <p className="text-brand-stone leading-relaxed">
              Looking for a specific word, date, or pattern? Luciana accepts a limited number 
              of custom commissions each month. Please use the form to share your vision, 
              and we will get back to you with a quote and timeline.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-10 md:p-16 border border-brand-linen">
          {submitted ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-brand-leaf rounded-full flex items-center justify-center mx-auto mb-8 text-tuc-gold">
                <Send className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-serif mb-4">Message Sent</h2>
              <p className="text-brand-stone">
                Thank you for reaching out. Luciana will review your inquiry and respond within 2-3 business days.
              </p>
              <button 
                onClick={() => setSubmitted(false)}
                className="mt-10 label-caps text-tuc-gold hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="label-caps mb-4 block">Full Name</label>
                <input 
                  required
                  type="text" 
                  value={formState.name}
                  onChange={e => setFormState({...formState, name: e.target.value})}
                  className="w-full p-4 border-b border-brand-linen focus:border-tuc-gold outline-none transition-all font-serif text-lg"
                  placeholder="Jane Doe"
                />
              </div>
              
              <div>
                <label className="label-caps mb-4 block">Email Address</label>
                <input 
                  required
                  type="email" 
                  value={formState.email}
                  onChange={e => setFormState({...formState, email: e.target.value})}
                  className="w-full p-4 border-b border-brand-linen focus:border-tuc-gold outline-none transition-all font-serif text-lg"
                  placeholder="jane@example.com"
                />
              </div>

              <div>
                <label className="label-caps mb-4 block">Subject</label>
                <select 
                  value={formState.subject}
                  onChange={e => setFormState({...formState, subject: e.target.value})}
                  className="w-full p-4 border-b border-brand-linen focus:border-tuc-gold outline-none transition-all font-serif text-lg bg-transparent"
                >
                  <option>General Inquiry</option>
                  <option>Custom Commission</option>
                  <option>Wholesale/Retail</option>
                  <option>Press Inquiry</option>
                </select>
              </div>

              <div>
                <label className="label-caps mb-4 block">Message</label>
                <textarea 
                  required
                  value={formState.message}
                  onChange={e => setFormState({...formState, message: e.target.value})}
                  className="w-full p-4 border border-brand-linen focus:border-tuc-gold outline-none transition-all min-h-[150px] font-serif text-lg"
                  placeholder="Tell us about your inquiry..."
                />
              </div>

              <button type="submit" className="btn-primary w-full py-5 flex items-center justify-center space-x-3">
                <span>Send Message</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
