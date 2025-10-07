import React, { useState, useRef, useCallback } from 'react';
import { Button, Dropdown } from 'react-bootstrap';
import { Bell, Check, CheckAll } from 'react-bootstrap-icons';
import clsx from 'clsx';
import { format, isToday, isYesterday, isThisWeek } from 'date-fns';
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
        refresh,
    } = useNotifications(isOpen);

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
    const formatNotificationDate = (dateString) => {
        const date = new Date(dateString);
        if (isToday(date)) {
            return format(date, 'h:mm a');
        } else if (isYesterday(date)) {
            return 'Yesterday';
        } else if (isThisWeek(date)) {
            return format(date, 'EEE');
        } else {
            return format(date, 'MMM d');
        }
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
        if (!notification.is_read) {
            markAsRead(notification.id);
        }
        // Handle navigation based on notification type
        if (notification.action_url) {
            window.location.href = notification.action_url;
        }
    };

    return (
        <Dropdown show={isOpen} onToggle={setIsOpen}>
            <Dropdown.Toggle
                as="li"
                className={clsx( 'noDropdownIcon', style.navbarActionIcon, { [style.navbarActionIconActive]: isOpen })}
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
                    {unreadCount > 0 && (
                        <button
                            className={notificationStyle.markAllBtn}
                            onClick={markAllAsRead}
                        >
                            <CheckAll size={16} />
                            Mark all read
                        </button>
                    )}
                </div>

                <div className={notificationStyle.notificationList}>
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
                    ) : notifications.length === 0 ? (
                        <div className={notificationStyle.emptyState}>
                            <Bell size={48} color="#9CA3AF" />
                            <p>No notifications yet</p>
                            <span>You're all caught up!</span>
                        </div>
                    ) : (
                        <>
                            {notifications.map((notification, index) => {
                                const isLast = index === notifications.length - 1;
                                return (
                                    <div
                                        key={notification.id}
                                        ref={isLast ? lastNotificationElementRef : null}
                                        className={`${notificationStyle.notificationItem} ${!notification.is_read ? notificationStyle.unread : ''
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
                                                    {notification.title}
                                                </p>
                                                {notification.message && (
                                                    <p className={notificationStyle.message}>
                                                        {notification.message}
                                                    </p>
                                                )}
                                            </div>
                                            <span className={notificationStyle.timestamp}>
                                                {formatNotificationDate(notification.created_at)}
                                            </span>
                                        </div>

                                        {!notification.is_read && (
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

                {notifications.length > 0 && (
                    <div className={notificationStyle.footer}>
                        <button className={notificationStyle.viewAllBtn}>
                            View all notifications
                        </button>
                    </div>
                )}
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default Notification;