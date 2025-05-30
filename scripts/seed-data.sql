-- Seed data for Freedom Training Database
-- Insert sample data from JSON files

-- 1. Insert quiz categories first
INSERT INTO quiz_categories (id, name, description, icon, color) VALUES
('cong-nghe', 'Công nghệ', 'Câu hỏi về công nghệ thông tin và lập trình', 'monitor', '#3b82f6'),
('lap-trinh', 'Lập trình', 'Câu hỏi về ngôn ngữ lập trình và framework', 'code', '#8b5cf6'),
('dia-ly', 'Địa lý', 'Câu hỏi về địa lý thế giới và Việt Nam', 'map', '#10b981'),
('lich-su', 'Lịch sử', 'Câu hỏi về lịch sử Việt Nam và thế giới', 'book', '#f59e0b'),
('kinh-te', 'Kinh tế', 'Câu hỏi về kinh tế học và tài chính', 'trending-up', '#ef4444'),
('van-hoc', 'Văn học', 'Câu hỏi về văn học Việt Nam và thế giới', 'pen-tool', '#ec4899'),
('co-so-du-lieu', 'Cơ sở dữ liệu', 'Câu hỏi về database và SQL', 'database', '#6366f1')
ON CONFLICT (id) DO NOTHING;

-- 2. Insert schools data
INSERT INTO schools (id, name, short_name, logo, total_tute_points) VALUES
('hust', 'Đại học Bách khoa Hà Nội', 'HUST', '/images/hust-logo.png', 177),
('bku', 'Đại học Bách khoa TP.HCM', 'BKU', '/images/bku-logo.png', 173),
('vnu', 'Đại học Quốc gia Hà Nội', 'VNU', '/images/vnu-logo.png', 156),
('hcmus', 'Đại học Khoa học Tự nhiên TP.HCM', 'HCMUS', '/images/hcmus-logo.png', 134),
('neu', 'Đại học Kinh tế Quốc dân', 'NEU', '/images/neu-logo.png', 98)
ON CONFLICT (id) DO NOTHING;

-- 3. Insert users data (using fixed UUIDs for consistency)
INSERT INTO users (id, email, password, name, school_id, tute_points) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'student1@hust.edu.vn', '123456', 'Nguyễn Văn An', 'hust', 85),
('550e8400-e29b-41d4-a716-446655440002', 'student2@hust.edu.vn', '123456', 'Trần Thị Bình', 'hust', 92),
('550e8400-e29b-41d4-a716-446655440003', 'student1@bku.edu.vn', '123456', 'Lê Văn Cường', 'bku', 78),
('550e8400-e29b-41d4-a716-446655440004', 'student2@bku.edu.vn', '123456', 'Phạm Thị Dung', 'bku', 95),
('550e8400-e29b-41d4-a716-446655440005', 'student1@vnu.edu.vn', '123456', 'Hoàng Văn Em', 'vnu', 67),
('550e8400-e29b-41d4-a716-446655440006', 'student2@vnu.edu.vn', '123456', 'Đỗ Thị Phương', 'vnu', 89)
ON CONFLICT (id) DO NOTHING;

-- 4. Insert quiz data
INSERT INTO quizzes (id, question, type, options, correct_answer, category_id, difficulty, points) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'Ai là người sáng lập ra Facebook?', 'single', 
 '["Mark Zuckerberg", "Bill Gates", "Steve Jobs", "Elon Musk"]'::jsonb, 
 '[0]'::jsonb, 'cong-nghe', 'easy', 1),

('650e8400-e29b-41d4-a716-446655440002', 'Ngôn ngữ lập trình nào được sử dụng để phát triển web frontend?', 'multiple',
 '["JavaScript", "Python", "HTML", "CSS", "Java"]'::jsonb,
 '[0, 2, 3]'::jsonb, 'lap-trinh', 'medium', 2),

('650e8400-e29b-41d4-a716-446655440003', 'Thủ đô của Việt Nam là gì?', 'single',
 '["Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Cần Thơ"]'::jsonb,
 '[1]'::jsonb, 'dia-ly', 'easy', 1),

('650e8400-e29b-41d4-a716-446655440004', 'Những ngôn ngữ nào thuộc họ ngôn ngữ C?', 'multiple',
 '["C++", "C#", "Python", "Objective-C", "JavaScript"]'::jsonb,
 '[0, 1, 3]'::jsonb, 'lap-trinh', 'medium', 2),

('650e8400-e29b-41d4-a716-446655440005', 'Năm nào Việt Nam gia nhập ASEAN?', 'single',
 '["1995", "1997", "1999", "2001"]'::jsonb,
 '[0]'::jsonb, 'lich-su', 'medium', 1),

('650e8400-e29b-41d4-a716-446655440006', 'Các framework JavaScript phổ biến cho frontend bao gồm:', 'multiple',
 '["React", "Vue.js", "Angular", "Django", "Laravel"]'::jsonb,
 '[0, 1, 2]'::jsonb, 'lap-trinh', 'medium', 2),

('650e8400-e29b-41d4-a716-446655440007', 'Đơn vị tiền tệ của Nhật Bản là gì?', 'single',
 '["Won", "Yuan", "Yen", "Rupiah"]'::jsonb,
 '[2]'::jsonb, 'kinh-te', 'easy', 1),

('650e8400-e29b-41d4-a716-446655440008', 'Những hệ điều hành nào là mã nguồn mở?', 'multiple',
 '["Linux", "Windows", "macOS", "Ubuntu", "FreeBSD"]'::jsonb,
 '[0, 3, 4]'::jsonb, 'cong-nghe', 'medium', 2),

('650e8400-e29b-41d4-a716-446655440009', 'Ai là tác giả của tiểu thuyết "Số đỏ"?', 'single',
 '["Nguyễn Du", "Vũ Trọng Phụng", "Nam Cao", "Ngô Tất Tố"]'::jsonb,
 '[1]'::jsonb, 'van-hoc', 'medium', 1),

('650e8400-e29b-41d4-a716-446655440010', 'Các loại database phổ biến bao gồm:', 'multiple',
 '["MySQL", "PostgreSQL", "MongoDB", "Photoshop", "Redis"]'::jsonb,
 '[0, 1, 2, 4]'::jsonb, 'co-so-du-lieu', 'medium', 2)
ON CONFLICT (id) DO NOTHING;

-- 5. Insert sample lesson
INSERT INTO lessons (id, title, description, category, difficulty, estimated_time, learning_objectives, tags, content_blocks) VALUES
('750e8400-e29b-41d4-a716-446655440001', 
'Giới thiệu về Lập trình Web', 
'Bài học cơ bản về lập trình web, bao gồm HTML, CSS và JavaScript',
'Lập trình',
'beginner',
45,
'["Hiểu được cấu trúc cơ bản của một trang web", "Nắm vững các thẻ HTML cơ bản", "Biết cách tạo style với CSS", "Hiểu cơ bản về JavaScript"]'::jsonb,
'["html", "css", "javascript", "web"]'::jsonb,
'[
  {
    "type": "text",
    "id": "text_1_1",
    "title": "Lập trình Web là gì?",
    "content": "<h2>Chào mừng bạn đến với khóa học Lập trình Web!</h2><p>Lập trình web là quá trình tạo ra các trang web và ứng dụng web. Nó bao gồm nhiều công nghệ khác nhau:</p><ul><li><strong>HTML</strong> - Ngôn ngữ đánh dấu siêu văn bản, tạo cấu trúc cho trang web</li><li><strong>CSS</strong> - Cascading Style Sheets, tạo kiểu dáng và bố cục</li><li><strong>JavaScript</strong> - Ngôn ngữ lập trình tạo tính tương tác</li></ul><p>Trong bài học này, chúng ta sẽ tìm hiểu từng công nghệ một cách chi tiết.</p>"
  },
  {
    "type": "video",
    "id": "video_1_1",
    "youtubeId": "UB1O30fR-EE",
    "title": "HTML Cơ bản trong 10 phút",
    "description": "Video giới thiệu về HTML và các thẻ cơ bản",
    "duration": 600
  }
]'::jsonb),

('750e8400-e29b-41d4-a716-446655440002',
'React.js Cơ bản',
'Học cách xây dựng ứng dụng web với React.js', 
'Lập trình',
'intermediate',
60,
'["Hiểu về React và Virtual DOM", "Tạo components trong React", "Sử dụng props và state", "Xử lý events trong React"]'::jsonb,
'["react", "javascript", "frontend", "components"]'::jsonb,
'[
  {
    "type": "text",
    "id": "text_2_1", 
    "title": "React.js là gì?",
    "content": "<h2>Giới thiệu về React.js</h2><p>React.js là một thư viện JavaScript được phát triển bởi Facebook để xây dựng giao diện người dùng (UI).</p><h3>Đặc điểm chính của React:</h3><ul><li><strong>Component-based</strong> - Xây dựng UI từ các component độc lập</li><li><strong>Virtual DOM</strong> - Cải thiện hiệu suất render</li><li><strong>Declarative</strong> - Mô tả UI theo state</li><li><strong>Learn Once, Write Anywhere</strong> - Có thể dùng cho web, mobile</li></ul><p>React giúp tạo ra các ứng dụng web động và tương tác cao.</p>"
  }
]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 6. Insert sample quiz attempts (some historical data)
INSERT INTO user_quiz_attempts (user_id, quiz_id, user_answer, is_correct, points_earned, time_taken) VALUES
('550e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', '[0]'::jsonb, true, 1, 15),
('550e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440003', '[1]'::jsonb, true, 1, 12),
('550e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440002', '[0, 2, 3]'::jsonb, true, 2, 25),
('550e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440004', '[0, 1]'::jsonb, false, 0, 30),
('550e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440006', '[0, 1, 2]'::jsonb, true, 2, 20);

-- 7. Insert sample lesson progress
INSERT INTO user_lesson_progress (user_id, lesson_id, progress_percentage, completed_blocks, is_completed) VALUES
('550e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', 100, '["text_1_1", "video_1_1"]'::jsonb, true),
('550e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440001', 50, '["text_1_1"]'::jsonb, false),
('550e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440002', 25, '["text_2_1"]'::jsonb, false);

-- 8. Insert sample achievements
INSERT INTO user_achievements (user_id, achievement_type, achievement_name, description, points_awarded) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'quiz_streak', 'Chiến binh kiến thức', 'Trả lời đúng 5 câu hỏi liên tiếp', 10),
('550e8400-e29b-41d4-a716-446655440002', 'lesson_complete', 'Học sinh chăm chỉ', 'Hoàn thành bài học đầu tiên', 5),
('550e8400-e29b-41d4-a716-446655440004', 'high_score', 'Thạc sĩ Quiz', 'Đạt điểm cao trong quiz', 15);

-- Update school total points based on user points
UPDATE schools SET total_tute_points = (
    SELECT COALESCE(SUM(tute_points), 0) 
    FROM users 
    WHERE users.school_id = schools.id
);

-- Verify data insertion
SELECT 'Schools' as table_name, COUNT(*) as record_count FROM schools
UNION ALL
SELECT 'Users', COUNT(*) FROM users  
UNION ALL
SELECT 'Quiz Categories', COUNT(*) FROM quiz_categories
UNION ALL
SELECT 'Quizzes', COUNT(*) FROM quizzes
UNION ALL
SELECT 'Lessons', COUNT(*) FROM lessons
UNION ALL
SELECT 'Quiz Attempts', COUNT(*) FROM user_quiz_attempts
UNION ALL
SELECT 'Lesson Progress', COUNT(*) FROM user_lesson_progress
UNION ALL
SELECT 'Achievements', COUNT(*) FROM user_achievements; 