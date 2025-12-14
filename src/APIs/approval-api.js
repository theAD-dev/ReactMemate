import { fetchAPI } from "./base-api";
const API_BASE_URL = process.env.REACT_APP_BACKEND_API_URL;

export const getJobsToApprove = async () => {
    const endpoint = `/jobs/to-approve/`;
    const options = {
        method: 'GET',
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
};

export const getApproveNotInvoice = async (year, week) => {
    const endpoint = `/jobs/to-invoice/${year}/${week}/`;
    const options = {
        method: 'GET',
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
};

export const getToApprovedJobsInvoice = async (year, week) => {
    const endpoint = `/jobs/to-invoice/total/${year}/${week}/`;
    const options = {
        method: 'GET',
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
};

// Timer API functions
export const getJobTimers = async (jobId) => {
    const endpoint = `/jobs/approval/timer/${jobId}/`;
    const options = {
        method: 'GET'
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
};

export const createJobTimer = async (jobId, data) => {
    const endpoint = `/jobs/approval/timer/create/${jobId}/`;
    const options = {
        method: 'POST',
        body: data,
        headers: {
            'Content-Type': 'application/json',
        }
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
};

export const updateJobTimer = async (jobId, timerId, data) => {
    const endpoint = `/jobs/${jobId}/timers/${timerId}/`;
    const options = {
        method: 'PUT',
        body: data,
        headers: {
            'Content-Type': 'application/json',
        }
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
};

export const deleteJobTimer = async (jobId, timerId) => {
    const endpoint = `/jobs/approval/timer/delete/${timerId}/`;
    const options = {
        method: 'DELETE'
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
};
