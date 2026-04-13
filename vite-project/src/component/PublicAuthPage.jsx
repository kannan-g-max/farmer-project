import React, { useState } from 'react';
import publicBg from '../assets/public bg.png';
import './Login.css';

function PublicAuthPage({ onSwitchToFarmer }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSignUp && formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const endpoint = isSignUp ? '/api/public/signup' : '/api/public/signin';
    const payload = isSignUp
      ? { name: formData.name, email: formData.email, phone: formData.phone, password: formData.password }
      : { email: formData.email, password: formData.password };

    try {
      const response = await fetch(`http://localhost:8080${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert(isSignUp ? 'Account created successfully! Please sign in.' : 'Login Successful!');
        if (isSignUp) setIsSignUp(false);
        setFormData({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
      } else {
        alert(isSignUp ? 'Failed to create account!' : 'Invalid credentials!');
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
        backgroundImage: `url(${publicBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="login-card">
        <h1>Public Portal - {isSignUp ? 'Sign Up' : 'Sign In'}</h1>

        <div className="tabs">
          <button className="tab-btn" onClick={onSwitchToFarmer}>
            Farmer Login
          </button>
          <button className="tab-btn active">Public Login</button>
        </div>

        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                className="modern-input"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                className="modern-input"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="modern-input"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="modern-input"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {isSignUp && (
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className="modern-input"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          )}

          <button type="submit" className="login-btn-main">
            {isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <p style={{ marginTop: '20px', color: '#ccc' }}>
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          <span
            onClick={() => setIsSignUp(!isSignUp)}
            style={{ color: '#28a745', cursor: 'pointer', fontWeight: 'bold', marginLeft: '5px' }}
          >
            {isSignUp ? 'Sign In' : 'Sign up'}
          </span>
        </p>
      </div>
    </div>
  );
}

export default PublicAuthPage;
