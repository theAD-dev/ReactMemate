import { useRef, useEffect, useCallback, useState } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'sonner';
import { useAuth } from '../../app/providers/auth-provider';

// Singleton socket state
let globalSocket = null;
let subscribers = new Map();
let currentUser = null;

/**
 * Optimized socket hook - shares one connection across all components
 * Usage: const { socket, isConnected, emit, listen } = useSocket();
 */
export const useSocket = () => {
  const { session } = useAuth();
  const user_id = session?.desktop_user_id;
  const organization_id = session?.organization?.id;
  
  const [isConnected, setIsConnected] = useState(false);
  const componentIdRef = useRef(Symbol('socket-subscriber'));

  // Initialize global socket if not exists
  useEffect(() => {
    if (!user_id || !organization_id) return;

    const componentId = componentIdRef.current;

    // Subscribe this component to connection state
    subscribers.set(componentId, setIsConnected);

    // Handle user switching - disconnect if different user
    if (currentUser && currentUser.user_id !== user_id) {
      if (globalSocket) {
        globalSocket.disconnect();
        globalSocket = null;
      }
    }

    // Store current user
    currentUser = { user_id, organization_id };

    // Initialize socket if not already created
    if (!globalSocket) {
      globalSocket = io(process.env.REACT_APP_CHAT_API_URL, {
        transports: ['websocket'],
        autoConnect: true,
      });

      globalSocket.on('connect', () => {
        console.log('Global socket connected');
        // Notify all subscribers
        subscribers.forEach(callback => callback(true));

        // Register current user
        globalSocket.emit('register_user', { user_id, org_id: organization_id }, (res) => {
          if (res.status === 'success') {
            console.log('User registered successfully');
          } else {
            toast.error('Failed to connect to chat server');
          }
        });
      });

      globalSocket.on('disconnect', () => {
        console.log('Global socket disconnected');
        subscribers.forEach(callback => callback(false));
      });

      globalSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        subscribers.forEach(callback => callback(false));
        toast.error('Connection failed');
      });
    } else if (globalSocket.connected) {
      setIsConnected(true);
    }    // Cleanup on unmount
    return () => {
      subscribers.delete(componentId);

      // If no more subscribers, cleanup socket
      if (subscribers.size === 0 && globalSocket) {
        globalSocket.disconnect();
        globalSocket = null;
        currentUser = null;
      }
    };
  }, [user_id, organization_id]);

  // Emit event helper
  const emit = useCallback((event, data, callback) => {
    if (!globalSocket || !isConnected) {
      console.warn('Socket not connected');
      return false;
    }

    if (callback) {
      globalSocket.emit(event, data, callback);
    } else {
      globalSocket.emit(event, data);
    }
    return true;
  }, [isConnected]);

  // Listen to event helper
  const listen = useCallback((event, handler) => {
    if (!globalSocket) return null;

    globalSocket.on(event, handler);

    // Return cleanup function
    return () => {
      if (globalSocket) {
        globalSocket.off(event, handler);
      }
    };
  }, []);

  return {
    socket: globalSocket,
    isConnected,
    emit,
    listen
  };
};

export default useSocket;