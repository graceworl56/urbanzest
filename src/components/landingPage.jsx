// components/LandingPage.js
import React from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
  const containerStyle = {
    backgroundImage: "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
    position: 'relative'
  };

const pageStyle = {
  width: '100vw',
  minHeight: '100vh',
  margin: 0,
  padding: 0,
  overflowX: 'hidden'
};

return (
  <div style={pageStyle}>
    {/* Your existing home content */}
  </div>
);



  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)'
  };

  const contentStyle = {
    position: 'relative',
    zIndex: 2,
    color: 'white',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: '20px'
  };

  return (
    <div style={containerStyle}>
      <div style={overlayStyle}></div>
      
      <div style={contentStyle}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <img 
                src="https://cdn-icons-png.flaticon.com/512/3082/3082383.png" 
                alt="Urbanzest Logo" 
                width="80" 
                height="80" 
                className="mb-4"
              />
              <h1 className="display-3 fw-bold mb-4">
                Welcome to <span style={{ color: '#2E8B57' }}>Urbanzest</span>
              </h1>
              <p className="lead mb-5 fs-4">
                Discover the finest cuisine delivered to your doorstep. 
                Fresh ingredients, authentic flavors, and unforgettable dining experiences.
              </p>
              
              {/* Centered Get Started Button - DIRECT TO MENU */}
              <div className="row justify-content-center mt-4">
                <div className="col-md-6 col-lg-4">
                  <Link 
                    to="/menu" 
                    className="btn btn-lg w-100 fw-bold py-3"
                    style={{
                      backgroundColor: '#2E8B57',
                      border: '2px solid #2E8B57',
                      color: 'white',
                      borderRadius: '50px',
                      fontSize: '1.2rem',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#2E8B57';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#2E8B57';
                      e.target.style.color = 'white';
                    }}
                  >
                    Get Started
                  </Link>
                </div>
              </div>

              {/* Features Section */}
              <div className="row mt-4 pt-4">
                <div className="col-md-4 mb-4">
                  <div className="text-center">
                    <div className="bg-success rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                         style={{ width: '80px', height: '80px' }}>
                      <span style={{ color: 'white', fontSize: '1.5rem' }}>🚚</span>
                    </div>
                    <h5>Fast Delivery</h5>
                    <p className="text-light">30-minute delivery guarantee</p>
                  </div>
                </div>
                <div className="col-md-4 mb-4">
                  <div className="text-center">
                    <div className="bg-success rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                         style={{ width: '80px', height: '80px' }}>
                      <span style={{ color: 'white', fontSize: '1.5rem' }}>🍽️</span>
                    </div>
                    <h5>Fresh Ingredients</h5>
                    <p className="text-light">Locally sourced, always fresh</p>
                  </div>
                </div>
                <div className="col-md-4 mb-4">
                  <div className="text-center">
                    <div className="bg-success rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                         style={{ width: '80px', height: '80px' }}>
                      <span style={{ color: 'white', fontSize: '1.5rem' }}>🏆</span>
                    </div>
                    <h5>Award Winning</h5>
                    <p className="text-light">Best restaurant 2024</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;