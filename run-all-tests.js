#!/usr/bin/env node

/**
 * Script tổng hợp chạy TẤT CẢ TESTS trong dự án Freedom Training
 * Bao gồm: Database, API, Integration, UI Components
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Kiểm tra nếu có chalk, nếu không thì fallback
let chalk;
try {
  chalk = require('chalk');
} catch (e) {
  // Fallback nếu không có chalk
  chalk = {
    blue: { bold: (text) => text },
    green: { bold: (text) => text },
    red: { bold: (text) => text },
    yellow: { bold: (text) => text },
    cyan: (text) => text,
    gray: (text) => text,
    green: (text) => text,
    red: (text) => text,
    blue: (text) => text,
    yellow: (text) => text
  };
}

console.log('\n🧪 CHẠY TẤT CẢ TESTS - FREEDOM TRAINING PLATFORM\n');

// Danh sách tất cả test suites trong dự án
const allTests = [
  {
    name: 'Database Connectivity Tests',
    command: 'npx jest __tests__/database-connectivity.test.ts --verbose',
    emoji: '🗄️',
    category: 'Core'
  },
  {
    name: 'API Routes Tests', 
    command: 'npx jest __tests__/api-routes.test.ts --verbose',
    emoji: '🌐',
    category: 'Core'
  },
  {
    name: 'Integration Flow Tests',
    command: 'npx jest __tests__/integration-flow.test.ts --verbose', 
    emoji: '🔄',
    category: 'Core'
  },
  {
    name: 'HomePage Component Tests',
    command: 'npx jest __tests__/homepage.test.tsx --verbose',
    emoji: '🏠',
    category: 'UI'
  }
];

// Tìm các test files khác nếu có (nhưng chỉ thêm những file có tên hợp lệ và tồn tại)
const testDir = path.join(__dirname, '__tests__');
if (fs.existsSync(testDir)) {
  const testFiles = fs.readdirSync(testDir).filter(file => 
    (file.endsWith('.test.ts') || file.endsWith('.test.tsx')) && 
    fs.existsSync(path.join(testDir, file)) // Kiểm tra file tồn tại
  );
  
  const existingTestFiles = allTests.map(test => {
    const match = test.command.match(/__tests__\/(.+?\.test\.tsx?)/);
    return match ? match[1] : null;
  }).filter(Boolean);

  // Thêm các test files chưa có trong danh sách (chỉ thêm những file có vẻ hợp lệ và tồn tại)
  testFiles.forEach(file => {
    if (!existingTestFiles.includes(file) && !file.includes('README') && !file.includes('run-')) {
      // Kiểm tra file thực sự tồn tại trước khi thêm
      const fullPath = path.join(testDir, file);
      if (fs.existsSync(fullPath)) {
        allTests.push({
          name: file.replace(/\.(test\.(ts|tsx))$/, '').replace(/[-_]/g, ' ') + ' Tests',
          command: `npx jest __tests__/${file} --verbose --passWithNoTests`,
          emoji: '📝',
          category: 'Additional'
        });
      }
    }
  });
}

let results = [];

console.log('📋 Danh sách tất cả tests sẽ chạy:\n');

// Nhóm tests theo category
const categories = {};
allTests.forEach(test => {
  if (!categories[test.category]) {
    categories[test.category] = [];
  }
  categories[test.category].push(test);
});

Object.keys(categories).forEach(category => {
  console.log(`📂 ${category} Tests:`);
  categories[category].forEach((test, index) => {
    console.log(`  ${test.emoji} ${test.name}`);
  });
  console.log('');
});

console.log('⏳ Bắt đầu chạy tests...\n');

// Chạy từng test suite
for (const test of allTests) {
  try {
    console.log(`\n▶️  Đang chạy: ${test.emoji} ${test.name}...`);
    
    const startTime = Date.now();
    const result = execSync(test.command, { 
      encoding: 'utf8',
      stdio: 'pipe',
      maxBuffer: 1024 * 1024 * 10 // 10MB buffer để capture tất cả output
    });
    const endTime = Date.now();
    
    // Parse kết quả từ Jest output - sửa hoàn toàn
    let passedCount = 0;
    let failedCount = 0;
    let totalCount = 0;
    
    // Split và tìm summary lines
    const lines = result.split('\n');
    
    // Pattern 1: Jest test results format: "Tests:       12 passed, 12 total"
    const testResultLine = lines.find(line => 
      line.trim().startsWith('Tests:') && line.includes('total')
    );
    
    if (testResultLine) {
      // Parse pattern: "Tests:       12 passed, 12 total"
      const passedMatch = testResultLine.match(/(\d+)\s+passed/);
      const failedMatch = testResultLine.match(/(\d+)\s+failed/);
      const totalMatch = testResultLine.match(/(\d+)\s+total/);
      
      if (passedMatch) passedCount = parseInt(passedMatch[1]);
      if (failedMatch) failedCount = parseInt(failedMatch[1]);
      if (totalMatch) totalCount = parseInt(totalMatch[1]);
    }
    
    // Pattern 2: Fallback với Test Suites nếu không có Tests line
    if (totalCount === 0) {
      const testSuiteLine = lines.find(line => 
        line.trim().startsWith('Test Suites:') && line.includes('total')
      );
      
      if (testSuiteLine) {
        const passedMatch = testSuiteLine.match(/(\d+)\s+passed/);
        const failedMatch = testSuiteLine.match(/(\d+)\s+failed/);
        const totalMatch = testSuiteLine.match(/(\d+)\s+total/);
        
        if (passedMatch) passedCount = parseInt(passedMatch[1]);
        if (failedMatch) failedCount = parseInt(failedMatch[1]);
        if (totalMatch) totalCount = parseInt(totalMatch[1]);
      }
    }
    
    console.log(`✅ ${test.name} - PASS (${passedCount}/${totalCount} tests, ${endTime - startTime}ms)`);
    
    results.push({
      name: test.name,
      emoji: test.emoji,
      category: test.category,
      status: 'PASS',
      passed: passedCount,
      failed: failedCount,
      total: totalCount,
      duration: endTime - startTime
    });
    
  } catch (error) {
    console.log(`❌ ${test.name} - FAIL`);
    
    // Parse error output
    let failedCount = 0;
    let totalCount = 0;
    let passedCount = 0;
    
    if (error.stdout) {
      const lines = error.stdout.split('\n');
      const testSummaryLine = lines.find(line => line.includes('Tests:') && line.includes('total'));
      
      if (testSummaryLine) {
        const passedMatch = testSummaryLine.match(/(\d+) passed/);
        const failedMatch = testSummaryLine.match(/(\d+) failed/);
        const totalMatch = testSummaryLine.match(/(\d+) total/);
        
        if (passedMatch) passedCount = parseInt(passedMatch[1]);
        if (failedMatch) failedCount = parseInt(failedMatch[1]);
        if (totalMatch) totalCount = parseInt(totalMatch[1]);
      }
    }
    
    results.push({
      name: test.name,
      emoji: test.emoji,
      category: test.category,
      status: 'FAIL',
      passed: passedCount,
      failed: failedCount,
      total: totalCount,
      error: error.message.split('\n')[0]
    });
  }
}

// Tổng hợp kết quả cuối cùng
console.log('\n' + '='.repeat(60));
console.log('📊 KẾT QUẢ TỔNG HỢP CUỐI CÙNG');
console.log('='.repeat(60) + '\n');

// Hiển thị kết quả theo category
Object.keys(categories).forEach(category => {
  const categoryResults = results.filter(r => r.category === category);
  const categoryPassed = categoryResults.filter(r => r.status === 'PASS').length;
  const categoryTotal = categoryResults.length;
  
  const statusIcon = categoryPassed === categoryTotal ? '✅' : '⚠️';
  console.log(`${statusIcon} ${category} Tests: ${categoryPassed}/${categoryTotal} suites passed`);
  
  categoryResults.forEach(result => {
    const status = result.status === 'PASS' ? '✅' : '❌';
    const testInfo = result.total > 0 ? ` (${result.passed}/${result.total} tests)` : ' (suite ran)';
    const durationInfo = result.duration ? ` - ${result.duration}ms` : '';
    console.log(`  ${status} ${result.emoji} ${result.name}${testInfo}${durationInfo}`);
    
    if (result.status === 'FAIL' && result.error) {
      console.log(`      💥 Error: ${result.error.substring(0, 100)}...`);
    }
  });
  console.log('');
});

// Thống kê tổng
const totalSuitesPassed = results.filter(r => r.status === 'PASS').length;
const totalSuitesFailed = results.filter(r => r.status === 'FAIL').length;
const totalIndividualTests = results.reduce((sum, r) => sum + r.total, 0);
const totalIndividualPassed = results.reduce((sum, r) => sum + r.passed, 0);
const totalIndividualFailed = results.reduce((sum, r) => sum + r.failed, 0);

console.log('📈 THỐNG KÊ TỔNG QUAN:');
console.log(`🧪 Test Suites: ${totalSuitesPassed} passed, ${totalSuitesFailed} failed, ${totalSuitesPassed + totalSuitesFailed} total`);

if (totalIndividualTests > 0) {
  console.log(`🔍 Individual Tests: ${totalIndividualPassed} passed, ${totalIndividualFailed} failed, ${totalIndividualTests} total`);
  const successRate = ((totalIndividualPassed / totalIndividualTests) * 100).toFixed(1);
  console.log(`📊 Success Rate: ${successRate}%`);
} else {
  console.log(`🔍 Individual Tests: Test suites executed successfully`);
  const successRate = totalSuitesFailed === 0 ? 100 : ((totalSuitesPassed / (totalSuitesPassed + totalSuitesFailed)) * 100).toFixed(1);
  console.log(`📊 Suite Success Rate: ${successRate}%`);
}

console.log('\n' + '='.repeat(60));

if (totalSuitesFailed === 0) {
  console.log('🎉 TẤT CẢ TEST SUITES ĐÃ PASS!');
  console.log('✨ Ứng dụng Freedom Training hoạt động ổn định.');
} else {
  console.log('⚠️  MỘT SỐ TEST SUITES BỊ LỖI');
  console.log('💡 Kiểm tra chi tiết lỗi ở phía trên.');
  
  // Hiển thị hướng dẫn để chạy các tests riêng lẻ
  console.log('\n🔧 CÁCH SỬA:');
  console.log('📌 Chạy từng test riêng lẻ để xem lỗi chi tiết:');
  
  const failedTests = results.filter(r => r.status === 'FAIL');
  failedTests.forEach(test => {
    const command = allTests.find(t => t.name === test.name)?.command;
    if (command) {
      console.log(`   ${test.emoji} ${command}`);
    }
  });
}

console.log('\n📖 Scripts available:');
console.log('🚀 Core tests only: npm run test:core');
console.log('🗄️ Database only: npm run test:database');
console.log('🌐 API only: npm run test:api-routes');
console.log('🔄 Integration only: npm run test:flow');
console.log('');

// Exit với code phù hợp cho CI/CD
process.exit(totalSuitesFailed > 0 ? 1 : 0); 