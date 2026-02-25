import { useState } from 'react'
import './ContributionFetcher.css'

function ContributionFetcher({ username, setUsername, setContributionData, setUserName }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchContributions = async () => {
    if (!username.trim()) {
      setError('Please enter a GitHub username')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Fetch user profile data
      const profileResponse = await fetch(`https://api.github.com/users/${username}`)
      
      if (!profileResponse.ok) {
        throw new Error(profileResponse.status === 404 ? 'User not found' : 'Failed to fetch data')
      }
      
      const profile = await profileResponse.json()
      const name = profile.name || username
      setUserName(name)
      
      // Fetch actual contribution graph data using CORS proxy
      const corsProxy = 'https://corsproxy.io/?'
      const contributionsUrl = `https://github.com/users/${username}/contributions`
      
      const contribResponse = await fetch(corsProxy + encodeURIComponent(contributionsUrl))
      const html = await contribResponse.text()
      
      // Parse the SVG contribution graph
      const parser = new DOMParser()
      const doc = parser.parseFromString(html, 'text/html')
      const rects = doc.querySelectorAll('rect.ContributionCalendar-day')
      
      if (rects.length === 0) {
        throw new Error('No contribution data found')
      }
      
      const contributions = Array.from(rects).map(rect => {
        const date = rect.getAttribute('data-date')
        const level = parseInt(rect.getAttribute('data-level')) || 0
        const count = parseInt(rect.getAttribute('data-count') || rect.textContent) || 0
        
        return {
          date,
          count,
          level
        }
      })

      setContributionData(contributions)
    } catch (err) {
      setError(`Failed to fetch contributions: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="contribution-fetcher">
      <div className="input-group">
        <input
          type="text"
          placeholder="Enter GitHub username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && fetchContributions()}
        />
        <button onClick={fetchContributions} disabled={loading}>
          {loading ? 'Loading...' : 'Generate Art'}
        </button>
      </div>
      {error && <div className="error">{error}</div>}
    </div>
  )
}

export default ContributionFetcher
