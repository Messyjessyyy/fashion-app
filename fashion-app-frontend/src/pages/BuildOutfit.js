import React, { useState, useEffect } from 'react';

function BuildOutfit({ user, onBack }) {
  const [clothing, setClothing] = useState([]);
  const [selectedOutfit, setSelectedOutfit] = useState([]);
  const [outfitName, setOutfitName] = useState('');
  const [savedOutfits, setSavedOutfits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClothing();
    loadSavedOutfits();
  }, []);

  const fetchClothing = async () => {
    try {
      const response = await fetch('https://fashion-app-backend-inxq.onrender.com');
      const data = await response.json();
      setClothing(data);
    } catch (error) {
      console.error('Error fetching clothing:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSavedOutfits = () => {
    const saved = localStorage.getItem(`outfits_${user.id}`);
    if (saved) {
      setSavedOutfits(JSON.parse(saved));
    }
  };

  const toggleItem = (id) => {
    setSelectedOutfit(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const saveOutfit = () => {
    if (!outfitName.trim()) {
      alert('Please name your outfit!');
      return;
    }
    if (selectedOutfit.length === 0) {
      alert('Please select at least one item!');
      return;
    }

    const newOutfit = {
      id: Date.now(),
      name: outfitName,
      items: selectedOutfit,
      createdAt: new Date().toLocaleDateString()
    };

    const updated = [...savedOutfits, newOutfit];
    setSavedOutfits(updated);
    localStorage.setItem(`outfits_${user.id}`, JSON.stringify(updated));
    
    alert('Outfit saved!');
    setOutfitName('');
    setSelectedOutfit([]);
  };

  const deleteOutfit = (id) => {
    const updated = savedOutfits.filter(o => o.id !== id);
    setSavedOutfits(updated);
    localStorage.setItem(`outfits_${user.id}`, JSON.stringify(updated));
  };

  if (loading) return <div className="App"><div className="card"><p>Loading...</p></div></div>;

  const getItemEmoji = (id) => ['👕', '👖', '👗', '🧥'][id - 1];
  const getItemName = (id) => clothing.find(c => c.id === id)?.name || 'Unknown';

  return (
    <div className="App build-outfit">
      <div className="navbar">
        <h1>🎨 Build Outfit</h1>
        <button onClick={onBack} className="back-btn">← Back</button>
      </div>

      <div className="outfit-builder">
        <div className="builder-section">
          <h2>Select Items</h2>
          <div className="clothing-grid">
            {clothing.map((item) => (
              <div
                key={item.id}
                className={`clothing-card ${selectedOutfit.includes(item.id) ? 'selected' : ''}`}
                onClick={() => toggleItem(item.id)}
              >
                <div className="clothing-image">{getItemEmoji(item.id)}</div>
                <h3>{item.name}</h3>
                <p className="category">{item.category}</p>
                <p className="price">${item.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="builder-section">
          <h2>Save Your Outfit</h2>
          <input
            type="text"
            placeholder="Name your outfit (e.g., 'Summer Vibes')"
            value={outfitName}
            onChange={(e) => setOutfitName(e.target.value)}
            className="outfit-name-input"
          />
          <div className="selected-items-preview">
            <h3>Selected Items ({selectedOutfit.length})</h3>
            {selectedOutfit.length > 0 ? (
              <div className="selected-items-list">
                {selectedOutfit.map(id => (
                  <div key={id} className="selected-item">
                    <span>{getItemEmoji(id)} {getItemName(id)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty">No items selected yet</p>
            )}
          </div>
          <button onClick={saveOutfit} className="btn-primary" style={{width: '100%'}}>
            💾 Save Outfit
          </button>
        </div>

        {savedOutfits.length > 0 && (
          <div className="builder-section">
            <h2>Your Saved Outfits</h2>
            <div className="saved-outfits-list">
              {savedOutfits.map(outfit => (
                <div key={outfit.id} className="saved-outfit-card">
                  <h3>{outfit.name}</h3>
                  <p className="date">{outfit.createdAt}</p>
                  <div className="outfit-items">
                    {outfit.items.map(id => (
                      <span key={id} className="outfit-badge">
                        {getItemEmoji(id)} {getItemName(id)}
                      </span>
                    ))}
                  </div>
                  <button 
                    onClick={() => deleteOutfit(outfit.id)}
                    className="btn-delete"
                  >
                    🗑️ Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BuildOutfit;
