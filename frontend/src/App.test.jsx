import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import App from './App'

test('renders DevOps Playground title', () => {
  render(<App />)
  const titleElement = screen.getByText(/DevOps Playground/i)
  expect(titleElement).toBeInTheDocument
})

// test message to trigger pipeline