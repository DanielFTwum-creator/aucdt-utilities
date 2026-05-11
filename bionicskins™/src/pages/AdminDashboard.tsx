import { useState, FormEvent, useEffect } from 'react';
import { motion } from 'motion/react';
import { Lock, Shield, Database, LayoutTemplate, Activity } from 'lucide-react';
import BlogEditor from '../components/BlogEditor';
import ResourceEditor from '../components/ResourceEditor';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'blog' | 'resources' | 'audit'>('blog');

  // Basic TUC Standard check for admin/admin
  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid credentials supplied. Access logged.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex-grow flex items-center justify-center bg-[#EEF1F3] p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md border border-gray-100"
        >
          <div className="flex justify-center mb-6">
            <div className="bg-[#E8F3FA] p-4 rounded-full">
              <Lock className="text-[#2A5171]" size={36} />
            </div>
          </div>
          <h2 className="text-2xl font-sans font-semibold text-center text-[#1B2A4A] mb-2">Secure Gateway</h2>
          <p className="text-sm text-center text-[#6a879a] mb-8">Authentication required for administrative access.</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#1B2A4A] mb-1">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-gray-300 rounded outline-none focus:border-[#2F6FA8] px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1B2A4A] mb-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded outline-none focus:border-[#2F6FA8] px-4 py-2"
              />
            </div>
            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
            <button type="submit" className="w-full bg-[#16426C] hover:bg-[#2F6FA8] transition-colors text-white py-3 rounded font-medium mt-2">
              Authenticate
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col md:flex-row bg-[#F9F9F9]">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#1B2A4A] text-white flex flex-col min-h-[500px]">
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <Shield size={24} className="text-[#5BA8D6]" />
          <h2 className="text-xl font-semibold">TUC Admin</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('blog')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded text-left transition-colors ${activeTab === 'blog' ? 'bg-white/20' : 'hover:bg-white/10'}`}
          >
            <LayoutTemplate size={18} /> CMS: Blog
          </button>
          <button 
            onClick={() => setActiveTab('resources')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded text-left transition-colors ${activeTab === 'resources' ? 'bg-white/20' : 'hover:bg-white/10'}`}
          >
            <Database size={18} /> CMS: Resources
          </button>
          <button 
            onClick={() => setActiveTab('audit')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded text-left transition-colors ${activeTab === 'audit' ? 'bg-white/20' : 'hover:bg-white/10'}`}
          >
            <Activity size={18} /> Audit Stream
          </button>
        </nav>
        <div className="p-4 border-t border-white/10">
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="w-full py-2 bg-red-500/20 hover:bg-red-500/40 text-red-100 rounded transition-colors text-sm"
          >
            Terminate Session
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full">
        <motion.div
           key={activeTab}
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.2 }}
        >
          {activeTab === 'blog' && (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <h1 className="text-3xl font-serif text-[#1B2A4A] mb-8 pb-4 border-b">Blog Management</h1>
              <BlogEditor />
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <h1 className="text-3xl font-serif text-[#1B2A4A] mb-8 pb-4 border-b">Resource Management</h1>
              <ResourceEditor />
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
               <h1 className="text-3xl font-serif text-[#1B2A4A] mb-2">System Audit Stream</h1>
               <p className="text-gray-500 mb-8 pb-4 border-b">Tracking Phase 2 compliance and administrative actions.</p>
               <div className="bg-[#1B2A4A] text-green-400 font-mono p-6 rounded-md text-sm overflow-y-auto h-96">
                  <p>19:42:01 - SYSTEM_INIT: Compliance protocol engaged.</p>
                  <p>19:45:12 - AUTH_ATTEMPT: IP Address Localhost.</p>
                  <p>19:45:12 - AUTH_SUCCESS: admin securely negotiated.</p>
                  <p className="text-yellow-400">19:46:00 - WARN: Storage payload requires flush.</p>
                  <p>19:46:15 - RES_UPDATE: "Living with Amputation" pushed to CDN.</p>
                  <br />
                  <p className="text-gray-400 italic">-- End of Live Stream --</p>
               </div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
