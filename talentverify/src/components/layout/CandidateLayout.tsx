import React from 'react';
import { Outlet } from 'react-router-dom';
import ThemeSwitcher from '@/components/ThemeSwitcher';

export default function CandidateLayout() {
  return (
    <div className="min-h-screen bg-bg-warm flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-body transition-colors duration-300">
      <div className="absolute top-4 right-4">
        <ThemeSwitcher />
      </div>
      
      <div className="w-full max-w-3xl space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-brand-primary font-display">
            TalentVerify
          </h2>
          <p className="mt-2 text-lg text-text-muted font-body">
            Candidate Assessment Portal
          </p>
        </div>
        
        <div className="bg-bg-card py-8 px-4 shadow-sm border border-border-color rounded-xl sm:px-10 transition-colors duration-300">
          <Outlet />
        </div>
        
        <div className="text-center text-xs text-text-muted font-body">
          &copy; 2026 TalentVerify. Secure Assessment Environment.
        </div>
      </div>
    </div>
  );
}
