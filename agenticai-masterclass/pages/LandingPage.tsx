import React from 'react';
import { Background } from '../components/Background';
import { EventCard } from '../components/EventCard';
import { ThemeSwitcher } from '../components/ThemeSwitcher';
import { BookingProvider } from '../components/BookingContext';

export const LandingPage: React.FC = () => {
  return (
    <BookingProvider>
      <div className="min-h-screen relative w-full overflow-hidden bg-gradient-to-br from-[#0f0f23] via-[#1a1a2e] to-[#0f0f23] [perspective:1000px] transition-colors duration-500">
        <Background />
        <ThemeSwitcher />
        
        <main className="relative z-10 container mx-auto px-4 py-12 md:py-20 min-h-screen flex items-center justify-center">
          <EventCard />
        </main>
      </div>
    </BookingProvider>
  );
};