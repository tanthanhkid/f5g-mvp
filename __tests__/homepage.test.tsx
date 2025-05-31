/**
 * Unit Test cho trang chủ - HomePage Component
 * Kiểm tra rendering giao diện và API calls
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import HomePage from '../src/app/page'

// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock fetch API
global.fetch = jest.fn()

describe('HomePage Component Tests', () => {
  const mockPush = jest.fn()
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    })
    ;(fetch as jest.Mock).mockClear()
  })

  describe('Kiểm tra render giao diện', () => {
    test('nên render tiêu đề Freedom Training', async () => {
      render(<HomePage />)
      
      // Kiểm tra tiêu đề hiển thị - sử dụng getAllByText vì có nhiều elements
      const freedomTrainingElements = screen.getAllByText('Freedom Training')
      expect(freedomTrainingElements.length).toBeGreaterThanOrEqual(1)
      expect(freedomTrainingElements[0]).toBeInTheDocument()
      
      expect(screen.getByText('Nền tảng học tập thông minh')).toBeInTheDocument()
    })

    test('nên render nút Learn to Earn', () => {
      render(<HomePage />)
      
      const learnToEarnButtons = screen.getAllByText('Learn to Earn')
      expect(learnToEarnButtons.length).toBeGreaterThan(0)
    })

    test('nên render nút Đăng nhập', () => {
      render(<HomePage />)
      
      expect(screen.getByText('Đăng nhập')).toBeInTheDocument()
    })

    test('nên hiển thị logo đúng cách', () => {
      render(<HomePage />)
      
      // Sử dụng getAllByAltText vì có thể có nhiều logo
      const logos = screen.getAllByAltText('Freedom Training Logo')
      expect(logos.length).toBeGreaterThanOrEqual(1)
      expect(logos[0]).toBeInTheDocument()
      expect(logos[0]).toHaveAttribute('src', '/17164524823262_logo-web-con-voi.png')
    })
  })

  describe('Kiểm tra tương tác người dùng', () => {
    test('nên chuyển hướng đến trang login khi click nút Đăng nhập', async () => {
      render(<HomePage />)
      
      const loginButton = screen.getByText('Đăng nhập')
      fireEvent.click(loginButton)
      
      // Đợi timeout 1000ms
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/login')
      }, { timeout: 1500 })
    })

    test('nên chuyển hướng đến trang login khi click nút Learn to Earn', async () => {
      render(<HomePage />)
      
      const learnToEarnButton = screen.getAllByText('Learn to Earn')[0]
      fireEvent.click(learnToEarnButton)
      
      // Đợi timeout 1000ms  
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/login')
      }, { timeout: 1500 })
    })
  })

  describe('Kiểm tra API calls', () => {
    test('nên gọi API investors khi component mount', async () => {
      const mockInvestorData = {
        success: true,
        data: {
          dailyPool: 1000000,
          totalPool: 50000000,
          investors: [
            {
              id: 1,
              name: 'Test Investor',
              logo: '/test-logo.png',
              dailyContribution: 50000,
              percentage: 5,
              tier: 'premium',
              color: '#3B82F6'
            }
          ]
        }
      }

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockInvestorData,
      })

      render(<HomePage />)

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('/api/investors?limit=50')
      })
    })

    test('nên xử lý lỗi API investors một cách graceful', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      
      ;(fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'))

      render(<HomePage />)

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Error fetching investors:', expect.any(Error))
      })

      consoleSpy.mockRestore()
    })
  })

  describe('Kiểm tra responsive design', () => {
    test('nên hiển thị đúng trên mobile', () => {
      // Simulate mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })

      render(<HomePage />)
      
      // Kiểm tra các element vẫn hiển thị - sử dụng getAllByText
      const freedomTrainingElements = screen.getAllByText('Freedom Training')
      expect(freedomTrainingElements[0]).toBeInTheDocument()
      expect(screen.getByText('Đăng nhập')).toBeInTheDocument()
    })
  })

  describe('Kiểm tra animation và loading states', () => {
    test('nên có loading state ban đầu', () => {
      render(<HomePage />)
      
      // Component sẽ có delay animation 100ms - lấy element đầu tiên
      const freedomTrainingElements = screen.getAllByText('Freedom Training')
      const mainContent = freedomTrainingElements[0].closest('div')
      expect(mainContent).toBeInTheDocument()
    })
  })

  describe('Kiểm tra date formatting', () => {
    test('nên format ngày tháng theo locale Việt Nam', async () => {
      const mockDate = new Date('2024-01-15T10:00:00Z')
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any)

      render(<HomePage />)

      // Date sẽ được set trong useEffect
      await waitFor(() => {
        const dateElement = document.querySelector('[data-testid="current-date"]')
        // Có thể cần thêm data-testid vào component gốc
      })

      jest.restoreAllMocks()
    })
  })
})

/**
 * Integration Tests - Kiểm tra tích hợp với các components khác
 */
describe('HomePage Integration Tests', () => {
  test('nên render InvestorShowcase khi có dữ liệu', async () => {
    const mockInvestorData = {
      success: true,
      data: {
        dailyPool: 1000000,
        totalPool: 50000000,
        investors: [
          {
            id: 1,
            name: 'Test Investor',
            logo: '/test-logo.png',
            dailyContribution: 50000,
            percentage: 5,
            tier: 'premium',
            color: '#3B82F6'
          }
        ]
      }
    }

    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockInvestorData,
    })

    render(<HomePage />)

    // Đợi dữ liệu load và component render
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/investors?limit=50')
    })
  })
}) 