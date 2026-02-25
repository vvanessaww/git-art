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
    const statsPadding = showStats ? 40 : 0
    const topPadding = 20 // Space for month labels
    const rightPadding = cellSize + gap * 2 // Extra padding for right edge
    const bottomPadding = cellSize + gap * 2 // Extra padding for bottom edge
    // Add padding to prevent cutoff on all edges
    canvas.width = weeks * (cellSize + gap) + rightPadding
    canvas.height = days * (cellSize + gap) + bottomPadding + statsPadding + topPadding

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Render based on selected style first
    const gridStyles = ['rainbow', 'heatmap', 'pixel', 'text', 'name']

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
      case 'tetris':
        renderTetris(ctx, contributionData, cellSize, gap, canvas)
        break
      case 'audio':
        renderAudioVisualizer(ctx, contributionData, cellSize, gap, canvas)
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
    
    // Draw month labels at the top (AFTER rendering the graph, only for grid-based styles)
    if (gridStyles.includes(style)) {
      ctx.fillStyle = '#00ff00'
      ctx.font = 'bold 11px "Courier New", monospace'
      ctx.textAlign = 'left'
      
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const currentYear = new Date().getFullYear()
      let currentMonth = -1
      
      contributionData.forEach((day, index) => {
        const weekIndex = Math.floor(index / 7)
        const date = new Date(day.date)
        const month = date.getMonth()
        const year = date.getFullYear()
        
        // Only draw label when month changes, it's the start of a week, and it's from current year
        if (month !== currentMonth && index % 7 === 0 && year === currentYear) {
          currentMonth = month
          const x = weekIndex * (cellSize + gap)
          ctx.fillText(monthNames[month], x, 14)
        }
      })
    }
    
    // Render stats text at the bottom if enabled
    if (showStats && username) {
      const totalCommits = contributionData.reduce((sum, day) => sum + day.count, 0)
      const graphHeight = days * (cellSize + gap) + topPadding
      
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
    const topOffset = 20 // Offset for month labels
    data.forEach((day, index) => {
      const x = Math.floor(index / 7) * (cellSize + gap)
      const y = (index % 7) * (cellSize + gap) + topOffset
      ctx.fillStyle = colors[day.level] || colors[0]
      ctx.fillRect(x, y, cellSize, cellSize)
      
      // Add terminal-style border
      ctx.strokeStyle = '#00ff0033'
      ctx.lineWidth = 0.5
      ctx.strokeRect(x, y, cellSize, cellSize)
    })
  }

  const renderRainbow = (ctx, data, cellSize, gap, canvas) => {
    const topOffset = 20 // Offset for month labels
    data.forEach((day, index) => {
      const x = Math.floor(index / 7) * (cellSize + gap)
      const y = (index % 7) * (cellSize + gap) + topOffset
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
    const maxRadius = Math.min(centerX, centerY) * 0.9
    
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
  }

  const renderText = (ctx, data, cellSize, gap, text, canvas) => {
    if (!text || text.length === 0) {
      text = 'HELLO'
    }
    
    const colors = ['#001100', '#003300', '#00aa00', '#00dd00', '#00ff00']
    const topOffset = 20 // Offset for month labels
    
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
      const y = (index % 7) * (cellSize + gap) + topOffset
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
            const y = (startY + row) * (cellSize + gap) + topOffset
            
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
    const topOffset = 20 // Offset for month labels
    data.forEach((day, index) => {
      const x = Math.floor(index / 7) * (cellSize + gap)
      const y = (index % 7) * (cellSize + gap) + topOffset
      
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

  const renderTetris = (ctx, data, cellSize, gap, canvas) => {
    // Clear to black background
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Tetris block colors (classic Tetris palette)
    const tetrisColors = [
      '#000000', // Empty (black)
      '#00f0f0', // Cyan (I-piece)
      '#f0f000', // Yellow (O-piece)
      '#a000f0', // Purple (T-piece)
      '#00f000', // Green (S-piece)
      '#f00000', // Red (Z-piece)
      '#0000f0', // Blue (J-piece)
      '#f0a000'  // Orange (L-piece)
    ]
    
    // Group data by weeks for stacking
    const weeks = Math.ceil(data.length / 7)
    for (let week = 0; week < weeks; week++) {
      const weekData = data.slice(week * 7, (week + 1) * 7)
      const weekTotal = weekData.reduce((sum, day) => sum + day.level, 0)
      
      // Calculate stack height based on week's total activity
      const maxHeight = canvas.height - gap * 2
      const stackHeight = (weekTotal / (7 * 4)) * maxHeight // Normalize
      
      // Draw stacked blocks from bottom up
      const x = week * (cellSize + gap)
      const numBlocks = Math.ceil(stackHeight / cellSize)
      
      for (let block = 0; block < numBlocks; block++) {
        const y = canvas.height - (block + 1) * cellSize - gap
        const colorIndex = (block % 7) + 1 // Cycle through Tetris colors
        
        // Draw Tetris block with border
        ctx.fillStyle = tetrisColors[colorIndex]
        ctx.fillRect(x, y, cellSize, cellSize)
        
        // Add block border for Tetris look
        ctx.strokeStyle = '#000000'
        ctx.lineWidth = 2
        ctx.strokeRect(x, y, cellSize, cellSize)
        
        // Add highlight for 3D effect
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
        ctx.lineWidth = 1
        ctx.strokeRect(x + 1, y + 1, cellSize - 2, cellSize - 2)
      }
    }
  }

  const renderAudioVisualizer = (ctx, data, cellSize, gap, canvas) => {
    // Clear to dark background
    ctx.fillStyle = '#0a0a0a'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Group data by weeks
    const numWeeks = Math.ceil(data.length / 7)
    const barWidth = Math.floor(canvas.width / numWeeks) - gap
    
    for (let weekIndex = 0; weekIndex < numWeeks; weekIndex++) {
      const weekData = data.slice(weekIndex * 7, (weekIndex + 1) * 7)
      const weekAvg = weekData.reduce((sum, day) => sum + day.level, 0) / weekData.length
      
      // Calculate bar height
      const maxHeight = canvas.height - 40
      const barHeight = (weekAvg / 4) * maxHeight
      
      const x = weekIndex * (barWidth + gap)
      const y = canvas.height - barHeight - 20
      
      // Create gradient for each bar (bottom to top)
      const gradient = ctx.createLinearGradient(x, canvas.height, x, y)
      gradient.addColorStop(0, '#ff0080') // Pink at bottom
      gradient.addColorStop(0.5, '#00d4ff') // Cyan in middle
      gradient.addColorStop(1, '#00ff88') // Green at top
      
      // Draw bar with glow
      ctx.shadowColor = weekAvg > 2 ? '#00ff88' : '#00d4ff'
      ctx.shadowBlur = weekAvg * 5
      ctx.fillStyle = gradient
      ctx.fillRect(x, y, barWidth, barHeight)
      
      // Add reflection at bottom
      ctx.shadowBlur = 0
      ctx.fillStyle = `rgba(0, 212, 255, ${0.2 * (weekAvg / 4)})`
      ctx.fillRect(x, canvas.height - 15, barWidth, 10)
      
      // Add bright cap on top for high activity
      if (weekAvg >= 3) {
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(x, y - 3, barWidth, 3)
      }
    }
    
    ctx.shadowBlur = 0
  }

  const renderPixel = (ctx, data, cellSize, gap, canvas) => {
    const topOffset = 20 // Offset for month labels
    data.forEach((day, index) => {
      const x = Math.floor(index / 7) * (cellSize + gap)
      const y = (index % 7) * (cellSize + gap) + topOffset
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
