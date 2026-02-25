import { useEffect } from 'react'
import './ArtStyleSelector.css'

function ArtStyleSelector({ selectedStyle, setSelectedStyle, customText, setCustomText, userName }) {
  // Auto-populate name when "name" style is selected
  useEffect(() => {
    if (selectedStyle === 'name' && userName && !customText) {
      setCustomText(userName.toUpperCase())
    }
  }, [selectedStyle, userName, customText, setCustomText])
  const styles = [
    { id: 'rainbow', name: 'Rainbow', description: 'Colorful gradient effect' },
    { id: 'spiral', name: 'Spiral', description: 'Contributions spiral outward' },
    { id: 'text', name: 'Custom Text', description: 'Shape contributions into text' },
    { id: 'name', name: 'Your Name', description: 'Spell out your name in commits' },
    { id: 'heatmap', name: 'Heatmap', description: 'Intensity-based color mapping' },
    { id: 'pixel', name: 'Pixel Art', description: 'Retro pixel-style rendering' }
  ]

  return (
    <div className="style-selector">
      <h2>Choose Your Art Style</h2>
      <div className="styles-grid">
        {styles.map(style => (
          <div
            key={style.id}
            className={`style-card ${selectedStyle === style.id ? 'selected' : ''}`}
            onClick={() => setSelectedStyle(style.id)}
          >
            <h3>{style.name}</h3>
            <p>{style.description}</p>
          </div>
        ))}
      </div>
      
      {(selectedStyle === 'text' || selectedStyle === 'name') && (
        <div className="custom-text-input">
          <input
            type="text"
            placeholder={selectedStyle === 'name' ? userName || 'Enter your name' : 'Enter custom text'}
            value={customText}
            onChange={(e) => setCustomText(e.target.value.toUpperCase())}
            maxLength={20}
          />
          {selectedStyle === 'name' && userName && (
            <p className="auto-detected">Auto-detected: {userName}</p>
          )}
        </div>
      )}
    </div>
  )
}

export default ArtStyleSelector
