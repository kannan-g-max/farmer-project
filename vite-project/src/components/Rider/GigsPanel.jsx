import React, { useState, useEffect, useMemo, useCallback } from 'react';
import GigCard from './GigCard';
import LocationTracker from './LocationTracker';
import './GigsPanel.css';

export default function GigsPanel() {
  const [maxWeight, setMaxWeight] = useState(36);
  const [maxDistance, setMaxDistance] = useState(50);
  const [availableGigs, setAvailableGigs] = useState([]);
  const [activeGigs, setActiveGigs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGigs = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const availableResponse = await fetch('http://localhost:8080/api/rider/gigs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (availableResponse.ok) {
        const data = await availableResponse.json();
        setAvailableGigs(data);
      }

      const activeResponse = await fetch('http://localhost:8080/api/rider/gigs/active', {
        headers: { Authorization: `Bearer ${token}` }
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
    return availableGigs.filter((gig) => {
      const withinWeight = gig.weight <= maxWeight;
      const distanceValue = Number(gig.distanceToRider);
      const withinDistance = !Number.isFinite(distanceValue) || distanceValue <= maxDistance;
      return withinWeight && withinDistance;
    });
  }, [availableGigs, maxWeight, maxDistance]);

  const weightSliderPercentage = Math.min(
    100,
    Math.max(0, ((maxWeight - 5) / (150 - 5)) * 100)
  );

  const distanceSliderPercentage = Math.min(
    100,
    Math.max(0, (maxDistance / 50) * 100)
  );

  return (
    <div className="gigs-container">
      <LocationTracker />

      {activeGigs.length > 0 && (
        <div className="active-gigs-section" style={{ marginBottom: '24px' }}>
          <div className="section-title-bar" style={{ borderBottom: '1px solid #3b82f6' }}>
            <h4 style={{ color: '#3b82f6' }}>⚡ Active Deliveries ({activeGigs.length})</h4>
            <span className="status-badge-live" style={{ background: '#3b82f620', color: '#3b82f6' }}>In Progress</span>
          </div>
          <div className="gigs-grid" style={{ marginTop: '15px' }}>
            {activeGigs.map((gig) => (
              <GigCard key={gig.id} gig={gig} isActive={true} onRefresh={fetchGigs} />
            ))}
          </div>
        </div>
      )}

      <div className="filter-header-card professional-glass">
        <div className="filter-card-title-zone">
          <div className="filter-icon-badge">⚡</div>
          <div>
            <h3>Smart Capacity &amp; Distance Filter</h3>
            <p>Set your load capacity and pickup radius to filter matching orders near you.</p>
          </div>
        </div>

        <div className="range-slider-wrapper">
          <div className="filter-control-block">
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
                  background: `linear-gradient(to right, #22c55e 0%, #22c55e ${weightSliderPercentage}%, #232627 ${weightSliderPercentage}%, #232627 100%)`
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

          <div className="filter-control-block distance-control-block">
            <div className="slider-value-display-bar">
              <span className="control-label">Pickup Radius Limit</span>
              <div className="weight-badge-glow distance-badge-glow">
                <span className="value-num">{maxDistance}</span>
                <span className="value-unit">KM</span>
              </div>
            </div>

            <div className="slider-interactive-track">
              <input
                type="range"
                min="1"
                max="50"
                value={maxDistance}
                onChange={(e) => setMaxDistance(Number(e.target.value))}
                className="weight-slider-premium distance-slider-premium"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${distanceSliderPercentage}%, #232627 ${distanceSliderPercentage}%, #232627 100%)`
                }}
              />
            </div>

            <div className="slider-markers-professional">
              <div className={`marker-tick ${maxDistance >= 5 ? 'active' : ''}`}><span>5 KM</span></div>
              <div className={`marker-tick ${maxDistance >= 15 ? 'active' : ''}`}><span>15 KM</span></div>
              <div className={`marker-tick ${maxDistance >= 30 ? 'active' : ''}`}><span>30 KM</span></div>
              <div className={`marker-tick ${maxDistance >= 50 ? 'active' : ''}`}><span>50 KM</span></div>
            </div>
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
            <p>No orders found within your selected weight and pickup radius. Try increasing one of the limits.</p>
          </div>
        ) : (
          <div className="gigs-grid">
            {filteredGigs.map((gig) => (
              <GigCard key={gig.id} gig={gig} isActive={false} onRefresh={fetchGigs} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
