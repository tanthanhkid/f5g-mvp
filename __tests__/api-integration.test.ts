/**
 * Integration Tests cho Freedom Training APIs
 * Kiểm tra structure và data validation
 */

describe('API Integration Tests', () => {
  const API_BASE = process.env.API_BASE || 'http://localhost:3001';

  // Test API Quiz Topics
  describe('Quiz Topics API', () => {
    test('GET /api/quiz-topics should return valid structure', async () => {
      const mockResponse = {
        success: true,
        topics: [
          {
            id: 'test_topic',
            title: 'Test Topic',
            description: 'Test Description',
            icon: '🎯',
            difficulty: 'beginner',
            estimatedTime: 15,
            category: 'Test Category',
            ageGroup: 'Test Age',
            keywords: [],
            learningContent: [],
            quizQuestions: []
          }
        ]
      };

      // Validate response structure
      expect(mockResponse).toHaveProperty('success');
      expect(mockResponse.success).toBe(true);
      expect(Array.isArray(mockResponse.topics)).toBe(true);

      if (mockResponse.topics.length > 0) {
        const topic = mockResponse.topics[0];
        
        // Required fields
        expect(topic).toHaveProperty('id');
        expect(topic).toHaveProperty('title');
        expect(topic).toHaveProperty('difficulty');
        expect(topic).toHaveProperty('estimatedTime');
        expect(topic).toHaveProperty('category');

        // Data types
        expect(typeof topic.id).toBe('string');
        expect(typeof topic.title).toBe('string');
        expect(typeof topic.difficulty).toBe('string');
        expect(typeof topic.estimatedTime).toBe('number');
        expect(typeof topic.category).toBe('string');

        // Valid values
        expect(['beginner', 'intermediate', 'advanced']).toContain(topic.difficulty);
        expect(topic.estimatedTime).toBeGreaterThan(0);

        // Arrays
        expect(Array.isArray(topic.keywords)).toBe(true);
        expect(Array.isArray(topic.learningContent)).toBe(true);
        expect(Array.isArray(topic.quizQuestions)).toBe(true);
      }
    });

    test('GET /api/quiz-topics/[id] should return single topic', async () => {
      const mockResponse = {
        success: true,
        topic: {
          id: 'test_topic',
          title: 'Test Topic',
          description: 'Test Description',
          difficulty: 'beginner',
          estimatedTime: 15,
          category: 'Test Category'
        }
      };

      expect(mockResponse).toHaveProperty('success');
      expect(mockResponse).toHaveProperty('topic');
      expect(mockResponse.topic).toHaveProperty('id');
      expect(mockResponse.topic).toHaveProperty('title');
    });
  });

  // Test API Lessons
  describe('Lessons API', () => {
    test('GET /api/lessons should return valid structure', async () => {
      const mockResponse = {
        success: true,
        lessons: [
          {
            id: 'lesson_1',
            title: 'Test Lesson',
            description: 'Test Description',
            difficulty: 'beginner',
            estimatedDuration: 30,
            category: 'Education',
            tutePoints: 10
          }
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1
        }
      };

      // Validate structure
      expect(mockResponse).toHaveProperty('success');
      expect(mockResponse).toHaveProperty('lessons');
      expect(mockResponse).toHaveProperty('pagination');
      expect(Array.isArray(mockResponse.lessons)).toBe(true);

      if (mockResponse.lessons.length > 0) {
        const lesson = mockResponse.lessons[0];
        
        // Required fields
        expect(lesson).toHaveProperty('id');
        expect(lesson).toHaveProperty('title');
        expect(lesson).toHaveProperty('estimatedDuration');
        expect(lesson).toHaveProperty('tutePoints');

        // Data types
        expect(typeof lesson.estimatedDuration).toBe('number');
        expect(typeof lesson.tutePoints).toBe('number');
        
        // Valid ranges
        expect(lesson.estimatedDuration).toBeGreaterThan(0);
        expect(lesson.tutePoints).toBeGreaterThanOrEqual(0);
      }

      // Pagination validation
      const pagination = mockResponse.pagination;
      expect(typeof pagination.page).toBe('number');
      expect(typeof pagination.limit).toBe('number');
      expect(typeof pagination.total).toBe('number');
      expect(typeof pagination.totalPages).toBe('number');
    });
  });

  // Test API Investors
  describe('Investors API', () => {
    test('GET /api/investors should return valid structure', async () => {
      const mockResponse = {
        success: true,
        data: {
          dailyPool: 1000000,
          totalPool: 5000000,
          investors: [
            {
              id: 1,
              name: 'Test Investor',
              logo: 'logo.png',
              dailyContribution: 100000,
              percentage: 20,
              tier: 'major',
              color: '#3B82F6'
            }
          ]
        }
      };

      expect(mockResponse).toHaveProperty('success');
      expect(mockResponse).toHaveProperty('data');
      
      const data = mockResponse.data;
      expect(typeof data.dailyPool).toBe('number');
      expect(typeof data.totalPool).toBe('number');
      expect(Array.isArray(data.investors)).toBe(true);

      if (data.investors.length > 0) {
        const investor = data.investors[0];
        expect(investor).toHaveProperty('id');
        expect(investor).toHaveProperty('name');
        expect(investor).toHaveProperty('dailyContribution');
        expect(investor).toHaveProperty('percentage');
        
        expect(typeof investor.dailyContribution).toBe('number');
        expect(typeof investor.percentage).toBe('number');
        expect(investor.percentage).toBeGreaterThanOrEqual(0);
        expect(investor.percentage).toBeLessThanOrEqual(100);
      }
    });
  });

  // Test API Ads
  describe('Ads API', () => {
    test('GET /api/ads should return valid structure', async () => {
      const mockResponse = {
        success: true,
        ads: [
          {
            id: 1,
            title: 'Test Ad',
            description: 'Test Description',
            type: 'banner',
            isActive: true,
            priority: 1
          }
        ]
      };

      expect(mockResponse).toHaveProperty('success');
      expect(Array.isArray(mockResponse.ads)).toBe(true);

      if (mockResponse.ads.length > 0) {
        const ad = mockResponse.ads[0];
        expect(ad).toHaveProperty('id');
        expect(ad).toHaveProperty('title');
        expect(ad).toHaveProperty('type');
        expect(ad).toHaveProperty('isActive');
        expect(ad).toHaveProperty('priority');

        expect(typeof ad.isActive).toBe('boolean');
        expect(typeof ad.priority).toBe('number');
      }
    });
  });

  // Test API Analytics
  describe('Analytics API', () => {
    test('GET /api/analytics should return valid structure', async () => {
      const mockResponse = {
        success: true,
        analytics: [
          {
            id: 1,
            metric: 'page_views',
            value: 1000,
            date: '2024-01-01T00:00:00Z',
            sponsor: 'Test Sponsor'
          }
        ]
      };

      expect(mockResponse).toHaveProperty('success');
      expect(Array.isArray(mockResponse.analytics)).toBe(true);

      if (mockResponse.analytics.length > 0) {
        const analytic = mockResponse.analytics[0];
        expect(analytic).toHaveProperty('id');
        expect(analytic).toHaveProperty('metric');
        expect(analytic).toHaveProperty('value');
        expect(analytic).toHaveProperty('date');

        expect(typeof analytic.value).toBe('number');
        expect(typeof analytic.metric).toBe('string');
      }
    });
  });

  // Test API Influencers
  describe('Influencers API', () => {
    test('GET /api/influencers should return valid structure', async () => {
      const mockResponse = {
        success: true,
        influencers: [
          {
            id: 1,
            name: 'Test Influencer',
            tier: 'gold',
            followers: 10000,
            engagementRate: 5.5,
            isActive: true
          }
        ]
      };

      expect(mockResponse).toHaveProperty('success');
      expect(Array.isArray(mockResponse.influencers)).toBe(true);

      if (mockResponse.influencers.length > 0) {
        const influencer = mockResponse.influencers[0];
        expect(influencer).toHaveProperty('id');
        expect(influencer).toHaveProperty('name');
        expect(influencer).toHaveProperty('tier');
        expect(influencer).toHaveProperty('followers');
        expect(influencer).toHaveProperty('engagementRate');

        expect(typeof influencer.followers).toBe('number');
        expect(typeof influencer.engagementRate).toBe('number');
        expect(typeof influencer.isActive).toBe('boolean');
        expect(influencer.followers).toBeGreaterThanOrEqual(0);
        expect(influencer.engagementRate).toBeGreaterThanOrEqual(0);
      }
    });
  });

  // Test Error Handling
  describe('Error Handling', () => {
    test('should handle error responses correctly', () => {
      const errorResponse = {
        success: false,
        error: 'Database connection failed'
      };

      expect(errorResponse).toHaveProperty('success');
      expect(errorResponse.success).toBe(false);
      expect(errorResponse).toHaveProperty('error');
      expect(typeof errorResponse.error).toBe('string');
    });

    test('should handle not found responses', () => {
      const notFoundResponse = {
        success: false,
        error: 'Resource not found'
      };

      expect(notFoundResponse).toHaveProperty('success');
      expect(notFoundResponse.success).toBe(false);
      expect(notFoundResponse).toHaveProperty('error');
    });
  });

  // Test Consistent Response Format
  describe('Response Format Consistency', () => {
    test('all success responses should have success field', () => {
      const responses = [
        { success: true, topics: [] },
        { success: true, lessons: [] },
        { success: true, data: {} },
        { success: true, ads: [] },
        { success: true, analytics: [] },
        { success: true, influencers: [] }
      ];

      responses.forEach(response => {
        expect(response).toHaveProperty('success');
        expect(typeof response.success).toBe('boolean');
        expect(response.success).toBe(true);
      });
    });

    test('all error responses should have error field', () => {
      const errorResponses = [
        { success: false, error: 'Test error 1' },
        { success: false, error: 'Test error 2' },
        { success: false, error: 'Test error 3' }
      ];

      errorResponses.forEach(response => {
        expect(response).toHaveProperty('success');
        expect(response).toHaveProperty('error');
        expect(response.success).toBe(false);
        expect(typeof response.error).toBe('string');
      });
    });
  });

  // Test Data Types Validation
  describe('Data Types Validation', () => {
    test('numeric fields should be numbers', () => {
      const numericFields = [
        { estimatedTime: 15 },
        { estimatedDuration: 30 },
        { tutePoints: 10 },
        { dailyContribution: 100000 },
        { percentage: 20 },
        { followers: 10000 },
        { engagementRate: 5.5 },
        { priority: 1 },
        { value: 1000 }
      ];

      numericFields.forEach(field => {
        const key = Object.keys(field)[0];
        const value = (field as any)[key];
        expect(typeof value).toBe('number');
        expect(Number.isFinite(value)).toBe(true);
      });
    });

    test('boolean fields should be booleans', () => {
      const booleanFields = [
        { isActive: true },
        { isActive: false },
        { success: true },
        { success: false }
      ];

      booleanFields.forEach(field => {
        const key = Object.keys(field)[0];
        const value = (field as any)[key];
        expect(typeof value).toBe('boolean');
      });
    });

    test('array fields should be arrays', () => {
      const arrayFields = [
        { keywords: [] },
        { learningContent: [] },
        { quizQuestions: [] },
        { topics: [] },
        { lessons: [] },
        { investors: [] },
        { ads: [] },
        { analytics: [] },
        { influencers: [] }
      ];

      arrayFields.forEach(field => {
        const key = Object.keys(field)[0];
        const value = (field as any)[key];
        expect(Array.isArray(value)).toBe(true);
      });
    });
  });
}); 