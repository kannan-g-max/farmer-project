import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Sidebar from './Sidebar.jsx';
import Cart from './Cart.jsx';
import MyOrders from './MyOrders.jsx';
import MyProfile from './MyProfile.jsx';
import './MarketFeed.css';

const PRODUCT_UPDATE_KEY = 'products_last_updated';

const sorters = {
  newest: (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
  lowPrice: (a, b) => Number(a.price || 0) - Number(b.price || 0),
  highPrice: (a, b) => Number(b.price || 0) - Number(a.price || 0)
};

const MarketFeed = () => {
  const [activeTab, setActiveTab] = useState('market');
  const [feedItems, setFeedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('user_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const getProductName = (item) => item.name || item.title || 'Premium Crop';
  const getProductImage = (item) => item.imageUrl || item.photoUrl || 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?q=80&w=600&auto=format&fit=crop';
  const getFarmerName = (item) => item.farmerName || 'Farmer';
  const getFarmerHandle = (item) => item.farmerHandle || `@farm_${item.id || '001'}`;
  const getDistance = (item) => item.distance || 'Nearby';
  const getPrice = (item) => Number(item.price || 0);
  const getDescription = (item) => item.description || 'Fresh harvest directly from fields.';
  const getCategory = (item) => item.category || 'Others';
  const getUnit = (item) => item.unit || 'kg';

  const refreshFeed = useCallback(async () => {
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/products/feed', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const data = await response.json().catch(() => []);
      if (!response.ok) {
        throw new Error(data.message || 'Unable to load products');
      }
      setFeedItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch feed:', err);
      setError(err.message || 'Unable to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab !== 'market') {
      return;
    }

    setLoading(true);
    refreshFeed();

    const interval = setInterval(refreshFeed, 6000);
    const onStorage = (event) => {
      if (event.key === PRODUCT_UPDATE_KEY) {
        refreshFeed();
      }
    };
    const onProductsUpdated = () => refreshFeed();

    window.addEventListener('storage', onStorage);
    window.addEventListener('products-updated', onProductsUpdated);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('products-updated', onProductsUpdated);
    };
  }, [activeTab, refreshFeed]);

  const handleAddToCart = (product) => {
    const productId = product.id;
    const existingItem = cartItems.find((item) => item.id === productId);
    let updatedCart;

    if (existingItem) {
      updatedCart = cartItems.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      const newItem = {
        id: productId,
        name: getProductName(product),
        farmer: getFarmerName(product),
        price: getPrice(product),
        quantity: 1,
        image: getProductImage(product),
        unit: getUnit(product),
        category: getCategory(product),
        availableQuantity: Number(product.quantity || 0)
      };
      updatedCart = [...cartItems, newItem];
    }

    setCartItems(updatedCart);
    localStorage.setItem('user_cart', JSON.stringify(updatedCart));
    alert(`${getProductName(product)} added to cart.`);
  };

  const filteredFeedItems = useMemo(() => {
    const data = feedItems.filter((item) => {
      const matchesSearch =
        getProductName(item).toLowerCase().includes(searchTerm.toLowerCase()) ||
        getFarmerName(item).toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All' ||
        getCategory(item).toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });

    return data.sort(sorters[sortBy]);
  }, [feedItems, searchTerm, selectedCategory, sortBy]);

  return (
    <div className="user-dashboard-layout">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="feed-content-area">
        {activeTab === 'market' && (
          <>
            <header className="feed-top-bar">
              <h2>Agri<span>Gram</span> Marketplace</h2>
              <p>Search, sort, and buy fresh products uploaded by local farmers</p>
            </header>

            <div className="market-search-filter-box" style={{ width: '100%', maxWidth: '680px', marginBottom: '24px' }}>
              <input
                type="text"
                placeholder="Search by product or farmer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '14px 18px', background: '#141414', border: '1px solid #222', borderRadius: '10px', color: '#fff', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: '10px', marginTop: '12px' }}>
                <div className="category-chips-row" style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '5px' }}>
                  {['All', 'Vegetables', 'Fruits', 'Others'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      style={{ background: selectedCategory === cat ? '#22c55e' : '#141414', color: selectedCategory === cat ? '#121212' : '#aaa', border: '1px solid #222', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: '#141414', color: '#fff', border: '1px solid #222', borderRadius: '10px' }}
                >
                  <option value="newest">Newest</option>
                  <option value="lowPrice">Price: Low to High</option>
                  <option value="highPrice">Price: High to Low</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="feed-loading-box"><div className="loader-circle"></div><p>Loading market updates...</p></div>
            ) : error ? (
              <p className="no-posts-msg" style={{ color: '#f87171' }}>{error}</p>
            ) : (
              <div className="posts-container-list">
                {filteredFeedItems.length === 0 ? (
                  <p className="no-posts-msg" style={{ color: '#555', marginTop: '40px' }}>No matching products found.</p>
                ) : (
                  filteredFeedItems.map((item) => (
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
                          <img src={getProductImage(item)} alt={getProductName(item)} />
                        </div>
                      )}

                      <div className="card-info-footer">
                        <div className="title-price-flex">
                          <h3>{getProductName(item)}</h3>
                          <span className="price-neon">₹{getPrice(item)} / {getUnit(item)}</span>
                        </div>
                        <p className="description-text">
                          <span className="bold-author">{getFarmerName(item)}</span> {getDescription(item)}
                        </p>
                        <p style={{ margin: '6px 0', color: '#a3e635', fontSize: '12px' }}>
                          Available: {item.quantity} {getUnit(item)} | Category: {getCategory(item)}
                        </p>
                        <div className="card-action-triggers">
                          <button className="buy-trigger-btn" onClick={() => handleAddToCart(item)}>Add to Cart</button>
                          <button className="whatsapp-trigger-btn" onClick={() => setSelectedProduct(item)}>View Details</button>
                        </div>
                      </div>
                    </article>
                  ))
                )}
              </div>
            )}
          </>
        )}

        {activeTab === 'cart' && <Cart cartItems={cartItems} setCartItems={setCartItems} feedItems={feedItems} />}
        {activeTab === 'orders' && <MyOrders />}
        {activeTab === 'profile' && <MyProfile />}
      </div>

      {selectedProduct && (
        <div className="create-post-container" onClick={() => setSelectedProduct(null)}>
          <div className="post-modal" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h3>{getProductName(selectedProduct)}</h3>
              <button className="close-btn" onClick={() => setSelectedProduct(null)}>✕</button>
            </div>
            <div className="modal-content" style={{ justifyContent: 'flex-start' }}>
              <div className="preview-area" style={{ width: '100%' }}>
                <img src={getProductImage(selectedProduct)} alt={getProductName(selectedProduct)} className="post-preview" />
                <p><strong>Farmer:</strong> {getFarmerName(selectedProduct)}</p>
                <p><strong>Category:</strong> {getCategory(selectedProduct)}</p>
                <p><strong>Price:</strong> ₹{getPrice(selectedProduct)} / {getUnit(selectedProduct)}</p>
                <p><strong>Available:</strong> {selectedProduct.quantity} {getUnit(selectedProduct)}</p>
                <p><strong>Description:</strong> {getDescription(selectedProduct)}</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setSelectedProduct(null)}>Close</button>
              <button className="share-btn" onClick={() => { handleAddToCart(selectedProduct); setSelectedProduct(null); }}>
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketFeed;
