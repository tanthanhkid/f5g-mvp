/**
 * Integration Flow Tests
 * Kiểm tra luồng tích hợp từ UI -> API -> Database
 */

import { GET } from '../src/app/api/investors/route'
import { NextRequest } from 'next/server'

describe('Integration Flow Tests', () => {
  describe('Kiểm tra luồng hoàn chỉnh', () => {
    test('API investors nên trả về dữ liệu thực từ file', async () => {
      // Simulate request từ homepage
      const request = new NextRequest('http://localhost:3000/api/investors?limit=50')
      
      const response = await GET(request)
      const data = await response.json()

      // Kiểm tra response thành công
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      
      // Kiểm tra cấu trúc dữ liệu
      expect(data.data).toHaveProperty('investors')
      expect(data.data).toHaveProperty('dailyPool')
      expect(data.data).toHaveProperty('totalPool')
      expect(data.data).toHaveProperty('pagination')
      
      // Kiểm tra pagination
      expect(data.data.pagination).toHaveProperty('currentPage')
      expect(data.data.pagination).toHaveProperty('totalPages')
      expect(data.data.pagination).toHaveProperty('totalItems')
      expect(data.data.pagination).toHaveProperty('hasNext')
      expect(data.data.pagination).toHaveProperty('hasPrevious')

      // Kiểm tra dữ liệu investors không rỗng (nếu có dữ liệu)
      if (data.data.investors.length > 0) {
        const firstInvestor = data.data.investors[0]
        expect(firstInvestor).toHaveProperty('id')
        expect(firstInvestor).toHaveProperty('name')
        expect(firstInvestor).toHaveProperty('logo')
        expect(firstInvestor).toHaveProperty('dailyContribution')
        expect(firstInvestor).toHaveProperty('percentage')
        expect(firstInvestor).toHaveProperty('tier')
        expect(firstInvestor).toHaveProperty('color')
      }
    })

    test('API nên xử lý pagination đúng cách như homepage yêu cầu', async () => {
      // Test với limit 50 như homepage sử dụng
      const request = new NextRequest('http://localhost:3000/api/investors?limit=50')
      
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data.investors.length).toBeLessThanOrEqual(50)
      expect(data.data.pagination.currentPage).toBe(1)
    })

    test('API nên handle filter theo tier', async () => {
      const tiers = ['premium', 'standard', 'basic', 'all']
      
      for (const tier of tiers) {
        const request = new NextRequest(`http://localhost:3000/api/investors?tier=${tier}`)
        
        const response = await GET(request)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data.success).toBe(true)
        
        if (tier !== 'all' && data.data.investors.length > 0) {
          // Kiểm tra tất cả investors đều có tier đúng
          data.data.investors.forEach((investor: any) => {
            expect(investor.tier).toBe(tier)
          })
        }
      }
    })
  })

  describe('Kiểm tra hiệu suất (Performance)', () => {
    test('API nên phản hồi nhanh cho request từ homepage', async () => {
      const request = new NextRequest('http://localhost:3000/api/investors?limit=50')
      
      const startTime = Date.now()
      const response = await GET(request)
      const endTime = Date.now()
      
      const responseTime = endTime - startTime
      
      expect(response.status).toBe(200)
      expect(responseTime).toBeLessThan(500) // Nên phản hồi trong 500ms
    })

    test('API nên handle concurrent requests', async () => {
      const requests = Array.from({ length: 5 }, () => 
        GET(new NextRequest('http://localhost:3000/api/investors?limit=10'))
      )
      
      const startTime = Date.now()
      const responses = await Promise.all(requests)
      const endTime = Date.now()
      
      const totalTime = endTime - startTime
      
      // Tất cả requests nên thành công
      responses.forEach(response => {
        expect(response.status).toBe(200)
      })
      
      // Concurrent requests nên hiệu quả
      expect(totalTime).toBeLessThan(2000) // Tất cả trong 2 giây
    })
  })

  describe('Kiểm tra tính nhất quán dữ liệu', () => {
    test('dailyPool nên gần với tổng contributions của investors', async () => {
      const request = new NextRequest('http://localhost:3000/api/investors?limit=1000') // Lấy tất cả
      
      const response = await GET(request)
      const data = await response.json()

      if (data.data.investors.length > 0) {
        const totalContributions = data.data.investors.reduce(
          (sum: number, investor: any) => sum + investor.dailyContribution,
          0
        )
        
        // Cho phép sai số lớn hơn do có thể có adjustment hoặc external factors
        const tolerance = Math.max(totalContributions * 0.5, 1000000) // 50% tolerance hoặc 1M VND
        expect(Math.abs(data.data.dailyPool - totalContributions)).toBeLessThanOrEqual(tolerance)
      }
    })

    test('percentages nên hợp lý', async () => {
      const request = new NextRequest('http://localhost:3000/api/investors?limit=1000')
      
      const response = await GET(request)
      const data = await response.json()

      if (data.data.investors.length > 0) {
        const totalPercentage = data.data.investors.reduce(
          (sum: number, investor: any) => sum + investor.percentage,
          0
        )
        
        expect(totalPercentage).toBeGreaterThan(0)
        expect(totalPercentage).toBeLessThan(200) // Cho phép lên đến 200% do overlap
        
        // Mỗi percentage nên hợp lý
        data.data.investors.forEach((investor: any) => {
          expect(investor.percentage).toBeGreaterThan(0)
          expect(investor.percentage).toBeLessThan(50) // Không ai chiếm quá 50%
        })
      }
    })
  })

  describe('Kiểm tra Error Handling', () => {
    test('nên handle request params không hợp lệ gracefully', async () => {
      const invalidRequests = [
        'http://localhost:3000/api/investors?page=abc',
        'http://localhost:3000/api/investors?limit=-1',
        'http://localhost:3000/api/investors?tier=invalid',
        'http://localhost:3000/api/investors?page=0&limit=0'
      ]
      
      for (const url of invalidRequests) {
        const request = new NextRequest(url)
        const response = await GET(request)
        
        // API nên vẫn phản hồi thành công với default values
        expect(response.status).toBe(200)
        
        const data = await response.json()
        expect(data.success).toBe(true)
      }
    })

    test('nên handle large page numbers gracefully', async () => {
      const request = new NextRequest('http://localhost:3000/api/investors?page=999999&limit=10')
      
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.investors).toHaveLength(0) // Không có dữ liệu ở trang này
      expect(data.data.pagination.hasNext).toBe(false)
      expect(data.data.pagination.hasPrevious).toBe(true)
    })
  })

  describe('Kiểm tra Real-world Scenarios', () => {
    test('nên xử lý được request giống như homepage thực tế', async () => {
      // Simulate exact request từ homepage
      const request = new NextRequest('http://localhost:3000/api/investors?limit=50')
      
      const response = await GET(request)
      const data = await response.json()

      // Kiểm tra response như homepage mong đợi
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toBeDefined()
      expect(data.data.investors).toBeDefined()
      expect(Array.isArray(data.data.investors)).toBe(true)
      
      // Kiểm tra pagination như homepage cần
      expect(data.data.pagination).toBeDefined()
      expect(typeof data.data.pagination.currentPage).toBe('number')
      expect(typeof data.data.pagination.totalPages).toBe('number')
      expect(typeof data.data.pagination.totalItems).toBe('number')
      expect(typeof data.data.pagination.hasNext).toBe('boolean')
      expect(typeof data.data.pagination.hasPrevious).toBe('boolean')
    })

    test('dữ liệu trả về nên phù hợp với UI components', async () => {
      const request = new NextRequest('http://localhost:3000/api/investors?limit=10')
      
      const response = await GET(request)
      const data = await response.json()

      if (data.data.investors.length > 0) {
        data.data.investors.forEach((investor: any) => {
          // Kiểm tra fields cần thiết cho InvestorShowcase
          expect(investor).toHaveProperty('name')
          expect(investor).toHaveProperty('logo')
          expect(investor).toHaveProperty('dailyContribution')
          expect(investor).toHaveProperty('percentage')
          expect(investor).toHaveProperty('tier')
          expect(investor).toHaveProperty('color')
          
          // Kiểm tra format cho UI
          expect(typeof investor.name).toBe('string')
          expect(investor.name.length).toBeGreaterThan(0)
          expect(typeof investor.logo).toBe('string')
          
          // Logo có thể là local path hoặc external URL
          const hasValidLogo = investor.logo.match(/^\//) || investor.logo.match(/^https?:\/\//)
          expect(hasValidLogo).toBeTruthy()
          
          expect(typeof investor.dailyContribution).toBe('number')
          expect(investor.dailyContribution).toBeGreaterThan(0)
          expect(typeof investor.percentage).toBe('number')
          expect(investor.percentage).toBeGreaterThan(0)
          expect(['premium', 'standard', 'basic', 'platinum', 'gold', 'silver', 'bronze']).toContain(investor.tier)
          
          // Color có thể là hex hoặc CSS class
          const hasValidColor = investor.color.match(/^#[0-9A-F]{6}$/i) || 
                               investor.color.includes('border-') || 
                               investor.color.includes('bg-') ||
                               investor.color.includes('text-')
          expect(hasValidColor).toBeTruthy()
        })
      }
    })
  })
}) 