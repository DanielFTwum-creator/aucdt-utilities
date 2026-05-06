import React from 'react'
import ReactDOM from 'react-dom/client'
import AppWithAuth from './AppWithAuth'
import './index.css'
import { AuthGate } from './AuthGate';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppWithAuth />
  </React.StrictMode>,
)

document.getElementById('tuc-splash-styles')?.remove();
