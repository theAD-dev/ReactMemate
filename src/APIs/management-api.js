const API_BASE_URL = 'https://dev.memate.com.au/api/v1';

/**
 * A generic fetch function to make API calls.
 * @param {string} endpoint - The API endpoint to call.
 * @param {object} options - The fetch options including method, headers, and body.
 * @returns {Promise<any>} - The JSON response from the API.
 */
const fetchAPI = async (endpoint, options = {}) => {
    const { method = 'GET', headers = {}, body } = options;
    const accessToken = sessionStorage.getItem("access_token");

    const defaultHeaders = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        ...headers
    };

    const requestOptions = {
        method,
        headers: defaultHeaders,
        body: JSON.stringify(body),
        redirect: 'follow'
    };

    try {
        const url = new URL(`${endpoint}`);
        const response = await fetch(url, requestOptions);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const contentType = response.headers.get('Content-Type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        } else {
            // Handle non-JSON responses
            const text = await response.text();
            return { message: 'Non-JSON response', body: text };
        }

    } catch (error) {
        console.error('Fetch API error:', error);
        throw error;
    }
};


export const updateProjectScheduleById = async (id, data) => {
    const endpoint = `/project-card/schedule/${id}/`;
    const options = {
        method: 'PUT',
        body: data
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
}

export const updateProjectStatusById = async (id, data) => {
    const endpoint = `/project-card/custom-status/${id}/`;
    const options = {
        method: 'PUT',
        body: data
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
}

export const updateProjectReferenceById = async (id, data) => {
    const endpoint = `/project-card/reference/${id}/`;
    const options = {
        method: 'PUT',
        body: data
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
}

export const updateProjectSalesoteById = async (id, data) => {
    const endpoint = `/project-card/sales-note/${id}/`;
    const options = {
        method: 'PUT',
        body: data
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
}

export const getManagement = async () => {
    const myHeaders = new Headers();
    const accessToken = sessionStorage.getItem("access_token");
    myHeaders.append("Authorization", `Bearer ${accessToken}`);
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    try {
        const response = await fetch(`${API_BASE_URL}/management/`, requestOptions);
        const result = await response.json();
        return result; // Return the result if needed
    } catch (error) {
        console.error(error);
        throw error; // Rethrow the error if needed
    }
}



export const ProjectCardApi = async (uniqueId) => {
    const myHeaders = new Headers();
    const accessToken = sessionStorage.getItem("access_token");
    myHeaders.append("Authorization", `Bearer ${accessToken}`);
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    try {
        const response = await fetch(`${API_BASE_URL}/project-card/${uniqueId}/`, requestOptions);
        const result = await response.json();
        return result; // Return the result if needed
    } catch (error) {
        console.error(error);
        throw error; // Rethrow the error if needed
    }
}

export const cardScheduleUpdateApi = async (uniqueId) => {
    const myHeaders = new Headers();
    const accessToken = sessionStorage.getItem("access_token");
    myHeaders.append("Authorization", `Bearer ${accessToken}`);
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        redirect: "follow"
    };

    try {
        const response = await fetch(`${API_BASE_URL}/project-card/schedule/${uniqueId}/`, requestOptions);
        console.log('response: ', response);
        const result = await response.text();
        return result;
    } catch (error) {
        console.error(error);
        throw error; // Rethrow the error if needed
    }
}




