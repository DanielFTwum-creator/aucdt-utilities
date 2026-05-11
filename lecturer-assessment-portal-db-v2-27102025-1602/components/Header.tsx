import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-[#2E4034] text-[#F4E4BC] [.high-contrast_&]:bg-black [.high-contrast_&]:text-yellow-300 [.high-contrast_&]:border-b [.high-contrast_&]:border-yellow-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 text-xs">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <span>Email: qa@aucdt.edu.gh</span>
          <span className="hidden sm:inline">Postal Address: P. O. Box VV 179, Oyibi – Accra.</span>
        </div>
      </div>
    </header>
  );
};

export default Header;