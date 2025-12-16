import { fetchAPI } from "./base-api";
const API_BASE_URL = process.env.REACT_APP_BACKEND_API_URL;

export const getListOfTasks = async (page, limit, search = "", order = "", isShowDeleted = false, showNotCompleted = false, userId) => {
    const offset = (page - 1) * limit;
    const endpoint = `/tasks/`;
    const options = {
        method: 'GET',
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    url.searchParams.append("limit", limit);
    url.searchParams.append("offset", offset);
    if (search) url.searchParams.append("search", search);
    if (order) url.searchParams.append("ordering", order);
    if (isShowDeleted) url.searchParams.append('deleted', 1);
    if (showNotCompleted === true) url.searchParams.append('finished', false);
    if (showNotCompleted === false) url.searchParams.append('finished', true);
    if (userId) url.searchParams.append('users', userId);

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

export const getCommentsForTask = async (taskId) => {
    const endpoint = `/tasks/${taskId}/comments/`;
    const options = {
        method: 'GET',
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
};

export const createTaskComment = async (taskId, payload) => {
    const endpoint = `/tasks/${taskId}/comments/`;
    const url = new URL(`${API_BASE_URL}${endpoint}`);

    return fetchAPI(url.toString(), {
        method: 'POST',
        body: payload,
    });
};

export const deleteTaskComment = async (commentId) => {
    const endpoint = `/tasks/comments/${commentId}/`;
    const url = new URL(`${API_BASE_URL}${endpoint}`);

    return fetchAPI(url.toString(), {
        method: 'DELETE',
    });
};