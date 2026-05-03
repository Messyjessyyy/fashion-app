import React, { useState, useEffect } from 'react';

function EditProfile({ user, onBack, onSave }) {
  const [profile, setProfile] = useState({
    bodyType: '',
    skinTone: '',
    style: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/users/${user.id}/profile`);
      const data = await response.json();
      if (data.profile) {
        setProfile(data.profile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await fetch(`http://localhost:3000/api/users/${user.id}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      const data = await response.json();
      alert('Profile updated!');
      onBack();
    } catch (error) {
      alert('Error updating profile: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="App"><div className="card"><p>Loading...</p></div></div>;

  return (
    <div className="App edit-profile">
      <div className="navbar">
        <h1>Edit Profile</h1>
        <button onClick={onBack} className="back-btn">← Back</button>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-group">
            <label>Body Type</label>
            <select 
              value={profile.bodyType || ''} 
              onChange={(e) => setProfile({...profile, bodyType: e.target.value})}
            >
              <option value="">Select body type...</option>
              <option value="Petite">Petite</option>
              <option value="Average">Average</option>
              <option value="Tall">Tall</option>
              <option value="Plus-size">Plus-size</option>
            </select>
          </div>

          <div className="form-group">
            <label>Skin Tone</label>
            <select 
              value={profile.skinTone || ''} 
              onChange={(e) => setProfile({...profile, skinTone: e.target.value})}
            >
              <option value="">Select skin tone...</option>
              <option value="Fair">Fair</option>
              <option value="Light">Light</option>
              <option value="Medium">Medium</option>
              <option value="Tan">Tan</option>
              <option value="Deep">Deep</option>
            </select>
          </div>

          <div className="form-group">
            <label>Style Preference</label>
            <select 
              value={profile.style || ''} 
              onChange={(e) => setProfile({...profile, style: e.target.value})}
            >
              <option value="">Select style...</option>
              <option value="Casual">Casual</option>
              <option value="Formal">Formal</option>
              <option value="Sporty">Sporty</option>
              <option value="Bohemian">Bohemian</option>
              <option value="Minimalist">Minimalist</option>
            </select>
          </div>

          <div className="form-buttons">
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" className="btn-secondary" onClick={onBack}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;
