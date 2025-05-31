const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const sql = neon(process.env.DATABASE_URL);

async function setupLessonsDebug() {
  try {
    console.log('🚀 Bắt đầu setup Lessons system (Debug mode)...');

    // Test connection
    console.log('📡 Kiểm tra kết nối database...');
    await sql`SELECT 1`;
    console.log('✅ Kết nối database thành công!');

    // 1. Create lessons table
    console.log('📊 Tạo lessons table...');
    await sql`
      CREATE TABLE IF NOT EXISTS lessons (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          lesson_key VARCHAR(50) UNIQUE NOT NULL,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          category VARCHAR(100),
          difficulty VARCHAR(20) CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
          estimated_time INTEGER,
          learning_objectives JSONB,
          tags JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ Lessons table created');

    // 2. Create content blocks table
    console.log('📝 Tạo lesson_content_blocks table...');
    await sql`
      CREATE TABLE IF NOT EXISTS lesson_content_blocks (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
          block_key VARCHAR(50) NOT NULL,
          block_type VARCHAR(20) NOT NULL CHECK (block_type IN ('text', 'video', 'quiz')),
          block_order INTEGER NOT NULL,
          title VARCHAR(255),
          content JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(lesson_id, block_order)
      )
    `;
    console.log('✅ Content blocks table created');

    // 3. Create progress table
    console.log('📊 Tạo user_lesson_progress table...');
    await sql`
      CREATE TABLE IF NOT EXISTS user_lesson_progress (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL,
          lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
          started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          completed_at TIMESTAMP WITH TIME ZONE,
          current_block_index INTEGER DEFAULT 0,
          completed_blocks JSONB DEFAULT '[]',
          quiz_answers JSONB DEFAULT '{}',
          video_watch_time JSONB DEFAULT '{}',
          tute_points_earned INTEGER DEFAULT 0,
          is_completed BOOLEAN DEFAULT FALSE,
          UNIQUE(user_id, lesson_id)
      )
    `;
    console.log('✅ User progress table created');

    // 4. Create indexes
    console.log('🔍 Tạo indexes...');
    await sql`CREATE INDEX IF NOT EXISTS idx_lessons_category ON lessons(category)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_lessons_difficulty ON lessons(difficulty)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_lesson_content_blocks_lesson_id ON lesson_content_blocks(lesson_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_lesson_content_blocks_order ON lesson_content_blocks(lesson_id, block_order)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_user_id ON user_lesson_progress(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_lesson_id ON user_lesson_progress(lesson_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_completed ON user_lesson_progress(is_completed)`;
    console.log('✅ Indexes created');

    // 5. Create update trigger
    console.log('⚡ Tạo update trigger...');
    await sql`
      CREATE OR REPLACE FUNCTION update_lessons_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql
    `;
    await sql`
      CREATE TRIGGER trigger_lessons_updated_at
          BEFORE UPDATE ON lessons
          FOR EACH ROW
          EXECUTE FUNCTION update_lessons_updated_at()
    `;
    console.log('✅ Trigger created');

    // 6. Insert sample lessons
    console.log('🌱 Insert lesson 1...');
    await sql`
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
      )
      ON CONFLICT (lesson_key) DO NOTHING
    `;

    console.log('🌱 Insert lesson 2...');
    await sql`
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
      )
      ON CONFLICT (lesson_key) DO NOTHING
    `;

    // 7. Get lesson IDs and insert content blocks
    console.log('📝 Insert content blocks...');
    const lesson1 = await sql`SELECT id FROM lessons WHERE lesson_key = 'lesson_1'`;
    const lesson2 = await sql`SELECT id FROM lessons WHERE lesson_key = 'lesson_2'`;

    if (lesson1.length > 0 && lesson2.length > 0) {
      const lesson1_id = lesson1[0].id;
      const lesson2_id = lesson2[0].id;

      // Insert content blocks for lesson 1 (simplified)
      await sql`
        INSERT INTO lesson_content_blocks (lesson_id, block_key, block_type, block_order, title, content) VALUES
        (${lesson1_id}, 'text_1_1', 'text', 1, 'Lập trình Web là gì?', '{"content": "<h2>Chào mừng bạn đến với khóa học Lập trình Web!</h2><p>Lập trình web là quá trình tạo ra các trang web và ứng dụng web.</p>"}'),
        (${lesson1_id}, 'video_1_1', 'video', 2, 'HTML Cơ bản trong 10 phút', '{"youtubeId": "UB1O30fR-EE", "description": "Video giới thiệu về HTML", "duration": 600}'),
        (${lesson1_id}, 'quiz_1_1', 'quiz', 3, 'Kiểm tra HTML', '{"quiz": {"id": "q1_1", "question": "HTML là viết tắt của gì?", "type": "single", "options": ["HyperText Markup Language", "High Tech Modern Language"], "correctAnswer": "[0]", "points": 10}}'),
        (${lesson2_id}, 'text_2_1', 'text', 1, 'React.js là gì?', '{"content": "<h2>Giới thiệu về React.js</h2><p>React.js là một thư viện JavaScript để xây dựng UI.</p>"}'),
        (${lesson2_id}, 'video_2_1', 'video', 2, 'React trong 100 giây', '{"youtubeId": "Tn6-PIqc4UM", "description": "Tổng quan về React", "duration": 100}')
        ON CONFLICT (lesson_id, block_order) DO NOTHING
      `;
      console.log('✅ Content blocks inserted');
    }

    // 8. Verify data
    console.log('🔍 Kiểm tra dữ liệu...');
    const lessonCount = await sql`SELECT COUNT(*) as count FROM lessons`;
    const blockCount = await sql`SELECT COUNT(*) as count FROM lesson_content_blocks`;
    
    console.log('\n📈 Thống kê dữ liệu lessons:');
    console.log(`   Lessons: ${lessonCount[0].count} bản ghi`);
    console.log(`   Content Blocks: ${blockCount[0].count} bản ghi`);

    // Show sample lessons
    console.log('\n📚 Danh sách lessons:');
    const lessons = await sql`
      SELECT lesson_key, title, category, difficulty, estimated_time 
      FROM lessons 
      ORDER BY lesson_key
    `;
    
    lessons.forEach(lesson => {
      console.log(`   ${lesson.lesson_key}: ${lesson.title} (${lesson.category}, ${lesson.difficulty}, ${lesson.estimated_time}min)`);
    });

    console.log('\n🎉 Setup Lessons system hoàn tất!');
    console.log('\n🚀 Bây giờ bạn có thể test API lessons!');

  } catch (error) {
    console.error('❌ Lỗi setup lessons:', error);
    process.exit(1);
  }
}

setupLessonsDebug(); 