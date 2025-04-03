const fs = require('fs');
const path = require('path');

// Read the package.json file
const packageJsonPath = path.join(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Add the new production scripts
packageJson.scripts['electron:build:prod'] = 'cross-env NODE_ENV=production npm run build && electron-builder';
packageJson.scripts['electron:build:prod:win'] = 'cross-env NODE_ENV=production npm run build && electron-builder --win';
packageJson.scripts['electron:build:prod:mac'] = 'cross-env NODE_ENV=production npm run build && electron-builder --mac';
packageJson.scripts['electron:build:prod:linux'] = 'cross-env NODE_ENV=production npm run build && electron-builder --linux';

// Write the updated package.json back to disk
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');

console.log('Added production build scripts to package.json');
