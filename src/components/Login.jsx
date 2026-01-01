// components/Login.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE = 'http://localhost:3001';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isSignUp, setIsSignUp] = useState(false);
  const [signUpData, setSignUpData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    dietaryPreference: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
      navigate('/menu');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignUpChange = (e) => {
    setSignUpData({
      ...signUpData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('🔍 Attempting login with:', formData.email);
      console.log('📡 Making request to:', `${API_BASE}/users?email=${formData.email}`);
      
      // Check if user exists in the database
      const response = await axios.get(`${API_BASE}/users?email=${formData.email}`);
      console.log('📦 Login response:', response);
      
      const users = response.data;

      if (users.length === 0) {
        setError('No account found with this email. Please sign up.');
        setLoading(false);
        return;
      }

      const user = users[0];
      console.log('👤 Found user:', user);

      // In a real app, you would verify the password with backend
      // For demo purposes, we'll accept any password
      if (formData.password) {
        // Store user data in localStorage
        localStorage.setItem('userData', JSON.stringify(user));
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userId', user.id);

        // Trigger storage event to update App.js state
        window.dispatchEvent(new Event('storage'));

        setSuccess('Login successful! Redirecting...');
        
        // Redirect to menu page after successful login
        setTimeout(() => {
          navigate('/menu');
        }, 1500);

      } else {
        setError('Please enter your password');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      console.error('Error details:', error.response?.data || error.message);
      
      // More specific error messages
      if (error.code === 'ERR_NETWORK') {
        setError('Cannot connect to server. Make sure JSON Server is running on port 3001.');
      } else if (error.response?.status === 404) {
        setError('Server endpoint not found. Check if JSON Server is running.');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validation
    if (!signUpData.fullName || !signUpData.email || !signUpData.password || !signUpData.confirmPassword) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (signUpData.password !== signUpData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (signUpData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      console.log('🔍 Attempting signup with email:', signUpData.email);
      console.log('📡 Testing API connection to:', `${API_BASE}/users`);
      
      // First, test if the API is reachable
      try {
        const testResponse = await axios.get(`${API_BASE}/users`);
        console.log('✅ API connection successful:', testResponse.status);
      } catch (testError) {
        console.error('❌ API connection failed:', testError.message);
        throw new Error(`Cannot connect to server: ${testError.message}. Make sure JSON Server is running.`);
      }

      // Check if email already exists
      console.log('📡 Checking if email exists:', `${API_BASE}/users?email=${signUpData.email}`);
      const existingUsers = await axios.get(`${API_BASE}/users?email=${signUpData.email}`);
      console.log('📦 Existing users response:', existingUsers.data);
      
      if (existingUsers.data.length > 0) {
        setError('An account with this email already exists');
        setLoading(false);
        return;
      }

      // Create complete user profile data
      const userData = {
        id: Date.now().toString(),
        name: signUpData.fullName,
        email: signUpData.email,
        phone: signUpData.phone || '',
        address: signUpData.address || '',
        city: signUpData.city || '',
        zipCode: signUpData.zipCode || '',
        dietaryPreference: signUpData.dietaryPreference || '',
        profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80',
        firstName: signUpData.fullName.split(' ')[0] || '',
        lastName: signUpData.fullName.split(' ').slice(1).join(' ') || '',
        joinDate: new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        createdAt: new Date().toISOString(),
        orders: 0,
        favorites: 0,
        rating: 4.8
      };

      console.log('📤 Attempting to save user:', userData);
      
      // Save to JSON server
      const response = await axios.post(`${API_BASE}/users`, userData);
      console.log('✅ Save response:', response.status, response.data);

      // Store user data in localStorage for immediate access
      localStorage.setItem('userData', JSON.stringify(userData));
      localStorage.setItem('userEmail', signUpData.email);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userId', userData.id);

      // Trigger storage event to update App.js state
      window.dispatchEvent(new Event('storage'));

      setSuccess('Account created successfully! Setting up your profile...');
      
      // Redirect to menu after successful signup
      setTimeout(() => {
        navigate('/menu');
      }, 2000);

    } catch (error) {
      console.error('❌ Error creating account:', error);
      console.error('❌ Error details:', error.response?.data || error.message);
      console.error('❌ Error code:', error.code);
      
      // More specific error messages
      if (error.message.includes('Cannot connect to server')) {
        setError(error.message);
      } else if (error.code === 'ERR_NETWORK') {
        setError('Cannot connect to server. Please make sure: 1. JSON Server is running 2. It\'s on port 3001 3. No firewall blocking');
      } else if (error.response?.status === 404) {
        setError('Server not found. Make sure JSON Server is running with: json-server --watch db.json --port 3001');
      } else if (error.response?.status === 500) {
        setError('Server error. Check if db.json exists in your server folder.');
      } else {
        setError('Failed to create account. Please try again. Error: ' + (error.message || 'Unknown error'));
      }
    } finally {
      setLoading(false);
    }
  };

  const switchToSignUp = () => {
    setIsSignUp(true);
    setError('');
    setSuccess('');
    // Reset signup form
    setSignUpData({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      address: '',
      city: '',
      zipCode: '',
      dietaryPreference: ''
    });
  };

  const switchToLogin = () => {
    setIsSignUp(false);
    setError('');
    setSuccess('');
    // Reset login form
    setFormData({
      email: '',
      password: ''
    });
  };

  const containerStyle = {
    backgroundImage: "url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  };

  const formStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: '40px',
    borderRadius: '20px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '500px',
    backdropFilter: 'blur(10px)'
  };

  return (
    <div style={containerStyle}>
      <div style={formStyle}>
        <div className="text-center mb-4">
          <img 
            src="https://cdn-icons-png.flaticon.com/512/3082/3082383.png" 
            alt="Urbanzest Logo" 
            width="60" 
            height="60" 
            className="mb-3"
          />
          <h2 className="fw-bold" style={{ color: '#2E8B57' }}>
            {isSignUp ? 'Create Your Account' : 'Welcome Back'}
          </h2>
          <p className="text-muted">
            {isSignUp ? 'Join our restaurant community and start ordering' : 'Sign in to your account'}
          </p>
        </div>

        {error && (
          <div className="alert alert-danger d-flex align-items-center" role="alert">
            <i className="fas fa-exclamation-circle me-2"></i>
            <div>
              <strong></strong> {error}
              <br />
              <small className="text-muted"></small>
            </div>
          </div>
        )}

        {success && (
          <div className="alert alert-success d-flex align-items-center" role="alert">
            <i className="fas fa-check-circle me-2"></i>
            <div>{success}</div>
          </div>
        )}

        {!isSignUp ? (
          // Login Form
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control py-2"
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-control py-2"
                placeholder="Enter your password"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="btn w-100 py-2 fw-bold mb-3"
              style={{
                backgroundColor: loading ? '#6c757d' : '#2E8B57',
                borderColor: loading ? '#6c757d' : '#2E8B57',
                color: 'white',
                borderRadius: '25px',
                fontSize: '1.1rem'
              }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Signing In...
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt me-2"></i>
                  Sign In
                </>
              )}
            </button>

            <div className="text-center">
              <p className="text-muted mb-0">
                Don't have an account?{' '}
                <button 
                  type="button"
                  onClick={switchToSignUp}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#2E8B57',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                  disabled={loading}
                >
                  Create an account
                </button>
              </p>
            </div>
          </form>
        ) : (
          // Enhanced Sign Up Form
          <form onSubmit={handleSignUp}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={signUpData.fullName}
                onChange={handleSignUpChange}
                className="form-control py-2"
                placeholder="Enter your full name"
                required
                disabled={loading}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Email Address *</label>
              <input
                type="email"
                name="email"
                value={signUpData.email}
                onChange={handleSignUpChange}
                className="form-control py-2"
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={signUpData.phone}
                onChange={handleSignUpChange}
                className="form-control py-2"
                placeholder="Enter your phone number"
                disabled={loading}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Address</label>
              <input
                type="text"
                name="address"
                value={signUpData.address}
                onChange={handleSignUpChange}
                className="form-control py-2"
                placeholder="Enter your address"
                disabled={loading}
              />
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label fw-semibold">City</label>
                  <input
                    type="text"
                    name="city"
                    value={signUpData.city}
                    onChange={handleSignUpChange}
                    className="form-control py-2"
                    placeholder="City"
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label fw-semibold">Zip Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={signUpData.zipCode}
                    onChange={handleSignUpChange}
                    className="form-control py-2"
                    placeholder="Zip Code"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Dietary Preference</label>
              <select
                name="dietaryPreference"
                value={signUpData.dietaryPreference}
                onChange={handleSignUpChange}
                className="form-control py-2"
                disabled={loading}
              >
                <option value="">Select your preference</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="non-vegetarian">Non-Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="gluten-free">Gluten-Free</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Password *</label>
              <input
                type="password"
                name="password"
                value={signUpData.password}
                onChange={handleSignUpChange}
                className="form-control py-2"
                placeholder="Create a password (min. 6 characters)"
                required
                disabled={loading}
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold">Confirm Password *</label>
              <input
                type="password"
                name="confirmPassword"
                value={signUpData.confirmPassword}
                onChange={handleSignUpChange}
                className="form-control py-2"
                placeholder="Confirm your password"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="btn w-100 py-2 fw-bold mb-3"
              style={{
                backgroundColor: loading ? '#6c757d' : '#2E8B57',
                borderColor: loading ? '#6c757d' : '#2E8B57',
                color: 'white',
                borderRadius: '25px',
                fontSize: '1.1rem'
              }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Creating Account...
                </>
              ) : (
                <>
                  <i className="fas fa-user-plus me-2"></i>
                  Create Account
                </>
              )}
            </button>

            <div className="text-center">
              <p className="text-muted mb-0">
                Already have an account?{' '}
                <button 
                  type="button"
                  onClick={switchToLogin}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#2E8B57',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                  disabled={loading}
                >
                  Sign in here
                </button>
              </p>
            </div>
          </form>
        )}

        {/* Debug Info */}
        <div className="mt-4 pt-3 border-top text-center">
          {/* <small className="text-muted">
            API Base URL: {API_BASE}
            <br />
            To start JSON Server: <code>json-server --watch db.json --port 3001</code>
          </small> */}
        </div>
      </div>
    </div>
  );
}

export default Login;