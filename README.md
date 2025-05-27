# Freedom Training - Nền tảng học tập trực tuyến

Một ứng dụng NextJS hiện đại cho việc học tập và kiểm tra kiến thức trực tuyến với hệ thống thi đua điểm TUTE giữa các trường đại học.

## 🚀 Tính năng chính

- **Đăng nhập an toàn**: Hệ thống xác thực với email và mật khẩu
- **Quiz đa dạng**: Hỗ trợ câu hỏi single choice và multiple choice
- **Hệ thống điểm TUTE**: Tích lũy điểm thưởng cho mỗi câu trả lời đúng
- **Thi đua giữa các trường**: Bảng xếp hạng theo điểm TUTE của từng trường
- **Giao diện responsive**: Tối ưu cho cả desktop và mobile
- **Thiết kế hiện đại**: Phong cách trí thức giống Coursera

## 🛠️ Công nghệ sử dụng

- **Frontend**: NextJS 14 với App Router
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Language**: TypeScript
- **Data**: JSON files (không cần database)

## 📦 Cài đặt

1. Clone repository:
```bash
git clone <repository-url>
cd freedom-training
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Chạy ứng dụng:
```bash
npm run dev
```

4. Mở trình duyệt và truy cập: `http://localhost:3000`

## 👥 Tài khoản demo

Sử dụng các tài khoản sau để đăng nhập:

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
freedom-training/
├── src/
│   ├── app/                    # App Router pages
│   │   ├── dashboard/          # Trang dashboard
│   │   ├── quiz/              # Trang quiz
│   │   ├── leaderboard/       # Bảng xếp hạng
│   │   ├── layout.tsx         # Layout chính
│   │   ├── page.tsx           # Trang đăng nhập
│   │   └── globals.css        # CSS toàn cục
│   ├── contexts/              # React Contexts
│   │   └── AuthContext.tsx    # Context xác thực
│   ├── lib/                   # Utility functions
│   │   └── utils.ts           # Helper functions
│   └── types/                 # TypeScript types
│       └── index.ts           # Type definitions
├── data/                      # JSON data files
│   ├── users.json            # Dữ liệu người dùng
│   ├── schools.json          # Dữ liệu trường học
│   ├── quizzes.json          # Câu hỏi quiz
│   └── settings.json         # Cài đặt ứng dụng
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

## ⚙️ Cấu hình

Chỉnh sửa file `data/settings.json` để thay đổi:

```json
{
  "quizSettings": {
    "questionsPerQuiz": 5,        // Số câu hỏi mỗi quiz
    "timePerQuestion": 30,        // Thời gian mỗi câu (giây)
    "tutePointsPerCorrectAnswer": 1  // Điểm TUTE mỗi câu đúng
  }
}
```

## 📱 Responsive Design

Ứng dụng được thiết kế responsive, hoạt động tốt trên:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (< 768px)

## 🎨 Thiết kế

- **Màu chủ đạo**: Blue (#2563eb) và Indigo (#4f46e5)
- **Font**: Inter (Google Fonts)
- **Style**: Modern, clean, academic
- **Icons**: Lucide React
- **Animations**: Smooth transitions và hover effects

## 🔧 Development

### Scripts có sẵn

```bash
npm run dev          # Chạy development server
npm run build        # Build production
npm run start        # Chạy production server
npm run lint         # Kiểm tra linting
```

### Thêm câu hỏi mới

Chỉnh sửa file `data/quizzes.json`:

```json
{
  "id": "11",
  "question": "Câu hỏi mới?",
  "type": "single",           // "single" hoặc "multiple"
  "options": [
    "Đáp án A",
    "Đáp án B", 
    "Đáp án C",
    "Đáp án D"
  ],
  "correctAnswer": [0],       // Mảng index của đáp án đúng
  "category": "Danh mục"
}
```

### Thêm trường mới

Chỉnh sửa file `data/schools.json`:

```json
{
  "id": "new_school",
  "name": "Tên trường đầy đủ",
  "shortName": "TEN_NGAN",
  "logo": "/images/logo.png",
  "totalTutePoints": 0
}
```

## 🤝 Đóng góp

1. Fork dự án
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📄 License

Dự án này được phân phối dưới MIT License. Xem file `LICENSE` để biết thêm chi tiết.

## 📞 Liên hệ

- Email: support@freedomtraining.edu.vn
- Website: [Freedom Training](https://freedomtraining.edu.vn)

---

**Freedom Training** - Nền tảng học tập trực tuyến hiện đại cho sinh viên Việt Nam 🇻🇳
