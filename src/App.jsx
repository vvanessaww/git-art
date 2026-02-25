import { useState } from 'react'
import './App.css'
import ContributionFetcher from './components/ContributionFetcher'
import ArtStyleSelector from './components/ArtStyleSelector'
import ContributionCanvas from './components/ContributionCanvas'

function App() {
  const [username, setUsername] = useState('')
  const [contributionData, setContributionData] = useState(null)
  const [selectedStyle, setSelectedStyle] = useState('default')
  const [customText, setCustomText] = useState('')

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
        />
        
        {contributionData && (
          <>
            <ArtStyleSelector 
              selectedStyle={selectedStyle}
              setSelectedStyle={setSelectedStyle}
              customText={customText}
              setCustomText={setCustomText}
            />
            
            <ContributionCanvas 
              contributionData={contributionData}
              style={selectedStyle}
              customText={customText}
            />
          </>
        )}
      </main>
    </div>
  )
}

export default App
