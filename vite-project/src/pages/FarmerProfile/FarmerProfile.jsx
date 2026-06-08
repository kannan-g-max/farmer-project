import React, { useState, useEffect } from 'react';
import './FarmerProfile.css';

const FarmerProfile = () => {
  const [profile, setProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const getProductName = (product) => product.name || product.product || product.title || 'Untitled product';
  const getProductImage = (product) => product.image || product.imageUrl || product.photoUrl || product.fileUrl || '';
  const getProductPrice = (product) => product.price ?? product.amount ?? '';

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        
        const response = await fetch(`http://localhost:8080/api/farmer/${user.id}/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setProfile(data);
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
        
        const response = await fetch(`http://localhost:8080/api/farmer/${user.id}/products`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchProfile();
    fetchProducts();
  }, []);

  if (loading) return <div className="profile-container"><p>Loading profile...</p></div>;

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="profile-container">
      <div className="profile-card">
        <header className="profile-hero">
          <div className="avatar-section">
            <div className="profile-avatar"></div>
          </div>

          <section className="profile-info">
            <div className="profile-header-top">
              <h2 className="farmer-name">{profile?.name || user.farmerId}</h2>
            </div>

            <div className="stats-row">
              <div className="stat"><strong>{products.length}</strong><span>Products</span></div>
              <div className="stat"><strong>{profile?.totalSales || 0}</strong><span>Sales</span></div>
              <div className="stat"><strong>{profile?.rating || 0}</strong><span>Rating</span></div>
            </div>

            <div className="profile-bio">
              <p>{profile?.location || 'Location pending'}</p>
              <p className="bio-text">{profile?.bio || 'Welcome to my farm!'}</p>
            </div>
          </section>
        </header>

        <hr className="divider" />

        <div className="products-section">
          <h3>My Products</h3>
          {products.length === 0 ? (
            <p className="no-products">No products yet. Start by creating a post!</p>
          ) : (
            <div className="products-grid">
              {products.map(product => (
                <div key={product.id} className="product-card">
                  {getProductImage(product) && <img src={getProductImage(product)} alt={getProductName(product)} />}
                  <p className="product-name">{getProductName(product)}</p>
                  <p className="product-price">{getProductPrice(product) !== '' ? `₹${getProductPrice(product)}` : 'Price pending'}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FarmerProfile;
