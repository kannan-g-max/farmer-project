import React, { useState, useMemo } from 'react';
import GigCard from './GigCard';
import LocationTracker from './LocationTracker'; // Engee recall panniko
import './GigsPanel.css';

const MOCK_GIGS = [
  { id: 'DEL-6081', farmer: 'Kannan', farmerLoc: 'Madurai', buyer: 'Ramesh', buyerLoc: 'Anna Nagar', item: 'Fresh Spinach', weight: 25, payout: 120 },
  { id: 'DEL-4412', farmer: 'Muthu', farmerLoc: 'Alanganallur', buyer: 'Hotel Sangam', buyerLoc: 'Simmakkal', item: 'Premium Mangoes', weight: 50, payout: 280 },
  { id: 'DEL-9022', farmer: 'Chinna', farmerLoc: 'Samayanallur', buyer: 'Anand', buyerLoc: 'K.K. Nagar', item: 'Organic Tomatoes', weight: 15, payout: 90 },
  { id: 'DEL-1104', farmer: 'Palani', farmerLoc: 'Melur', buyer: 'Saravana Stores', buyerLoc: 'Mattuthavani', item: 'Ponni Rice Bags', weight: 100, payout: 650 }
];

export default function GigsPanel() {
  const [maxWeight, setMaxWeight] = useState(36); // Image-la irundha default value set panniruken
  const filteredGigs = useMemo(() => {
    return MOCK_GIGS.filter(gig => gig.weight <= maxWeight);
  }, [maxWeight]);

  // Calculate percentage dynamically for background track gradient fill (clamped 0-100)
  const sliderPercentage = Math.min(
    100,
    Math.max(0, ((maxWeight - 5) / (150 - 5)) * 100)
  );

  return (
    <div className="gigs-container">
      {/* Dynamic Location Overlay */}
      <LocationTracker />

      {/* RENDER SMART CAPACITY FILTER */}
      <div className="filter-header-card professional-glass">
        <div className="filter-card-title-zone">
          <div className="filter-icon-badge">⚡</div>
          <div>
            <h3>Smart Capacity Filter</h3>
            <p>Set your maximum load carrying capacity to filter matching orders near you.</p>
          </div>
        </div>
        
        <div className="range-slider-wrapper">
          <div className="slider-value-display-bar">
            <span className="control-label">Carrying Capacity Limit</span>
            <div className="weight-badge-glow">
              <span className="value-num">{maxWeight}</span>
              <span className="value-unit">KG</span>
            </div>
          </div>

          <div className="slider-interactive-track">
            <input 
              type="range" 
              min="5" 
              max="150" 
              value={maxWeight} 
              onChange={(e) => setMaxWeight(Number(e.target.value))}
              className="weight-slider-premium"
              style={{
                background: `linear-gradient(to right, #22c55e 0%, #22c55e ${sliderPercentage}%, #232627 ${sliderPercentage}%, #232627 100%)`
              }}
            />
          </div>

          <div className="slider-markers-professional">
            <div className="marker-tick active"><span>5 KG</span></div>
            <div className={`marker-tick ${maxWeight >= 50 ? 'active' : ''}`}><span>50 KG</span></div>
            <div className={`marker-tick ${maxWeight >= 100 ? 'active' : ''}`}><span>100 KG</span></div>
            <div className={`marker-tick ${maxWeight >= 150 ? 'active' : ''}`}><span>150 KG</span></div>
          </div>
        </div>
      </div>

      <div className="gigs-list-section">
        <div className="section-title-bar">
          <h4>Available Gigs Within Range ({filteredGigs.length})</h4>
          <span className="status-badge-live">Live Streams</span>
        </div>

        {filteredGigs.length === 0 ? (
          <div className="no-gigs-fallback">
            <p>No orders found within this weight threshold. Try increasing your capacity limit.</p>
          </div>
        ) : (
          <div className="gigs-grid">
            {filteredGigs.map(gig => (
              <GigCard key={gig.id} gig={gig} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}