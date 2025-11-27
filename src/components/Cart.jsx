import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:3001';

function Cart() {
  const [cart, setCart] = useState({ items: [] });
  const [menu, setMenu] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch cart and menu
    const fetchData = async () => {
      try {
        const cartResponse = await axios.get(`${API_BASE}/carts/1`);
        const menuResponse = await axios.get(`${API_BASE}/menu`);
        
        console.log('Cart data:', cartResponse.data);
        console.log('Menu data:', menuResponse.data);
        console.log('Cart items:', cartResponse.data.items);
        
        setCart(cartResponse.data);
        setMenu(menuResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }, []);

  // Function to get menu item details with proper ID matching
  const getMenuItem = (menuId) => {
    // Try different ID matching strategies
    const menuItem = menu.find(m => 
      m.id === menuId || 
      m.id == menuId || // loose equality for string/number mismatch
      String(m.id) === String(menuId)
    );
    
    console.log(`Looking for menuId: ${menuId}, type: ${typeof menuId}`);
    console.log('Found menu item:', menuItem);
    
    return menuItem || null;
  };

  const updateQuantity = (menuId, newQuantity) => {
    if (newQuantity <= 0) return;
    const updatedItems = cart.items.map(item =>
      item.menuId === menuId ? { ...item, quantity: newQuantity } : item
    );
    const updatedCart = { ...cart, items: updatedItems };
    axios.put(`${API_BASE}/carts/1`, updatedCart).then(() => setCart(updatedCart));
  };

  const deleteItem = (menuId) => {
    const updatedItems = cart.items.filter(item => item.menuId !== menuId);
    const updatedCart = { ...cart, items: updatedItems };
    axios.put(`${API_BASE}/carts/1`, updatedCart).then(() => setCart(updatedCart));
  };

  const checkout = () => {
    const cartWithDetails = {
      items: cart.items.map(item => {
        const menuItem = getMenuItem(item.menuId);
        return {
          ...item,
          name: menuItem?.name || `Item ${item.menuId}`,
          price: menuItem?.price || item.price,
          image: menuItem?.image
        };
      }),
      total: cart.items.reduce((sum, item) => {
        const menuItem = getMenuItem(item.menuId);
        const itemPrice = item.price || menuItem?.price || 0;
        return sum + (itemPrice * item.quantity);
      }, 0)
    };

    localStorage.setItem('cart', JSON.stringify(cartWithDetails));
    navigate('/payment');
  };

  // Calculate total
  const total = cart.items.reduce((sum, item) => {
    const menuItem = getMenuItem(item.menuId);
    const itemPrice = item.price || menuItem?.price || 0;
    return sum + (itemPrice * item.quantity);
  }, 0);

  // Full width styles
  const pageStyle = {
    width: '100vw',
    minHeight: '100vh',
    margin: 0,
    padding: 0,
    backgroundImage: "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start'
  };

  const containerStyle = {
    width: '100%',
    minHeight: '100vh',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: '40px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  };

  const contentStyle = {
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto'
  };

  const cardStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: '40px',
    borderRadius: '15px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    width: '100%'
  };

  const itemContainerStyle = {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '10px',
    border: '1px solid #e9ecef',
    marginBottom: '20px',
    width: '100%'
  };

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <div style={contentStyle}>
          <div style={cardStyle}>
            <h2 className="text-center mb-4" style={{ color: '#2E8B57', fontWeight: 'bold', fontSize: '2.5rem' }}>Your Cart</h2>
            {cart.items.length === 0 ? (
              <div className="text-center py-5">
                <i className="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
                <p className="fs-5 text-muted">Your cart is empty</p>
                <button 
                  className="btn btn-success mt-3"
                  onClick={() => navigate('/menu')}
                  style={{ 
                    borderRadius: '25px',
                    padding: '12px 40px',
                    fontWeight: '600',
                    fontSize: '1.1rem'
                  }}
                >
                  <i className="fas fa-utensils me-2"></i>
                  Browse Menu
                </button>
              </div>
            ) : (
              <div style={{ width: '100%' }}>
                {cart.items.map(item => {
                  const menuItem = getMenuItem(item.menuId);
                  const itemPrice = item.price || menuItem?.price || 0;
                  const itemTotal = itemPrice * item.quantity;
                  const itemName = menuItem?.name || `Item ${item.menuId}`;
                  
                  console.log(`Rendering item: ${item.menuId}, name: ${itemName}`);
                  
                  return (
                    <div key={item.menuId} style={itemContainerStyle}>
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center" style={{ flex: 1 }}>
                          <img 
                            src={menuItem?.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80'} 
                            alt={itemName}
                            style={{ 
                              width: '80px', 
                              height: '80px', 
                              objectFit: 'cover', 
                              borderRadius: '10px', 
                              marginRight: '20px' 
                            }}
                          />
                          <div style={{ flex: 1 }}>
                            <h6 className="mb-2 fw-bold" style={{ color: '#2c5530', fontSize: '1.2rem' }}>
                              {itemName}
                            </h6>
                            <p className="mb-0 text-muted" style={{ fontSize: '1.1rem' }}>₹{itemPrice.toFixed(2)}</p>
                          </div>
                        </div>
                        
                        <div className="d-flex align-items-center gap-4">
                          <div className="d-flex align-items-center">
                            <button 
                              className="btn btn-outline-secondary btn-sm"
                              onClick={() => updateQuantity(item.menuId, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              style={{ 
                                width: '40px', 
                                height: '40px', 
                                borderRadius: '50%',
                                fontSize: '1.1rem'
                              }}
                            >
                              -
                            </button>
                            <span className="mx-3 fw-bold" style={{ 
                              minWidth: '40px', 
                              textAlign: 'center',
                              fontSize: '1.2rem'
                            }}>
                              {item.quantity}
                            </span>
                            <button 
                              className="btn btn-outline-secondary btn-sm"
                              onClick={() => updateQuantity(item.menuId, item.quantity + 1)}
                              style={{ 
                                width: '40px', 
                                height: '40px', 
                                borderRadius: '50%',
                                fontSize: '1.1rem'
                              }}
                            >
                              +
                            </button>
                          </div>
                          
                          <div className="text-end">
                            <strong style={{ color: '#2E8B57', fontSize: '1.3rem' }}>
                              ₹{itemTotal.toFixed(2)}
                            </strong>
                          </div>
                          
                          <button 
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => deleteItem(item.menuId)}
                            style={{ 
                              width: '45px', 
                              height: '45px', 
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '1.1rem'
                            }}
                            title="Remove item"
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                <div style={{ 
                  borderTop: '2px solid #dee2e6', 
                  paddingTop: '30px', 
                  marginTop: '30px',
                  width: '100%'
                }}>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="mb-0" style={{ color: '#2c5530', fontSize: '1.5rem' }}>Total Amount:</h4>
                    <h3 className="mb-0 fw-bold" style={{ color: '#2E8B57', fontSize: '2rem' }}>₹{total.toFixed(2)}</h3>
                  </div>
                  
                  <div className="d-flex gap-3" style={{ width: '100%' }}>
                    <button 
                      className="btn btn-lg flex-fill"
                      onClick={checkout}
                      style={{ 
                        backgroundColor: '#2E8B57', 
                        borderColor: '#2E8B57',
                        color: 'white',
                        borderRadius: '25px',
                        fontWeight: '600',
                        padding: '15px 30px',
                        fontSize: '1.1rem',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 5px 15px rgba(46, 139, 87, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      <i className="fas fa-credit-card me-2"></i>
                      Proceed to Payment
                    </button>
                    
                    <button 
                      className="btn btn-outline-secondary btn-lg"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to clear your cart?')) {
                          axios.put(`${API_BASE}/carts/1`, { ...cart, items: [] }).then(() => setCart({ ...cart, items: [] }));
                        }
                      }}
                      style={{ 
                        borderRadius: '25px',
                        fontWeight: '600',
                        padding: '15px 30px',
                        fontSize: '1.1rem'
                      }}
                    >
                      <i className="fas fa-trash me-2"></i>
                      Clear All
                    </button>
                  </div>
                  
                  <div className="text-center mt-4">
                    <button 
                      className="btn btn-outline-success"
                      onClick={() => navigate('/menu')}
                      style={{ 
                        borderRadius: '20px',
                        padding: '10px 25px',
                        fontSize: '1rem'
                      }}
                    >
                      <i className="fas fa-plus me-2"></i>
                      Add More Items
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;