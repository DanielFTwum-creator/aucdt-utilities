import { createRoot } from 'react-dom/client';
import AuthGate from './auth/AuthGate.jsx';
import UMaTTracker from './UMaTTracker.jsx';

createRoot(document.getElementById('root')).render(
  <AuthGate>
    <UMaTTracker />
  </AuthGate>
);
