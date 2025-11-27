// components/TrackOrder.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const API_BASE = 'http://localhost:3001';

function TrackOrder() {
  const [order, setOrder] = useState(null);
  const [deliveryStatus, setDeliveryStatus] = useState('preparing');
  const [progress, setProgress] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(30);
  const [showArrivalNotification, setShowArrivalNotification] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  const orderId = location.state?.orderId;
  const showSuccess = location.state?.showSuccess;

  useEffect(() => {
    if (orderId) {
      fetchOrder();
      if (showSuccess) {
        setShowSuccessPopup(true);
        setTimeout(() => {
          setShowSuccessPopup(false);
        }, 3000);
      }
    } else {
      // If no orderId, redirect to menu
      navigate('/menu');
    }
  }, [orderId, showSuccess, navigate]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to fetch the order from the API
      const response = await axios.get(`${API_BASE}/orders/${orderId}`);
      
      if (response.data) {
        setOrder(response.data);
        startDeliverySimulation();
      } else {
        setError('Order not found');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      setError('Failed to load order details');
      
      // Create a mock order for demo purposes
      const mockOrder = {
        id: orderId,
        userId: 1,
        items: [
          {
            menuId: "1",
            quantity: 2,
            name: "Margherita Pizza",
            price: 12.99,
            image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80"
          }
        ],
        total: 25.98,
        date: new Date().toISOString(),
        status: "preparing",
        paymentMethod: "card",
        orderNotes: "",
        estimatedDelivery: new Date(Date.now() + 30 * 60000).toISOString(),
        deliveryStatus: "preparing",
        deliveryAddress: "123 Main Street, City"
      };
      
      setOrder(mockOrder);
      startDeliverySimulation();
    } finally {
      setLoading(false);
    }
  };

  const startDeliverySimulation = () => {
    const statuses = [
      { status: 'preparing', progress: 25, time: 5 },
      { status: 'on_the_way', progress: 60, time: 15 },
      { status: 'arriving', progress: 90, time: 25 },
      { status: 'delivered', progress: 100, time: 30 }
    ];

    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < statuses.length) {
        const currentStatus = statuses[currentIndex];
        setDeliveryStatus(currentStatus.status);
        setProgress(currentStatus.progress);
        setEstimatedTime(30 - currentStatus.time);

        // Update order status in state
        if (order) {
          setOrder(prevOrder => ({
            ...prevOrder,
            deliveryStatus: currentStatus.status,
            status: currentStatus.status === 'delivered' ? 'delivered' : 'preparing'
          }));
        }

        if (currentStatus.status === 'arriving') {
          setShowArrivalNotification(true);
        }

        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 5000); // Update every 5 seconds for demo (faster for testing)
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'preparing': return 'Preparing your order';
      case 'on_the_way': return 'On the way';
      case 'arriving': return 'Arriving soon';
      case 'delivered': return 'Delivered';
      default: return 'Order placed';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'preparing': return '👨‍🍳';
      case 'on_the_way': return '🚚';
      case 'arriving': return '📦';
      case 'delivered': return '✅';
      default: return '📝';
    }
  };

  const getStatusIndex = (status) => {
    const statusOrder = ['preparing', 'on_the_way', 'arriving', 'delivered'];
    return statusOrder.indexOf(status);
  };

  // Show loading state
  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#f8f9fa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div className="text-center">
          <div className="spinner-border text-success mb-3" style={{ width: '3rem', height: '3rem' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h4 className="text-success">Loading your order...</h4>
          <p className="text-muted">Please wait while we fetch your order details</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !order) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#f8f9fa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div className="text-center">
          <div className="fs-1 text-danger mb-3">❌</div>
          <h4 className="text-danger">Failed to load order</h4>
          <p className="text-muted mb-4">{error}</p>
          <button 
            className="btn btn-success me-2"
            onClick={() => navigate('/menu')}
          >
            Back to Menu
          </button>
          <button 
            className="btn btn-outline-success"
            onClick={fetchOrder}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8f9fa',
      padding: '20px'
    }}>
      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ 
          backgroundColor: 'rgba(0,0,0,0.5)', 
          zIndex: 9999 
        }}>
          <div className="card shadow-lg" style={{ 
            maxWidth: '400px', 
            borderRadius: '20px',
            border: 'none'
          }}>
            <div className="card-body text-center p-4">
              <div className="fs-1 text-success mb-3">🎉</div>
              <h3 className="text-success fw-bold mb-3">Order Placed Successfully!</h3>
              <p className="text-muted mb-4">
                Your order #{order?.id} has been confirmed and is being prepared. 
                You can track its progress here.
              </p>
              <button 
                className="btn btn-success w-100"
                onClick={() => setShowSuccessPopup(false)}
                style={{ borderRadius: '25px', padding: '10px 20px' }}
              >
                Start Tracking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-dark" style={{ 
        backgroundColor: '#2E8B57',
        marginBottom: '30px'
      }}>
        <div className="container">
          <span className="navbar-brand fw-bold fs-3">
            <img 
              src="https://cdn-icons-png.flaticon.com/512/3082/3082383.png" 
              alt="Urbanzest Logo" 
              width="40" 
              height="40" 
              className="me-2"
            />
            Track Your Order
          </span>
          <div className="navbar-nav ms-auto">
            <button 
              className="btn btn-outline-light btn-sm"
              onClick={() => navigate('/menu')}
            >
              Back to Menu
            </button>
          </div>
        </div>
      </nav>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            {/* Demo Notice */}
            {error && (
              <div className="alert alert-info mb-4">
                <strong>Demo Mode:</strong> Using mock order data. {error}
              </div>
            )}

            {/* Order Info */}
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-white">
                <h4 className="mb-0 fw-bold">Order #{order?.id}</h4>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <p><strong>Order Total:</strong> ₹{order?.total?.toFixed(2)}</p>
                    <p><strong>Payment Method:</strong> {order?.paymentMethod}</p>
                    <p><strong>Order Time:</strong> {new Date(order?.date).toLocaleTimeString()}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Estimated Delivery:</strong> {estimatedTime} minutes</p>
                    <p><strong>Items:</strong> {order?.items?.length}</p>
                    <p><strong>Delivery Address:</strong> {order?.deliveryAddress}</p>
                  </div>
                </div>
                
                {/* Order Items */}
                <div className="mt-4">
                  <h6 className="fw-bold">Order Items:</h6>
                  {order?.items?.map((item, index) => (
                    <div key={index} className="d-flex align-items-center mb-2">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        style={{ 
                          width: '40px', 
                          height: '40px', 
                          objectFit: 'cover', 
                          borderRadius: '6px',
                          marginRight: '10px'
                        }}
                      />
                      <span>{item.name} x {item.quantity} - ₹ {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Delivery Progress */}
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-white">
                <h4 className="mb-0 fw-bold">Delivery Status</h4>
              </div>
              <div className="card-body">
                {/* Progress Bar */}
                <div className="progress mb-4" style={{ height: '20px', borderRadius: '10px' }}>
                  <div
                    className="progress-bar bg-success"
                    role="progressbar"
                    style={{ width: `${progress}%`, borderRadius: '10px' }}
                    aria-valuenow={progress}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    {progress}%
                  </div>
                </div>

                {/* Status Steps */}
                <div className="row text-center">
                  {['preparing', 'on_the_way', 'arriving', 'delivered'].map((status, index) => (
                    <div key={status} className="col-3">
                      <div
                        className={`status-step ${
                          getStatusIndex(deliveryStatus) >= index ? 'active' : ''
                        }`}
                        style={{
                          padding: '10px',
                          borderRadius: '10px',
                          backgroundColor: getStatusIndex(deliveryStatus) >= index ? '#2E8B57' : '#e9ecef',
                          color: getStatusIndex(deliveryStatus) >= index ? 'white' : '#6c757d',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <div className="fs-3">{getStatusIcon(status)}</div>
                        <small className="fw-bold">{getStatusText(status)}</small>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Current Status */}
                <div className="text-center mt-4">
                  <h3 className="text-success fw-bold">
                    {getStatusIcon(deliveryStatus)} {getStatusText(deliveryStatus)}
                  </h3>
                  <p className="text-muted fs-5">
                    {deliveryStatus === 'preparing' && 'Our chefs are preparing your delicious meal!'}
                    {deliveryStatus === 'on_the_way' && 'Your order is on the way to your location!'}
                    {deliveryStatus === 'arriving' && 'Your delivery is almost there! Get ready!'}
                    {deliveryStatus === 'delivered' && 'Your order has been delivered. Enjoy your meal!'}
                  </p>
                </div>
              </div>
            </div>

            {/* Map Simulation */}
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-white">
                <h4 className="mb-0 fw-bold">Delivery Route</h4>
              </div>
              <div className="card-body">
                <div
                  style={{
                    height: '200px',
                    backgroundColor: '#e9ecef',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                  }}
                >
                  <div className="text-center">
                    <div className="fs-1 mb-3">🗺️</div>
                    <p className="text-muted fw-bold">
                      {deliveryStatus === 'preparing' && '📍 Preparing at Urbanzest Restaurant...'}
                      {deliveryStatus === 'on_the_way' && '🚚 Driver is on the way to your location'}
                      {deliveryStatus === 'arriving' && '📦 Almost at your destination!'}
                      {deliveryStatus === 'delivered' && '✅ Order delivered successfully!'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Arrival Notification */}
            {showArrivalNotification && (
              <div className="alert alert-warning alert-dismissible fade show mb-4" role="alert">
                <strong>🚚 Delivery Alert!</strong> Your order is arriving in approximately 2 minutes! Get ready to receive your food.
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowArrivalNotification(false)}
                ></button>
              </div>
            )}

            {/* Action Buttons */}
            <div className="text-center">
              <button
                className="btn btn-success me-3"
                onClick={() => navigate('/menu')}
                style={{ borderRadius: '25px', padding: '10px 30px' }}
              >
                🍕 Order Again
              </button>
              <button
                className="btn btn-outline-success"
                onClick={() => navigate('/orders')}
                style={{ borderRadius: '25px', padding: '10px 30px' }}
              >
                📋 View All Orders
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrackOrder;