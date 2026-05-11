import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-br from-[#D4A017] via-[#8B4513] to-[#1A1A1A] bg-opacity-20 text-[#FAF5EB] p-4 shadow-2xl sticky top-0 z-50">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <h1 className="text-3xl md:text-4xl font-extrabold font-playfair-display uppercase tracking-widest text-shadow-xl">
          Kente Fusion Fashion Workshop
        </h1>
        <p className="mt-2 md:mt-0 text-base md:text-lg opacity-90 text-center md:text-left font-cormorant-garamond text-shadow-sm italic">
          Blend rich Kente heritage with modern fashion
        </p>
      </div>
    </header>
  );
};

export default Header;