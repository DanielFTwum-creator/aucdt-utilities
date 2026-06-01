import React, { useState } from 'react';
import { FormLoginView } from './src/components/FormLoginView';

const AUTH_KEY = 'tuc_auth_omniextract';

export function AuthGate({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem(AUTH_KEY) === '1'
  );

  if (authed) return <>{children}</>;

  const handleLocalLogin = async (identifier: string, password: string) => {
    if (identifier === 'admin' && password === 'admin') {
      sessionStorage.setItem(AUTH_KEY, '1');
      setAuthed(true);
    } else {
      throw new Error('Invalid credentials. Use admin / admin');
    }
  };

  const handleGoogleLogin = () => {
    alert('Google SSO is not configured for Omniextract.');
  };

  return (
    <FormLoginView
      appName="Omniextract"
      appSubtitle="Document Data Extraction"
      primaryColor="text-[#7c3aed]"
      primaryColorHex="#7c3aed"
      borderColorClass="border border-[#7c3aed]"
      inputBorderClass="border border-[#7c3aed]"
      inputFocusRingClass="focus:ring-4 focus:ring-[#7c3aed]"
      inputFocusBorderClass="focus:border-[#7c3aed]"
      buttonHoverClass="hover:bg-[#6d28d9]"
      backgroundClass="bg-slate-900"
      cardBgClass="bg-white"
      onGoogleLogin={handleGoogleLogin}
      onLocalLogin={handleLocalLogin}
      supportRegister={false}
      videoBackground="https://techbridge.edu.gh/static/campus_tour.mp4"
    />
  );
}
