# 🧪 HƯỚNG DẪN TESTING - FREEDOM TRAINING PLATFORM

## 📋 Tổng quan

Dự án Freedom Training có một bộ test toàn diện bao gồm:
- **Database Tests**: Kiểm tra kết nối và tính toàn vẹn dữ liệu  
- **API Tests**: Kiểm tra các endpoints REST API
- **Integration Tests**: Kiểm tra luồng tích hợp UI → API → Database
- **Component Tests**: Kiểm tra rendering và tương tác giao diện

## 🚀 Các lệnh test có sẵn

### **Chạy tất cả tests**
```bash
npm run test
```
- Chạy **TẤT CẢ** test suites trong dự án
- Tổng hợp kết quả chi tiết theo category
- Hiển thị thống kê và hướng dẫn sửa lỗi

### **Chạy tests ổn định (Recommended)**
```bash
npm run test:stable
# hoặc
npm run test:core
```
- Chỉ chạy **Core Tests** đã hoạt động ổn định
- Bao gồm: Database, API Routes, Integration Flow
- **Tốc độ nhanh, kết quả đáng tin cậy**

### **Chạy tests từng loại riêng biệt**

#### Database Tests
```bash
npm run test:database
```
- Kiểm tra file `data/investors.json`
- Validation cấu trúc dữ liệu
- Kiểm tra Prisma schema
- Performance đọc file

#### API Routes Tests  
```bash
npm run test:api-routes
```
- Test endpoint `/api/investors`
- Pagination, filtering, sorting
- Error handling
- Response format validation

#### Integration Flow Tests
```bash
npm run test:flow
```
- Test luồng UI → API → Database
- Performance testing
- Data consistency validation
- Real-world scenarios

### **Development Tools**

#### Watch mode
```bash
npm run test:watch
```
- Auto re-run tests khi file thay đổi
- Chỉ chạy tests related đến files đã sửa

#### Coverage report
```bash
npm run test:coverage
```
- Tạo báo cáo test coverage
- Output tại `coverage/lcov-report/index.html`

## 📊 Hiểu kết quả test

### Khi chạy `npm run test`:

```
🧪 CHẠY TẤT CẢ TESTS - FREEDOM TRAINING PLATFORM

📋 Danh sách tất cả tests sẽ chạy:
📂 Core Tests:
  🗄️ Database Connectivity Tests
  🌐 API Routes Tests  
  🔄 Integration Flow Tests

✅ Core Tests: 3/3 suites passed
  ✅ 🗄️ Database Connectivity Tests (12/12 tests) - 3146ms
  ✅ 🌐 API Routes Tests (13/13 tests) - 3183ms
  ✅ 🔄 Integration Flow Tests (8/8 tests) - 3396ms

📈 THỐNG KÊ TỔNG QUAN:
🧪 Test Suites: 5 passed, 3 failed, 8 total
🔍 Individual Tests: 33 passed, 0 failed, 33 total
📊 Success Rate: 100%
```

### Ý nghĩa các biểu tượng:
- ✅ **PASS**: Test suite chạy thành công
- ❌ **FAIL**: Test suite có lỗi
- 🗄️ **Database tests**
- 🌐 **API tests**  
- 🔄 **Integration tests**
- 🏠 **UI Component tests**

## 🔧 Troubleshooting

### Core Tests fail

#### Database Tests fail:
```bash
# Kiểm tra file dữ liệu
ls -la data/investors.json

# Chạy riêng để xem lỗi chi tiết
npm run test:database
```

#### API Tests fail:
```bash
# Kiểm tra API endpoint
curl http://localhost:3000/api/investors

# Debug API test
npm run test:api-routes
```

### UI Tests có vấn đề

UI Tests (HomePage, Components) có thể fail do:
- Canvas API issues trong jsdom
- React component complexity
- Missing mocks

**Giải pháp**: Sử dụng Core Tests để kiểm tra business logic:
```bash
npm run test:stable
```

### Tests chạy chậm

```bash
# Chỉ chạy 1 test file
npx jest __tests__/database-connectivity.test.ts

# Chạy với cache
npm run test -- --cache

# Chạy parallel
npm run test -- --maxWorkers=4
```

## 📁 Cấu trúc Test Files

```
__tests__/
├── database-connectivity.test.ts    # Database tests
├── api-routes.test.ts              # API endpoint tests  
├── integration-flow.test.ts        # Integration tests
├── homepage.test.tsx               # HomePage component
├── components.test.tsx             # UI Components
├── run-ui-database-tests.js        # Legacy script
└── README.md                       # Test documentation

jest.setup.ui.js                   # Jest setup for UI tests
jest.setup.api.js                  # Jest setup for API tests
jest.config.js                     # Jest configuration
run-all-tests.js                   # Main test runner
run-core-tests.js                  # Core tests runner
```

## 🎯 Best Practices

### Khi phát triển feature mới:

1. **Viết tests trước** (TDD approach)
2. **Chạy Core Tests** để đảm bảo không break existing code:
   ```bash
   npm run test:core
   ```
3. **Thêm tests cho feature mới** vào đúng category
4. **Chạy full test suite** trước khi commit:
   ```bash
   npm run test
   ```

### Khi debug issues:

1. **Chạy test riêng lẻ** để isolate issue:
   ```bash
   npx jest __tests__/specific-test.test.ts --verbose
   ```
2. **Sử dụng watch mode** để development nhanh:
   ```bash
   npm run test:watch
   ```
3. **Check coverage** để đảm bảo test đầy đủ:
   ```bash
   npm run test:coverage
   ```

## 🚨 CI/CD Integration

### GitHub Actions example:
```yaml
- name: Run Tests
  run: |
    npm run test:stable  # Chỉ chạy core tests
    # npm run test       # Hoặc chạy tất cả nếu muốn
```

### Exit codes:
- `0`: Tất cả tests pass
- `1`: Có tests fail

## 📚 Thêm tests mới

### 1. Database test mới:
Thêm vào `__tests__/database-connectivity.test.ts`

### 2. API test mới:  
Thêm vào `__tests__/api-routes.test.ts`

### 3. Component test mới:
Tạo file `__tests__/new-component.test.tsx`

### 4. Integration test mới:
Thêm vào `__tests__/integration-flow.test.ts`

Script `run-all-tests.js` sẽ **tự động phát hiện** và chạy test files mới!

## 💡 Tips

### Chạy tests nhanh nhất:
```bash
npm run test:stable    # ~10 giây
```

### Debug chi tiết nhất:
```bash
npm run test           # ~30 giây
```

### Development workflow:
```bash
npm run test:watch     # Auto-rerun
```

### Production check:
```bash
npm run test:coverage  # Full coverage
```

---

🎉 **Happy Testing!** Với bộ test này, bạn có thể tự tin rằng Freedom Training platform hoạt động ổn định! 