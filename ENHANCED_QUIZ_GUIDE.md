# 🎓 Hướng dẫn Enhanced Quiz - Học & Kiểm tra tích hợp

## 🎯 Tổng quan
Enhanced Quiz là luồng học tập mới được tích hợp vào Freedom Training, kết hợp:
- **Học kiến thức** qua text và video
- **Kiểm tra hiểu biết** qua quiz
- **Tích lũy điểm** TUTE cho cá nhân và trường

## 🚀 Luồng hoạt động

### 1. Từ Dashboard → Quiz Topics
- Đăng nhập vào hệ thống
- Click **"Học & Quiz"** trên Dashboard
- Chọn chủ đề muốn học

### 2. Giai đoạn Học tập (Learning Phase)
**Nội dung học:**
- 📖 **Text blocks**: Kiến thức cơ bản với HTML formatting
- 🎥 **Video blocks**: YouTube videos với progress tracking
- ✅ **Auto-advance**: Tự động chuyển block tiếp theo

**Tính năng:**
- **Sidebar navigation**: Click để nhảy đến block bất kỳ
- **Progress tracking**: Hiển thị % hoàn thành
- **Video requirements**: Phải xem tối thiểu 80% để tiếp tục

### 3. Giai đoạn Quiz (Quiz Phase)
**Sau khi học xong** → Tự động chuyển sang quiz
- **3 loại câu hỏi**: Single choice, Multiple choice, Text input
- **Instant feedback**: Explanation ngay sau khi trả lời
- **Navigation**: Click sidebar để review câu hỏi

### 4. Kết quả & Điểm số
**Tính điểm:**
- 🎯 **Base points**: 30 điểm cho việc hoàn thành học tập
- 📝 **Quiz points**: 10 điểm/câu đúng
- 🎥 **Video bonus**: 5 điểm/video xem đủ 80%

## 📚 Chủ đề hiện có

### 1. Lập trình Web (💻)
- **Độ khó**: Cơ bản
- **Thời gian**: ~25 phút
- **Nội dung**: HTML, CSS, JavaScript basics
- **Learning flow**: 
  - Text: Giới thiệu Web Development
  - Video: HTML cơ bản (5 phút)
  - Text: CSS styling
  - Quiz: 3 câu hỏi

### 2. React.js Cơ bản (⚛️)
- **Độ khó**: Trung bình  
- **Thời gian**: ~20 phút
- **Nội dung**: React components, Virtual DOM
- **Learning flow**:
  - Text: React.js introduction
  - Video: React components (3 phút)
  - Quiz: 2 câu hỏi

### 3. JavaScript Cơ bản (🟨)
- **Độ khó**: Cơ bản
- **Thời gian**: ~15 phút
- **Nội dung**: JavaScript fundamentals
- **Learning flow**:
  - Text: JavaScript overview
  - Video: JS basics (10 phút)
  - Quiz: 1 câu hỏi

## 🎮 Cách sử dụng

### Navigation trong bài học
- **Header progress bar**: Hiển thị tiến độ tổng thể
- **Sidebar**: 
  - 🔵 Màu xanh: Block đang học
  - ✅ Màu xanh lá: Block đã hoàn thành
  - ⚪ Màu xám: Block chưa học
- **Bottom navigation**: Buttons "Trước" và "Tiếp"

### Video watching
- **Embedded YouTube**: Iframe với controls
- **Progress tracking**: Tự động lưu thời gian đã xem
- **Completion requirement**: 80% minimum để unlock tiếp theo
- **Continue button**: Chỉ active khi đạt yêu cầu

### Quiz answering
- **Single choice**: Radio buttons
- **Multiple choice**: Checkboxes
- **Text input**: Free text với auto-check
- **Immediate feedback**: Đúng/sai + explanation
- **Auto-advance**: Chuyển câu tiếp theo sau feedback

## 🏆 Điểm số & Thành tích

### Cách tính điểm TUTE
```
Total Points = Base (30) + Quiz (10×correct) + Video (5×completed)
```

### Ví dụ:
- Hoàn thành học tập: **+30 điểm**
- Trả lời đúng 3/3 quiz: **+30 điểm** 
- Xem đủ 2 video: **+10 điểm**
- **Tổng**: 70 điểm TUTE

### Completion screen
- 📊 **Quiz score**: X/Y câu đúng
- 🏆 **TUTE points**: Điểm nhận được
- 📈 **Accuracy**: % chính xác
- 🔙 **Return button**: Quay về topics

## 🛠️ Tính năng kỹ thuật

### Data Structure
```json
{
  "id": "topic-id",
  "title": "Topic Name", 
  "learningContent": [
    { "type": "text", "title": "...", "content": "..." },
    { "type": "video", "youtubeId": "...", "duration": 300 },
    { "type": "text", "title": "...", "content": "..." }
  ],
  "quizQuestions": [
    { "type": "single", "question": "...", "options": [...] }
  ]
}
```

### Session Management
- **Real-time progress**: Lưu trạng thái học tập
- **Video tracking**: localStorage cho watch time
- **Phase switching**: learning → quiz → completed
- **Answer storage**: Lưu tất cả câu trả lời

### UI Components
- **TextBlock**: HTML content với prose styling
- **VideoBlock**: YouTube iframe với progress
- **QuizBlock**: Multi-type question handler
- **Enhanced Quiz Page**: Main orchestrator

## 🎯 Lợi ích của luồng mới

### So với quiz cũ:
- ✅ **Học trước, quiz sau**: Đảm bảo hiểu biết
- ✅ **Đa dạng content**: Text + Video + Quiz
- ✅ **Progress tracking**: Theo dõi chi tiết
- ✅ **Better UX**: Luồng mượt mà, tự nhiên
- ✅ **Higher engagement**: Video tương tác

### So với lessons riêng:
- ✅ **Unified flow**: Một luồng duy nhất
- ✅ **Immediate validation**: Quiz ngay sau học
- ✅ **Better retention**: Kiểm tra hiểu biết ngay
- ✅ **Simpler navigation**: Ít confusion hơn

## 🚀 Để test ngay:
1. Chạy `npm run dev`
2. Đăng nhập vào hệ thống  
3. Click **"Học & Quiz"** trên Dashboard
4. Chọn **"Lập trình Web"**
5. Trải nghiệm: Text → Video → Quiz → Results!

---
*Luồng Enhanced Quiz mang lại trải nghiệm học tập hoàn chỉnh và hiệu quả! 🎉* 