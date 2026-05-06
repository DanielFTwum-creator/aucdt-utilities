import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from '../../components/layout/AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { ROUTES } from '../../constants';

const RegisterPage: React.FC = () => {
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const success = await register(fullName, email, password);
      if (success) {
        // After successful registration and auto-login, redirect to onboarding
        navigate(ROUTES.ONBOARDING);
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during registration.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Join the 6R Workshop" subtitle="Create your account to start your design journey">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          id="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          placeholder="John Doe"
          aria-label="Full Name"
        />
        <Input
          label="Email Address"
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="your@email.com"
          aria-label="Email Address"
        />
        <Input
          label="Password"
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Minimum 8 characters, 1 uppercase, 1 number"
          aria-label="Password"
        />
        <Input
          label="Confirm Password"
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          placeholder="********"
          aria-label="Confirm Password"
        />

        {error && <p className="text-error text-sm text-center" role="alert">{error}</p>}

        <Button type="submit" className="w-full" loading={isLoading} disabled={isLoading}>
          {isLoading ? 'Registering...' : 'Register'}
        </Button>
      </form>

      <div className="text-center text-sm mt-4">
        <p className="text-subtle-text-light dark:text-subtle-text-dark">
          Already have an account?{' '}
          <Link to={ROUTES.LOGIN} className="text-primary hover:underline font-medium">
            Login
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;