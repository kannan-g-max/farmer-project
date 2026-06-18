import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import FarmerVerificationForm from './pages/Verification/FarmerVerificationForm';
import Sidebar from './shared/Sidebar/Sidebar';
import FarmerMarketFeed from './pages/MarketFeed/MarketFeed';
import FarmerProfile from './pages/FarmerProfile/FarmerProfile';
import Market from './components/Market/Market';
import CreatePost from './pages/CreatePost/CreatePost';
import RiderDashboard from './components/Rider/RiderDashboard';
import PublicMarketFeed from './components/User/MarketFeed';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
  const [authRole, setAuthRole] = useState(() => localStorage.getItem('authRole') || '');

  const normalizedRole = authRole.toUpperCase();
  const isFarmer = normalizedRole === 'FARMER' || normalizedRole === '';
  const isPublicUser = normalizedRole === 'PUBLIC';
  const isDeliveryUser = normalizedRole === 'DELIVERY';

  const homeRoute = isPublicUser
    ? '/market-feed'
    : isDeliveryUser
      ? '/delivery-dashboard'
      : '/profile-feed';

  const handleLogin = (role = '') => {
    localStorage.setItem('isLoggedIn', 'true');
    if (role) {
      localStorage.setItem('authRole', role);
      setAuthRole(role);
    }
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('authRole');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setAuthRole('');
  };

  return (
    <Router>
      <div className="desktop-agri-dashboard">
        {isAuthenticated && isFarmer && <Sidebar onLogout={handleLogout} />}

        <main className={isAuthenticated && isFarmer ? "dashboard-content" : "full-screen-auth"}>
          <Routes>
            <Route path="/login" element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to={homeRoute} />} />

            <Route path="/farmer-verification" element={<FarmerVerificationForm />} />
            <Route path="/register" element={<Navigate to="/farmer-verification" />} />

            <Route path="/" element={isAuthenticated ? <Navigate to={homeRoute} /> : <Navigate to="/login" />} />
            <Route path="/profile-feed" element={isAuthenticated && isFarmer ? <FarmerMarketFeed /> : <Navigate to={isAuthenticated ? homeRoute : '/login'} />} />
            <Route path="/market-feed" element={isAuthenticated && isPublicUser ? <PublicMarketFeed /> : <Navigate to={isAuthenticated ? homeRoute : '/login'} />} />
            <Route path="/market" element={isAuthenticated && isFarmer ? <Market /> : <Navigate to={isAuthenticated ? homeRoute : '/login'} />} />
            <Route path="/create" element={isAuthenticated && isFarmer ? <CreatePost /> : <Navigate to={isAuthenticated ? homeRoute : '/login'} />} />
            <Route path="/farmer-profile" element={isAuthenticated && isFarmer ? <FarmerProfile /> : <Navigate to={isAuthenticated ? homeRoute : '/login'} />} />
            <Route path="/delivery-dashboard" element={isAuthenticated && isDeliveryUser ? <RiderDashboard /> : <Navigate to={isAuthenticated ? homeRoute : '/login'} />} />

            <Route path="*" element={<Navigate to={isAuthenticated ? homeRoute : '/login'} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;