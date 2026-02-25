import { useState } from 'react'
import './App.css'
import ContributionArt from './components/ContributionArt'
import StyleSelector from './components/StyleSelector'
import UsernameInput from './components/UsernameInput'

function App() {
  const [username, setUsername] = useState('')
  const [selectedStyle, setSelectedStyle] = useState('classic')
  const [contributionData, setContributionData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchContributions = async (user) => {
    setLoading(true)
    setError(null)
    
    try {
      // GitHub API to fetch contribution data
      const response = await fetch(`https://github-contributions-api.jogruber.de/v4/${user}`)
      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }
      
      setContributionData(data)
      setUsername(user)
    } catch (err) {
      setError(err.message || 'Failed to fetch contributions')
      setContributionData(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <header>
        <h1>🎨 Git Art Generator</h1>
        <p>Transform your GitHub contribution graph into art</p>
      </header>

      <UsernameInput onSubmit={fetchContributions} loading={loading} />

      {error && (
        <div className="error">
          ⚠️ {error}
        </div>
      )}

      {contributionData && (
        <>
          <StyleSelector 
            selectedStyle={selectedStyle}
            onStyleChange={setSelectedStyle}
            username={username}
          />
          
          <ContributionArt 
            data={contributionData}
            style={selectedStyle}
            username={username}
          />
        </>
      )}

      <footer>
        <p>Built with ❤️ for GitHub artists</p>
      </footer>
    </div>
  )
}

export default App
