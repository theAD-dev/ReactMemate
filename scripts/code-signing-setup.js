/**
 * This script helps set up code signing for the MeMate Electron app.
 * It creates the necessary environment variables for code signing.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Create .env file for code signing
const envPath = path.join(__dirname, '..', '.env');

console.log('=== MeMate Electron App Code Signing Setup ===');
console.log('This script will help you set up code signing for your Electron app.');
console.log('You can press Enter to skip any step if you don\'t have the required certificates yet.\n');

const askQuestions = async () => {
  const answers = {};

  // Windows code signing
  console.log('\n=== Windows Code Signing ===');
  answers.windowsCertPath = await new Promise(resolve => {
    rl.question('Path to Windows code signing certificate (.pfx file): ', answer => {
      resolve(answer.trim());
    });
  });

  if (answers.windowsCertPath) {
    answers.windowsCertPassword = await new Promise(resolve => {
      rl.question('Windows certificate password: ', answer => {
        resolve(answer.trim());
      });
    });
  }

  // macOS code signing
  console.log('\n=== macOS Code Signing ===');
  answers.macSigningIdentity = await new Promise(resolve => {
    rl.question('macOS Developer ID Application certificate name (e.g., "Developer ID Application: Your Name (TEAMID)"): ', answer => {
      resolve(answer.trim());
    });
  });

  answers.macNotarizeAppleId = await new Promise(resolve => {
    rl.question('Apple ID for notarization: ', answer => {
      resolve(answer.trim());
    });
  });

  if (answers.macNotarizeAppleId) {
    answers.macNotarizePassword = await new Promise(resolve => {
      rl.question('App-specific password for Apple ID (for notarization): ', answer => {
        resolve(answer.trim());
      });
    });

    answers.macNotarizeTeamId = await new Promise(resolve => {
      rl.question('Apple Team ID: ', answer => {
        resolve(answer.trim());
      });
    });
  }

  rl.close();
  return answers;
};

const createEnvFile = (answers) => {
  let envContent = '# Electron Code Signing Environment Variables\n\n';

  // Windows variables
  envContent += '# Windows Code Signing\n';
  if (answers.windowsCertPath) {
    envContent += `WINDOWS_CERTIFICATE_FILE=${answers.windowsCertPath}\n`;
    envContent += `WINDOWS_CERTIFICATE_PASSWORD=${answers.windowsCertPassword || ''}\n`;
  } else {
    envContent += '# WINDOWS_CERTIFICATE_FILE=path/to/certificate.pfx\n';
    envContent += '# WINDOWS_CERTIFICATE_PASSWORD=your-certificate-password\n';
  }
  envContent += '\n';

  // macOS variables
  envContent += '# macOS Code Signing\n';
  if (answers.macSigningIdentity) {
    envContent += `CSC_NAME=${answers.macSigningIdentity}\n`;
  } else {
    envContent += '# CSC_NAME=Developer ID Application: Your Name (TEAMID)\n';
  }

  if (answers.macNotarizeAppleId) {
    envContent += `APPLE_ID=${answers.macNotarizeAppleId}\n`;
    envContent += `APPLE_APP_SPECIFIC_PASSWORD=${answers.macNotarizePassword || ''}\n`;
    envContent += `APPLE_TEAM_ID=${answers.macNotarizeTeamId || ''}\n`;
  } else {
    envContent += '# APPLE_ID=your.apple.id@example.com\n';
    envContent += '# APPLE_APP_SPECIFIC_PASSWORD=your-app-specific-password\n';
    envContent += '# APPLE_TEAM_ID=your-team-id\n';
  }

  // Write to .env file
  fs.writeFileSync(envPath, envContent);
  console.log(`\nEnvironment variables saved to ${envPath}`);
};

const run = async () => {
  try {
    const answers = await askQuestions();
    createEnvFile(answers);
    
    console.log('\n=== Code Signing Setup Complete ===');
    console.log('You can now build your app with code signing enabled:');
    console.log('  npm run electron:build:prod');
    
    if (!answers.windowsCertPath && !answers.macSigningIdentity) {
      console.log('\nNote: You didn\'t provide any certificates, so your app will be built without code signing.');
      console.log('Users may see security warnings when installing your app.');
    }
    
    console.log('\nTo update your code signing configuration in the future, edit the .env file or run this script again.');
  } catch (error) {
    console.error('Error setting up code signing:', error);
  }
};

run();
