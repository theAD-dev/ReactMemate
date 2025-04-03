# MeMate Electron App

This document provides instructions for building and deploying the MeMate Electron desktop application.

## Development Setup

### Prerequisites

- Node.js (v18.12 or higher)
- npm (v8 or higher)

### Running in Development Mode

To run the app in development mode (connecting to localhost:3000):

```bash
# Start the development server
npm run electron:serve
```

This will:
1. Start the React development server on port 3000
2. Launch the Electron app that connects to the local development server

## Building for Production

### Building for the Current Platform

To build the app for production (connecting to https://dev.memate.com.au):

```bash
# Build for the current platform
npm run electron:build:prod
```

### Building for Specific Platforms

To build for specific platforms:

```bash
# Build for Windows
npm run electron:build:prod:win

# Build for macOS (requires a Mac)
npm run electron:build:prod:mac

# Build for Linux
npm run electron:build:prod:linux
```

### Building for All Platforms

To build for all platforms (requires appropriate dependencies):

```bash
# Build for all platforms
npm run electron:build-all
```

## Code Signing

Code signing is important for distribution as it verifies the authenticity of your app and reduces security warnings for users.

### Setting Up Code Signing

Run the code signing setup script to configure your certificates:

```bash
node scripts/code-signing-setup.js
```

This will create a `.env` file with your code signing configuration.

### Windows Code Signing

For Windows, you'll need:
- A code signing certificate (.pfx file)
- The certificate password

These can be purchased from certificate authorities like:
- DigiCert
- Sectigo
- GlobalSign

### macOS Code Signing

For macOS, you'll need:
- An Apple Developer account ($99/year)
- A Developer ID Application certificate
- App-specific password for notarization

### Building with Code Signing

Once your certificates are set up, build your app with the same commands:

```bash
npm run electron:build:prod
```

The app will be automatically signed if the certificates are properly configured.

## Notes

### Cross-Platform Building

- Building for macOS requires a Mac due to Apple's restrictions
- Building for Windows from Linux or Mac requires Wine to be installed
- Building for Linux requires rpm package if you want to build RPM packages:
  ```bash
  sudo apt-get install rpm
  ```

### Production vs Development

- Development builds connect to `http://localhost:3000`
- Production builds connect to `https://dev.memate.com.au`
- The app will automatically detect the environment and use the appropriate URL

### Troubleshooting

If you encounter issues with the Electron app:

1. Check the console logs for errors
2. Ensure all dependencies are installed
3. Make sure the production server is accessible
4. Verify that the Content Security Policy allows all necessary resources

## Distribution

After building, the packaged applications will be available in the `dist` directory.

### Direct Download Links

To provide direct download links for your app:

1. Upload the built files from the `dist` directory to your server
2. Create download links on your website pointing to these files
3. For Windows, link to the `.exe` installer
4. For macOS, link to the `.dmg` file
5. For Linux, provide links to both `.AppImage` and `.deb` files

Example download page HTML:

```html
<div class="downloads">
  <h2>Download MeMate Desktop App</h2>
  <ul>
    <li><a href="https://dev.memate.com.au/downloads/MeMate-Setup-1.0.0.exe">Download for Windows</a></li>
    <li><a href="https://dev.memate.com.au/downloads/MeMate-1.0.0.dmg">Download for macOS</a></li>
    <li><a href="https://dev.memate.com.au/downloads/MeMate-1.0.0.AppImage">Download for Linux (AppImage)</a></li>
    <li><a href="https://dev.memate.com.au/downloads/memate_1.0.0_amd64.deb">Download for Linux (Debian/Ubuntu)</a></li>
  </ul>
</div>
```

### Auto-Updates

The app is configured to check for updates from `https://dev.memate.com.au/downloads`. To enable auto-updates:

1. Create a `latest.yml` (Windows), `latest-mac.yml` (macOS), and `latest-linux.yml` (Linux) file in your downloads directory
2. These files should contain information about the latest version

Electron-builder can generate these files automatically when you build the app.
