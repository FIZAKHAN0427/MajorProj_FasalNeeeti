import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Professional Homepage component with clean design and farmer-focused content
 * Features: Hero section, feature highlights, call-to-action, testimonials
 */
const Homepage = () => {
  
  // Feature highlights data
  const features = [
    {
      title: 'AI Crop Yield Prediction',
      description: 'Predict crop yield (kg/ha) using satellite NDVI data, weather patterns, soil pH, and advanced ML models. Just select district, crop, season, and year.',
      details: ['Satellite NDVI analysis', 'Real weather data integration', 'Soil pH optimization', 'XGBoost ML predictions']
    },
    {
      title: 'Smart Monitoring System',
      description: 'Real-time monitoring and intelligent alerts for drought conditions, heat stress, pest detection, and crop health management.',
      details: ['Drought monitoring', 'Heat stress detection', 'Pest outbreak alerts', 'Crop health tracking']
    },
    {
      title: 'Scientific AI Models',
      description: 'Trustworthy, science-based predictions using federated learning and physics-informed AI for reliable agricultural insights.',
      details: ['Federated learning', 'Physics-based models', 'Scientific validation', 'Privacy-preserving AI']
    },
    {
      title: 'Comprehensive Dashboard',
      description: 'Interactive analytics platform with detailed maps, charts, weather data, and actionable insights for informed decision making.',
      details: ['Real-time maps', 'Yield analytics', 'Weather insights', 'Data visualization']
    }
  ];

  return (
    <div className="min-h-screen overflow-hidden">
      
      {/* Spectacular Hero Section with Your Background Image */}
      <section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/home.jpg')`,
        }}
      >
        
        {/* Dynamic Overlay with Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/50"></div>
        
        {/* Floating Geometric Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl animate-float-delayed"></div>
          <div className="absolute bottom-1/4 left-1/3 w-48 h-48 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
        </div>
        
        {/* Particle Effect Overlay */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='27' cy='7' r='1'/%3E%3Ccircle cx='47' cy='7' r='1'/%3E%3Ccircle cx='7' cy='27' r='1'/%3E%3Ccircle cx='27' cy='27' r='1'/%3E%3Ccircle cx='47' cy='27' r='1'/%3E%3Ccircle cx='7' cy='47' r='1'/%3E%3Ccircle cx='27' cy='47' r='1'/%3E%3Ccircle cx='47' cy='47' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        {/* Main Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          
          {/* Hero Content - No Logo */}
          <div className="mb-16 animate-fade-in">
            
            {/* Magnificent Typography */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 tracking-wide transform hover:scale-105 transition-all duration-500">
              <span className="bg-gradient-to-r from-white via-primary-100 to-accent-100 bg-clip-text text-transparent drop-shadow-2xl font-serif italic">
                FasalNeeti
              </span>
            </h1>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-accent-500/20 rounded-3xl blur-2xl"></div>
              <p className="relative text-lg sm:text-xl lg:text-2xl text-white font-bold mb-4 px-10 py-6 rounded-3xl bg-gradient-to-r from-white/15 to-white/25 backdrop-blur-lg border border-white/40 shadow-2xl transform hover:scale-105 transition-all duration-500">
                <span className="bg-gradient-to-r from-white to-primary-100 bg-clip-text text-transparent font-serif">
                  Apni Mitti, Apna Data, Apna Bhavishya
                </span>
              </p>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Content Section Below Hero */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-primary-50/30 to-accent-50/30 dark:from-secondary-900 dark:via-secondary-800 dark:to-secondary-900">
        <div className="max-w-7xl mx-auto">
          
          {/* Elegant Description */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-primary-200/50 rounded-2xl blur-xl"></div>
              <h2 className="relative text-2xl sm:text-3xl font-bold text-secondary-900 dark:text-white px-8 py-4 rounded-2xl bg-white/80 dark:bg-secondary-800/80 backdrop-blur-md border border-primary-200 dark:border-secondary-700 shadow-xl">
                Smart Agriculture Solutions for Modern Farmers
              </h2>
            </div>
            <p className="text-xl text-secondary-700 dark:text-secondary-300 leading-relaxed max-w-4xl mx-auto mb-12">
              Transform your farming with cutting-edge technology. Get accurate crop predictions, 
              real-time monitoring, and actionable insights to maximize your harvest and profitability.
            </p>
          </div>

          {/* Stunning Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-accent-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
              <div className="relative bg-white/90 dark:bg-secondary-800/90 backdrop-blur-xl rounded-2xl p-8 text-center border border-primary-200/50 dark:border-secondary-700/50 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-3">Smart Technology</h3>
                <p className="text-secondary-600 dark:text-secondary-400">AI-powered agricultural insights</p>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-400 to-primary-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
              <div className="relative bg-white/90 dark:bg-secondary-800/90 backdrop-blur-xl rounded-2xl p-8 text-center border border-accent-200/50 dark:border-secondary-700/50 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-3">Sustainable Farming</h3>
                <p className="text-secondary-600 dark:text-secondary-400">Eco-friendly practices</p>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-accent-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
              <div className="relative bg-white/90 dark:bg-secondary-800/90 backdrop-blur-xl rounded-2xl p-8 text-center border border-primary-200/50 dark:border-secondary-700/50 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-3">Easy to Use</h3>
                <p className="text-secondary-600 dark:text-secondary-400">User-friendly interface</p>
              </div>
            </div>
          </div>

          {/* Spectacular Call-to-Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              to="/farmer-login"
              className="group relative overflow-hidden bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-bold py-5 px-12 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1 hover:scale-105"
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-12"></div>
              <div className="relative flex items-center space-x-3 text-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Start Farming Smart</span>
              </div>
            </Link>
            
            <Link
              to="/admin-login"
              className="group relative overflow-hidden bg-white/80 dark:bg-secondary-800/80 backdrop-blur-xl border-2 border-primary-300 dark:border-secondary-600 text-primary-700 dark:text-primary-400 hover:text-white font-bold py-5 px-12 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1 hover:scale-105 hover:bg-primary-600 dark:hover:bg-primary-600"
            >
              <div className="relative flex items-center space-x-3 text-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Admin Portal</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-secondary-900">
        <div className="max-w-7xl mx-auto">
          
          {/* Section Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="section-title">
              Powerful Features for Smart Farming
            </h2>
            <p className="section-subtitle max-w-3xl mx-auto">
              Discover how FasalNeeti combines cutting-edge technology with agricultural expertise 
              to help you make data-driven farming decisions.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="card p-10 hover:shadow-4xl transition-all duration-500 animate-slide-up group hover:-translate-y-3 hover:scale-[1.02]"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <div className="w-6 h-6 bg-primary-600 rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-secondary-600 dark:text-secondary-400 mb-4 leading-relaxed">
                      {feature.description}
                    </p>
                    <ul className="space-y-2">
                      {feature.details.map((detail, idx) => (
                        <li key={idx} className="text-sm text-secondary-500 dark:text-secondary-500 flex items-center">
                          <svg className="w-4 h-4 text-primary-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-accent-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Trusted by Farmers Nationwide</h2>
            <p className="text-primary-100">Join thousands of farmers who are already transforming their agriculture</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 text-center">
            <div className="animate-fade-in transform hover:scale-110 transition-all duration-300 p-6 rounded-2xl bg-white/10 backdrop-blur-sm hover:bg-white/20">
              <div className="text-6xl font-black mb-3 bg-gradient-to-r from-white to-primary-100 bg-clip-text text-transparent">5,000+</div>
              <div className="text-primary-100 font-semibold text-lg">Active Farmers</div>
            </div>
            <div className="animate-fade-in transform hover:scale-110 transition-all duration-300 p-6 rounded-2xl bg-white/10 backdrop-blur-sm hover:bg-white/20" style={{ animationDelay: '0.1s' }}>
              <div className="text-6xl font-black mb-3 bg-gradient-to-r from-white to-primary-100 bg-clip-text text-transparent">95%</div>
              <div className="text-primary-100 font-semibold text-lg">Prediction Accuracy</div>
            </div>
            <div className="animate-fade-in transform hover:scale-110 transition-all duration-300 p-6 rounded-2xl bg-white/10 backdrop-blur-sm hover:bg-white/20" style={{ animationDelay: '0.2s' }}>
              <div className="text-6xl font-black mb-3 bg-gradient-to-r from-white to-primary-100 bg-clip-text text-transparent">28</div>
              <div className="text-primary-100 font-semibold text-lg">States Covered</div>
            </div>
            <div className="animate-fade-in transform hover:scale-110 transition-all duration-300 p-6 rounded-2xl bg-white/10 backdrop-blur-sm hover:bg-white/20" style={{ animationDelay: '0.3s' }}>
              <div className="text-6xl font-black mb-3 bg-gradient-to-r from-white to-primary-100 bg-clip-text text-transparent">24/7</div>
              <div className="text-primary-100 font-semibold text-lg">Expert Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-accent-50 to-primary-50 dark:from-secondary-800 dark:to-secondary-900">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <h2 className="text-4xl font-bold text-secondary-900 dark:text-white mb-6">
            Ready to Transform Your Farming?
          </h2>
          <p className="text-xl text-secondary-600 dark:text-secondary-400 mb-8">
            Join thousands of farmers who are already using FasalNeeti to increase their yield 
            and make data-driven farming decisions.
          </p>
          <div className="flex justify-center">
            <Link
              to="/farmer-login"
              className="btn-primary text-lg px-8 py-4"
            >
              Get Started Today
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
                    <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold">FasalNeeti</h3>
              </div>
              <p className="text-secondary-400 mb-4 leading-relaxed">
                Empowering farmers with AI-driven agricultural insights for sustainable 
                and profitable farming practices.
              </p>
              <p className="text-sm text-secondary-500">
                © 2024 FasalNeeti. All rights reserved.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/farmer-login" className="text-secondary-400 hover:text-white transition-colors">Farmer Portal</Link></li>
                <li><Link to="/admin-login" className="text-secondary-400 hover:text-white transition-colors">Admin Portal</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="mailto:support@fasalneeti.com" className="text-secondary-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="mailto:contact@fasalneeti.com" className="text-secondary-400 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="https://github.com/fasalneeti/docs" target="_blank" rel="noopener noreferrer" className="text-secondary-400 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="https://community.fasalneeti.com" target="_blank" rel="noopener noreferrer" className="text-secondary-400 hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
