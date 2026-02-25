import { useState } from 'react'
import './UsernameInput.css'

function UsernameInput({ onSubmit, loading }) {
  const [input, setInput] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim()) {
      onSubmit(input.trim())
    }
  }

  return (
    <form className="username-input" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter GitHub username"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={loading}
      />
      <button type="submit" disabled={loading || !input.trim()}>
        {loading ? 'Loading...' : 'Generate Art'}
      </button>
    </form>
  )
}

export default UsernameInput
