import React from 'react';
import './MyProfile.css';

const MyProfile = () => {
  // Local storage details-ah real-time-a handle panna fallback reader mapping
  let userData = {
    name: "Kannan T",
    email: "kannan.t@agriuser.com",
    phone: "+91 94423 58102",
    address: "24, South Car Street, Madurai, Tamil Nadu - 625001"
  };

  try {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      if (parsed && typeof parsed === 'object') {
        userData = { ...userData, ...parsed };
      }
    }
  } catch (err) {
    console.warn('Invalid user data in localStorage:', err);
  }
  
  
  

  return (
    <div className="profile-dashboard-wrapper">
      
      {/* Upper Title Section */}
      <div className="profile-heading-bar">
        <h3>👤 Kannan T </h3>
        <p>Manage your delivery details and spending insights</p>
      </div>

      {/* 💳 CARD 1: Identity Badge Layout Hero Element */}
      <div className="profile-identity-hero-card">
        <div className="profile-avatar-mainframe">
          {userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <div className="profile-meta-stack">
          <h4>{userData.name || 'Premium User'}</h4>
          <div className="status-badge-row">
            <span className="badge-verified-customer">Verified Buyer</span>
            <span className="badge-location-tag">📍 Madurai, TN</span>
          </div>
        </div>
      </div>

      {/* 📊 CARD 2: Dynamic Insights Analytics Grid Metrics */}
      <div className="profile-analytics-grid-row">
        <div className="metric-box-card gloss-tint-green">
          <p className="metric-lbl">Total Spent Amount</p>
          <h2 className="metric-val-neon">₹3,420</h2>
          <span className="metric-subtext">Direct to Local Farmers</span>
        </div>
        <div className="metric-box-card gloss-tint-white">
          <p className="metric-lbl">Orders Placed</p>
          <h2 className="metric-val-white">02 Active</h2>
          <span className="metric-subtext">In-Transit Deliveries</span>
        </div>
      </div>

      {/* ⚙️ CARD 3: Account Personal Information Fields Sheet */}
      <div className="profile-details-sheet-card">
        <h5 className="section-subtitle-txt">Personal Credentials</h5>
        
        <div className="info-field-row-item">
          <label className="field-lbl">Registered Email</label>
          <div className="field-val-container">
            <span className="field-value-txt">{userData.email}</span>
          </div>
        </div>

        <div className="info-field-row-item">
          <label className="field-lbl">Contact Phone</label>
          <div className="field-val-container">
            <span className="field-value-txt">{userData.phone || '+91 XXXXX XXXXX'}</span>
          </div>
        </div>

        <div className="info-field-row-item stretch-column">
          <label className="field-lbl">Primary Delivery Address</label>
          <div className="field-val-container text-area-box">
            <p className="field-value-txt address-para">{userData.address || 'No address added yet.'}</p>
          </div>
        </div>

        {/* Edit Action Button Triggers */}
        <button className="profile-update-action-btn" onClick={() => alert('Profile update configuration module coming soon!')}>
          ⚙️ Edit Profile Settings
        </button>
      </div>

    </div>
  );
};

export default MyProfile;