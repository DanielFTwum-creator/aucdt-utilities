
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer role="contentinfo" aria-label="Site footer" className="bg-[#243949] text-white">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <p>© {new Date().getFullYear()}. <strong>fwave, inc.</strong>. All rights reserved.</p>
          <button type="button" onClick={() => { window.location.hash = '#/admin'; }} aria-label="Open admin dashboard" className="mt-2 text-xs text-white/40 hover:text-white/70 transition-colors">Admin</button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
