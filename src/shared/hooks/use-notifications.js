import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useSocket } from './use-socket';
import {
    getNotifications,
    getUnreadNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead
} from '../../APIs/notification-api';
import { useAuth } from '../../app/providers/auth-provider';

export const useNotifications = (isOpen) => {
    const [offset, setOffset] = useState(0);
    const [showOnlyUnread, setShowOnlyUnread] = useState(false);
    const [allNotifications, setAllNotifications] = useState([]);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
    const queryClient = useQueryClient();
    const { socket, isConnected, listen, emit } = useSocket();
    const { session } = useAuth();
    const user_id = session?.desktop_user_id;
    const limit = 20;

    // Fetch unread notification count from server
    const fetchUnreadCount = useCallback(() => {
        if (!isConnected || !user_id) {
            return;
        }

        emit('desktop_notifications', { user_id }, (ack) => {
            console.log('....ack: ', ack);
            if (ack?.status === 'success') {
                setUnreadNotificationCount(ack?.unread || 0);
            }
        });
    }, [emit, isConnected, user_id]);

    // Get notifications with pagination
    const notificationsQuery = useQuery({
        queryKey: ['notifications', offset, showOnlyUnread],
        queryFn: () => showOnlyUnread ? getUnreadNotifications(limit, offset) : getNotifications(limit, offset),
        enabled: isOpen,
        staleTime: 0
    });

    // Update notifications list when new data comes in
    useEffect(() => {
        if (notificationsQuery.data) {
            if (offset === 0) {
                setAllNotifications(notificationsQuery.data.results);
            } else {
                setAllNotifications(prev => {
                    const existingIds = new Set(prev.map(n => n.id));
                    const newNotifications = notificationsQuery.data.results.filter(n => !existingIds.has(n.id));
                    return [...prev, ...newNotifications];
                });
            }

            // Check if there's more data based on count and current loaded items
            const totalLoaded = allNotifications.length + (notificationsQuery.data.results?.length || 0);
            setHasMoreData(totalLoaded < notificationsQuery.data.count);
        }
    }, [notificationsQuery.data, offset, allNotifications.length]);

    // Reset when dropdown opens
    useEffect(() => {
        setAllNotifications([]);
        setOffset(0);
        setHasMoreData(true);
        if (document.getElementById('notification-list')) document.getElementById('notification-list').scrollTop = 0;
    }, [isOpen]);

    // Manual reset function
    const resetNotifications = useCallback(() => {
        setAllNotifications([]);
        setOffset(0);
        setHasMoreData(true);
        if (document.getElementById('notification-list')) document.getElementById('notification-list').scrollTop = 0;
    }, []);

    // Fetch unread count when socket connects
    useEffect(() => {
        if (isConnected && user_id) {
            fetchUnreadCount();
        }
    }, [isConnected, user_id, fetchUnreadCount]);

    // Listen for desktop_notifications events
    useEffect(() => {
        if (!isConnected || !socket) return;

        const handleDesktopNotification = (data) => {
            console.log('data: ', data);
        };

        const cleanup = listen('desktop_notifications', handleDesktopNotification);

        return cleanup;
    }, [socket, isConnected, listen, queryClient, isOpen]);

    // Mark as read mutation
    const markAsReadMutation = useMutation({
        mutationFn: markNotificationAsRead,
        onSuccess: () => {
            // Update local state to mark as read
            setAllNotifications(prev =>
                prev.map(notification =>
                    notification.id === markAsReadMutation.variables
                        ? { ...notification, read: true }
                        : notification
                )
            );
        },
        onError: () => {
            toast.error('Failed to mark notification as read');
        }
    });

    // Mark all as read mutation
    const markAllAsReadMutation = useMutation({
        mutationFn: markAllNotificationsAsRead,
        onSuccess: () => {
            // Update local state to mark all as read
            setAllNotifications(prev =>
                prev.map(notification => ({ ...notification, read: true }))
            );
            setUnreadNotificationCount(0);
            toast.success('All notifications marked as read');
        },
        onError: () => {
            toast.error('Failed to mark all notifications as read');
        }
    });

    // Load more notifications
    const loadMore = useCallback(() => {
        if (hasMoreData && !notificationsQuery.isFetching) {
            setOffset(prevOffset => prevOffset + limit);
        }
    }, [hasMoreData, notificationsQuery.isFetching, limit]);

    // Mark notification as read
    const markAsRead = useCallback((notificationId) => {
        markAsReadMutation.mutate(notificationId);
    }, [markAsReadMutation]);

    // Mark all notifications as read
    const markAllAsRead = useCallback(() => {
        markAllAsReadMutation.mutate();
    }, [markAllAsReadMutation]);

    return {
        // Data
        notifications: allNotifications,
        unreadCount: unreadNotificationCount || 0,
        hasMoreData,

        // Loading states
        isLoading: notificationsQuery.isLoading && offset === 0,
        isFetchingMore: notificationsQuery.isFetching && offset > 0,
        isMarkingRead: markAsReadMutation.isLoading,
        isMarkingAllRead: markAllAsReadMutation.isLoading,

        // Error state
        error: notificationsQuery.error,

        // Actions
        loadMore,
        markAsRead,
        markAllAsRead,
        fetchUnreadCount,
        showOnlyUnread,
        setShowOnlyUnread,
        resetNotifications,

        // Utilities
        refresh: () => {
        },
    };
};