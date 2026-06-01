import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthGate } from './AuthGate';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Remove splash styles and loader from HTML head/body
const splashStyles = document.getElementById('daaro-splash-styles');
if (splashStyles) {
  splashStyles.remove();
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AuthGate>
      <App />
    </AuthGate>
  </React.StrictMode>
);
