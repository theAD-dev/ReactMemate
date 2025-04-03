// This script will be injected into the iframe to provide localStorage functionality
(function() {
  // Create a polyfill for localStorage that communicates with the parent window
  const localStoragePolyfill = {
    getItem: function(key) {
      return new Promise((resolve) => {
        const messageId = Date.now().toString();
        
        const handleMessage = function(event) {
          if (event.data.type === 'LOCAL_STORAGE_RESULT' && event.data.key === key) {
            window.removeEventListener('message', handleMessage);
            resolve(event.data.value);
          }
        };
        
        window.addEventListener('message', handleMessage);
        
        window.parent.postMessage({
          type: 'GET_LOCAL_STORAGE',
          key: key,
          messageId: messageId
        }, '*');
      });
    },
    
    setItem: function(key, value) {
      window.parent.postMessage({
        type: 'SET_LOCAL_STORAGE',
        key: key,
        value: value
      }, '*');
    },
    
    removeItem: function(key) {
      window.parent.postMessage({
        type: 'REMOVE_LOCAL_STORAGE',
        key: key
      }, '*');
    },
    
    clear: function() {
      window.parent.postMessage({
        type: 'CLEAR_LOCAL_STORAGE'
      }, '*');
    }
  };
  
  // Listen for the initialization message from the parent window
  window.addEventListener('message', function(event) {
    if (event.data.type === 'ELECTRON_BRIDGE_INITIALIZED') {
      // Store the electron object from the parent
      window.electronBridge = event.data.electron;
      
      // Dispatch an event to notify the application that Electron is ready
      const electronReadyEvent = new CustomEvent('electronReady', {
        detail: window.electronBridge
      });
      window.dispatchEvent(electronReadyEvent);
    }
  });
  
  // Inject the localStorage polyfill
  // This is a simple approach - for a production app, you might want to use
  // a more sophisticated method to override the native localStorage
  const originalLocalStorage = window.localStorage;
  
  // Create a proxy for localStorage
  window.localStorage = new Proxy({}, {
    get: function(target, prop) {
      if (prop === 'getItem') {
        return async function(key) {
          try {
            return await localStoragePolyfill.getItem(key);
          } catch (e) {
            console.error('Error in localStorage.getItem:', e);
            return null;
          }
        };
      } else if (prop === 'setItem') {
        return function(key, value) {
          try {
            localStoragePolyfill.setItem(key, value);
          } catch (e) {
            console.error('Error in localStorage.setItem:', e);
          }
        };
      } else if (prop === 'removeItem') {
        return function(key) {
          try {
            localStoragePolyfill.removeItem(key);
          } catch (e) {
            console.error('Error in localStorage.removeItem:', e);
          }
        };
      } else if (prop === 'clear') {
        return function() {
          try {
            localStoragePolyfill.clear();
          } catch (e) {
            console.error('Error in localStorage.clear:', e);
          }
        };
      } else {
        return originalLocalStorage[prop];
      }
    }
  });
  
  console.log('localStorage bridge initialized');
})();
