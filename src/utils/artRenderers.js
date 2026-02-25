// Color schemes based on contribution levels
const COLORS = {
  0: '#161b22',
  1: '#0e4429',
  2: '#006d32',
  3: '#26a641',
  4: '#39d353'
}

// Get contribution level (0-4) based on count
function getLevel(count, max) {
  if (count === 0) return 0
  const ratio = count / max
  if (ratio < 0.25) return 1
  if (ratio < 0.5) return 2
  if (ratio < 0.75) return 3
  return 4
}

// Process contribution data into a flat array
function processData(data) {
  const contributions = []
  let maxCount = 0
  
  data.contributions.forEach(week => {
    week.days.forEach(day => {
      contributions.push({
        date: day.date,
        count: day.count,
        level: day.level
      })
      maxCount = Math.max(maxCount, day.count)
    })
  })
  
  return { contributions, maxCount }
}

// Classic GitHub grid
export function renderClassic(ctx, data, width, height) {
  const { contributions } = processData(data)
  const cellSize = 12
  const gap = 3
  const cols = 53 // weeks in a year
  const rows = 7
  
  const startX = (width - (cols * (cellSize + gap))) / 2
  const startY = (height - (rows * (cellSize + gap))) / 2
  
  contributions.forEach((day, index) => {
    const col = Math.floor(index / 7)
    const row = index % 7
    
    const x = startX + col * (cellSize + gap)
    const y = startY + row * (cellSize + gap)
    
    ctx.fillStyle = COLORS[day.level]
    ctx.fillRect(x, y, cellSize, cellSize)
  })
}

// Wave pattern
export function renderWave(ctx, data, width, height) {
  const { contributions } = processData(data)
  const cellSize = 10
  const amplitude = 100
  
  contributions.forEach((day, index) => {
    const x = (index / contributions.length) * width
    const baseY = height / 2
    const wave = Math.sin(index * 0.05) * amplitude
    const y = baseY + wave
    
    const size = cellSize + (day.level * 3)
    ctx.fillStyle = COLORS[day.level]
    ctx.fillRect(x - size/2, y - size/2, size, size)
  })
}

// Spiral pattern
export function renderSpiral(ctx, data, width, height) {
  const { contributions } = processData(data)
  const centerX = width / 2
  const centerY = height / 2
  const cellSize = 8
  
  contributions.forEach((day, index) => {
    const angle = index * 0.15
    const radius = index * 0.8
    
    const x = centerX + Math.cos(angle) * radius
    const y = centerY + Math.sin(angle) * radius
    
    const size = cellSize + (day.level * 2)
    ctx.fillStyle = COLORS[day.level]
    
    ctx.beginPath()
    ctx.arc(x, y, size/2, 0, Math.PI * 2)
    ctx.fill()
  })
}

// Heart shape
export function renderHeart(ctx, data, width, height) {
  const { contributions } = processData(data)
  
  contributions.forEach((day, index) => {
    const t = (index / contributions.length) * Math.PI * 2
    
    // Parametric heart equation
    const x = 16 * Math.pow(Math.sin(t), 3)
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t))
    
    const scale = 15
    const posX = width/2 + x * scale
    const posY = height/2 + y * scale
    
    const size = 8 + (day.level * 2)
    ctx.fillStyle = COLORS[day.level]
    
    ctx.beginPath()
    ctx.arc(posX, posY, size/2, 0, Math.PI * 2)
    ctx.fill()
  })
}

// Name-shaped contribution graph
export function renderName(ctx, data, width, height, username) {
  const { contributions } = processData(data)
  
  // Draw the text path
  ctx.font = 'bold 200px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  
  // Create text path
  const tempCanvas = document.createElement('canvas')
  tempCanvas.width = width
  tempCanvas.height = height
  const tempCtx = tempCanvas.getContext('2d')
  
  tempCtx.font = 'bold 200px Arial'
  tempCtx.textAlign = 'center'
  tempCtx.textBaseline = 'middle'
  tempCtx.fillStyle = 'white'
  tempCtx.fillText(username.toUpperCase(), width/2, height/2)
  
  // Get pixel data
  const imageData = tempCtx.getImageData(0, 0, width, height)
  const pixels = imageData.data
  
  // Find text pixels
  const textPixels = []
  for (let y = 0; y < height; y += 5) {
    for (let x = 0; x < width; x += 5) {
      const index = (y * width + x) * 4
      if (pixels[index + 3] > 128) { // Alpha channel
        textPixels.push({ x, y })
      }
    }
  }
  
  // Map contributions to text pixels
  if (textPixels.length > 0) {
    contributions.forEach((day, index) => {
      const pixelIndex = Math.floor((index / contributions.length) * textPixels.length)
      const pixel = textPixels[pixelIndex % textPixels.length]
      
      if (pixel) {
        const size = 5 + (day.level * 2)
        ctx.fillStyle = COLORS[day.level]
        ctx.fillRect(pixel.x - size/2, pixel.y - size/2, size, size)
      }
    })
  }
}

// Random artistic arrangement
export function renderRandom(ctx, data, width, height) {
  const { contributions } = processData(data)
  
  contributions.forEach((day, index) => {
    // Deterministic "random" based on index
    const seed = index * 9301 + 49297
    const random1 = (seed % 233280) / 233280
    const random2 = ((seed * 7) % 233280) / 233280
    
    const x = random1 * width
    const y = random2 * height
    
    const size = 10 + (day.level * 5)
    ctx.fillStyle = COLORS[day.level]
    
    // Random shapes
    if (index % 3 === 0) {
      ctx.fillRect(x - size/2, y - size/2, size, size)
    } else {
      ctx.beginPath()
      ctx.arc(x, y, size/2, 0, Math.PI * 2)
      ctx.fill()
    }
  })
}
