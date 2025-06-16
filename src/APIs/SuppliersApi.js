import { fetchAPI } from "./base-api";
const API_BASE_URL = process.env.REACT_APP_BACKEND_API_URL;

export const getListOfSuppliers = async (page, limit, name = "", order = "", isShowDeleted) => {
  const offset = (page - 1) * limit;
  const endpoint = `/suppliers/`;
  const options = {
    method: 'GET',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  url.searchParams.append("limit", limit);
  url.searchParams.append("offset", offset);
  if (name) url.searchParams.append("name", name);
  if (order) url.searchParams.append("ordering", order);
  if (isShowDeleted) url.searchParams.append('deleted', 1);

  return fetchAPI(url.toString(), options);
};

export const getListOfExpenses = async (page, limit, name = "", order) => {
  const offset = (page - 1) * limit;
  const endpoint = `/expenses/`;
  const options = {
    method: 'GET',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  url.searchParams.append("limit", limit);
  url.searchParams.append("offset", offset);
  if (name) url.searchParams.append("name", name);
  if (order) url.searchParams.append("ordering", order);

  return fetchAPI(url.toString(), options);
};

export const getSupplierById = async (id) => {
  const endpoint = `/suppliers/${id}/`;
  const options = {
    method: 'GET',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const getSupplierHistory = async (id, page, limit, name = "", order = "", isShowDeleted) => {
  const offset = (page - 1) * limit;
  const endpoint = `/suppliers/history/${id}/`;
  const options = {
    method: 'GET',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  url.searchParams.append("limit", limit);
  url.searchParams.append("offset", offset);
  if (name) url.searchParams.append("name", name);
  if (order) url.searchParams.append("ordering", order);
  if (isShowDeleted) url.searchParams.append('deleted', 1);

  return fetchAPI(url.toString(), options);
};

export const fetchSuppliers = async (limit, offset) => {
  const myHeaders = new Headers();
  const accessToken = localStorage.getItem("access_token");
  myHeaders.append("Authorization", `Bearer ${accessToken}`);
  myHeaders.append("Content-Type", `application/json`);

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  try {
    // Append the limit and offset parameters to the URL query string
    const url = new URL(`${API_BASE_URL}/suppliers/`);
    url.searchParams.append("limit", limit);
    url.searchParams.append("offset", offset);
    const response = await fetch(url, requestOptions);
    console.log('response: ', response);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Suppliers fetch error:', error);
    throw error;
  }
};

export const supplierstReadApi = async (id) => {
  const endpoint = `/suppliers/${id}/`;
  const options = {
    method: 'GET',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const deleteSupplier = async (id) => {
  const endpoint = `/suppliers/${id}/`;
  const options = {
    method: 'DELETE',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const restoreSupplier = async (id) => {
  const endpoint = `/suppliers/restore/${id}/`;
  const options = {
    method: 'POST'
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};