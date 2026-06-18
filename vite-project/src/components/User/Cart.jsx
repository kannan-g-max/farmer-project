import React, { useState } from 'react';
import './Cart.css'; // Static components common styles use pannikalam
import './MarketFeed.css'; // Static components common styles use pannikalam

export default function Cart() {
  // Dummy Cart Items: Database integrate pannum pothu dynamic variable maathalam
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Organic Ponni Rice",
      farmer: "Kannan T",
      price: 55,
      quantity: 20, // 20 Kg
      image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 2,
      name: "Country Tomatoes",
      farmer: "Raman Kumar",
      price: 30,
      quantity: 5, // 5 Kg
      image: "https://images.unsplash.com/photo-1595855759920-86582396756a?q=80&w=600&auto=format&fit=crop"
    }
  ]);

  const updateQty = (id, change) => {
    setCartItems(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + change) } : item
    ));
  };

  const removeItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const totalBill = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <div className="cart-view-container" style={{ width: '100%', maxWidth: '600px' }}>
      <h3 style={{ fontSize: '22px', marginBottom: '20px', color: '#22c55e' }}>🛒 Shopping Cart</h3>
      
      {cartItems.length === 0 ? (
        <p style={{ color: '#666', textAlign: 'center', marginTop: '40px' }}>Your cart is empty</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {cartItems.map(item => (
            <div key={item.id} style={{ display: 'flex', background: '#141414', border: '1px solid #222', borderRadius: '12px', padding: '12px', alignItems: 'center', gap: '15px' }}>
              <img src={item.image} alt={item.name} style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '8px' }} />
              
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>{item.name}</h4>
                <p style={{ margin: '0', fontSize: '12px', color: '#888' }}>👨‍🌾 {item.farmer}</p>
                <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#22c55e', fontWeight: 'bold' }}>₹{item.price} / Kg</p>
              </div>

              {/* Qty Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#1c1c1c', padding: '4px 10px', borderRadius: '6px' }}>
                <button onClick={() => updateQty(item.id, -1)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>-</button>
                <span style={{ fontSize: '14px', fontWeight: '600' }}>{item.quantity}kg</span>
                <button onClick={() => updateQty(item.id, 1)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>+</button>
              </div>

              <div style={{ textAlign: 'right', minWidth: '80px' }}>
                <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>₹{item.price * item.quantity}</p>
                <button onClick={() => removeItem(item.id)} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '12px', cursor: 'pointer' }}>Remove</button>
              </div>
            </div>
          ))}

          {/* Checkout Box */}
          <div style={{ background: '#181818', border: '1px solid #222', padding: '20px', borderRadius: '14px', marginTop: '15px', textAlign: 'right' }}>
            <p style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#aaa' }}>Total Amount: <span style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginLeft: '10px' }}>₹{totalBill}</span></p>
            <button className="buy-trigger-btn" style={{ width: 'auto', padding: '12px 30px' }} onClick={() => alert('Order Placed Successfully!')}>Proceed to Checkout 🚀</button>
          </div>
        </div>
      )}
    </div>
  );
}
