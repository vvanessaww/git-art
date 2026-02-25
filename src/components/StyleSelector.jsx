import './StyleSelector.css'

const STYLES = [
  { id: 'classic', name: 'Classic Grid', description: 'Traditional GitHub contribution graph' },
  { id: 'wave', name: 'Wave', description: 'Flowing wave pattern' },
  { id: 'spiral', name: 'Spiral', description: 'Spiral from center' },
  { id: 'name', name: 'Your Name', description: 'Commits shaped as your name' },
  { id: 'heart', name: 'Heart', description: 'Love your contributions' },
  { id: 'random', name: 'Random Art', description: 'Surprise me!' },
]

function StyleSelector({ selectedStyle, onStyleChange, username }) {
  return (
    <div className="style-selector">
      <h2>Choose Your Style</h2>
      <div className="style-grid">
        {STYLES.map(style => (
          <button
            key={style.id}
            className={`style-card ${selectedStyle === style.id ? 'selected' : ''}`}
            onClick={() => onStyleChange(style.id)}
          >
            <div className="style-name">{style.name}</div>
            <div className="style-description">
              {style.id === 'name' ? `Spell "${username}"` : style.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default StyleSelector
