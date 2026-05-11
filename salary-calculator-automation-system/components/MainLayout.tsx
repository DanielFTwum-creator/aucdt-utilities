import React from 'react';
import SalaryCalculator from './SalaryCalculator';
import { Button } from './UIComponents';

interface MainLayoutProps {
    onLogout: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ onLogout }) => {
  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      <header className="bg-brand-primary shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center">
                <svg className="w-10 h-10 text-white mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 3h.008v.008H8.25v-.008Zm0 3h.008v.008H8.25v-.008Zm3-6h.008v.008H11.25v-.008Zm0 3h.008v.008H11.25v-.008Zm0 3h.008v.008H11.25v-.008Zm3-6h.008v.008H14.25v-.008Zm0 3h.008v.008H14.25v-.008Zm0 3h.008v.008H14.25v-.008ZM6 21v-3.093c0-1.16.536-2.22 1.41-2.907l2.224-1.779c.874-.699 2.026-.699 2.9 0l2.223 1.779c.874.687 1.41 1.747 1.41 2.907V21M6 21h12m-6-15.75v.008" />
                </svg>
              <h1 className="text-2xl font-bold text-white tracking-tight">Salary Calculator</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm font-medium text-brand-light">
                Automation System v1.0
              </div>
              <Button onClick={onLogout} variant="secondary">Logout</Button>
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <SalaryCalculator />
      </main>
      <footer className="text-center p-4 text-gray-500 text-sm">
        <p>&copy; 2025 SalaryCorp. Prepared for Mr. Twum. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default MainLayout;
