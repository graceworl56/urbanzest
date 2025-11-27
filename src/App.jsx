// App.js
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import ErrorBoundary from './errorBoundary';
import Preloader from './components/Preloader';
import LandingPage from './components/landingPage';
import Login from './components/Login';
import Menu from './components/Menu';
import Cart from './components/Cart';
import Profile from './components/Profile';
import Orders from './components/Orders';
import PaymentPage from './components/PaymentPage';
import TrackOrder from './components/TrackOrder';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in immediately
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const storedUserData = localStorage.getItem('userData');
    
    setIsLoggedIn(loggedIn);
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }

    // Listen for storage changes
    const handleStorageChange = () => {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      const storedUserData = localStorage.getItem('userData');
      
      setIsLoggedIn(loggedIn);
      if (storedUserData) {
        setUserData(JSON.parse(storedUserData));
      } else {
        setUserData(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Shorter loading time - just for visual effect, not blocking functionality
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // Reduced to 1.5 seconds

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearTimeout(timer);
    };
  }, []);

  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setUserData(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('userId');
    localStorage.removeItem('cart');
    setIsLoggedIn(false);
    setUserData(null);
  };

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    return isLoggedIn ? children : <Navigate to="/login" />;
  };

  return (
    <ErrorBoundary>
      {/* Show preloader only during initial app load */}
      {loading && <Preloader />}
      
      {/* Main app content - always rendered but might be behind preloader */}
      <div className="app-container" style={{ display: loading ? 'none' : 'block', minHeight: '100vh' }}>
        <Router>
          {/* Show navigation only when logged in */}
          {isLoggedIn && (
            <nav className="navbar navbar-expand-lg navbar-light py-2" style={{ backgroundColor: '#2E8B57', width: '100%' }}>
              <div className="container-fluid">
                <Link className="navbar-brand d-flex align-items-center text-white fw-bold" to="/menu">
                  <img 
                    src="https://cdn-icons-png.flaticon.com/512/3082/3082383.png" 
                    alt="Urbanzest Logo" 
                    width="30" 
                    height="30" 
                    className="me-2"
                  />
                  Urbanzest
                </Link>
                
                <button 
                  className="navbar-toggler" 
                  type="button" 
                  data-bs-toggle="collapse" 
                  data-bs-target="#navbarNav"
                  aria-controls="navbarNav" 
                  aria-expanded="false" 
                  aria-label="Toggle navigation"
                >
                  <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                  <div className="navbar-nav ms-auto align-items-center">
                    <Link className="nav-link text-white mx-2" to="/menu">
                      <i className="fas fa-utensils me-1"></i>Menu
                    </Link>
                    <Link className="nav-link text-white mx-2" to="/cart">
                      <i className="fas fa-shopping-cart me-1"></i>Cart
                    </Link>
                    <Link className="nav-link text-white mx-2" to="/orders">
                      <i className="fas fa-receipt me-1"></i>Orders
                    </Link>
                    <Link className="nav-link text-white mx-2" to="/profile">
                      <i className="fas fa-user me-1"></i>
                      {userData?.firstName || 'Profile'}
                    </Link>
                    <button 
                      className="btn btn-outline-light btn-sm ms-3" 
                      onClick={handleLogout}
                    >
                      <i className="fas fa-sign-out-alt me-1"></i>Logout
                    </button>
                  </div>
                </div>
              </div>
            </nav>
          )}

          <main className="main-content" style={{ width: '100%', minHeight: 'calc(100vh - 200px)' }}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route 
                path="/login" 
                element={
                  isLoggedIn ? <Navigate to="/menu" replace /> : <Login />
                } 
              />
              
              {/* Protected Routes */}
              <Route 
                path="/menu" 
                element={
                  <ProtectedRoute>
                    <Menu />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/cart" 
                element={
                  <ProtectedRoute>
                    <Cart />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/orders" 
                element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/payment" 
                element={
                  <ProtectedRoute>
                    <PaymentPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/track-order" 
                element={
                  <ProtectedRoute>
                    <TrackOrder />
                  </ProtectedRoute>
                } 
              />
              
              {/* Catch all route */}
              <Route 
                path="*" 
                element={
                  isLoggedIn ? <Navigate to="/menu" replace /> : <Navigate to="/" replace />
                } 
              />
            </Routes>
          </main>

          {/* Footer - Show only when logged in */}
          {isLoggedIn && (
            <footer className="bg-dark text-white py-4" style={{ width: '100%' }}>
              <div className="container-fluid">
                <div className="row">
                  <div className="col-md-4">
                    <h5>Urbanzest Restaurant</h5>
                    <p>Delicious food delivered to your doorstep. Experience the finest cuisine in town.</p>
                  </div>
                  <div className="col-md-4">
                    <h5>Quick Links</h5>
                    <ul className="list-unstyled">
                      <li>
                        <Link to="/menu" className="text-white text-decoration-none">
                          <i className="fas fa-utensils me-1"></i>Menu
                        </Link>
                      </li>
                      <li>
                        <Link to="/cart" className="text-white text-decoration-none">
                          <i className="fas fa-shopping-cart me-1"></i>Cart
                        </Link>
                      </li>
                      <li>
                        <Link to="/orders" className="text-white text-decoration-none">
                          <i className="fas fa-receipt me-1"></i>Orders
                        </Link>
                      </li>
                      <li>
                        <Link to="/profile" className="text-white text-decoration-none">
                          <i className="fas fa-user me-1"></i>Profile
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-4">
                    <h5>Contact Info</h5>
                    <ul className="list-unstyled">
                      <li><i className="fas fa-map-marker-alt me-2"></i>123 Food Street, City</li>
                      <li><i className="fas fa-phone me-2"></i>+1 (555) 123-4567</li>
                      <li><i className="fas fa-envelope me-2"></i>info@urbanzest.com</li>
                      <li><i className="fas fa-clock me-2"></i>Open: 9AM - 11PM</li>
                    </ul>
                  </div>
                </div>
                <hr className="my-4" />
                <div className="text-center">
                  <p>&copy; 2024 Urbanzest Restaurant. All rights reserved.</p>
                </div>
              </div>
            </footer>
          )}
        </Router>
      </div>
    </ErrorBoundary>
  );
}

export default App;