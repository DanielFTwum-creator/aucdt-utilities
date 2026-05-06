import React from 'react';

const Footer: React.FC<{ onAdminLoginClick: () => void }> = ({ onAdminLoginClick }) => {
  return (
    <footer className="bg-aucdt-primary dark:bg-gray-900 theme-high-contrast:bg-black text-white pt-16 pb-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-24 bg-aucdt-secondary dark:bg-amber-500 theme-high-contrast:bg-yellow-400 transform skew-y-[-3deg] origin-bottom-right"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-xl mb-4 text-aucdt-secondary dark:text-amber-400 theme-high-contrast:text-yellow-300">AUCDT CONNECT</h3>
            <p className="font-semibold text-lg">AsanSka University College of Design and Technology</p>
            <p>Location: Oyibi</p>
            <p>Opposite Valleyview University</p>
            <p>Off the Adenta-Dodowa Road</p>
            <p>Accra, Ghana</p>
          </div>
          
          {/* Contact Details */}
          <div className="md:justify-self-center">
            <h3 className="font-bold text-xl mb-4 text-aucdt-secondary dark:text-amber-400 theme-high-contrast:text-yellow-300">Get in Touch</h3>
            <p><a href="tel:+233302527959" className="hover:underline theme-high-contrast:text-yellow-300"> +233 (0) 30 252 7959</a></p>
            <p><a href="tel:+233540124400" className="hover:underline theme-high-contrast:text-yellow-300">+233 54 012 4400</a></p>
            <p><a href="mailto:info@aucdt.edu.gh" className="hover:underline theme-high-contrast:text-yellow-300">info@aucdt.edu.gh</a></p>
            <p><a href="mailto:admissions@aucdt.edu.gh" className="hover:underline theme-high-contrast:text-yellow-300">admissions@aucdt.edu.gh</a></p>
          </div>
          
          {/* Quick Links */}
          <div className="md:justify-self-end">
            <h3 className="font-bold text-xl mb-4 text-aucdt-secondary dark:text-amber-400 theme-high-contrast:text-yellow-300">Quick Links</h3>
            <ul>
                <li><a href="#programs" className="hover:underline theme-high-contrast:text-yellow-300">Programmes</a></li>
                <li><a href="#top" className="hover:underline theme-high-contrast:text-yellow-300">Admissions</a></li>
                <li><a href="#top" className="hover:underline theme-high-contrast:text-yellow-300">Student Life</a></li>
                <li><a href="#top" className="hover:underline theme-high-contrast:text-yellow-300">About AUCDT</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-yellow-800 dark:border-amber-800 text-center text-sm">
           <button onClick={onAdminLoginClick} className="bg-gray-700/50 text-gray-300 px-4 py-2 rounded-md hover:bg-gray-600/50 mb-4">
             Admin Login
           </button>
          <p className="text-gray-300 dark:text-gray-400">&copy; {new Date().getFullYear()} AsanSka University College of Design and Technology. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
