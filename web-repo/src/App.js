import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const inputStyle = {
  width: '100%',
  padding: '12px',
  marginBottom: '15px',
  borderRadius: '8px',
  border: '1px solid #ddd',
  boxSizing: 'border-box',
  fontSize: '1rem'
};

const buttonStyle = {
  width: '100%',
  padding: '12px',
  borderRadius: '8px',
  border: 'none',
  background: '#007bff',
  color: 'white',
  fontWeight: '600',
  cursor: 'pointer'
};

const historyItemStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '12px',
  borderBottom: '1px solid #f5f5f5',
  cursor: 'pointer',
  transition: 'background 0.2s'
};

const floatingCardStyle = {
  position: 'absolute',
  top: '20px',
  left: '20px',
  zIndex: 1000,
  background: 'white',
  padding: '15px 25px',
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  minWidth: '200px'
};


// Fix for the missing marker icon bug in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// This helper component moves the map view when the coordinates change
function RecenterMap({ coords }) {
  const map = useMap();
  map.setView(coords, 13);
  return null;
}

function Home() {
  const [geoData, setGeoData] = useState(null);
  const [searchIp, setSearchIp] = useState('');
  const [history, setHistory] = useState([]);
  const [mapCoords, setMapCoords] = useState([14.35, 121.05]); // Default coords (Laguna area!)

  useEffect(() => {
    fetchLocation();
  }, []);

  const fetchLocation = async (ip = '') => {
    try {
      const url = ip ? `https://ipinfo.io/${ip}/json` : `https://ipinfo.io/json`;
      const res = await axios.get(url);
      
      const [lat, lng] = res.data.loc.split(',').map(Number);
      setGeoData(res.data);
      setMapCoords([lat, lng]);

      if (ip) {
        const newHistoryItem = { id: Date.now(), ip: res.data.ip, city: res.data.city, selected: false };
        setHistory(prev => [newHistoryItem, ...prev]);
      }
    } catch (err) {
      alert("Please enter a valid IP address");
    }
  };

  const toggleHistoryItem = (id) => {
    setHistory(history.map(item => item.id === id ? { ...item, selected: !item.selected } : item));
  };

  const deleteSelected = () => {
    setHistory(history.filter(item => !item.selected));
  };


  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      {/* SIDEBAR: History & Search */}
      <div style={{ width: '350px', background: '#fff', borderRight: '1px solid #eee', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid #eee' }}>
          <h2 style={{ margin: 0, fontSize: '1.2rem' }}>IP Tracker</h2>
          <div style={{ marginTop: '20px', display: 'flex', gap: '8px' }}>
            <input 
              value={searchIp} 
              onChange={e => setSearchIp(e.target.value)} 
              placeholder="Search IP..." 
              style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
            />
            <button onClick={() => fetchLocation(searchIp)} style={{ ...buttonStyle, width: 'auto', padding: '0 15px' }}>Go</button>
          </div>
          <button onClick={() => { setSearchIp(''); fetchLocation(); }} style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', marginTop: '10px' }}>Clear to my IP</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ margin: 0 }}>History</h4>
            <button onClick={deleteSelected} style={{ background: 'none', border: 'none', color: '#ff4d4f', cursor: 'pointer', fontSize: '0.8rem' }}>Delete Selected</button>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, marginTop: '15px' }}>
            {history.map(item => (
              <li key={item.id} style={historyItemStyle}>
                <input type="checkbox" checked={item.selected} onChange={() => toggleHistoryItem(item.id)} />
                <span style={{ flex: 1, marginLeft: '10px', fontSize: '0.9rem' }} onClick={() => fetchLocation(item.ip)}>
                  <strong>{item.ip}</strong><br/>
                  <small style={{ color: '#666' }}>{item.city}</small>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* MAIN CONTENT: Map & Current Info */}
      <div style={{ flex: 1, position: 'relative' }}>
        <div style={floatingCardStyle}>
          <h4 style={{ margin: '0 0 5px 0' }}>{geoData?.ip}</h4>
          <p style={{ margin: 0, color: '#666' }}>{geoData?.city}, {geoData?.region}</p>
        </div>
        
        <MapContainer center={mapCoords} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={mapCoords}><Popup>{geoData?.city}</Popup></Marker>
          <RecenterMap coords={mapCoords} />
        </MapContainer>
      </div>
    </div>
  );
}

// --- LOGIN COMPONENT ---
function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8000/api/login', { email, password });
      if (res.data.success) onLogin();
    } catch (err) { setError("Invalid credentials. Hint: test@example.com"); }
  };

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: '#001f3f', 
      backgroundImage: `radial-gradient(circle at 20% 30%, #003366 0%, transparent 50%), 
                        radial-gradient(circle at 80% 70%, #007bff 0%, transparent 50%)`
    }}>
      <div style={{ 
        background: 'rgba(255, 255, 255, 0.98)', 
        padding: '50px 40px', 
        borderRadius: '24px', 
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)', 
        width: '380px', 
        textAlign: 'center' 
      }}>
        
        <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#007bff', letterSpacing: '2px', marginBottom: '10px' }}>
          BASIC ASSESSMENT EXAM
        </div>
        <h2 style={{ margin: '0 0 5px 0', color: '#001f3f', fontSize: '1.8rem' }}>Welcome, JLabs!</h2>
        <p style={{ color: '#666', marginBottom: '30px', fontSize: '0.9rem' }}>
          Developed by <strong>Janriz Cuevas</strong><br/>
          <small>FEU Institute of Technology</small>
        </p>
        
        <form onSubmit={handleSubmit}>
          <div style={{ textAlign: 'left', marginBottom: '15px' }}>
            <label style={{ fontSize: '0.8rem', color: '#001f3f', fontWeight: '600', marginLeft: '5px' }}>EMAIL</label>
            <input type="email" placeholder="test@example.com" onChange={e => setEmail(e.target.value)} style={inputStyle} required />
          </div>
          <div style={{ textAlign: 'left', marginBottom: '20px' }}>
            <label style={{ fontSize: '0.8rem', color: '#001f3f', fontWeight: '600', marginLeft: '5px' }}>PASSWORD</label>
            <input type="password" placeholder="password123" onChange={e => setPassword(e.target.value)} style={inputStyle} required />
          </div>
          <button type="submit" style={{...buttonStyle, background: '#001f3f', fontSize: '1rem'}}>
            View Full-Stack Demo
          </button>
        </form>
        
        {error && (
          <div style={{ marginTop: '20px', padding: '10px', background: '#fff2f0', border: '1px solid #ffccc7', borderRadius: '8px' }}>
            <p style={{ color: '#ff4d4f', margin: 0, fontSize: '0.85rem' }}>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!isLoggedIn ? <Login onLogin={() => setIsLoggedIn(true)} /> : <Navigate to="/" />} />
        <Route path="/" element={isLoggedIn ? <Home /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;