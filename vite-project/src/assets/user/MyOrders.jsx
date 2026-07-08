import React from 'react';
import './MyOrders.css'; // Static components common styles use pannikalam

export default function MyOrders() {
  // Dummy Orders History tracking setup matrix
  const orders = [
    {
      id: "ORD-9872",
      date: "12 June 2026",
      item: "Fresh Organic Ponni Rice",
      qty: "50 Kg",
      total: "₹2,750",
      status: "On the Way 🚚",
      statusColor: "#3b82f6"
    },
    {
      id: "ORD-8411",
      date: "05 June 2026",
      item: "Nattu Thakkali (Tomatoes)",
      qty: "10 Kg",
      total: "₹300",
      status: "Delivered ✅",
      statusColor: "#22c55e"
    }
  ];

  return (
    <div className="orders-view-container" style={{ width: '100%', maxWidth: '600px' }}>
      <h3 style={{ fontSize: '22px', marginBottom: '20px', color: '#22c55e' }}>📦 Order History</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {orders.map(order => (
          <div key={order.id} style={{ background: '#141414', border: '1px solid #222', borderRadius: '14px', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '13px', color: '#aa0a0a0', borderBottom: '1px solid #222', paddingBottom: '8px' }}>
              <span>ID: <strong style={{ color: '#fff' }}>{order.id}</strong></span>
              <span>Date: {order.date}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', color: '#fff' }}>{order.item}</h4>
                <p style={{ margin: '0', fontSize: '13px', color: '#888' }}>Quantity: {order.qty} | Total: <strong style={{ color: '#22c55e' }}>{order.total}</strong></p>
              </div>
              
              <span style={{ background: `${order.statusColor}20`, color: order.statusColor, padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                {order.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
