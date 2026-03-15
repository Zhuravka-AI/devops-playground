// filepath: /Users/andrii/dev/devops-playground/frontend/src/App.test.jsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import App from './App'

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    globalThis.fetch = vi.fn()
    if (!globalThis.alert) {
      globalThis.alert = vi.fn()
    }
  })

  it('renders the app title..', () => {
    render(<App />)
    expect(screen.getByText('DevOps Playground')).toBeInTheDocument()
  })

  it('renders textarea with placeholder', () => {
    render(<App />)
    const textarea = screen.getByPlaceholderText('Enter your text for analysis...')
    expect(textarea).toBeInTheDocument()
  })

  it('updates text state on textarea change', () => {
    render(<App />)
    const textarea = screen.getByPlaceholderText('Enter your text for analysis...')
    fireEvent.change(textarea, { target: { value: 'test text' } })
    expect(textarea.value).toBe('test text')
  })

  it('disables button when text is empty', () => {
    render(<App />)
    const button = screen.getByRole('button', { name: /analyze/i })
    expect(button).toBeDisabled()
  })

  it('enables button when text is not empty', () => {
    render(<App />)
    const textarea = screen.getByPlaceholderText('Enter your text for analysis...')
    fireEvent.change(textarea, { target: { value: 'test' } })
    const button = screen.getByRole('button', { name: /analyze/i })
    expect(button).not.toBeDisabled()
  })

  it('shows loading state during API call', async () => {
    globalThis.fetch.mockResolvedValueOnce({
      json: async () => ({ length: 4, words: 1, is_long: false })
    })
    render(<App />)
    const textarea = screen.getByPlaceholderText('Enter your text for analysis...')
    fireEvent.change(textarea, { target: { value: 'test' } })
    fireEvent.click(screen.getByRole('button', { name: /analyze/i }))
    expect(screen.getByText('Analyzing...')).toBeInTheDocument()
  })

  it('displays analysis results on successful API call', async () => {
    globalThis.fetch.mockResolvedValueOnce({
      json: async () => ({ length: 50, words: 10, is_long: false })
    })
    render(<App />)
    fireEvent.change(screen.getByPlaceholderText('Enter your text for analysis...'), {
      target: { value: 'test content' }
    })
    fireEvent.click(screen.getByRole('button', { name: /analyze/i }))
    await waitFor(() => {
      expect(screen.getByText('50')).toBeInTheDocument()
      expect(screen.getByText('10')).toBeInTheDocument()
      expect(screen.getByText('NO')).toBeInTheDocument()
    })
  })

  it('displays YES for long content', async () => {
    globalThis.fetch.mockResolvedValueOnce({
      json: async () => ({ length: 5000, words: 800, is_long: true })
    })
    render(<App />)
    fireEvent.change(screen.getByPlaceholderText('Enter your text for analysis...'), {
      target: { value: 'x'.repeat(5000) }
    })
    fireEvent.click(screen.getByRole('button', { name: /analyze/i }))
    await waitFor(() => {
      expect(screen.getByText('YES')).toBeInTheDocument()
    })
  })

  it('handles API errors gracefully', async () => {
    globalThis.fetch.mockRejectedValueOnce(new Error('Network error'))
    const alertSpy = vi.spyOn(globalThis, 'alert').mockImplementation(() => {})
    render(<App />)
    fireEvent.change(screen.getByPlaceholderText('Enter your text for analysis...'), {
      target: { value: 'test' }
    })
    fireEvent.click(screen.getByRole('button', { name: /analyze/i }))
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('API is not responding')
    })
  })

  it('sends correct payload to API', async () => {
    globalThis.fetch.mockResolvedValueOnce({
      json: async () => ({ length: 4, words: 1, is_long: false })
    })
    render(<App />)
    fireEvent.change(screen.getByPlaceholderText('Enter your text for analysis...'), {
      target: { value: 'test' }
    })
    fireEvent.click(screen.getByRole('button', { name: /analyze/i }))
    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/analyze'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: 'test' })
        })
      )
    })
  })
})