import React, { useState, useEffect } from 'react';
import * as authService from '../services/authService';
import { User } from '../types';
import { useAuth } from '../contexts/AuthContext';
import Logo from './Logo';
import Spinner from './Spinner';
import { AtSign, Lock, Phone, User as UserIcon, Eye, EyeOff } from 'lucide-react';
import ForgotPasswordModal from './ForgotPasswordModal';
import ThemeSwitcher from './ThemeSwitcher';

const LoginView: React.FC = () => {
  const { login } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  // States for form fields
  const [identifier, setIdentifier] = useState(''); // For login
  const [username, setUsername] = useState(''); // For registration
  const [phone, setPhone] = useState(''); // For registration
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // UI states
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const OAUTH_TIMEOUT_MS = 5000;

    const handleMessage = async (event: MessageEvent) => {
      // Validate origin matches current location
      if (event.origin !== window.location.origin) {
        console.warn('[OAuth] Message from different origin, ignoring:', event.origin);
        return;
      }

      if (event.data?.type === 'OAUTH_TOKEN_SUCCESS') {
        const { access_token } = event.data;
        try {
          setIsLoading(true);
          console.log('[OAuth] Processing token, fetching user info...');

          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), OAUTH_TIMEOUT_MS);

          const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { Authorization: `Bearer ${access_token}` },
            signal: controller.signal
          });

          clearTimeout(timeoutId);

          if (!res.ok) {
            const errorText = await res.text();
            console.error('[OAuth] User info fetch failed:', res.status, errorText);
            throw new Error(`Google API error: ${res.status} ${res.statusText}`);
          }

          const userInfo = await res.json();
          console.log('[OAuth] User info received, logging in...');
          login({
            id: userInfo.id,
            name: userInfo.name,
            email: userInfo.email,
            picture: userInfo.picture,
            tier: 'free',
          });
        } catch (err) {
          if (err instanceof Error && err.name === 'AbortError') {
            console.error('[OAuth] Request timeout');
            setError('Google login took too long. Please try again.');
          } else {
            const errorMsg = err instanceof Error ? err.message : String(err);
            console.error('[OAuth] Token processing failed:', errorMsg);
            setError(`Google login failed: ${errorMsg}`);
          }
          setIsLoading(false);
        }
      } else if (event.data?.type === 'OAUTH_TOKEN_ERROR') {
        console.error('[OAuth] Error from callback:', event.data);
        setError(`OAuth error: ${event.data.error}${event.data.error_description ? ' - ' + event.data.error_description : ''}`);
        setIsLoading(false);
      }
    };

    console.log('[OAuth] Setting up message listener');
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [login]);

  const handleGoogleLogin = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      setError('Google login is not configured.');
      return;
    }
    const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI
      || `${window.location.origin}/auth/google/callback`;
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'token',
      scope: 'openid email profile',
    });
    const authWindow = window.open(
      `https://accounts.google.com/o/oauth2/v2/auth?${params}`,
      'oauth_popup',
      'width=600,height=700'
    );
    if (!authWindow) setError('Popup blocked. Please allow popups for this site.');
  };

  const getVerifiedLocation = (): Promise<GeolocationCoordinates> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser."));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position.coords),
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              reject(new Error("Location access denied. Please enable location permissions to log in."));
              break;
            case error.POSITION_UNAVAILABLE:
              reject(new Error("Location information is unavailable."));
              break;
            case error.TIMEOUT:
              reject(new Error("The request to get user location timed out."));
              break;
            default:
              reject(new Error("An unknown error occurred while getting location."));
              break;
          }
        }
      );
    });
  };
  
  const clearForm = () => {
    setIdentifier('');
    setUsername('');
    setPhone('');
    setPassword('');
    setConfirmPassword('');
    setError(null);
  };

  const handleModeChange = (newMode: 'login' | 'register') => {
    setMode(newMode);
    clearForm();
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Geolocation is optional — never block login if denied or unavailable
      let location: GeolocationCoordinates | null = null;
      try { location = await getVerifiedLocation(); } catch { /* proceed without */ }

      let user: User | null = null;

      if (mode === 'login') {
          user = await authService.loginWithUsernameOrPhone(identifier, password, location as GeolocationCoordinates);
      } else { // 'register'
          if (password !== confirmPassword) throw new Error("Passwords do not match.");
          if (!username) throw new Error("Username is required.");
          user = await authService.register(username, password, phone || undefined, location as GeolocationCoordinates);
      }

      if (user) {
        login(user);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderFormContent = () => {
    if (mode === 'login') {
        return (
            <>
                <h2 className="text-2xl font-bold text-primary text-center">Welcome Back!</h2>
                <p className="text-secondary text-center mb-6">Sign in to continue to MarkAI.</p>
                <div className="relative mb-4">
                    <UserIcon className="absolute top-1/2 left-4 -translate-y-1/2 h-5 w-5 text-secondary" />
                    <input type="text" placeholder="Username or Phone Number" value={identifier} onChange={e => setIdentifier(e.target.value)} className="w-full p-3 pl-12 bg-primary text-primary border border-default rounded-lg focus:ring-2 focus:ring-accent-primary transition" required />
                </div>
                <div className="relative mb-4">
                    <Lock className="absolute top-1/2 left-4 -translate-y-1/2 h-5 w-5 text-secondary" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full p-3 pl-12 pr-12 bg-primary text-primary border border-default rounded-lg focus:ring-2 focus:ring-accent-primary transition"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-1/2 right-3 -translate-y-1/2 text-secondary hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary rounded-full p-1"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                </div>
                 <div className="text-right text-sm mb-6">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="font-semibold text-accent-primary hover:underline focus:outline-none focus:ring-2 focus:ring-accent-primary rounded"
                    >
                      Forgot Password?
                    </button>
                  </div>
            </>
        );
    }
    
    // Register mode
    return (
        <>
            <h2 className="text-2xl font-bold text-primary text-center">Create Your Account</h2>
            <p className="text-secondary text-center mb-6">Get started with your new marketing assistant.</p>
            <div className="relative mb-4">
                <UserIcon className="absolute top-1/2 left-4 -translate-y-1/2 h-5 w-5 text-secondary" />
                <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} className="w-full p-3 pl-12 bg-primary text-primary border border-default rounded-lg focus:ring-2 focus:ring-accent-primary transition" required />
            </div>
            <div className="relative mb-4">
                <Phone className="absolute top-1/2 left-4 -translate-y-1/2 h-5 w-5 text-secondary" />
                <input type="tel" placeholder="Phone Number (Optional)" value={phone} onChange={e => setPhone(e.target.value)} className="w-full p-3 pl-12 bg-primary text-primary border border-default rounded-lg focus:ring-2 focus:ring-accent-primary transition" />
            </div>
            <div className="relative mb-4">
                <Lock className="absolute top-1/2 left-4 -translate-y-1/2 h-5 w-5 text-secondary" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full p-3 pl-12 pr-12 bg-primary text-primary border border-default rounded-lg focus:ring-2 focus:ring-accent-primary transition"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute top-1/2 right-3 -translate-y-1/2 text-secondary hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary rounded-full p-1" aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
            </div>
            <div className="relative mb-4">
                <Lock className="absolute top-1/2 left-4 -translate-y-1/2 h-5 w-5 text-secondary" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full p-3 pl-12 pr-12 bg-primary text-primary border border-default rounded-lg focus:ring-2 focus:ring-accent-primary transition"
                  required
                />
                 <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute top-1/2 right-3 -translate-y-1/2 text-secondary hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary rounded-full p-1" aria-label={showConfirmPassword ? "Hide password" : "Show password"}>
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
            </div>
        </>
    );
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div 
          className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-accent-primary rounded-full filter blur-3xl opacity-30 animate-drift"
          style={{ animationDuration: '25s' }}
        ></div>
        <div 
          className="absolute bottom-[-20%] right-[-15%] w-80 h-80 bg-accent-secondary rounded-full filter blur-3xl opacity-30 animate-drift"
          style={{ animationDuration: '30s', animationDelay: '-10s' }}
        ></div>
         <div 
          className="absolute bottom-[40%] right-[20%] w-48 h-48 bg-accent-tertiary rounded-full filter blur-2xl opacity-20 animate-drift"
          style={{ animationDuration: '20s', animationDelay: '-5s' }}
        ></div>
      </div>

      <div className="absolute top-4 right-4 z-20">
        <ThemeSwitcher />
      </div>
      <div className="w-full max-w-md relative z-10">
        <div className="flex justify-center mb-8">
            <Logo size="lg" />
        </div>
        <div className="bg-secondary/80 backdrop-blur-sm rounded-xl shadow-2xl border border-default overflow-hidden">
            <form onSubmit={handleSubmit} className="p-8">
                <div className="min-h-[280px]">
                    <div key={mode} className="animate-fade-in">
                        {renderFormContent()}
                    </div>
                </div>

                <div className="h-6 mt-2 text-center">
                    {error && <p className="text-red-500 text-sm animate-fade-in">{error}</p>}
                </div>
                
                <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-accent-primary to-accent-secondary text-white font-bold py-3.5 px-4 rounded-lg hover:opacity-90 transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                    {isLoading ? <Spinner /> : (mode === 'login' ? 'Sign In' : 'Create Account')}
                </button>

                <div className="relative flex items-center gap-3 my-6">
                    <div className="flex-1 h-px bg-default"></div>
                    <span className="text-secondary text-xs uppercase font-semibold">Or</span>
                    <div className="flex-1 h-px bg-default"></div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full bg-white border-2 border-default text-primary font-bold py-3.5 px-4 rounded-lg hover:bg-secondary/50 transition flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </button>

                <div className="h-6 mt-4 text-center">
                    <p className="text-sm text-secondary animate-fade-in">
                        {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
                        <button
                          type="button"
                          onClick={() => handleModeChange(mode === 'login' ? 'register' : 'login')}
                          className="font-semibold text-accent-primary hover:underline ml-1 focus:outline-none focus:ring-2 focus:ring-accent-primary rounded"
                        >
                            {mode === 'login' ? 'Sign Up' : 'Sign In'}
                        </button>
                    </p>
                </div>
            </form>
        </div>
      </div>
       {showForgotPassword && (
        <ForgotPasswordModal
            onClose={() => setShowForgotPassword(false)}
            onSendLink={(email) => {
                // We intentionally do NOT close the modal immediately here 
                // so the user can actually see the confirmation message rendered inside it.
                console.log("Reset link sent for:", email);
            }}
        />
      )}
    </div>
  );
};

export default LoginView;