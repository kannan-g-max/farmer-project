import React, { useState } from 'react';
import './Market.css';

const Market = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="market-container">
      <div className="search-header">
        <h2>Explore Market</h2>
        <div className="search-box">
          <input 
            type="text" 
            placeholder="Search by Farmer ID (e.g., TN58-123)..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-btn">🔍 Search</button>
        </div>
      </div>

      <div className="market-placeholder">
        <p>Enter a Farmer ID to see their live harvest and products.</p>
      </div>
    </div>
  );
};

export default Market;