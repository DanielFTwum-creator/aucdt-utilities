import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import QuickAccess from './components/QuickAccess';
import Welcome from './components/Welcome';
import News from './components/News';
import Stats from './components/Stats';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-secondary selection:text-primary-dark">
      <Header />
      <main>
        <Hero />
        <QuickAccess />
        <Welcome />
        <Stats />
        <News />
      </main>
      <Footer />
    </div>
  );
};

export default App;