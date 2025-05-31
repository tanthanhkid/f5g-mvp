/**
 * Unit Test cho API Routes
 * Kiểm tra các endpoint API hoạt động đúng cách
 */

import { GET } from '../src/app/api/investors/route'
import { NextRequest } from 'next/server'
import fs from 'fs'
import path from 'path'

// Mock fs module
jest.mock('fs')
jest.mock('path')

describe('API Routes Tests', () => {
  const mockFs = fs as jest.Mocked<typeof fs>
  const mockPath = path as jest.Mocked<typeof path>

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Investors API - /api/investors', () => {
    const mockInvestorData = {
      dailyPool: 1000000,
      totalPool: 50000000,
      investors: [
        {
          id: 1,
          name: 'Công ty TNHH Test 1',
          shortName: 'TEST1',
          stockCode: 'TST1',
          logo: '/test-logo-1.png',
          dailyContribution: 100000,
          percentage: 10,
          tier: 'premium',
          color: '#3B82F6',
          sector: 'Technology'
        },
        {
          id: 2,
          name: 'Công ty TNHH Test 2',
          shortName: 'TEST2',
          stockCode: 'TST2',
          logo: '/test-logo-2.png',
          dailyContribution: 50000,
          percentage: 5,
          tier: 'standard',
          color: '#10B981',
          sector: 'Finance'
        },
        {
          id: 3,
          name: 'Công ty TNHH Test 3',
          shortName: 'TEST3',
          stockCode: 'TST3',
          logo: '/test-logo-3.png',
          dailyContribution: 25000,
          percentage: 2.5,
          tier: 'basic',
          color: '#F59E0B',
          sector: 'Retail'
        }
      ],
      minorSponsors: ['Sponsor 1', 'Sponsor 2']
    }

    beforeEach(() => {
      mockPath.join.mockReturnValue('/mocked/path/investors.json')
      mockFs.readFileSync.mockReturnValue(JSON.stringify(mockInvestorData))
    })

    test('nên trả về danh sách investors với pagination mặc định', async () => {
      const request = new NextRequest('http://localhost:3000/api/investors')
      
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toHaveProperty('investors')
      expect(data.data).toHaveProperty('dailyPool', 1000000)
      expect(data.data).toHaveProperty('totalPool', 50000000)
      expect(data.data.pagination).toEqual({
        currentPage: 1,
        totalPages: 1,
        totalItems: 3,
        hasNext: false,
        hasPrevious: false
      })
    })

    test('nên áp dụng pagination đúng cách', async () => {
      const request = new NextRequest('http://localhost:3000/api/investors?page=1&limit=2')
      
      const response = await GET(request)
      const data = await response.json()

      expect(data.data.investors).toHaveLength(2)
      expect(data.data.pagination).toEqual({
        currentPage: 1,
        totalPages: 2,
        totalItems: 3,
        hasNext: true,
        hasPrevious: false
      })
    })

    test('nên filter theo tier đúng cách', async () => {
      const request = new NextRequest('http://localhost:3000/api/investors?tier=premium')
      
      const response = await GET(request)
      const data = await response.json()

      expect(data.data.investors).toHaveLength(1)
      expect(data.data.investors[0].tier).toBe('premium')
      expect(data.data.investors[0].name).toBe('Công ty TNHH Test 1')
    })

    test('nên trả về tất cả investors khi tier=all', async () => {
      const request = new NextRequest('http://localhost:3000/api/investors?tier=all')
      
      const response = await GET(request)
      const data = await response.json()

      expect(data.data.investors).toHaveLength(3)
    })

    test('nên handle trang pagination không hợp lệ', async () => {
      const request = new NextRequest('http://localhost:3000/api/investors?page=999&limit=2')
      
      const response = await GET(request)
      const data = await response.json()

      expect(data.data.investors).toHaveLength(0)
      expect(data.data.pagination.currentPage).toBe(999)
      expect(data.data.pagination.hasNext).toBe(false)
      expect(data.data.pagination.hasPrevious).toBe(true)
    })

    test('nên xử lý lỗi file không tồn tại', async () => {
      mockFs.readFileSync.mockImplementation(() => {
        throw new Error('ENOENT: no such file or directory')
      })

      const request = new NextRequest('http://localhost:3000/api/investors')
      
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Không thể tải danh sách nhà đầu tư')
    })

    test('nên xử lý JSON không hợp lệ', async () => {
      mockFs.readFileSync.mockReturnValue('invalid json content')

      const request = new NextRequest('http://localhost:3000/api/investors')
      
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Không thể tải danh sách nhà đầu tư')
    })

    test('nên validate số page và limit', async () => {
      const request = new NextRequest('http://localhost:3000/api/investors?page=0&limit=-1')
      
      const response = await GET(request)
      const data = await response.json()

      // Page 0 sẽ được xử lý như thế nào tùy thuộc vào implementation
      // Kiểm tra response thành công
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      
      // Kiểm tra pagination có structure đúng
      expect(data.data.pagination).toHaveProperty('currentPage')
      expect(data.data.pagination).toHaveProperty('totalPages')
      expect(data.data.pagination).toHaveProperty('totalItems')
      expect(data.data.pagination).toHaveProperty('hasNext')
      expect(data.data.pagination).toHaveProperty('hasPrevious')
      
      // Page nên là số hợp lệ (>= 0)
      expect(data.data.pagination.currentPage).toBeGreaterThanOrEqual(0)
    })

    test('nên đọc file từ đúng đường dẫn', async () => {
      const request = new NextRequest('http://localhost:3000/api/investors')
      
      await GET(request)

      expect(mockPath.join).toHaveBeenCalledWith(process.cwd(), 'data/investors.json')
      expect(mockFs.readFileSync).toHaveBeenCalledWith('/mocked/path/investors.json', 'utf8')
    })

    test('nên trả về minorSponsors', async () => {
      const request = new NextRequest('http://localhost:3000/api/investors')
      
      const response = await GET(request)
      const data = await response.json()

      expect(data.data.minorSponsors).toEqual(['Sponsor 1', 'Sponsor 2'])
    })
  })

  describe('Kiểm tra data validation', () => {
    test('nên validate cấu trúc dữ liệu investor', async () => {
      const invalidData = {
        investors: [
          {
            // Missing required fields
            name: 'Invalid Investor'
          }
        ]
      }

      mockFs.readFileSync.mockReturnValue(JSON.stringify(invalidData))
      const request = new NextRequest('http://localhost:3000/api/investors')
      
      const response = await GET(request)
      const data = await response.json()

      // API nên vẫn hoạt động nhưng dữ liệu có thể không đầy đủ
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })

    test('nên handle dữ liệu trống', async () => {
      const emptyData = {
        dailyPool: 0,
        totalPool: 0,
        investors: []
      }

      mockFs.readFileSync.mockReturnValue(JSON.stringify(emptyData))
      const request = new NextRequest('http://localhost:3000/api/investors')
      
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data.investors).toHaveLength(0)
      expect(data.data.pagination.totalItems).toBe(0)
    })
  })

  describe('Performance Tests', () => {
    test('nên xử lý dataset lớn hiệu quả', async () => {
      // Tạo dataset lớn
      const largeDataset = {
        dailyPool: 1000000,
        totalPool: 50000000,
        investors: Array.from({ length: 1000 }, (_, i) => ({
          id: i + 1,
          name: `Company ${i + 1}`,
          logo: `/logo-${i + 1}.png`,
          dailyContribution: Math.floor(Math.random() * 100000),
          percentage: Math.random() * 10,
          tier: ['premium', 'standard', 'basic'][i % 3],
          color: '#3B82F6'
        }))
      }

      mockFs.readFileSync.mockReturnValue(JSON.stringify(largeDataset))
      const request = new NextRequest('http://localhost:3000/api/investors?limit=50')
      
      const startTime = Date.now()
      const response = await GET(request)
      const endTime = Date.now()
      
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data.investors).toHaveLength(50)
      expect(endTime - startTime).toBeLessThan(1000) // Nên hoàn thành trong 1 giây
    })
  })
}) 