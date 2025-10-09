import { useState, useRef, useCallback } from 'react';
import { Button, Dropdown } from 'react-bootstrap';
import { Bell, Check, CheckAll } from 'react-bootstrap-icons';
import clsx from 'clsx';
import style from '../header.module.scss';
import notificationStyle from './notification.module.scss';
import { useNotifications } from '../../../hooks/use-notifications';

const Notification = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [hoveredNotification, setHoveredNotification] = useState(null);
    const observerRef = useRef(null);

    const {
        notifications,
        unreadCount,
        hasMoreData,
        isLoading,
        isFetchingMore,
        error,
        loadMore,
        markAsRead,
        markAllAsRead,
        showOnlyUnread,
        setShowOnlyUnread,
        resetNotifications,
        refresh,
    } = useNotifications(isOpen);

    // Filter notifications based on selected filter
    const filteredNotifications = showOnlyUnread
        ? notifications.filter(notification => !notification.read)
        : notifications;

    // Intersection observer for infinite scroll
    const lastNotificationElementRef = useCallback(node => {
        if (isFetchingMore) return;
        if (observerRef.current) observerRef.current.disconnect();
        observerRef.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMoreData) {
                loadMore();
            }
        });
        if (node) observerRef.current.observe(node);
    }, [isFetchingMore, hasMoreData, loadMore]);

    // Format date helper
    const formatNotificationDate = (unixTimestamp) => {
        if (!unixTimestamp) return '';
        const now = Date.now(); // Current time in milliseconds
        const then = unixTimestamp * 1000; // Convert seconds to milliseconds
        const diff = now - then;

        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const weeks = Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
        const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
        const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));

        if (seconds < 60) return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
        if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
        if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
        if (days < 7) return `${days} day${days !== 1 ? 's' : ''} ago`;
        if (weeks < 4) return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
        if (months < 12) return `${months} month${months !== 1 ? 's' : ''} ago`;
        return `${years} year${years !== 1 ? 's' : ''} ago`;
    };

    // Get notification icon based on type
    const getNotificationIcon = (type) => {
        const iconMap = {
            'invoice': '💰',
            'quote': '📋',
            'project': '📁',
            'task': '✅',
            'payment': '💳',
            'client': '👤',
            'system': '⚙️',
            'reminder': '⏰',
            'default': '🔔'
        };
        return iconMap[type] || iconMap.default;
    };

    // Handle mark as read
    const handleMarkAsRead = (notificationId, event) => {
        event.stopPropagation();
        markAsRead(notificationId);
    };

    // Handle notification click
    const handleNotificationClick = (notification) => {
        if (!notification.read) {
            markAsRead(notification.id);
        }
        // Handle navigation based on notification type and target_id
        if (notification.target_id) {
            // You can customize this navigation logic based on notification type
            // For now, we'll just log it - implement actual navigation as needed
            console.log(`Navigate to ${notification.type} with target_id: ${notification.target_id}`);
        }
    };

    return (
        <Dropdown show={isOpen} onToggle={setIsOpen}>
            <Dropdown.Toggle
                as="li"
                className={clsx('noDropdownIcon', style.navbarActionIcon, { [style.navbarActionIconActive]: isOpen })}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className={notificationStyle.bellContainer}>
                    <Bell color="#475467" size={20} />
                    {unreadCount > 0 && (
                        <span className={notificationStyle.badge}>
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                    )}
                </div>
            </Dropdown.Toggle>

            <Dropdown.Menu className={notificationStyle.notificationDropdown}>
                <div className={notificationStyle.header}>
                    <h6 className={notificationStyle.title}>Notifications</h6>
                    <div className={notificationStyle.headerActions}>
                        <div className={notificationStyle.filterButtons}>
                            <button
                                className={`${notificationStyle.filterBtn} ${!showOnlyUnread ? notificationStyle.active : ''}`}
                                onClick={() => { resetNotifications(); setShowOnlyUnread(false); }}
                            >
                                All
                            </button>
                            <button
                                className={`${notificationStyle.filterBtn} ${showOnlyUnread ? notificationStyle.active : ''}`}
                                onClick={() => { resetNotifications(); setShowOnlyUnread(true); }}
                            >
                                Unread
                            </button>
                        </div>
                        {true && (
                            <button
                                className={notificationStyle.markAllBtn}
                                onClick={markAllAsRead}
                            >
                                <CheckAll size={16} />
                                Mark all read
                            </button>
                        )}
                    </div>
                </div>

                <div className={`${notificationStyle.notificationList} `} id="notification-list">
                    {isLoading ? (
                        <div className={notificationStyle.loadingState}>
                            {[...Array(5)].map((_, index) => (
                                <div key={index} className={notificationStyle.skeletonItem}>
                                    <div className={notificationStyle.skeletonAvatar}></div>
                                    <div className={notificationStyle.skeletonContent}>
                                        <div className={notificationStyle.skeletonLine}></div>
                                        <div className={notificationStyle.skeletonLine} style={{ width: '70%' }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : error ? (
                        <div className={notificationStyle.errorState}>
                            <p>Failed to load notifications</p>
                            <Button className='solid-button' onClick={refresh}>
                                Try again
                            </Button>
                        </div>
                    ) : filteredNotifications.length === 0 ? (
                        <div className={notificationStyle.emptyState}>
                            <Bell size={48} color="#9CA3AF" />
                            <p>{showOnlyUnread ? 'No unread notifications' : 'No notifications yet'}</p>
                            <span>{showOnlyUnread ? 'All caught up!' : 'You\'re all caught up!'}</span>
                        </div>
                    ) : (
                        <>
                            {filteredNotifications.map((notification) => {
                                // Use original notifications array to determine if we should load more
                                const originalIndex = notifications.findIndex(n => n.id === notification.id);
                                const isLast = originalIndex === notifications.length - 1;
                                return (
                                    <div
                                        key={notification.id}
                                        ref={isLast ? lastNotificationElementRef : null}
                                        className={`${notificationStyle.notificationItem} ${!notification.read ? notificationStyle.unread : ''
                                            }`}
                                        onClick={() => handleNotificationClick(notification)}
                                        onMouseEnter={() => setHoveredNotification(notification.id)}
                                        onMouseLeave={() => setHoveredNotification(null)}
                                    >
                                        <div className={notificationStyle.notificationIcon}>
                                            {getNotificationIcon(notification.type)}
                                        </div>

                                        <div className={notificationStyle.notificationContent}>
                                            <div className={notificationStyle.notificationText}>
                                                <p className={notificationStyle.title}>
                                                    {notification.sub_type || `Type ${notification.type}` || 'Notification'}
                                                </p>
                                                {notification.text && (
                                                    <p className={notificationStyle.message}>
                                                        {notification.text}
                                                    </p>
                                                )}
                                            </div>
                                            <span className={notificationStyle.timestamp}>
                                                {formatNotificationDate(notification.created)}
                                            </span>
                                        </div>

                                        {!notification.read && (
                                            <div className={notificationStyle.actions}>
                                                {hoveredNotification === notification.id ? (
                                                    <button
                                                        className={notificationStyle.markReadBtn}
                                                        onClick={(e) => handleMarkAsRead(notification.id, e)}
                                                        title="Mark as read"
                                                    >
                                                        <Check size={14} />
                                                    </button>
                                                ) : (
                                                    <div className={notificationStyle.unreadDot}></div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                            {isFetchingMore && (
                                <div className={notificationStyle.loadingMore}>
                                    <div className={notificationStyle.spinner}></div>
                                    <span>Loading more...</span>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* {filteredNotifications.length > 0 && (
                    <div className={notificationStyle.footer}>
                        <button className={notificationStyle.viewAllBtn}>
                            View all notifications
                        </button>
                    </div>
                )} */}
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default Notification;