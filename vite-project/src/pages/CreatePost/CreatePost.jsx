import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreatePost.css';

const CreatePost = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImg, setSelectedImg] = useState(null);
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = React.useRef(null);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setSelectedImg(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert('Please select an image');
      return;
    }
    if (!productName.trim()) {
      alert('Please enter product name');
      return;
    }
    if (!price.trim() || isNaN(price)) {
      alert('Please enter valid price');
      return;
    }
    if (!description.trim()) {
      alert('Please add description');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('name', productName);
      formData.append('price', parseFloat(price));
      formData.append('description', description);

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/products/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        alert('Product posted successfully!');
        navigate('/profile-feed');
      } else {
        alert(data.message || 'Failed to upload product');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setSelectedImg(null);
    setProductName('');
    setPrice('');
    setDescription('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="create-post-container">
      <div className="post-modal">
        <div className="modal-header">
          <h3>Create new post</h3>
          <button className="close-btn" onClick={() => navigate('/profile-feed')}>✕</button>
        </div>

        <div className="modal-content">
          {!selectedImg ? (
            <div className="upload-area">
              <div className="upload-icon">📁</div>
              <p>Select a product photo</p>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                hidden 
                accept="image/*" 
              />
              <label onClick={() => fileInputRef.current?.click()} className="action-btn">
                Select from computer
              </label>
            </div>
          ) : (
            <div className="preview-area">
              <img src={selectedImg} alt="Preview" className="post-preview" />
              
              <div className="form-group">
                <input 
                  type="text" 
                  placeholder="Product name*" 
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="product-input"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <input 
                  type="number" 
                  placeholder="Price (₹)*" 
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="product-input"
                  disabled={loading}
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <textarea 
                  placeholder="Product description*" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="caption-input"
                  disabled={loading}
                ></textarea>
              </div>
            </div>
          )}
        </div>

        {selectedImg && (
          <div className="modal-footer">
            <button className="cancel-btn" onClick={handleReset} disabled={loading}>Change Image</button>
            <button className="share-btn" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Uploading...' : 'Share'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePost;
