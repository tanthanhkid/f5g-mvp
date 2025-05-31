/**
 * Script kiểm tra tất cả APIs có hoạt động và trả về dữ liệu đúng format không
 * Chạy script này để test nhanh tất cả endpoints
 */

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3001';

// Test endpoints
const endpoints = [
  { path: '/api/quiz-topics', name: 'Quiz Topics' },
  { path: '/api/quiz-topics?category=all&difficulty=beginner', name: 'Quiz Topics (filtered)' },
  { path: '/api/lessons', name: 'Lessons' },
  { path: '/api/lessons?page=1&limit=5', name: 'Lessons (paginated)' },
  { path: '/api/investors', name: 'Investors' },
  { path: '/api/investors?limit=10', name: 'Investors (limited)' },
  { path: '/api/ads', name: 'Ads' },
  { path: '/api/ads?type=banner', name: 'Ads (filtered)' },
  { path: '/api/analytics', name: 'Analytics' },
  { path: '/api/analytics?sponsor=test', name: 'Analytics (filtered)' },
  { path: '/api/influencers', name: 'Influencers' },
  { path: '/api/influencers?tier=gold', name: 'Influencers (filtered)' }
];

// Individual endpoint tests
const specificTests = [
  { path: '/api/quiz-topics/topic_1', name: 'Quiz Topic by ID' },
  { path: '/api/lessons/lesson_1', name: 'Lesson by ID' },
  { path: '/api/investors/1', name: 'Investor by ID' }
];

async function testAPI(endpoint, name) {
  try {
    console.log(`\n🧪 Testing: ${name}`);
    console.log(`   📡 ${endpoint}`);
    
    const startTime = Date.now();
    const response = await fetch(`${BASE_URL}${endpoint}`);
    const duration = Date.now() - startTime;
    
    const data = await response.json();
    
    // Basic response checks
    console.log(`   ⚡ Response time: ${duration}ms`);
    console.log(`   📊 Status: ${response.status}`);
    
    if (response.status === 200) {
      console.log(`   ✅ SUCCESS`);
      
      // Check response structure
      if (data.success === true) {
        console.log(`   ✅ Response format: Valid`);
        
        // Count data items
        let itemCount = 0;
        if (data.topics) itemCount = data.topics.length;
        else if (data.lessons) itemCount = data.lessons.length;
        else if (data.ads) itemCount = data.ads.length;
        else if (data.analytics) itemCount = data.analytics.length;
        else if (data.influencers) itemCount = data.influencers.length;
        else if (data.data && data.data.investors) itemCount = data.data.investors.length;
        else if (data.topic || data.lesson || data.investor) itemCount = 1;
        
        if (itemCount > 0) {
          console.log(`   📝 Data items: ${itemCount}`);
        } else {
          console.log(`   📝 Data: Single object or no items`);
        }
        
        // Validate specific data types
        validateDataTypes(data, name);
        
      } else {
        console.log(`   ⚠️  Response format: Invalid (missing success field)`);
      }
    } else if (response.status === 404) {
      console.log(`   ⚠️  NOT FOUND (expected for some test IDs)`);
      if (data.success === false && data.error) {
        console.log(`   ✅ Error format: Valid`);
      }
    } else {
      console.log(`   ❌ FAILED`);
      if (data.error) {
        console.log(`   📛 Error: ${data.error}`);
      }
    }
    
    return { success: response.status === 200, status: response.status, duration, data };
    
  } catch (error) {
    console.log(`   ❌ NETWORK ERROR: ${error.message}`);
    return { success: false, error: error.message };
  }
}

function validateDataTypes(data, apiName) {
  try {
    if (apiName.includes('Quiz Topics')) {
      if (data.topics && data.topics.length > 0) {
        const topic = data.topics[0];
        checkRequiredFields(topic, ['id', 'title', 'difficulty'], 'Quiz Topic');
        checkNumericField(topic, 'estimatedTime', 'Quiz Topic');
        checkArrayField(topic, 'keywords', 'Quiz Topic');
      } else if (data.topic) {
        checkRequiredFields(data.topic, ['id', 'title', 'difficulty'], 'Quiz Topic');
      }
    }
    
    else if (apiName.includes('Lessons')) {
      if (data.lessons && data.lessons.length > 0) {
        const lesson = data.lessons[0];
        checkRequiredFields(lesson, ['id', 'title'], 'Lesson');
        checkNumericField(lesson, 'estimatedDuration', 'Lesson');
        checkNumericField(lesson, 'tutePoints', 'Lesson');
      } else if (data.lesson) {
        checkRequiredFields(data.lesson, ['id', 'title'], 'Lesson');
      }
    }
    
    else if (apiName.includes('Investors')) {
      if (data.data) {
        checkNumericField(data.data, 'dailyPool', 'Investor Data');
        checkNumericField(data.data, 'totalPool', 'Investor Data');
        if (data.data.investors && data.data.investors.length > 0) {
          const investor = data.data.investors[0];
          checkRequiredFields(investor, ['id', 'name'], 'Investor');
          checkNumericField(investor, 'dailyContribution', 'Investor');
        }
      } else if (data.investor) {
        checkRequiredFields(data.investor, ['id', 'name'], 'Investor');
      }
    }
    
    else if (apiName.includes('Ads')) {
      if (data.ads && data.ads.length > 0) {
        const ad = data.ads[0];
        checkRequiredFields(ad, ['id', 'title', 'type'], 'Ad');
        checkBooleanField(ad, 'isActive', 'Ad');
        checkNumericField(ad, 'priority', 'Ad');
      }
    }
    
    else if (apiName.includes('Analytics')) {
      if (data.analytics && data.analytics.length > 0) {
        const analytic = data.analytics[0];
        checkRequiredFields(analytic, ['id', 'metric', 'value'], 'Analytic');
        checkNumericField(analytic, 'value', 'Analytic');
      }
    }
    
    else if (apiName.includes('Influencers')) {
      if (data.influencers && data.influencers.length > 0) {
        const influencer = data.influencers[0];
        checkRequiredFields(influencer, ['id', 'name', 'tier'], 'Influencer');
        checkNumericField(influencer, 'followers', 'Influencer');
        checkBooleanField(influencer, 'isActive', 'Influencer');
      }
    }
    
    console.log(`   ✅ Data validation: Passed`);
    
  } catch (error) {
    console.log(`   ⚠️  Data validation: ${error.message}`);
  }
}

function checkRequiredFields(obj, fields, entityName) {
  fields.forEach(field => {
    if (!obj.hasOwnProperty(field) || obj[field] === null || obj[field] === undefined) {
      throw new Error(`Missing required field: ${field} in ${entityName}`);
    }
  });
}

function checkNumericField(obj, field, entityName) {
  if (obj.hasOwnProperty(field) && obj[field] !== null && obj[field] !== undefined) {
    if (typeof obj[field] !== 'number' || !Number.isFinite(obj[field])) {
      throw new Error(`Invalid numeric field: ${field} in ${entityName}`);
    }
  }
}

function checkBooleanField(obj, field, entityName) {
  if (obj.hasOwnProperty(field) && obj[field] !== null && obj[field] !== undefined) {
    if (typeof obj[field] !== 'boolean') {
      throw new Error(`Invalid boolean field: ${field} in ${entityName}`);
    }
  }
}

function checkArrayField(obj, field, entityName) {
  if (obj.hasOwnProperty(field) && obj[field] !== null && obj[field] !== undefined) {
    if (!Array.isArray(obj[field])) {
      throw new Error(`Invalid array field: ${field} in ${entityName}`);
    }
  }
}

async function runAllTests() {
  console.log('🚀 Bắt đầu kiểm tra tất cả APIs...');
  console.log(`🌐 Base URL: ${BASE_URL}`);
  console.log('='.repeat(50));
  
  let totalTests = 0;
  let passedTests = 0;
  let totalDuration = 0;
  
  // Test main endpoints
  console.log('\n📋 TESTING MAIN ENDPOINTS:');
  for (const endpoint of endpoints) {
    const result = await testAPI(endpoint.path, endpoint.name);
    totalTests++;
    if (result.success) passedTests++;
    if (result.duration) totalDuration += result.duration;
  }
  
  // Test specific item endpoints
  console.log('\n📋 TESTING SPECIFIC ITEM ENDPOINTS:');
  for (const test of specificTests) {
    const result = await testAPI(test.path, test.name);
    totalTests++;
    if (result.success || result.status === 404) passedTests++; // 404 is acceptable
    if (result.duration) totalDuration += result.duration;
  }
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 TEST SUMMARY:');
  console.log(`   ✅ Passed: ${passedTests}/${totalTests} tests`);
  console.log(`   ⚡ Average response time: ${Math.round(totalDuration / totalTests)}ms`);
  console.log(`   🎯 Success rate: ${Math.round((passedTests / totalTests) * 100)}%`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 ALL TESTS PASSED! APIs are working correctly.');
  } else {
    console.log(`\n⚠️  ${totalTests - passedTests} tests failed. Check the output above.`);
  }
  
  console.log('\n💡 Để chạy Jest tests, sử dụng: npm test');
  console.log('💡 Để chạy live tests, sử dụng: npm run test -- __tests__/api-live.test.ts');
}

// Chạy tests
runAllTests().catch(error => {
  console.error('❌ Test runner failed:', error);
  process.exit(1);
}); 