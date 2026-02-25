import { useEffect, useRef } from 'react'
import './ContributionCanvas.css'
import { getLetterPattern } from '../utils/letterPatterns'

function ContributionCanvas({ contributionData, style, customText }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!contributionData || contributionData.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    // Set canvas size based on actual data and screen size
    const isMobile = window.innerWidth < 768
    const cellSize = isMobile ? 8 : 12
    const gap = isMobile ? 1 : 2
    const weeks = Math.ceil(contributionData.length / 7)
    const days = 7
    canvas.width = weeks * (cellSize + gap)
    canvas.height = days * (cellSize + gap)

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Render based on selected style
    switch (style) {
      case 'default':
        renderDefault(ctx, contributionData, cellSize, gap, canvas)
        break
      case 'rainbow':
        renderRainbow(ctx, contributionData, cellSize, gap, canvas)
        break
      case 'wave':
        renderWave(ctx, contributionData, cellSize, gap, canvas)
        break
      case 'spiral':
        renderSpiral(ctx, contributionData, cellSize, gap, canvas)
        break
      case 'text':
      case 'name':
        renderText(ctx, contributionData, cellSize, gap, customText || 'HELLO', canvas)
        break
      case 'heatmap':
        renderHeatmap(ctx, contributionData, cellSize, gap, canvas)
        break
      case 'pixel':
        renderPixel(ctx, contributionData, cellSize, gap, canvas)
        break
      default:
        renderDefault(ctx, contributionData, cellSize, gap, canvas)
    }
  }, [contributionData, style, customText])

  const renderDefault = (ctx, data, cellSize, gap, canvas) => {
    const colors = ['#001100', '#003300', '#00aa00', '#00dd00', '#00ff00']
    data.forEach((day, index) => {
      const x = Math.floor(index / 7) * (cellSize + gap)
      const y = (index % 7) * (cellSize + gap)
      ctx.fillStyle = colors[day.level] || colors[0]
      ctx.fillRect(x, y, cellSize, cellSize)
      
      // Add terminal-style border
      ctx.strokeStyle = '#00ff0033'
      ctx.lineWidth = 0.5
      ctx.strokeRect(x, y, cellSize, cellSize)
    })
  }

  const renderRainbow = (ctx, data, cellSize, gap, canvas) => {
    data.forEach((day, index) => {
      const x = Math.floor(index / 7) * (cellSize + gap)
      const y = (index % 7) * (cellSize + gap)
      const hue = (index / data.length) * 360
      // Mix rainbow hue with contribution level for brightness
      const lightness = day.level === 0 ? 10 : 30 + (day.level * 15)
      const saturation = day.level === 0 ? 20 : 70 + (day.level * 5)
      ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`
      ctx.fillRect(x, y, cellSize, cellSize)
    })
  }

  const renderWave = (ctx, data, cellSize, gap, canvas) => {
    data.forEach((day, index) => {
      const x = Math.floor(index / 7) * (cellSize + gap)
      const y = (index % 7) * (cellSize + gap)
      // Create wave pattern that respects contribution levels
      const wave = Math.sin(index / 15) * 20 + 40
      const brightness = day.level === 0 ? 10 : wave + (day.level * 10)
      ctx.fillStyle = `hsl(160, 80%, ${brightness}%)`
      ctx.fillRect(x, y, cellSize, cellSize)
    })
  }

  const renderSpiral = (ctx, data, cellSize, gap, canvas) => {
    // Clear background
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const maxRadius = Math.min(centerX, centerY) * 0.9
    
    data.forEach((day, index) => {
      const angle = (index / data.length) * Math.PI * 8 // More spirals
      const radius = (index / data.length) * maxRadius
      const x = centerX + Math.cos(angle) * radius
      const y = centerY + Math.sin(angle) * radius
      const intensity = day.level / 4
      
      // Terminal green with glow
      const alpha = 0.3 + intensity * 0.7
      ctx.fillStyle = `rgba(0, 255, 0, ${alpha})`
      ctx.fillRect(x - cellSize / 2, y - cellSize / 2, cellSize, cellSize)
      
      // Add glow for active cells
      if (day.level > 0) {
        ctx.shadowColor = '#00ff00'
        ctx.shadowBlur = 5
        ctx.fillRect(x - cellSize / 2, y - cellSize / 2, cellSize, cellSize)
        ctx.shadowBlur = 0
      }
    })
  }

  const renderText = (ctx, data, cellSize, gap, text, canvas) => {
    if (!text || text.length === 0) {
      text = 'HELLO'
    }
    
    const colors = ['#001100', '#003300', '#00aa00', '#00dd00', '#00ff00']
    
    // Get letter patterns
    const letters = text.toUpperCase().split('').map(char => getLetterPattern(char))
    const letterWidth = 5
    const letterHeight = 7
    const letterSpacing = 1
    
    // Calculate grid dimensions from actual data
    const weeks = Math.ceil(data.length / 7)
    const days = 7
    
    // Calculate total width needed
    const totalWidth = letters.length * (letterWidth + letterSpacing) - letterSpacing
    const startX = Math.floor((weeks - totalWidth) / 2)
    const startY = Math.floor((days - letterHeight) / 2)
    
    // First fill background with all contribution data
    data.forEach((day, index) => {
      const x = Math.floor(index / 7) * (cellSize + gap)
      const y = (index % 7) * (cellSize + gap)
      ctx.fillStyle = colors[0]
      ctx.fillRect(x, y, cellSize, cellSize)
    })
    
    // Then draw letters on top
    let currentX = startX
    letters.forEach(letter => {
      for (let row = 0; row < letterHeight; row++) {
        for (let col = 0; col < letterWidth; col++) {
          if (letter[row][col] === 1) {
            const x = (currentX + col) * (cellSize + gap)
            const y = (startY + row) * (cellSize + gap)
            
            // Use contribution data to determine color intensity
            const dataIndex = ((currentX + col) * 7 + (startY + row)) % data.length
            const level = data[dataIndex]?.level || 0
            ctx.fillStyle = level > 0 ? colors[level] : colors[3]
            ctx.fillRect(x, y, cellSize, cellSize)
            
            // Add glow effect for letters
            ctx.strokeStyle = '#00ff0066'
            ctx.lineWidth = 1
            ctx.strokeRect(x, y, cellSize, cellSize)
          }
        }
      }
      currentX += letterWidth + letterSpacing
    })
  }

  const renderHeatmap = (ctx, data, cellSize, gap, canvas) => {
    const maxLevel = Math.max(...data.map(d => d.level), 1)
    data.forEach((day, index) => {
      const x = Math.floor(index / 7) * (cellSize + gap)
      const y = (index % 7) * (cellSize + gap)
      const intensity = day.level / maxLevel
      // Terminal green heatmap
      ctx.fillStyle = `rgb(0, ${Math.floor(255 * intensity)}, 0)`
      ctx.fillRect(x, y, cellSize, cellSize)
    })
  }

  const renderPixel = (ctx, data, cellSize, gap, canvas) => {
    data.forEach((day, index) => {
      const x = Math.floor(index / 7) * (cellSize + gap)
      const y = (index % 7) * (cellSize + gap)
      // Pixelated effect with green terminal colors
      const colors = ['#001100', '#003300', '#00aa00', '#00dd00', '#00ff00']
      ctx.fillStyle = colors[day.level] || colors[0]
      ctx.fillRect(x, y, cellSize, cellSize)
      // Sharp pixel borders
      ctx.strokeStyle = '#000000'
      ctx.lineWidth = 1
      ctx.strokeRect(x, y, cellSize, cellSize)
    })
  }

  const downloadArt = () => {
    const canvas = canvasRef.current
    const link = document.createElement('a')
    link.download = `git-art-${style}-${Date.now()}.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  return (
    <div className="contribution-canvas">
      <canvas ref={canvasRef} />
      <button onClick={downloadArt} className="download-btn">
        Download Art
      </button>
    </div>
  )
}

export default ContributionCanvas
