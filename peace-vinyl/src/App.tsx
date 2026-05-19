/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginView from './components/LoginView';
import PeaceOneLoveVinyl from './components/PeaceOneLoveVinyl';

function AppContent() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#0a0806] flex items-center justify-center">
        <div className="text-amber-400 text-lg">Loading...</div>
      </main>
    );
  }

  if (!user) {
    return <LoginView />;
  }

  return (
    <main className="min-h-screen bg-[#0a0806]">
      <div className="absolute top-4 right-4 text-amber-200 text-sm">
        Signed in as {user.name}
      </div>
      <PeaceOneLoveVinyl />
    </main>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
