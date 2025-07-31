import { fetchAPI } from "./base-api";
const API_BASE_URL = process.env.REACT_APP_BACKEND_API_URL;

export const getListOfJobs = async (page, limit, search = "", order = "", isShowDeleted) => {
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
    if (isShowDeleted) url.searchParams.append('deleted', 1);
    url.searchParams.append('status', '3,2,1,6,a');

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
