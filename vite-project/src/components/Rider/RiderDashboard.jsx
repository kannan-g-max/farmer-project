import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // navigate toggle framework match
import './RiderDashboard.css';

// 🔥 Prop-la onLogout catch pannunga macha
export default function RiderDashboard({ onLogout }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('available');
  const [deliveries, setDeliveries] = useState([
    {
      id: "DEL-9081",
      product: "Fresh Spinach (25kg)",
      farmer: "Kannan (Madurai)",
      buyer: "Ramesh (Anna Nagar)",
      payout: 120,
      status: "Pending"
    },
    {
      id: "DEL-4412",
      product: "Premium Mangoes (50kg)",
      farmer: "Muthu (Alanganallur)",
      buyer: "Hotel Sangam (Simmakkal)",
      payout: 280,
      status: "Pending"
    }
  ]);

  const [myEarnings] = useState(450);

  // 🔥 FIX LOGOUT LOGIC: Calling Parent handler directly
  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout(); // App.jsx ulla logout execute aagum (all memory cleared!)
    }
    navigate('/login'); // Redirects smoothly to Login page
  };

  const handleAcceptDelivery = (id) => {
    setDeliveries(prev => prev.filter(del => del.id !== id));
    alert(`Order ${id} Accepted! Pick up the crop from farmer location. 🏍️`);
  };

  return (
    <div className="user-dashboard-layout">
      <aside className="sidebar-nav-container">
        <h2>Farmer<span style={{ color: '#22c55e' }}>AGRI</span> <span style={{ fontSize: '12px', background: '#22c55e', color: '#121212', padding: '2px 6px', borderRadius: '4px', marginLeft: '5px' }}>RIDER</span></h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button 
            className={activeTab === 'available' ? 'active-tab' : ''} 
            onClick={() => setActiveTab('available')}
          >
            📦 Available Orders
          </button>
          <button 
            className={activeTab === 'earnings' ? 'active-tab' : ''} 
            onClick={() => setActiveTab('earnings')}
          >
            💰 My Earnings
          </button>
        </div>

        {/* 🔥 Connected proper clean click event handler link */}
        <button className="sidebar-logout-btn" onClick={handleLogoutClick}>
          🚪 Logout
        </button>
      </aside>

      {/* Main Panel Content Scroll Area */}
      <div className="feed-content-area" style={{ marginLeft: '280px', padding: '40px', flex: 1, height: '100vh', overflowY: 'auto', boxSizing: 'border-box' }}>
        
        {activeTab === 'available' && (
          <div style={{ width: '100%', maxWidth: '650px' }}>
            <header className="feed-top-bar" style={{ marginBottom: '30px', borderBottom: '1px solid #1a1a1a', paddingBottom: '15px' }}>
              <h2 style={{ fontSize: '26px', fontWeight: '800' }}>Available Gigs</h2>
              <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>Accept delivery jobs near your location</p>
            </header>

            <div className="rider-jobs-list">
              {deliveries.length === 0 ? (
                <p style={{ color: '#555', textAlign: 'center', marginTop: '40px' }}>No pending delivery orders available right now. 📭</p>
              ) : (
                deliveries.map(job => (
                  <div key={job.id} className="delivery-job-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', color: '#888', background: '#222', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>{job.id}</span>
                      <span style={{ color: '#22c55e', fontWeight: '800', fontSize: '18px' }}>+ ₹{job.payout}</span>
                    </div>

                    <div className="job-routing-timeline">
                      <div className="route-point">
                        <span className="point-label">📍 PICKUP FROM (FARMER)</span>
                        <span className="point-address">{job.farmer}</span>
                      </div>
                      <div className="route-point">
                        <span className="point-label">🏁 DROP TO (BUYER)</span>
                        <span className="point-address">{job.buyer}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #222', paddingTop: '15px', marginTop: '5px' }}>
                      <span style={{ fontSize: '14px', color: '#aaa' }}>🌾 Item: <strong style={{ color: '#fff' }}>{job.product}</strong></span>
                      <button className="buy-trigger-btn" style={{ width: 'auto', padding: '10px 20px' }} onClick={() => handleAcceptDelivery(job.id)}>Accept Job ➔</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'earnings' && (
          <div style={{ width: '100%', maxWidth: '650px' }}>
            <header className="feed-top-bar" style={{ marginBottom: '30px', borderBottom: '1px solid #1a1a1a', paddingBottom: '15px' }}>
              <h2 style={{ fontSize: '26px', fontWeight: '800' }}>My Earnings Portal</h2>
              <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>Track your delivery payouts and performances</p>
            </header>

            <div className="earnings-summary-box">
              <p>Total Amount Withdrawn</p>
              <h1>₹{myEarnings}</h1>
              <span className="payout-subtext">Payout transfers instantly to verified bank account</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}