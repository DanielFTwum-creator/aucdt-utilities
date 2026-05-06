import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeSwitcher from '../components/ThemeSwitcher';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
        const success = await login(password);
        if (success) {
            navigate('/');
        } else {
            setError('Invalid credentials. Please verify your password.');
            setIsLoading(false);
        }
    } catch (error) {
        setError('Authentication service unavailable');
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#8B1538] to-[#6B1028] text-[#1F2937] font-sans">
        {/* Custom Styles for floating animation */}
        <style>{`
            @keyframes float {
                0%, 100% { transform: translateY(0) translateX(0); }
                50% { transform: translateY(-20px) translateX(20px); }
            }
            .animate-float { animation: float 6s ease-in-out infinite; }
            .animate-float-reverse { animation: float 8s ease-in-out infinite reverse; }
        `}</style>

        {/* Animated Background Elements (Gold) */}
        <div className="absolute -top-[250px] -right-[250px] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.15)_0%,transparent_70%)] animate-float pointer-events-none"></div>
        <div className="absolute -bottom-[200px] -left-[200px] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.1)_0%,transparent_70%)] animate-float-reverse pointer-events-none"></div>

        {/* Theme Switcher */}
        <div className="absolute top-6 right-6 z-20 opacity-70 hover:opacity-100 transition-opacity">
             <ThemeSwitcher />
        </div>

        {/* Main Card - Clean White Card per Branding */}
        <div className="relative z-10 w-full max-w-[440px] p-8 sm:p-12 bg-[#F8F6F0] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.4)] border border-[#D4AF37]/30 animate-in slide-in-from-bottom-4 duration-500 ease-out mx-4">
            
            {/* Header */}
            <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-[90px] h-[90px] rounded-full bg-white shadow-[0_10px_30px_rgba(107,16,40,0.3)] mb-6 transform transition hover:-translate-y-1 hover:scale-105 duration-300 group p-2">
                    <img 
                        src="https://techbridge.edu.gh/static/TUC_LOGO_1.png" 
                        alt="Techbridge Logo" 
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                </div>
                <h1 className="text-[32px] font-bold text-[#8B1538] tracking-[0.1em] mb-2 drop-shadow-sm font-sans uppercase">Techbridge</h1>
                <p className="text-[15px] text-[#D4AF37] tracking-[0.15em] mb-1 font-bold uppercase">TSAP Portal</p>
                <p className="text-[20px] text-[#6B1028] font-light tracking-wide">Administrator Access</p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-8">
                <div>
                    <label htmlFor="password-input" className="block text-[14px] font-bold text-[#6B1028] mb-2 tracking-wide">Password</label>
                    <div className="relative">
                        <input
                            id="password-input"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setError(''); }}
                            className="w-full px-4 py-4 pl-5 pr-12 bg-white border-2 border-[#E6D5C7] rounded-xl text-[#1F2937] text-[15px] placeholder-[#9CA3AF] focus:outline-none focus:border-[#8B1538] focus:shadow-[0_0_0_4px_rgba(212,175,55,0.2)] transition-all duration-300"
                            placeholder="Enter your password"
                            autoComplete="current-password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B1028]/50 hover:text-[#8B1538] transition-colors duration-300 p-2 focus:outline-none"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? (
                                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46A11.804 11.804 0 0 0 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/></svg>
                            ) : (
                                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                            )}
                        </button>
                    </div>
                </div>

                {error && (
                    <div 
                        role="alert" 
                        aria-live="assertive"
                        className="text-[#DC2626] bg-[#FEE2E2] p-3 rounded-xl text-sm text-center border border-[#FCA5A5] animate-in fade-in slide-in-from-top-1 duration-300 font-medium"
                    >
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading || !password}
                    className="w-full py-4 bg-gradient-to-br from-[#D4AF37] to-[#C5A028] rounded-xl text-[#6B1028] text-[16px] font-bold tracking-wide shadow-[0_6px_20px_rgba(212,175,55,0.25)] hover:shadow-[0_10px_30px_rgba(212,175,55,0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 relative overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none"
                >
                    <span className="relative z-10">{isLoading ? 'Authenticating...' : 'Secure Login'}</span>
                    {/* Shine Effect */}
                    <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-in-out"></div>
                </button>
            </form>

            {/* Footer Links */}
            <div className="mt-8 text-center space-x-6 text-[13px]">
                <button type="button" className="text-[#6B1028]/80 hover:text-[#D4AF37] transition-colors duration-300 no-underline bg-transparent border-none cursor-pointer font-medium">Forgot Password?</button>
                <button type="button" className="text-[#6B1028]/80 hover:text-[#D4AF37] transition-colors duration-300 no-underline bg-transparent border-none cursor-pointer font-medium">Need Help?</button>
            </div>

            {/* Security Badge */}
            <div className="mt-8 flex items-center justify-center text-[#6B1028]/60 text-[12px] font-medium">
                <svg className="w-4 h-4 mr-1.5 fill-[#059669]" viewBox="0 0 24 24">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
                </svg>
                Secure Connection
            </div>
        </div>
    </div>
  );
};

export default LoginPage;