import React, { useState } from 'react';
import GigsPanel from './GigsPanel';
import './DeliverDashboard.css';

// 🔥 Props la explicit-ah onLogout dynamic handle structure callback hook recall panniko macha
export default function DeliveryDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('available');

  return (
    <div className="rider-dashboard-layout">
      {/* LEFT SIDEBAR SECTION */}
      <aside className="rider-sidebar">
        <div className="sidebar-brand-zone">
          <h2>Farmer<span>AGRI</span></h2>
          <span className="role-pill">RIDER</span>
        </div>

        <nav className="sidebar-menu-links">
          <button 
            className={`menu-item-btn ${activeTab === 'available' ? 'active-tab' : ''}`}
            onClick={() => setActiveTab('available')}
          >
            <span className="menu-icon">🟢</span> Available Orders
          </button>

          <button 
            className={`menu-item-btn ${activeTab === 'earnings' ? 'active-tab' : ''}`}
            onClick={() => setActiveTab('earnings')}
          >
            <span className="menu-icon">💰</span> My Earnings
          </button>
        </nav>

        <div className="sidebar-footer-zone">
          {/* 🔥 Direct-ah call App.jsx dynamic state controller loop reset triggers action logic */}
          <button className="logout-btn-action" onClick={onLogout}>
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* RIGHT MAIN DYNAMIC VIEW PANEL */}
      <main className="rider-main-viewport">
        {activeTab === 'available' && (
          <div className="view-fade-in">
            <GigsPanel />
          </div>
        )}

        {activeTab === 'earnings' && (
          <div className="view-fade-in earnings-portal-card">
            <h2>My Earnings Portal</h2>
            <p>Track your delivery payouts and real-time wallet balance metrics.</p>
            <div className="earnings-stats-grid">
              <div className="stat-box-neon">
                <small>Total Amount Withdrawn</small>
                <h3>₹450</h3>
                <span className="payout-subtext">Payout transfers instantly to verified bank account</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}