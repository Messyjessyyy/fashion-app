import React, { useState, useEffect } from 'react';

function Measurements({ user, onBack }) {
  const [measurements, setMeasurements] = useState({
    chest: '',
    waist: '',
    hips: '',
    height: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchMeasurements();
  }, []);

  const fetchMeasurements = async () => {
    try {
      const response = await fetch(`https://fashion-app-backend-inxq.onrender.com/api/users/${user.id}/profile`);
      const data = await response.json();
      if (data.measurements) {
        setMeasurements(data.measurements);
      }
    } catch (error) {
      console.error('Error fetching measurements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await fetch(`https://fashion-app-backend-inxq.onrender.com/api/users/${user.id}/measurements`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(measurements)
      });
      const data = await response.json();
      alert('Measurements saved!');
      onBack();
    } catch (error) {
      alert('Error saving measurements: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="App"><div className="card"><p>Loading...</p></div></div>;

  return (
    <div className="App measurements-page">
      <div className="navbar">
        <h1>📏 Your Measurements</h1>
        <button onClick={onBack} className="back-btn">← Back</button>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="measurements-form">
          <div className="measurements-grid">
            <div className="form-group">
              <label>Chest (inches)</label>
              <input
                type="number"
                value={measurements.chest || ''}
                onChange={(e) => setMeasurements({...measurements, chest: e.target.value})}
                placeholder="e.g., 36"
                step="0.5"
              />
            </div>

            <div className="form-group">
              <label>Waist (inches)</label>
              <input
                type="number"
                value={measurements.waist || ''}
                onChange={(e) => setMeasurements({...measurements, waist: e.target.value})}
                placeholder="e.g., 28"
                step="0.5"
              />
            </div>

            <div className="form-group">
              <label>Hips (inches)</label>
              <input
                type="number"
                value={measurements.hips || ''}
                onChange={(e) => setMeasurements({...measurements, hips: e.target.value})}
                placeholder="e.g., 38"
                step="0.5"
              />
            </div>

            <div className="form-group">
              <label>Height (feet)</label>
              <input
                type="number"
                value={measurements.height || ''}
                onChange={(e) => setMeasurements({...measurements, height: e.target.value})}
                placeholder="e.g., 5.6"
                step="0.1"
              />
            </div>
          </div>

          <div className="measurements-preview">
            <h3>Current Measurements</h3>
            <div className="preview-box">
              {measurements.chest && <p>👕 Chest: {measurements.chest}"</p>}
              {measurements.waist && <p>⌛ Waist: {measurements.waist}"</p>}
              {measurements.hips && <p>🍑 Hips: {measurements.hips}"</p>}
              {measurements.height && <p>📏 Height: {measurements.height}'</p>}
              {!measurements.chest && !measurements.waist && !measurements.hips && !measurements.height && (
                <p className="empty">Add your measurements above</p>
              )}
            </div>
          </div>

          <div className="form-buttons">
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving...' : '💾 Save Measurements'}
            </button>
            <button type="button" className="btn-secondary" onClick={onBack}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Measurements;