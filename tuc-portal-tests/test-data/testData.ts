/**
 * Test data for TUC Portal tests
 * Store sensitive data in environment variables or .env file
 */

export const TestData = {
  validCredentials: {
    username: process.env.TEST_USERNAME || 'test_applicant',
    password: process.env.TEST_PASSWORD || 'Test@123',
    email: process.env.TEST_EMAIL || 'test@example.com'
  },
  
  invalidCredentials: {
    username: 'invalid_user',
    password: 'wrong_password'
  },
  
  applicationData: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+233241234567',
    dateOfBirth: '01/01/2000',
    gender: 'Male',
    nationality: 'Ghana',
    region: 'Greater Accra',
    district: 'Accra Metropolis'
  },
  
  academicData: {
    schoolName: 'Test Senior High School',
    yearCompleted: '2020',
    indexNumber: 'TEST123456',
    programme: 'Computer Science'
  },
  
  urls: {
    baseUrl: 'https://portal.aucdt.edu.gh/admissions-qa/#/',
    loginPage: 'main-applcation-login',
    dashboard: 'dashboard',
    application: 'application'
  },
  
  timeouts: {
    short: 5000,
    medium: 10000,
    long: 30000
  }
};

export const ErrorMessages = {
  invalidLogin: 'Invalid username or password',
  requiredField: 'This field is required',
  invalidEmail: 'Please enter a valid email address',
  invalidPhone: 'Please enter a valid phone number'
};

export const SuccessMessages = {
  loginSuccess: 'Login successful',
  applicationSubmitted: 'Application submitted successfully',
  profileUpdated: 'Profile updated successfully'
};
