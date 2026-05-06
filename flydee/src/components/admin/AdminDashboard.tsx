import React from 'react';
import ThemeSwitcher from './ThemeSwitcher';

export default function AdminDashboard() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <p className="mb-4">Welcome to the admin dashboard.</p>
      <ThemeSwitcher />
    </div>
  );
}
