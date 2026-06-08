import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initStore } from './lib/persistentStore';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

// Hydrate the IndexedDB-backed store (and run the one-time localStorage migration)
// before first render, so synchronous reads (step codes, audit log, theme) see data.
initStore().finally(() => {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  // Remove the boot splash styles. They set body{display:flex; align-items/justify:center;
  // overflow:hidden} to centre the loading splash — left in place they constrain the whole
  // app to a centred, non-scrolling column. Drop them once the app has rendered so the UI
  // fills the viewport responsively.
  requestAnimationFrame(() => document.getElementById('tuc-splash-styles')?.remove());
});
