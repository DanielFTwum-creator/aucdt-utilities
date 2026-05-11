import { createRoot } from 'react-dom/client'
import AppWithAuth from './AppWithAuth'
import { AuthGate } from './AuthGate';

createRoot(document.getElementById('root')).render(
  <AuthGate><AppWithAuth /></AuthGate>
)
