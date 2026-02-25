import { useEffect, useRef } from 'react'
import './ContributionCanvas.css'
import { getLetterPattern } from '../utils/letterPatterns'

function ContributionCanvas({ contributionData, style, customText }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!contributionData || contributionData.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    // Set canvas size
    const cellSize = 12
    const gap = 2
    const weeks = 53
    const days = 7
    canvas.width = weeks * (cellSize + gap)
    canvas.height = days * (cellSize + gap)

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Render based on selected style
    switch (style) {
      case 'default':
        renderDefault(ctx, contributionData, cellSize, gap)
        break
      case 'rainbow':
        renderRainbow(ctx, contributionData, cellSize, gap)
        break
      case 'wave':
        renderWave(ctx, contributionData, cellSize, gap)
        break
      case 'spiral':
        renderSpiral(ctx, contributionData, cellSize, gap)
        break
      case 'text':
      case 'name':
        renderText(ctx, contributionData, cellSize, gap, customText || 'HELLO')
        break
      case 'heatmap':
        renderHeatmap(ctx, contributionData, cellSize, gap)
        break
      case 'pixel':
        renderPixel(ctx, contributionData, cellSize, gap)
        break
      default:
        renderDefault(ctx, contributionData, cellSize, gap)
    }
  }, [contributionData, style, customText])

  const renderDefault = (ctx, data, cellSize, gap) => {
    const colors = ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39']
    data.forEach((day, index) => {
      const x = Math.floor(index / 7) * (cellSize + gap)
      const y = (index % 7) * (cellSize + gap)
      ctx.fillStyle = colors[day.level] || colors[0]
      ctx.fillRect(x, y, cellSize, cellSize)
    })
  }

  const renderRainbow = (ctx, data, cellSize, gap) => {
    data.forEach((day, index) => {
      const x = Math.floor(index / 7) * (cellSize + gap)
      const y = (index % 7) * (cellSize + gap)
      const hue = (index / data.length) * 360
      const lightness = 50 + (day.level * 10)
      ctx.fillStyle = `hsl(${hue}, 70%, ${lightness}%)`
      ctx.fillRect(x, y, cellSize, cellSize)
    })
  }

  const renderWave = (ctx, data, cellSize, gap) => {
    data.forEach((day, index) => {
      const x = Math.floor(index / 7) * (cellSize + gap)
      const y = (index % 7) * (cellSize + gap)
      const wave = Math.sin(index / 10) * 30 + 50
      ctx.fillStyle = `hsl(200, 70%, ${wave + day.level * 10}%)`
      ctx.fillRect(x, y, cellSize, cellSize)
    })
  }

  const renderSpiral = (ctx, data, cellSize, gap) => {
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    data.forEach((day, index) => {
      const angle = (index / data.length) * Math.PI * 4
      const radius = (index / data.length) * Math.min(centerX, centerY)
      const x = centerX + Math.cos(angle) * radius
      const y = centerY + Math.sin(angle) * radius
      const intensity = day.level / 4
      ctx.fillStyle = `rgba(33, 110, 57, ${0.2 + intensity * 0.8})`
      ctx.fillRect(x - cellSize / 2, y - cellSize / 2, cellSize, cellSize)
    })
  }

  const renderText = (ctx, data, cellSize, gap, text) => {
    if (!text || text.length === 0) {
      text = 'HELLO'
    }
    
    const colors = ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39']
    
    // Get letter patterns
    const letters = text.toUpperCase().split('').map(char => getLetterPattern(char))
    const letterWidth = 5
    const letterHeight = 7
    const letterSpacing = 1
    
    // Calculate total width needed
    const totalWidth = letters.length * (letterWidth + letterSpacing) - letterSpacing
    const startX = Math.floor((53 - totalWidth) / 2)
    const startY = Math.floor((7 - letterHeight) / 2)
    
    // Draw letters using contribution blocks
    let currentX = startX
    letters.forEach(letter => {
      for (let row = 0; row < letterHeight; row++) {
        for (let col = 0; col < letterWidth; col++) {
          const x = (currentX + col) * (cellSize + gap)
          const y = (startY + row) * (cellSize + gap)
          
          if (letter[row][col] === 1) {
            // Use contribution data to determine color intensity
            const dataIndex = ((currentX + col) * 7 + (startY + row)) % data.length
            const level = data[dataIndex]?.level || Math.floor(Math.random() * 5)
            ctx.fillStyle = colors[level]
          } else {
            ctx.fillStyle = colors[0]
          }
          
          ctx.fillRect(x, y, cellSize, cellSize)
        }
      }
      currentX += letterWidth + letterSpacing
    })
  }

  const renderHeatmap = (ctx, data, cellSize, gap) => {
    const maxLevel = Math.max(...data.map(d => d.level))
    data.forEach((day, index) => {
      const x = Math.floor(index / 7) * (cellSize + gap)
      const y = (index % 7) * (cellSize + gap)
      const intensity = day.level / maxLevel
      ctx.fillStyle = `rgb(${255 * intensity}, ${100 - 80 * intensity}, ${50})`
      ctx.fillRect(x, y, cellSize, cellSize)
    })
  }

  const renderPixel = (ctx, data, cellSize, gap) => {
    data.forEach((day, index) => {
      const x = Math.floor(index / 7) * (cellSize + gap)
      const y = (index % 7) * (cellSize + gap)
      // Pixelated effect with sharp edges
      const colors = ['#000000', '#555555', '#888888', '#bbbbbb', '#ffffff']
      ctx.fillStyle = colors[day.level] || colors[0]
      ctx.fillRect(x, y, cellSize, cellSize)
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
