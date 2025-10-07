import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
    getNotifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    getUnreadNotificationCount 
} from '../../APIs/notification-api';

export const useNotifications = (isOpen) => {
    const [page, setPage] = useState(1);
    const [allNotifications, setAllNotifications] = useState([]);
    const [hasMoreData, setHasMoreData] = useState(true);
    const queryClient = useQueryClient();

    // Get unread count
    const unreadCountQuery = useQuery({
        queryKey: ['unread-notification-count'],
        queryFn: getUnreadNotificationCount,
        refetchInterval: 30000, // Refetch every 30 seconds
    });

    // Get notifications with pagination
    const notificationsQuery = useQuery({
        queryKey: ['notifications', page],
        queryFn: () => getNotifications(page, 20),
        enabled: isOpen,
        staleTime: 30000,
        keepPreviousData: true,
    });

    // Update notifications list when new data comes in
    useEffect(() => {
        if (notificationsQuery.data) {
            if (page === 1) {
                setAllNotifications(notificationsQuery.data.results);
            } else {
                setAllNotifications(prev => {
                    const existingIds = new Set(prev.map(n => n.id));
                    const newNotifications = notificationsQuery.data.results.filter(n => !existingIds.has(n.id));
                    return [...prev, ...newNotifications];
                });
            }
            
            const totalLoaded = page * 20;
            setHasMoreData(totalLoaded < notificationsQuery.data.count);
        }
    }, [notificationsQuery.data, page]);

    // Reset when dropdown opens
    useEffect(() => {
        if (isOpen) {
            setAllNotifications([]);
            setPage(1);
            setHasMoreData(true);
        }
    }, [isOpen]);

    // Mark as read mutation
    const markAsReadMutation = useMutation({
        mutationFn: markNotificationAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries(['notifications']);
            queryClient.invalidateQueries(['unread-notification-count']);
        },
        onError: () => {
            toast.error('Failed to mark notification as read');
        }
    });

    // Mark all as read mutation
    const markAllAsReadMutation = useMutation({
        mutationFn: markAllNotificationsAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries(['notifications']);
            queryClient.invalidateQueries(['unread-notification-count']);
            toast.success('All notifications marked as read');
        },
        onError: () => {
            toast.error('Failed to mark all notifications as read');
        }
    });

    // Load more notifications
    const loadMore = useCallback(() => {
        if (hasMoreData && !notificationsQuery.isFetching) {
            setPage(prevPage => prevPage + 1);
        }
    }, [hasMoreData, notificationsQuery.isFetching]);

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
        unreadCount: unreadCountQuery.data?.count || 0,
        hasMoreData,
        
        // Loading states
        isLoading: notificationsQuery.isLoading && page === 1,
        isFetchingMore: notificationsQuery.isFetching && page > 1,
        isMarkingRead: markAsReadMutation.isLoading,
        isMarkingAllRead: markAllAsReadMutation.isLoading,
        
        // Error state
        error: notificationsQuery.error,
        
        // Actions
        loadMore,
        markAsRead,
        markAllAsRead,
        
        // Utilities
        refresh: () => queryClient.invalidateQueries(['notifications']),
    };
};