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
    <div className="app-container">
      <header className="app-header">
        <h1 className="title-gradient">DevOps Playground</h1>
        <p className="subtitle">
          An interactive workspace demonstrating CI/CD pipelines, container orchestration, Sentry monitoring, and web application statistics.
        </p>
      </header>

      <main className="dashboard-grid">
        {/* Left Column: Text Analyzer */}
        <section className="glass-card">
          <h2 className="card-title">
            <span className="card-title-icon">📊</span> Text Analytics Engine
          </h2>
          
          <div className="form-group">
            <label htmlFor="text-analyzer-input" className="form-label">
              Input Text
            </label>
            <textarea 
              id="text-analyzer-input"
              className="text-area-input"
              value={text} 
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter your text for analysis..."
              rows={5}
              aria-describedby="textarea-description"
            />
            <div className="element-desc" id="textarea-description">
              <span className="desc-bullet">ℹ️</span>
              <span>
                <strong>Text Input:</strong> Enter any raw text here. It supports manual typing or copying/pasting. It must not be empty to enable the analysis tools.
              </span>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <button 
              id="btn-analyze"
              className="btn btn-primary"
              onClick={analyzeText} 
              disabled={loading || !text.trim()}
              aria-describedby="analyze-button-description"
            >
              {loading ? 'Analyzing...' : 'Analyze'}
            </button>
            <div className="element-desc" id="analyze-button-description">
              <span className="desc-bullet">ℹ️</span>
              <span>
                <strong>Analyze Button:</strong> Submits the input text to the backend API to evaluate size metrics and categorization.
              </span>
            </div>
          </div>

          {result && (
            <div className="result-container">
              <div className="result-header-row">
                <h3 className="result-title">
                  <span>📈</span> Analysis Report
                </h3>
              </div>
              <div className="result-grid">
                <div className="result-item">
                  <span className="label">Characters</span>
                  <span className="value">{result.length}</span>
                </div>
                <div className="result-item">
                  <span className="label">Words</span>
                  <span className="value">{result.words}</span>
                </div>
                <div className="result-item">
                  <span className="label">Long Content</span>
                  <span className={`status-badge ${result.is_long ? 'warning-badge' : 'success-badge'}`}>
                    {result.is_long ? 'YES' : 'NO'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Right Column: Sentry Debugging Panel */}
        <SentryTest />
      </main>
    </div>
  )
}

export default App