import React from 'react';
import './Cart.css';
import './MarketFeed.css';

export default function Cart({ cartItems, setCartItems, feedItems }) {
  const [showPayment, setShowPayment] = React.useState(false);
  const [paymentMethod, setPaymentMethod] = React.useState('upi');
  const [processing, setProcessing] = React.useState(false);

  // Synchronize cart items with feedItems to detect deletions and quantity changes
  React.useEffect(() => {
    if (!feedItems || feedItems.length === 0) return;

    let cartChanged = false;
    const validatedCart = cartItems.map(item => {
      const dbProd = feedItems.find(p => p.id === item.id);
      
      if (!dbProd || dbProd.inStock === false) {
        if (!item.isUnavailable) {
          cartChanged = true;
          return { ...item, isUnavailable: true, availableQuantity: 0 };
        }
        return item;
      }

      let updatedItem = { ...item };
      if (item.isUnavailable) {
        cartChanged = true;
        updatedItem.isUnavailable = false;
      }

      const latestAvail = Number(dbProd.quantity || 0);
      if (item.availableQuantity !== latestAvail) {
        cartChanged = true;
        updatedItem.availableQuantity = latestAvail;
      }

      if (item.quantity > latestAvail) {
        cartChanged = true;
        updatedItem.quantity = Math.max(1, latestAvail);
      }

      return updatedItem;
    });

    if (cartChanged) {
      setCartItems(validatedCart);
      localStorage.setItem('user_cart', JSON.stringify(validatedCart));
    }
  }, [feedItems, cartItems, setCartItems]);

  const updateQty = (id, change) => {
    const updated = cartItems.map(item => 
      item.id === id
        ? {
            ...item,
            quantity: Math.max(
              1,
              Math.min(item.availableQuantity || Number.MAX_SAFE_INTEGER, item.quantity + change)
            )
          }
        : item
    );
    setCartItems(updated);
    localStorage.setItem('user_cart', JSON.stringify(updated));
  };

  const removeItem = (id) => {
    const updated = cartItems.filter(item => item.id !== id);
    setCartItems(updated);
    localStorage.setItem('user_cart', JSON.stringify(updated));
  };

  // Exclude unavailable items from total bill
  const totalBill = cartItems.reduce((acc, item) => acc + (item.isUnavailable ? 0 : item.price * item.quantity), 0);

  const handleCheckout = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please login first!");
      return;
    }

    const hasUnavailable = cartItems.some(item => item.isUnavailable);
    if (hasUnavailable) {
      alert("Some items in your cart are no longer available. Please remove them before checkout.");
      return;
    }

    setProcessing(true);

    try {
      for (const item of cartItems) {
        const response = await fetch(`http://localhost:8080/api/orders?productId=${item.id}&weight=${item.quantity}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.message || `Failed to place order for ${item.name}`);
        }
      }

      alert(`Payment successful via ${paymentMethod.toUpperCase()} and order placed!`);
      setCartItems([]);
      localStorage.setItem('user_cart', '[]');
      setShowPayment(false);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to checkout');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="cart-view-container" style={{ width: '100%', maxWidth: '600px' }}>
      <h3 style={{ fontSize: '22px', marginBottom: '20px', color: '#22c55e' }}>🛒 Shopping Cart</h3>
      
      {cartItems.length === 0 ? (
        <p style={{ color: '#666', textAlign: 'center', marginTop: '60px', fontSize: '15px' }}>
          Cart empty-ah irukku macha! 🌾 <br/>Marketplace poyi add to cart click pannu!
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {cartItems.map(item => (
            <div key={item.id} style={{ display: 'flex', background: '#141414', border: '1px solid #222', borderRadius: '12px', padding: '12px', alignItems: 'center', gap: '15px' }}>
              <img src={item.image} alt={item.name} style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '8px', opacity: item.isUnavailable ? 0.4 : 1 }} />
              
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', textDecoration: item.isUnavailable ? 'line-through' : 'none', color: item.isUnavailable ? '#ef4444' : '#fff' }}>{item.name}</h4>
                <p style={{ margin: '0', fontSize: '12px', color: '#888' }}>👨‍🌾 {item.farmer}</p>
                <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#22c55e', fontWeight: 'bold' }}>
                  ₹{item.price} / {item.unit || 'kg'}
                  {item.isUnavailable && <span style={{ color: '#ef4444', fontSize: '12px', marginLeft: '10px', display: 'block', marginTop: '2px' }}>⚠️ Out of Stock / Deleted</span>}
                </p>
              </div>

              {/* Qty Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#1c1c1c', padding: '4px 10px', borderRadius: '6px' }}>
                <button onClick={() => !item.isUnavailable && updateQty(item.id, -1)} style={{ background: 'none', border: 'none', color: item.isUnavailable ? '#444' : '#fff', cursor: item.isUnavailable ? 'not-allowed' : 'pointer', fontWeight: 'bold' }} disabled={item.isUnavailable}>-</button>
                <span style={{ fontSize: '14px', fontWeight: '600', color: item.isUnavailable ? '#ef4444' : '#fff' }}>{item.isUnavailable ? '0' : item.quantity} {item.unit || 'kg'}</span>
                <button onClick={() => !item.isUnavailable && updateQty(item.id, 1)} style={{ background: 'none', border: 'none', color: item.isUnavailable ? '#444' : '#fff', cursor: item.isUnavailable ? 'not-allowed' : 'pointer', fontWeight: 'bold' }} disabled={item.isUnavailable}>+</button>
              </div>

              <div style={{ textAlign: 'right', minWidth: '80px' }}>
                <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', color: item.isUnavailable ? '#444' : '#fff' }}>₹{item.isUnavailable ? 0 : item.price * item.quantity}</p>
                <button onClick={() => removeItem(item.id)} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '12px', cursor: 'pointer' }}>Remove</button>
              </div>
            </div>
          ))}

          {/* Checkout Card */}
          <div style={{ background: '#181818', border: '1px solid #222', padding: '20px', borderRadius: '14px', marginTop: '15px', textAlign: 'right' }}>
            <p style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#aaa' }}>Total Amount: <span style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginLeft: '10px' }}>₹{totalBill}</span></p>
            <button 
              className="buy-trigger-btn" 
              style={{ width: 'auto', padding: '12px 30px', opacity: cartItems.some(i => i.isUnavailable) ? 0.5 : 1, cursor: cartItems.some(i => i.isUnavailable) ? 'not-allowed' : 'pointer' }} 
              onClick={() => {
                if (cartItems.some(i => i.isUnavailable)) {
                  alert("Please remove unavailable items first.");
                } else {
                  setShowPayment(true);
                }
              }}
            >
              Proceed to Checkout 🚀
            </button>
          </div>
        </div>
      )}

      {showPayment && (
        <div className="create-post-container" onClick={() => setShowPayment(false)}>
          <div className="post-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Payment</h3>
              <button className="close-btn" onClick={() => setShowPayment(false)}>✕</button>
            </div>
            <div className="modal-content" style={{ justifyContent: 'flex-start' }}>
              <div style={{ width: '100%', display: 'grid', gap: '12px' }}>
                <p style={{ margin: 0, color: '#ddd' }}>Choose payment method</p>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={{ width: '100%', padding: '12px', background: '#141414', color: '#fff', border: '1px solid #333', borderRadius: '10px' }}
                >
                  <option value="upi">UPI</option>
                  <option value="card">Card</option>
                  <option value="cod">Cash on Delivery</option>
                </select>
                <p style={{ margin: 0, color: '#a3e635' }}>Payable Amount: ₹{totalBill}</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowPayment(false)} disabled={processing}>Cancel</button>
              <button className="share-btn" onClick={handleCheckout} disabled={processing}>{processing ? 'Processing...' : 'Pay & Place Order'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}