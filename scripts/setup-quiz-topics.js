const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const sql = neon(process.env.DATABASE_URL);

async function setupQuizTopics() {
  try {
    console.log('🚀 Bắt đầu setup Quiz Topics system...');

    // Test connection
    console.log('📡 Kiểm tra kết nối database...');
    await sql`SELECT 1`;
    console.log('✅ Kết nối database thành công!');

    // 1. Create quiz_topics table
    console.log('❓ Tạo quiz_topics table...');
    await sql`
      CREATE TABLE IF NOT EXISTS quiz_topics (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          topic_key VARCHAR(100) UNIQUE NOT NULL,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          icon VARCHAR(50),
          difficulty VARCHAR(20) CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
          estimated_time INTEGER,
          category VARCHAR(100),
          age_group VARCHAR(100),
          keywords JSONB DEFAULT '[]',
          learning_content JSONB DEFAULT '[]',
          quiz_questions JSONB DEFAULT '[]',
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ Quiz topics table created');

    // 2. Create indexes
    console.log('🔍 Tạo indexes...');
    await sql`CREATE INDEX IF NOT EXISTS idx_quiz_topics_category ON quiz_topics(category)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_quiz_topics_difficulty ON quiz_topics(difficulty)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_quiz_topics_age_group ON quiz_topics(age_group)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_quiz_topics_active ON quiz_topics(is_active)`;
    console.log('✅ Indexes created');

    // 3. Load and insert data from JSON
    console.log('📖 Đọc dữ liệu từ quiz-topics.json...');
    const jsonPath = path.join(__dirname, '../data/quiz-topics.json');
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

    console.log(`📝 Tìm thấy ${jsonData.length} quiz topics`);

    // 4. Insert topics one by one
    for (const topic of jsonData) {
      try {
        await sql`
          INSERT INTO quiz_topics (
            topic_key,
            title,
            description,
            icon,
            difficulty,
            estimated_time,
            category,
            age_group,
            keywords,
            learning_content,
            quiz_questions
          ) VALUES (
            ${topic.id},
            ${topic.title},
            ${topic.description},
            ${topic.icon},
            ${topic.difficulty},
            ${topic.estimatedTime},
            ${topic.category},
            ${topic.ageGroup},
            ${JSON.stringify(topic.keywords || [])},
            ${JSON.stringify(topic.learningContent || [])},
            ${JSON.stringify(topic.quizQuestions || [])}
          )
          ON CONFLICT (topic_key) DO UPDATE SET
            title = EXCLUDED.title,
            description = EXCLUDED.description,
            icon = EXCLUDED.icon,
            difficulty = EXCLUDED.difficulty,
            estimated_time = EXCLUDED.estimated_time,
            category = EXCLUDED.category,
            age_group = EXCLUDED.age_group,
            keywords = EXCLUDED.keywords,
            learning_content = EXCLUDED.learning_content,
            quiz_questions = EXCLUDED.quiz_questions,
            updated_at = CURRENT_TIMESTAMP
        `;
        console.log(`  ✅ Inserted/Updated: ${topic.title}`);
      } catch (error) {
        console.error(`  ❌ Error inserting ${topic.title}:`, error.message);
      }
    }

    // 5. Verify data
    console.log('🔍 Kiểm tra dữ liệu...');
    const topicCount = await sql`SELECT COUNT(*) as count FROM quiz_topics`;
    const categories = await sql`
      SELECT category, COUNT(*) as count 
      FROM quiz_topics 
      WHERE is_active = true 
      GROUP BY category 
      ORDER BY count DESC
    `;
    
    console.log('\n📈 Thống kê quiz topics:');
    console.log(`   📝 Total Topics: ${topicCount[0].count} bản ghi`);
    
    console.log('\n📊 Topics theo category:');
    categories.forEach(cat => {
      console.log(`   ${cat.category}: ${cat.count} topics`);
    });

    // Show sample topics
    console.log('\n📚 Sample topics:');
    const sampleTopics = await sql`
      SELECT topic_key, title, category, difficulty, estimated_time 
      FROM quiz_topics 
      WHERE is_active = true 
      ORDER BY created_at DESC 
      LIMIT 5
    `;
    
    sampleTopics.forEach(topic => {
      console.log(`   📖 ${topic.topic_key}: ${topic.title} (${topic.category}, ${topic.difficulty}, ${topic.estimated_time}min)`);
    });

    console.log('\n🎉 Setup Quiz Topics system hoàn tất!');
    console.log('\n🚀 Bây giờ bạn có thể test API quiz-topics!');

  } catch (error) {
    console.error('❌ Lỗi setup quiz topics:', error);
    process.exit(1);
  }
}

setupQuizTopics(); 