#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Deploying AI Finance Manager to Vercel...\n');

// Check if we're in the right directory
const currentDir = process.cwd();
const frontendDir = path.join(currentDir, 'frontend');

if (!fs.existsSync(frontendDir)) {
  console.error('❌ Frontend directory not found. Please run this script from the project root.');
  process.exit(1);
}

try {
  // Change to frontend directory
  process.chdir(frontendDir);
  console.log('📁 Changed to frontend directory');

  // Check if vercel.json exists
  if (!fs.existsSync('vercel.json')) {
    console.log('📝 Creating vercel.json configuration...');
    const vercelConfig = {
      "buildCommand": "npm run build",
      "outputDirectory": "build",
      "framework": "create-react-app",
      "rewrites": [
        {
          "source": "/(.*)",
          "destination": "/index.html"
        }
      ]
    };
    fs.writeFileSync('vercel.json', JSON.stringify(vercelConfig, null, 2));
  }

  // Install dependencies if needed
  if (!fs.existsSync('node_modules')) {
    console.log('📦 Installing dependencies...');
    execSync('npm install', { stdio: 'inherit' });
  }

  // Build the project
  console.log('🔨 Building the project...');
  execSync('npm run build', { stdio: 'inherit' });

  // Deploy to Vercel
  console.log('🚀 Deploying to Vercel...');
  console.log('Note: You may need to authenticate with Vercel if not already logged in.');
  
  // Try to deploy with automatic confirmation
  try {
    execSync('vercel --prod --yes', { stdio: 'inherit' });
    console.log('\n✅ Deployment completed successfully!');
  } catch (error) {
    console.log('\n⚠️  Automatic deployment failed. Please run manually:');
    console.log('   cd frontend');
    console.log('   vercel --prod');
    console.log('\nOr visit: https://vercel.com/raginasurahs-projects/project-gold-carry-izdy');
  }

} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
} 