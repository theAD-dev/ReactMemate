/**
 * Utility functions for formatting global search results
 */

/**
 * Format project data for search results display
 * @param {Object} project - Raw project data from API
 * @returns {Object} Formatted project data
 */
export const formatProjectResult = (project) => ({
    id: project.id,
    title: project.reference || project.number || `Project #${project.id}`,
    subtitle: project.number 
        ? `Number: ${project.number}` 
        : `ID: ${project.id}`,
    status: project.status,
    client: project.client?.name,
    type: 'project',
    // Keep original data for navigation
    unique_id: project.unique_id,
    reference: project.reference,
    number: project.number
});

/**
 * Format job data for search results display
 * @param {Object} job - Raw job data from API
 * @returns {Object} Formatted job data
 */
export const formatJobResult = (job) => ({
    id: job.id,
    title: job.short_description || `Job #${job.id}`,
    subtitle: job.long_description ? 
        `${job.long_description.substring(0, 50)}${job.long_description.length > 50 ? '...' : ''}` : 
        `Duration: ${job.duration || 0}h`,
    status: job.status,
    worker: job.worker?.full_name,
    type: 'job'
});

/**
 * Format task data for search results display
 * @param {Object} task - Raw task data from API
 * @returns {Object} Formatted task data
 */
export const formatTaskResult = (task) => ({
    id: task.id,
    title: task.title || `Task #${task.id}`,
    subtitle: task.description ? 
        `${task.description.substring(0, 50)}${task.description.length > 50 ? '...' : ''}` : 
        `Assigned to: ${task.assigned_to?.full_name || 'Unassigned'}`,
    status: task.finished ? 'Completed' : 'In Progress',
    priority: task.priority,
    type: 'task'
});

/**
 * Format invoice data for search results display
 * @param {Object} invoice - Raw invoice data from API
 * @returns {Object} Formatted invoice data
 */
export const formatInvoiceResult = (invoice) => ({
    id: invoice.id,
    title: invoice.invoice_number || `Invoice #${invoice.id}`,
    subtitle: `${invoice.client?.name || 'Unknown Client'} - $${invoice.total || 0}`,
    status: invoice.status,
    amount: invoice.total,
    type: 'invoice'
});

/**
 * Format supplier data for search results display
 * @param {Object} supplier - Raw supplier data from API
 * @returns {Object} Formatted supplier data
 */
export const formatSupplierResult = (supplier) => ({
    id: supplier.id,
    title: supplier.name || `Supplier #${supplier.id}`,
    subtitle: supplier.email || supplier.phone || supplier.address,
    contact: supplier.contact_person,
    type: 'supplier'
});

/**
 * Format expense data for search results display
 * @param {Object} expense - Raw expense data from API
 * @returns {Object} Formatted expense data
 */
export const formatExpenseResult = (expense) => ({
    id: expense.id,
    title: expense.description || `Expense #${expense.id}`,
    subtitle: `${expense.supplier?.name || 'Unknown Supplier'} - $${expense.amount || 0}`,
    status: expense.status,
    amount: expense.amount,
    supplier: expense.supplier?.name,
    date: expense.date,
    type: 'expense'
});

/**
 * Format client data for search results display
 * @param {Object} client - Raw client data from API
 * @returns {Object} Formatted client data
 */
export const formatClientResult = (client) => ({
    id: client.id,
    title: client.name || client.business_name || 'Unnamed Client',
    subtitle: client.email || client.phone || 'No contact info',
    email: client.email,
    phone: client.phone,
    type: client.is_business ? 'business' : 'individual',
    photo: client.photo,
    has_photo: client.has_photo,
    searchType: 'client',
    is_business: client.is_business
});

/**
 * Highlight search terms in text
 * @param {string} text - Text to highlight
 * @param {string} searchTerm - Term to highlight
 * @returns {string} Text with highlighted terms
 */
export const highlightSearchTerm = (text, searchTerm) => {
    if (!text || !searchTerm) return text;
    
    const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
};

/**
 * Escape special characters for regex
 * @param {string} string - String to escape
 * @returns {string} Escaped string
 */
const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 50) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

/**
 * Get status color class based on status
 * @param {string} status - Status value
 * @returns {string} CSS class name for status color
 */
export const getStatusColor = (status) => {
    const statusMap = {
        'active': 'success',
        'completed': 'success',
        'pending': 'warning',
        'draft': 'info',
        'cancelled': 'danger',
        'on_hold': 'secondary'
    };
    
    return statusMap[status?.toLowerCase()] || 'secondary';
};

/**
 * Format search metadata for display
 * @param {Object} item - Search result item
 * @returns {Array} Array of metadata strings
 */
export const formatSearchMetadata = (item) => {
    const metadata = [];
    
    if (item.email) metadata.push(item.email);
    if (item.phone) metadata.push(item.phone);
    if (item.client && item.searchType === 'project') metadata.push(`Client: ${item.client}`);
    
    return metadata.filter(Boolean);
};

/**
 * Generate search result key for React
 * @param {Object} item - Search result item
 * @param {string} type - Result type
 * @returns {string} Unique key
 */
export const generateSearchResultKey = (item, type) => {
    return `${type}-${item.id}-${Date.now()}`;
};