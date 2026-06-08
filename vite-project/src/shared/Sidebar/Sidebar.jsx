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

        <a href="tel:+911234567890" className="nav-item">
          <span className="nav-icon">📞</span> Call
        </a>

        <a href="https://wa.me/911234567890" target="_blank" rel="noreferrer" className="nav-item">
          <span className="nav-icon">🟢</span> WhatsApp
        </a>

        <NavLink to="/create" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <span className="nav-icon">➕</span> New Post
        </NavLink>

        <NavLink to="/farmer-profile" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <div className="mini-profile-pic">🧑‍🌾</div> Profile
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="nav-item logout-btn" onClick={onLogout}>
          <span className="nav-icon">🚪</span> Logout
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
