import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import FarmerVerificationForm from './component/FarmerVerificationForm';
import Sidebar from './component/Sidebar';
import MarketFeed from './component/MarketFeed'; 
import FarmerProfile from './component/FarmerProfile'; 
import Market from './component/Market';
import Chat from './component/Chat';
import CreatePost from './component/CreatePost';
import Login from './component/Login';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  const handleLogin = () => {
    localStorage.setItem('isLoggedIn', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="desktop-agri-dashboard">
        {/* Sidebar only shows when logged in */}
        {isAuthenticated && <Sidebar onLogout={handleLogout} />}

        <main className={isAuthenticated ? "dashboard-content" : "full-screen-auth"}>
          <Routes>
            {/* Login Route */}
            <Route path="/login" element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/profile-feed" />} />

            {/* FARMER VERIFICATION - Ippo ithu work aagum */}
            <Route path="/farmer-verification" element={<FarmerVerificationForm />} />

            {/* Auth Protected Routes */}
            <Route path="/" element={isAuthenticated ? <Navigate to="/profile-feed" /> : <Navigate to="/login" />} />
            <Route path="/profile-feed" element={isAuthenticated ? <MarketFeed /> : <Navigate to="/login" />} />
            <Route path="/market" element={isAuthenticated ? <Market /> : <Navigate to="/login" />} />
            <Route path="/messages" element={isAuthenticated ? <Chat /> : <Navigate to="/login" />} />
            <Route path="/create" element={isAuthenticated ? <CreatePost /> : <Navigate to="/login" />} />
            <Route path="/farmer-profile" element={isAuthenticated ? <FarmerProfile /> : <Navigate to="/login" />} />

            {/* Unknown path redirect */}
            <Route path="*" element={<Navigate to={isAuthenticated ? "/profile-feed" : "/login"} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;