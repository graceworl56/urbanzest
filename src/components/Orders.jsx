import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:3001';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [menu, setMenu] = useState([]);
  const [showAllOrders, setShowAllOrders] = useState(false);
  const [ratings, setRatings] = useState({});

  useEffect(() => {
    axios.get(`${API_BASE}/orders`).then(res => {
      console.log('🔍 RAW ORDERS DATA:', res.data);
      
      // FIXED: Proper date handling with actual timestamps
      const fixedOrders = res.data.map(order => {
        let orderDate;
        
        // Try to parse the date from the order
        if (order.date && order.date !== 'Invalid Date') {
          orderDate = new Date(order.date);
          if (isNaN(orderDate.getTime())) {
            // If date is invalid, use createdAt or current time
            orderDate = new Date(order.createdAt || Date.now());
          }
        } else if (order.createdAt) {
          // Use createdAt if available
          orderDate = new Date(order.createdAt);
        } else {
          // Fallback: use current time for new orders
          orderDate = new Date();
        }
        
        return {
          ...order,
          orderDate: orderDate,
          timestamp: orderDate.getTime()
        };
      });
      
      console.log('🔧 FIXED ORDERS:', fixedOrders);
      setOrders(fixedOrders);
    });
    
    axios.get(`${API_BASE}/menu`).then(res => setMenu(res.data));
    
    const savedRatings = localStorage.getItem('orderRatings');
    if (savedRatings) {
      setRatings(JSON.parse(savedRatings));
    }
  }, []);

  const handleRating = (orderId, rating) => {
    const newRatings = { ...ratings, [orderId]: rating };
    setRatings(newRatings);
    localStorage.setItem('orderRatings', JSON.stringify(newRatings));
  };

  const containerStyle = {
    backgroundImage: "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
    position: 'relative',
    padding: '20px'
  };

  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 1
  };

  const contentStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: '30px',
    borderRadius: '15px',
    maxWidth: '900px',
    margin: '0 auto',
    position: 'relative',
    zIndex: 2,
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
  };

  // FIXED: Sort by actual timestamp (newest first)
  const sortedOrders = [...orders].sort((a, b) => b.timestamp - a.timestamp);
  
  console.log('📊 FINAL SORTED ORDERS (by timestamp):', sortedOrders.map(o => ({
    id: o.id,
    date: o.orderDate,
    timestamp: o.timestamp
  })));

  const recentOrders = sortedOrders.slice(0, 5);
  const olderOrders = sortedOrders.slice(5);

  console.log('🆕 RECENT ORDERS (first 5):', recentOrders.map(o => ({id: o.id, date: o.orderDate})));
  console.log('📜 OLDER ORDERS (rest):', olderOrders.map(o => o.id));

  // FIXED: Proper date formatting based on actual time difference
  const formatOrderDate = (order) => {
    try {
      const orderDate = order.orderDate;
      const now = new Date();
      const diffTime = Math.abs(now - orderDate);
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffMinutes < 1) {
        return 'Just now';
      } else if (diffMinutes < 60) {
        return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
      } else if (diffHours < 24) {
        return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      } else if (diffDays === 1) {
        return 'Yesterday';
      } else if (diffDays < 7) {
        return `${diffDays} days ago`;
      } else {
        return orderDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Recent order';
    }
  };

  // FORCEFUL CURRENCY FORMATTING FUNCTION
  const formatPrice = (price) => {
    if (price === null || price === undefined) return '₹0.00';
    
    // Convert to number if it's a string
    let numericPrice = price;
    if (typeof price === 'string') {
      // Remove any currency symbols and convert to number
      numericPrice = parseFloat(price.replace(/[$,₹]/g, '')) || 0;
    }
    
    // Format with rupee symbol
    return `₹${numericPrice.toFixed(2)}`;
  };

  const StarRating = ({ orderId, currentRating }) => {
    return (
      <div className="star-rating mt-3">
        <p className="mb-2 fw-semibold">Rate your order:</p>
        <div className="d-flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="btn btn-link p-0 border-0"
              onClick={() => handleRating(orderId, star)}
              style={{ fontSize: '1.5rem' }}
            >
              {star <= (currentRating || 0) ? '⭐' : '☆'}
            </button>
          ))}
        </div>
        {currentRating && (
          <small className="text-muted mt-1 d-block">
            You rated {currentRating} star{currentRating > 1 ? 's' : ''}
          </small>
        )}
      </div>
    );
  };

  const OrderCard = ({ order, isRecent = true }) => {
    const menuItem = menu.find(m => m.id === order.items[0]?.menuId);
    const orderRating = ratings[order.id];

    return (
      <div className="card mb-4 shadow-sm border-0" style={{ 
        borderRadius: '12px', 
        overflow: 'hidden',
        borderLeft: isRecent ? '4px solid #2E8B57' : '4px solid #6c757d',
        background: isRecent ? 'linear-gradient(135deg, #ffffff 0%, #f0f8f0 100%)' : '#ffffff'
      }}>
        <div className="card-body p-4">
          <div className="row align-items-start">
            {/* Food Icon and Basic Info */}
            <div className="col-md-2 text-center">
              <div 
                className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2"
                style={{ 
                  width: '60px', 
                  height: '60px', 
                  background: 'linear-gradient(135deg, #2E8B57, #3CB371)',
                  overflow: 'hidden'
                }}
              >
                {menuItem?.image ? (
                  <img 
                    src={menuItem.image} 
                    alt={menuItem.name}
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover' 
                    }}
                  />
                ) : (
                  <span className="text-white fs-4">🍽️</span>
                )}
              </div>
              <small className="text-muted">Order #{order.id}</small>
              {isRecent && (
                <span className="badge bg-success mt-1" style={{ fontSize: '0.7rem' }}>
                  <i className="fas fa-bolt me-1"></i>NEW
                </span>
              )}
            </div>

            {/* Order Details */}
            <div className="col-md-6">
              <h6 className="card-title fw-bold text-dark mb-2">
                {menuItem?.name || 'Mixed Items'}
                {order.items.length > 1 && ` + ${order.items.length - 1} more`}
              </h6>
              <p className="text-muted mb-1 small">
                <i className="fas fa-clock me-1"></i>
                {formatOrderDate(order)}
                <br />
                <small className="text-muted">
                  Order ID: {order.id} | Items: {order.items.length}
                </small>
              </p>
              <div className="mt-2">
                <span className="badge bg-success">
                  <i className="fas fa-check-circle me-1"></i>
                  Delivered
                </span>
                {isRecent && (
                  <span className="badge bg-warning ms-2">
                    <i className="fas fa-star me-1"></i>
                    Recent
                  </span>
                )}
              </div>
            </div>

            {/* Total and Rating */}
            <div className="col-md-4 text-end">
              <h5 className="text-success fw-bold mb-2">
                {formatPrice(order.total)}
              </h5>
              <StarRating orderId={order.id} currentRating={orderRating} />
            </div>
          </div>

          {/* Order Items Details */}
          <div className="mt-3 pt-3 border-top">
            <h6 className="fw-semibold mb-2">
              <i className="fas fa-list me-2"></i>
              Order Items ({order.items.length}):
            </h6>
            <div className="row">
              {order.items.map((item, index) => {
                const itemMenu = menu.find(m => m.id === item.menuId);
                const itemPrice = item.price || itemMenu?.price || 0;
                const itemTotal = itemPrice * item.quantity;
                
                return (
                  <div key={index} className="col-12 col-md-6 mb-2">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <span className="badge bg-primary me-2">{item.quantity}x</span>
                        <span className="small">{itemMenu?.name || `Item ${item.menuId}`}</span>
                      </div>
                      <span className="small text-success fw-bold">{formatPrice(itemTotal)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={containerStyle}>
      <div style={overlayStyle}></div>
      <div style={contentStyle}>
        <div className="text-center mb-5">
          <h2 className="fw-bold text-dark mb-2">
            <i className="fas fa-receipt me-2"></i>
            Your Orders
          </h2>
          <p className="text-muted">Track and rate your recent purchases</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-5">
            <div className="display-1 text-muted mb-3">🍽️</div>
            <h4 className="text-dark mb-3">No orders yet</h4>
            <p className="text-muted">Start ordering from our delicious menu!</p>
          </div>
        ) : (
          <>
            {/* Debug Info - Remove this after testing */}
            <div className="alert alert-info mb-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>Debug Info:</strong> Total: {orders.length} orders | 
                  Recent: {recentOrders.length} | Older: {olderOrders.length}
                </div>
                <button 
                  type="button" 
                  className="btn-close" 
                  data-bs-dismiss="alert"
                ></button>
              </div>
              <small className="d-block mt-1">
                Recent orders (by actual time): {recentOrders.map(o => `#${o.id} (${formatOrderDate(o)})`).join(', ')}
              </small>
            </div>

            {/* Recent Orders Section - GUARANTEED to show correct orders */}
            {recentOrders.length > 0 && (
              <div className="mb-5">
                <div className="d-flex align-items-center mb-3 p-3 bg-light rounded">
                  <div className="me-3">
                    <i className="fas fa-bolt fa-2x text-success"></i>
                  </div>
                  <div>
                    <h4 className="fw-bold text-dark mb-1">
                      Recent Orders
                    </h4>
                    <p className="text-muted mb-0">
                      Your {recentOrders.length} most recent orders
                    </p>
                  </div>
                  <span className="badge bg-success ms-auto fs-6">
                    {recentOrders.length} New
                  </span>
                </div>
                
                {recentOrders.map((order) => (
                  <OrderCard key={order.id} order={order} isRecent={true} />
                ))}
              </div>
            )}

            {/* Older Orders Section */}
            {olderOrders.length > 0 && (
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3 p-3 bg-light rounded">
                  <div className="d-flex align-items-center">
                    <i className="fas fa-history fa-2x text-secondary me-3"></i>
                    <div>
                      <h4 className="fw-bold text-dark mb-0">
                        Order History
                      </h4>
                    </div>
                  </div>
                  <button
                    className="btn btn-outline-success"
                    onClick={() => setShowAllOrders(!showAllOrders)}
                  >
                    <i className={`fas ${showAllOrders ? 'fa-chevron-up' : 'fa-chevron-down'} me-2`}></i>
                    {showAllOrders ? 'Hide History' : `Show History (${olderOrders.length})`}
                  </button>
                </div>

                {showAllOrders && (
                  <div className="mt-3">
                    {olderOrders.map(order => (
                      <OrderCard key={order.id} order={order} isRecent={false} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Order Statistics */}
            <div className="row text-center mt-5 pt-4 border-top">
              <div className="col-md-3">
                <div className="p-3">
                  <h4 className="fw-bold text-success">{orders.length}</h4>
                  <p className="text-muted small mb-0">Total Orders</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="p-3">
                  <h4 className="fw-bold text-primary">{recentOrders.length}</h4>
                  <p className="text-muted small mb-0">Recent Orders</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="p-3">
                  <h4 className="fw-bold text-warning">{Object.keys(ratings).length}</h4>
                  <p className="text-muted small mb-0">Rated Orders</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="p-3">
                  <h4 className="fw-bold text-info">
                    {Object.values(ratings).length > 0 
                      ? (Object.values(ratings).reduce((sum, rating) => sum + rating, 0) / Object.values(ratings).length).toFixed(1)
                      : '0.0'
                    }
                  </h4>
                  <p className="text-muted small mb-0">Avg Rating</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Orders;