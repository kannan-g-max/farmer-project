import React, { useState, useEffect } from 'react';
import './MarketFeed.css';

const MarketFeed = () => {
  const [feedItems, setFeedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const getProductName = (item) => item.product || item.name || item.title || 'Untitled product';
  const getProductImage = (item) => item.image || item.imageUrl || item.photoUrl || item.fileUrl || '';
  const getFarmerName = (item) => item.farmerName || item.farmerHandle || item.username || 'Farmer';
  const getFarmerHandle = (item) => item.farmerHandle || item.handle || item.username || '@farmer';
  const getDistance = (item) => item.distance || item.distanceAway || 'Nearby';
  const getPrice = (item) => item.price ?? item.amount ?? '';
  const getDescription = (item) => item.description || item.caption || item.details || '';

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8080/api/products/feed', {
          headers: { 'Authorization': `Bearer ${token}` }
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
    fetchFeed();
  }, []);

  if (loading) return <div className="feed-container"><p>Loading feed...</p></div>;

  return (
    <div className="feed-container">
      <header className="feed-header">
        <h2>Agri<span>Gram</span></h2>
      </header>

      <div className="feed-scroll">
        {feedItems.length === 0 ? (
          <p className="no-items">No products available</p>
        ) : (
          feedItems.map(item => (
            <article key={item.id} className="feed-card">
              <div className="card-top">
                <div className="farmer-thumb">{getFarmerName(item).charAt(0).toUpperCase()}</div>
                <div className="farmer-details">
                  <span className="handle">{getFarmerHandle(item)}</span>
                  <span className="location">{getDistance(item)}</span>
                </div>
              </div>

              {getProductImage(item) && (
                <div className="card-image-wrapper">
                  <img src={getProductImage(item)} alt={getProductName(item)} />
                </div>
              )}

              <div className="card-description">
                <p><strong>{getProductName(item)}</strong>{getPrice(item) !== '' ? ` - ₹${getPrice(item)}` : ''}</p>
                <p>{getDescription(item)}</p>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
};

export default MarketFeed;
