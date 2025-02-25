import { fetchAPI } from "./base-api";
const API_BASE_URL = process.env.REACT_APP_BACKEND_API_URL;

export const getInvoiceTermsapp = async () => {
  const endpoint = `/settings/app-terms/`;
  const options = {
    method: 'GET',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};
export const updateTermsapp = async (terms) => {
  const endpoint = `/settings/app-terms/`;
  const options = {
    method: 'PUT',
    body: terms,
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};



export const getInvoiceTerms = async () => {
  const endpoint = `/settings/invoice-terms/`;
  const options = {
    method: 'GET',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};
export const updateTerms = async (terms) => {
  const endpoint = `/settings/invoice-terms/`;
  const options = {
    method: 'PUT',
    body: terms,

  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};
