import React, { useState } from 'react';
import './PostCreator.css';

const PostCreator = ({ onClose, onPublish }) => {
  const [preview, setPreview] = useState(null);
  const [details, setDetails] = useState({
    name: '',
    price: '',
    hours: '24' // Default-ah 1 day
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPost = {
      ...details,
      img: preview,
      time: details.hours,
      createdAt: new Date().toISOString()
    };
    onPublish(newPost);
    onClose();
  };

  return (
    <div className="creator-overlay">
      <div className="creator-card">
        <div className="creator-header">
          <button onClick={onClose}>Cancel</button>
          <h3>Create New Post</h3>
          <button className="share-btn" onClick={handleSubmit}>Share</button>
        </div>

        <div className="creator-body">
          {/* Image Preview / Upload Area */}
          <div className="image-drop-zone">
            {preview ? (
              <img src={preview} alt="preview" className="post-preview" />
            ) : (
              <label htmlFor="file-input" className="upload-placeholder">
                <div className="plus-icon">+</div>
                <p>Select Photos</p>
              </label>
            )}
            <input 
              id="file-input" 
              type="file" 
              accept="image/*" 
              hidden 
              onChange={handleImageChange} 
            />
          </div>

          {/* Form Fields */}
          <div className="form-fields">
            <textarea 
              placeholder="Write a caption... (e.g. Fresh Mangoes from my garden)"
              onChange={(e) => setDetails({...details, name: e.target.value})}
            />
            
            <div className="input-group">
              <label>Price per Unit (₹)</label>
              <input 
                type="number" 
                placeholder="Ex: 50"
                onChange={(e) => setDetails({...details, price: e.target.value})}
              />
            </div>

            <div className="input-group">
              <label>Auto-Delete After (Hours)</label>
              <select onChange={(e) => setDetails({...details, hours: e.target.value})}>
                <option value="6">6 Hours</option>
                <option value="12">12 Hours</option>
                <option value="24">24 Hours (1 Day)</option>
                <option value="48">48 Hours (2 Days)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCreator;