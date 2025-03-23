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