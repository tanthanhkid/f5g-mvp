const { neon } = require('@neondatabase/serverless');

// Load environment variables
require('dotenv').config();

const sql = neon(process.env.DATABASE_URL);

async function checkLessonsStatus() {
  try {
    console.log('🔍 Kiểm tra trạng thái Lessons system...');

    // Check database connection
    await sql`SELECT 1`;
    console.log('✅ Kết nối database thành công');

    // Check tables existence
    console.log('\n📊 Kiểm tra tables:');
    const tables = ['lessons', 'lesson_content_blocks', 'user_lesson_progress', 'users'];
    
    for (const table of tables) {
      const exists = await sql`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = ${table}
        );
      `;
      
      const status = exists[0].exists ? '✅' : '❌';
      console.log(`   ${status} ${table}`);
    }

    // Check data counts
    console.log('\n📈 Thống kê dữ liệu:');
    
    try {
      const lessonCount = await sql`SELECT COUNT(*) as count FROM lessons`;
      console.log(`   📚 Lessons: ${lessonCount[0].count} bản ghi`);
    } catch (error) {
      console.log('   ❌ Không thể đọc lessons table');
    }

    try {
      const blockCount = await sql`SELECT COUNT(*) as count FROM lesson_content_blocks`;
      console.log(`   📝 Content Blocks: ${blockCount[0].count} bản ghi`);
    } catch (error) {
      console.log('   ❌ Không thể đọc lesson_content_blocks table');
    }

    try {
      const progressCount = await sql`SELECT COUNT(*) as count FROM user_lesson_progress`;
      console.log(`   📊 User Progress: ${progressCount[0].count} bản ghi`);
    } catch (error) {
      console.log('   ❌ Không thể đọc user_lesson_progress table');
    }

    // Check constraints
    console.log('\n🔗 Kiểm tra constraints:');
    
    try {
      const constraints = await sql`
        SELECT conname, contype 
        FROM pg_constraint 
        WHERE conrelid = 'user_lesson_progress'::regclass
        AND contype = 'f';
      `;
      
      if (constraints.length > 0) {
        constraints.forEach(constraint => {
          console.log(`   ✅ ${constraint.conname}`);
        });
      } else {
        console.log('   ⚠️  Không có foreign key constraints');
      }
    } catch (error) {
      console.log('   ❌ Không thể kiểm tra constraints');
    }

    // Check triggers
    console.log('\n⚡ Kiểm tra triggers:');
    
    try {
      const triggers = await sql`
        SELECT trigger_name, event_manipulation, action_timing
        FROM information_schema.triggers 
        WHERE event_object_table = 'user_lesson_progress'
        OR event_object_table = 'lessons';
      `;
      
      if (triggers.length > 0) {
        triggers.forEach(trigger => {
          console.log(`   ✅ ${trigger.trigger_name} (${trigger.action_timing} ${trigger.event_manipulation})`);
        });
      } else {
        console.log('   ⚠️  Không có triggers');
      }
    } catch (error) {
      console.log('   ❌ Không thể kiểm tra triggers');
    }

    // Sample lessons
    console.log('\n📚 Danh sách lessons:');
    
    try {
      const lessons = await sql`
        SELECT lesson_key, title, category, difficulty, estimated_time 
        FROM lessons 
        ORDER BY lesson_key
      `;
      
      if (lessons.length > 0) {
        lessons.forEach(lesson => {
          console.log(`   📖 ${lesson.lesson_key}: ${lesson.title}`);
          console.log(`      📂 ${lesson.category} | 🎯 ${lesson.difficulty} | ⏱️ ${lesson.estimated_time}min`);
        });
      } else {
        console.log('   ❌ Không có dữ liệu lessons');
      }
    } catch (error) {
      console.log('   ❌ Không thể đọc lessons');
    }

    console.log('\n🎯 Khuyến nghị:');
    
    // Recommendations
    const lessonTableExists = await sql`
      SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'lessons');
    `;
    
    const usersTableExists = await sql`
      SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users');
    `;
    
    if (!lessonTableExists[0].exists) {
      console.log('   1. Chạy: node scripts/setup-lessons-standalone.js');
    } else if (!usersTableExists[0].exists) {
      console.log('   1. Lessons system đã setup cơ bản ✅');
      console.log('   2. Để có full functionality, chạy: npm run setup-database');
      console.log('   3. Sau đó chạy: node scripts/add-lessons-constraints.js');
    } else {
      console.log('   ✅ Lessons system hoàn chỉnh!');
      console.log('   🚀 Có thể test API và frontend');
    }

  } catch (error) {
    console.error('❌ Lỗi kiểm tra status:', error);
  }
}

checkLessonsStatus(); 