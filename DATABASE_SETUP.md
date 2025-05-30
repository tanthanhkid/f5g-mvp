# Hướng dẫn thiết lập Database Neon

## Bước 1: Tạo tài khoản Neon

1. Truy cập [Neon Console](https://neon.tech/)
2. Đăng ký tài khoản miễn phí 
3. Tạo project mới với tên `f5g-freedom-training`

## Bước 2: Lấy Connection String

1. Sau khi tạo project, vào tab **Dashboard**
2. Tìm phần **Connection Details**
3. Copy **Connection String** có dạng:
   ```
   postgresql://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech:5432/database_name?sslmode=require
   ```

## Bước 3: Cấu hình Environment

1. Copy file `env.example` thành `.env`:
   ```bash
   cp env.example .env
   ```

2. Mở file `.env` và thay thế connection string:
   ```env
   DATABASE_URL="your_actual_neon_connection_string"
   POSTGRES_CONNECTION_STRING="your_actual_neon_connection_string"
   ```

## Bước 4: Chạy Migration

Sau khi cấu hình xong, chạy lệnh để tạo bảng và insert dữ liệu mẫu:

```bash
npm run setup-database
```

Hoặc sử dụng Cursor với MCP PostgreSQL:
- Nhấn `Ctrl+I` để mở Composer
- Nói: "Tạo tất cả các bảng và insert dữ liệu mẫu từ folder data/"

## Cấu trúc Database

Các bảng sẽ được tạo:

### 1. schools
- Thông tin các trường đại học
- Điểm TUTE tổng của mỗi trường

### 2. users  
- Thông tin sinh viên
- Liên kết với trường học
- Điểm TUTE cá nhân

### 3. quizzes
- Câu hỏi quiz với đáp án
- Hỗ trợ single choice và multiple choice

### 4. lessons
- Bài học với nội dung HTML
- Video YouTube embed
- Quiz inline

### 5. quiz_topics
- Chủ đề quiz chi tiết
- Phân loại theo difficulty

### 6. user_quiz_attempts
- Lịch sử làm bài của user
- Điểm số và thời gian

### 7. user_progress
- Tiến độ học tập
- Lessons đã hoàn thành

## Kết nối với Frontend

Sau khi setup database xong, bạn cần:

1. Cài đặt database client:
   ```bash
   npm install @neondatabase/serverless
   # hoặc
   npm install pg @types/pg
   ```

2. Tạo database connection trong `src/lib/db.ts`

3. Thay thế các file JSON bằng database queries

4. Update các component để sử dụng database

## Troubleshooting

### Lỗi SSL
Nếu gặp lỗi SSL, thêm `?sslmode=require` vào cuối connection string.

### Lỗi Permission  
Đảm bảo user database có đủ quyền CREATE TABLE, INSERT, SELECT.

### Connection timeout
Neon có thể tự động suspend database. Đợi vài giây và thử lại. 