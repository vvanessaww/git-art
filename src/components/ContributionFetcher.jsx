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
      // Use GitHub's events API to get contribution data
      const response = await fetch(`https://api.github.com/users/${username}/events/public?per_page=100`)
      
      if (!response.ok) {
        throw new Error(response.status === 404 ? 'User not found' : 'Failed to fetch data')
      }

      const events = await response.json()
      
      // Generate a year's worth of contribution data based on events
      const contributions = []
      const today = new Date()
      const oneYearAgo = new Date(today)
      oneYearAgo.setFullYear(today.getFullYear() - 1)
      
      // Create contribution map from events
      const eventsByDate = {}
      events.forEach(event => {
        const date = new Date(event.created_at).toISOString().split('T')[0]
        eventsByDate[date] = (eventsByDate[date] || 0) + 1
      })
      
      // Fill 52 weeks * 7 days = 364 days
      for (let i = 0; i < 364; i++) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split('T')[0]
        const count = eventsByDate[dateStr] || 0
        const level = Math.min(4, Math.floor(count / 2))
        
        contributions.unshift({
          date: dateStr,
          count: count,
          level: level
        })
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
