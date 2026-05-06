
import React, { useState, useEffect } from 'react';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header role="banner" aria-label="Site header" className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <a href="#top" aria-label="enTrainer home" className="text-2xl font-bold text-[#325766]">
            enTrainer
          </a>
          <nav aria-label="Main navigation">
            {/* Navigation links can be added here if needed */}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
