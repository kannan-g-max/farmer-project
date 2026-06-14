<<<<<<< HEAD
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
=======
import React from 'react';
// Routing logic-ku idhu kandippa venum
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; 

// Unga components folder-la irundhu correct-ah import pannunga
import Login from './component/Login';
import FarmerProfile from './component/FarmerProfile';
import FarmerVerificationForm from './component/FarmerVerificationForm';
import MarketFeed from './component/MarketFeed';
import RiderDashboard from './component/RiderDashboard'; // ✅ ADDED ONLY THIS
>>>>>>> fc10e8edb75a808efc78d17c51667b1e95cf2332

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

<<<<<<< HEAD
            {/* Unknown path redirect */}
            <Route path="*" element={<Navigate to={isAuthenticated ? "/profile-feed" : "/login"} />} />
          </Routes>
        </main>
=======
          {/* ✅ RIDER ROUTE (ONLY ADDITION) */}
          <Route path="/delivery-dashboard" element={<RiderDashboard />} />

          {/* Security: Thappa URL type panna automatic-ah login-ke kootitu pōgum */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
>>>>>>> fc10e8edb75a808efc78d17c51667b1e95cf2332
      </div>
    </Router>
  );
}

export default App;