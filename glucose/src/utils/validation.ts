export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface PasswordStrength {
  score: 0 | 1 | 2 | 3; // 0 = weak, 1 = fair, 2 = good, 3 = strong
  feedback: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[\d\s\-\+\(\)]{10,}$/; // Basic: at least 10 digits/spaces/chars
const PASSWORD_MIN_LENGTH = 8;

export const validateEmail = (email: string): ValidationResult => {
  if (!email) return { isValid: false, error: 'Email is required' };
  if (!EMAIL_REGEX.test(email)) return { isValid: false, error: 'Enter a valid email address' };
  return { isValid: true };
};

export const validatePhone = (phone: string): ValidationResult => {
  if (!phone) return { isValid: true }; // Phone is optional
  if (!PHONE_REGEX.test(phone.replace(/\s/g, ''))) {
    return { isValid: false, error: 'Enter a valid phone number (at least 10 digits)' };
  }
  return { isValid: true };
};

export const validatePassword = (password: string): ValidationResult => {
  if (!password) return { isValid: false, error: 'Password is required' };
  if (password.length < PASSWORD_MIN_LENGTH) {
    return { isValid: false, error: `Password must be at least ${PASSWORD_MIN_LENGTH} characters` };
  }
  return { isValid: true };
};

export const validatePasswordMatch = (password: string, confirmPassword: string): ValidationResult => {
  if (password !== confirmPassword) {
    return { isValid: false, error: 'Passwords do not match' };
  }
  return { isValid: true };
};

export const validateUsername = (username: string): ValidationResult => {
  if (!username) return { isValid: false, error: 'Username is required' };
  if (username.length < 3) return { isValid: false, error: 'Username must be at least 3 characters' };
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return { isValid: false, error: 'Username can only contain letters, numbers, underscores, and hyphens' };
  }
  return { isValid: true };
};

export const getPasswordStrength = (password: string): PasswordStrength => {
  if (!password) return { score: 0, feedback: 'Password is required' };

  let score: 0 | 1 | 2 | 3 = 0;
  const feedback: string[] = [];

  if (password.length >= PASSWORD_MIN_LENGTH) score++;
  else feedback.push(`At least ${PASSWORD_MIN_LENGTH} characters`);

  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  else feedback.push('Mix of upper and lowercase letters');

  if (/[0-9]/.test(password)) score++;
  else feedback.push('Include numbers');

  if (/[^a-zA-Z0-9]/.test(password)) score++;
  else feedback.push('Include special characters');

  const feedbackMessage =
    score === 3 ? 'Strong password' : feedback.length > 0 ? `Add: ${feedback.join(', ')}` : 'Good password';

  return { score: score as 0 | 1 | 2 | 3, feedback: feedbackMessage };
};
