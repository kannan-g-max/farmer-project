import { useEffect, useState } from "react";

function RiderDashboard() {
  const [orders, setOrders] = useState([]);
  const [earnings, setEarnings] = useState(0);
  const [riderLocation, setRiderLocation] = useState(null);

  // 📍 Location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setRiderLocation({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      });
    });
  }, []);

  // 📦 Orders
  useEffect(() => {
    setOrders([
      {
        id: 1,
        product: "Spinach",
        farmer: "Ram Farms",
        pickup: "Thirumangalam",
        delivery: "Madurai",
        distance: 3.5,
        status: "Available"
      },
      {
        id: 2,
        product: "Carrot",
        farmer: "Kannan Farm",
        pickup: "Madurai",
        delivery: "Thiruparankundram",
        distance: 5,
        status: "Available"
      }
    ]);
  }, []);

  // ✅ Accept
  const acceptOrder = (id) => {
    const updated = orders.map(order =>
      order.id === id ? { ...order, status: "Accepted" } : order
    );
    setOrders(updated);
    alert("Order Accepted 🚴");
  };

  // 🚚 Delivered (🔥 EARNINGS FIX HERE)
  const markDelivered = (id) => {
    const updated = orders.map(order =>
      order.id === id ? { ...order, status: "Delivered" } : order
    );

    setOrders(updated);

    // 🔥 IMPORTANT FIX
    setEarnings((prev) => prev + 50);

    alert("Delivery Completed ✅");
  };

  return (
    <div style={containerStyle}>

      {/* 🔥 HEADER */}
      <div style={headerStyle}>
        <h1 style={{ color: "#22c55e" }}>🚴 Delivery Hub</h1>
        <p style={{ color: "#ccc" }}>Manage your deliveries</p>
      </div>

      {/* 💰 Earnings */}
      <div style={glassCard}>
        <h2 style={{ color: "#4ade80" }}>
          💰 Earnings: ₹{earnings}
        </h2>

        {riderLocation && (
          <p style={{ color: "#aaa" }}>
            📍 {riderLocation.lat.toFixed(2)}, {riderLocation.lng.toFixed(2)}
          </p>
        )}
      </div>

      {/* 📦 Orders */}
      {orders.map((order) => (
        <div key={order.id} style={cardStyle}>
          
          {/* 🔥 PRODUCT COLOR FIX */}
          <h2 style={{ color: "#facc15" }}>{order.product}</h2>

          {/* 🔥 FARMER COLOR */}
          <p>🌾 <b style={{ color: "#38bdf8" }}>{order.farmer}</b></p>

          <p style={textStyle}>📍 Pickup: {order.pickup}</p>
          <p style={textStyle}>🏠 Delivery: {order.delivery}</p>
          <p style={textStyle}>📏 {order.distance} km</p>

          <p>
            Status:
            <span style={{
              marginLeft: "8px",
              color:
                order.status === "Available" ? "#facc15" :
                order.status === "Accepted" ? "#38bdf8" :
                "#4ade80"
            }}>
              {order.status}
            </span>
          </p>

          {/* ✅ Accept */}
          {order.status === "Available" && (
            <button onClick={() => acceptOrder(order.id)} style={btnStyle}>
              Accept 🚀
            </button>
          )}

          {/* 🚚 Delivered */}
          {order.status === "Accepted" && (
            <button onClick={() => markDelivered(order.id)} style={btnStyle}>
              Delivered ✅
            </button>
          )}

          {/* ✅ Completed */}
          {order.status === "Delivered" && (
            <p style={{ color: "#4ade80" }}>✔ Completed</p>
          )}
        </div>
      ))}
    </div>
  );
}

// 🎨 STYLES

const containerStyle = {
  padding: "20px",
  minHeight: "100vh",
  background: "linear-gradient(135deg, #1e1e2f, #121212)",
  color: "white"
};

const headerStyle = {
  marginBottom: "20px"
};

const glassCard = {
  background: "rgba(255,255,255,0.08)",
  backdropFilter: "blur(10px)",
  padding: "15px",
  borderRadius: "15px",
  marginBottom: "20px"
};

const cardStyle = {
  background: "rgba(255,255,255,0.05)",
  padding: "15px",
  borderRadius: "15px",
  marginTop: "15px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.3)"
};

const textStyle = {
  color: "#e5e7eb"
};

const btnStyle = {
  marginTop: "10px",
  padding: "10px",
  background: "linear-gradient(45deg, #22c55e, #4ade80)",
  color: "black",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold"
};

export default RiderDashboard;