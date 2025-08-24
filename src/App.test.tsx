import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

// Mock Chart.js components to avoid canvas issues in tests
vi.mock('react-chartjs-2', () => ({
  Bar: () => <div data-testid="bar-chart">Bar Chart</div>,
  Pie: () => <div data-testid="pie-chart">Pie Chart</div>
}))

// Mock Chart.js to avoid registration issues
vi.mock('chart.js', () => ({
  Chart: {
    register: vi.fn()
  },
  CategoryScale: {},
  LinearScale: {},
  BarElement: {},
  Title: {},
  Tooltip: {},
  Legend: {},
  ArcElement: {}
}))

// Mock environment variable
Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_API_URL: 'http://localhost:3001/api'
  }
})

// Mock fetch for API calls
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('App Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockFetch.mockClear()
    // Mock successful API response
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ books: [], message: 'Success' })
    })
  })

  it('renders dashboard title', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  it('renders navigation buttons', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )
    
    expect(screen.getByText('Books')).toBeInTheDocument()
    expect(screen.getByText('Authors')).toBeInTheDocument()
  })
})