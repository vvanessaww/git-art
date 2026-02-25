import { useState } from 'react'
import './App.css'
import ContributionFetcher from './components/ContributionFetcher'
import ArtStyleSelector from './components/ArtStyleSelector'
import ContributionCanvas from './components/ContributionCanvas'

function App() {
  const [username, setUsername] = useState('')
  const [contributionData, setContributionData] = useState(null)
  const [selectedStyle, setSelectedStyle] = useState('rainbow')
  const [customText, setCustomText] = useState('')
  const [userName, setUserName] = useState('')
  const [showStats, setShowStats] = useState(true)

  return (
    <div className="App">
      <header>
        <h1>Git Art Generator</h1>
        <p>Transform your GitHub contribution graph into art</p>
      </header>
      
      <main>
        <ContributionFetcher 
          username={username}
          setUsername={setUsername}
          setContributionData={setContributionData}
          setUserName={setUserName}
        />
        
        {contributionData && (
          <>
            <ArtStyleSelector 
              selectedStyle={selectedStyle}
              setSelectedStyle={setSelectedStyle}
              customText={customText}
              setCustomText={setCustomText}
              userName={userName}
              showStats={showStats}
              setShowStats={setShowStats}
            />
            
            <ContributionCanvas 
              contributionData={contributionData}
              style={selectedStyle}
              customText={customText}
              username={username}
              showStats={showStats}
            />
          </>
        )}
      </main>
      
      <footer className="app-footer">
        <div className="footer-links">
          <a href="https://github.com/vvanessaww/git-art" target="_blank" rel="noopener noreferrer">
            [ about this project ]
          </a>
          <span className="footer-divider">•</span>
          <a href="https://github.com/vvanessaww" target="_blank" rel="noopener noreferrer">
            [ github ]
          </a>
          <span className="footer-divider">•</span>
          <a href="https://linkedin.com/in/vvanessaww" target="_blank" rel="noopener noreferrer">
            [ linkedin ]
          </a>
        </div>
        <p className="footer-credit">made with 🖤 by vanessa</p>
      </footer>
    </div>
  )
}

export default App
