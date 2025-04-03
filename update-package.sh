#!/bin/bash
mv package.json package.json.backup
mv package.json.new package.json
echo "Package.json updated successfully. Backup saved as package.json.backup"
