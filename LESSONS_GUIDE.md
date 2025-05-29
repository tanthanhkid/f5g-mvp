# 📚 Hướng dẫn sử dụng tính năng Bài học (Lessons)

## 🎯 Tổng quan
Tính năng Bài học mới đã được tích hợp vào Freedom Training, cho phép người dùng học tập qua:
- **Nội dung văn bản** với HTML formatting
- **Video YouTube** nhúng với progress tracking  
- **Quiz tương tác** xen kẽ trong bài học

## 🚀 Cách truy cập

### 1. Từ Dashboard
- Đăng nhập vào hệ thống
- Trên Dashboard, click vào:
  - **Button "Bài học"** ở welcome section (màu trắng)
  - Hoặc **Card "Bài học"** ở phần Action Cards (màu xanh lá)

### 2. Trực tiếp qua URL
- Truy cập: `http://localhost:3000/lessons`

## 📖 Cách sử dụng

### Trang danh sách bài học (`/lessons`)
1. **Lọc bài học**: Sử dụng dropdown để lọc theo:
   - Danh mục (Lập trình, etc.)
   - Độ khó (Cơ bản, Trung bình, Nâng cao)

2. **Xem thông tin bài học**:
   - Tiêu đề và mô tả
   - Thời gian ước tính
   - Số lượng content blocks
   - Mục tiêu học tập
   - Tags

3. **Bắt đầu học**: Click "Bắt đầu học" trên bài học muốn học

### Trong bài học (`/lessons/[id]`)

#### Navigation
- **Sidebar bên trái**: Hiển thị tất cả content blocks
  - ✅ Màu xanh: Đã hoàn thành
  - 🔵 Màu xanh đậm: Đang học
  - ⚪ Màu xám: Chưa học
- **Progress bar**: Hiển thị % hoàn thành
- **Navigation buttons**: "Trước" và "Tiếp" ở cuối

#### Các loại Content Blocks

##### 📝 Text Block
- Hiển thị nội dung HTML với styling đẹp
- Click "Tiếp tục" để chuyển block tiếp theo

##### 🎥 Video Block  
- Nhúng video YouTube
- **Progress tracking**: Hiển thị % đã xem
- **Yêu cầu**: Phải xem tối thiểu 80% để tiếp tục
- Button "Tiếp tục" chỉ active khi đạt yêu cầu

##### ❓ Quiz Block
- **3 loại câu hỏi**:
  - Single choice (chọn 1 đáp án)
  - Multiple choice (chọn nhiều đáp án)  
  - Text input (nhập văn bản)
- **Feedback ngay lập tức**: Đúng/sai với explanation
- **Difficulty badge**: Dễ/Trung bình/Khó

#### Hoàn thành bài học
- Khi hoàn thành tất cả blocks → Hiển thị màn hình kết quả
- **Điểm số**: % hoàn thành
- **TUTE Points**: Điểm nhận được dựa trên:
  - Hoàn thành bài học: +50 điểm
  - Mỗi quiz đúng: +10-15 điểm  
  - Mỗi video xem đủ: +5 điểm

## 📊 Dữ liệu mẫu hiện có

### Bài học 1: "Giới thiệu về Lập trình Web"
- **Thời gian**: 45 phút
- **Độ khó**: Cơ bản
- **Nội dung**: 
  1. Text: Lập trình Web là gì?
  2. Video: HTML Cơ bản (10 phút)
  3. Quiz: HTML là viết tắt của gì?
  4. Text: Cấu trúc HTML cơ bản
  5. Quiz: Thẻ nào thuộc phần head?
  6. Video: CSS Cơ bản (12 phút)
  7. Text: CSS - Cascading Style Sheets
  8. Quiz: Cách tốt nhất viết CSS?
  9. Video: JavaScript Cơ bản (15 phút)
  10. Quiz: JavaScript dùng để làm gì? (text input)

### Bài học 2: "React.js Cơ bản"  
- **Thời gian**: 60 phút
- **Độ khó**: Trung bình
- **Nội dung**: React concepts với video và quiz

## 🛠️ Tính năng kỹ thuật

### Video Integration
- YouTube iframe API
- Progress tracking với localStorage
- Minimum watch percentage configurable
- Auto-advance khi đạt yêu cầu

### Quiz Enhancement
- Support text input answers
- Explanation sau mỗi câu hỏi
- Difficulty levels với visual indicators
- Custom points per question

### Progress Tracking
- Real-time progress calculation
- Session persistence
- Video watch time tracking
- Quiz answers storage

### Points System
- Base points: 50 cho lesson completion
- Quiz points: 10-15 per correct answer
- Video points: 5 per completed video
- Configurable trong settings.json

## 🎨 UI/UX Features
- **Responsive design**: Mobile-friendly
- **Visual feedback**: Colors cho completion status
- **Smooth transitions**: Auto-advance với delay
- **Progress indicators**: Multiple progress bars
- **Accessibility**: Proper ARIA labels

## 🔧 Configuration

### Settings (data/settings.json)
```json
{
  "learningSettings": {
    "tutePointsPerLessonCompletion": 50,
    "tutePointsPerVideoWatched": 5, 
    "minimumVideoWatchPercentage": 80
  }
}
```

### Lesson Structure (data/lessons.json)
- Mỗi lesson có array `contentBlocks`
- Mỗi block có `type`: "text" | "video" | "quiz"
- Support prerequisites và learning objectives

## 🚀 Để test ngay:
1. Chạy `npm run dev`
2. Đăng nhập vào hệ thống
3. Click "Bài học" trên Dashboard
4. Chọn "Giới thiệu về Lập trình Web"
5. Trải nghiệm flow: Text → Video → Quiz!

---
*Tính năng này mở rộng từ quiz đơn thuần thành hệ thống học tập tương tác hoàn chỉnh! 🎉* 