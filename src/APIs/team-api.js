import { fetchAPI } from "./base-api";
const API_BASE_URL = process.env.REACT_APP_BACKEND_API_URL;

export const getTeamMobileUser = async () => {
    const endpoint = `/team/mobile-users/`;
    const options = {
        method: 'GET',
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
};

export const getTeamDesktopUser = async () => {
    const endpoint = `/users/desktop-users/`;
    const options = {
        method: 'GET',
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
};

export const getTeamInvoiceHistory = async (id, page, limit, search = "", order = "") => {
    if (!id || !page || !limit) return;
    
    const offset = (page - 1) * limit;
    const endpoint = `/team/mobile-users/${id}/invoices/`;
    const options = {
        method: 'GET',
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    url.searchParams.append("limit", limit);
    url.searchParams.append("offset", offset);
    if (search) url.searchParams.append("number", search);
    // if (order) url.searchParams.append("ordering", order);

    return fetchAPI(url.toString(), options);
};

export const updateMobileUser = async (id, data) => {
    const endpoint = `/team/mobile-users/${id}/`;
    const options = {
        method: 'PUT',
        body: data
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
};
