import React from 'react';
// Routing logic-ku idhu kandippa venum
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; 

// Unga components folder-la irundhu correct-ah import pannunga
import Login from './component/Login';
import FarmerProfile from './component/FarmerProfile';
import FarmerVerificationForm from './component/FarmerVerificationForm';
import MarketFeed from './component/MarketFeed';

function App() {
  return (
    <Router>
      <div className="app-main-container">
        <Routes>
          {/* 1. Modhalla varra page - Login */}
          <Route path="/" element={<Login />} />

          {/* 2. New Farmer "Create Account" click panna pōra page */}
          <Route path="/register" element={<FarmerVerificationForm />} />

          {/* 3. Farmer Login panna udane pōra Instagram-style profile */}
          <Route path="/farmer-profile" element={<FarmerProfile />} />

          {/* 4. Public User (Customer) pōra market feed page */}
          <Route path="/market-feed" element={<MarketFeed />} />

          {/* Security: Thappa URL type panna automatic-ah login-ke kootitu pōgum */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;