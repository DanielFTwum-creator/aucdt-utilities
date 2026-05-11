import { createRoot } from 'react-dom/client';
import { AuthGate } from './AuthGate';

function App() {
  return (
    <main id="main-content" aria-label="Thumbnail Generator" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif', background: '#1a1a2e', color: '#e0e0e0' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Thumbnail Generator</h1>
        <p>AI-powered thumbnail generation tool — coming soon.</p>
      </div>
    </main>
  );
}

createRoot(document.getElementById('root')).render(
  <AuthGate><App /></AuthGate>
);
