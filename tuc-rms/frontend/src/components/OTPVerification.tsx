import { useState } from 'react';

interface OTPVerificationProps {
  sessionToken: string;
  email: string;
  onSuccess: (token: string, user: any) => void;
  onError: (message: string) => void;
}

export const OTPVerification: React.FC<OTPVerificationProps> = ({
  sessionToken,
  email,
  onSuccess,
  onError,
}) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resending, setResending] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_token: sessionToken, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Verification failed');
        setLoading(false);
        return;
      }

      onSuccess(data.token, data.user);
    } catch (err) {
      setError('Network error');
      onError('Network error');
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError('');
    // Re-submit login to send new OTP (user enters credentials again)
    onError('Please log in again to receive a new OTP');
    setResending(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Two-Factor Authentication</h2>
        <p className="text-gray-600 mb-6">Enter the 6-digit code sent to {email}</p>

        <form onSubmit={handleVerify}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              One-Time Password
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-lg tracking-widest"
              disabled={loading}
              autoFocus
            />
          </div>

          {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">{error}</div>}

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>

          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="w-full mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium disabled:opacity-50"
          >
            {resending ? 'Sending...' : 'Resend Code'}
          </button>
        </form>
      </div>
    </div>
  );
};
