import React, { useState, useEffect } from 'react';
import './LocationTracker.css';

export default function LocationTracker() {
  const [coordinates, setCoordinates] = useState({ latitude: null, longitude: null });
  const [statusText, setStatusText] = useState('Initializing GPS tracking...');
  const [isTracking, setIsTracking] = useState(false);

  const updateBackendLocation = async (lat, lon) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      await fetch(`http://localhost:8080/api/rider/location?latitude=${lat}&longitude=${lon}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (err) {
      console.error("Failed to update telemetry location:", err);
    }
  };

  // Function to capture live coordinates
  const startTracking = () => {
    if (!navigator.geolocation) {
      setStatusText('Geolocation is not supported by your browser.');
      return;
    }

    setIsTracking(true);
    setStatusText('Fetching active satellite locks...');

    // watchPosition will dynamically update if rider moves on road
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(6);
        const lon = position.coords.longitude.toFixed(6);
        setCoordinates({
          latitude: lat,
          longitude: lon
        });
        setStatusText('Live Core Tracking Active');
        updateBackendLocation(lat, lon);
      },
      (error) => {
        setIsTracking(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setStatusText('Permission denied. Please enable GPS location.');
            break;
          case error.POSITION_UNAVAILABLE:
            setStatusText('Position network unavailable.');
            break;
          case error.TIMEOUT:
            setStatusText('Location request timed out.');
            break;
          default:
            setStatusText('Unknown tracking error occurred.');
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );

    return watchId;
  };

  useEffect(() => {
    const watchId = startTracking();
    
    // Cleanup tracing when switching components
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return (
    <div className="location-tracking-card">
      <div className="tracker-header">
        <div className="pulse-indicator-node">
          <span className={`pulse-dot ${isTracking ? 'online' : 'offline'}`}></span>
          <span className="status-label">{statusText}</span>
        </div>
        <button className="refresh-gps-btn" onClick={startTracking}>🔄 Recalibrate GPS</button>
      </div>

      <div className="coordinates-data-grid">
        <div className="coord-data-box">
          <small>Latitude Reference</small>
          <h4>{coordinates.latitude ? `${coordinates.latitude}° N` : '---'}</h4>
        </div>
        <div className="coord-data-box">
          <small>Longitude Reference</small>
          <h4>{coordinates.longitude ? `${coordinates.longitude}° E` : '---'}</h4>
        </div>
      </div>

      <div className="geo-fence-meta">
        ℹ️ This telemetry matrix matches real-time orders within your selected operational range configuration.
      </div>
    </div>
  );
}