import { fetchAPI } from "./base-api";
const API_BASE_URL = process.env.REACT_APP_BACKEND_API_URL;

export const getPrivilegesList = async () => {
    const endpoint = `/references/privileges/`;
    const options = {
        method: 'GET',
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
}

export const getDesktopUserList = async () => {
    const endpoint = `/desktop-users/`;
    const options = {
        method: 'GET',
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
}

export const getDesktopUserPrice = async () => {
    const endpoint = `/settings/subscriptions/business/`;
    const options = {
        method: 'GET',
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
}

export const updateUserPrice = async (data) => {
    const endpoint = `/settings/subscriptions/business/`;
    const options = {
        method: 'PUT',
        body: data
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
}

export const getDesktopUser = async (id) => {
    const endpoint = `/desktop-users/update/${id}/`;
    const options = {
        method: 'GET',
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
}

export const deleteDesktopUser = async (id) => {
    const endpoint = `/desktop-users/active/${id}/`;
    const options = {
        method: 'PUT',
        body: {is_active: false}
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
}

export const restoreDesktopUser = async (id) => {
    const endpoint = `/desktop-users/active/${id}/`;
    const options = {
        method: 'PUT',
        body: {is_active: true}
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
}

export const getMobileUserList = async () => {
    const endpoint = `/team/mobile-users/`;
    const options = {
        method: 'GET',
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
}

export const getMobileUserPrice = async () => {
    const endpoint = `/settings/subscriptions/work/`;
    const options = {
        method: 'GET',
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
}