import { useState, useEffect, useRef } from 'react'
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
  const titleRef = useRef(null)

  useEffect(() => {
    // Remove cursor after typing animation completes
    const timer = setTimeout(() => {
      if (titleRef.current) {
        titleRef.current.style.borderRight = 'none'
      }
    }, 3000) // Match typing animation duration

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="App">
      <header>
        <h1 ref={titleRef}>Git Art Generator</h1>
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
    </div>
  )
}

export default App
