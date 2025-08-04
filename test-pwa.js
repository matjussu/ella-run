/**
 * PWA Test Script
 * 
 * Simple test to verify PWA configuration
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing PWA Configuration...\n');

// Test 1: Check manifest.json exists and is valid
try {
  const manifestPath = path.join(__dirname, 'public', 'manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  
  console.log('✅ manifest.json exists and is valid JSON');
  console.log(`   - Name: ${manifest.name}`);
  console.log(`   - Short name: ${manifest.short_name}`);
  console.log(`   - Display: ${manifest.display}`);
  console.log(`   - Theme color: ${manifest.theme_color}`);
  console.log(`   - Icons: ${manifest.icons.length} defined`);
  
  // Check required PWA fields
  const requiredFields = ['name', 'short_name', 'start_url', 'display', 'icons'];
  const missing = requiredFields.filter(field => !manifest[field]);
  
  if (missing.length === 0) {
    console.log('✅ All required manifest fields present');
  } else {
    console.log(`❌ Missing required fields: ${missing.join(', ')}`);
  }
  
} catch (error) {
  console.log('❌ manifest.json error:', error.message);
}

// Test 2: Check service worker exists
try {
  const swPath = path.join(__dirname, 'public', 'sw.js');
  const swContent = fs.readFileSync(swPath, 'utf8');
  
  console.log('✅ Service worker (sw.js) exists');
  console.log(`   - Size: ${Math.round(swContent.length / 1024)}KB`);
  
  // Check for essential SW features
  const hasInstallListener = swContent.includes("addEventListener('install'");
  const hasActivateListener = swContent.includes("addEventListener('activate'");
  const hasFetchListener = swContent.includes("addEventListener('fetch'");
  
  console.log(`   - Install listener: ${hasInstallListener ? '✅' : '❌'}`);
  console.log(`   - Activate listener: ${hasActivateListener ? '✅' : '❌'}`);
  console.log(`   - Fetch listener: ${hasFetchListener ? '✅' : '❌'}`);
  
} catch (error) {
  console.log('❌ Service worker error:', error.message);
}

// Test 3: Check icons exist
try {
  const manifestPath = path.join(__dirname, 'public', 'manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  
  console.log('\n📱 Checking icons:');
  manifest.icons.forEach((icon, index) => {
    const iconPath = path.join(__dirname, 'public', icon.src);
    const exists = fs.existsSync(iconPath);
    console.log(`   ${index + 1}. ${icon.src} (${icon.sizes}) - ${exists ? '✅' : '❌'}`);
  });
  
} catch (error) {
  console.log('❌ Icon check error:', error.message);
}

// Test 4: Check HTML meta tags
try {
  const htmlPath = path.join(__dirname, 'public', 'index.html');
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');
  
  console.log('\n🌐 Checking HTML PWA tags:');
  
  const hasViewport = htmlContent.includes('name="viewport"');
  const hasThemeColor = htmlContent.includes('name="theme-color"');
  const hasManifestLink = htmlContent.includes('rel="manifest"');
  const hasAppleWebApp = htmlContent.includes('apple-mobile-web-app');
  
  console.log(`   - Viewport meta: ${hasViewport ? '✅' : '❌'}`);
  console.log(`   - Theme color: ${hasThemeColor ? '✅' : '❌'}`);
  console.log(`   - Manifest link: ${hasManifestLink ? '✅' : '❌'}`);
  console.log(`   - Apple web app tags: ${hasAppleWebApp ? '✅' : '❌'}`);
  
} catch (error) {
  console.log('❌ HTML check error:', error.message);
}

console.log('\n🎉 PWA Configuration Test Complete!');
console.log('\n📋 Next steps:');
console.log('   1. Build the app: npm run build');
console.log('   2. Deploy to HTTPS server');
console.log('   3. Test installation on mobile device');
console.log('   4. Verify offline functionality');