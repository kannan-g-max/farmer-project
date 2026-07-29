import React, { useState, useEffect, useMemo, useCallback } from 'react';
import GigCard from './GigCard';
import LocationTracker from './LocationTracker';
import './GigsPanel.css';

export default function GigsPanel() {
  const [maxWeight, setMaxWeight] = useState(36);
  const [availableGigs, setAvailableGigs] = useState([]);
  const [activeGigs, setActiveGigs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGigs = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      // 1. Fetch available gigs
      const availableResponse = await fetch('http://localhost:8080/api/rider/gigs', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (availableResponse.ok) {
        const data = await availableResponse.json();
        setAvailableGigs(data);
      }

      // 2. Fetch active gigs
      const activeResponse = await fetch('http://localhost:8080/api/rider/gigs/active', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (activeResponse.ok) {
        const data = await activeResponse.json();
        setActiveGigs(data);
      }
    } catch (error) {
      console.error('Failed to fetch gigs:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGigs();
    const interval = setInterval(fetchGigs, 4000);
    return () => clearInterval(interval);
  }, [fetchGigs]);

  const filteredGigs = useMemo(() => {
    return availableGigs.filter(gig => gig.weight <= maxWeight);
  }, [availableGigs, maxWeight]);

  // Calculate percentage dynamically for background track gradient fill (clamped 0-100)
  const sliderPercentage = Math.min(
    100,
    Math.max(0, ((maxWeight - 5) / (150 - 5)) * 100)
  );

  return (
    <div className="gigs-container">
      {/* Dynamic Location Overlay */}
      <LocationTracker />

      {/* RENDER ACTIVE GIGS SECTION IF ANY */}
      {activeGigs.length > 0 && (
        <div className="active-gigs-section" style={{ marginBottom: '24px' }}>
          <div className="section-title-bar" style={{ borderBottom: '1px solid #3b82f6' }}>
            <h4 style={{ color: '#3b82f6' }}>⚡ Active Deliveries ({activeGigs.length})</h4>
            <span className="status-badge-live" style={{ background: '#3b82f620', color: '#3b82f6' }}>In Progress</span>
          </div>
          <div className="gigs-grid" style={{ marginTop: '15px' }}>
            {activeGigs.map(gig => (
              <GigCard key={gig.id} gig={gig} isActive={true} onRefresh={fetchGigs} />
            ))}
          </div>
        </div>
      )}

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

        {loading ? (
          <div className="no-gigs-fallback">
            <p>Loading available gigs near you...</p>
          </div>
        ) : filteredGigs.length === 0 ? (
          <div className="no-gigs-fallback">
            <p>No orders found within this weight threshold. Try increasing your capacity limit.</p>
          </div>
        ) : (
          <div className="gigs-grid">
            {filteredGigs.map(gig => (
              <GigCard key={gig.id} gig={gig} isActive={false} onRefresh={fetchGigs} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}