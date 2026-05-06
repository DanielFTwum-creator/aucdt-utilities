import React, { useState } from 'react';
import { BackIcon, EyeIcon, EyeOffIcon, LockIcon, ShieldIcon, SparklesIcon, FilmIcon, CrownIcon } from './icons';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBack: () => void;
}

const ADMIN_PASSWORD = 'playgrow_admin';

const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBack }) => {
  const [currentVariation, setCurrentVariation] = useState(0);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        setError('');
        onLoginSuccess();
      } else {
        setError('Incorrect password. Please try again.');
      }
      setIsLoading(false);
    }, 1000);
  };
  
  const ThemedBackButton: React.FC<{className?: string}> = ({ className }) => (
     <button 
        type="button"
        onClick={onBack} 
        className={`absolute top-6 left-6 z-10 p-3 rounded-full transition-all focus:outline-none focus:ring-4 ${className}`}
        aria-label="Back to World Map"
    >
        <BackIcon className="w-6 h-6" />
    </button>
  );

  const OceanDepthsTheme: React.FC = () => (
    <div className="min-h-screen bg-gradient-to-b from-cyan-950 via-blue-950 to-indigo-950 flex items-center justify-center p-4 relative overflow-hidden">
       <ThemedBackButton className="bg-cyan-950/50 text-cyan-200 hover:bg-cyan-900/80 focus:ring-cyan-500/50" />
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-20 left-10 w-64 h-64 bg-cyan-400 rounded-full filter blur-[120px] animate-pulse"></div>
          <div className="absolute top-40 right-20 w-48 h-48 bg-blue-400 rounded-full filter blur-[100px] animate-pulse" style={{animationDelay: '1.5s'}}></div>
          <div className="absolute bottom-20 left-1/3 w-56 h-56 bg-indigo-400 rounded-full filter blur-[110px] animate-pulse" style={{animationDelay: '3s'}}></div>
        </div>
      </div>
      
      <div className="relative w-full max-w-md">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 rounded-3xl blur-2xl"></div>
        <div className="relative bg-gradient-to-br from-cyan-950/60 to-indigo-950/60 backdrop-blur-xl rounded-3xl p-10 border border-cyan-500/30 shadow-[0_0_80px_rgba(6,182,212,0.2)]">
          <div className="text-center mb-10">
            <div className="relative inline-block mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 via-blue-400 to-indigo-400 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(6,182,212,0.6)] animate-pulse">
                <ShieldIcon className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -inset-2 border-2 border-cyan-400/50 rounded-2xl animate-ping"></div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-center text-gray-800 dark:text-gray-100 hc-text-primary mb-2">Admin Access</h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-cyan-300 mb-3">Password</label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-cyan-950/50 border border-cyan-500/30 rounded-xl px-4 py-4 text-cyan-100 placeholder-cyan-700 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 focus:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all backdrop-blur-sm"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-cyan-400 hover:text-cyan-200 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
            </div>
            {error && <p className="text-red-400 text-sm text-center" role="alert">{error}</p>}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 text-white font-semibold py-4 rounded-xl hover:from-cyan-400 hover:via-blue-400 hover:to-indigo-400 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] disabled:opacity-50"
            >
              {isLoading ? 'Authenticating...' : 'Authenticate'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  const ForestWhisperTheme: React.FC = () => (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-green-900 to-teal-950 flex items-center justify-center p-4 relative overflow-hidden">
      <ThemedBackButton className="bg-emerald-950/50 text-emerald-200 hover:bg-emerald-900/80 focus:ring-emerald-500/50" />
      <div className="absolute inset-0">
        <div className="absolute top-10 right-20 w-96 h-96 bg-emerald-500 rounded-full mix-blend-soft-light filter blur-[140px] opacity-40 animate-pulse"></div>
        <div className="absolute bottom-10 left-20 w-80 h-80 bg-teal-500 rounded-full mix-blend-soft-light filter blur-[120px] opacity-40 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      
      <div className="relative w-full max-w-md">
        <div className="bg-black/30 backdrop-blur-2xl rounded-3xl p-10 border border-emerald-500/30 shadow-[0_0_60px_rgba(16,185,129,0.15)]">
          <div className="text-center mb-10">
            <div className="relative inline-block mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                <SparklesIcon className="w-10 h-10 text-white" />
              </div>
              <div className="absolute inset-0 bg-emerald-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-center bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 bg-clip-text text-transparent mb-2">Admin Access</h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-emerald-300 mb-3">Password</label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-emerald-950/50 border border-emerald-500/30 rounded-xl px-4 py-4 text-emerald-100 placeholder-emerald-800 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50 focus:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400 hover:text-emerald-200 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
            </div>
            {error && <p className="text-red-400 text-sm text-center" role="alert">{error}</p>}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white font-semibold py-4 rounded-xl hover:from-emerald-400 hover:via-green-400 hover:to-teal-400 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:shadow-[0_0_40px_rgba(16,185,129,0.6)] disabled:opacity-50"
            >
              {isLoading ? 'Authenticating...' : 'Authenticate'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
  
  const SunsetGlowTheme: React.FC = () => (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-pink-100 to-purple-100 flex items-center justify-center p-4 relative overflow-hidden">
      <ThemedBackButton className="bg-white/50 text-purple-600 hover:bg-white/90 focus:ring-pink-400" />
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-[600px] h-[600px] bg-gradient-to-br from-orange-300 to-pink-300 rounded-full filter blur-[100px] opacity-40 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-[500px] h-[500px] bg-gradient-to-br from-pink-300 to-purple-300 rounded-full filter blur-[100px] opacity-40 animate-pulse" style={{animationDelay: '1.5s'}}></div>
      </div>
      
      <div className="relative w-full max-w-md">
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-white/50">
          <div className="text-center mb-10">
            <div className="relative inline-block mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 via-pink-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-xl rotate-3 hover:rotate-6 transition-transform">
                <CrownIcon className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">Admin Access</h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Password</label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/80 border-2 border-pink-200 rounded-xl px-4 py-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-200 transition-all"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-pink-400 hover:text-pink-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
            </div>
             {error && <p className="text-red-600 text-sm text-center" role="alert">{error}</p>}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 text-white font-semibold py-4 rounded-xl hover:from-orange-500 hover:via-pink-600 hover:to-purple-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-xl disabled:opacity-50"
            >
              {isLoading ? 'Authenticating...' : 'Authenticate'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  const ArcticFrostTheme: React.FC = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-cyan-100 flex items-center justify-center p-4 relative overflow-hidden">
      <ThemedBackButton className="bg-white/50 text-blue-600 hover:bg-white/90 focus:ring-blue-400" />
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-200 rounded-full filter blur-[100px] opacity-30"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-cyan-200 rounded-full filter blur-[120px] opacity-30"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-200 rounded-full filter blur-[140px] opacity-20"></div>
        </div>
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      
      <div className="relative w-full max-w-md">
        <div className="bg-white/60 backdrop-blur-2xl rounded-3xl p-10 shadow-[0_8px_32px_rgba(59,130,246,0.12)] border border-white/80">
          <div className="text-center mb-10">
            <div className="relative inline-block mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center shadow-lg">
                <LockIcon className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -inset-2 border-2 border-blue-300 rounded-full"></div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent mb-2">Admin Access</h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-3">Password</label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/80 border-2 border-blue-200 rounded-xl px-4 py-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-600 transition-colors"
                   aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
            </div>
            {error && <p className="text-red-600 text-sm text-center" role="alert">{error}</p>}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 text-white font-semibold py-4 rounded-xl hover:from-blue-600 hover:via-cyan-600 hover:to-blue-600 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg disabled:opacity-50"
            >
              {isLoading ? 'Authenticating...' : 'Authenticate'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  const MidnightGalaxyTheme: React.FC = () => (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <ThemedBackButton className="bg-indigo-950/50 text-indigo-200 hover:bg-indigo-900/80 focus:ring-purple-500/50" />
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                opacity: Math.random() * 0.7 + 0.3
              }}
            ></div>
          ))}
        </div>
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600 rounded-full filter blur-[150px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-600 rounded-full filter blur-[130px] opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
      
      <div className="relative w-full max-w-md">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl blur-xl opacity-30"></div>
        <div className="relative bg-gradient-to-br from-indigo-950/80 to-purple-950/80 backdrop-blur-2xl rounded-3xl p-10 border border-indigo-500/30 shadow-[0_0_100px_rgba(99,102,241,0.3)]">
          <div className="text-center mb-10">
            <div className="relative inline-block mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                <SparklesIcon className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -inset-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-lg opacity-50"></div>
            </div>
             <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">Admin Access</h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-indigo-300 mb-3">Password</label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-indigo-950/50 border border-indigo-500/30 rounded-xl px-4 py-4 text-indigo-100 placeholder-indigo-800 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 focus:shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-200 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
            </div>
            {error && <p className="text-red-400 text-sm text-center" role="alert">{error}</p>}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold py-4 rounded-xl hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_40px_rgba(99,102,241,0.4)] hover:shadow-[0_0_50px_rgba(168,85,247,0.6)] disabled:opacity-50"
            >
              {isLoading ? 'Authenticating...' : 'Authenticate'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  const DramaticCinemaTheme: React.FC = () => (
    <div className="min-h-screen bg-gradient-to-b from-red-950 via-black to-black flex items-center justify-center p-4 relative overflow-hidden">
       <ThemedBackButton className="bg-black/50 text-red-200 hover:bg-black/80 focus:ring-red-500/50 border border-red-900/50" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,0,0,0.15),transparent_50%)]"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent"></div>
      
      <div className="relative w-full max-w-lg">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-red-600 via-red-500 to-red-600 rounded-lg blur opacity-25"></div>
          <div className="relative bg-gradient-to-b from-zinc-900 to-black rounded-lg p-10 border border-red-900/50">
            <div className="text-center mb-10">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-800 rounded-lg rotate-45 shadow-2xl shadow-red-900/50"></div>
                  <FilmIcon className="w-10 h-10 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-45" />
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-12 h-px bg-gradient-to-r from-transparent to-red-600"></div>
                <LockIcon className="w-5 h-5 text-red-500" />
                <div className="w-12 h-px bg-gradient-to-l from-transparent to-red-600"></div>
              </div>
              <h2 className="text-2xl font-light text-red-100 tracking-wide">Administrator Portal</h2>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-red-400 mb-3 tracking-wider">ACCESS PASSWORD</label>
                <div className="relative group">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/50 border border-red-900/50 rounded-lg px-4 py-4 text-red-100 placeholder-red-900 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/30 transition-all"
                    placeholder="Enter secure password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-red-600 hover:text-red-400 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                </div>
              </div>
                {error && <p className="text-red-500 text-sm text-center" role="alert">{error}</p>}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-white font-bold py-4 rounded-lg hover:from-red-600 hover:via-red-500 hover:to-red-600 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_30px_rgba(220,38,38,0.3)] hover:shadow-[0_0_40px_rgba(220,38,38,0.5)] disabled:opacity-50 tracking-wider"
              >
                {isLoading ? 'AUTHENTICATING...' : 'ENTER SYSTEM'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );

  const variations = [
    { name: "Ocean Depths", Component: OceanDepthsTheme },
    { name: "Forest Whisper", Component: ForestWhisperTheme },
    { name: "Sunset Glow", Component: SunsetGlowTheme },
    { name: "Arctic Frost", Component: ArcticFrostTheme },
    { name: "Midnight Galaxy", Component: MidnightGalaxyTheme },
    { name: "Dramatic Cinema", Component: DramaticCinemaTheme }
  ];

  const CurrentThemeComponent = variations[currentVariation].Component;

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <CurrentThemeComponent />
      
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white/80 backdrop-blur-sm rounded-full shadow-2xl p-2 flex gap-1 sm:gap-2">
        {variations.map((variation, index) => (
          <button
            key={variation.name}
            onClick={() => setCurrentVariation(index)}
            className={`px-3 py-2 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
              currentVariation === index
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {variation.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdminLogin;
