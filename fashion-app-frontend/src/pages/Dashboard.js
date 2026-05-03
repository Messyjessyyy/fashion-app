import React, { useState, useEffect } from 'react';
import ClothingBrowser from './ClothingBrowser';
import EditProfile from './EditProfile';
import BuildOutfit from './BuildOutfit';
import Measurements from './Measurements';
import AvatarPreview from './AvatarPreview';

function Dashboard({ user, onLogout }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/users/${user.id}/profile`);
      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="App"><div className="card"><p>Loading...</p></div></div>;

  if (currentPage === 'clothing') return <ClothingBrowser user={user} onBack={() => setCurrentPage('dashboard')} />;
  if (currentPage === 'edit-profile') return <EditProfile user={user} onBack={() => { fetchProfile(); setCurrentPage('dashboard'); }} />;
  if (currentPage === 'build-outfit') return <BuildOutfit user={user} onBack={() => setCurrentPage('dashboard')} />;
  if (currentPage === 'measurements') return <Measurements user={user} onBack={() => { fetchProfile(); setCurrentPage('dashboard'); }} />;
  if (currentPage === 'avatar') return <AvatarPreview user={user} measurements={profile.measurements} outfit={[]} onBack={() => setCurrentPage('dashboard')} />;

  return (
    <div className="App dashboard">
      <div className="navbar">
        <h1>Fashion App</h1>
        <button onClick={onLogout} className="logout-btn">Logout</button>
      </div>
      <div className="dashboard-container">
        <div className="card">
          <h2>Profile</h2>
          <p>Email: {profile.email}</p>
        </div>
        <div className="card">
          <h2>Measurements</h2>
          <p>No measurements yet</p>
        </div>
      </div>
      <div className="action-buttons">
        <button className="btn-primary" onClick={() => setCurrentPage('edit-profile')}>Edit Profile</button>
        <button className="btn-primary" onClick={() => setCurrentPage('measurements')}>Measurements</button>
        <button className="btn-primary" onClick={() => setCurrentPage('clothing')}>Browse</button>
        <button className="btn-primary" onClick={() => setCurrentPage('build-outfit')}>Outfit</button>
        <button className="btn-primary" onClick={() => setCurrentPage('avatar')}>Avatar</button>
      </div>
    </div>
  );
}

export default Dashboard;