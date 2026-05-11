
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer data-component="footer" className="text-center p-4 mt-auto text-sm border-t">
      <div className="flex justify-center items-center space-x-4">
        <Link to="/history" className="hover:underline transition-colors">History</Link>
        <span className="select-none">|</span>
        <Link to="/admin" className="hover:underline transition-colors">Admin Panel</Link>
        <span className="select-none">|</span>
        <Link to="/self-test" className="hover:underline transition-colors">Self-Test</Link>
      </div>
      <p className="mt-2">© {new Date().getFullYear()} Techbridge TSAP. All rights reserved.</p>
    </footer>
  );
};

export default Footer;