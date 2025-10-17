import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';

// Import components
import Navbar from './components/Navbar';

// Import pages
import Homepage from './pages/Homepage';
import FarmerLogin from './pages/FarmerLogin';
import FarmerDashboard from './pages/FarmerDashboard';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

/**
 * Main App Component
 * Handles routing and theme context for the entire application
 */
function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<FarmerLogin />} /> {/* Default login redirects to farmer login */}
            
            {/* Farmer Routes */}
            <Route path="/farmer-login" element={<FarmerLogin />} />
            <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
            
            {/* Admin Routes */}
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            
            {/* Fallback Route - Redirect to Homepage */}
            <Route path="*" element={<Homepage />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
