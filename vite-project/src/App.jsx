import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import FarmerVerificationForm from './pages/Verification/FarmerVerificationForm';
import Sidebar from './shared/Sidebar/Sidebar';
import MarketFeed from './pages/MarketFeed/MarketFeed';
import FarmerProfile from './pages/FarmerProfile/FarmerProfile';
import Market from './components/Market/Market';
import CreatePost from './pages/CreatePost/CreatePost';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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