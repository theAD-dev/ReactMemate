import { fetchAPI } from "./base-api";
const API_BASE_URL = process.env.REACT_APP_BACKEND_API_URL;

export const getAssetsTypes = async () => {
    const endpoint = `/assets/types/`;
    const options = {
        method: 'GET',
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
};

export const getListOfAssetCategories = async () => {
    const endpoint = `/assets/types/subscriptions/`;
    const options = {
        method: 'GET',
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
};

export const getListOfVehicles = async (page, limit, search = "", order = "", isShowDeleted) => {
    const offset = (page - 1) * limit;
    const endpoint = `/assets/vehicles/`;
    const options = {
        method: 'GET',
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    url.searchParams.append("limit", limit);
    url.searchParams.append("offset", offset);
    if (search) url.searchParams.append("search", search);
    if (order) url.searchParams.append("ordering", order);
    if (isShowDeleted) url.searchParams.append('deleted', 1);

    return fetchAPI(url.toString(), options);
};

export const createNewVehicle = async (data) => {
    const endpoint = '/assets/vehicles/create/';
    const options = {
        method: 'POST',
        body: data
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
};

export const getVehicle = async (id) => {
    const endpoint = `/assets/vehicles/${id}/`;
    const options = {
        method: 'GET',
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
};

export const updateVehicle = async (id, data) => {
    const endpoint = `/assets/vehicles/${id}/update/`;
    const options = {
        method: 'PUT',
        body: data
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
};

// Services API
export const getVehicleServices = async (vehicleId, page = 1, limit = 25, search = "", order = "") => {
    const offset = (page - 1) * limit;
    const endpoint = `/assets/vehicles/${vehicleId}/services/`;
    const options = {
        method: 'GET',
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    url.searchParams.append("limit", limit);
    url.searchParams.append("offset", offset);
    if (search) url.searchParams.append("search", search);
    if (order) url.searchParams.append("ordering", order);

    return fetchAPI(url.toString(), options);
};

export const createNewService = async (vehicleId, data) => {
    const endpoint = `/assets/vehicles/${vehicleId}/services/`;
    const options = {
        method: 'POST',
        body: data
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
};