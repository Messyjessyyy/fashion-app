import React, { useState, useEffect } from 'react';

function ClothingBrowser({ user, onBack }) {
  const [clothing, setClothing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    fetchClothing();
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

  const toggleItem = (id) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  if (loading) return <div className="App"><div className="card"><p>Loading clothing...</p></div></div>;

  return (
    <div className="App clothing-browser">
      <div className="navbar">
        <h1>👗 Browse Clothing</h1>
        <button onClick={onBack} className="back-btn">← Back</button>
      </div>

      <div className="clothing-container">
        <div className="clothing-grid">
          {clothing.map((item) => (
            <div
              key={item.id}
              className={`clothing-card ${selectedItems.includes(item.id) ? 'selected' : ''}`}
              onClick={() => toggleItem(item.id)}
            >
              <div className="clothing-image">
                {['👕', '👖', '👗', '🧥'][item.id - 1]}
              </div>
              <h3>{item.name}</h3>
              <p className="category">{item.category}</p>
              <p className="price">${item.price.toFixed(2)}</p>
              <button className="add-btn">
                {selectedItems.includes(item.id) ? '✓ Added' : 'Add to Outfit'}
              </button>
            </div>
          ))}
        </div>

        {selectedItems.length > 0 && (
          <div className="selected-summary">
            <h3>Selected Items: {selectedItems.length}</h3>
            <button className="btn-primary">Try On Selected</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ClothingBrowser;
