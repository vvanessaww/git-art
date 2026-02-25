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
      // Fetch user profile data for name
      const profileResponse = await fetch(`https://api.github.com/users/${username}`)
      
      if (!profileResponse.ok) {
        throw new Error(profileResponse.status === 404 ? 'User not found' : 'Failed to fetch data')
      }
      
      const profile = await profileResponse.json()
      const name = profile.name || username
      setUserName(name)
      
      // Use github-contributions-api to get actual contribution calendar data
      const year = new Date().getFullYear()
      const contribResponse = await fetch(
        `https://github-contributions-api.jogruber.de/v4/${username}?y=${year}`
      )
      
      if (!contribResponse.ok) {
        throw new Error('Failed to fetch contribution data')
      }
      
      const contribData = await contribResponse.json()
      
      // Parse contribution data
      const contributions = []
      
      contribData.contributions.forEach(day => {
        // Calculate level (0-4) based on contribution count
        let level = 0
        if (day.count > 0) {
          if (day.count >= 20) level = 4
          else if (day.count >= 10) level = 3
          else if (day.count >= 5) level = 2
          else level = 1
        }
        
        contributions.push({
          date: day.date,
          count: day.count,
          level: level
        })
      })
      
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
          onChange={(e) => setUsername(e.target.value.toLowerCase())}
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
