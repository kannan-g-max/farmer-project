import React from 'react';

const FarmerVerificationForm = ({ handleChange, handleSubmit, setShowVerification }) => {
  return (
    <div className="verification-overlay">
      <div className="verification-box">
        <h2>Farmer Verification</h2>
        <p>Please provide authentic details for approval</p>
        
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required />
          <input type="text" name="phone" placeholder="Phone Number" onChange={handleChange} required />
          <input type="text" name="location" placeholder="Village / Location" onChange={handleChange} required />
          <input type="text" name="landPattaNo" placeholder="Land Patta Number" onChange={handleChange} required />
          <input type="text" name="kisanCardNo" placeholder="Kisan Credit Card Number" onChange={handleChange} required />
          <input type="text" name="coopSocietyNo" placeholder="Co-operative Society No" onChange={handleChange} required />

          <div className="btn-group">
            <button type="submit" className="submit-btn">Verify & Save</button>
            <button type="button" className="cancel-btn" onClick={() => setShowVerification(false)}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FarmerVerificationForm;