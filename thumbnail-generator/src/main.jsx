import { createRoot } from 'react-dom/client';
import { AuthGate } from './AuthGate';
import App from './App';

createRoot(document.getElementById('root')).render(
  <AuthGate><App /></AuthGate>
);

