import React, { useState, useEffect } from 'react';
import './MyProfile.css';

const MyProfile = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    id: null,
    email: '',
    name: '',
    phone: '',
    location: '',
    latitude: '',
    longitude: '',
    bio: '',
    profileImage: ''
  });

  const [editedName, setEditedName] = useState("");
  const [editedBio, setEditedBio] = useState("");
  const [editedPhone, setEditedPhone] = useState("");
  const [editedLocation, setEditedLocation] = useState("");
  const [editedLatitude, setEditedLatitude] = useState("");
  const [editedLongitude, setEditedLongitude] = useState("");

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = user.id;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/public/${userId}/profile`);
        if (response.ok) {
          const data = await response.json();
          setProfile(data);
          setEditedName(data.name || "");
          setEditedBio(data.bio || "");
          setEditedPhone(data.phone || "");
          setEditedLocation(data.location || "");
          setEditedLatitude(data.latitude || "");
          setEditedLongitude(data.longitude || "");
        }
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
      } finally {
        setLoading(false);
      }
    };
    if (userId) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [userId]);

  const saveProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/public/${userId}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: editedName,
          bio: editedBio,
          phone: editedPhone,
          location: editedLocation,
          latitude: editedLatitude ? Number(editedLatitude) : null,
          longitude: editedLongitude ? Number(editedLongitude) : null,
          profileImage: profile.profileImage
        })
      });

      if (response.ok) {
        const updated = await response.json();
        setProfile(updated);
        // Also update local storage 'user' info
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem('user', JSON.stringify({
          ...storedUser,
          name: updated.name
        }));
        setShowModal(false);
      } else {
        alert('Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Network error');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result;
      setProfile(prev => ({ ...prev, profileImage: base64Data }));
      
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8080/api/public/${userId}/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            name: editedName || profile.name,
            bio: editedBio || profile.bio,
            phone: editedPhone || profile.phone,
            location: editedLocation || profile.location,
            latitude: editedLatitude ? Number(editedLatitude) : (profile.latitude || null),
            longitude: editedLongitude ? Number(editedLongitude) : (profile.longitude || null),
            profileImage: base64Data
          })
        });
        if (!response.ok) {
          console.error('Failed to save profile picture to database');
        } else {
          const updated = await response.json();
          setProfile(updated);
        }
      } catch (err) {
        console.error('Error saving image:', err);
      }
    };
    reader.readAsDataURL(file);
  };

  if (loading) {
    return (
      <div className="profile-dashboard-wrapper">
        <p style={{ color: '#aaa', textAlign: 'center', marginTop: '50px' }}>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-dashboard-wrapper">
      
      {/* Upper Title Section */}
      <div className="profile-heading-bar">
        <h3>👤 {profile.name || 'User Profile'}</h3>
        <p>Manage your delivery details and spending insights</p>
      </div>

      {/* 💳 CARD 1: Identity Badge Layout Hero Element */}
      <div className="profile-identity-hero-card">
        <div className="profile-avatar-mainframe">
          {profile.profileImage ? (
            <img
              src={profile.profileImage}
              alt=""
              className="user-profile-img"
            />
          ) : (
            profile.name ? profile.name.charAt(0).toUpperCase() : "U"
          )}

          <button
            className="user-edit-btn"
            onClick={() => setShowModal(true)}
          >
            ✏️
          </button>
        </div>
        <div className="profile-meta-stack">
          <h4>{profile.name || 'Premium User'}</h4>
          <p
            style={{
              marginTop: "15px",
              color: "#22c55e",
              fontStyle: "italic"
            }}
          >
            {profile.bio || "No bio added yet"}
          </p>
          <div className="status-badge-row">
            <span className="badge-verified-customer">Verified Buyer</span>
            <span className="badge-location-tag">📍 {profile.location || 'Location pending'} {profile.latitude && profile.longitude ? `(${profile.latitude}, ${profile.longitude})` : ''}</span>
          </div>
        </div>
      </div>

      {/* 📊 CARD 2: Insights Metrics */}
      <div className="profile-analytics-grid-row">
        <div className="metric-box-card gloss-tint-green">
          <p className="metric-lbl">Total Spent Amount</p>
          <h2 className="metric-val-neon">₹3,420</h2>
          <span className="metric-subtext">Direct to Local Farmers</span>
        </div>
        <div className="metric-box-card gloss-tint-white">
          <p className="metric-lbl">Orders Placed</p>
          <h2 className="metric-val-white">02 Active</h2>
          <span className="metric-subtext">In-Transit Deliveries</span>
        </div>
      </div>

      {/* ⚙️ CARD 3: Personal Credentials */}
      <div className="profile-details-sheet-card">
        <h5 className="section-subtitle-txt">Personal Credentials</h5>
        
        <div className="info-field-row-item">
          <label className="field-lbl">Registered Email</label>
          <div className="field-val-container">
            <span className="field-value-txt">{profile.email}</span>
          </div>
        </div>

        <div className="info-field-row-item">
          <label className="field-lbl">Contact Phone</label>
          <div className="field-val-container">
            <span className="field-value-txt">{profile.phone || 'No phone added yet'}</span>
          </div>
        </div>

        <div className="info-field-row-item stretch-column">
          <label className="field-lbl">Primary Delivery Address</label>
          <div className="field-val-container text-area-box">
            <p className="field-value-txt address-para">{profile.location || 'No address added yet.'}</p>
          </div>
        </div>

        {/* Edit Action Button */}
        <button className="profile-update-action-btn" onClick={() => setShowModal(true)}>
          ⚙️ Edit Profile Settings
        </button>
      </div>

      {showModal && (
        <div className="edit-modal">
          <div className="edit-modal-content">
            <h2>Edit Profile</h2>

            <button
              className="upload-btn"
              onClick={() => document.getElementById("userImageInput").click()}
            >
              📷 Change Profile Photo
            </button>

            <input
              type="file"
              id="userImageInput"
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleImageUpload}
            />

            <label style={{ alignSelf: 'flex-start', fontSize: '12px', color: '#888', marginBottom: '4px' }}>Username</label>
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              placeholder="Username"
              className="edit-input"
            />

            <label style={{ alignSelf: 'flex-start', fontSize: '12px', color: '#888', marginBottom: '4px' }}>Bio</label>
            <textarea
              value={editedBio}
              onChange={(e) => setEditedBio(e.target.value)}
              placeholder="Bio"
              className="edit-bio"
            />

            <label style={{ alignSelf: 'flex-start', fontSize: '12px', color: '#888', marginBottom: '4px' }}>Phone Number</label>
            <input
              type="text"
              value={editedPhone}
              onChange={(e) => setEditedPhone(e.target.value)}
              placeholder="Phone Number"
              className="edit-input"
            />

            <label style={{ alignSelf: 'flex-start', fontSize: '12px', color: '#888', marginBottom: '4px' }}>Delivery Address</label>
            <input
              type="text"
              value={editedLocation}
              onChange={(e) => setEditedLocation(e.target.value)}
              placeholder="Delivery Address"
              className="edit-input"
            />

            <label style={{ alignSelf: 'flex-start', fontSize: '12px', color: '#888', marginBottom: '4px' }}>Latitude</label>
            <input
              type="number"
              step="any"
              value={editedLatitude}
              onChange={(e) => setEditedLatitude(e.target.value)}
              placeholder="Latitude"
              className="edit-input"
            />

            <label style={{ alignSelf: 'flex-start', fontSize: '12px', color: '#888', marginBottom: '4px' }}>Longitude</label>
            <input
              type="number"
              step="any"
              value={editedLongitude}
              onChange={(e) => setEditedLongitude(e.target.value)}
              placeholder="Longitude"
              className="edit-input"
            />

            <button
              className="save-btn"
              onClick={saveProfile}
            >
              Save Changes
            </button>

            <button
              className="cancel-btn"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProfile;