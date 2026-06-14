import React, { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

export const LoginView: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      login({ id: user.uid, name: user.displayName ?? undefined, email: user.email ?? '' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google sign-in failed.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) login(email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#ECF0F4]">
      <div className="w-full max-w-md mx-4 p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-[#164975]">Welcome</h1>
        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full mb-6 px-4 py-3 min-h-[44px] bg-[#164975] text-white rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading ? 'Signing in…' : 'Continue with Google'}
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or</span>
          </div>
        </div>

        <form onSubmit={handleFormSubmit}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#164975]"
          />
          <button
            type="submit"
            className="w-full px-4 py-2 min-h-[44px] bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            Continue with Email
          </button>
        </form>
      </div>
    </div>
  );
};
