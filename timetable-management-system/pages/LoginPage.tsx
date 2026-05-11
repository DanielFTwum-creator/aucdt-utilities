
import { GraduationCap, Shield, User } from 'lucide-react';
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';

const LoginPage: React.FC = () => {
  const { login } = useAuth();

  const handleLogin = (role: UserRole) => {
    login(role);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-aucdt-light p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-aucdt-green">TUC</h1>
          <p className="mt-2 text-aucdt-brown">Timetable Management System</p>
        </div>
        <div className="space-y-4">
          <p className="text-center text-gray-600 font-medium">Select your role to sign in</p>
          <button
            onClick={() => handleLogin(UserRole.ADMIN)}
            className="w-full flex items-center justify-center p-4 text-lg font-semibold text-white bg-aucdt-brown rounded-lg hover:bg-aucdt-brown/90 transition-all duration-300 transform hover:scale-105"
          >
            <Shield className="mr-3" />
            Administrator
          </button>
          <button
            onClick={() => handleLogin(UserRole.LECTURER)}
            className="w-full flex items-center justify-center p-4 text-lg font-semibold text-white bg-aucdt-green rounded-lg hover:bg-aucdt-green/90 transition-all duration-300 transform hover:scale-105"
          >
            <User className="mr-3" />
            Lecturer
          </button>
          <button
            onClick={() => handleLogin(UserRole.STUDENT)}
            className="w-full flex items-center justify-center p-4 text-lg font-semibold text-aucdt-brown bg-aucdt-gold rounded-lg hover:bg-aucdt-gold/90 transition-all duration-300 transform hover:scale-105"
          >
            <GraduationCap className="mr-3" />
            Student
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
