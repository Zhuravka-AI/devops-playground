import { useState } from 'react'
import './App.css'

function App() {
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const analyzeText = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: text })
      })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error("Error calling API:", error)
      alert("API is not responding")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="App">
      <h1>DevOps Playground</h1>
      <textarea 
        value={text} 
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter your text for analysis..."
      />
      <br />
      <button onClick={analyzeText} disabled={loading}>
        {loading ? 'Analysing...' : 'Analyse'}
      </button>
      
      {result && (
        <div className="result">
          <h3>Result:</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}

export default App