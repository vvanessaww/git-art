import { useEffect, useRef } from 'react'
import './ContributionArt.css'
import { renderClassic, renderWave, renderSpiral, renderName, renderHeart, renderRandom } from '../utils/artRenderers'

function ContributionArt({ data, style, username }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !data) return

    const ctx = canvas.getContext('2d')
    
    // Set canvas size
    canvas.width = 1200
    canvas.height = 800
    
    // Clear canvas
    ctx.fillStyle = '#0d1117'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Render based on selected style
    switch (style) {
      case 'classic':
        renderClassic(ctx, data, canvas.width, canvas.height)
        break
      case 'wave':
        renderWave(ctx, data, canvas.width, canvas.height)
        break
      case 'spiral':
        renderSpiral(ctx, data, canvas.width, canvas.height)
        break
      case 'name':
        renderName(ctx, data, canvas.width, canvas.height, username)
        break
      case 'heart':
        renderHeart(ctx, data, canvas.width, canvas.height)
        break
      case 'random':
        renderRandom(ctx, data, canvas.width, canvas.height)
        break
      default:
        renderClassic(ctx, data, canvas.width, canvas.height)
    }
  }, [data, style, username])

  const downloadArt = () => {
    const canvas = canvasRef.current
    const link = document.createElement('a')
    link.download = `git-art-${username}-${style}.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  return (
    <div className="contribution-art">
      <canvas ref={canvasRef} />
      <button className="download-btn" onClick={downloadArt}>
        📥 Download Art
      </button>
    </div>
  )
}

export default ContributionArt
