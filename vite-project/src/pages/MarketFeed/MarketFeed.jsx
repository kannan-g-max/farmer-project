import React, { useState, useEffect, useMemo, useCallback } from 'react';
import './MarketFeed.css';

const PRODUCT_UPDATE_KEY = 'products_last_updated';

const MarketFeed = () => {
  const [feedItems, setFeedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  const getProductName = (item) => item.product || item.name || item.title || 'Premium Crop';
  const getProductImage = (item) => item.image || item.imageUrl || item.photoUrl || 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?q=80&w=600&auto=format&fit=crop';
  const getFarmerName = (item) => item.farmerName || 'Farmer';
  const getFarmerHandle = (item) => item.farmerHandle || `@farm_${item.id || '001'}`;
  const getDistance = (item) => item.distance || 'Madurai (Nearby)';
  const getPrice = (item) => item.price || item.amount || 0;
  const getDescription = (item) => item.description || item.caption || 'Fresh harvest directly from fields.';
  const getCategory = (item) => item.category || 'Vegetables';

  const fetchFeed = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchFeed();

    const interval = setInterval(fetchFeed, 6000);
    const onStorage = (event) => {
      if (event.key === PRODUCT_UPDATE_KEY) {
        fetchFeed();
      }
    };
    const onProductsUpdated = () => fetchFeed();

    window.addEventListener('storage', onStorage);
    window.addEventListener('products-updated', onProductsUpdated);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('products-updated', onProductsUpdated);
    };
  }, [fetchFeed]);

  const filteredFeedItems = useMemo(() => {
    const filtered = feedItems.filter(item => {
    const matchesSearch = 
      getProductName(item).toLowerCase().includes(searchTerm.toLowerCase()) ||
      getFarmerName(item).toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = 
      selectedCategory === 'All' || 
      getCategory(item).toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });

    if (sortBy === 'lowPrice') {
      return filtered.sort((a, b) => Number(getPrice(a)) - Number(getPrice(b)));
    }
    if (sortBy === 'highPrice') {
      return filtered.sort((a, b) => Number(getPrice(b)) - Number(getPrice(a)));
    }
    return filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }, [feedItems, searchTerm, selectedCategory, sortBy]);

  return (
    <div className="feed-content-area" style={{ padding: '30px', boxSizing: 'border-box' }}>
      <header className="feed-top-bar">
        <h2>Agri<span>Gram</span> Marketplace</h2>
        <p>Browse fresh items uploaded by fellow farmers in the region</p>
      </header>

      <div className="market-search-filter-box" style={{ width: '100%', maxWidth: '680px', marginBottom: '24px' }}>
        <input 
          type="text"
          placeholder="🔍 Search crops, products or farmers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '14px 18px', background: '#141414', border: '1px solid #222', borderRadius: '10px', color: '#fff', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}
        />
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: '10px', marginTop: '14px' }}>
          <div className="category-chips-row" style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '5px' }}>
            {['All', 'Vegetables', 'Fruits', 'Others'].map(cat => (
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
      ) : (
        <div className="posts-container-list">
          {filteredFeedItems.length === 0 ? (
            <p className="no-posts-msg" style={{ color: '#555', marginTop: '40px' }}>🌾 No matching crops found or available today.</p>
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
                    <span className="price-neon">₹{getPrice(item)} / {item.unit || 'kg'}</span>
                  </div>
                  <p className="description-text">
                    <span className="bold-author">{getFarmerName(item)}</span> {getDescription(item)}
                  </p>
                  <p style={{ margin: '6px 0', color: '#a3e635', fontSize: '12px' }}>
                    Available: {item.quantity} {item.unit || 'kg'} | Category: {getCategory(item)}
                  </p>
                  <div className="card-action-triggers">
                    <button className="whatsapp-trigger-btn" onClick={() => window.open(`https://wa.me/#?text=Hi, I am interested in your ${getProductName(item)}`, '_blank')} style={{ width: '100%' }}>💬 Contact Farmer via WhatsApp</button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default MarketFeed;