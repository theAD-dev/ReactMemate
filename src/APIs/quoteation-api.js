import { fetchAPI } from "./base-api";
const API_BASE_URL = process.env.REACT_APP_BACKEND_API_URL;


export const getQuoteation = async (lastId) => {
  const endpoint = `/quote/view/${lastId}/`;
  const options = {
    method: 'GET',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
}

export const quotationDecline = async (lastId) => {
  const endpoint = `/quotes/decline/${lastId}/`;
  const options = {
    method: 'POST',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
}

export const quotationAccept = async (lastId) => {
  const endpoint = `/quotes/accept/${lastId}/`;
  const options = {
    method: 'POST',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
}

export const quotationChanges = async (lastId, data) => {
  const endpoint = `/quotes/changes/${lastId}/`;
  const options = {
    method: 'PUT',
    body: data
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
}

