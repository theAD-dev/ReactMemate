

import { fetchAPI } from "./base-api";
const API_BASE_URL = process.env.REACT_APP_BACKEND_API_URL;


export const emailQuoteationApi = async (lastId) => {
    const endpoint = `/quote/view/${lastId}`;
    const options = {
      method: 'GET',
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
  }

export const emailDeclineApi = async (lastId) => {
    const endpoint = `/quote/decline/${lastId}`;
    const options = {
      method: 'POST',
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
  }

export const emailAcceptApi = async (lastId) => {
    const endpoint = `/quote/accept/${lastId}`;
    const options = {
      method: 'POST',
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
  }

export const emailChangesApi = async (lastId) => {
    const endpoint = `/quote/changes/${lastId}`;
    const options = {
      method: 'PUT',
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
  }
  
