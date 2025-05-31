const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const sql = neon(process.env.DATABASE_URL);

async function setupLessons() {
  try {
    console.log('🚀 Bắt đầu setup Lessons system...');

    // Test connection
    console.log('📡 Kiểm tra kết nối database...');
    await sql`SELECT 1`;
    console.log('✅ Kết nối database thành công!');

    // Create lessons schema
    console.log('📊 Tạo schema lessons...');
    const schemaSQL = fs.readFileSync(path.join(__dirname, 'lessons-schema.sql'), 'utf8');
    
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

    console.log('\n🎉 Setup Lessons system hoàn tất!');
    console.log('\n🚀 Bây giờ bạn có thể test API lessons!');

  } catch (error) {
    console.error('❌ Lỗi setup lessons:', error);
    process.exit(1);
  }
}

setupLessons(); 