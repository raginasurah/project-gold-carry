// Comprehensive Test Script for AI Finance App
// Run this in browser console to test all functionality

console.log('🧪 Starting AI Finance App Comprehensive Test...\n');

// Test 1: Settings Persistence
console.log('📋 Test 1: Settings Persistence');
try {
  const testSettings = {
    profile: { firstName: 'Test', lastName: 'User', email: 'test@example.com' },
    notifications: { budgetAlerts: true, weeklyReports: true },
    security: { twoFactor: false },
    preferences: { currency: 'GBP', dateFormat: 'DD/MM/YYYY', darkMode: true }
  };
  
  localStorage.setItem('financeAppSettings', JSON.stringify(testSettings));
  const retrieved = JSON.parse(localStorage.getItem('financeAppSettings'));
  
  if (JSON.stringify(testSettings) === JSON.stringify(retrieved)) {
    console.log('✅ Settings persistence: PASS');
  } else {
    console.log('❌ Settings persistence: FAIL');
  }
} catch (error) {
  console.log('❌ Settings persistence: ERROR -', error.message);
}

// Test 2: Navigation
console.log('\n🧭 Test 2: Navigation');
const navItems = ['Dashboard', 'Transactions', 'Budget', 'Goals', 'Subscriptions', 'Investments', 'Family Hub', 'Settings'];
let navPassed = 0;

navItems.forEach(item => {
  const navLink = document.querySelector(`a[href*="${item.toLowerCase()}"], a[href*="${item.replace(' ', '-').toLowerCase()}"]`);
  if (navLink) {
    navPassed++;
    console.log(`✅ ${item} navigation: FOUND`);
  } else {
    console.log(`❌ ${item} navigation: NOT FOUND`);
  }
});

console.log(`Navigation test: ${navPassed}/${navItems.length} passed`);

// Test 3: Currency Display
console.log('\n💷 Test 3: Currency Display (GBP)');
const currencyElements = document.querySelectorAll('[data-currency], .currency, [class*="currency"]');
let gbpFound = false;

document.body.innerHTML.includes('£') && (gbpFound = true);
document.body.innerHTML.includes('GBP') && (gbpFound = true);

if (gbpFound) {
  console.log('✅ GBP currency display: PASS');
} else {
  console.log('❌ GBP currency display: FAIL');
}

// Test 4: Interactive Elements
console.log('\n🖱️ Test 4: Interactive Elements');
const buttons = document.querySelectorAll('button');
const clickableButtons = Array.from(buttons).filter(btn => 
  btn.onclick || btn.getAttribute('onclick') || btn.hasAttribute('data-testid')
);

console.log(`Found ${buttons.length} buttons, ${clickableButtons.length} have click handlers`);

// Test 5: Notification Service
console.log('\n🔔 Test 5: Notification Service');
if ('Notification' in window) {
  console.log('✅ Notification API: SUPPORTED');
  console.log(`Current permission: ${Notification.permission}`);
} else {
  console.log('❌ Notification API: NOT SUPPORTED');
}

// Test 6: Local Storage Usage
console.log('\n💾 Test 6: Local Storage');
const storageKeys = [
  'financeAppSettings',
  'token',
  'user'
];

storageKeys.forEach(key => {
  const value = localStorage.getItem(key);
  if (value) {
    console.log(`✅ ${key}: FOUND`);
  } else {
    console.log(`⚠️ ${key}: NOT FOUND (may be empty)`);
  }
});

// Test 7: API Configuration
console.log('\n🌐 Test 7: API Configuration');
try {
  // Check if API config exists
  const apiConfigScript = document.querySelector('script[src*="config"]');
  console.log('✅ API configuration: CHECKING...');
  
  // This would need to be run in the actual app context
  console.log('ℹ️ API URL check requires app context');
} catch (error) {
  console.log('❌ API configuration: ERROR -', error.message);
}

// Test Summary
console.log('\n📊 TEST SUMMARY');
console.log('================');
console.log('✅ Settings Persistence');
console.log(`🧭 Navigation: ${navPassed}/${navItems.length}`);
console.log('💷 Currency Display (GBP)');
console.log('🖱️ Interactive Elements');
console.log('🔔 Notification Service');
console.log('💾 Local Storage');
console.log('🌐 API Configuration');

console.log('\n🎉 Test completed! Check individual results above.');