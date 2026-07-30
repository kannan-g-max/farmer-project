import React, { useState, useEffect } from 'react';
import './FarmerProfile.css';

const FarmerProfile = () => {
  const [profile, setProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedBio, setEditedBio] = useState("");
  const [editedLocation, setEditedLocation] = useState("");
  const [editedLatitude, setEditedLatitude] = useState("");
  const [editedLongitude, setEditedLongitude] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);

  // Product Edit Modal States
  const [editingProduct, setEditingProduct] = useState(null);
  const [editProdName, setEditProdName] = useState('');
  const [editProdQty, setEditProdQty] = useState('');
  const [editProdUnit, setEditProdUnit] = useState('kg');
  const [editProdPrice, setEditProdPrice] = useState('');
  const [editProdCategory, setEditProdCategory] = useState('Vegetables');
  const [editProdDesc, setEditProdDesc] = useState('');

  const handleStartEdit = (product) => {
    setEditingProduct(product);
    setEditProdName(product.name || '');
    setEditProdQty(String(product.quantity ?? ''));
    setEditProdUnit(product.unit || 'kg');
    setEditProdPrice(String(product.price ?? ''));
    setEditProdCategory(product.category || 'Others');
    setEditProdDesc(product.description || '');
    setOpenMenu(null);
  };

  const handleSaveProductEdit = async () => {
    if (!editProdName.trim()) {
      alert('Please enter product name');
      return;
    }
    if (!editProdPrice.trim() || isNaN(editProdPrice) || Number(editProdPrice) <= 0) {
      alert('Please enter valid price (greater than 0)');
      return;
    }
    if (!editProdQty.trim() || isNaN(editProdQty) || Number(editProdQty) <= 0) {
      alert('Please enter valid quantity (greater than 0)');
      return;
    }
    if (!editProdDesc.trim()) {
      alert('Please enter description');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const qs = new URLSearchParams({
        name: editProdName.trim(),
        quantity: String(Number(editProdQty) || 0),
        unit: editProdUnit,
        price: String(Number(editProdPrice) || 0),
        category: editProdCategory,
        description: editProdDesc.trim()
      });

      const response = await fetch(`http://localhost:8080/api/products/${editingProduct.id}?${qs.toString()}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const updated = await response.json();
        setProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...updated } : p));
        const ts = String(Date.now());
        localStorage.setItem('products_last_updated', ts);
        window.dispatchEvent(new Event('products-updated'));
        setEditingProduct(null);
      } else {
        alert('Failed to update product');
      }
    } catch (err) {
      console.error('Error updating product:', err);
      alert('Error updating product');
    }
  };

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:8080/api/farmer/${user.id}/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setEditedName(data.name || "");
        setEditedBio(data.bio || "");
        setEditedLocation(data.location || "");
        setEditedLatitude(data.latitude || "");
        setEditedLongitude(data.longitude || "");
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:8080/api/farmer/${user.id}/products`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setProducts(
          data.map((p) => ({
            ...p,
            inStock: p.inStock !== undefined ? p.inStock : true,
          }))
        );
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await Promise.all([fetchProfile(), fetchProducts()]);
      setLoading(false);
    };
    if (user.id) {
      loadAll();
    } else {
      setLoading(false);
    }
  }, []);

  const saveProfile = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:8080/api/farmer/${user.id}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: editedName,
          bio: editedBio,
          location: editedLocation,
          latitude: editedLatitude ? Number(editedLatitude) : null,
          longitude: editedLongitude ? Number(editedLongitude) : null,
          profileImage: profile?.profileImage || '',
          coverImage: profile?.coverImage || ''
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
      console.error('Error saving profile:', err);
      alert('Network error');
    }
  };

  const handleSaveBio = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:8080/api/farmer/${user.id}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: profile?.name || '',
          bio: editedBio,
          location: profile?.location || '',
          profileImage: profile?.profileImage || '',
          coverImage: profile?.coverImage || ''
        })
      });
      if (response.ok) {
        const updated = await response.json();
        setProfile(updated);
        setEditing(false);
      } else {
        alert('Failed to update bio');
      }
    } catch (err) {
      console.error('Error updating bio:', err);
      alert('Network error');
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result;
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`http://localhost:8080/api/farmer/${user.id}/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            name: profile?.name || '',
            bio: profile?.bio || '',
            location: profile?.location || '',
            profileImage: base64Data,
            coverImage: profile?.coverImage || ''
          })
        });
        if (response.ok) {
          const updated = await response.json();
          setProfile(updated);
        }
      } catch (err) {
        console.error('Error uploading profile picture:', err);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCoverUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result;
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`http://localhost:8080/api/farmer/${user.id}/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            name: profile?.name || '',
            bio: profile?.bio || '',
            location: profile?.location || '',
            profileImage: profile?.profileImage || '',
            coverImage: base64Data
          })
        });
        if (response.ok) {
          const updated = await response.json();
          setProfile(updated);
        }
      } catch (err) {
        console.error('Error uploading cover picture:', err);
      }
    };
    reader.readAsDataURL(file);
  };

  const getProductName = (product) => product.name || 'Untitled product';
  const getProductImage = (product) => product.imageUrl || '';
  const getProductPrice = (product) => product.price ?? '';
  const getProductUnit = (product) => product.unit || 'kg';
  const getProductCategory = (product) => product.category || 'Others';

  if (loading) {
    return (
      <div className="profile-container">
        <p>Loading profile...</p>
      </div>
    );
  }

  const farmerLevel =
    products.length >= 20
      ? '🏆 Gold Farmer'
      : products.length >= 10
        ? '🥈 Silver Farmer'
        : '🌱 New Farmer';

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="cover-banner">
          <img
            src={
              profile?.coverImage ||
              "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=2000&q=100"
            }
            alt=""
            className="cover-image"
          />

          <button
            className="cover-edit-btn"
            onClick={() => document.getElementById("coverImageInput").click()}
          >
            📷
          </button>

          <input
            type="file"
            id="coverImageInput"
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleCoverUpload}
          />
        </div>

        <header className="profile-hero">
          <div className="avatar-section">
            <img
              src={
                profile?.profileImage ||
                "https://ui-avatars.com/api/?name=Farmer&background=4CAF50&color=fff"
              }
              alt=""
              className="profile-avatar"
            />

            <button
              className="edit-dp-btn"
              onClick={() => setShowModal(true)}
            >
              ✏️
            </button>

            <input
              type="file"
              id="profileImageInput"
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>

          <section className="profile-info">
            <div className="profile-header-top">
              <h2 className="farmer-name">
                {profile?.name || user.farmerId}
              </h2>

              <p className="farmer-id">
                🚜 {user.farmerId}
              </p>
            </div>

            <div className="farmer-level">
              {farmerLevel}
            </div>

            <div className="dashboard-cards">
              <div className="dashboard-card">
                <h2>₹{products.length * 500}</h2>
                <p>Total Revenue</p>
              </div>

              <div className="dashboard-card">
                <h2>{products.length * 3}</h2>
                <p>Total Orders</p>
              </div>

              <div className="dashboard-card">
                <h2>⭐4.8</h2>
                <p>Farmer Rating</p>
              </div>
            </div>

            <div className="stats-row">
              <div className="stat">
                <strong>{products.length}</strong>
                <span>Products</span>
              </div>

              <div className="stat">
                <strong>{profile?.totalSales || 0}</strong>
                <span>Sales</span>
              </div>

              <div className="stat">
                <strong>{profile?.rating || 0}</strong>
                <span>Rating</span>
              </div>

              <div className="stat">
                <strong>{products.length * 3}</strong>
                <span>Orders</span>
              </div>
            </div>

            <div className="profile-bio">
              <p>📍 {profile?.location || 'Location pending'} {profile?.latitude && profile?.longitude ? `(${profile.latitude}, ${profile.longitude})` : ''}</p>

              <div className="bio-text">
                {editing ? (
                  <textarea
                    value={editedBio}
                    onChange={(e) => setEditedBio(e.target.value)}
                    className="edit-bio"
                  />
                ) : (
                  profile?.bio || "Welcome to my farm!"
                )}
              </div>

              {editing ? (
                <button
                  className="save-btn"
                  onClick={handleSaveBio}
                >
                  Save Changes
                </button>
              ) : (
                <button
                  className="save-btn"
                  onClick={() => {
                    setEditedBio(profile?.bio || "");
                    setEditing(true);
                  }}
                  style={{ background: '#333', color: '#fff', marginTop: '10px' }}
                >
                  ✏️ Edit Bio
                </button>
              )}
            </div>
          </section>
        </header>

        <hr className="divider" />

        <div className="products-section">
          <h3>My Products</h3>

          {products.length === 0 ? (
            <p className="no-products">
              No products yet. Start by creating a post!
            </p>
          ) : (
            <div className="products-grid">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="product-card"
                  style={{ position: "relative" }}
                >
                  {getProductImage(product) && (
                    <img
                      src={getProductImage(product)}
                      alt={getProductName(product)}
                    />
                  )}
                  <span className="top-seller-badge">
                    🔥 Top Seller
                  </span>
                  <p className="product-name">
                    {getProductName(product)}
                  </p>

                  <p className="product-price">
                    ₹{getProductPrice(product)} / {getProductUnit(product)}
                  </p>
                  <p className="product-category">
                    📦 {product.quantity} {getProductUnit(product)} | {getProductCategory(product)}
                  </p>
                  <p className="likes-count">
                    ❤️ {((product.id * 17) % 180) + 20} Likes
                  </p>

                  <button
                    className="stock-btn"
                    onClick={async () => {
                      const token = localStorage.getItem('token');
                      const nextStatus = product.inStock === false;
                      try {
                        const response = await fetch(`http://localhost:8080/api/products/${product.id}/stock?inStock=${nextStatus}`, {
                          method: 'PUT',
                          headers: {
                            'Authorization': `Bearer ${token}`
                          }
                        });
                        if (response.ok) {
                          const updated = await response.json();
                          setProducts(products.map(p => p.id === product.id ? { ...p, inStock: updated.inStock } : p));
                          const ts = String(Date.now());
                          localStorage.setItem('products_last_updated', ts);
                          window.dispatchEvent(new Event('products-updated'));
                        } else {
                          alert('Failed to update stock status');
                        }
                      } catch (err) {
                        console.error('Error updating stock:', err);
                      }
                    }}
                  >
                    {product.inStock === false
                      ? "🔴 Out Of Stock"
                      : "🟢 Available"}
                  </button>

                  <div className="post-menu">
                    <button
                      className="menu-btn"
                      onClick={() =>
                        setOpenMenu(
                          openMenu === product.id ? null : product.id
                        )
                      }
                    >
                      ⋮
                    </button>
                    {openMenu === product.id && (
                      <div className="dropdown-menu">
                        <button
                          className="dropdown-item"
                          onClick={() => handleStartEdit(product)}
                        >
                          ✏️ Edit
                        </button>

                        <button
                          className="dropdown-item delete"
                          onClick={async () => {
                            if (window.confirm("Delete this post?")) {
                              const token = localStorage.getItem('token');
                              try {
                                const response = await fetch(`http://localhost:8080/api/products/${product.id}`, {
                                  method: 'DELETE',
                                  headers: {
                                    'Authorization': `Bearer ${token}`
                                  }
                                });
                                if (response.ok) {
                                  setProducts(products.filter(p => p.id !== product.id));
                                  const ts = String(Date.now());
                                  localStorage.setItem('products_last_updated', ts);
                                  window.dispatchEvent(new Event('products-updated'));
                                } else {
                                  alert('Failed to delete product');
                                }
                              } catch (err) {
                                console.error('Error deleting product:', err);
                              }
                            }
                            setOpenMenu(null);
                          }}
                        >
                          🗑 Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="edit-modal">
          <div className="edit-modal-content">
            <h2>Edit Profile</h2>

            <button
              className="upload-btn"
              onClick={() => document.getElementById("profileImageInput").click()}
            >
              📷 Change Profile Photo
            </button>

            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              placeholder="Username"
              className="edit-input"
            />

            <textarea
              value={editedBio}
              onChange={(e) => setEditedBio(e.target.value)}
              placeholder="Bio"
              className="edit-bio"
            />

            <input
              type="text"
              value={editedLocation}
              onChange={(e) => setEditedLocation(e.target.value)}
              placeholder="Location Address"
              className="edit-input"
            />

            <input
              type="number"
              step="any"
              value={editedLatitude}
              onChange={(e) => setEditedLatitude(e.target.value)}
              placeholder="Latitude"
              className="edit-input"
            />

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

      {editingProduct && (
        <div className="edit-modal">
          <div className="edit-modal-content" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <h2>Edit Product</h2>

            <div className="form-group" style={{ width: '100%', marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: '#aaa', textAlign: 'left' }}>Product Name*</label>
              <input
                type="text"
                value={editProdName}
                onChange={(e) => setEditProdName(e.target.value)}
                placeholder="Product name"
                className="edit-input"
                style={{ width: '100%', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: '10px', marginBottom: '15px' }}>
              <div className="form-group" style={{ textAlign: 'left' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: '#aaa' }}>Quantity*</label>
                <input
                  type="number"
                  step="any"
                  value={editProdQty}
                  onChange={(e) => setEditProdQty(e.target.value)}
                  placeholder="Quantity"
                  className="edit-input"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                />
              </div>
              <div className="form-group" style={{ textAlign: 'left' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: '#aaa' }}>Unit*</label>
                <select
                  value={editProdUnit}
                  onChange={(e) => setEditProdUnit(e.target.value)}
                  className="edit-input"
                  style={{ width: '100%', height: '42px', boxSizing: 'border-box', background: '#1c1c1e', color: '#fff', border: '1px solid #333' }}
                >
                  <option value="kg">kg</option>
                  <option value="piece">piece</option>
                  <option value="liter">liter</option>
                  <option value="pack">pack</option>
                </select>
              </div>
            </div>

            <div className="form-group" style={{ width: '100%', marginBottom: '15px', textAlign: 'left' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: '#aaa' }}>Price per Unit (₹)*</label>
              <input
                type="number"
                step="any"
                value={editProdPrice}
                onChange={(e) => setEditProdPrice(e.target.value)}
                placeholder="Price"
                className="edit-input"
                style={{ width: '100%', boxSizing: 'border-box' }}
              />
            </div>

            <div className="form-group" style={{ width: '100%', marginBottom: '15px', textAlign: 'left' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: '#aaa' }}>Category*</label>
              <select
                value={editProdCategory}
                onChange={(e) => setEditProdCategory(e.target.value)}
                className="edit-input"
                style={{ width: '100%', height: '42px', boxSizing: 'border-box', background: '#1c1c1e', color: '#fff', border: '1px solid #333' }}
              >
                <option value="Vegetables">Vegetables</option>
                <option value="Fruits">Fruits</option>
                <option value="Others">Others</option>
              </select>
            </div>

            <div className="form-group" style={{ width: '100%', marginBottom: '15px', textAlign: 'left' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: '#aaa' }}>Product Description*</label>
              <textarea
                value={editProdDesc}
                onChange={(e) => setEditProdDesc(e.target.value)}
                placeholder="Description"
                className="edit-bio"
                style={{ width: '100%', boxSizing: 'border-box' }}
              />
            </div>

            <button
              className="save-btn"
              onClick={handleSaveProductEdit}
            >
              Save Product
            </button>

            <button
              className="cancel-btn"
              onClick={() => setEditingProduct(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerProfile;