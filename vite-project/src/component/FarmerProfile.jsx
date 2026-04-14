import React, { useState } from 'react';
import './FarmerProfile.css';
import PostCreator from './PostCreator';

const FarmerProfile = () => {
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Farmer Information
  const farmerData = {
    name: "Kannan T",
    id: "@kannan_agri_pro",
    location: "Madurai, Tamil Nadu",
    rating: "4.9 ⭐",
    followers: "1.2k"
  };

  return (
    <div className="profile-container">
      {/* Top Profile Section */}
      <header className="profile-header">
        <div className="profile-img-wrapper">
          <img src="https://via.placeholder.com/150" alt="Farmer" className="profile-pic" />
        </div>
        <div className="profile-info">
          <div className="user-id-row">
            <h2>{farmerData.id}</h2>
            <button className="edit-btn" onClick={() => setShowModal(true)}>New Post</button>
            <button className="settings-icon">⚙️</button>
          </div>
          <div className="stats-row">
            <span><strong>{posts.length}</strong> posts</span>
            <span><strong>{farmerData.followers}</strong> customers</span>
            <span><strong>{farmerData.rating}</strong> rating</span>
          </div>
          <div className="bio">
            <p className="farmer-name">{farmerData.name}</p>
            <p>📍 {farmerData.location}</p>
            <p>Fresh harvest delivered directly to your kitchen! 🍎🥦</p>
          </div>
        </div>
      </header>

      {/* Grid View of Posts */}
      <div className="post-grid">
        {posts.length === 0 ? (
          <div className="no-posts">
            <h3>No Live Harvests</h3>
            <p>Share your fresh produce to start selling.</p>
          </div>
        ) : (
          posts.map((post, i) => (
            <div key={i} className="post-item">
              <img src={post.img} alt="harvest" />
              <div className="post-overlay">
                <span>₹{post.price}</span>
                <span className="timer-badge">⌛ {post.time}h left</span>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <PostCreator 
          onClose={() => setShowModal(false)} 
          onPublish={(newPost) => setPosts([newPost, ...posts])}
        />
      )}
    </div>
  );
};

export default FarmerProfile;