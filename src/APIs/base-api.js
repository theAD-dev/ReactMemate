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
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...headers,
    };

    if (isRequiredLoggedin && accessToken) {
        defaultHeaders['Authorization'] = `Bearer ${accessToken}`;
    }

    const requestOptions = {
        method,
        headers: defaultHeaders,
        body: isFormData ? body : body ? JSON.stringify(body) : undefined,
    };

    const response = await fetch(endpoint, requestOptions);
    const contentType = response.headers.get('Content-Type');

    const parseBody = async () => {
        if (contentType?.includes('application/json')) {
            return await response.json();
        }
        return await response.text();
    };

    const responseData = await parseBody();

    if (!response.ok) {
        if (response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            window.location.replace('/login');
        }

        throw {
            status: response.status,
            ...responseData,
        };
    }

    return responseData;
};

