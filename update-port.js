#!/usr/bin/env node

/**
 * Update .env.local to use port 3002
 */

const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');

try {
  if (!fs.existsSync(envPath)) {
    console.log('❌ .env.local file not found. Run npm run setup first.');
    process.exit(1);
  }

  let content = fs.readFileSync(envPath, 'utf8');
  
  // Replace port 3001 with 3002
  content = content.replace(
    /NEXTAUTH_URL=http:\/\/localhost:3001/g,
    'NEXTAUTH_URL=http://localhost:3002'
  );

  fs.writeFileSync(envPath, content, 'utf8');
  
  console.log('✅ Updated .env.local to use port 3002');
  console.log('');
  console.log('🚀 Now run: npm run dev');
  console.log('📱 Then open: http://localhost:3002');
} catch (error) {
  console.error('❌ Error updating .env.local:', error.message);
  process.exit(1);
}


