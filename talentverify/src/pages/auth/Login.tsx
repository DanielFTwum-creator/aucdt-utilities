import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Lock, ArrowRight, X, Mail, User as UserIcon } from 'lucide-react';

// --- Configuration & Data ---
const ROLES = [
  {
    id: 'recruiter',
    role: 'recruiter',
    title: 'Recruiter',
    desc: 'Manage pipelines & assessments',
    accent: '#3D35C8',
    monogram: 'R',
    delay: 100
  },
  {
    id: 'candidate',
    role: 'candidate',
    title: 'Candidate',
    desc: 'Take assessments & track status',
    accent: '#1A7A5E',
    monogram: 'C',
    delay: 220
  }
];

const GRAIN_TEXTURE = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`;

export default function Login() {
  const { login, error } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  
  // Login State
  const [activeRole, setActiveRole] = useState<string | null>(null); // 'recruiter', 'candidate', 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // For registration (simple demo)
  const [isRegister, setIsRegister] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRole) return;

    if (isRegister) {
       // Simple registration call
       try {
         const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role: activeRole, email, password, name })
         });
         if (res.ok) {
            // Auto login after register
            await login(activeRole as any, password, email);
         } else {
            const d = await res.json();
            alert(d.error || 'Registration failed');
         }
       } catch (e) {
         console.error(e);
         alert('Registration error');
       }
    } else {
       await login(activeRole as any, password, email);
    }
  };

  const resetForm = () => {
    setActiveRole(null);
    setEmail('');
    setPassword('');
    setName('');
    setIsRegister(false);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden font-sans">
      {/* Inject Fonts & Global Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=DM+Sans:wght@400;600;700&display=swap');
        
        :root {
          --brand-primary: #3D35C8;
          --bg-warm: #F5F0EB;
          --text-primary: #1A1A2E;
          --text-muted: #6B6B80;
        }

        .font-display { font-family: 'Cormorant Garamond', serif; }
        .font-body { font-family: 'DM Sans', sans-serif; }
      `}</style>

      {/* Left Panel: Brand */}
      <div 
        className="relative w-[40%] h-full flex flex-col justify-center px-12 lg:px-20 z-10"
        style={{ backgroundColor: 'var(--brand-primary)' }}
      >
        <div className="relative z-10">
          <div className="flex items-center gap-6 mb-4">
            <div className="w-[2px] h-12 bg-white opacity-100" />
            <h1 className="font-display text-5xl text-white font-bold tracking-tight leading-none">
              TalentVerify
            </h1>
          </div>
          <p className="font-body text-white/70 text-lg pl-[26px]">
            Select your role to continue
          </p>
        </div>

        {/* Footer Info */}
        <div className="absolute bottom-8 left-12 lg:left-20 font-body text-white/40 text-xs tracking-wide">
          v2.1.0 &nbsp;•&nbsp; Secure Session
        </div>
      </div>

      {/* Right Panel: Roles */}
      <div 
        className="relative w-[60%] h-full flex flex-col justify-center items-center px-8 bg-[#F5F0EB]"
      >
        {/* Grain Overlay */}
        <div 
          className="absolute inset-0 pointer-events-none z-0"
          style={{ 
            backgroundImage: GRAIN_TEXTURE,
            opacity: 0.04 
          }}
        />

        <div className="w-full max-w-md space-y-6 z-10 relative">
          {!activeRole ? (
            <>
              {ROLES.map((role) => {
                const isHovered = hoveredCard === role.id;
                
                return (
                  <button
                    key={role.id}
                    onClick={() => setActiveRole(role.role)}
                    onMouseEnter={() => setHoveredCard(role.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    className="w-full text-left group relative"
                    style={{
                      opacity: mounted ? 1 : 0,
                      transform: mounted 
                        ? `translateX(0) translateY(${isHovered ? '-2px' : '0'})` 
                        : 'translateX(16px)',
                      transition: `
                        opacity 600ms cubic-bezier(0.22, 1, 0.36, 1) ${role.delay}ms,
                        transform 200ms cubic-bezier(0.22, 1, 0.36, 1)
                      `
                    }}
                    aria-label={`Login as ${role.title}`}
                  >
                    <div 
                      className="relative bg-white rounded-xl p-6 pl-8 flex items-center gap-6 overflow-hidden transition-all duration-200"
                      style={{
                        boxShadow: isHovered 
                          ? '0 12px 24px -8px rgba(0,0,0,0.15)' 
                          : '0 4px 12px -4px rgba(0,0,0,0.05)',
                        borderLeft: `4px solid ${role.accent}`
                      }}
                    >
                      {/* Hover Tint Background */}
                      <div 
                        className="absolute inset-0 transition-opacity duration-200"
                        style={{
                          backgroundColor: role.accent,
                          opacity: isHovered ? 0.06 : 0
                        }}
                      />

                      {/* Monogram */}
                      <div 
                        className="font-body font-bold text-3xl shrink-0"
                        style={{ color: role.accent }}
                        aria-hidden="true"
                      >
                        {role.monogram}
                      </div>

                      {/* Text Content */}
                      <div className="flex-1 min-w-0">
                        <h3 
                          className="font-body text-xl font-semibold mb-1"
                          style={{ color: '#1A1A2E' }}
                        >
                          {role.title}
                        </h3>
                        <p 
                          className="font-body text-xs uppercase tracking-widest font-medium truncate"
                          style={{ color: '#6B6B80', letterSpacing: '0.08em' }}
                        >
                          {role.desc}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}

              {/* System Admin Link */}
              <div 
                className="text-center pt-4"
                style={{
                  opacity: mounted ? 1 : 0,
                  transition: 'opacity 600ms cubic-bezier(0.22, 1, 0.36, 1) 400ms'
                }}
              >
                <button
                  onClick={() => setActiveRole('admin')}
                  className="text-xs font-body text-text-muted hover:text-brand-primary transition-colors underline decoration-transparent hover:decoration-brand-primary underline-offset-4"
                >
                  System Admin Access
                </button>
              </div>
            </>
          ) : (
            <div 
              className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 relative"
              style={{
                animation: 'fadeIn 0.3s ease-out'
              }}
            >
              <button 
                onClick={resetForm}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                aria-label="Close Login"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-3 mb-6 text-brand-primary">
                {activeRole === 'admin' ? <Lock size={24} /> : <UserIcon size={24} />}
                <h3 className="font-display text-2xl font-bold capitalize">
                  {activeRole === 'admin' ? 'Admin Access' : `${activeRole} Login`}
                </h3>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                {activeRole !== 'admin' && isRegister && (
                  <div>
                    <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all font-body"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                )}

                {activeRole !== 'admin' && (
                  <div>
                    <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all font-body"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all font-body"
                    placeholder="Enter password..."
                    autoFocus={activeRole === 'admin'}
                    required
                  />
                  {error && (
                    <p className="text-red-500 text-xs mt-2 font-medium">{error}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand-primary text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  {isRegister ? 'Create Account' : 'Authenticate'}
                  <ArrowRight size={16} />
                </button>

                {activeRole !== 'admin' && (
                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => setIsRegister(!isRegister)}
                      className="text-xs text-text-muted hover:text-brand-primary underline"
                    >
                      {isRegister ? 'Already have an account? Login' : 'Need an account? Register'}
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
