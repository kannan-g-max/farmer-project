import React, { useState } from 'react';
import farmerBg from '../assets/farmer-bg.jpg';
import './Login.css';
import FarmerVerificationForm from './FarmerVerificationForm';

function FarmerLoginPage({ onSwitchToPublic }) {
  const [showVerification, setShowVerification] = useState(false);
  const [farmerData, setFarmerData] = useState({
    name: '',
    phone: '',
    location: '',
    landPattaNo: '',
    kisanCardNo: '',
    coopSocietyNo: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFarmerData({ ...farmerData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/farmer/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(farmerData)
      });
      if (response.ok) {
        alert('Success! Details Saved in Database.');
        setShowVerification(false);
      } else {
        alert('Failed to save details!');
      }
    } catch (error) {
      console.error(error);
      alert('Backend Connection Failed!');
    }
  };

  return (
    <div
      className="app-container"
      style={{
        backgroundImage: `url(${farmerBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {!showVerification ? (
        <div className="login-card">
          <h1>Farmer Environment</h1>

          <div className="tabs">
            <button className="tab-btn active">Farmer Login</button>
            <button className="tab-btn" onClick={onSwitchToPublic}>
              Public Login
            </button>
          </div>

          <input type="text" placeholder="Farmer ID" className="modern-input" />
          <input type="password" placeholder="Password" className="modern-input" />

          <button className="login-btn-main">Login</button>

          <p style={{ marginTop: '20px', color: '#ccc' }}>
            New Farmer?
            <span
              className="request-link"
              onClick={() => setShowVerification(true)}
              style={{ color: '#28a745', cursor: 'pointer', fontWeight: 'bold', marginLeft: '5px' }}
            >
              Request Verification
            </span>
          </p>
        </div>
      ) : (
        <FarmerVerificationForm
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          setShowVerification={setShowVerification}
          bgImage={farmerBg}
        />
      )}
    </div>
  );
}

export default FarmerLoginPage;
