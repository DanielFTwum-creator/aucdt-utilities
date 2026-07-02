
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { AppWithAuth } from './AppWithAuth';

// Remove splash body styles so the React app can control background and layout.
// The splash <style id="tuc-splash-styles"> sets body { background: #0F0C07 !important; display: flex }
// which prevents full-width rendering.
const splashStyle = document.getElementById('tuc-splash-styles');
if (splashStyle) splashStyle.remove();
document.body.style.cssText = '';
document.body.className = ''; // clear any body classes set in index.html (e.g. bg-gray-900)

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}
rootElement.style.minHeight = '100vh';
rootElement.style.width = '100%';

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <AppWithAuth>
        <App />
      </AppWithAuth>
    </AuthProvider>
  </React.StrictMode>
);
