// import { fetchAPI } from './base-api';

// const BASE_URL = process.env.REACT_APP_BACKEND_API_URL;

// Dummy notification data
const generateDummyNotifications = (page = 1, limit = 20) => {
    const types = ['invoice', 'quote', 'project', 'task', 'payment', 'client', 'system', 'reminder'];
    const titles = {
        'invoice': ['New invoice created', 'Invoice overdue', 'Invoice paid', 'Invoice sent'],
        'quote': ['Quote approved', 'Quote rejected', 'New quote request', 'Quote expires soon'],
        'project': ['Project deadline reminder', 'Project completed', 'New project assigned', 'Project milestone reached'],
        'task': ['Task completed', 'Task overdue', 'New task assigned', 'Task priority updated'],
        'payment': ['Payment received', 'Payment failed', 'Payment pending', 'Refund processed'],
        'client': ['New client registration', 'Client meeting scheduled', 'Client contract signed', 'Client feedback received'],
        'system': ['System maintenance', 'Security update', 'Backup completed', 'Performance alert'],
        'reminder': ['Meeting reminder', 'Document expires soon', 'Follow-up required', 'Anniversary notification']
    };

    const messages = {
        'invoice': ['Invoice #INV-001 has been generated for client ABC Corp', 'Invoice #INV-002 is 30 days overdue', 'Payment of $2,500 received for Invoice #INV-003', 'Invoice #INV-004 has been sent to client'],
        'quote': ['Quote #QUO-002 has been approved by XYZ Ltd', 'Quote #QUO-003 was rejected with feedback', 'New quote request from DEF Corp', 'Quote #QUO-005 expires in 3 days'],
        'project': ['Project "Website Redesign" is due tomorrow', 'Project "Mobile App" has been completed successfully', 'You have been assigned to project "E-commerce Platform"', 'Project "Dashboard" reached 50% completion'],
        'task': ['Task "Review documents" has been completed', 'Task "Client presentation" is overdue by 2 days', 'New task "Prepare proposal" assigned to you', 'Task "Bug fixes" priority changed to high'],
        'payment': ['Payment of $2,500 received from client DEF Inc', 'Payment failed for invoice #INV-006', 'Payment of $1,200 is pending approval', 'Refund of $500 has been processed'],
        'client': ['GHI Solutions has registered as a new client', 'Meeting with JKL Corp scheduled for tomorrow', 'Contract signed with MNO Ltd', 'Positive feedback received from PQR Inc'],
        'system': ['Scheduled maintenance will occur tonight at 2 AM', 'Security patch applied successfully', 'Daily backup completed at 3:00 AM', 'High CPU usage detected on server'],
        'reminder': ['Team meeting starts in 30 minutes', 'SSL certificate expires in 7 days', 'Follow up with client ABC Corp', 'Company anniversary celebration today']
    };

    const notifications = [];
    const startIndex = (page - 1) * limit;
    
    for (let i = 0; i < limit; i++) {
        const notificationIndex = startIndex + i;
        const type = types[notificationIndex % types.length];
        const titleArray = titles[type];
        const messageArray = messages[type];
        
        const hoursAgo = Math.floor(Math.random() * 168); // Random time within last week
        const createdAt = new Date(Date.now() - (hoursAgo * 60 * 60 * 1000)).toISOString();
        
        notifications.push({
            id: notificationIndex + 1,
            title: titleArray[notificationIndex % titleArray.length],
            message: messageArray[notificationIndex % messageArray.length],
            type: type,
            is_read: Math.random() > 0.4, // 60% chance of being read
            created_at: createdAt,
            action_url: `/${type}s/${notificationIndex + 1}`
        });
    }

    return notifications;
};

// Simulated delay for realistic API behavior
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Get notifications with pagination for infinite scroll
export const getNotifications = async (page = 1, limit = 20) => {
    await delay(500); // Simulate network delay
    
    const notifications = generateDummyNotifications(page, limit);
    const totalCount = 150; // Simulate total notifications count
    
    return {
        count: totalCount,
        next: page * limit < totalCount ? `page=${page + 1}` : null,
        previous: page > 1 ? `page=${page - 1}` : null,
        results: notifications
    };
    
    // TODO: Replace with actual API call later
    // const endpoint = `${BASE_URL}/notifications/?page=${page}&limit=${limit}`;
    // return await fetchAPI(endpoint);
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId) => {
    await delay(300); // Simulate network delay
    
    console.log(`Marking notification ${notificationId} as read`);
    return { success: true };
    
    // TODO: Replace with actual API call later
    // const endpoint = `${BASE_URL}/notifications/${notificationId}/mark-read/`;
    // return await fetchAPI(endpoint, {
    //     method: 'PATCH'
    // });
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async () => {
    await delay(500); // Simulate network delay
    
    console.log('Marking all notifications as read');
    return { success: true };
    
    // TODO: Replace with actual API call later
    // const endpoint = `${BASE_URL}/notifications/mark-all-read/`;
    // return await fetchAPI(endpoint, {
    //     method: 'PATCH'
    // });
};

// Get unread notification count
export const getUnreadNotificationCount = async () => {
    await delay(200); // Simulate network delay
    
    const unreadCount = Math.floor(Math.random() * 15) + 1; // Random count between 1-15
    return { count: unreadCount };
    
    // TODO: Replace with actual API call later
    // const endpoint = `${BASE_URL}/notifications/unread-count/`;
    // return await fetchAPI(endpoint);
};