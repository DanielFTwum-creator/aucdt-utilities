import React from 'react';
import PowerDeskAnalyzer from './components/PowerDeskAnalyzer';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <PowerDeskAnalyzer />
      </div>
    </div>
  );
}

export default App;
