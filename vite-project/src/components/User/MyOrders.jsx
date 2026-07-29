import React, { useState, useEffect } from 'react';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('http://localhost:8080/api/public/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 4000);
    return () => clearInterval(interval);
  }, []);

  const getStatusDetails = (status) => {
    switch (status) {
      case 'PENDING':
        return { text: 'Pending (Searching Rider...) 🔍', color: '#eab308' };
      case 'ACCEPTED':
        return { text: 'Rider Assigned (On the Way) 🚚', color: '#3b82f6' };
      case 'DELIVERED':
        return { text: 'Delivered ✅', color: '#22c55e' };
      default:
        return { text: status, color: '#aaa' };
    }
  };

  if (loading) {
    return (
      <div className="orders-view-container" style={{ width: '100%', maxWidth: '600px' }}>
        <p style={{ color: '#aaa', textAlign: 'center', marginTop: '60px' }}>Loading order history...</p>
      </div>
    );
  }

  return (
    <div className="orders-view-container" style={{ width: '100%', maxWidth: '600px' }}>
      <h3 style={{ fontSize: '22px', marginBottom: '20px', color: '#22c55e' }}>📦 Order History</h3>
      
      {orders.length === 0 ? (
        <p style={{ color: '#666', textAlign: 'center', marginTop: '60px', fontSize: '15px' }}>
          No orders placed yet. Start by checking out crops! 🌾
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {orders.map(order => {
            const statusInfo = getStatusDetails(order.status);
            const dateStr = order.createdAt ? new Date(order.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : 'Today';
            return (
              <div key={order.id} style={{ background: '#141414', border: '1px solid #222', borderRadius: '14px', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '13px', color: '#888', borderBottom: '1px solid #222', paddingBottom: '8px' }}>
                  <span>ID: <strong style={{ color: '#fff' }}>ORD-{order.id}</strong></span>
                  <span>Date: {dateStr}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', color: '#fff' }}>{order.itemName}</h4>
                    <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#888' }}>
                      Quantity: <strong>{order.weight} Kg</strong> | Total: <strong style={{ color: '#22c55e' }}>₹{order.totalAmount}</strong>
                    </p>
                    <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>
                      Farmer: {order.farmerName} ({order.farmerLocation})
                    </p>
                    {order.riderName && (
                      <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#3b82f6', fontWeight: 'bold' }}>
                        🛵 Rider Assigned: {order.riderName}
                      </p>
                    )}
                  </div>
                  
                  <span style={{ background: `${statusInfo.color}20`, color: statusInfo.color, padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                    {statusInfo.text}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
