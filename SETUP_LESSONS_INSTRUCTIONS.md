# 🚀 Hướng Dẫn Setup Lessons System

## Bước 1: Tạo Database Connection

### 1.1. Tạo file `.env` trong thư mục root

Tạo file `.env` với nội dung sau:

```bash
# Database Configuration for Freedom Training

# Neon PostgreSQL Connection String
# Thay thế bằng connection string thực tế từ Neon Console
DATABASE_URL="postgresql://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech:5432/database_name?sslmode=require"

# Alternative names for PostgreSQL MCP tools
POSTGRES_CONNECTION_STRING="postgresql://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech:5432/database_name?sslmode=require"

# Application Environment
NODE_ENV=development

# Next.js Configuration
NEXTAUTH_SECRET="freedom-training-secret-key-2024"
NEXTAUTH_URL="http://localhost:3000"
```

### 1.2. Lấy Connection String từ Neon

1. Truy cập [Neon Console](https://console.neon.tech/)
2. Chọn project của bạn
3. Vào tab "Connection"
4. Copy connection string dạng: `postgresql://username:password@hostname:port/database?sslmode=require`
5. Paste vào file `.env` thay thế cho `DATABASE_URL` và `POSTGRES_CONNECTION_STRING`

## Bước 2: Setup Lessons System (Standalone)

Chạy script để tạo lessons tables:

```bash
node scripts/setup-lessons-standalone.js
```

Script này sẽ:
- ✅ Tạo tables: `lessons`, `lesson_content_blocks`, `user_lesson_progress`
- ✅ Insert 2 lessons mẫu với content blocks
- ✅ Tạo indexes và triggers cần thiết
- ⚠️ **Lưu ý**: `user_lesson_progress` chưa có foreign key đến `users` table

## Bước 3: Test API Lessons

Sau khi setup xong, chạy:

```bash
npm run dev
```

Truy cập:
- **Lessons API**: `http://localhost:3001/api/lessons`
- **Lessons Page**: `http://localhost:3001/lessons`

## Bước 4: Full Database Setup (Tùy chọn)

Nếu muốn setup toàn bộ database với users, schools, quizzes:

```bash
npm run setup-database
```

Sau đó chạy migration để add foreign key constraints:

```bash
node scripts/add-lessons-constraints.js
```

## 🔧 Troubleshooting

### Lỗi "relation does not exist"
- Kiểm tra `.env` file có đúng DATABASE_URL không
- Kiểm tra kết nối internet và Neon database có online không

### Lỗi connection
- Kiểm tra username/password trong connection string
- Đảm bảo database được tạo trong Neon console

### Lỗi permissions
- Kiểm tra user có quyền CREATE TABLE trong database không

## 📊 Expected Results

Sau khi setup thành công, bạn sẽ thấy:

```
📈 Thống kê dữ liệu lessons:
   Lessons: 2 bản ghi
   Content Blocks: 10 bản ghi

📚 Danh sách lessons:
   lesson_1: Giới thiệu về Lập trình Web (programming, beginner, 45min)
   lesson_2: React.js Cơ bản (programming, intermediate, 60min)
```

## 🚀 Next Steps

1. Test API endpoints
2. Test frontend lessons page
3. Setup users table để enable full functionality
4. Add progress tracking và user authentication

---

**🎯 Mục tiêu Phase 2**: Hoàn thành migration Lessons system từ JSON sang PostgreSQL với đầy đủ chức năng progress tracking và content management. 