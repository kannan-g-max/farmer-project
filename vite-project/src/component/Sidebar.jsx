import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ onLogout }) => {
  return (
    <aside className="sidebar-container">
      <div className="sidebar-logo">FarmerAGRI</div>
      
      <nav className="sidebar-nav">
        <NavLink to="/profile-feed" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <span className="nav-icon">🏠</span> Profile Feed
        </NavLink>

        <NavLink to="/market" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <span className="nav-icon">🔍</span> Market
        </NavLink>

        <NavLink to="/messages" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <span className="nav-icon">💬</span> Messages
        </NavLink>

        <NavLink to="/create" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <span className="nav-icon">➕</span> New Post
        </NavLink>

        <NavLink to="/farmer-profile" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <div className="mini-profile-pic">🧑‍🌾</div> Profile
        </NavLink>
      </nav>

      {/* Footer-la Logout mattum thaan irukkum */}
      <div className="sidebar-footer">
        <div className="nav-item logout-btn" onClick={onLogout}>
          <span className="nav-icon">🚪</span> Logout
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;