/**
 * A generic fetch function to make API calls.
 * @param {string} endpoint - The API endpoint to call.
 * @param {object} options - The fetch options including method, headers, and body.
 * @param {boolean} isRequiredLoggedin - Whether the request requires authentication.
 * @param {boolean} isBlob - Whether to return the response as a blob.
 * @returns {Promise<any>} - The JSON response from the API.
 */
export const fetchAPI = async (endpoint, options = {}, isRequiredLoggedin = true, isBlob = false) => {
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

    if (!response.ok) {
        if (response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            window.location.replace('/login');
        }

        const contentType = response.headers.get('Content-Type');
        let errorData = {};
        if (contentType?.includes('application/json')) {
            errorData = await response.json();
        }

        throw {
            status: response.status,
            ...errorData,
        };
    }

    if (isBlob) {
        const blob = await response.blob();
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = 'download';
        if (contentDisposition) {
            const match = contentDisposition.match(/filename[^;=\n]*=(['"]?)([^'"\n]*)['"]?/);
            if (match && match[2]) filename = match[2];
        }
        return { blob, filename };
    }

    const contentType = response.headers.get('Content-Type');

    const parseBody = async () => {
        if (contentType?.includes('application/json')) {
            return await response.json();
        }
        return await response.text();
    };

    return await parseBody();
};

