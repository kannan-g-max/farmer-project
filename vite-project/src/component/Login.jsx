import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [role, setRole] = useState('farmer'); 
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (role === 'farmer') navigate('/farmer-profile');
    else if (role === 'customer') navigate('/market-feed');
    else if (role === 'delivery') navigate('/delivery-dashboard');
  };

  return (
    <div className="login-page-container">
      {/* Background Image Overlay */}
      <div className="background-overlay"></div>
      
      <div className="login-glass-card">
        <div className="login-header">
          <h2>Farmer<span>AGRI</span></h2>
          <p>Fresh from farms to your home</p>
        </div>

        {/* Role Selection Tabs */}
        <div className="role-selector">
          <button 
            className={role === 'farmer' ? 'active' : ''} 
            onClick={() => setRole('farmer')}
          >🚜 Farmer</button>
          <button 
            className={role === 'customer' ? 'active' : ''} 
            onClick={() => setRole('customer')}
          >🛒 User</button>
          <button 
            className={role === 'delivery' ? 'active' : ''} 
            onClick={() => setRole('delivery')}
          >🚀 Rider</button>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-field">
            <input type="text" placeholder={`${role.charAt(0).toUpperCase() + role.slice(1)} ID`} required />
          </div>

          <div className="input-field">
            <input type="password" placeholder="Password" required />
          </div>

          <button type="submit" className={`login-btn ${role}`}>
            Login as {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        </form>
        
        <div className="footer-links">
          <span>Forgot Password?</span>
          <span
            className="link"
            onClick={() => navigate('/register')} // Idhu dhaan unga Verification Form-ku kootitu pogum
            style={{ cursor: 'pointer', color: '#22c55e', fontWeight: 'bold' }}
          >
            Create Account
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;