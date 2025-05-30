const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const sql = neon(process.env.DATABASE_URL);

async function setupDatabase() {
  try {
    console.log('🚀 Bắt đầu thiết lập database...');

    // Test connection
    console.log('📡 Kiểm tra kết nối database...');
    await sql`SELECT 1`;
    console.log('✅ Kết nối database thành công!');

    // Read and execute schema script
    console.log('📊 Tạo bảng và cấu trúc database...');
    const schemaSQL = fs.readFileSync(path.join(__dirname, 'setup-database.sql'), 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = schemaSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt && !stmt.startsWith('--'));

    for (const statement of statements) {
      if (statement.trim()) {
        await sql.unsafe(statement);
      }
    }
    console.log('✅ Tạo cấu trúc database thành công!');

    // Read and execute seed data script
    console.log('🌱 Insert dữ liệu mẫu...');
    const seedSQL = fs.readFileSync(path.join(__dirname, 'seed-data.sql'), 'utf8');
    
    const seedStatements = seedSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt && !stmt.startsWith('--'));

    for (const statement of seedStatements) {
      if (statement.trim()) {
        await sql.unsafe(statement);
      }
    }
    console.log('✅ Insert dữ liệu mẫu thành công!');

    // Verify data
    console.log('🔍 Kiểm tra dữ liệu...');
    const counts = await sql`
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
      SELECT 'Achievements', COUNT(*) FROM user_achievements
    `;

    console.log('\n📈 Thống kê dữ liệu:');
    counts.forEach(row => {
      console.log(`   ${row.table_name}: ${row.record_count} bản ghi`);
    });

    console.log('\n🎉 Setup database hoàn tất!');
    console.log('\n📝 Các tài khoản demo:');
    console.log('   student1@hust.edu.vn / 123456 (HUST)');
    console.log('   student1@bku.edu.vn / 123456 (BKU)');
    console.log('   student1@vnu.edu.vn / 123456 (VNU)');
    console.log('\n🚀 Bây giờ bạn có thể chạy: npm run dev');

  } catch (error) {
    console.error('❌ Lỗi setup database:', error);
    process.exit(1);
  }
}

// Health check function
async function healthCheck() {
  try {
    await sql`SELECT 1`;
    console.log('✅ Database đang hoạt động tốt!');
    
    const userCount = await sql`SELECT COUNT(*) as count FROM users`;
    const quizCount = await sql`SELECT COUNT(*) as count FROM quizzes`;
    
    console.log(`👥 Tổng users: ${userCount[0].count}`);
    console.log(`❓ Tổng quizzes: ${quizCount[0].count}`);
    
  } catch (error) {
    console.error('❌ Database không kết nối được:', error);
  }
}

// Parse command line arguments
const command = process.argv[2];

if (command === 'setup') {
  setupDatabase();
} else if (command === 'check') {
  healthCheck();
} else {
  console.log('📖 Cách sử dụng:');
  console.log('   node scripts/setup-database.js setup   # Setup database');
  console.log('   node scripts/setup-database.js check   # Health check');
} 