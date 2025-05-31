-- ========================================
-- SEED LESSONS DATA FOR FREEDOM TRAINING
-- ========================================

-- Insert Lesson 1: Giới thiệu về Lập trình Web
INSERT INTO lessons (lesson_key, title, description, category, difficulty, estimated_time, learning_objectives, tags)
VALUES (
    'lesson_1',
    'Giới thiệu về Lập trình Web',
    'Bài học cơ bản về lập trình web, bao gồm HTML, CSS và JavaScript',
    'Lập trình',
    'beginner',
    45,
    '["Hiểu được cấu trúc cơ bản của một trang web", "Nắm vững các thẻ HTML cơ bản", "Biết cách tạo style với CSS", "Hiểu cơ bản về JavaScript"]',
    '["html", "css", "javascript", "web"]'
);

-- Insert Lesson 2: React.js Cơ bản
INSERT INTO lessons (lesson_key, title, description, category, difficulty, estimated_time, learning_objectives, tags)
VALUES (
    'lesson_2',
    'React.js Cơ bản',
    'Học cách xây dựng ứng dụng web với React.js',
    'Lập trình',
    'intermediate',
    60,
    '["Hiểu về React và Virtual DOM", "Tạo components trong React", "Sử dụng props và state", "Xử lý events trong React"]',
    '["react", "javascript", "frontend", "components"]'
);

-- Get lesson IDs for content blocks
DO $$
DECLARE
    lesson1_id UUID;
    lesson2_id UUID;
BEGIN
    -- Get lesson IDs
    SELECT id INTO lesson1_id FROM lessons WHERE lesson_key = 'lesson_1';
    SELECT id INTO lesson2_id FROM lessons WHERE lesson_key = 'lesson_2';

    -- Insert content blocks for Lesson 1
    INSERT INTO lesson_content_blocks (lesson_id, block_key, block_type, block_order, title, content) VALUES
    
    -- Block 1: Text
    (lesson1_id, 'text_1_1', 'text', 1, 'Lập trình Web là gì?', jsonb_build_object(
        'content', '<h2>Chào mừng bạn đến với khóa học Lập trình Web!</h2><p>Lập trình web là quá trình tạo ra các trang web và ứng dụng web. Nó bao gồm nhiều công nghệ khác nhau:</p><ul><li><strong>HTML</strong> - Ngôn ngữ đánh dấu siêu văn bản, tạo cấu trúc cho trang web</li><li><strong>CSS</strong> - Cascading Style Sheets, tạo kiểu dáng và bố cục</li><li><strong>JavaScript</strong> - Ngôn ngữ lập trình tạo tính tương tác</li></ul><p>Trong bài học này, chúng ta sẽ tìm hiểu từng công nghệ một cách chi tiết.</p>'
    )),
    
    -- Block 2: Video
    (lesson1_id, 'video_1_1', 'video', 2, 'HTML Cơ bản trong 10 phút', jsonb_build_object(
        'youtubeId', 'UB1O30fR-EE',
        'description', 'Video giới thiệu về HTML và các thẻ cơ bản',
        'duration', 600
    )),
    
    -- Block 3: Quiz
    (lesson1_id, 'quiz_1_1', 'quiz', 3, 'Kiểm tra HTML', jsonb_build_object(
        'quiz', jsonb_build_object(
            'id', 'q1_1',
            'question', 'HTML là viết tắt của gì?',
            'type', 'single',
            'options', '["HyperText Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlink and Text Markup Language"]',
            'correctAnswer', '[0]',
            'category', 'HTML',
            'explanation', 'HTML là viết tắt của HyperText Markup Language - ngôn ngữ đánh dấu siêu văn bản.',
            'difficulty', 'easy',
            'points', 10
        )
    )),
    
    -- Block 4: Text
    (lesson1_id, 'text_1_2', 'text', 4, 'Cấu trúc cơ bản của HTML', jsonb_build_object(
        'content', '<h3>Cấu trúc HTML cơ bản</h3><p>Mọi trang HTML đều có cấu trúc cơ bản như sau:</p><pre><code>&lt;!DOCTYPE html&gt;\n&lt;html&gt;\n&lt;head&gt;\n    &lt;title&gt;Tiêu đề trang&lt;/title&gt;\n&lt;/head&gt;\n&lt;body&gt;\n    &lt;h1&gt;Tiêu đề chính&lt;/h1&gt;\n    &lt;p&gt;Đoạn văn bản&lt;/p&gt;\n&lt;/body&gt;\n&lt;/html&gt;</code></pre><p><strong>Giải thích:</strong></p><ul><li><code>&lt;!DOCTYPE html&gt;</code> - Khai báo loại tài liệu</li><li><code>&lt;html&gt;</code> - Thẻ gốc của trang</li><li><code>&lt;head&gt;</code> - Chứa thông tin meta</li><li><code>&lt;body&gt;</code> - Chứa nội dung hiển thị</li></ul>'
    )),
    
    -- Block 5: Quiz
    (lesson1_id, 'quiz_1_2', 'quiz', 5, 'Kiểm tra thẻ HTML', jsonb_build_object(
        'quiz', jsonb_build_object(
            'id', 'q1_2',
            'question', 'Những thẻ nào thuộc về phần head của HTML?',
            'type', 'multiple',
            'options', '["<title>", "<meta>", "<h1>", "<link>", "<p>"]',
            'correctAnswer', '[0, 1, 3]',
            'category', 'HTML',
            'explanation', 'Các thẻ <title>, <meta>, và <link> thường được đặt trong phần <head> của HTML.',
            'difficulty', 'medium',
            'points', 15
        )
    )),
    
    -- Block 6: Video
    (lesson1_id, 'video_1_2', 'video', 6, 'CSS Cơ bản - Tạo kiểu cho trang web', jsonb_build_object(
        'youtubeId', '1PnVor36_40',
        'description', 'Học cách sử dụng CSS để tạo kiểu cho HTML',
        'duration', 720
    )),
    
    -- Block 7: Text
    (lesson1_id, 'text_1_3', 'text', 7, 'CSS - Cascading Style Sheets', jsonb_build_object(
        'content', '<h3>CSS là gì?</h3><p>CSS (Cascading Style Sheets) là ngôn ngữ được sử dụng để mô tả cách hiển thị của các phần tử HTML.</p><h4>Cách viết CSS:</h4><pre><code>selector {\n    property: value;\n    property: value;\n}</code></pre><h4>Ví dụ:</h4><pre><code>h1 {\n    color: blue;\n    font-size: 24px;\n    text-align: center;\n}</code></pre><p>CSS có thể được viết theo 3 cách:</p><ol><li><strong>Inline CSS</strong> - Viết trực tiếp trong thẻ HTML</li><li><strong>Internal CSS</strong> - Viết trong thẻ &lt;style&gt;</li><li><strong>External CSS</strong> - Viết trong file .css riêng</li></ol>'
    )),
    
    -- Block 8: Quiz
    (lesson1_id, 'quiz_1_3', 'quiz', 8, 'Kiểm tra CSS', jsonb_build_object(
        'quiz', jsonb_build_object(
            'id', 'q1_3',
            'question', 'Cách nào là tốt nhất để viết CSS cho một website lớn?',
            'type', 'single',
            'options', '["Inline CSS", "Internal CSS", "External CSS", "Không sử dụng CSS"]',
            'correctAnswer', '[2]',
            'category', 'CSS',
            'explanation', 'External CSS là cách tốt nhất vì dễ quản lý, tái sử dụng và tách biệt nội dung khỏi thiết kế.',
            'difficulty', 'medium',
            'points', 10
        )
    )),
    
    -- Block 9: Video
    (lesson1_id, 'video_1_3', 'video', 9, 'JavaScript Cơ bản cho người mới bắt đầu', jsonb_build_object(
        'youtubeId', 'W6NZfCO5SIk',
        'description', 'Giới thiệu về JavaScript và cách sử dụng cơ bản',
        'duration', 900
    )),
    
    -- Block 10: Quiz
    (lesson1_id, 'quiz_1_4', 'quiz', 10, 'Kiểm tra JavaScript', jsonb_build_object(
        'quiz', jsonb_build_object(
            'id', 'q1_4',
            'question', 'JavaScript được sử dụng để làm gì trong lập trình web?',
            'type', 'text',
            'correctAnswer', 'tạo tính tương tác',
            'category', 'JavaScript',
            'explanation', 'JavaScript chủ yếu được sử dụng để tạo tính tương tác cho trang web, xử lý sự kiện, và thao tác với DOM.',
            'difficulty', 'easy',
            'points', 10
        )
    ));

    -- Insert content blocks for Lesson 2
    INSERT INTO lesson_content_blocks (lesson_id, block_key, block_type, block_order, title, content) VALUES
    
    -- Block 1: Text
    (lesson2_id, 'text_2_1', 'text', 1, 'React.js là gì?', jsonb_build_object(
        'content', '<h2>Giới thiệu về React.js</h2><p>React.js là một thư viện JavaScript được phát triển bởi Facebook để xây dựng giao diện người dùng (UI).</p><h3>Đặc điểm chính của React:</h3><ul><li><strong>Component-based</strong> - Xây dựng UI từ các component độc lập</li><li><strong>Virtual DOM</strong> - Cải thiện hiệu suất render</li><li><strong>Declarative</strong> - Mô tả UI theo state</li><li><strong>Learn Once, Write Anywhere</strong> - Có thể dùng cho web, mobile</li></ul><p>React giúp tạo ra các ứng dụng web động và tương tác cao.</p>'
    )),
    
    -- Block 2: Video
    (lesson2_id, 'video_2_1', 'video', 2, 'React trong 100 giây', jsonb_build_object(
        'youtubeId', 'Tn6-PIqc4UM',
        'description', 'Tổng quan nhanh về React.js',
        'duration', 100
    )),
    
    -- Block 3: Quiz
    (lesson2_id, 'quiz_2_1', 'quiz', 3, 'Kiểm tra React Virtual DOM', jsonb_build_object(
        'quiz', jsonb_build_object(
            'id', 'q2_1',
            'question', 'Virtual DOM trong React có tác dụng gì?',
            'type', 'single',
            'options', '["Tăng tốc độ render", "Giảm dung lượng file", "Tăng bảo mật", "Giảm lỗi code"]',
            'correctAnswer', '[0]',
            'category', 'React',
            'explanation', 'Virtual DOM giúp React tối ưu hóa việc cập nhật DOM thật, từ đó tăng tốc độ render.',
            'difficulty', 'medium',
            'points', 15
        )
    )),
    
    -- Block 4: Text
    (lesson2_id, 'text_2_2', 'text', 4, 'Components trong React', jsonb_build_object(
        'content', '<h3>React Components</h3><p>Component là khối xây dựng cơ bản của React. Có 2 loại component chính:</p><h4>1. Function Components:</h4><pre><code>function Welcome(props) {\n  return &lt;h1&gt;Hello, {props.name}!&lt;/h1&gt;;\n}</code></pre><h4>2. Class Components:</h4><pre><code>class Welcome extends React.Component {\n  render() {\n    return &lt;h1&gt;Hello, {this.props.name}!&lt;/h1&gt;;\n  }\n}</code></pre><p><strong>Lưu ý:</strong> Function components được khuyến khích sử dụng với React Hooks.</p>'
    )),
    
    -- Block 5: Quiz
    (lesson2_id, 'quiz_2_2', 'quiz', 5, 'Kiểm tra React Components', jsonb_build_object(
        'quiz', jsonb_build_object(
            'id', 'q2_2',
            'question', 'Loại component nào được khuyến khích sử dụng trong React hiện tại?',
            'type', 'single',
            'options', '["Class Components", "Function Components", "Arrow Function Components", "Tất cả đều như nhau"]',
            'correctAnswer', '[1]',
            'category', 'React',
            'explanation', 'Function Components được khuyến khích vì chúng đơn giản hơn và có thể sử dụng với React Hooks.',
            'difficulty', 'easy',
            'points', 10
        )
    ));

END $$; 