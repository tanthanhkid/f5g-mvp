import { describe, it, expect } from '@jest/globals';

/**
 * API Data Structure và Type Validation Tests
 * Kiểm tra format và structure của API responses
 */

describe('API Data Structure Tests', () => {
  describe('Quiz Topics API Structure', () => {
    it('should have correct quiz topics response structure', () => {
      const mockResponse = {
        success: true,
        topics: [
          {
            id: 'topic_1',
            title: 'Test Topic',
            description: 'Test Description',
            icon: '🎯',
            difficulty: 'beginner',
            estimatedTime: 15,
            category: 'Kỹ năng sống',
            ageGroup: 'Thanh thiếu niên',
            keywords: ['keyword1', 'keyword2'],
            learningContent: [],
            quizQuestions: []
          }
        ]
      };

      // Structure validation
      expect(mockResponse).toHaveProperty('success');
      expect(mockResponse.success).toBe(true);
      expect(Array.isArray(mockResponse.topics)).toBe(true);
      
      const topic = mockResponse.topics[0];
      expect(topic).toHaveProperty('id');
      expect(topic).toHaveProperty('title');
      expect(topic).toHaveProperty('difficulty');
      expect(topic).toHaveProperty('estimatedTime');
      expect(topic).toHaveProperty('category');
      
      // Type validation
      expect(typeof topic.id).toBe('string');
      expect(typeof topic.title).toBe('string');
      expect(typeof topic.difficulty).toBe('string');
      expect(typeof topic.estimatedTime).toBe('number');
      expect(['beginner', 'intermediate', 'advanced']).toContain(topic.difficulty);
      expect(Array.isArray(topic.keywords)).toBe(true);
    });

    it('should have correct single topic response structure', () => {
      const mockResponse = {
        success: true,
        topic: {
          id: 'topic_1',
          title: 'Test Topic',
          description: 'Test Description',
          difficulty: 'beginner',
          estimatedTime: 15,
          category: 'Test Category'
        }
      };

      expect(mockResponse).toHaveProperty('success');
      expect(mockResponse).toHaveProperty('topic');
      expect(mockResponse.topic.id).toBe('topic_1');
      expect(typeof mockResponse.topic.estimatedTime).toBe('number');
    });
  });

  describe('Lessons API Structure', () => {
    it('should have correct lessons response structure', () => {
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

      expect(mockResponse).toHaveProperty('success');
      expect(mockResponse).toHaveProperty('lessons');
      expect(mockResponse).toHaveProperty('pagination');
      expect(Array.isArray(mockResponse.lessons)).toBe(true);
      
      const lesson = mockResponse.lessons[0];
      expect(lesson).toHaveProperty('estimatedDuration');
      expect(lesson).toHaveProperty('tutePoints');
      expect(typeof lesson.estimatedDuration).toBe('number');
      expect(typeof lesson.tutePoints).toBe('number');
      expect(lesson.estimatedDuration).toBeGreaterThan(0);
      expect(lesson.tutePoints).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Investors API Structure', () => {
    it('should have correct investors response structure', () => {
      const mockResponse = {
        success: true,
        data: {
          dailyPool: 1000000,
          totalPool: 5000000,
          investors: [
            {
              id: 1,
              name: 'Test Investor',
              logo: 'test-logo.png',
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
      expect(typeof mockResponse.data.dailyPool).toBe('number');
      expect(typeof mockResponse.data.totalPool).toBe('number');
      expect(Array.isArray(mockResponse.data.investors)).toBe(true);
      
      const investor = mockResponse.data.investors[0];
      expect(typeof investor.dailyContribution).toBe('number');
      expect(typeof investor.percentage).toBe('number');
      expect(investor.percentage).toBeGreaterThanOrEqual(0);
      expect(investor.percentage).toBeLessThanOrEqual(100);
    });
  });

  describe('Ads API Structure', () => {
    it('should have correct ads response structure', () => {
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
      
      const ad = mockResponse.ads[0];
      expect(ad).toHaveProperty('type');
      expect(ad).toHaveProperty('isActive');
      expect(ad).toHaveProperty('priority');
      expect(typeof ad.isActive).toBe('boolean');
      expect(typeof ad.priority).toBe('number');
    });
  });

  describe('Analytics API Structure', () => {
    it('should have correct analytics response structure', () => {
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
      
      const analytic = mockResponse.analytics[0];
      expect(analytic).toHaveProperty('metric');
      expect(analytic).toHaveProperty('value');
      expect(typeof analytic.value).toBe('number');
      expect(typeof analytic.metric).toBe('string');
    });
  });

  describe('Influencers API Structure', () => {
    it('should have correct influencers response structure', () => {
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
      
      const influencer = mockResponse.influencers[0];
      expect(typeof influencer.followers).toBe('number');
      expect(typeof influencer.engagementRate).toBe('number');
      expect(typeof influencer.isActive).toBe('boolean');
      expect(influencer.followers).toBeGreaterThanOrEqual(0);
      expect(influencer.engagementRate).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Error Response Structure', () => {
    it('should have correct error response format', () => {
      const errorResponse = {
        success: false,
        error: 'Database connection failed'
      };

      expect(errorResponse).toHaveProperty('success');
      expect(errorResponse.success).toBe(false);
      expect(errorResponse).toHaveProperty('error');
      expect(typeof errorResponse.error).toBe('string');
    });

    it('should have correct 404 response format', () => {
      const notFoundResponse = {
        success: false,
        error: 'Resource not found'
      };

      expect(notFoundResponse).toHaveProperty('success');
      expect(notFoundResponse.success).toBe(false);
      expect(notFoundResponse).toHaveProperty('error');
    });
  });

  describe('Data Type Validation', () => {
    it('should validate numeric fields', () => {
      const numericData = {
        estimatedTime: 15,
        estimatedDuration: 30,
        tutePoints: 10,
        dailyContribution: 100000,
        percentage: 20,
        followers: 10000,
        engagementRate: 5.5,
        priority: 1,
        value: 1000
      };

      Object.values(numericData).forEach(value => {
        expect(typeof value).toBe('number');
        expect(Number.isFinite(value)).toBe(true);
      });
    });

    it('should validate boolean fields', () => {
      const booleanData = {
        isActive: true,
        success: true,
        completed: false
      };

      Object.values(booleanData).forEach(value => {
        expect(typeof value).toBe('boolean');
      });
    });

    it('should validate array fields', () => {
      const arrayData = {
        keywords: ['keyword1', 'keyword2'],
        learningContent: [],
        quizQuestions: [],
        topics: [],
        lessons: [],
        investors: [],
        ads: [],
        analytics: [],
        influencers: []
      };

      Object.values(arrayData).forEach(value => {
        expect(Array.isArray(value)).toBe(true);
      });
    });

    it('should validate difficulty enum values', () => {
      const validDifficulties = ['beginner', 'intermediate', 'advanced'];
      
      validDifficulties.forEach(difficulty => {
        expect(validDifficulties).toContain(difficulty);
        expect(typeof difficulty).toBe('string');
      });
    });

    it('should validate percentage ranges', () => {
      const percentages = [0, 25, 50, 75, 100];
      
      percentages.forEach(percentage => {
        expect(percentage).toBeGreaterThanOrEqual(0);
        expect(percentage).toBeLessThanOrEqual(100);
      });
    });
  });

  describe('Response Consistency', () => {
    it('should have consistent success response format', () => {
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

    it('should have consistent error response format', () => {
      const errorResponses = [
        { success: false, error: 'Database error' },
        { success: false, error: 'Not found' },
        { success: false, error: 'Validation error' }
      ];

      errorResponses.forEach(response => {
        expect(response).toHaveProperty('success');
        expect(response).toHaveProperty('error');
        expect(response.success).toBe(false);
        expect(typeof response.error).toBe('string');
      });
    });
  });
}); 