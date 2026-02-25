import { useState } from 'react'
import './ContributionFetcher.css'

function ContributionFetcher({ username, setUsername, setContributionData }) {
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
      // GitHub's contribution graph uses SVG data
      // We'll scrape the user's profile page for contribution data
      const response = await fetch(`https://github.com/users/${username}/contributions`)
      const html = await response.text()
      
      // Parse the contribution graph SVG
      const parser = new DOMParser()
      const doc = parser.parseFromString(html, 'text/html')
      const rects = doc.querySelectorAll('svg.js-calendar-graph-svg rect.ContributionCalendar-day')
      
      const contributions = Array.from(rects).map(rect => ({
        date: rect.getAttribute('data-date'),
        count: parseInt(rect.getAttribute('data-level')) || 0,
        level: parseInt(rect.getAttribute('data-level')) || 0
      }))

      if (contributions.length === 0) {
        throw new Error('No contribution data found')
      }

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
