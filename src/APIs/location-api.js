import { fetchAPI } from "./base-api";
const API_BASE_URL = process.env.REACT_APP_BACKEND_API_URL;

export const getLocationList = async () => {
  const endpoint = `/locations/`;
  const options = {
    method: 'GET',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const getLocation = async (id) => {
  const endpoint = `/locations/${id}`;
  const options = {
    method: 'GET',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const createLocation = async (data) => {
  const endpoint = '/locations/new/';
  const options = {
    method: 'POST',
    body: data
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const updateLocation = async (id, data) => {
  if(!id) throw new Error("No id found");

  const endpoint = `/locations/${id}/update/`;
  const options = {
    method: 'PUT',
    body: data
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const deleteLocation = async (id) => {
  const endpoint = `/locations/${id}/delete/`;
  const options = {
    method: 'DELETE',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const getDesktopUserList = async () => {
  const endpoint = `/references/desktop-users/`;
  const options = {
    method: 'GET',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const userAssigned = async (locationId, userId) => {
  const endpoint = `/locations/${locationId}/${userId}/assign-user/`;
  const options = {
    method: 'POST',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const userUnassigned = async (locationId, userId) => {
  if (!locationId) throw new Error("Location id not found");
  if (!userId) throw new Error("User id not found");

  const endpoint = `/locations/${locationId}/${userId}/unassign-user/`;
  const options = {
    method: 'POST',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};