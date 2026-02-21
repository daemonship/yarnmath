/* eslint-env browser, node */
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import App from '../../src/App'

// Wrapper component for tests that need routing
function TestWrapper({ children }) {
  return <BrowserRouter>{children}</BrowserRouter>
}

describe('Calculator Form UI', () => {
  beforeEach(() => {
    render(<App />, { wrapper: TestWrapper })
  })

  it('renders the app header', () => {
    expect(screen.getByText('YarnMath')).toBeInTheDocument()
  })

  it('renders calculator form with pattern and substitute sections', () => {
    expect(screen.getByText('Pattern Details')).toBeInTheDocument()
    expect(screen.getByText('Substitute Yarn')).toBeInTheDocument()
    expect(screen.getByText('Calculate')).toBeInTheDocument()
  })
})
