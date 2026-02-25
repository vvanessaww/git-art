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
      
      // Use GitHub GraphQL API to get actual contribution data
      const query = `
        query($username: String!) {
          user(login: $username) {
            contributionsCollection {
              contributionCalendar {
                weeks {
                  contributionDays {
                    date
                    contributionCount
                    contributionLevel
                  }
                }
              }
            }
          }
        }
      `
      
      const graphqlResponse = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: { username }
        })
      })

      const graphqlData = await graphqlResponse.json()
      
      if (graphqlData.errors) {
        throw new Error('Unable to fetch contribution data')
      }

      // Parse contribution data from GraphQL response
      const weeks = graphqlData.data?.user?.contributionsCollection?.contributionCalendar?.weeks || []
      const contributions = []
      
      weeks.forEach(week => {
        week.contributionDays.forEach(day => {
          // Map contributionLevel (NONE, FIRST_QUARTILE, SECOND_QUARTILE, THIRD_QUARTILE, FOURTH_QUARTILE) to 0-4
          const levelMap = {
            'NONE': 0,
            'FIRST_QUARTILE': 1,
            'SECOND_QUARTILE': 2,
            'THIRD_QUARTILE': 3,
            'FOURTH_QUARTILE': 4
          }
          
          contributions.push({
            date: day.date,
            count: day.contributionCount,
            level: levelMap[day.contributionLevel] || 0
          })
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
