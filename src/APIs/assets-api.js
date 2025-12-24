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

export const getVehicleReminders = async () => {
    let endpoint = `/assets/vehicles/dates/`;
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
    if (search) url.searchParams.append("q", search);
    if (order) url.searchParams.append("ordering", order);
    if (isShowDeleted) {
        url.searchParams.append('is_deleted', 'true');
    }

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

export const deleteVehicle = async (id) => {
    const endpoint = `/assets/vehicles/${id}/delete/`;
    const options = {
        method: 'PATCH'
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
};

export const restoreVehicle = async (id) => {
    const endpoint = `/assets/vehicles/${id}/restore/`;
    const options = {
        method: 'PATCH'
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

export const linkExpenseToAsset = async (data) => {
    const endpoint = `/assets/types/expense-links/create/`;
    const options = {
        method: 'POST',
        body: data
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
};

export const deleteLinkedExpense = async (asset_id, asset_type_id, expense_id) => {
    const endpoint = `/assets/types/expense-links/delete/`;
    const options = {
        method: 'POST',
        body: {
            expense: expense_id,
            asset_type: asset_type_id,
            asset_id: asset_id
        }
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
};

export const getLinkedExpenses = async (asset_type = 1, asset_id, page = 1, limit = 25, order = "-id") => {
    const offset = (page - 1) * limit;
    const endpoint = `/assets/types/expense-links/`;
    const options = {
        method: 'GET'
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    url.searchParams.append("limit", limit);
    url.searchParams.append("offset", offset);
    url.searchParams.append("asset_type", asset_type);
    url.searchParams.append("asset_id", asset_id);
    if (order) url.searchParams.append("ordering", order);

    return fetchAPI(url.toString(), options);
};