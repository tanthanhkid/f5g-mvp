# Freedom Training - API Testing Guide

## Tổng quan về Testing

Dự án có 3 loại tests chính để đảm bảo tất cả APIs hoạt động đúng và trả về dữ liệu với format chính xác:

1. **Integration Tests** - Kiểm tra cấu trúc dữ liệu và types
2. **Live Tests** - Test thực tế với server đang chạy  
3. **API Test Script** - Test nhanh tất cả endpoints

## Cài đặt Testing Dependencies

```bash
npm install --save-dev @types/jest jest jest-environment-node @jest/globals
```

## Các loại Tests

### 1. Integration Tests 🧪

Kiểm tra structure và data validation của API responses:

```bash
# Chạy integration tests
npm run test:integration

# Hoặc với Jest trực tiếp
npx jest __tests__/api-integration.test.ts
```

**Kiểm tra:**
- ✅ Response structure (success field, data fields)  
- ✅ Data types (string, number, boolean, array)
- ✅ Required fields có tồn tại
- ✅ Valid ranges cho numeric fields
- ✅ Error response format

### 2. Live Tests 🚀

Test thực tế với server development đang chạy:

```bash
# Bắt đầu server trước
npm run dev

# Trong terminal khác, chạy live tests  
npm run test:live

# Hoặc
SKIP_LIVE_TESTS=false npx jest __tests__/api-live.test.ts
```

**Kiểm tra:**
- ✅ Actual API calls với real data
- ✅ Response times và performance  
- ✅ Error handling (404, 500)
- ✅ Data consistency across endpoints
- ✅ Filters và pagination

### 3. Quick API Test Script ⚡

Test nhanh tất cả endpoints với Node.js:

```bash
# Đảm bảo server đang chạy
npm run dev

# Trong terminal khác
npm run test:apis

# Hoặc trực tiếp
node scripts/test-apis.js
```

**Output mẫu:**
```
🚀 Bắt đầu kiểm tra tất cả APIs...
🌐 Base URL: http://localhost:3001

🧪 Testing: Quiz Topics
   📡 /api/quiz-topics  
   ⚡ Response time: 156ms
   📊 Status: 200
   ✅ SUCCESS
   ✅ Response format: Valid
   📝 Data items: 5
   ✅ Data validation: Passed
```

## APIs được Test

### Quiz Topics API
- `GET /api/quiz-topics` - Danh sách topics
- `GET /api/quiz-topics?category=X&difficulty=Y` - Filtered
- `GET /api/quiz-topics/[id]` - Topic chi tiết

### Lessons API  
- `GET /api/lessons` - Danh sách lessons
- `GET /api/lessons?page=1&limit=5` - Paginated
- `GET /api/lessons/[id]` - Lesson chi tiết

### Investors API
- `GET /api/investors` - Investor data
- `GET /api/investors?limit=10` - Limited
- `GET /api/investors/[id]` - Investor chi tiết

### Ads API
- `GET /api/ads` - Danh sách ads
- `GET /api/ads?type=banner` - Filtered by type

### Analytics API
- `GET /api/analytics` - Analytics data
- `GET /api/analytics?sponsor=X` - Filtered by sponsor

### Influencers API
- `GET /api/influencers` - Influencers data  
- `GET /api/influencers?tier=gold` - Filtered by tier

## Data Validation Checks

### Quiz Topics
```typescript
interface QuizTopic {
  id: string;           // Required
  title: string;        // Required  
  difficulty: string;   // Required: 'beginner'|'intermediate'|'advanced'
  estimatedTime: number; // Required, > 0
  category: string;     // Required
  keywords: string[];   // Array
  learningContent: any[]; // Array  
  quizQuestions: any[];  // Array
}
```

### Lessons
```typescript  
interface Lesson {
  id: string;              // Required
  title: string;           // Required
  estimatedDuration: number; // Required, > 0
  tutePoints: number;      // Required, >= 0
  difficulty: string;      // Optional
  category: string;        // Optional
}
```

### Investors
```typescript
interface InvestorData {
  dailyPool: number;    // Required, numeric
  totalPool: number;    // Required, numeric  
  investors: Investor[]; // Array
}

interface Investor {
  id: number;              // Required
  name: string;            // Required
  dailyContribution: number; // Required, numeric
  percentage: number;      // Required, 0-100
}
```

### Ads
```typescript
interface Ad {
  id: number;        // Required
  title: string;     // Required
  type: string;      // Required
  isActive: boolean; // Required, boolean
  priority: number;  // Required, numeric
}
```

### Analytics
```typescript
interface Analytic {
  id: number;      // Required
  metric: string;  // Required  
  value: number;   // Required, numeric
  date: string;    // Optional
}
```

### Influencers
```typescript
interface Influencer {
  id: number;           // Required
  name: string;         // Required
  tier: string;         // Required
  followers: number;    // Required, >= 0
  engagementRate: number; // Optional, >= 0
  isActive: boolean;    // Required, boolean
}
```

## Environment Variables

```bash
# .env.local hoặc .env.test
TEST_BASE_URL=http://localhost:3001
SKIP_LIVE_TESTS=false  # true to skip live tests
DATABASE_URL=your_postgres_url
```

## Commands Tổng hợp

```bash
# Setup database với test data
npm run setup-database

# Chạy server  
npm run dev

# Test tất cả
npm test

# Test chỉ integration
npm run test:integration  

# Test live với server
npm run test:live

# Quick API test  
npm run test:apis

# Test với coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

## Troubleshooting

### 1. "Cannot find module" errors
```bash
npm install --save-dev @types/jest jest jest-environment-node @jest/globals
```

### 2. "Connection refused" trong live tests
- Đảm bảo server đang chạy: `npm run dev`
- Check port đúng: default là 3001
- Check DATABASE_URL đã setup

### 3. "Relation does not exist" errors  
```bash
# Setup database
npm run setup-database
```

### 4. No test data
```bash
# Populate với sample data  
node scripts/setup-quiz-topics.js
```

## Test Coverage

Chạy để xem test coverage:
```bash
npm run test:coverage
```

Target coverage:
- ✅ API Routes: 90%+
- ✅ Data validation: 95%+  
- ✅ Error handling: 85%+

## CI/CD Integration

Trong GitHub Actions hoặc CI pipeline:

```yaml
- name: Install dependencies
  run: npm ci

- name: Setup test database  
  run: npm run setup-database
  env:
    DATABASE_URL: ${{ secrets.TEST_DATABASE_URL }}

- name: Run tests
  run: npm test
  env:
    SKIP_LIVE_TESTS: true
```

## Monitoring & Alerts

Script `test-apis.js` có thể dùng cho health checks:

```bash
# Cron job để check APIs
0 */6 * * * cd /path/to/project && npm run test:apis
```

Nếu có lỗi, script sẽ exit với code 1.

---

**Happy Testing! 🎉**

Tất cả APIs đã được test kỹ lưỡng để đảm bảo quality và reliability. 