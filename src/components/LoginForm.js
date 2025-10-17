import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const LoginForm = ({ userType }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await authService.login(formData.email, formData.password);
    
    if (result.success) {
      const user = result.data.user;
      if (user.role === userType) {
        navigate(userType === 'farmer' ? '/farmer-dashboard' : '/admin-dashboard');
      } else {
        setError(`Invalid ${userType} credentials`);
      }
    } else {
      setError(result.error || 'Login failed');
    }
    
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-secondary-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-secondary-900 dark:text-white">
        {userType === 'farmer' ? 'Farmer Login' : 'Admin Login'}
      </h2>
      
      {error && (
        <div className="alert-warning mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="input-field"
            placeholder="Enter your email"
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="input-field"
            placeholder="Enter your password"
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      {userType === 'farmer' && (
        <div className="mt-4 text-center">
          <p className="text-sm text-secondary-600 dark:text-secondary-400">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/farmer-login')}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Register here
            </button>
          </p>
        </div>
      )}
    </div>
  );
};

export default LoginForm;