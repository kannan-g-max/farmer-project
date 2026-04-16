import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './FarmerVerificationForm.css';

const FarmerVerificationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    landPattaNo: '',
    kisanCardNo: '',
    coopSocietyNo: ''
  });
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // URL Sync with your backend controller
      const response = await axios.post('http://localhost:8080/api/farmer/apply', formData);
      if (response.status === 200 || response.status === 201) {
        setIsSuccess(true);
      }
    } catch (error) {
      console.error("Error submitting form", error);
      alert("Backend connection failed!");
    }
  };

  return (
    <div className="verify-page-wrapper">
      <div className="bg-overlay"></div>
      
      <div className="verify-glass-card">
        <div className="verify-header">
          <h2>FARMER<span>PRO</span></h2>
          <p>Official Verification Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="verify-form">
          <div className="input-row">
            <div className="field">
              <label>Full Name</label>
              <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required />
            </div>
            <div className="field">
              <label>Phone Number</label>
              <input type="text" name="phone" placeholder="Phone Number" onChange={handleChange} required />
            </div>
          </div>

          <div className="field">
            <label>Location / Village</label>
            <input type="text" name="location" placeholder="Location / Village" onChange={handleChange} required />
          </div>

          <div className="field">
            <label>Land Patta Number</label>
            <input type="text" name="landPattaNo" placeholder="Land Patta Number" onChange={handleChange} required />
          </div>

          <div className="input-row">
            <div className="field">
              <label>Kisan Card No</label>
              <input type="text" name="kisanCardNo" placeholder="Kisan Card No" onChange={handleChange} required />
            </div>
            <div className="field">
              <label>Co-op Society No</label>
              <input type="text" name="coopSocietyNo" placeholder="Co-op Society No" onChange={handleChange} required />
            </div>
          </div>

          <button type="submit" className="submit-verify-btn">Request Verification</button>
        </form>

        {/* This container ensures no layout jump */}
        <div className="status-container">
          {isSuccess && (
            <div className="success-msg-box">
              <span>✅ Request Sent!</span>
              <p>Your details are saved. Admin will verify and generate your ID/Password.</p>
              <button className="back-btn-link" onClick={() => navigate('/')}>Back to Login</button>
            </div>
          )}
          {!isSuccess && (
             <p className="login-redirect" onClick={() => navigate('/')}>Already a member? Login</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FarmerVerificationForm;