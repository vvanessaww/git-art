import { useEffect } from 'react'
import './ArtStyleSelector.css'

function ArtStyleSelector({ selectedStyle, setSelectedStyle, customText, setCustomText, userName, showStats, setShowStats }) {
  // Auto-populate name when "name" style is selected (first name only)
  useEffect(() => {
    if (selectedStyle === 'name' && userName && !customText) {
      const firstName = userName.split(' ')[0]
      setCustomText(firstName.toUpperCase())
    }
  }, [selectedStyle, userName, customText, setCustomText])
  const styles = [
    { id: 'rainbow', name: 'Rainbow', description: 'Colorful gradient effect' },
    { id: 'tetris', name: 'Tetris', description: 'Blocks stacking based on activity' },
    { id: 'audio', name: 'Audio Visualizer', description: 'Equalizer bars dancing to commits' },
    { id: 'pacman', name: 'Pac-Man', description: 'Classic arcade maze with ghosts' },
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
            <p className="auto-detected">Auto-detected: {userName.split(' ')[0]}</p>
          )}
          {customText.length > 9 && (
            <p className="text-warning">⚠️ Text over 9 characters may not fit on the graph</p>
          )}
        </div>
      )}
      
      <div className="stats-toggle">
        <label>
          <input
            type="checkbox"
            checked={showStats}
            onChange={(e) => setShowStats(e.target.checked)}
          />
          <span>Show username and commit count</span>
        </label>
      </div>
    </div>
  )
}

export default ArtStyleSelector
