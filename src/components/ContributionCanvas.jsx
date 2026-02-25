import { useEffect, useRef } from 'react'
import './ContributionCanvas.css'
import { getLetterPattern } from '../utils/letterPatterns'

function ContributionCanvas({ contributionData, style, customText, username, showStats }) {
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
    const bottomPadding = showStats ? 40 : 0
    canvas.width = weeks * (cellSize + gap)
    canvas.height = days * (cellSize + gap) + bottomPadding

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
    
    // Render stats text at the bottom if enabled
    if (showStats && username) {
      const totalCommits = contributionData.reduce((sum, day) => sum + day.count, 0)
      const graphHeight = days * (cellSize + gap)
      
      ctx.fillStyle = '#00ff00'
      ctx.font = 'bold 14px "Courier New", monospace'
      ctx.textAlign = 'center'
      ctx.fillText(
        `@${username} • ${totalCommits} commits in 2026`,
        canvas.width / 2,
        graphHeight + 25
      )
    }
  }, [contributionData, style, customText, username, showStats])

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
      const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`
      
      // Add glow effect based on contribution level
      if (day.level > 0) {
        const glowIntensity = day.level * 3
        ctx.shadowColor = color
        ctx.shadowBlur = glowIntensity
      }
      
      ctx.fillStyle = color
      ctx.fillRect(x, y, cellSize, cellSize)
      
      // Add brighter center for depth
      if (day.level >= 2) {
        ctx.shadowBlur = 0
        const centerColor = `hsl(${hue}, ${saturation}%, ${lightness + 20}%)`
        ctx.fillStyle = centerColor
        const centerSize = cellSize * 0.4
        const centerX = x + (cellSize - centerSize) / 2
        const centerY = y + (cellSize - centerSize) / 2
        ctx.fillRect(centerX, centerY, centerSize, centerSize)
      }
      
      ctx.shadowBlur = 0
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
    const maxRadius = Math.min(centerX, centerY) * 0.85
    
    // Draw center marker (start of year)
    ctx.fillStyle = '#00ff0044'
    ctx.beginPath()
    ctx.arc(centerX, centerY, 8, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#00ff00'
    ctx.font = 'bold 10px "Courier New"'
    ctx.textAlign = 'center'
    ctx.fillText('JAN', centerX, centerY + 20)
    
    data.forEach((day, index) => {
      // 3 complete rotations (easier to follow than 4)
      const angle = (index / data.length) * Math.PI * 6
      const radius = (index / data.length) * maxRadius
      const x = centerX + Math.cos(angle) * radius
      const y = centerY + Math.sin(angle) * radius
      
      // Use different colors and sizes based on contribution level
      let color, size
      switch (day.level) {
        case 0:
          color = '#1a1a2e' // Dark blue (no commits)
          size = cellSize * 0.4
          break
        case 1:
          color = '#00aa00' // Green
          size = cellSize * 0.6
          break
        case 2:
          color = '#ffd700' // Yellow
          size = cellSize * 0.8
          break
        case 3:
          color = '#ff8c00' // Orange
          size = cellSize * 1.0
          break
        case 4:
          color = '#ff4500' // Red (most active)
          size = cellSize * 1.3
          break
        default:
          color = '#1a1a2e'
          size = cellSize * 0.4
      }
      
      // Draw circular dots
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(x, y, size / 2, 0, Math.PI * 2)
      ctx.fill()
      
      // Add glow for high activity days
      if (day.level >= 3) {
        ctx.shadowColor = color
        ctx.shadowBlur = 10
        ctx.beginPath()
        ctx.arc(x, y, size / 2, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      }
    })
    
    // Draw outer label (end of year)
    ctx.fillStyle = '#00ff00'
    ctx.font = 'bold 10px "Courier New"'
    ctx.textAlign = 'center'
    ctx.fillText('DEC', centerX, centerY - maxRadius - 10)
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
    
    // First render ALL contribution data (full year of commits)
    data.forEach((day, index) => {
      const x = Math.floor(index / 7) * (cellSize + gap)
      const y = (index % 7) * (cellSize + gap)
      ctx.fillStyle = colors[day.level] || colors[0]
      ctx.fillRect(x, y, cellSize, cellSize)
      
      // Add subtle border
      ctx.strokeStyle = '#00ff0011'
      ctx.lineWidth = 0.5
      ctx.strokeRect(x, y, cellSize, cellSize)
    })
    
    // Then overlay text pattern in contrasting cyan/white color
    let currentX = startX
    letters.forEach(letter => {
      for (let row = 0; row < letterHeight; row++) {
        for (let col = 0; col < letterWidth; col++) {
          if (letter[row][col] === 1) {
            const x = (currentX + col) * (cellSize + gap)
            const y = (startY + row) * (cellSize + gap)
            
            // Draw text in bright cyan with transparency
            ctx.fillStyle = 'rgba(0, 255, 255, 0.7)'
            ctx.fillRect(x, y, cellSize, cellSize)
            
            // Add bright border for text
            ctx.strokeStyle = '#00ffff'
            ctx.lineWidth = 2
            ctx.strokeRect(x, y, cellSize, cellSize)
          }
        }
      }
      currentX += letterWidth + letterSpacing
    })
  }

  const renderHeatmap = (ctx, data, cellSize, gap, canvas) => {
    data.forEach((day, index) => {
      const x = Math.floor(index / 7) * (cellSize + gap)
      const y = (index % 7) * (cellSize + gap)
      
      // Heat map colors: navy blue -> green -> yellow -> orange -> red
      let color, glowIntensity
      switch (day.level) {
        case 0:
          color = '#1a1a2e' // Navy blue (cold - no commits)
          glowIntensity = 0
          break
        case 1:
          color = '#16c784' // Green (warming up)
          glowIntensity = 3
          break
        case 2:
          color = '#ffd700' // Yellow (getting hot)
          glowIntensity = 6
          break
        case 3:
          color = '#ff8c00' // Orange (hot)
          glowIntensity = 10
          break
        case 4:
          color = '#ff4500' // Red-orange (very hot!)
          glowIntensity = 15
          break
        default:
          color = '#1a1a2e'
          glowIntensity = 0
      }
      
      // Add glow effect
      if (glowIntensity > 0) {
        ctx.shadowColor = color
        ctx.shadowBlur = glowIntensity
      }
      
      ctx.fillStyle = color
      ctx.fillRect(x, y, cellSize, cellSize)
      
      // Add brighter center for high activity (depth effect)
      if (day.level >= 3) {
        ctx.shadowBlur = 0
        ctx.fillStyle = day.level === 4 ? '#ff6347' : '#ffa500'
        const centerSize = cellSize * 0.5
        const centerX = x + (cellSize - centerSize) / 2
        const centerY = y + (cellSize - centerSize) / 2
        ctx.fillRect(centerX, centerY, centerSize, centerSize)
      }
      
      ctx.shadowBlur = 0
      
      // Add subtle border
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)'
      ctx.lineWidth = 0.5
      ctx.strokeRect(x, y, cellSize, cellSize)
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
