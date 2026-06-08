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
});
