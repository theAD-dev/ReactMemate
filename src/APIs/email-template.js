import { fetchAPI } from "./base-api";
const API_BASE_URL = 'https://dev.memate.com.au/api/v1';

export const getEmailTemplates = async () => {
  const endpoint = `/settings/templates/email-templates/`;
  const options = {
    method: 'GET',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
}

export const getEmail = async (id) => {
  const endpoint = `/settings/templates/email-templates/${id}/`;
  const options = {
    method: 'GET',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
}

export const getOutgoingEmail = async () => {
  const endpoint = `/references/outgoing-email/`;
  const options = {
    method: 'GET',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
}