import React, { useState } from 'react';
import FarmerLoginPage from './FarmerLoginPage';
import PublicAuthPage from './PublicAuthPage';

function Login() {
  const [currentPage, setCurrentPage] = useState('farmer');

  const handleSwitchToFarmer = () => setCurrentPage('farmer');
  const handleSwitchToPublic = () => setCurrentPage('publicAuth');

  return (
    <>
      {currentPage === 'farmer' && (
        <FarmerLoginPage onSwitchToPublic={handleSwitchToPublic} />
      )}
      {currentPage === 'publicAuth' && (
        <PublicAuthPage onSwitchToFarmer={handleSwitchToFarmer} />
      )}
    </>
  );
}

export default Login;