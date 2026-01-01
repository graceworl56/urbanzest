// components/PaymentPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE = 'http://localhost:3001';

function PaymentPage() {
  const [selectedPayment, setSelectedPayment] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  // Get cart data from localStorage
  const cart = JSON.parse(localStorage.getItem('cart')) || { items: [] };
  const userData = JSON.parse(localStorage.getItem('userData')) || {};

  const calculateTotal = () => {
    return cart.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  const pageStyle = {
    width: '100vw',
    minHeight: '100vh',
    margin: 0,
    padding: '20px',
    backgroundColor: '#f8f9fa'
  };

  const handlePlaceOrder = async () => {
    if (!selectedPayment) {
      alert('Please select a payment method');
      return;
    }

    setIsProcessing(true);

    try {
      // Create order object
      const order = {
        id: Date.now(),
        userId: userData.id || 1,
        items: cart.items,
        total: calculateTotal(),
        paymentMethod: selectedPayment,
        status: 'preparing',
        orderNotes: orderNotes,
        createdAt: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 30 * 60000).toISOString(), // 30 minutes from now
        deliveryStatus: 'preparing',
        deliveryAddress: userData.address || '123 Main Street, City'
      };

      // Save order to database
      await axios.post(`${API_BASE}/orders`, order);

      // Clear cart from server
      await axios.put(`${API_BASE}/carts/1`, { items: [] });
      
      // Clear cart from localStorage
      localStorage.setItem('cart', JSON.stringify({ items: [] }));

      // Immediately navigate to tracking page with success state
      navigate('/track-order', { 
        state: { 
          orderId: order.id,
          showSuccess: true 
        } 
      });
      
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
      setIsProcessing(false);
    }
  };

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: '💳',
      description: 'Pay securely with your card'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: '🔵',
      description: 'Pay with your PayPal account'
    },
    {
      id: 'googlepay',
      name: 'Google Pay',
      icon: '⚡',
      description: 'Fast payment with Google Pay'
    },
    {
      id: 'cash',
      name: 'Cash on Delivery',
      icon: '💰',
      description: 'Pay when you receive your order'
    }
  ];

  // If cart is empty, redirect to menu
  if (cart.items.length === 0) {
    navigate('/menu');
    return null;
  }

  return (
    <div style={pageStyle}>
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
            Urbanzest - Checkout
          </span>
        </div>
      </nav>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            {/* Order Summary */}
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-white">
                <h4 className="mb-0 fw-bold">Order Summary</h4>
              </div>
              <div className="card-body">
                {cart.items.map((item, index) => (
                  <div key={index} className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
                    <div className="d-flex align-items-center">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        style={{ 
                          width: '50px', 
                          height: '50px', 
                          objectFit: 'cover', 
                          borderRadius: '8px',
                          marginRight: '15px'
                        }}
                      />
                      <div>
                        <h6 className="mb-1">{item.name}</h6>
                        <small className="text-muted">Quantity: {item.quantity}</small>
                      </div>
                    </div>
                    <span className="fw-bold">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <h5 className="mb-0">Total:</h5>
                  <h4 className="mb-0 text-success">₹{calculateTotal().toFixed(2)}</h4>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-white">
                <h4 className="mb-0 fw-bold">Select Payment Method</h4>
              </div>
              <div className="card-body">
                <div className="row">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="col-md-6 mb-3">
                      <div
                        className={`card payment-method-card ${
                          selectedPayment === method.id ? 'border-success' : ''
                        }`}
                        style={{
                          cursor: 'pointer',
                          border: selectedPayment === method.id ? '2px solid #2E8B57' : '1px solid #dee2e6',
                          transition: 'all 0.3s ease'
                        }}
                        onClick={() => setSelectedPayment(method.id)}
                      >
                        <div className="card-body text-center">
                          <div className="fs-1 mb-2">{method.icon}</div>
                          <h6 className="card-title mb-1">{method.name}</h6>
                          <small className="text-muted">{method.description}</small>
                          {selectedPayment === method.id && (
                            <div className="mt-2">
                              <span className="badge bg-success">Selected</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Notes */}
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-white">
                <h4 className="mb-0 fw-bold">Additional Notes</h4>
              </div>
              <div className="card-body">
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Any special instructions for your order?"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                ></textarea>
              </div>
            </div>

            {/* Place Order Button */}
            <div className="text-center">
              <button
                className="btn btn-lg w-100"
                style={{
                  backgroundColor: '#2E8B57',
                  border: 'none',
                  color: 'white',
                  borderRadius: '25px',
                  padding: '15px 30px',
                  fontSize: '1.2rem',
                  fontWeight: '600'
                }}
                onClick={handlePlaceOrder}
                disabled={isProcessing || !selectedPayment}
              >
                {isProcessing ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Processing Order...
                  </>
                ) : (
                  `Place Order - ₹${calculateTotal().toFixed(2)}`
                )}
              </button>
              <p className="text-muted mt-2">
                By placing your order, you agree to our terms and conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;