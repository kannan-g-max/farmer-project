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

const saveProfile = () => {

  const updatedProfile = {
    ...profile,
    name: editedName,
    bio: editedBio,
  };

  setProfile(updatedProfile);

  localStorage.setItem(
    "farmerProfile",
    JSON.stringify(updatedProfile)
  );

  setShowModal(false);
};


const getProductName = (product) =>
product.name || product.product || product.title || 'Untitled product';

const getProductImage = (product) =>
product.image || product.imageUrl || product.photoUrl || product.fileUrl || '';

const getProductPrice = (product) =>
product.price ?? product.amount ?? '';

useEffect(() => {
const fetchProfile = async () => {
try {
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || '{}');

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

const savedProfile = JSON.parse(
  localStorage.getItem("farmerProfile")
);

const finalProfile = savedProfile || data;

setProfile(finalProfile);

setEditedName(finalProfile.name || "");
setEditedBio(finalProfile.bio || "");
}
  } catch (error) {
    console.error('Failed to fetch profile:', error);
  } finally {
    setLoading(false);
  }
};

const fetchProducts = async () => {
  try {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

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
    inStock:
      p.inStock !== undefined
        ? p.inStock
        : true,
  }))
);
    }
  } catch (error) {
    console.error('Failed to fetch products:', error);
  }
};

fetchProfile();
fetchProducts();

}, []);

if (loading) {
return (
<div className="profile-container">
<p>Loading profile...</p>
</div>
);
}

const user = JSON.parse(localStorage.getItem('user') || '{}');

const farmerLevel =
products.length >= 20
? '🏆 Gold Farmer'
: products.length >= 10
? '🥈 Silver Farmer'
: '🌱 New Farmer';

const completion =
(profile?.bio ? 25 : 0) +
(profile?.location ? 25 : 0) +
(products.length > 0 ? 25 : 0) +
(profile?.name ? 25 : 0);


const handleImageUpload = (event) => {
  const file = event.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {
    const updatedProfile = {
      ...profile,
      profileImage: reader.result,
    };

    setProfile(updatedProfile);

    localStorage.setItem(
      "farmerProfile",
      JSON.stringify(updatedProfile)
    );
  };

  reader.readAsDataURL(file);
};

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
    onClick={() =>
      document.getElementById("coverImageInput").click()
    }
  >
    📷
  </button>

<input
  type="file"
  id="coverImageInput"
  style={{ display: "none" }}
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files[0];

    if (!file) return;

const imageUrl = URL.createObjectURL(file);

const updatedProfile = {
  ...profile,
  coverImage: imageUrl,
};

setProfile(updatedProfile);

localStorage.setItem(
  "farmerProfile",
  JSON.stringify(updatedProfile)
);
    reader.onload = () => {
      const updatedProfile = {
        ...profile,
        coverImage: reader.result,
      };

      setProfile(updatedProfile);

      localStorage.setItem(
        "farmerProfile",
        JSON.stringify(updatedProfile)
      );
    };

    reader.readAsDataURL(file);
  }}
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
            <strong>{profile?.orders || 0}</strong>
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

        {editing && (
          <button
            className="save-btn"
            onClick={() => {
            setProfile({
            ...profile,
            name: editedName,
            bio: editedBio,
        });

        localStorage.setItem(
          "farmerProfile",
          JSON.stringify({
          ...profile,
          name: editedName,
          bio: editedBio,
        })
      );

      setEditing(false);
    }}
  >
    Save Changes
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
  {product.category || "🥬 Vegetables"}
</p>
              <p className="likes-count">
  ❤️ {Math.floor(Math.random() * 200) + 20} Likes
</p>

<button
  className="stock-btn"
  onClick={() => {
    const updatedProducts = products.map((p) =>
      p.id === product.id
        ? {
            ...p,
            inStock: !p.inStock,
          }
        : p
    );

    setProducts(updatedProducts);

    localStorage.setItem(
      "products",
      JSON.stringify(updatedProducts)
    );
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
      openMenu === product.id
        ? null
        : product.id
    )
  }
>
  ⋮
</button>
{openMenu === product.id && (
  <div className="dropdown-menu">

    <button
      className="dropdown-item"
      onClick={() => {
        const newCaption = prompt(
          "Edit Caption",
          product.name
        );

        if (newCaption) {
          const updatedProducts =
            products.map((p) =>
              p.id === product.id
                ? {
                    ...p,
                    name: newCaption,
                  }
                : p
            );

          setProducts(updatedProducts);

          localStorage.setItem(
            "products",
            JSON.stringify(updatedProducts)
          );
        }

        setOpenMenu(null);
      }}
    >
      ✏️ Edit
    </button>

    <button
      className="dropdown-item delete"
      onClick={() => {
        if (
          window.confirm(
            "Delete this post?"
          )
        ) {
          const updatedProducts =
            products.filter(
              (p) =>
                p.id !== product.id
            );

          setProducts(updatedProducts);

          localStorage.setItem(
            "products",
            JSON.stringify(updatedProducts)
          );
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
      <div className="reviews-section">
  <h3>Customer Reviews</h3>

  <div className="review-card">
    <p>⭐⭐⭐⭐⭐</p>
    <p>Very fresh vegetables and quick delivery!</p>
    <strong>- Kannan</strong>
  </div>

  <div className="review-card">
    <p>⭐⭐⭐⭐⭐</p>
    <p>Best quality tomatoes. Will order again.</p>
    <strong>- Priya</strong>
  </div>

</div>
    </div>
  </div>
{showModal && (
  <div className="edit-modal">

    <div className="edit-modal-content">

      <h2>Edit Profile</h2>

      <button
        className="upload-btn"
        onClick={() =>
          document
            .getElementById(
              "profileImageInput"
            )
            .click()
        }
      >
        📷 Change Profile Photo
      </button>

      <input
        type="text"
        value={editedName}
        onChange={(e) =>
          setEditedName(
            e.target.value
          )
        }
        placeholder="Username"
        className="edit-input"
      />

      <textarea
        value={editedBio}
        onChange={(e) =>
          setEditedBio(
            e.target.value
          )
        }
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
        onClick={() =>
          setShowModal(false)
        }
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