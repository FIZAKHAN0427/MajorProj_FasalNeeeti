import React from 'react';
import { useParams } from 'react-router-dom';
import LoginForm from '../components/LoginForm';

const Login = () => {
  const { userType } = useParams();
  
  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-primary-50 to-accent-50 dark:from-secondary-900 dark:to-secondary-800">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-white mb-2">
            Welcome to FasalNeeti
          </h1>
          <p className="text-secondary-600 dark:text-secondary-400">
            Sign in to access your dashboard
          </p>
        </div>
        
        <LoginForm userType={userType} />
      </div>
    </div>
  );
};

export default Login;