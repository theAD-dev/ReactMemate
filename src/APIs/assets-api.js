import { fetchAPI } from "./base-api";
const API_BASE_URL = process.env.REACT_APP_BACKEND_API_URL;

export const getListOfVehicles = async (page, limit, search = "", order = "", isShowDeleted) => {
    const offset = (page - 1) * limit;
    const endpoint = `/vehicles/vehicles/`;
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
  const endpoint = '/vehicles/vehicles/create/';
  const options = {
    method: 'POST',
    body: data
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const getVehicle = async (id) => {
    const endpoint = `/vehicles/vehicles/${id}/`;
    const options = {
        method: 'GET',
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
};

export const updateVehicle = async (id, data) => {
    const endpoint = `/vehicles/vehicles/${id}/update/`;
    const options = {
        method: 'PUT',
        body: data
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
};