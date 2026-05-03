import React, { useState } from 'react';
import './CreatePost.css';

const CreatePost = () => {
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImg(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <div className="create-post-overlay">
      <div className="post-modal">
        <div className="modal-header">
          <h3>Create new post</h3>
          {selectedImg && <button className="share-btn">Share</button>}
        </div>
        
        <div className="modal-content">
          {!selectedImg ? (
            <div className="upload-area">
              <div className="upload-icon">📁</div>
              <p>Select photos and videos here</p>
              <input type="file" id="fileInput" onChange={handleImageChange} hidden />
              <label htmlFor="fileInput" className="action-btn">Select from computer</label>
            </div>
          ) : (
            <div className="preview-area">
              <img src={selectedImg} alt="Preview" className="post-preview" />
              <textarea placeholder="Write a caption about your harvest..." className="caption-input"></textarea>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePost;