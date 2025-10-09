import { useState, useEffect, useCallback } from 'react';
import { useSocket } from './use-socket';
import { useAuth } from '../../app/providers/auth-provider';

/**
 * Hook for managing chat notification counts
 * Fetches total unread message count from the chat server
 */
export const useChatNotification = () => {
  const { socket, isConnected, listen } = useSocket();
  const { session } = useAuth();
  const user_id = session?.desktop_user_id;
  
  const [chatUnreadCount, setChatUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch total unread count from server
  const fetchUnreadCount = useCallback(() => {
    if (!isConnected || !user_id || !socket) {
      return;
    }

    setIsLoading(true);
    setError(null);

    socket.emit('get_total_unread_count', { user_id }, (ack) => {
      setIsLoading(false);
      
      if (ack?.status === 'success') {
        setChatUnreadCount(ack?.unread || 0);
      } else {
        console.error('Failed to get unread count:', ack?.message);
        setError(ack?.message || 'Failed to get unread count');
      }
    });
  }, [socket, isConnected, user_id]);

  // Listen for get_total_unread_count events
  useEffect(() => {
    if (!isConnected || !socket) return;

    const handleUnreadCountUpdate = (ack) => {
      if (ack?.status === 'success') {
        setChatUnreadCount(ack?.unread || 0);
      }
    };

    const cleanup = listen('get_total_unread_count', handleUnreadCountUpdate);

    return cleanup;
  }, [socket, isConnected, user_id, listen]);

  // Fetch unread count when socket connects
  useEffect(() => {
    if (isConnected && user_id) {
      fetchUnreadCount();
    }
  }, [isConnected, user_id, fetchUnreadCount]);

  return {
    chatUnreadCount,
    isLoading,
    error,
    fetchUnreadCount,
    isConnected
  };
};

export default useChatNotification;
