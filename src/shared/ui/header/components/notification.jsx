import { useState, useRef, useCallback } from 'react';
import { Button, Dropdown } from 'react-bootstrap';
import { Bell, Check, CheckAll, Gear } from 'react-bootstrap-icons';
import clsx from 'clsx';
import briefcase from '../../../../assets/images/icon/briefcase.svg';
import calendarTick from '../../../../assets/images/icon/calendar-tick.svg';
import InvoicesIcon from '../../../../assets/images/icon/InvoicesIcon.svg';
import SalesIcon from '../../../../assets/images/icon/SalesIcon.svg';
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

    // Format date helper 09 Dec 2022 at 20:57 PM
    const formatNotificationDate = (unixTimestamp) => {
        const date = new Date(unixTimestamp * 1000);
        const options = {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        };
        return date.toLocaleString('en-AU', options).replace(',', ' at');
    };

    // Get notification icon based on type
    const getNotificationIcon = (type) => {
        switch (type) {
            case 1:
                return <img src={briefcase} alt="Job" />;
            case 2:
                return <img src={calendarTick} alt="Task" />;
            case 3:
                return <img src={SalesIcon} alt="Quote" />;
            case 4:
                return <img src={InvoicesIcon} alt="Invoices" />;
            default:
                return <Gear size={16} color='#475467' />;
        }
    };

    const getNotificationClass = (type) => {
        switch (type) {
            case 1:
                return notificationStyle.jobNotification;
            case 2:
                return notificationStyle.taskNotification;
            case 3:
                return notificationStyle.quoteNotification;
            case 4:
                return notificationStyle.invoiceNotification;
            default:
                return '';
        }
    };

    const getNotificationContent = (notification) => {
        const type = notification.type;
        const subType = notification.sub_type;

        if (type === 1) { // Jobs
            if (subType === 'accepted') {
                return (
                    <div className='d-flex justify-content-between'>
                        <div className='d-flex flex-column'>
                            <div style={{ whiteSpace: 'break-spaces' }}>
                                <span className={notificationStyle.jobAcceptedHeadingOne}>Job Accepted</span>
                            </div>
                            <p className={notificationStyle.jobAcceptedHeadingTwo}>by {notification?.worker_name}</p>
                            <p className={notificationStyle.jobAcceptedParagraph}>{notification?.reference}</p>
                        </div>
                        <div style={{ width: '32px', height: '32px' }}>
                            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="2" y="2" width="32" height="32" rx="16" fill="#DCFAE6" />
                                <rect x="2" y="2" width="32" height="32" rx="16" stroke="#ECFDF3" strokeWidth="4" />
                                <path d="M18 25C14.134 25 11 21.866 11 18C11 14.134 14.134 11 18 11C21.866 11 25 14.134 25 18C25 21.866 21.866 25 18 25ZM18 26C22.4183 26 26 22.4183 26 18C26 13.5817 22.4183 10 18 10C13.5817 10 10 13.5817 10 18C10 22.4183 13.5817 26 18 26Z" fill="#17B26A" />
                                <path d="M20.9697 14.9697C20.9626 14.9767 20.9559 14.9842 20.9498 14.9921L17.4774 19.4167L15.3839 17.3232C15.091 17.0303 14.6161 17.0303 14.3232 17.3232C14.0303 17.6161 14.0303 18.091 14.3232 18.3839L16.9697 21.0303C17.2626 21.3232 17.7374 21.3232 18.0303 21.0303C18.0368 21.0238 18.043 21.0169 18.0488 21.0097L22.041 16.0195C22.3232 15.7258 22.3196 15.259 22.0303 14.9697C21.7374 14.6768 21.2626 14.6768 20.9697 14.9697Z" fill="#17B26A" />
                            </svg>
                        </div>
                    </div>
                );
            } else if (subType === 'declined') {
                return (
                    <div className='d-flex justify-content-between'>
                        <div className='d-flex flex-column'>
                            <div style={{ whiteSpace: 'break-spaces' }}>
                                <span className={notificationStyle.jobDeclinedHeadingOne}>Job Declined</span>
                            </div>
                            <p className={notificationStyle.jobDeclinedHeadingTwo}>by {notification?.worker_name}</p>
                            <p className={notificationStyle.jobDeclinedParagraph}>{notification?.reference}</p>
                        </div>
                        <div style={{ width: '32px', height: '32px' }}>
                            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="2" y="2" width="32" height="32" rx="16" fill="#FEE4E2" />
                                <rect x="2" y="2" width="32" height="32" rx="16" stroke="#FEF3F2" strokeWidth="4" />
                                <g clipPath="url(#clip0_18079_53809)">
                                    <path d="M17.9997 15.3333V18M17.9997 20.6666H18.0063M24.6663 18C24.6663 21.6819 21.6816 24.6666 17.9997 24.6666C14.3178 24.6666 11.333 21.6819 11.333 18C11.333 14.3181 14.3178 11.3333 17.9997 11.3333C21.6816 11.3333 24.6663 14.3181 24.6663 18Z" stroke="#D92D20" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_18079_53809">
                                        <rect width="16" height="16" fill="white" transform="translate(10 10)" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </div>
                    </div>
                );
            } else if (subType === 'completed') {
                return (
                    <div className='d-flex justify-content-between'>
                        <div className='d-flex flex-column'>
                            <div style={{ whiteSpace: 'break-spaces' }}>
                                <span className={notificationStyle.jobAcceptedHeadingOne}>Job Completed</span>
                            </div>
                            <p className={notificationStyle.jobAcceptedHeadingTwo}>by {notification?.worker_name}</p>
                            <p className={notificationStyle.jobAcceptedParagraph}>{notification?.reference}</p>
                        </div>
                        <div style={{ width: '32px', height: '32px' }}>
                            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="2" y="2" width="32" height="32" rx="16" fill="#DCFAE6" />
                                <rect x="2" y="2" width="32" height="32" rx="16" stroke="#ECFDF3" strokeWidth="4" />
                                <path d="M18 25C14.134 25 11 21.866 11 18C11 14.134 14.134 11 18 11C21.866 11 25 14.134 25 18C25 21.866 21.866 25 18 25ZM18 26C22.4183 26 26 22.4183 26 18C26 13.5817 22.4183 10 18 10C13.5817 10 10 13.5817 10 18C10 22.4183 13.5817 26 18 26Z" fill="#17B26A" />
                                <path d="M20.9697 14.9697C20.9626 14.9767 20.9559 14.9842 20.9498 14.9921L17.4774 19.4167L15.3839 17.3232C15.091 17.0303 14.6161 17.0303 14.3232 17.3232C14.0303 17.6161 14.0303 18.091 14.3232 18.3839L16.9697 21.0303C17.2626 21.3232 17.7374 21.3232 18.0303 21.0303C18.0368 21.0238 18.043 21.0169 18.0488 21.0097L22.041 16.0195C22.3232 15.7258 22.3196 15.259 22.0303 14.9697C21.7374 14.6768 21.2626 14.6768 20.9697 14.9697Z" fill="#17B26A" />
                            </svg>
                        </div>
                    </div>
                );
            } else if (subType === 'approved') {
                return (
                    <div className='d-flex justify-content-between'>
                        <div className='d-flex flex-column'>
                            <div style={{ whiteSpace: 'break-spaces' }}>
                                <span className={notificationStyle.jobAcceptedHeadingOne}>Job Approved</span>
                            </div>
                            <p className={notificationStyle.jobAcceptedHeadingTwo}>by {notification?.worker_name}</p>
                            <p className={notificationStyle.jobAcceptedParagraph}>{notification?.reference}</p>
                        </div>
                        <div style={{ width: '32px', height: '32px' }}>
                            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="2" y="2" width="32" height="32" rx="16" fill="#DCFAE6" />
                                <rect x="2" y="2" width="32" height="32" rx="16" stroke="#ECFDF3" strokeWidth="4" />
                                <path d="M18 25C14.134 25 11 21.866 11 18C11 14.134 14.134 11 18 11C21.866 11 25 14.134 25 18C25 21.866 21.866 25 18 25ZM18 26C22.4183 26 26 22.4183 26 18C26 13.5817 22.4183 10 18 10C13.5817 10 10 13.5817 10 18C10 22.4183 13.5817 26 18 26Z" fill="#17B26A" />
                                <path d="M20.9697 14.9697C20.9626 14.9767 20.9559 14.9842 20.9498 14.9921L17.4774 19.4167L15.3839 17.3232C15.091 17.0303 14.6161 17.0303 14.3232 17.3232C14.0303 17.6161 14.0303 18.091 14.3232 18.3839L16.9697 21.0303C17.2626 21.3232 17.7374 21.3232 18.0303 21.0303C18.0368 21.0238 18.043 21.0169 18.0488 21.0097L22.041 16.0195C22.3232 15.7258 22.3196 15.259 22.0303 14.9697C21.7374 14.6768 21.2626 14.6768 20.9697 14.9697Z" fill="#17B26A" />
                            </svg>
                        </div>
                    </div>
                );
            }
        } else if (type === 2) { // Tasks
            if (subType === 'assigned') {
                return (
                    <div className='d-flex justify-content-between'>
                        <div className='d-flex flex-column'>
                            <div style={{ whiteSpace: 'break-spaces' }}>
                                <span className={notificationStyle.taskAssignedHeadingOne}>Task Assigned</span>
                                <span className={notificationStyle.taskAssignedHeadingTwo}> to {notification?.worker_name}</span>
                            </div>
                            <p className={notificationStyle.taskAssignedParagraph}>{notification?.title}</p>
                        </div>
                        <div style={{ width: '32px', height: '32px' }}>
                            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="2" y="2" width="32" height="32" rx="16" fill="#BAE8FF" />
                                <rect x="2" y="2" width="32" height="32" rx="16" stroke="#EBF8FF" strokeWidth="4" />
                                <path d="M22.5 26C24.433 26 26 24.433 26 22.5C26 20.567 24.433 19 22.5 19C20.567 19 19 20.567 19 22.5C19 24.433 20.567 26 22.5 26ZM23 21V22H24C24.2761 22 24.5 22.2239 24.5 22.5C24.5 22.7761 24.2761 23 24 23H23V24C23 24.2761 22.7761 24.5 22.5 24.5C22.2239 24.5 22 24.2761 22 24V23H21C20.7239 23 20.5 22.7761 20.5 22.5C20.5 22.2239 20.7239 22 21 22H22V21C22 20.7239 22.2239 20.5 22.5 20.5C22.7761 20.5 23 20.7239 23 21Z" fill="#158ECC" />
                                <path d="M21 15C21 16.6569 19.6569 18 18 18C16.3431 18 15 16.6569 15 15C15 13.3431 16.3431 12 18 12C19.6569 12 21 13.3431 21 15ZM18 17C19.1046 17 20 16.1046 20 15C20 13.8954 19.1046 13 18 13C16.8954 13 16 13.8954 16 15C16 16.1046 16.8954 17 18 17Z" fill="#158ECC" />
                                <path d="M18.2561 24C18.1431 23.6805 18.0653 23.3445 18.0271 22.9965H13C13.0014 22.7497 13.1538 22.0104 13.8321 21.3321C14.4844 20.6798 15.7109 20 18 20C18.2605 20 18.5072 20.0088 18.7409 20.0254C18.9661 19.684 19.2365 19.3752 19.5436 19.1073C19.0771 19.0382 18.564 19 18 19C13 19 12 22 12 23C12 24 13 24 13 24H18.2561Z" fill="#158ECC" />
                            </svg>
                        </div>
                    </div>
                );
            } else if (subType === 'completed') {
                return (
                    <div className='d-flex justify-content-between'>
                        <div className='d-flex flex-column'>
                            <div style={{ whiteSpace: 'break-spaces' }}>
                                <span className={notificationStyle.taskCompletedHeadingOne}>Task is Complete</span>
                                <span className={notificationStyle.taskCompletedHeadingTwo}> by {notification?.worker_name}</span>
                            </div>
                            <p className={notificationStyle.taskCompletedParagraph}>{notification?.title}</p>
                        </div>
                        <div style={{ width: '32px', height: '32px' }}>
                            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="2" y="2" width="32" height="32" rx="16" fill="#DCFAE6" />
                                <rect x="2" y="2" width="32" height="32" rx="16" stroke="#ECFDF3" strokeWidth="4" />
                                <path d="M18 25C14.134 25 11 21.866 11 18C11 14.134 14.134 11 18 11C21.866 11 25 14.134 25 18C25 21.866 21.866 25 18 25ZM18 26C22.4183 26 26 22.4183 26 18C26 13.5817 22.4183 10 18 10C13.5817 10 10 13.5817 10 18C10 22.4183 13.5817 26 18 26Z" fill="#17B26A" />
                                <path d="M20.9697 14.9697C20.9626 14.9767 20.9559 14.9842 20.9498 14.9921L17.4774 19.4167L15.3839 17.3232C15.091 17.0303 14.6161 17.0303 14.3232 17.3232C14.0303 17.6161 14.0303 18.091 14.3232 18.3839L16.9697 21.0303C17.2626 21.3232 17.7374 21.3232 18.0303 21.0303C18.0368 21.0238 18.043 21.0169 18.0488 21.0097L22.041 16.0195C22.3232 15.7258 22.3196 15.259 22.0303 14.9697C21.7374 14.6768 21.2626 14.6768 20.9697 14.9697Z" fill="#17B26A" />
                            </svg>
                        </div>
                    </div>
                );
            } else if (subType === 'due') {
                return (
                    <div className='d-flex justify-content-between'>
                        <div className='d-flex flex-column'>
                            <div style={{ whiteSpace: 'break-spaces' }}>
                                <span className={notificationStyle.taskDueHeadingOne}>Task is Due </span>
                            </div>
                            <p className={notificationStyle.taskDueParagraph}>{notification?.title}</p>
                        </div>
                        <div style={{ width: '32px', height: '32px' }}>
                            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="2" y="2" width="32" height="32" rx="16" fill="#FEF0C7" />
                                <rect x="2" y="2" width="32" height="32" rx="16" stroke="#FFFAEB" strokeWidth="4" />
                                <path d="M17.9384 12.0157C17.9558 12.006 17.9775 12 18.0015 12C18.0256 12 18.0473 12.006 18.0647 12.0157C18.0797 12.024 18.0995 12.0393 18.1194 12.0731L24.9763 23.7398C25.012 23.8005 25.0113 23.864 24.9785 23.9231C24.962 23.9528 24.9415 23.9724 24.9238 23.9833C24.909 23.9925 24.8901 24 24.8585 24H11.1446C11.113 24 11.094 23.9925 11.0793 23.9833C11.0616 23.9724 11.0411 23.9528 11.0246 23.9231C10.9918 23.864 10.9911 23.8005 11.0267 23.7398L17.8837 12.0731C17.9036 12.0393 17.9234 12.024 17.9384 12.0157ZM18.9815 11.5664C18.5376 10.8112 17.4655 10.8112 17.0216 11.5664L10.1646 23.2331C9.70759 24.0107 10.2563 25 11.1446 25H24.8585C25.7468 25 26.2955 24.0107 25.8385 23.2331L18.9815 11.5664Z" fill="#DC6803" />
                                <path d="M17.0015 22C17.0015 21.4477 17.4493 21 18.0015 21C18.5538 21 19.0015 21.4477 19.0015 22C19.0015 22.5523 18.5538 23 18.0015 23C17.4493 23 17.0015 22.5523 17.0015 22Z" fill="#DC6803" />
                                <path d="M17.0995 15.995C17.0462 15.4623 17.4646 15 18 15C18.5354 15 18.9538 15.4623 18.9005 15.995L18.5498 19.5025C18.5215 19.7849 18.2838 20 18 20C17.7162 20 17.4785 19.7849 17.4502 19.5025L17.0995 15.995Z" fill="#DC6803" />
                            </svg>
                        </div>
                    </div>
                );
            }
        } else if (type === 3) { // Quotes
            if (subType === 'accepted') {
                return (
                    <div className='d-flex justify-content-between'>
                        <div className='d-flex flex-column'>
                            <div style={{ whiteSpace: 'break-spaces' }}>
                                <span className={notificationStyle.quoteAcceptedHeadingOne}>{notification?.number} | </span>
                                <span className={notificationStyle.quoteAcceptedHeadingTwo}>Quote Accepted</span>
                            </div>
                            <p className={notificationStyle.quoteAcceptedReference}>{notification?.reference}</p>
                        </div>
                        <div style={{ width: '32px', height: '32px' }}>
                            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="2" y="2" width="32" height="32" rx="16" fill="#DCFAE6" />
                                <rect x="2" y="2" width="32" height="32" rx="16" stroke="#ECFDF3" strokeWidth="4" />
                                <path d="M18 25C14.134 25 11 21.866 11 18C11 14.134 14.134 11 18 11C21.866 11 25 14.134 25 18C25 21.866 21.866 25 18 25ZM18 26C22.4183 26 26 22.4183 26 18C26 13.5817 22.4183 10 18 10C13.5817 10 10 13.5817 10 18C10 22.4183 13.5817 26 18 26Z" fill="#079455" />
                                <path d="M20.9697 14.9697C20.9626 14.9767 20.9559 14.9842 20.9498 14.9921L17.4774 19.4167L15.3839 17.3232C15.091 17.0303 14.6161 17.0303 14.3232 17.3232C14.0303 17.6161 14.0303 18.091 14.3232 18.3839L16.9697 21.0303C17.2626 21.3232 17.7374 21.3232 18.0303 21.0303C18.0368 21.0238 18.043 21.0169 18.0488 21.0097L22.041 16.0195C22.3232 15.7258 22.3196 15.259 22.0303 14.9697C21.7374 14.6768 21.2626 14.6768 20.9697 14.9697Z" fill="#079455" />
                            </svg>
                        </div>
                    </div>
                );
            } else if (subType === 'declined') {
                return (
                    <div className='d-flex justify-content-between'>
                        <div className='d-flex flex-column'>
                            <div style={{ whiteSpace: 'break-spaces' }}>
                                <span className={notificationStyle.quoteDeclinedHeadingOne}>{notification?.number} | </span>
                                <span className={notificationStyle.quoteDeclinedHeadingTwo}>Quote Declined</span> <span className={notificationStyle.quoteDeclinedHeadingThree}>by {notification?.worker_name}</span>
                            </div>
                            <p className={notificationStyle.quoteDeclinedReference}>{notification?.reference}</p>
                        </div>
                        <div style={{ width: '32px', height: '32px' }}>
                            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="2" y="2" width="32" height="32" rx="16" fill="#FEE4E2" />
                                <rect x="2" y="2" width="32" height="32" rx="16" stroke="#FEF3F2" strokeWidth="4" />
                                <g clipPath="url(#clip0_18104_26567)">
                                    <path d="M17.9997 15.3333V18M17.9997 20.6667H18.0063M24.6663 18C24.6663 21.6819 21.6816 24.6667 17.9997 24.6667C14.3178 24.6667 11.333 21.6819 11.333 18C11.333 14.3181 14.3178 11.3333 17.9997 11.3333C21.6816 11.3333 24.6663 14.3181 24.6663 18Z" stroke="#D92D20" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_18104_26567">
                                        <rect width="16" height="16" fill="white" transform="translate(10 10)" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </div>
                    </div>
                );
            } else if (subType === 'changes') {
                return (
                    <div className='d-flex justify-content-between'>
                        <div className='d-flex flex-column'>
                            <div style={{ whiteSpace: 'break-spaces' }}>
                                <span className={notificationStyle.quoteChangesHeadingOne}>{notification?.number} | </span>
                                <span className={notificationStyle.quoteChangesHeadingTwo}>Changes Required</span>
                            </div>
                            <p className={notificationStyle.quoteChangesReference}>{notification?.reference}</p>
                        </div>
                        <div style={{ width: '32px', height: '32px' }}>
                            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="2" y="2" width="32" height="32" rx="16" fill="#FEF0C7" />
                                <rect x="2" y="2" width="32" height="32" rx="16" stroke="#FFFAEB" strokeWidth="4" />
                                <path d="M17.9384 12.0157C17.9558 12.006 17.9775 12 18.0015 12C18.0256 12 18.0473 12.006 18.0647 12.0157C18.0797 12.024 18.0995 12.0393 18.1194 12.0731L24.9763 23.7398C25.012 23.8005 25.0113 23.864 24.9785 23.9231C24.962 23.9528 24.9415 23.9724 24.9238 23.9833C24.909 23.9925 24.8901 24 24.8585 24H11.1446C11.113 24 11.094 23.9925 11.0793 23.9833C11.0616 23.9724 11.0411 23.9528 11.0246 23.9231C10.9918 23.864 10.9911 23.8005 11.0267 23.7398L17.8837 12.0731C17.9036 12.0393 17.9234 12.024 17.9384 12.0157ZM18.9815 11.5664C18.5376 10.8112 17.4655 10.8112 17.0216 11.5664L10.1646 23.2331C9.70759 24.0107 10.2563 25 11.1446 25H24.8585C25.7468 25 26.2955 24.0107 25.8385 23.2331L18.9815 11.5664Z" fill="#DC6803" />
                                <path d="M17.0015 22C17.0015 21.4477 17.4493 21 18.0015 21C18.5538 21 19.0015 21.4477 19.0015 22C19.0015 22.5523 18.5538 23 18.0015 23C17.4493 23 17.0015 22.5523 17.0015 22Z" fill="#DC6803" />
                                <path d="M17.0995 15.995C17.0462 15.4623 17.4646 15 18 15C18.5354 15 18.9538 15.4623 18.9005 15.995L18.5498 19.5025C18.5215 19.7849 18.2838 20 18 20C17.7162 20 17.4785 19.7849 17.4502 19.5025L17.0995 15.995Z" fill="#DC6803" />
                            </svg>
                        </div>
                    </div>
                );
            }
        } else if (type === 4) { // Invoices
            if (subType === 'created') {
                return (
                    <div className='d-flex justify-content-between'>
                        <div className='d-flex flex-column'>
                            <p className={notificationStyle.invoiceCreatedHeadingOne}>Invoice Created</p>
                            <p className={notificationStyle.invoiceCreatedHeadingTwo}>{notification?.number}</p>
                            <p className={notificationStyle.invoiceCreatedReference}>{notification?.reference}</p>
                        </div>
                        <div style={{ width: '32px', height: '32px' }}>
                            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="2" y="2" width="32" height="32" rx="16" fill="#DCFAE6" />
                                <rect x="2" y="2" width="32" height="32" rx="16" stroke="#ECFDF3" strokeWidth="4" />
                                <path d="M18 10C17.8243 10 17.6498 10.0057 17.4768 10.0169L17.5413 11.0148C17.6928 11.005 17.8458 11 18 11C18.1542 11 18.3072 11.005 18.4587 11.0148L18.5232 10.0169C18.3502 10.0057 18.1757 10 18 10Z" fill="#17B26A" />
                                <path d="M16.4393 10.1523C16.0936 10.2207 15.7558 10.3113 15.4276 10.4227L15.749 11.3696C16.0359 11.2723 16.3311 11.193 16.6333 11.1332L16.4393 10.1523Z" fill="#17B26A" />
                                <path d="M20.5724 10.4227C20.2442 10.3113 19.9064 10.2207 19.5608 10.1523L19.3667 11.1332C19.6689 11.193 19.9642 11.2723 20.251 11.3696L20.5724 10.4227Z" fill="#17B26A" />
                                <path d="M22.4453 11.3478C22.1561 11.1542 21.8536 10.9789 21.5394 10.8237L21.0964 11.7202C21.3712 11.856 21.6359 12.0093 21.889 12.1787L22.4453 11.3478Z" fill="#17B26A" />
                                <path d="M14.4606 10.8237C14.1464 10.9789 13.8439 11.1542 13.5547 11.3478L14.111 12.1787C14.3641 12.0093 14.6288 11.856 14.9036 11.7202L14.4606 10.8237Z" fill="#17B26A" />
                                <path d="M12.725 11.9853C12.4627 12.2156 12.2156 12.4627 11.9853 12.725L12.7369 13.3847C12.9385 13.155 13.155 12.9385 13.3847 12.7369L12.725 11.9853Z" fill="#17B26A" />
                                <path d="M24.0147 12.725C23.7844 12.4627 23.5373 12.2156 23.275 11.9853L22.6153 12.7369C22.845 12.9385 23.0615 13.155 23.2631 13.3847L24.0147 12.725Z" fill="#17B26A" />
                                <path d="M25.1763 14.4606C25.0211 14.1464 24.8458 13.8439 24.6522 13.5547L23.8213 14.111C23.9907 14.3641 24.144 14.6288 24.2798 14.9036L25.1763 14.4606Z" fill="#17B26A" />
                                <path d="M11.3478 13.5547C11.1542 13.8439 10.9789 14.1464 10.8237 14.4606L11.7202 14.9036C11.856 14.6288 12.0093 14.3641 12.1787 14.111L11.3478 13.5547Z" fill="#17B26A" />
                                <path d="M10.4227 15.4276C10.3113 15.7558 10.2207 16.0936 10.1523 16.4392L11.1332 16.6333C11.193 16.3311 11.2723 16.0359 11.3696 15.749L10.4227 15.4276Z" fill="#17B26A" />
                                <path d="M25.8477 16.4393C25.7793 16.0936 25.6887 15.7558 25.5773 15.4276L24.6304 15.749C24.7277 16.0359 24.807 16.3311 24.8668 16.6333L25.8477 16.4393Z" fill="#17B26A" />
                                <path d="M10.0169 17.4768C10.0057 17.6498 10 17.8243 10 18C10 18.1757 10.0057 18.3502 10.0169 18.5232L11.0148 18.4587C11.005 18.3072 11 18.1542 11 18C11 17.8458 11.005 17.6928 11.0148 17.5413L10.0169 17.4768Z" fill="#17B26A" />
                                <path d="M26 18C26 17.8243 25.9943 17.6498 25.9831 17.4768L24.9852 17.5413C24.995 17.6928 25 17.8458 25 18C25 18.1542 24.995 18.3072 24.9852 18.4587L25.9831 18.5232C25.9943 18.3502 26 18.1757 26 18Z" fill="#17B26A" />
                                <path d="M10.1523 19.5608C10.2207 19.9064 10.3113 20.2442 10.4227 20.5724L11.3696 20.251C11.2723 19.9641 11.193 19.6689 11.1332 19.3667L10.1523 19.5608Z" fill="#17B26A" />
                                <path d="M25.5773 20.5724C25.6887 20.2442 25.7793 19.9064 25.8477 19.5608L24.8668 19.3667C24.807 19.6689 24.7277 19.9642 24.6304 20.251L25.5773 20.5724Z" fill="#17B26A" />
                                <path d="M10.8237 21.5394C10.9789 21.8536 11.1542 22.1561 11.3478 22.4453L12.1787 21.889C12.0093 21.6359 11.856 21.3712 11.7202 21.0964L10.8237 21.5394Z" fill="#17B26A" />
                                <path d="M24.6522 22.4453C24.8458 22.1561 25.0211 21.8536 25.1763 21.5394L24.2798 21.0964C24.144 21.3712 23.9907 21.6359 23.8213 21.889L24.6522 22.4453Z" fill="#17B26A" />
                                <path d="M11.9853 23.275C12.2156 23.5373 12.4627 23.7844 12.725 24.0147L13.3847 23.2631C13.155 23.0615 12.9385 22.845 12.7369 22.6153L11.9853 23.275Z" fill="#17B26A" />
                                <path d="M23.275 24.0147C23.5373 23.7844 23.7844 23.5373 24.0147 23.275L23.2631 22.6153C23.0615 22.845 22.845 23.0615 22.6153 23.2631L23.275 24.0147Z" fill="#17B26A" />
                                <path d="M21.5394 25.1763C21.8536 25.0211 22.1561 24.8458 22.4453 24.6522L21.889 23.8213C21.6359 23.9907 21.3712 24.144 21.0964 24.2798L21.5394 25.1763Z" fill="#17B26A" />
                                <path d="M13.5547 24.6522C13.8439 24.8458 14.1464 25.0211 14.4606 25.1763L14.9036 24.2798C14.6288 24.144 14.3641 23.9907 14.111 23.8213L13.5547 24.6522Z" fill="#17B26A" />
                                <path d="M15.4276 25.5773C15.7558 25.6887 16.0936 25.7793 16.4392 25.8477L16.6333 24.8668C16.3311 24.807 16.0359 24.7277 15.749 24.6304L15.4276 25.5773Z" fill="#17B26A" />
                                <path d="M19.5608 25.8477C19.9064 25.7793 20.2442 25.6887 20.5724 25.5773L20.251 24.6304C19.9641 24.7277 19.6689 24.807 19.3667 24.8668L19.5608 25.8477Z" fill="#17B26A" />
                                <path d="M17.4768 25.9831C17.6498 25.9943 17.8243 26 18 26C18.1757 26 18.3502 25.9943 18.5232 25.9831L18.4587 24.9852C18.3072 24.995 18.1542 25 18 25C17.8458 25 17.6928 24.995 17.5413 24.9852L17.4768 25.9831Z" fill="#17B26A" />
                                <path d="M18.5 14.5C18.5 14.2239 18.2761 14 18 14C17.7239 14 17.5 14.2239 17.5 14.5V17.5H14.5C14.2239 17.5 14 17.7239 14 18C14 18.2761 14.2239 18.5 14.5 18.5H17.5V21.5C17.5 21.7761 17.7239 22 18 22C18.2761 22 18.5 21.7761 18.5 21.5V18.5H21.5C21.7761 18.5 22 18.2761 22 18C22 17.7239 21.7761 17.5 21.5 17.5H18.5V14.5Z" fill="#17B26A" />
                            </svg>
                        </div>
                    </div>
                );
            } else if (subType === 'paid') {
                return (
                    <div className='d-flex justify-content-between'>
                        <div className='d-flex flex-column'>
                            <p className={notificationStyle.invoicePaidHeadingOne}>Invoice Paid</p>
                            <p className={notificationStyle.invoicePaidHeadingTwo}>{notification?.number}</p>
                            <p className={notificationStyle.invoicePaidReference}>{notification?.reference}</p>
                        </div>
                        <div style={{ width: '32px', height: '32px' }}>
                            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="2" y="2" width="32" height="32" rx="16" fill="#DCFAE6" />
                                <rect x="2" y="2" width="32" height="32" rx="16" stroke="#ECFDF3" strokeWidth="4" />
                                <path d="M14 20.7813C14.1478 22.4484 15.5129 23.6306 17.5911 23.7837V25H18.6345V23.7837C20.9039 23.6051 22.3125 22.3463 22.3125 20.4836C22.3125 18.8931 21.3647 17.9745 19.3562 17.4556L18.6345 17.2685V13.4666C19.7561 13.5772 20.5126 14.181 20.7039 15.0826H22.1734C22.0082 13.4836 20.6343 12.3354 18.6345 12.2078V11H17.5911V12.2333C15.6521 12.4629 14.3217 13.7047 14.3217 15.3888C14.3217 16.8433 15.2869 17.8724 16.9824 18.3062L17.5911 18.4678V22.4994C16.4433 22.3293 15.6521 21.6999 15.4608 20.7813H14ZM17.3911 16.9453C16.3477 16.6817 15.7912 16.1203 15.7912 15.3293C15.7912 14.3852 16.4955 13.6877 17.5911 13.5006V16.9964L17.3911 16.9453ZM18.9823 18.8165C20.2692 19.1397 20.8343 19.6756 20.8343 20.5857C20.8343 21.6829 20.0083 22.4143 18.6345 22.5249V18.7315L18.9823 18.8165Z" fill="#079455" />
                            </svg>
                        </div>
                    </div>
                );
            } else if (subType === 'canceled') {
                return (
                    <div className='d-flex justify-content-between'>
                        <div className='d-flex flex-column'>
                            <p className={notificationStyle.invoiceCanceledHeadingOne}>Invoice Canceled</p>
                            <p className={notificationStyle.invoiceCanceledHeadingTwo}>{notification?.number}</p>
                            <p className={notificationStyle.invoiceCanceledReference}>{notification?.reference}</p>
                        </div>
                        <div style={{ width: '32px', height: '32px' }}>
                            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="2" y="2" width="32" height="32" rx="16" fill="#FEE4E2" />
                                <rect x="2" y="2" width="32" height="32" rx="16" stroke="#FEF3F2" strokeWidth="4" />
                                <g clipPath="url(#clip0_18104_30741)">
                                    <path d="M17.9997 15.3333V18M17.9997 20.6666H18.0063M24.6663 18C24.6663 21.6819 21.6816 24.6666 17.9997 24.6666C14.3178 24.6666 11.333 21.6819 11.333 18C11.333 14.3181 14.3178 11.3333 17.9997 11.3333C21.6816 11.3333 24.6663 14.3181 24.6663 18Z" stroke="#D92D20" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_18104_30741">
                                        <rect width="16" height="16" fill="white" transform="translate(10 10)" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </div>
                    </div>
                );
            } else if (subType === 'deleted') {
                return (
                    <div className='d-flex justify-content-between'>
                        <div className='d-flex flex-column'>
                            <p className={notificationStyle.invoiceDeletedHeadingOne}>Invoice Deleted</p>
                            <p className={notificationStyle.invoiceDeletedHeadingTwo}>{notification?.number}</p>
                            <p className={notificationStyle.invoiceDeletedReference}>{notification?.reference}</p>
                        </div>
                        <div style={{ width: '32px', height: '32px' }}>
                            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="2" y="2" width="32" height="32" rx="16" fill="#FEE4E2" />
                                <rect x="2" y="2" width="32" height="32" rx="16" stroke="#FEF3F2" strokeWidth="4" />
                                <g clipPath="url(#clip0_18104_30741)">
                                    <path d="M17.9997 15.3333V18M17.9997 20.6666H18.0063M24.6663 18C24.6663 21.6819 21.6816 24.6666 17.9997 24.6666C14.3178 24.6666 11.333 21.6819 11.333 18C11.333 14.3181 14.3178 11.3333 17.9997 11.3333C21.6816 11.3333 24.6663 14.3181 24.6663 18Z" stroke="#D92D20" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_18104_30741">
                                        <rect width="16" height="16" fill="white" transform="translate(10 10)" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </div>
                    </div>
                );
            }
        } else {
            return (
                <div className='d-flex justify-content-between'>
                    <div className='d-flex flex-column'>
                        <h1>
                            <span className={notificationStyle.jobAcceptedHeadingOne}>{notification.text}</span>
                        </h1>
                    </div>
                    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="2" y="2" width="32" height="32" rx="16" fill="#BAE8FF" />
                        <rect x="2" y="2" width="32" height="32" rx="16" stroke="#EBF8FF" strokeWidth="4" />
                        <path d="M18 26C19.1046 26 20 25.1046 20 24H16C16 25.1046 16.8954 26 18 26Z" fill="#1AB2FF" />
                        <path d="M18 11.9182L17.2028 12.0793C15.3755 12.4483 14 14.0646 14 16C14 16.6278 13.8657 18.1972 13.5412 19.7422C13.3801 20.5091 13.1645 21.3076 12.8781 22H23.1219C22.8355 21.3076 22.62 20.5091 22.4589 19.7422C22.1344 18.1972 22 16.6278 22 16C22 14.0646 20.6245 12.4483 18.7972 12.0792L18 11.9182ZM24.2193 22C24.4426 22.4474 24.7015 22.801 25 23H11C11.2985 22.801 11.5574 22.4474 11.7807 22C12.6792 20.1994 13 16.8792 13 16C13 13.5793 14.7202 11.5604 17.0048 11.099C17.0016 11.0665 17 11.0334 17 11C17 10.4477 17.4477 10 18 10C18.5523 10 19 10.4477 19 11C19 11.0334 18.9984 11.0665 18.9952 11.099C21.2798 11.5604 23 13.5793 23 16C23 16.8792 23.3208 20.1994 24.2193 22Z" fill="#1AB2FF" />
                    </svg>
                </div>
            );
        }
    };

    // Handle mark as read
    const handleMarkAsRead = (notificationId, event) => {
        event.stopPropagation();
        markAsRead(notificationId);
    };

    // Handle notification click
    const handleNotificationClick = (notification) => {
        console.log('handleNotificationClick: ', notification);
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
                            {/* <span>{showOnlyUnread ? 'All caught up!' : 'You\'re all caught up!'}</span> */}
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
                                        <div className={clsx(notificationStyle.notificationIcon, getNotificationClass(notification.type))}>
                                            {getNotificationIcon(notification.type)}
                                        </div>

                                        <div className={notificationStyle.notificationContent}>
                                            <div className={notificationStyle.notificationText}>
                                                {getNotificationContent(notification)}
                                            </div>
                                            <span className={notificationStyle.timestamp}>
                                                {formatNotificationDate(notification.created)}
                                            </span>
                                        </div>

                                        <div className={notificationStyle.actions}>
                                            {!notification.read && (
                                                <>
                                                    {hoveredNotification === notification.id ? (
                                                        <button
                                                            className={notificationStyle.markReadBtn}
                                                            onClick={(e) => handleMarkAsRead(notification.id, e)}
                                                            title="Mark as read"
                                                        >
                                                            <Check size={16} color='#D92D20' />
                                                        </button>
                                                    ) : (
                                                        <div className={notificationStyle.unreadDot}></div>
                                                    )}
                                                </>
                                            )}
                                        </div>
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
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default Notification;