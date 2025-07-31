import { fetchAPI } from "./base-api";
const API_BASE_URL = process.env.REACT_APP_BACKEND_API_URL;

export const getListOfTasks = async (page, limit, name = "", order = "", isShowDeleted = false, showNotCompleted = false) => {
    const offset = (page - 1) * limit;
    const endpoint = `/tasks/`;
    const options = {
        method: 'GET',
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    url.searchParams.append("limit", limit);
    url.searchParams.append("offset", offset);
    if (name) url.searchParams.append("name", name);
    if (order) url.searchParams.append("ordering", order);
    if (isShowDeleted) url.searchParams.append('deleted', 1);
    if (showNotCompleted) url.searchParams.append('finished', false);

    return fetchAPI(url.toString(), options);
};

export const getTask = async (id) => {
    const endpoint = `/tasks/${id}/`;
    const options = {
        method: 'GET'
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
};

export const createNewTask = async (data) => {
    const endpoint = '/tasks/new/';
    const options = {
        method: 'POST',
        body: data
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
};

export const updateTask = async (id, data) => {
    const endpoint = `/tasks/update/${id}/`;
    const options = {
        method: 'PUT',
        body: data
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
};

export const getUserList = async () => {
    const endpoint = `/desktop-users/`;
    const options = {
        method: 'GET',
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
};

export const getMobileUserList = async () => {
    const endpoint = `/team/mobile-users/`;
    const options = {
        method: 'GET',
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
};