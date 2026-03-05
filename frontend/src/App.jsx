import { useState } from 'react'
import './App.css'
import SentryTest from './components/SentryTest';

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
      <div className="card">
        <textarea 
          value={text} 
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your text for analysis..."
          rows={5}
        />
        <br />
        <button onClick={analyzeText} disabled={loading || !text.trim()}>
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>
      
      {result && (
        <div className="result-container">
          <h3 className="result-title">Analysis Report</h3>
          <div className="result-grid">
            <div className="result-item">
              <span className="label">Characters:</span>
              <span className="value">{result.length}</span>
            </div>
            <div className="result-item">
              <span className="label">Words:</span>
              <span className="value">{result.words}</span>
            </div>
            <div className="result-item">
              <span className="label">Long Content:</span>
              <span className={`value status-${result.is_long ? 'warning' : 'success'}`}>
                {result.is_long ? 'YES' : 'NO'}
              </span>
            </div>
          </div>
        </div>
      )}
      <SentryTest />
    </div>
  )
}

export default App