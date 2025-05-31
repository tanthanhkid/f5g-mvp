const { neon } = require('@neondatabase/serverless');
const bcrypt = require('bcrypt');

// Load environment variables
require('dotenv').config();

const sql = neon(process.env.DATABASE_URL);

async function updateUserPasswords() {
  try {
    console.log('🔐 Cập nhật password cho demo users...');

    // Hash password "123456"
    const hashedPassword = await bcrypt.hash('123456', 10);
    console.log('✅ Password đã được hash');

    // Update all demo users with hashed password
    const result = await sql`
      UPDATE users 
      SET password = ${hashedPassword}
      WHERE email IN ('student1@hust.edu.vn', 'student1@bku.edu.vn', 'student1@vnu.edu.vn')
    `;

    console.log(`✅ Đã cập nhật password cho ${result.length || result.count || 3} users`);
    
    // Verify users
    const users = await sql`
      SELECT email, name, school_id, tute_points 
      FROM users 
      WHERE email IN ('student1@hust.edu.vn', 'student1@bku.edu.vn', 'student1@vnu.edu.vn')
      ORDER BY email
    `;

    console.log('\n👥 Demo users đã được cập nhật:');
    users.forEach(user => {
      console.log(`   📧 ${user.email} - ${user.name} (${user.school_id}) - ${user.tute_points} TUTE points`);
    });

    console.log('\n🎉 Cập nhật password thành công!');
    console.log('\n📝 Bây giờ bạn có thể login với:');
    console.log('   student1@hust.edu.vn / 123456');
    console.log('   student1@bku.edu.vn / 123456');
    console.log('   student1@vnu.edu.vn / 123456');

  } catch (error) {
    console.error('❌ Lỗi cập nhật passwords:', error);
    process.exit(1);
  }
}

updateUserPasswords(); 