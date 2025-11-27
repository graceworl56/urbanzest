// components/Preloader.jsx
import React from 'react';
import './Preloader.css'; // We'll create this CSS file

const Preloader = () => {
  return (
    <div className="preloader">
      <div className="preloader-content">
        {/* Urban Zest Logo/Icon */}
        <div className="logo-container">
          <div className="logo-icon">
            <span className="utensils">🍽️</span>
            <span className="zest">✨</span>
          </div>
          <h1 className="brand-name">Urban Zest</h1>
        </div>
        
        {/* Animated Loader */}
        <div className="loader">
          <div className="loader-spinner"></div>
          <div className="loader-dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        </div>
        
        {/* Loading Text */}
        <p className="loading-text">Serving delicious moments...</p>
      </div>
    </div>
  );
};

export default Preloader;