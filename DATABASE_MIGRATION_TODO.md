# 🔄 DANH SÁCH CẬP NHẬT: JSON → DATABASE

## 📋 Các file CORE cần cập nhật ngay lập tức

### 1. **AuthContext.tsx** ⚠️ QUAN TRỌNG
- **File**: `src/contexts/AuthContext.tsx`
- **Vấn đề**: Đang sử dụng `usersData` từ JSON
- **Cần thay đổi**: Gọi API `/api/auth/login` thay vì check JSON
- **Ưu tiên**: CAO

### 2. **Dashboard Page** ⚠️ QUAN TRỌNG  
- **File**: `src/app/dashboard/page.tsx`
- **Vấn đề**: 
  - Import `schoolsData` và `usersData` từ JSON
  - Tính toán ranking từ static data
- **Cần thay đổi**: Gọi API để lấy user info và school data
- **Ưu tiên**: CAO

### 3. **Leaderboard Page** ⚠️ QUAN TRỌNG
- **File**: `src/app/leaderboard/page.tsx` 
- **Vấn đề**: Import `schoolsData` từ JSON
- **Cần thay đổi**: Gọi API `/api/leaderboard?type=schools`
- **Ưu tiên**: CAO

### 4. **Quiz Page** ⚠️ QUAN TRỌNG
- **File**: `src/app/quiz/page.tsx`
- **Vấn đề**: 
  - Import `quizzesData` và `settingsData` từ JSON
  - Logic lấy random questions từ static data
- **Cần thay đổi**: Gọi API `/api/quiz/random` và `/api/quiz/submit`
- **Ưu tiên**: CAO

### 5. **Lessons Pages** 📚 TRUNG BÌNH
- **Files**: 
  - `src/app/lessons/page.tsx`
  - `src/app/lessons/[id]/page.tsx`
- **Vấn đề**: Import `lessonsData` từ JSON
- **Cần thay đổi**: Tạo API routes cho lessons và cập nhật
- **Ưu tiên**: TRUNG BÌNH

## 📋 Các file FEATURE khác (ưu tiên thấp)

### 6. **Other Features** 📎 THẤP
- `src/app/quiz-topics/page.tsx` - Quiz topics
- `src/app/enhanced-quiz/[topicId]/page.tsx` - Enhanced quiz
- `src/components/NativeAd.tsx` - Ads component
- `src/app/sponsor-analytics/page.tsx` - Analytics
- `src/app/page.tsx` - Landing page với investors
- `src/app/influencer-program/page.tsx` - Influencers
- `src/app/investors/page.tsx` - Investors list
- `src/app/investors/[id]/page.tsx` - Investor detail
- `src/app/ad-management/page.tsx` - Ad management

## 🚀 KẾ HOẠCH THỰC HIỆN

### Phase 1: Core Features (Ưu tiên CAO) 🔴
1. **AuthContext.tsx** - Login với database
2. **Dashboard** - User info và school data từ API
3. **Leaderboard** - Schools ranking từ database  
4. **Quiz** - Questions và scoring từ database

### Phase 2: Content Features (Ưu tiên TRUNG BÌNH) 🟡
1. Tạo API routes cho lessons: `/api/lessons`
2. Cập nhật lessons pages để dùng API
3. Implement lesson progress tracking

### Phase 3: Additional Features (Ưu tiên THẤP) 🟢
1. Quiz topics và enhanced quiz
2. Analytics và ads management
3. Investors và influencers features

## 📝 CHI TIẾT CẬP NHẬT

### AuthContext.tsx
```typescript
// BEFORE: 
const foundUser = usersData.find(u => u.email === email && u.password === password);

// AFTER:
const response = await fetch('/api/auth/login', {
  method: 'POST',
  body: JSON.stringify({ email, password })
});
```

### Dashboard Page  
```typescript
// BEFORE:
import schoolsData from '../../../data/schools.json';
import usersData from '../../../data/users.json';

// AFTER:
const [userSchool, setUserSchool] = useState(null);
useEffect(() => {
  fetch('/api/leaderboard?type=schools').then(...);
}, []);
```

### Quiz Page
```typescript
// BEFORE:
const randomQuestions = getRandomQuestions(quizzesData, limit);

// AFTER:
useEffect(() => {
  fetch('/api/quiz/random?limit=5').then(...);
}, []);
```

## ✅ CÁC FILE ĐÃ SẴN SÀNG

- ✅ `src/lib/db.ts` - Database service
- ✅ `src/app/api/auth/login/route.ts` - Auth API  
- ✅ `src/app/api/quiz/random/route.ts` - Quiz API
- ✅ `src/app/api/quiz/submit/route.ts` - Submit API
- ✅ `src/app/api/leaderboard/route.ts` - Leaderboard API

## 🎯 MỤC TIÊU

Sau khi hoàn thành Phase 1:
- ✅ Users có thể login qua database
- ✅ Dashboard hiển thị data thực từ database  
- ✅ Quiz system hoàn toàn sử dụng database
- ✅ Leaderboard real-time từ database
- ✅ TUTE points được tính và lưu chính xác

---

**🚧 Bước tiếp theo: Bắt đầu với AuthContext.tsx** 