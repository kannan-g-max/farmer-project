import React, { useState } from 'react';
import './MarketFeed.css';

const MarketFeed = () => {
  // Dummy data for the feed
  const [feedItems] = useState([
  
    {
      id: 1,
      farmerName: 'T.Kannan',
      farmerHandle: '@gopi_farms',
      product: 'Fresh Green Spinach',
      price: 25,
      image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=500&q=60',
      timeRemaining: '12h left',
      distance: '3.5 km'
    }
  ]);

  const handleBuy = (productName) => {
    alert(`Order Placed for ${productName}! Connecting to nearby Delivery Boy...`);
  };

  return (
    <div className="feed-container">
      <header className="feed-header">
        <h2>Agri<span>Gram</span></h2>
       
      </header>

      <div className="feed-scroll">
        {feedItems.map(item => (
          <article key={item.id} className="feed-card">
            {/* Farmer Info */}
            <div className="card-top">
              <div className="farmer-thumb">{item.farmerName[0]}</div>
              <div className="farmer-details">
                <span className="handle">{item.farmerHandle}</span>
                <span className="location">{item.distance} away</span>
              </div>
              <button className="dots">•••</button>
            </div>

            {/* Product Image */}
            <div className="card-image-wrapper">
              <img src={item.image} alt={item.product} />
              <div className="timer-overlay">{item.timeRemaining}</div>
            </div>

            {/* Interaction Area */}
            <div className="card-actions">
              <div className="main-actions">
                <span>❤️</span> <span>💬</span> <span>✈️</span>
              </div>
              <button className="buy-button" onClick={() => handleBuy(item.product)}>
                Buy for ₹{item.price}
              </button>
            </div>

            {/* Description */}
            <div className="card-description">
              <p><strong>{item.farmerHandle}</strong> Just harvested these fresh {item.product.toLowerCase()}! Get them before they go out of stock.</p>
            </div>

            {/* Delivery Option Info */}
            <div className="delivery-info">
              🚀 Fast Delivery available to your location
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default MarketFeed;