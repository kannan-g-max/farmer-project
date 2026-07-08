import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar.jsx';
import Cart from './Cart.jsx';       
import MyOrders from './MyOrders.jsx'; 
// 🔥 FIX: Pudhusa create panna profile view component-ah inga import panrom!
import MyProfile from './MyProfile.jsx'; 
import './MarketFeed.css';

const MarketFeed = () => {
  const [activeTab, setActiveTab] = useState('market'); 
  const [feedItems, setFeedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Category states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // 🛒 Cart States
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('user_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const handleAddToCart = (product) => {
    const productId = product.id || Date.now();
    const existingItem = cartItems.find(item => item.id === productId);
    let updatedCart;

    if (existingItem) {
      updatedCart = cartItems.map(item => 
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      const newItem = {
        id: productId,
        name: getProductName(product),
        farmer: getFarmerName(product),
        price: Number(getPrice(product)) || 25, 
        quantity: 1, 
        image: getProductImage(product)
      };
      updatedCart = [...cartItems, newItem];
    }
    
    setCartItems(updatedCart);
    localStorage.setItem('user_cart', JSON.stringify(updatedCart)); 
    alert(`${getProductName(product)} added to cart! 🛒`);
  };

  const getProductName = (item) => item.product || item.name || item.title || 'Premium Crop';
  const getProductImage = (item) => item.image || item.imageUrl || item.photoUrl || 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?q=80&w=600&auto=format&fit=crop';
  const getFarmerName = (item) => item.farmerName || 'Farmer';
  const getFarmerHandle = (item) => item.farmerHandle || `@farm_${item.id || '001'}`;
  const getDistance = (item) => item.distance || 'Madurai (Nearby)';
  const getPrice = (item) => item.price || item.amount || 0;
  const getDescription = (item) => item.description || item.caption || 'Fresh harvest directly from fields.';
  const getCategory = (item) => item.category || 'Vegetables'; 

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8080/api/products/feed', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setFeedItems(data);
        }
      } catch (error) {
        console.error('Failed to fetch feed:', error);
      } finally {
        setLoading(false);
      }
    };
    if (activeTab === 'market') fetchFeed();
  }, [activeTab]);

  // Live Filtering Logic
  const filteredFeedItems = feedItems.filter(item => {
    const matchesSearch = 
      getProductName(item).toLowerCase().includes(searchTerm.toLowerCase()) ||
      getFarmerName(item).toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = 
      selectedCategory === 'All' || 
      getCategory(item).toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="user-dashboard-layout">
      {/* Sidebar navigation control */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="feed-content-area">
        
        {/* VIEW 1: BROWSE MARKET FEED */}
        {activeTab === 'market' && (
          <>
            <header className="feed-top-bar">
              <h2>Agri<span>Gram</span> Marketplace</h2>
              <p>Search crops or browse fresh items uploaded by local farmers</p>
            </header>

            {/* Live Search Controls */}
            <div className="market-search-filter-box" style={{ width: '100%', maxWidth: '540px', marginBottom: '24px' }}>
              <input 
                type="text"
                placeholder="🔍 Search crops, products or farmers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '14px 18px', background: '#141414', border: '1px solid #222', borderRadius: '10px', color: '#fff', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}
              />
              
              {/* Category Filter Chips */}
              <div className="category-chips-row" style={{ display: 'flex', gap: '10px', marginTop: '14px', overflowX: 'auto', paddingBottom: '5px' }}>
                {['All', 'Vegetables', 'Fruits', 'Grains', 'Organic'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{ background: selectedCategory === cat ? '#22c55e' : '#141414', color: selectedCategory === cat ? '#121212' : '#aaa', border: '1px solid #222', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="feed-loading-box"><div className="loader-circle"></div><p>Loading market updates...</p></div>
            ) : (
              <div className="posts-container-list">
                {filteredFeedItems.length === 0 ? (
                  <p className="no-posts-msg" style={{ color: '#555', marginTop: '40px' }}>🌾 No match crops found or available for today.</p>
                ) : (
                  filteredFeedItems.map(item => (
                    <article key={item.id} className="instagram-style-card">
                      <div className="card-profile-header">
                        <div className="avatar-letter">{getFarmerName(item).charAt(0).toUpperCase()}</div>
                        <div className="profile-identity">
                          <span className="name-handle">{getFarmerHandle(item)}</span>
                          <span className="loc-tag">📍 {getDistance(item)}</span>
                        </div>
                      </div>
                      
                      {getProductImage(item) && (
                        <div className="card-media-box">
                          <img src={getProductImage(item)} alt="crop" />
                        </div>
                      )}
                      
                      <div className="card-info-footer">
                        <div className="title-price-flex">
                          <h3>{getProductName(item)}</h3>
                          <span className="price-neon">₹{getPrice(item)}</span>
                        </div>
                        <p className="description-text">
                          <span className="bold-author">{getFarmerName(item)}</span> {getDescription(item)}
                        </p>
                        <div className="card-action-triggers">
                          <button className="buy-trigger-btn" onClick={() => handleAddToCart(item)}>🛒 Add to Cart</button>
                          <button className="whatsapp-trigger-btn" onClick={() => window.open('https://wa.me/#', '_blank')}>💬 WhatsApp</button>
                        </div>
                      </div>
                    </article>
                  ))
                )}
              </div>
            )}
          </>
        )}

        {/* VIEW 2: CART SCREEN */}
        {activeTab === 'cart' && <Cart cartItems={cartItems} setCartItems={setCartItems} />}

        {/* VIEW 3: MY ORDERS HISTORY */}
        {activeTab === 'orders' && <MyOrders />}

        {/* 🔥 VIEW 4: MY PROFILE (Linked perfectly now!) */}
        {activeTab === 'profile' && <MyProfile />}
        
      </div>
    </div>
  );
};

export default MarketFeed;