import { fetchAPI } from './base-api';

const BASE_URL = process.env.REACT_APP_BACKEND_API_URL;

// Get all notifications with pagination
export const getNotifications = async (limit = 20, offset = 0) => {
    const endpoint = `${BASE_URL}/notifications/?limit=${limit}&offset=${offset}`;
    return await fetchAPI(endpoint);
};

// Get unread notifications with pagination
export const getUnreadNotifications = async (limit = 20, offset = 0) => {
    const endpoint = `${BASE_URL}/notifications/unread/?limit=${limit}&offset=${offset}`;
    return await fetchAPI(endpoint);
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId) => {
    const endpoint = `${BASE_URL}/notifications/${notificationId}/`;
    return await fetchAPI(endpoint, {
        method: 'PATCH'
    });
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async () => {
    const endpoint = `${BASE_URL}/notifications/clear/`;
    return await fetchAPI(endpoint, {
        method: 'POST'
    });
};