# Unit Tests - Kiểm tra UI và Database

Bộ unit tests toàn diện để kiểm tra giao diện và kết nối database của ứng dụng Freedom Training.

## 📋 Mục tiêu

Tests này giúp bạn kiểm tra:
- ✅ Giao diện có render đúng cách không
- ✅ API có kết nối và trả về dữ liệu đúng không  
- ✅ Database/Data source có hoạt động đúng không
- ✅ Toàn bộ luồng từ UI → API → Data có ổn định không

## 🚀 Chạy Tests

### Chạy tất cả tests UI và Database
```bash
npm run test:ui-db
```

### Chạy từng loại test riêng biệt

**1. Kiểm tra Database/Data connectivity:**
```bash
npm run test:database
```

**2. Kiểm tra API routes:**
```bash
npm run test:api-routes
```

**3. Kiểm tra Integration flow:**
```bash
npm run test:flow
```

**4. Kiểm tra với coverage:**
```bash
npm run test:coverage
```

## 📁 Cấu trúc Tests

```
__tests__/
├── database-connectivity.test.ts   # Kiểm tra kết nối data
├── api-routes.test.ts             # Kiểm tra API endpoints  
├── integration-flow.test.ts       # Kiểm tra luồng tích hợp
├── homepage.test.tsx              # Kiểm tra UI Homepage (WIP)
├── components.test.tsx            # Kiểm tra UI Components (WIP) 
├── run-ui-database-tests.js       # Script chạy tất cả tests
└── README.md                      # Hướng dẫn này
```

## 🔍 Các Test Cases

### Database Connectivity Tests
- ✅ Kiểm tra file `data/investors.json` tồn tại
- ✅ Validate cấu trúc dữ liệu đúng format
- ✅ Kiểm tra data integrity (không trùng ID, format đúng)
- ✅ Validate business logic (percentages, pools)
- ✅ Performance test đọc file

### API Routes Tests  
- ✅ Test endpoint `/api/investors` với các tham số khác nhau
- ✅ Kiểm tra pagination hoạt động đúng
- ✅ Test filter theo tier (premium, standard, basic)
- ✅ Error handling với input không hợp lệ
- ✅ Performance test với dataset lớn

### Integration Flow Tests
- ✅ Test luồng hoàn chỉnh UI → API → Data
- ✅ Kiểm tra dữ liệu trả về phù hợp với UI components
- ✅ Test real-world scenarios
- ✅ Concurrent requests handling
- ✅ Data consistency validation

### UI Component Tests (Work in Progress)
- 🚧 Test HomePage component rendering
- 🚧 Test InvestorShowcase component
- 🚧 Test user interactions
- 🚧 Test responsive design
- 🚧 Test error boundaries

## 📊 Xem Kết Quả

### Coverage Report
Sau khi chạy `npm run test:coverage`, mở file:
```
coverage/lcov-report/index.html
```

### Test Results
Kết quả test sẽ hiển thị:
- ✅ **PASS**: Test thành công
- ❌ **FAIL**: Test thất bại  
- ⚠️ **SKIP**: Test bị bỏ qua
- 📊 **Coverage**: % code được test

## 🐛 Troubleshooting

### Lỗi "Cannot find module"
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

### Lỗi "File not found"
Đảm bảo file `data/investors.json` tồn tại:
```bash
ls -la data/investors.json
```

### Lỗi Jest configuration
Kiểm tra file `jest.config.js` và `jest.setup.js` đã được cấu hình đúng.

## 🔧 Tùy chỉnh Tests

### Thêm test case mới
1. Tạo file `.test.ts` hoặc `.test.tsx` trong thư mục `__tests__/`
2. Import các testing utilities cần thiết
3. Viết describe và test cases
4. Chạy `npm test` để kiểm tra

### Mock API calls
```javascript
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ success: true, data: mockData }),
  })
)
```

### Mock components
```javascript
jest.mock('../src/components/SomeComponent', () => {
  return function MockedComponent(props) {
    return <div data-testid="mocked-component" {...props} />
  }
})
```

## 📝 Best Practices

1. **Đặt tên test rõ ràng**: Sử dụng tiếng Việt để dễ hiểu
2. **Test các edge cases**: Dữ liệu trống, lỗi network, input không hợp lệ
3. **Mock external dependencies**: API calls, file system, third-party libs
4. **Keep tests isolated**: Mỗi test độc lập, không phụ thuộc lẫn nhau
5. **Test behavior, not implementation**: Tập trung vào kết quả, không phải cách thực hiện

## 🎯 Mục Tiêu Coverage

- **API Routes**: > 90%
- **Database Operations**: > 85% 
- **UI Components**: > 80%
- **Integration Flows**: > 95%

## 📞 Hỗ Trợ

Nếu có vấn đề với tests:
1. Kiểm tra console logs để xem lỗi chi tiết
2. Chạy test với `--verbose` flag để xem thêm thông tin
3. Kiểm tra file data và environment variables
4. Đảm bảo tất cả dependencies đã được cài đặt

---

**Lưu ý**: Tests này giúp bạn phát hiện sớm các vấn đề về giao diện và database connectivity trước khi deploy production. 