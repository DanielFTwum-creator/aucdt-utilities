import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppWithAuth from './AppWithAuth';
import reportWebVitals from './reportWebVitals';
import { AuthGate } from './AuthGate';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthGate><AppWithAuth /></AuthGate>
  </React.StrictMode>
);

// Remove splash screen styles so they don't override the mounted app
document.getElementById('tuc-splash-styles')?.remove();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
