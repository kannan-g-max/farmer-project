import React from 'react';

import './Sidebar.css';

const Sidebar = ({ activeTab, setActiveTab, onLogout }) => {
  

  const handleLogoutClick = (e) => {
    if (e) e.preventDefault();
    console.log('Logout initiated from Sidebar');
    if (onLogout) {
      onLogout();
    } 
    localStorage.clear(); // Ensure complete localStorage wipe
    sessionStorage.clear(); // Clear session storage as well
    window.location.href = '/login'; // Force redirect to login page
  };

  return (
    <div className="user-sidebar">
      <h2 className="sidebar-brand">Farmer<span>AGRI</span></h2>
      
      <div className="sidebar-menu">
        <button 
          className={`menu-item ${activeTab === 'market' ? 'active' : ''}`}
          onClick={() => setActiveTab('market')}
        >
          🛒 Browse Market
        </button>
        
        <button 
          className={`menu-item ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          📦 My Orders
        </button>
        
        <button 
          className={`menu-item ${activeTab === 'cart' ? 'active' : ''}`}
          onClick={() => setActiveTab('cart')}
        >
          🛍️ Cart
        </button>
        
        <button 
          className={`menu-item ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          👤 My Profile
        </button>
      </div>

      {/* Logout Action Trigger */}
      <button className="logout-btn" onClick={handleLogoutClick}>
        🚪 Logout
      </button>
    </div>
  );
};

export default Sidebar;