import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = ({ onLogin = () => {} }) => {
  const [role, setRole] = useState('farmer');
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (role === 'delivery') {
      navigate('/delivery-dashboard');
      return;
    }

    const endpoint = role === 'farmer' ? '/api/farmer/signin' : '/api/public/signin';
    const payload = role === 'farmer'
      ? { farmerId: credential, password }
      : { email: credential, password };

    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8080${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        alert(data.message || 'Invalid credentials!');
        return;
      }

      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      onLogin();
      if (role === 'farmer') navigate('/farmer-profile');
      else navigate('/market-feed');
    } catch (error) {
      console.error(error);
      alert('Backend Connection Failed!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      <div className="background-overlay"></div>
      
      <div className="login-glass-card">
        <div className="login-header">
          <h2>Farmer<span>AGRI</span></h2>
          <p>Fresh from farms to your shop</p>
        </div>

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
            <input
              type="text"
              placeholder={role === 'customer' ? 'Email' : `${role.charAt(0).toUpperCase() + role.slice(1)} ID`}
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              required
            />
          </div>

          <div className="input-field">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className={`login-btn ${role}`} disabled={isLoading}>
            {isLoading ? 'Please wait...' : `Login as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
          </button>
        </form>
        
        <div className="footer-links">
          <span>Forgot Password?</span>
          <span
            className="link"
            onClick={() => navigate('/farmer-verification')} 
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