# Freedom Training - Nền tảng học tập trực tuyến

Một ứng dụng NextJS hiện đại cho việc học tập và kiểm tra kiến thức trực tuyến với hệ thống thi đua điểm TUTE giữa các trường đại học.

## 🚀 Tính năng chính

- **Đăng nhập an toàn**: Hệ thống xác thực với email và mật khẩu
- **Quiz đa dạng**: Hỗ trợ câu hỏi single choice và multiple choice
- **Hệ thống điểm TUTE**: Tích lũy điểm thưởng cho mỗi câu trả lời đúng
- **Thi đua giữa các trường**: Bảng xếp hạng theo điểm TUTE của từng trường
- **Database thực tế**: Sử dụng Neon PostgreSQL để lưu trữ dữ liệu
- **Giao diện responsive**: Tối ưu cho cả desktop và mobile
- **Thiết kế hiện đại**: Phong cách trí thức giống Coursera

## 🛠️ Công nghệ sử dụng

- **Frontend**: NextJS 14 với App Router
- **Database**: Neon PostgreSQL (Serverless)
- **ORM**: Neon Serverless Driver
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Language**: TypeScript
- **Authentication**: Custom JWT-based auth

## 📦 Cài đặt và Thiết lập

### Bước 1: Clone repository

```bash
git clone <repository-url>
cd f5g-mvp
```

### Bước 2: Cài đặt dependencies

```bash
npm install
```

### Bước 3: Thiết lập Database

1. **Tạo tài khoản Neon**:
   - Truy cập [Neon Console](https://neon.tech/)
   - Đăng ký tài khoản miễn phí
   - Tạo project mới với tên `f5g-freedom-training`

2. **Lấy Connection String**:
   - Sau khi tạo project, vào tab **Dashboard**
   - Tìm phần **Connection Details**
   - Copy **Connection String**

3. **Cấu hình Environment**:
   ```bash
   cp env.example .env
   ```
   
   Mở file `.env` và cập nhật:
   ```env
   DATABASE_URL="your_actual_neon_connection_string"
   POSTGRES_CONNECTION_STRING="your_actual_neon_connection_string"
   NODE_ENV=development
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Setup Database**:
   ```bash
   npm run setup-database
   ```

5. **Kiểm tra Database** (optional):
   ```bash
   npm run db-check
   ```

### Bước 4: Chạy ứng dụng

```bash
npm run dev
```

Mở trình duyệt và truy cập: `http://localhost:3000`

## 👥 Tài khoản demo

Sau khi setup database, bạn có thể sử dụng các tài khoản sau để đăng nhập:

| Email | Password | Trường |
|-------|----------|--------|
| student1@hust.edu.vn | 123456 | Đại học Bách khoa Hà Nội |
| student2@hust.edu.vn | 123456 | Đại học Bách khoa Hà Nội |
| student1@bku.edu.vn | 123456 | Đại học Bách khoa TP.HCM |
| student2@bku.edu.vn | 123456 | Đại học Bách khoa TP.HCM |
| student1@vnu.edu.vn | 123456 | Đại học Quốc gia Hà Nội |
| student2@vnu.edu.vn | 123456 | Đại học Quốc gia Hà Nội |

## 📁 Cấu trúc dự án

```
f5g-mvp/
├── src/
│   ├── app/                    # App Router pages
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication
│   │   │   ├── quiz/          # Quiz operations
│   │   │   └── leaderboard/   # Leaderboard data
│   │   ├── dashboard/         # Trang dashboard
│   │   ├── quiz/             # Trang quiz
│   │   ├── leaderboard/      # Bảng xếp hạng
│   │   ├── layout.tsx        # Layout chính
│   │   ├── page.tsx          # Trang đăng nhập
│   │   └── globals.css       # CSS toàn cục
│   ├── contexts/             # React Contexts
│   │   └── AuthContext.tsx   # Context xác thực
│   ├── lib/                  # Utility functions
│   │   ├── db.ts            # Database connection & models
│   │   └── utils.ts         # Helper functions
│   └── types/               # TypeScript types
│       └── index.ts         # Type definitions
├── scripts/                 # Database scripts
│   ├── setup-database.sql  # Database schema
│   ├── seed-data.sql       # Sample data
│   └── setup-database.js   # Setup script
├── data/                   # Legacy JSON data (for reference)
└── README.md
```

## 🎯 Cách sử dụng

### 1. Đăng nhập
- Truy cập trang chủ
- Nhập email và mật khẩu (sử dụng tài khoản demo)
- Nhấn "Đăng nhập"

### 2. Dashboard
- Xem thông tin cá nhân và trường học
- Theo dõi điểm TUTE hiện tại
- Bắt đầu quiz mới
- Xem bảng xếp hạng

### 3. Làm Quiz
- Chọn "Bắt đầu Quiz" từ dashboard
- Trả lời 5 câu hỏi (có thể cấu hình)
- Mỗi câu có thời gian giới hạn 30 giây
- Nhận điểm TUTE dựa trên số câu đúng

### 4. Bảng xếp hạng
- Xem thứ hạng của tất cả các trường
- So sánh điểm TUTE giữa các trường
- Theo dõi vị trí của trường mình

## 🗃️ Database Schema

### Các bảng chính:
- **schools**: Thông tin các trường đại học
- **users**: Thông tin sinh viên và điểm TUTE
- **quizzes**: Câu hỏi với đáp án và độ khó
- **lessons**: Bài học với nội dung rich text
- **quiz_categories**: Phân loại câu hỏi
- **user_quiz_attempts**: Lịch sử làm bài
- **user_lesson_progress**: Tiến độ học tập
- **user_achievements**: Huy hiệu và thành tích

## 🔧 Development

### Scripts có sẵn

```bash
npm run dev              # Chạy development server
npm run build            # Build production
npm run start            # Chạy production server
npm run lint             # Kiểm tra linting
npm run setup-database   # Setup database với Neon
npm run db-check         # Kiểm tra kết nối database
```

### API Endpoints

- `POST /api/auth/login` - Đăng nhập
- `GET /api/quiz/random` - Lấy quiz ngẫu nhiên
- `POST /api/quiz/submit` - Submit kết quả quiz
- `GET /api/leaderboard` - Bảng xếp hạng

### Thêm câu hỏi mới

Sử dụng MCP PostgreSQL trong Cursor hoặc chạy SQL trực tiếp:

```sql
INSERT INTO quizzes (question, type, options, correct_answer, category_id, difficulty, points) 
VALUES (
  'Câu hỏi mới?',
  'single',
  '["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"]'::jsonb,
  '[0]'::jsonb,
  'cong-nghe',
  'easy',
  1
);
```

## 🤝 Đóng góp

1. Fork dự án
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 🔍 Troubleshooting

### Lỗi kết nối Database
- Kiểm tra `DATABASE_URL` trong file `.env`
- Đảm bảo connection string đúng format
- Chạy `npm run db-check` để test kết nối

### Lỗi Permission
- Đảm bảo user database có đủ quyền CREATE, INSERT, SELECT
- Kiểm tra firewall settings của Neon

### Database bị suspend
- Neon có thể tự động suspend database khi không sử dụng
- Đợi vài giây và thử lại

## 📄 License

Dự án này được phân phối dưới MIT License.

## 📞 Liên hệ

- Email: support@freedomtraining.edu.vn
- Website: [Freedom Training](https://freedomtraining.edu.vn)

---

**Freedom Training** - Nền tảng học tập trực tuyến hiện đại với database thực tế 🇻🇳
