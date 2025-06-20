/**
 * A generic fetch function to make API calls.
 * @param {string} endpoint - The API endpoint to call.
 * @param {object} options - The fetch options including method, headers, and body.
 * @returns {Promise<any>} - The JSON response from the API.
 */
export const fetchAPI = async (endpoint, options = {}, isRequiredLoggedin = true) => {
    const { method = 'GET', headers = {}, body } = options;
    const accessToken = localStorage.getItem("access_token");
    const isFormData = body instanceof FormData;

    const defaultHeaders = {
        'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
        ...headers
    };

    if (isRequiredLoggedin) {
        defaultHeaders['Authorization'] = `Bearer ${accessToken}`;
    }

    const requestOptions = {
        method,
        headers: defaultHeaders,
        body: isFormData ? body : JSON.stringify(body),
        redirect: 'follow'
    };

    try {
        const url = new URL(endpoint);
        const response = await fetch(url, requestOptions);
        const contentType = response.headers.get('Content-Type');

        if (!response.ok) {
            let errorData = null;

            if (contentType && contentType.includes('application/json')) {
                errorData = await response.json();
            } else {
                errorData = await response.text();
            }

            if (response.status === 401) {
                localStorage.clear();
                sessionStorage.clear();
                window.location.replace("/login");
            }

            const error = new Error(errorData?.message || `HTTP error! Status: ${response.status}`);
            error.status = response.status;
            error.data = errorData;
            throw error;
        }

        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        } else {
            const text = await response.text();
            return { message: 'Non-JSON response', body: text };
        }
    } catch (error) {
        console.error('Fetch API error:', error);
        // Rethrow to propagate to useMutation
        throw error;
    }
};
