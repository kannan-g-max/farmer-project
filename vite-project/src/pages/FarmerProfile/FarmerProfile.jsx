import React, { useState, useEffect } from 'react';
import './FarmerProfile.css';

const FarmerProfile = () => {
  const [profile, setProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedBio, setEditedBio] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);

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
          location: profile?.location || '',
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
              <p>📍 {profile?.location || 'Location pending'}</p>

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
                    ₹{getProductPrice(product)}
                  </p>
                  <p className="product-category">
                    🥬 Vegetables
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
                          onClick={async () => {
                            const newCaption = prompt("Edit Caption", product.name);
                            if (newCaption && newCaption.trim()) {
                              const token = localStorage.getItem('token');
                              try {
                                const response = await fetch(`http://localhost:8080/api/products/${product.id}?name=${encodeURIComponent(newCaption.trim())}`, {
                                  method: 'PUT',
                                  headers: {
                                    'Authorization': `Bearer ${token}`
                                  }
                                });
                                if (response.ok) {
                                  const updated = await response.json();
                                  setProducts(products.map(p => p.id === product.id ? { ...p, name: updated.name } : p));
                                } else {
                                  alert('Failed to update product name');
                                }
                              } catch (err) {
                                console.error('Error updating product:', err);
                              }
                            }
                            setOpenMenu(null);
                          }}
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

export default FarmerProfile;