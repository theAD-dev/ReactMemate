import { fetchAPI } from "./base-api";
const API_BASE_URL = process.env.REACT_APP_BACKEND_API_URL;

export const getListOfExpense = async (page, limit, name="", order="", isShowDeleted) => {
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
  if (isShowDeleted) url.searchParams.append('status', 'not_paid');

  return fetchAPI(url.toString(), options);
};

export const getXeroCodesList = async () => {
  const endpoint = `/references/xero-codes/`;
  const options = {
    method: 'GET',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const getProjectsList = async () => {
  const endpoint = `/references/projects/`;
  const options = {
    method: 'GET',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const getExpense = async (id) => {
  const endpoint = `/expenses/update/${id}/`;
  const options = {
    method: 'GET'
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const createNewExpense = async (data) => {
  const endpoint = '/expenses/new/';
  const options = {
    method: 'POST',
    body: data
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const updateExpense = async (id, data) => {
  const endpoint = `/expenses/update/${id}/`;
  const options = {
    method: 'PUT',
    body: data
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const paidExpense = async (data) => {
  const endpoint = '/expenses/paid/';
  const options = {
    method: 'POST',
    body: data
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const unpaidExpense = async (data) => {
  const endpoint = '/expenses/unpaid/';
  const options = {
    method: 'POST',
    body: data
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const sendExpenseToXeroApi = async (data) => {
  const endpoint = `/expenses/to-xero/`;
  const options = {
      method: 'PUT',
      body: data
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const deleteExpense = async (uniqueId) => {
  const endpoint = `/expenses/delete/${uniqueId}/`;
  const options = {
    method: 'DELETE'
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};
