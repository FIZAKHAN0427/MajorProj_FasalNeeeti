import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import authService from '../services/authService';

/**
 * Professional Navigation component with clean design
 * Features: Logo, navigation links, theme switcher, mobile menu
 */
const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setUser(authService.getUser());
  }, [location]);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    navigate('/');
  };

  // Dynamic navigation items based on auth state
  const getNavItems = () => {
    if (user) {
      return [
        { name: 'Home', path: '/' },
        { 
          name: user.role === 'farmer' ? 'Dashboard' : 'Admin Panel', 
          path: user.role === 'farmer' ? '/farmer-dashboard' : '/admin-dashboard' 
        },
        { name: 'Logout', action: handleLogout }
      ];
    }
    return [
      { name: 'Home', path: '/' },
      { name: 'Farmer Login', path: '/farmer-login' },
      { name: 'Admin Login', path: '/admin-login' }
    ];
  };

  const navItems = getNavItems();

  // Check if current path is active
  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white/95 dark:bg-secondary-900/95 backdrop-blur-md shadow-lg sticky top-0 z-50 transition-all duration-300 border-b border-primary-100 dark:border-secondary-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-4 group">
            <div className="w-14 h-14 bg-gradient-to-br from-primary-600 to-accent-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xl">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <div className="w-5 h-5 bg-primary-600 rounded-full"></div>
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-secondary-900 dark:text-white">
                FasalNeeti
              </h1>
              <p className="text-xs text-secondary-600 dark:text-secondary-400 -mt-1">
                Smart Agriculture Solutions
              </p>
            </div>
          </Link>

          {/* Right Side - Navigation & Theme Toggle */}
          <div className="flex items-center space-x-6">
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                item.action ? (
                  <button
                    key={item.name}
                    onClick={item.action}
                    className="nav-link px-4 py-2 rounded-lg transition-all duration-200 font-medium hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                  >
                    {item.name}
                  </button>
                ) : (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`nav-link px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
                      isActivePath(item.path)
                        ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                        : 'hover:bg-primary-50 dark:hover:bg-secondary-800'
                    }`}
                  >
                    {item.name}
                  </Link>
                )
              ))}
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-primary-100 dark:bg-secondary-700 hover:bg-primary-200 dark:hover:bg-secondary-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5 text-secondary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-primary-100 dark:bg-secondary-700 hover:bg-primary-200 dark:hover:bg-secondary-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-primary-200 dark:border-secondary-700 animate-fade-in">
            <div className="flex flex-col space-y-1">
              {navItems.map((item) => (
                item.action ? (
                  <button
                    key={item.name}
                    onClick={() => {
                      item.action();
                      setIsMobileMenuOpen(false);
                    }}
                    className="nav-link px-4 py-3 rounded-lg transition-all duration-200 font-medium hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 text-left"
                  >
                    {item.name}
                  </button>
                ) : (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`nav-link px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
                      isActivePath(item.path)
                        ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                        : 'hover:bg-primary-50 dark:hover:bg-secondary-800'
                    }`}
                  >
                    {item.name}
                  </Link>
                )
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
