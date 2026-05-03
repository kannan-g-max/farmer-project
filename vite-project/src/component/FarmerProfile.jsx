import React from 'react';
import './FarmerProfile.css';

const FarmerProfile = () => {
  return (
    <div className="desktop-agri-dashboard">
      {/* 1. Agri-Patterned Background Visual Overlay */}
      <div className="agri-pattern-overlay"></div>

      {/* 2. Left Sidebar - Translucent Glassmorphism */}
      <aside className="main-sidebar">
        <div className="sidebar-branding">FarmerAGRI</div>
        <nav className="sidebar-nav">
          <div className="nav-link active">🏠 Home Feed</div>
          <div className="nav-link">🔍 Market</div>
          <div className="nav-link">💬 Messages</div>
          <div className="nav-link">➕ New Post</div>
          <div className="nav-link">🧑‍🌾 Profile</div>
        </nav>
        <div className="sidebar-more">☰ More</div>
      </aside>

      {/* 3. Main Content Container */}
      <main className="dashboard-content">
        <div className="profile-central-card">
          <header className="profile-hero-section">
            <div className="avatar-holder">
              <div className="profile-avatar-placeholder">
                {/* Image Placeholder */}
                {/* <img src="your-url.jpg" alt="Profile" /> */}
              </div>
            </div>

            <section className="profile-info-column">
              <div className="username-action-row">
                <h2 className="user-handle">mr_kannan_.47 <span className="verified-status">✔</span></h2>
                <div className="action-button-group">
                  <button className="dashboard-btn primary">Edit profile</button>
                  <button className="dashboard-btn secondary">Share profile</button>
                </div>
              </div>

              <div className="stats-indicator-row">
                <div className="stat-card"><strong>0</strong><span>Products</span></div>
                <div className="stat-card"><strong>0</strong><span>Customers</span></div>
                <div className="stat-card"><strong>0.0</strong><span>Rating</span></div>
              </div>

              <div className="bio-summary-row">
              
                <p>Farmer T | Madurai 📍 | TN 58 🤫</p>
                <p className="farmer-label">mr_kannan_agri_pro 🚜</p>
                <p>Fresh harvest delivered directly to your home! 🍎🥬</p>
              </div>
            </section>
          </header>

          <hr className="content-divider" />

          {/* Product Grid Area - Simplified */}
          <div className="product-tab-header">
            <span className="active-tab">田 PRODUCTS</span>
          </div>

          <div className="product-display-grid">
            {/* Map over products data in a real app */}
            <div className="product-item"></div>
            <div className="product-item"></div>
            <div className="product-item"></div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FarmerProfile;