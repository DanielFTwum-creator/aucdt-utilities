import React from 'react';
import Dashboard from './components/Dashboard';
import './App.css'; // This line imports the CSS styles

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>URL Monitoring Dashboard</h1>
      </header>
      <main>
        <Dashboard />
      </main>
    </div>
  );
}

export default App;
