const API_BASE_URL = process.env.REACT_APP_BACKEND_API_URL;

/**
 * A generic fetch function with timeout and error handling.
 * @param {string} endpoint - The API endpoint.
 * @param {object} [options={}] - Fetch options (method, headers, body).
 * @param {boolean} [isRequiredLoggedin=true] - Whether authentication is required.
 * @param {number} [timeout=30000] - Timeout duration in milliseconds (default: 30s).
 * @returns {Promise<any>} - The API response.
 */
export const fetchInstance = async (path, options = {}, isRequiredLoggedin = true, timeout = 30000) => {
    const endpoint = new URL(`${API_BASE_URL}${path}`);
    const { method = 'GET', headers = {}, body } = options;
    const accessToken = localStorage.getItem("access_token");
    const isFormData = body instanceof FormData;

    // Create an AbortController to handle timeouts
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const defaultHeaders = new Headers({
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...headers
    });

    if (isRequiredLoggedin && accessToken) {
        defaultHeaders.set('Authorization', `Bearer ${accessToken}`);
    }

    const requestOptions = {
        method,
        headers: defaultHeaders,
        body: isFormData ? body : body ? JSON.stringify(body) : null,
        redirect: 'follow',
        signal: controller.signal // Attach AbortController
    };

    try {
        const response = await fetch(endpoint, requestOptions);

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`HTTP error! Status: ${response.status} - ${errorMessage}`);
        }

        const contentType = response.headers.get('Content-Type') || '';
        return contentType.includes('application/json') ? response.json() : response.text();
    } catch (error) {
        if (error.name === 'AbortError') {
            console.error('Fetch request timed out.');
            throw new Error('Request timeout. Please try again.');
        }
        console.error('Fetch API error:', error);
        throw error;
    } finally {
        clearTimeout(timeoutId);
    }
};
