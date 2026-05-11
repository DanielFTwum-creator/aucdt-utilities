import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-brand-linen pt-20 pb-10 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
        <div className="md:col-span-2">
          <Link to="/" className="inline-block mb-6">
            <span className="font-serif text-3xl font-bold">LFPaperWorks</span>
          </Link>
          <p className="text-brand-stone max-w-md leading-relaxed mb-8">
            Handcrafted book sculptures and paper art by Luciana Frigerio. 
            Each piece is a unique narrative, meticulously folded to bring stories to life.
          </p>
          <div className="flex space-x-6">
            <a href="#top" className="label-caps hover:text-tuc-gold transition-colors">Instagram</a>
            <a href="#top" className="label-caps hover:text-tuc-gold transition-colors">Facebook</a>
            <a href="#top" className="label-caps hover:text-tuc-gold transition-colors">Pinterest</a>
          </div>
        </div>

        <div>
          <h4 className="label-caps mb-6">Explore</h4>
          <ul className="space-y-4">
            <li><Link to="/shop" className="text-brand-stone hover:text-tuc-gold transition-colors">Shop All</Link></li>
            <li><Link to="/about" className="text-brand-stone hover:text-tuc-gold transition-colors">About the Artist</Link></li>
            <li><Link to="/contact" className="text-brand-stone hover:text-tuc-gold transition-colors">Contact & Commissions</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="label-caps mb-6">Contact</h4>
          <p className="text-brand-stone mb-2">Lebanon, New Hampshire</p>
          <p className="text-brand-stone mb-6">United States</p>
          <a href="mailto:info@lfpaperworks.com" className="font-serif italic hover:text-tuc-gold transition-colors">
            info@lfpaperworks.com
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-10 border-t border-brand-linen flex flex-col md:flex-row justify-between items-center text-sm text-brand-stone">
        <p>© {currentYear} LFPaperWorks / Luciana Frigerio. All rights reserved.</p>
        <div className="flex space-x-8 mt-4 md:mt-0">
          <Link to="/privacy" className="hover:text-tuc-gold transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-tuc-gold transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
