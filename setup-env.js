#!/usr/bin/env node

/**
 * Setup script to create .env.local file
 * Run this with: node setup-env.js
 */

const fs = require('fs');
const path = require('path');

const envContent = `# Database Connection (MongoDB Atlas)
MONGODB_URI=mongodb+srv://kartikms5477_db_user:6RNsCS9jv4cqFbY8@cluster0.dwqk5yk.mongodb.net/?appName=Cluster0

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=rgFbFN4ienxs9+4hqILlFBW6iDp2zSRER6jbr1DaTSc=

# Google OAuth Credentials
GOOGLE_CLIENT_ID=1051792499110-a6i09clu4ves9obvei2kb9boqervec2i.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
`;

const envPath = path.join(__dirname, '.env.local');

try {
  // Check if file already exists
  if (fs.existsSync(envPath)) {
    const existingContent = fs.readFileSync(envPath, 'utf8');
    if (existingContent.trim() === envContent.trim()) {
      console.log('✅ .env.local already exists and is up to date!');
      process.exit(0);
    }
    console.log('⚠️  .env.local exists but will be updated...');
  }

  // Write the file
  fs.writeFileSync(envPath, envContent, 'utf8');
  console.log('✅ .env.local file created successfully!');
  console.log('');
  console.log('📋 File location:', envPath);
  console.log('');
  console.log('🚀 Next steps:');
  console.log('   1. Run: npm run dev');
  console.log('   2. Open: http://localhost:3001');
  console.log('');
  console.log('✅ Setup complete!');
} catch (error) {
  console.error('❌ Error creating .env.local file:', error.message);
  console.error('');
  console.error('💡 Manual setup:');
  console.error('   1. Create a file named .env.local in the project root');
  console.error('   2. Copy the content from ENV_SETUP_GUIDE.md');
  process.exit(1);
}


