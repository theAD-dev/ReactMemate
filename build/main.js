const { app, BrowserWindow, screen } = require('electron/main')

function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  const win = new BrowserWindow({
    width: width,
    height: height,
    webPreferences: {
      contextIsolation: true, // Improves security
      enableRemoteModule: false, // Remote module is deprecated
      nodeIntegration: false, // Prevent Node.js access in the renderer
    }
  })

  win.loadURL('https://dev.memate.com.au/');

  // win.webContents.openDevTools();

  win.webContents.on('did-finish-load', () => {
    win.webContents.insertCSS(`
      body {
        overflow-x: auto !important;
      }
      #root {
        min-width: 1200px !important;
      }
    `);
  });
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})