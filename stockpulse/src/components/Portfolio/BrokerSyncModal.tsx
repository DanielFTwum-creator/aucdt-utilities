import React, { useState } from 'react';
import { X, ExternalLink, Loader2, CheckCircle2 } from 'lucide-react';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
  authFetch: (url: string, options?: RequestInit) => Promise<Response>;
}

export default function BrokerSyncModal({ onClose, onSuccess, authFetch }: Props) {
  const [step, setStep] = useState<'select' | 'connecting' | 'success'>('select');
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async (provider: string) => {
    setStep('connecting');
    setError(null);

    // Simulate OAuth delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      const res = await authFetch('/api/portfolio/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, token: 'simulated_oauth_token_123' })
      });

      if (!res.ok) {
        throw new Error('Failed to sync with broker');
      }

      setStep('success');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection failed');
      setStep('select');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Connect Broker</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-xl">
              {error}
            </div>
          )}

          {step === 'select' && (
            <>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Securely connect your brokerage account to automatically import and sync your holdings.
              </p>
              
              <div className="space-y-3">
                {['Charles Schwab', 'Fidelity', 'Robinhood', 'Interactive Brokers'].map(broker => (
                  <button
                    key={broker}
                    onClick={() => handleConnect(broker)}
                    className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all group"
                  >
                    <span className="font-medium text-gray-900 dark:text-white">{broker}</span>
                    <ExternalLink size={18} className="text-gray-400 group-hover:text-indigo-500" />
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 'connecting' && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 size={48} className="text-indigo-600 animate-spin mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Connecting to Broker...</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Authenticating securely via OAuth</p>
            </div>
          )}

          {step === 'success' && (
            <div className="flex flex-col items-center justify-center py-12">
              <CheckCircle2 size={48} className="text-emerald-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Connection Successful!</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Importing your holdings...</p>
            </div>
          )}
        </div>
        
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400 text-center">
          Secured by simulated Plaid integration. We never store your credentials.
        </div>
      </div>
    </div>
  );
}
