import { fetchAPI } from "./base-api";
const API_BASE_URL = process.env.REACT_APP_BACKEND_API_URL;

export const getIndustriesList = async () => {
  const endpoint = `/references/clients/industries/`;
  const options = {
    method: 'GET',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const newIndustries = async (data) => {
  const endpoint = '/references/clients/industries/';
  const options = {
    method: 'POST',
    body: data
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const readIndustry = async (id) => {
  const endpoint = `/references/clients/industries/${id}/`;
  const options = {
    method: 'GET'
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const updateIndustry = async (id, data) => {
  const endpoint = `/references/clients/industries/${id}/`;
  const options = {
    method: 'PUT',
    body: data
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const deleteIndustry = async (id, data) => {
  const endpoint = `/references/clients/industries/${id}/`;
  const options = {
    method: 'DELETE',
    body: data

  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const getCategoriesList = async () => {
  const endpoint = `/references/clients/categories/`;
  const options = {
    method: 'GET',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const newCategories = async (data) => {
  const endpoint = '/references/clients/categories/';
  const options = {
    method: 'POST',
    body: data
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const readCategories = async (id) => {
  const endpoint = `/references/clients/categories/${id}/`;
  const options = {
    method: 'GET',

  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const updateCategories = async (id, data) => {
  const endpoint = `/references/clients/categories/${id}/`;
  const options = {
    method: 'PUT',
    body: data

  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const deleteCategories = async (id, data) => {
  const endpoint = `/references/clients/categories/${id}/`;
  const options = {
    method: 'DELETE',
    body: data
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};