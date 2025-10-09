import { fetchAPI } from "./base-api";
const API_BASE_URL = process.env.REACT_APP_BACKEND_API_URL;

export const getSubscriptions = async () => {
    const endpoint = `/settings/subscriptions/`;
    const options = {
        method: 'GET',
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
};

export const activeWorkSubscription = async () => {
    const endpoint = `/settings/subscriptions/work/activate/`;
    const options = {
        method: 'PUT',
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
};

export const cancelWorkSubscription = async () => {
    const endpoint = `/settings/subscriptions/work/cancel/`;
    const options = {
        method: 'PUT',
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
};

export const getSubscriptionsBills = async ({ limit, offset }) => {
    const endpoint = `/settings/subscriptions/bills?limit=${limit}&offset=${offset}`;
    const options = {
        method: 'GET',
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
};

export const cancelSubscription = async () => {
    const endpoint = `/subscriptions/cancel/`;
    const options = {
        method: 'POST',
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
};

export const activeInquiriesSubscription = async () => {
    const endpoint = `/settings/subscriptions/inquiries/activate/`;
    const options = {
        method: 'PUT',
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
};

export const cancelInquiriesSubscription = async () => {
    const endpoint = `/settings/subscriptions/inquiries/cancel/`;
    const options = {
        method: 'PUT',
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
};

export const activeAssetsSubscription = async () => {
    const endpoint = `/settings/subscriptions/assets/activate/`;
    const options = {
        method: 'PUT',
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
};

export const cancelAssetsSubscription = async () => {
    const endpoint = `/settings/subscriptions/assets/cancel/`;
    const options = {
        method: 'PUT',
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
};

export const enableAssetType = async (data) => {
    const endpoint = `/assets/types/subscriptions/enable/`;
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
};

export const disableAssetType = async (data) => {
    const endpoint = `/assets/types/subscriptions/disable/`;
    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
};
