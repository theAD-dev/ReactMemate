const API_BASE_URL = process.env.REACT_APP_BACKEND_API_URL;

/**
 * A generic fetch function to make API calls.
 * @param {string} endpoint - The API endpoint to call.
 * @param {object} options - The fetch options including method, headers, and body.
 * @returns {Promise<any>} - The JSON response from the API.
 */
const fetchAPI = async (endpoint, options = {}) => {
    const { method = 'GET', headers = {}, body } = options;
    const accessToken = localStorage.getItem("access_token");

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
};

export const updateProjectStatusById = async (id, data) => {
    const endpoint = `/project-card/custom-status/${id}/`;
    const options = {
        method: 'PUT',
        body: data
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
};

export const updateProjectReferenceById = async (id, data) => {
    const endpoint = `/project-card/reference/${id}/`;
    const options = {
        method: 'PUT',
        body: data
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
};

export const createProjectNoteById = async (id, data) => {
    const endpoint = `/project-card/note/${id}/`;
    const options = {
        method: 'POST',
        body: data
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
};

export const projectsToSalesUpdate = async (id) => {
    const endpoint = `/projects/back/`;
    const options = {
        method: 'PUT',
        body: { unique_id: id }
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
};

export const projectsOrderDecline = async (id) => {
    const endpoint = `/projects/decline/`;
    const options = {
        method: 'PUT',
        body: { unique_id: id }
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
};

export const projectsComplete = async (id) => {
    const endpoint = `/projects/complete/`;
    const options = {
        method: 'PUT',
        body: { unique_id: id }
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
};

export const createInvoiceById = async (id) => {
    const endpoint = `/invoices/create/${id}/`;
    const options = {
        method: 'POST'
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
};

export const createAndSendInvoiceById = async (id, data) => {
    const endpoint = `/invoices/send/${id}/`;
    const options = {
        method: 'POST',
        body: data
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
};

export const getProjectFilesById = async (id) => {
    const endpoint = `/projects/file-list/${id}/`;
    const options = {
        method: 'GET',
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
};

export const deleteFileByKey = async (id, fileKey) => {
    const endpoint = `/projects/file-delete/${id}/`;
    const options = {
        method: 'POST',
        body: { file_name: fileKey }
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
};

export const sendComposeEmail = async (id, action, data) => {
    let endpoint;
    if (action) endpoint = `/custom/email/${id}/${action}/`;
    else endpoint = `/custom/email/${id}/`;

    const options = {
        method: 'POST',
        body: data
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
};

export const sendSms = async (id, data) => {
    let endpoint = `/sms/${id}/`;
    const options = {
        method: 'POST',
        body: data
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
};

export const resendQuoteEmail = async (id, data) => {
    let endpoint = `/resend/quote/${id}/`;
    const options = {
        method: 'POST',
        body: data
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
};

export const getManagement = async () => {
    const myHeaders = new Headers();
    const accessToken = localStorage.getItem("access_token");
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
};



export const ProjectCardApi = async (uniqueId) => {
    const myHeaders = new Headers();
    const accessToken = localStorage.getItem("access_token");
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
};

export const cardScheduleUpdateApi = async (uniqueId) => {
    const myHeaders = new Headers();
    const accessToken = localStorage.getItem("access_token");
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
};

export const cardAddNoteApi = async (projectId) => {
    const myHeaders = new Headers();
    const accessToken = localStorage.getItem("access_token");
    myHeaders.append("Authorization", `Bearer ${accessToken}`);
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        redirect: "follow"
    };

    try {
        const response = await fetch(`${API_BASE_URL}/project-card/sales-note/${projectId}/`, requestOptions);
        console.log('response: ', response);
        const result = await response.text();
        console.log('result: ', result);
        return result;
    } catch (error) {
        console.error(error);
        throw error; // Rethrow the error if needed
    }
};






