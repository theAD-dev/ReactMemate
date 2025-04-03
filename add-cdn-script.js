const fs = require('fs');
const path = require('path');

// Read the package.json file
const packageJsonPath = path.join(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Add the new script
packageJson.scripts['electron:serve:cdn'] = 'concurrently -k "cross-env BROWSER=none npm start" "wait-on tcp:3000 && electron ."';

// Write the updated package.json back to disk
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');

console.log('Added electron:serve:cdn script to package.json');
