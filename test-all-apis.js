const axios = require('axios');
const fs = require('fs');

const BASE_URL = 'http://localhost:3000';

// Test results storage
const testResults = {
  passed: 0,
  failed: 0,
  tests: []
};

// Helper function to log test results
function logTest(endpoint, method, status, message) {
  const result = {
    endpoint,
    method,
    status,
    message,
    timestamp: new Date().toISOString()
  };
  
  testResults.tests.push(result);
  
  if (status === 'PASS') {
    testResults.passed++;
    console.log(`✅ ${method} ${endpoint} - ${message}`);
  } else {
    testResults.failed++;
    console.log(`❌ ${method} ${endpoint} - ${message}`);
  }
}

// Test function
async function testEndpoint(method, endpoint, data = null, expectedStatus = 200) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };
    
    if (data && (method === 'POST' || method === 'PUT')) {
      config.data = data;
    }
    
    const response = await axios(config);
    
    if (response.status === expectedStatus) {
      logTest(endpoint, method, 'PASS', `Status: ${response.status}`);
      return true;
    } else {
      logTest(endpoint, method, 'FAIL', `Expected: ${expectedStatus}, Got: ${response.status}`);
      return false;
    }
  } catch (error) {
    const status = error.response?.status || 'Network Error';
    const message = error.response?.data?.message || error.message;
    logTest(endpoint, method, 'FAIL', `Status: ${status}, Error: ${message}`);
    return false;
  }
}

// Main test suite
async function runAPITests() {
  console.log('🚀 Starting comprehensive API testing...\n');
  
  // Test Projects API
  console.log('📊 Testing Projects API...');
  await testEndpoint('GET', '/api/projects');
  
  // Test Admin Settings API
  console.log('\n⚙️ Testing Admin Settings API...');
  await testEndpoint('GET', '/api/admin/settings');
  await testEndpoint('PUT', '/api/admin/settings', {
    facebook: 'https://facebook.com/test',
    instagram: 'https://instagram.com/test',
    twitter: 'https://twitter.com/test',
    linkedin: 'https://linkedin.com/test',
    youtube: 'https://youtube.com/test'
  });
  
  // Test Video Settings API
  console.log('\n🎥 Testing Video Settings API...');
  await testEndpoint('GET', '/api/admin/video-settings');
  
  // Test Media API
  console.log('\n📁 Testing Media API...');
  await testEndpoint('GET', '/api/admin/media');
  
  // Test Developers API
  console.log('\n👥 Testing Developers API...');
  await testEndpoint('GET', '/api/developers');
  
  // Test Articles API
  console.log('\n📰 Testing Articles API...');
  await testEndpoint('GET', '/api/articles');
  
  // Test Hero Sections API
  console.log('\n🎯 Testing Hero Sections API...');
  await testEndpoint('GET', '/api/hero-sections');
  
  // Test Auth API
  console.log('\n🔐 Testing Auth API...');
  await testEndpoint('POST', '/api/auth/login', {
    email: 'admin@example.com',
    password: 'Abedyr57..'
  });
  
  // Test Setup API
  console.log('\n🔧 Testing Setup API...');
  await testEndpoint('GET', '/api/setup/video-table', null, 200);
  
  // Generate test report
  console.log('\n📋 Generating test report...');
  
  const report = {
    summary: {
      total: testResults.passed + testResults.failed,
      passed: testResults.passed,
      failed: testResults.failed,
      successRate: `${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(2)}%`
    },
    timestamp: new Date().toISOString(),
    tests: testResults.tests
  };
  
  // Save report to file
  fs.writeFileSync('api-test-report.json', JSON.stringify(report, null, 2));
  
  // Print summary
  console.log('\n📊 TEST SUMMARY:');
  console.log(`Total Tests: ${report.summary.total}`);
  console.log(`Passed: ${report.summary.passed}`);
  console.log(`Failed: ${report.summary.failed}`);
  console.log(`Success Rate: ${report.summary.successRate}`);
  console.log('\n📄 Detailed report saved to: api-test-report.json');
  
  if (testResults.failed === 0) {
    console.log('\n🎉 All API tests passed!');
    process.exit(0);
  } else {
    console.log('\n⚠️ Some API tests failed. Check the report for details.');
    process.exit(1);
  }
}

// Run the tests
runAPITests().catch(error => {
  console.error('❌ Test suite failed:', error.message);
  process.exit(1);
});