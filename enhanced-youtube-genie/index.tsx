
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './AppEnhanced';
import { AuthGate } from './AuthGate';

// Remove the splash-screen styles injected by index.html so body stops
// being a flex container once the React app takes over.
document.getElementById('tuc-splash-styles')?.remove();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AuthGate><App /></AuthGate>
  </React.StrictMode>
);
