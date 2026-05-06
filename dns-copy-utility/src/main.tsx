import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import AppWithAuth from './AppWithAuth'
import { AuthGate } from './AuthGate';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppWithAuth />
  </StrictMode>,
)

document.getElementById('tuc-splash-styles')?.remove();
