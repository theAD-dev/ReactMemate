/**
 * A generic fetch function to make API calls.
 * @param {string} endpoint - The API endpoint to call.
 * @param {object} options - The fetch options including method, headers, and body.
 * @returns {Promise<any>} - The JSON response from the API.
 */
export const fetchAPI = async (endpoint, options = {}) => {
    const { method = 'GET', headers = {}, body } = options;
    const accessToken = localStorage.getItem("access_token");
    const isFormData = body instanceof FormData;

    const defaultHeaders = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
        ...headers
    };

    const requestOptions = {
        method,
        headers: defaultHeaders,
        body: isFormData ? body : JSON.stringify(body),
        redirect: 'follow'
    };

    try {
        const url = new URL(`${endpoint}`);
        const response = await fetch(url, requestOptions);
        if (!response.ok) {
            if (response.status === 404) throw new Error('Not found');
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const contentType = response.headers.get('Content-Type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        } else {
            const text = await response.text();
            return { message: 'Non-JSON response', body: text };
        }
    } catch (error) {
        console.error('Fetch API error:', error);
        throw error;
    }
};

