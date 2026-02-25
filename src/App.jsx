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
  const [showAbout, setShowAbout] = useState(false)

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
          <button onClick={() => setShowAbout(!showAbout)} className="footer-link-btn">
            [ about this project {showAbout ? '−' : '+'} ]
          </button>
          <span className="footer-divider">•</span>
          <a href="https://github.com/vvanessaww" target="_blank" rel="noopener noreferrer">
            [ github ]
          </a>
          <span className="footer-divider">•</span>
          <a href="https://linkedin.com/in/vvanessaww" target="_blank" rel="noopener noreferrer">
            [ linkedin ]
          </a>
        </div>
        
        {showAbout && (
          <div className="about-section">
            <p>
              you can create art from anything—even your GitHub contributions. 
              add a personal touch to your commits and turn your coding journey into something beautiful. 
              choose from terminal-style visualizations, download your favorite, and share your unique developer story.
            </p>
            <a 
              href="https://github.com/vvanessaww/git-art" 
              target="_blank" 
              rel="noopener noreferrer"
              className="repo-link"
            >
              → view source on github
            </a>
          </div>
        )}
        
        <p className="footer-credit">made with 🖤 by vanessa</p>
      </footer>
    </div>
  )
}

export default App
