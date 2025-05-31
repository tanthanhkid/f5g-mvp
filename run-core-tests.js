#!/usr/bin/env node

/**
 * Script chạy các Core Tests đã hoàn thành
 * Bỏ qua UI tests để tránh các warnings không cần thiết
 */

const { execSync } = require('child_process');
const chalk = require('chalk');

console.log(chalk.blue.bold('\n🧪 CHẠY CORE TESTS - FREEDOM TRAINING PLATFORM\n'));

const tests = [
  {
    name: 'Database Connectivity Tests',
    command: 'npx jest __tests__/database-connectivity.test.ts',
    emoji: '🗄️'
  },
  {
    name: 'API Routes Tests', 
    command: 'npx jest __tests__/api-routes.test.ts',
    emoji: '🌐'
  },
  {
    name: 'Integration Flow Tests',
    command: 'npx jest __tests__/integration-flow.test.ts', 
    emoji: '🔄'
  }
];

let totalPassed = 0;
let totalFailed = 0;

console.log(chalk.cyan('📋 Danh sách tests sẽ chạy:'));
tests.forEach((test, index) => {
  console.log(chalk.gray(`  ${index + 1}. ${test.emoji} ${test.name}`));
});
console.log('');

for (const test of tests) {
  try {
    console.log(chalk.yellow(`\n▶️  Đang chạy: ${test.emoji} ${test.name}...`));
    
    const result = execSync(test.command, { 
      encoding: 'utf8',
      stdio: 'inherit'
    });
    
    console.log(chalk.green(`✅ ${test.name} - PASS`));
    totalPassed++;
    
  } catch (error) {
    console.log(chalk.red(`❌ ${test.name} - FAIL`));
    console.log(chalk.red(`Error: ${error.message}`));
    totalFailed++;
  }
}

// Tóm tắt kết quả
console.log(chalk.blue.bold('\n📊 KẾT QUẢ TỔNG KẾT:'));
console.log(chalk.green(`✅ Tests PASS: ${totalPassed}`));
console.log(chalk.red(`❌ Tests FAIL: ${totalFailed}`));
console.log(chalk.blue(`📝 Tổng cộng: ${totalPassed + totalFailed} test suites`));

if (totalFailed === 0) {
  console.log(chalk.green.bold('\n🎉 TẤT CẢ CORE TESTS ĐÃ PASS!'));
  console.log(chalk.cyan('✨ Hệ thống database và API hoạt động ổn định.'));
} else {
  console.log(chalk.yellow.bold('\n⚠️  MỘT SỐ TESTS BỊ LỖI'));
  console.log(chalk.cyan('💡 Kiểm tra log phía trên để xem chi tiết.'));
}

console.log(chalk.gray('\n📖 Để xem báo cáo chi tiết, mở file: TESTING_FINAL_STATUS.md'));
console.log(''); 