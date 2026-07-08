import React, { useState } from 'react';
import './RiderProfile.css';

export default function RiderProfile() {
  // Rider Profile States
  const [riderInfo, setRiderInfo] = useState({
    name: "Karthik Raja",
    phone: "+91 9876543210",
    email: "karthik.rider@farmeragri.com",
    vehicleType: "Two Wheeler (Splendor Plus)",
    vehicleNumber: "TN-59-BZ-1234",
    licenseNumber: "DL-59202400192",
    isOnline: true,
    verificationStatus: "Verified" // Verified, Pending, Rejected
  });

  const toggleDutyStatus = () => {
    setRiderInfo(prev => ({ ...prev, isOnline: !prev.isOnline }));
  };

  return (
    <div className="rider-profile-container">
      <header className="feed-top-bar" style={{ marginBottom: '30px', borderBottom: '1px solid #1a1a1a', paddingBottom: '15px' }}>
        <h2 style={{ fontSize: '26px', fontWeight: '800' }}>Rider Profile</h2>
        <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>Manage your account, vehicle details, and duty status</p>
      </header>

      {/* Duty Status Card */}
      <div className="profile-status-card">
        <div className="status-meta">
          <h3>Duty Status</h3>
          <p>Turn on to receive nearby delivery notifications</p>
        </div>
        <button 
          className={`duty-toggle-btn ${riderInfo.isOnline ? 'online' : 'offline'}`}
          onClick={toggleDutyStatus}
        >
          {riderInfo.isOnline ? '🟢 On Duty (Active)' : '🔴 Off Duty (Inactive)'}
        </button>
      </div>

      {/* Profile Details Form Info */}
      <div className="profile-details-grid">
        
        {/* Personal Details Section */}
        <div className="profile-section-card">
          <h4>👤 Personal Details</h4>
          <hr className="section-divider" />
          
          <div className="info-group">
            <label>Full Name</label>
            <input type="text" value={riderInfo.name} disabled />
          </div>

          <div className="info-group">
            <label>Phone Number</label>
            <input type="text" value={riderInfo.phone} disabled />
          </div>

          <div className="info-group">
            <label>Email Address</label>
            <input type="email" value={riderInfo.email} disabled />
          </div>
        </div>

        {/* Vehicle & Verification Section */}
        <div className="profile-section-card">
          <h4>🏍️ Vehicle & Documents</h4>
          <hr className="section-divider" />

          <div className="info-group">
            <label>Vehicle Type</label>
            <input type="text" value={riderInfo.vehicleType} disabled />
          </div>

          <div className="info-group">
            <label>Vehicle Number</label>
            <input type="text" value={riderInfo.vehicleNumber} disabled />
          </div>

          <div className="info-group">
            <label>Driving License (DL)</label>
            <input type="text" value={riderInfo.licenseNumber} disabled />
          </div>

          <div className="verification-badge-container">
            <span className="label-text">KYC Verification:</span>
            <span className={`status-badge ${riderInfo.verificationStatus.toLowerCase()}`}>
              🛡️ {riderInfo.verificationStatus}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}