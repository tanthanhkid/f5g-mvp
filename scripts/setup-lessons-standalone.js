const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const sql = neon(process.env.DATABASE_URL);

async function setupLessonsStandalone() {
  try {
    console.log('🚀 Bắt đầu setup Lessons system (Standalone)...');

    // Test connection
    console.log('📡 Kiểm tra kết nối database...');
    await sql`SELECT 1`;
    console.log('✅ Kết nối database thành công!');

    // Create lessons standalone schema
    console.log('📊 Tạo schema lessons (standalone)...');
    const schemaSQL = fs.readFileSync(path.join(__dirname, 'lessons-schema-standalone.sql'), 'utf8');
    
    const statements = schemaSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt && !stmt.startsWith('--'));

    for (const statement of statements) {
      if (statement.trim()) {
        await sql.unsafe(statement);
      }
    }
    console.log('✅ Tạo schema lessons thành công!');

    // Insert seed data
    console.log('🌱 Insert dữ liệu lessons mẫu...');
    const seedSQL = fs.readFileSync(path.join(__dirname, 'seed-lessons.sql'), 'utf8');
    
    const seedStatements = seedSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt && !stmt.startsWith('--'));

    for (const statement of seedStatements) {
      if (statement.trim()) {
        await sql.unsafe(statement);
      }
    }
    console.log('✅ Insert dữ liệu lessons thành công!');

    // Verify data
    console.log('🔍 Kiểm tra dữ liệu lessons...');
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
    console.log('\n📋 Ghi chú quan trọng:');
    console.log('   ⚠️  user_lesson_progress table chưa có foreign key constraint đến users');
    console.log('   ⚠️  Cần setup users table và chạy migration để thêm constraints');
    console.log('\n🚀 Bây giờ bạn có thể test API lessons!');

  } catch (error) {
    console.error('❌ Lỗi setup lessons:', error);
    process.exit(1);
  }
}

setupLessonsStandalone(); 