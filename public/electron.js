const { app, BrowserWindow, shell, protocol } = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');

// Keep a global reference of the window object to avoid garbage collection
let mainWindow;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: true,
      allowRunningInsecureContent: false,
      enableWebSQL: false,
      enableRemoteModule: false,
      sandbox: false,
      worldSafeExecuteJavaScript: true,
      partition: 'persist:app'
    },
    icon: path.join(__dirname, 'img-logo.png')
  });

  // Load the app
  // Determine if we're in development or production mode
  const isDev = process.env.ELECTRON_START_URL || process.env.NODE_ENV === 'development';

  // Choose the appropriate loader based on environment
  let startUrl;
  if (isDev) {
    // Development mode - use localhost
    startUrl = process.env.ELECTRON_START_URL ||
      url.format({
        pathname: path.join(__dirname, 'cdn-loader-dev.html'),
        protocol: 'file:',
        slashes: true
      });
  } else {
    // Production mode - use production URL
    startUrl = url.format({
      pathname: path.join(__dirname, 'cdn-loader.html'),
      protocol: 'file:',
      slashes: true
    });
  }

  // Set Content Security Policy
  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self' app: http://localhost:3000 https://dev.memate.com.au https:;",
          "script-src 'self' app: http://localhost:3000 https://dev.memate.com.au https://js.stripe.com 'unsafe-inline' 'unsafe-eval';",
          "style-src 'self' app: http://localhost:3000 https://dev.memate.com.au 'unsafe-inline' https://fonts.googleapis.com;",
          "img-src 'self' app: http://localhost:3000 https://dev.memate.com.au data: https:;",
          "font-src 'self' app: http://localhost:3000 https://dev.memate.com.au data: https://fonts.gstatic.com;",
          "connect-src 'self' app: http://localhost:3000 https://dev.memate.com.au https: https://*.stripe.com https://*.stripe.network;",
          "media-src 'self' app: http://localhost:3000 https://dev.memate.com.au;",
          "frame-src 'self' app: http://localhost:3000 https://dev.memate.com.au https://js.stripe.com https://*.stripe.com https://*.stripe.network;"
        ].join(' ')
      }
    });
  });

  mainWindow.loadURL(startUrl);

  // Handle navigation within the app
  mainWindow.webContents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);

    // If it's an external URL, open in browser
    if (parsedUrl.origin !== 'file://' && !parsedUrl.href.startsWith(process.env.ELECTRON_START_URL || '')) {
      event.preventDefault();
      shell.openExternal(navigationUrl);
    }
  });

  // Open external links in browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    const parsedUrl = new URL(url);
    if (parsedUrl.origin !== 'file://' && !url.startsWith(process.env.ELECTRON_START_URL || '')) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  // Emitted when the window is closed
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

// Register protocol
app.whenReady().then(() => {
  // Register a custom protocol
  protocol.handle('app', (request) => {
    const urlPath = new URL(request.url).pathname;
    let normalizedPath;

    // Handle routes
    if (urlPath === '/' || urlPath.includes('/login') || urlPath.includes('/dashboard')) {
      // For routes like /login, /dashboard, etc.
      normalizedPath = path.normalize(`${__dirname}/../build/index.html`);
    } else {
      // For assets
      normalizedPath = path.normalize(`${__dirname}/../build${urlPath}`);
    }

    return new Response(fs.createReadStream(normalizedPath));
  });

  createWindow();
});

// Quit when all windows are closed
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});
