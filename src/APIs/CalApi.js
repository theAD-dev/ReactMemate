import { fetchAPI } from "./base-api";
const API_BASE_URL = 'https://dev.memate.com.au/api/v1';

export const getDepartments = async () => {
  const endpoint = `/references/calc-indexes/`;
  const options = {
    method: 'GET',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
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
  const endpoint = '/quote/merges/new/';
  const options = {
    method: 'POST',
    body: data
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
}

export const getMergeItemsByUniqueId = async (unique_id) => {
  const endpoint = `/quote/merges/${unique_id}/`;
  const options = {
    method: 'GET',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
}