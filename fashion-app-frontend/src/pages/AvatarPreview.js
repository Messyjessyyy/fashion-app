import React, { useState, useEffect } from 'react';

function AvatarPreview({ user, measurements, outfit, onBack }) {
  const [svgContent, setSvgContent] = useState('');

  useEffect(() => {
    const chest = measurements?.chest || 36;
    const scale = Math.max(0.8, Math.min(1.5, chest / 36));
    
    const svg = `<svg width="100%" height="100%" viewBox="0 0 400 600" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="600" fill="#f5f5f5"/>
      <circle cx="200" cy="100" r="40" fill="#f4a460"/>
      <rect x="${200 - 30 * scale}" y="150" width="${60 * scale}" height="120" rx="10" fill="#8B4789"/>
      <rect x="${200 - 80 * scale}" y="160" width="${50 * scale}" height="25" rx="12" fill="#f4a460"/>
      <rect x="${200 + 30 * scale}" y="160" width="${50 * scale}" height="25" rx="12" fill="#f4a460"/>
      <rect x="${200 - 20 * scale}" y="280" width="${18 * scale}" height="140" fill="#333"/>
      <rect x="${200 + 2 * scale}" y="280" width="${18 * scale}" height="140" fill="#333"/>
      <circle cx="185" cy="90" r="5" fill="#000"/>
      <circle cx="215" cy="90" r="5" fill="#000"/>
      <text x="200" y="550" text-anchor="middle" font-size="16" fill="#333">Your Avatar</text>
    </svg>`;
    
    setSvgContent(svg);
  }, [measurements, outfit]);

  return (
    <div className="App avatar-preview">
      <div className="navbar">
        <h1>Avatar Preview</h1>
        <button onClick={onBack} className="back-btn">Back</button>
      </div>
      <div className="avatar-container">
        <div className="avatar-display" dangerouslySetInnerHTML={{ __html: svgContent }} />
        <div className="avatar-info">
          <h2>Your Measurements</h2>
          {measurements && measurements.chest ? (
            <div className="info-box">
              <p><strong>Chest:</strong> {measurements.chest}"</p>
              <p><strong>Waist:</strong> {measurements.waist || 'Not set'}"</p>
              <p><strong>Hips:</strong> {measurements.hips || 'Not set'}"</p>
              <p><strong>Height:</strong> {measurements.height || 'Not set'}'</p>
            </div>
          ) : (
            <p className="empty">Add measurements to see your avatar</p>
          )}
          <button onClick={onBack} className="btn-primary" style={{width: '100%', marginTop: '20px'}}>Back</button>
        </div>
      </div>
    </div>
  );
}

export default AvatarPreview;