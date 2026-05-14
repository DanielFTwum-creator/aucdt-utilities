import { useAuth } from '../contexts/AuthContext';
import { LoginView } from './LoginView';
import App from '../App';

export const AppWithAuth: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginView />;
  }

  return <App />;
};
