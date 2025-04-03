const { contextBridge } = require('electron');

// Expose protected methods that allow the renderer process to use
// Electron APIs without exposing the entire object
contextBridge.exposeInMainWorld(
  'electron', {
    platform: process.platform,
    storage: {
      get: (key) => {
        try {
          return window.localStorage.getItem(key);
        } catch (error) {
          console.error('Error accessing localStorage:', error);
          return null;
        }
      },
      set: (key, value) => {
        try {
          window.localStorage.setItem(key, value);
          return true;
        } catch (error) {
          console.error('Error setting localStorage:', error);
          return false;
        }
      },
      remove: (key) => {
        try {
          window.localStorage.removeItem(key);
          return true;
        } catch (error) {
          console.error('Error removing from localStorage:', error);
          return false;
        }
      },
      clear: () => {
        try {
          window.localStorage.clear();
          return true;
        } catch (error) {
          console.error('Error clearing localStorage:', error);
          return false;
        }
      }
    }
  }
);
