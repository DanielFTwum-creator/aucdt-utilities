import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom'; // Fix: Import Navigate component
import { useAuth } from '../../context/AuthContext';
import AuthLayout from '../../components/layout/AuthLayout';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import { ONBOARDING_QUESTIONS, ROUTES } from '../../constants';
import { OnboardingData, SelectOption } from '../../types';

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUserOnboarding } = useAuth();
  const [answers, setAnswers] = useState<OnboardingData>({
    // Fix: Use 'onboardingUserRole' instead of 'role'
    onboardingUserRole: '',
    experienceLevel: '',
    primaryGoal: '',
    availableHours: '',
    learningStyle: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!user || user.onboardingCompleted) {
    // If user is null or onboarding is already complete, redirect to dashboard
    return <Navigate to={ROUTES.DASHBOARD} />;
  }

  const handleSelectChange = (questionId: keyof OnboardingData, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    setErrors(prev => ({ ...prev, [questionId]: '' })); // Clear error on change
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;
    ONBOARDING_QUESTIONS.forEach(q => {
      const questionId = q.id as keyof OnboardingData;
      if (!answers[questionId]) {
        newErrors[questionId] = 'This field is required.';
        isValid = false;
      }
    });
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const success = await updateUserOnboarding(answers);
      if (success) {
        navigate(ROUTES.DASHBOARD);
      } else {
        // Handle error from updateUserOnboarding if needed
        setErrors({ general: 'Failed to save onboarding data. Please try again.' });
      }
    } catch (err: any) {
      setErrors({ general: err.message || 'An unexpected error occurred.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Tell Us About Yourself" subtitle="Help us personalize your learning journey">
      <form onSubmit={handleSubmit} className="space-y-6">
        {ONBOARDING_QUESTIONS.map(q => {
          const questionId = q.id as keyof OnboardingData;
          return (
            <Select
              key={q.id}
              label={q.question}
              id={q.id}
              options={[
                { value: '', label: `Select your ${q.id}...` }, // Placeholder option
                ...q.options.map(opt => ({ value: opt, label: opt })),
              ]}
              value={answers[questionId]}
              onChange={(e) => handleSelectChange(questionId, e.target.value)}
              error={errors[questionId]}
              required
              aria-label={q.question}
            />
          );
        })}

        {errors.general && <p className="text-error text-sm text-center" role="alert">{errors.general}</p>}

        <Button type="submit" className="w-full" loading={isLoading} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Complete Onboarding'}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default OnboardingPage;