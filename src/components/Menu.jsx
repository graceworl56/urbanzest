// components/Menu.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE = 'http://localhost:3001';

function Menu() {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState({ items: [] });
  const [activeIndex, setActiveIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    setMenu(menuItems);
    axios.get(`${API_BASE}/carts/1`).then(res => setCart(res.data));
  }, [navigate]);

  const handleImageError = (e) => {
    e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80';
    e.target.alt = 'Image not available';
  };

  const showCartPopup = (message) => {
    setPopupMessage(message);
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
    }, 3000);
  };

  // UPDATED: addToCart function now includes price
  const addToCart = (menuId, quantity, itemName, itemPrice) => {
    const existingItem = cart.items.find(item => item.menuId === menuId);
    let updatedItems;
    if (existingItem) {
      updatedItems = cart.items.map(item =>
        item.menuId === menuId ? { ...item, quantity: item.quantity + quantity } : item
      );
    } else {
      updatedItems = [...cart.items, { 
        menuId, 
        quantity, 
        name: itemName, 
        price: itemPrice  // ✅ PRICE IS NOW STORED
      }];
    }
    const updatedCart = { ...cart, items: updatedItems };
    axios.put(`${API_BASE}/carts/1`, updatedCart).then(() => {
      setCart(updatedCart);
      if (existingItem) {
        showCartPopup(`🛒 ${itemName} quantity updated in cart!`);
      } else {
        showCartPopup(`✅ ${itemName} added to cart!`);
      }
    });
  };

  // Extended menu items with 32 items total
  const menuItems = [
    {
      id: 1,
      name: "Margherita Pizza",
      description: "Wood-fired pizza with San Marzano tomatoes, fresh mozzarella, and basil leaves",
      price: 12.99,
      image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80"
    },
    {
      id: 2,
      name: "Gourmet Burger",
      description: "Prime beef patty with aged cheddar, crispy bacon, and truffle aioli on brioche bun",
      price: 14.99,
      image: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80"
    },
    {
      id: 3,
      name: "Creamy Truffle Pasta",
      description: "Handmade fettuccine with black truffle, wild mushrooms, and parmesan cream sauce",
      price: 18.99,
      image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80"
    },
    {
      id: 4,
      name: "Caesar Salad",
      description: "Organic romaine hearts with homemade dressing, parmesan crisps, and anchovies",
      price: 11.99,
      image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80"
    },
    {
      id: 5,
      name: "Chocolate Lava Cake",
      description: "Warm chocolate cake with molten center, served with vanilla bean ice cream",
      price: 9.99,
      image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80"
    },
    {
      id: 6,
      name: "Fresh Juice Blend",
      description: "Cold-pressed orange, carrot, and ginger juice with mint and lime",
      price: 6.99,
      image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80"
    },
    {
      id: 7,
      name: "Grilled Salmon",
      description: "Atlantic salmon with lemon herb butter and roasted vegetables",
      price: 19.99,
      image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80"
    },
    {
      id: 8,
      name: "Sushi Platter",
      description: "Assorted fresh sushi with tuna, salmon, and California rolls",
      price: 22.99,
      image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80"
    },
    {
      id: 9,
      name: "BBQ Ribs",
      description: "Slow-cooked pork ribs with homemade BBQ sauce and coleslaw",
      price: 21.99,
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80"
    },
    {
      id: 10,
      name: "Mushroom Risotto",
      description: "Creamy arborio rice with wild mushrooms and parmesan",
      price: 15.99,
      image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80"
    },
    {
      id: 11,
      name: "Tiramisu",
      description: "Classic Italian dessert with coffee-soaked ladyfingers and mascarpone",
      price: 7.99,
      image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80"
    },
    {
      id: 12,
      name: "Craft Cocktails",
      description: "Handcrafted signature cocktails with premium spirits",
      price: 10.99,
      image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80"
    },
    {
      id: 13,
      name: "Garlic Bread",
      description: "Freshly baked bread with garlic butter and herbs",
      price: 5.99,
      image: "https://images.unsplash.com/photo-1573140200114-8636d76cd110?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80"
    },
    {
      id: 14,
      name: "Chicken Wings",
      description: "Crispy chicken wings with buffalo sauce and ranch dip",
      price: 12.99,
      image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80"
    },
    {
      id: 15,
      name: "Vegetable Stir Fry",
      description: "Fresh seasonal vegetables stir-fried in soy-ginger sauce",
      price: 13.99,
      image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80"
    },
    {
      id: 16,
      name: "Beef Steak",
      description: "Grilled ribeye steak with mashed potatoes and red wine sauce",
      price: 24.99,
      image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80"
    },
    {
      id: 17,
      name: "Fish Tacos",
      description: "Crispy fish fillets in soft tortillas with slaw and chipotle mayo",
      price: 14.99,
      image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80"
    },
    {
      id: 18,
      name: "Mango Smoothie",
      description: "Fresh mango blended with yogurt and honey",
      price: 6.49,
      image: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80"
    },
    {
      id: 19,
      name: "Cheesecake",
      description: "New York style cheesecake with berry compote",
      price: 8.99,
      image: "https://images.unsplash.com/photo-1567306301408-9b74779a11af?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80"
    },
    {
      id: 20,
      name: "Chicken Biryani",
      description: "Fragrant basmati rice with spiced chicken and herbs",
      price: 16.99,
      image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80"
    },
    {
      id: 21,
      name: "Vegetable Soup",
      description: "Hearty vegetable soup with fresh herbs and croutons",
      price: 7.99,
      image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80"
    },
    {
      id: 22,
      name: "Paneer Tikka",
      description: "Grilled cottage cheese cubes with Indian spices",
      price: 13.99,
      image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80"
    },
    {
      id: 23,
      name: "Fruit Salad",
      description: "Seasonal fresh fruits with honey-lime dressing",
      price: 8.99,
      image: "https://images.unsplash.com/photo-1564093497595-593b96d80180?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80"
    },
    {
      id: 24,
      name: "Iced Coffee",
      description: "Cold brew coffee with milk and vanilla syrup",
      price: 5.99,
      image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80"
    },
    {
      id: 25,
      name: "Butter Chicken",
      description: "Tender chicken in rich tomato and butter sauce",
      price: 17.99,
      image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80"
    },
    {
      id: 26,
      name: "Greek Salad",
      description: "Fresh vegetables with feta cheese and olive oil dressing",
      price: 10.99,
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80"
    },
    {
      id: 27,
      name: "Chicken Wrap",
      description: "Grilled chicken with fresh veggies in tortilla wrap",
      price: 11.99,
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80"
    },
    {
      id: 28,
      name: "Mozzarella Sticks",
      description: "Breaded mozzarella sticks with marinara sauce",
      price: 8.99,
      image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80"
    },
    {
      id: 29,
      name: "Chocolate Milkshake",
      description: "Creamy chocolate milkshake with whipped cream",
      price: 7.49,
      image: "https://images.unsplash.com/photo-1629453110196-65cc0d035d7d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80"
    },
    {
      id: 30,
      name: "Vegetable Pizza",
      description: "Pizza loaded with fresh seasonal vegetables",
      price: 14.99,
      image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80"
    },
    {
      id: 31,
      name: "French Fries",
      description: "Crispy golden fries with sea salt",
      price: 5.99,
      image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80"
    },
    {
      id: 32,
      name: "Green Tea",
      description: "Premium Japanese green tea",
      price: 4.99,
      image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80"
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      comment: "The best dining experience I've had this year! The truffle pasta was absolutely divine.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80"
    },
    {
      id: 2,
      name: "Michael Chen",
      comment: "Fresh ingredients and exceptional service. The sushi platter was a masterpiece!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      comment: "Perfect for date night! Romantic ambiance and the chocolate lava cake was to die for.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80"
    }
  ];

  const nextSlide = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === menuItems.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === 0 ? menuItems.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index) => {
    setActiveIndex(index);
  };

  const displayItems = menu.length > 0 ? menu : menuItems;
  const totalPages = Math.ceil(displayItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = displayItems.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 600, behavior: 'smooth' });
  };

  const formatPrice = (price) => {
    return `₹${price}`;
  };

  return (
    <div
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        position: 'relative',
      }}
    >
      {/* Dark overlay for better readability */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          zIndex: 1,
        }}
      ></div>

      {/* Cart Popup Notification */}
      {showPopup && (
        <div 
          className="position-fixed top-0 start-50 translate-middle-x mt-4"
          style={{
            zIndex: 9999,
            animation: 'slideDown 0.3s ease-out'
          }}
        >
          <div 
            className="alert alert-success shadow-lg d-flex align-items-center"
            style={{
              backgroundColor: '#2E8B57',
              color: 'white',
              border: 'none',
              borderRadius: '15px',
              padding: '15px 25px',
              minWidth: '300px',
              boxShadow: '0 10px 30px rgba(46, 139, 87, 0.4)'
            }}
            role="alert"
          >
            <i className="fas fa-check-circle me-3 fs-5"></i>
            <div className="fw-semibold">{popupMessage}</div>
            <button 
              type="button" 
              className="btn-close btn-close-white ms-3"
              onClick={() => setShowPopup(false)}
              aria-label="Close"
            ></button>
          </div>
        </div>
      )}

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2, padding: '20px' }}>
        <div className="text-center mb-4 text-white">
          <h1 className="display-4 fw-bold mb-3" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
            Our Premium Menu
          </h1>
          <p className="lead fs-4" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
            Discover culinary excellence with our handcrafted dishes
          </p>
        </div>
        
        {/* Carousel Container */}
        <div className="carousel-container" style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Carousel */}
          <div id="menuCarousel" className="carousel slide" data-bs-ride="carousel">
            {/* Carousel Indicators */}
            <div className="carousel-indicators">
              {displayItems.slice(0, 6).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  data-bs-target="#menuCarousel"
                  data-bs-slide-to={index}
                  className={index === activeIndex ? 'active' : ''}
                  aria-current={index === activeIndex ? 'true' : 'false'}
                  aria-label={`Slide ${index + 1}`}
                  onClick={() => goToSlide(index)}
                  style={{
                    width: '15px',
                    height: '15px',
                    borderRadius: '50%',
                    margin: '0 8px',
                    backgroundColor: index === activeIndex ? '#2E8B57' : '#fff',
                    border: '2px solid #2E8B57'
                  }}
                ></button>
              ))}
            </div>

            {/* Carousel Items */}
            <div className="carousel-inner">
              {displayItems.slice(0, 6).map((item, index) => (
                <div 
                  key={item.id} 
                  className={`carousel-item ${index === activeIndex ? 'active' : ''}`}
                >
                  <div className="row justify-content-center">
                    <div className="col-lg-10">
                      <div className="card shadow-lg" style={{ 
                        border: 'none', 
                        borderRadius: '25px', 
                        overflow: 'hidden',
                        background: 'rgba(255, 255, 255, 0.95)',
                        transition: 'transform 0.3s ease',
                        backdropFilter: 'blur(10px)'
                      }}>
                        <div className="row g-0">
                          {/* Image Section */}
                          <div className="col-md-6">
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="img-fluid h-100"
                              style={{ 
                                objectFit: 'cover',
                                minHeight: '400px',
                                width: '100%'
                              }}
                              loading="eager"
                              onError={handleImageError}
                            />
                          </div>
                          
                          {/* Content Section */}
                          <div className="col-md-6 d-flex align-items-center">
                            <div className="card-body p-4 text-dark">
                              <div className="mb-3">
                                <span className="badge bg-success fs-6 px-3 py-2 mb-2">⭐ Chef's Special</span>
                                <h3 className="card-title mb-3 fw-bold" style={{ color: '#2c5530', fontSize: '1.8rem' }}>
                                  {item.name}
                                </h3>
                              </div>
                              <p className="card-text mb-4" style={{ lineHeight: '1.6', color: '#495057' }}>
                                {item.description}
                              </p>
                              <div className="d-flex justify-content-between align-items-center mb-4">
                                <span className="h2 mb-0 fw-bold" style={{ color: '#2E8B57' }}>
                                  {formatPrice(item.price)}
                                </span>
                                <div>
                                  <span className="badge bg-warning text-dark px-3 py-2 me-2">🔥 Bestseller</span>
                                </div>
                              </div>
                              <button 
                                className="btn btn-lg w-100 shadow" 
                                onClick={() => addToCart(item.id, 1, item.name, item.price)}
                                style={{ 
                                  backgroundColor: '#2E8B57',
                                  border: 'none',
                                  borderRadius: '50px',
                                  color: 'white',
                                  fontSize: '1.1rem',
                                  padding: '15px 30px',
                                  fontWeight: '600',
                                  transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.transform = 'translateY(-2px)';
                                  e.target.style.boxShadow = '0 8px 20px rgba(46, 139, 87, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.transform = 'translateY(0)';
                                  e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
                                }}
                              >
                                🛒 Add to Cart
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Carousel Controls */}
            <button 
              className="carousel-control-prev" 
              type="button" 
              onClick={prevSlide}
              style={{ width: '5%' }}
            >
              <span 
                className="carousel-control-prev-icon" 
                aria-hidden="true"
                style={{ 
                  backgroundColor: '#2E8B57',
                  borderRadius: '50%',
                  padding: '20px',
                  backgroundSize: '20px 20px'
                }}
              ></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button 
              className="carousel-control-next" 
              type="button" 
              onClick={nextSlide}
              style={{ width: '5%' }}
            >
              <span 
                className="carousel-control-next-icon" 
                aria-hidden="true"
                style={{ 
                  backgroundColor: '#2E8B57',
                  borderRadius: '50%',
                  padding: '20px',
                  backgroundSize: '20px 20px'
                }}
              ></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>

          {/* Full Gourmet Collection - 32 Items with Pagination */}
          <div className="mt-4 pt-3">
            {/* Centered Heading */}
            <div className="text-center mb-4">
              <h3 className="text-white display-5 fw-bold mb-3" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                Full Gourmet Collection
              </h3>
              <div className="text-white">
                <span className="fs-5">Page {currentPage} of {totalPages}</span>
              </div>
            </div>
            
            {/* Menu Items Grid - 8 items per page */}
            <div className="row justify-content-center">
              {currentItems.map(item => (
                <div key={item.id} className="col-xl-3 col-lg-4 col-md-6 mb-4">
                  <div className="card h-100 shadow" style={{ 
                    border: 'none', 
                    borderRadius: '15px', 
                    overflow: 'hidden',
                    background: 'rgba(255, 255, 255, 0.95)',
                    transition: 'all 0.3s ease',
                    maxWidth: '280px',
                    margin: '0 auto'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
                  }}
                  >
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="card-img-top"
                      style={{ 
                        height: '180px', 
                        objectFit: 'cover'
                      }}
                      loading="lazy"
                      onError={handleImageError}
                    />
                    <div className="card-body d-flex flex-column p-3">
                      <h5 className="card-title text-dark fw-bold mb-2" style={{ fontSize: '1.1rem' }}>{item.name}</h5>
                      <p className="card-text text-muted flex-grow-1 mb-3" style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>
                        {item.description}
                      </p>
                      <div className="d-flex justify-content-between align-items-center mt-auto">
                        <span className="h5 mb-0 fw-bold" style={{ color: '#2E8B57', fontSize: '1.2rem' }}>
                          {formatPrice(item.price)}
                        </span>
                        <button 
                          className="btn" 
                          onClick={() => addToCart(item.id, 1, item.name, item.price)} 
                          
                          style={{ 
                            backgroundColor: '#2E8B57',
                            border: 'none',
                            borderRadius: '15px',
                            color: 'white',
                            padding: '6px 16px',
                            fontWeight: '600',
                            fontSize: '0.85rem'
                          }}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center mt-4">
                <nav aria-label="Menu pagination">
                  <ul className="pagination">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => handlePageChange(currentPage - 1)}
                        style={{ 
                          backgroundColor: '#2E8B57', 
                          borderColor: '#2E8B57',
                          color: 'white',
                          margin: '0 2px',
                          borderRadius: '8px',
                          padding: '8px 16px',
                          fontWeight: '600'
                        }}
                      >
                        ← Previous
                      </button>
                    </li>
                    
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNumber = index + 1;
                      return (
                        <li key={pageNumber} className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}>
                          <button 
                            className="page-link" 
                            onClick={() => handlePageChange(pageNumber)}
                            style={{ 
                              backgroundColor: currentPage === pageNumber ? '#2E8B57' : 'rgba(255, 255, 255, 0.9)',
                              borderColor: '#2E8B57',
                              color: currentPage === pageNumber ? 'white' : '#2E8B57',
                              margin: '0 2px',
                              borderRadius: '8px',
                              padding: '8px 12px',
                              fontWeight: currentPage === pageNumber ? 'bold' : 'normal'
                            }}
                          >
                            {pageNumber}
                          </button>
                        </li>
                      );
                    })}
                    
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => handlePageChange(currentPage + 1)}
                        style={{ 
                          backgroundColor: '#2E8B57', 
                          borderColor: '#2E8B57',
                          color: 'white',
                          margin: '0 2px',
                          borderRadius: '8px',
                          padding: '8px 16px',
                          fontWeight: '600'
                        }}
                      >
                        Next →
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          </div>

          {/* Testimonials Section - Reduced gap */}
          <div className="mt-4 pt-3">
            <h3 className="text-center mb-4 text-white display-5 fw-bold" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
              What Our Customers Say
            </h3>
            <div className="row justify-content-center">
              {testimonials.map(testimonial => (
                <div key={testimonial.id} className="col-lg-4 col-md-6 mb-4">
                  <div className="card h-100 shadow" style={{ 
                    border: 'none', 
                    borderRadius: '15px',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    maxWidth: '320px',
                    margin: '0 auto'
                  }}>
                    <div className="card-body text-center p-4">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        className="rounded-circle mb-3"
                        style={{ width: '70px', height: '70px', objectFit: 'cover' }}
                        onError={handleImageError}
                      />
                      <div className="mb-3">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <span key={i} className="text-warning fs-5">⭐</span>
                        ))}
                      </div>
                      <p className="card-text text-muted mb-3 fst-italic" style={{ fontSize: '0.9rem' }}>
                        "{testimonial.comment}"
                      </p>
                      <h6 className="card-title fw-bold text-dark mb-0">{testimonial.name}</h6>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add CSS animation for the popup */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            transform: translate(-50%, -100%);
            opacity: 0;
          }
          to {
            transform: translate(-50%, 0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export default Menu;