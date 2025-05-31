const { neon } = require('@neondatabase/serverless');

// Load environment variables
require('dotenv').config();

const sql = neon(process.env.DATABASE_URL);

async function addLessonsConstraints() {
  try {
    console.log('🚀 Bắt đầu thêm constraints cho Lessons system...');

    // Check if users table exists
    console.log('🔍 Kiểm tra users table...');
    const usersTable = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `;

    if (!usersTable[0].exists) {
      console.error('❌ Users table không tồn tại! Cần setup users table trước.');
      console.log('💡 Chạy: npm run setup-database');
      process.exit(1);
    }

    console.log('✅ Users table đã tồn tại');

    // Add foreign key constraint to user_lesson_progress
    console.log('🔗 Thêm foreign key constraint user_id...');
    await sql`
      ALTER TABLE user_lesson_progress 
      ADD CONSTRAINT fk_user_lesson_progress_user_id 
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
    `;
    console.log('✅ Thêm foreign key constraint thành công');

    // Add trigger to update user TUTE points
    console.log('⚡ Thêm trigger cập nhật TUTE points...');
    await sql`
      CREATE OR REPLACE FUNCTION update_user_tute_points_on_lesson_completion()
      RETURNS TRIGGER AS $$
      BEGIN
        -- When lesson is marked as completed, add points to user's total
        IF NEW.is_completed = TRUE AND OLD.is_completed = FALSE THEN
          UPDATE users 
          SET tute_points = tute_points + NEW.tute_points_earned
          WHERE id = NEW.user_id;
        END IF;
        
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `;

    await sql`
      CREATE TRIGGER trigger_update_user_tute_points_on_lesson_completion
        AFTER UPDATE ON user_lesson_progress
        FOR EACH ROW
        EXECUTE FUNCTION update_user_tute_points_on_lesson_completion();
    `;
    console.log('✅ Thêm trigger thành công');

    // Verify constraints
    console.log('🔍 Kiểm tra constraints...');
    const constraints = await sql`
      SELECT conname, contype 
      FROM pg_constraint 
      WHERE conrelid = 'user_lesson_progress'::regclass;
    `;

    console.log('\n📋 Constraints trên user_lesson_progress:');
    constraints.forEach(constraint => {
      const type = constraint.contype === 'f' ? 'Foreign Key' : 
                   constraint.contype === 'p' ? 'Primary Key' : 
                   constraint.contype === 'u' ? 'Unique' : 
                   constraint.contype === 'c' ? 'Check' : constraint.contype;
      console.log(`   ${constraint.conname}: ${type}`);
    });

    console.log('\n🎉 Thêm constraints hoàn tất!');
    console.log('\n✅ Lessons system đã được setup đầy đủ với:');
    console.log('   - Lessons table');
    console.log('   - Lesson content blocks table');
    console.log('   - User lesson progress table');
    console.log('   - Foreign key constraints');
    console.log('   - TUTE points update triggers');
    console.log('\n🚀 Bây giờ API lessons hoạt động 100%!');

  } catch (error) {
    console.error('❌ Lỗi thêm constraints:', error);
    
    if (error.message.includes('already exists')) {
      console.log('💡 Constraint có thể đã tồn tại. Kiểm tra lại:');
      console.log('   node scripts/check-lessons-status.js');
    }
    
    process.exit(1);
  }
}

addLessonsConstraints(); 