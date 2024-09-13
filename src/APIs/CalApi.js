import { fetchAPI } from "./base-api";
const API_BASE_URL = 'https://dev.memate.com.au/api/v1';

export const getDepartments = async (all) => {
  const endpoint = `/references/calc-indexes/`;
  const options = {
    method: 'GET',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  if (all === 1) url.searchParams.append('all', 1);
  
  return fetchAPI(url.toString(), options);
}

export const getCalculationByReferenceId = async (id) => {
  const endpoint = `/references/calculators/${id}/`;
  const options = {
    method: 'GET',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
}

export const getQuoteByUniqueId = async (unique_id) => {
  const endpoint = `/projects/${unique_id}/`;
  const options = {
    method: 'GET',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
}

export const createNewCalculationQuoteRequest = async (data) => {
  const endpoint = '/sales/new-request/';
  const options = {
    method: 'POST',
    body: data
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
}

export const createNewMergeQuote = async (data) => {
  const endpoint = '/projects/merges/new/';
  const options = {
    method: 'POST',
    body: data
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
}

export const deleteMergeQuote = async (id) => {
  const endpoint = `/projects/merges/${id}/delete/`;
  const options = {
    method: 'DELETE',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
}

export const getMergeItemsByUniqueId = async (unique_id) => {
  const endpoint = `/projects/merges/${unique_id}/`;
  const options = {
    method: 'GET',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
}

export const createDepartment = async (data) => {
  const endpoint = '/settings/departments/';
  const options = {
    method: 'POST',
    body: data
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
}

export const updateDepartment = async (id, data) => {
  if (!id) return;

  const endpoint = `/settings/departments/update/${id}/`;
  const options = {
    method: 'PUT',
    body: data
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
}

export const createSubDepartment = async (data) => {
  const endpoint = '/settings/sub-departments/';
  const options = {
    method: 'POST',
    body: data
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
}

export const updateSubDepartment = async (id, data) => {
  if (!id) return;

  const endpoint = `/settings/sub-departments/update/${id}/`;
  const options = {
    method: 'PUT',
    body: data
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
}

export const createCalculator = async (index, data) => {
  const endpoint = `/references/calculators/${index}/new/`;
  const options = {
    method: 'POST',
    body: data
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
}

export const updateCalculator = async (index, id, data) => {
  const endpoint = `/references/calculators/${index}/update/${id}/`;
  const options = {
    method: 'PUT',
    body: data
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
}
