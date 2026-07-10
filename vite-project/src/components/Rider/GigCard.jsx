import React from 'react';
import './GigCart.css';

export default function GigCard({ gig }) {
  const handleAccept = () => {
    alert(`Gig ${gig.id} accepted successfully! Moving to active track.`);
  };

  return (
    <div className="gig-professional-card">
      <div className="gig-card-left">
        <div className="gig-id-tag">{gig.id}</div>
        <div className="gig-weight-indicator">
          <span>Payload Weight</span>
          <strong>{gig.weight} KG</strong>
        </div>
      </div>

      <div className="gig-card-center-route">
        <div className="route-node pickup">
          <span className="dot dot-pickup"></span>
          <div className="node-details">
            <small>PICKUP FROM FARMER</small>
            <h5>{gig.farmer} <span>({gig.farmerLoc})</span></h5>
          </div>
        </div>

        <div className="route-line-connector"></div>

        <div className="route-node drop">
          <span className="dot dot-drop"></span>
          <div className="node-details">
            <small>DROP TO BUYER</small>
            <h5>{gig.buyer} <span>({gig.buyerLoc})</span></h5>
          </div>
        </div>
      </div>

      <div className="gig-card-right-actions">
        <div className="payout-block">
          <span className="currency-label">+ ₹</span>
          <span className="payout-amount">{gig.payout}</span>
        </div>
        <div className="item-badge">📦 {gig.item}</div>
        <button className="accept-gig-btn" onClick={handleAccept}>
          Accept Job →
        </button>
      </div>
    </div>
  );
}