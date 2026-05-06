import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../constants';
import Button from '../components/ui/Button';
import { Frown } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const NotFoundPage: React.FC = () => {
  const { theme } = useTheme();
  return (
    <div className={`min-h-screen flex flex-col items-center justify-center text-center p-4 ${theme}-theme`}>
      <Frown size={80} className="text-primary mb-6" />
      <h1 className="text-5xl font-extrabold text-text-light dark:text-text-dark mb-4">404</h1>
      <p className="text-xl text-subtle-text-light dark:text-subtle-text-dark mb-8">
        Oops! The page you're looking for doesn't exist.
      </p>
      <Link to={ROUTES.DASHBOARD}>
        <Button variant="primary" size="lg">
          Go to Dashboard
        </Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;