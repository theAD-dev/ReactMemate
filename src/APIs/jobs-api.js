import { fetchAPI } from "./base-api";
const API_BASE_URL = process.env.REACT_APP_BACKEND_API_URL;

export const getListOfJobs = async (page, limit, search = "", order = "", filters = {}) => {
    const offset = (page - 1) * limit;
    const endpoint = `/jobs/`;
    const options = {
        method: 'GET',
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    url.searchParams.append("limit", limit);
    url.searchParams.append("offset", offset);
    if (search) url.searchParams.append("search", search);
    if (order) url.searchParams.append("ordering", order);

    if (filters?.status?.length) {
        let statusArray = [];

        filters.status.forEach(status => {
            if (status.value === 'draft') url.searchParams.append('published', false);
            else url.searchParams.append('published', true);

            if (status.value === 'in_progress') url.searchParams.append('action_status', '1,2');
            else url.searchParams.append('action_status', '0');

            if (status.value !== 'draft' && status.value !== 'in_progress') {
                statusArray.push(status.value);
            }
        });

        if (statusArray.length) url.searchParams.append('status', statusArray.join(','));
    } else {
        url.searchParams.append('status', '3,2,1,6,a');
    }

    if (filters?.worker?.length) {
        url.searchParams.append('workers', filters.worker.map(worker => worker.id).join(','));
    }

    return fetchAPI(url.toString(), options);
};

export const createNewJob = async (data) => {
    const endpoint = '/jobs/create/';
    const options = {
        method: 'POST',
        body: data
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
};

export const getJob = async (id) => {
    const endpoint = `/jobs/${id}/`;
    const options = {
        method: 'GET'
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
};

export const getJobDashboardData = async () => {
    const endpoint = `/dashboard/`;
    const options = {
        method: 'GET'
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
};

export const updateJob = async (id, data) => {
    const endpoint = `/jobs/update/${id}/`;
    const options = {
        method: 'PUT',
        body: data
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
};

export const getApprovedJob = async (id) => {
    const endpoint = `/jobs/to-approve/${id}/`;
    const options = {
        method: 'GET'
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
};

export const createApproval = async (id, data) => {
    const endpoint = `/jobs/approve/${id}/`;
    const options = {
        method: 'POST',
        body: data
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
};

export const declineJob = async (id) => {
    const endpoint = `/jobs/${id}/rework/`;
    const options = {
        method: 'POST'
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
};

export const deleteJob = async (id) => {
    const endpoint = `/jobs/delete/${id}/`;
    const options = {
        method: 'DELETE'
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
};
