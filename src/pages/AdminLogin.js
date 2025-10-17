import React from 'react';
import LoginForm from '../components/LoginForm';

const AdminLogin = () => {
  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-primary-50 to-accent-50 dark:from-secondary-900 dark:to-secondary-800">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-primary-600 to-accent-600 rounded-full flex items-center justify-center mb-6">
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-white mb-2">
            Admin Access
          </h1>
          <p className="text-secondary-600 dark:text-secondary-400">
            FasalNeeti Management Portal
          </p>
        </div>
        
        <LoginForm userType="admin" />
        
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">Demo Admin:</h3>
          <div className="text-sm text-blue-700 dark:text-blue-300">
            <p><strong>Email:</strong> admin@fasalneeti.com</p>
            <p><strong>Password:</strong> admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;