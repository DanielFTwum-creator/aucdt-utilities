/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import TechbridgeBanner from './components/TechbridgeBanner';
import AdminPanel from './pages/AdminPanel';

export default function App() {
  const [currentHash, setCurrentHash] = React.useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => setCurrentHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (currentHash === '#/admin' || currentHash === '/admin') {
    return <AdminPanel />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-lg overflow-hidden">
        <TechbridgeBanner />
      </div>
    </div>
  );
}


