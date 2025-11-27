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

  const backgroundStyle = {
    backgroundImage: "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
    position: 'relative',
    padding: '20px'
  };

  return (
    <div style={backgroundStyle}>
      <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', padding: '30px', borderRadius: '15px', maxWidth: '700px', margin: '0 auto', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
        <h2 className="text-center mb-4" style={{ color: '#2E8B57', fontWeight: 'bold' }}>Your Cart</h2>
        {cart.items.length === 0 ? (
          <div className="text-center py-5">
            <i className="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
            <p className="fs-5 text-muted">Your cart is empty</p>
            <button 
              className="btn btn-success mt-3"
              onClick={() => navigate('/menu')}
              style={{ 
                borderRadius: '25px',
                padding: '10px 30px',
                fontWeight: '600'
              }}
            >
              <i className="fas fa-utensils me-2"></i>
              Browse Menu
            </button>
          </div>
        ) : (
          <div>
            {cart.items.map(item => {
              const menuItem = getMenuItem(item.menuId);
              const itemPrice = item.price || menuItem?.price || 0;
              const itemTotal = itemPrice * item.quantity;
              const itemName = menuItem?.name || `Item ${item.menuId}`;
              
              console.log(`Rendering item: ${item.menuId}, name: ${itemName}`);
              
              return (
                <div key={item.menuId} className="d-flex justify-content-between align-items-center mb-4 p-3" style={{ backgroundColor: '#f8f9fa', borderRadius: '10px', border: '1px solid #e9ecef' }}>
                  <div className="d-flex align-items-center">
                    <img 
                      src={menuItem?.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80'} 
                      alt={itemName}
                      style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', marginRight: '15px' }}
                    />
                    <div>
                      <h6 className="mb-1 fw-bold" style={{ color: '#2c5530' }}>
                        {itemName}
                      </h6>
                      <p className="mb-0 text-muted">₹{itemPrice.toFixed(2)}</p>
                    </div>
                  </div>
                  
                  <div className="d-flex align-items-center gap-3">
                    <div className="d-flex align-items-center">
                      <button 
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => updateQuantity(item.menuId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        style={{ width: '35px', height: '35px', borderRadius: '50%' }}
                      >
                        -
                      </button>
                      <span className="mx-3 fw-bold" style={{ minWidth: '30px', textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button 
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => updateQuantity(item.menuId, item.quantity + 1)}
                        style={{ width: '35px', height: '35px', borderRadius: '50%' }}
                      >
                        +
                      </button>
                    </div>
                    
                    <div className="text-end me-3">
                      <strong style={{ color: '#2E8B57' }}>
                        ₹{itemTotal.toFixed(2)}
                      </strong>
                    </div>
                    
                    <button 
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => deleteItem(item.menuId)}
                      style={{ 
                        width: '40px', 
                        height: '40px', 
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      title="Remove item"
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
              );
            })}
            
            <div className="border-top pt-4 mt-3">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="mb-0" style={{ color: '#2c5530' }}>Total Amount:</h4>
                <h3 className="mb-0 fw-bold" style={{ color: '#2E8B57' }}>₹{total.toFixed(2)}</h3>
              </div>
              
              <div className="d-flex gap-3">
                <button 
                  className="btn btn-lg flex-fill"
                  onClick={checkout}
                  style={{ 
                    backgroundColor: '#2E8B57', 
                    borderColor: '#2E8B57',
                    color: 'white',
                    borderRadius: '25px',
                    fontWeight: '600',
                    padding: '12px 30px',
                    transition: 'all 0.3s ease'
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
                    padding: '12px 30px'
                  }}
                >
                  <i className="fas fa-trash me-2"></i>
                  Clear All
                </button>
              </div>
              
              <div className="text-center mt-3">
                <button 
                  className="btn btn-outline-success"
                  onClick={() => navigate('/menu')}
                  style={{ 
                    borderRadius: '20px',
                    padding: '8px 20px'
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
  );
}

export default Cart;