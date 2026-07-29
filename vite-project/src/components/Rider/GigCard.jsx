import React from 'react';
import './GigCart.css';

export default function GigCard({ gig, isActive, onRefresh }) {
  
  const handleAccept = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:8080/api/orders/${gig.id}/accept`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert(`Gig ORD-${gig.id} accepted successfully! Moving to active track.`);
        if (onRefresh) onRefresh();
      } else {
        const err = await response.json().catch(() => ({}));
        alert(err.message || 'Failed to accept gig');
      }
    } catch (error) {
      console.error(error);
      alert('Network error while accepting gig');
    }
  };

  const handleDeliver = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:8080/api/orders/${gig.id}/deliver`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert(`Order ORD-${gig.id} marked as delivered successfully!`);
        if (onRefresh) onRefresh();
      } else {
        const err = await response.json().catch(() => ({}));
        alert(err.message || 'Failed to deliver order');
      }
    } catch (error) {
      console.error(error);
      alert('Network error while delivering order');
    }
  };

  const openGoogleMaps = (lat, lon) => {
    if (lat === null || lat === undefined || lat === '' || lon === null || lon === undefined || lon === '') {
      alert("Coordinates not available for this location.");
      return;
    }

    const latitude = Number(lat);
    const longitude = Number(lon);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      alert("Coordinates not available for this location.");
      return;
    }

    const destination = `${latitude},${longitude}`;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="gig-professional-card" style={{ border: isActive ? '1px dashed #3b82f6' : '1px solid #222' }}>
      <div className="gig-card-left">
        <div className="gig-id-tag" style={{ background: isActive ? '#3b82f6' : '#22c55e' }}>
          ORD-{gig.id}
        </div>
        <div className="gig-weight-indicator">
          <span>Payload Weight</span>
          <strong>{gig.weight} KG</strong>
        </div>
        {gig.distanceToRider !== undefined && gig.distanceToRider !== null && (
          <div style={{ fontSize: '11px', color: '#aaa', marginTop: '10px' }}>
            📍 <strong>{Number(gig.distanceToRider).toFixed(1)} km</strong> away
          </div>
        )}
      </div>

      <div className="gig-card-center-route">
        <div className="route-node pickup">
          <span className="dot dot-pickup"></span>
          <div className="node-details">
            <small>PICKUP FROM FARMER</small>
            <h5>{gig.farmerName} <span style={{ fontSize: '11px', color: '#888' }}>({gig.farmerLocation || 'Location pending'})</span></h5>
            {isActive && (
              <button 
                type="button"
                onClick={() => openGoogleMaps(gig.farmerLatitude, gig.farmerLongitude)} 
                style={{ background: '#111', border: '1px solid #333', color: '#3b82f6', fontSize: '11px', padding: '3px 8px', borderRadius: '4px', marginTop: '5px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                🗺️ Navigate to Pickup
              </button>
            )}
          </div>
        </div>

        <div className="route-line-connector"></div>

        <div className="route-node drop">
          <span className="dot dot-drop"></span>
          <div className="node-details">
            <small>DROP TO BUYER</small>
            <h5>{gig.buyerName} <span style={{ fontSize: '11px', color: '#888' }}>({gig.buyerLocation || 'Location pending'})</span></h5>
            {isActive && (
              <button 
                type="button"
                onClick={() => openGoogleMaps(gig.buyerLatitude, gig.buyerLongitude)} 
                style={{ background: '#111', border: '1px solid #333', color: '#3b82f6', fontSize: '11px', padding: '3px 8px', borderRadius: '4px', marginTop: '5px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                🗺️ Navigate to Drop
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="gig-card-right-actions">
        <div className="payout-block">
          <span className="currency-label">+ ₹</span>
          <span className="payout-amount">{Math.round(gig.deliveryPayout || 50)}</span>
        </div>
        <div className="item-badge">📦 {gig.itemName}</div>
        
        {isActive ? (
          <button 
            className="accept-gig-btn" 
            style={{ background: '#22c55e', color: '#121212' }} 
            onClick={handleDeliver}
          >
            Mark Delivered ✓
          </button>
        ) : (
          <button className="accept-gig-btn" onClick={handleAccept}>
            Accept Job →
          </button>
        )}
      </div>
    </div>
  );
}