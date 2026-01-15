import { fetchAPI } from "../../../../APIs/base-api";
const API_BASE_URL = process.env.REACT_APP_BACKEND_API_URL;

export async function saveFormToApi(payload) {
  const endpoint = `${API_BASE_URL}/inquiries/form/`;
  const options = {
    method: 'POST',
    body: payload,
  };
  return fetchAPI(endpoint, options);
}

export async function listFormsByOrganization(orgId) {
  const url = new URL(`${API_BASE_URL}/inquiries/forms/`);
  url.searchParams.append("organization", orgId);
  const options = {
    method: 'GET',
  };
  return fetchAPI(url.toString(), options);
}

export async function getFormById(id) {
  const endpoint = `${API_BASE_URL}/inquiries/form/${id}/`;
  const options = {
    method: 'GET',
  };
  return fetchAPI(endpoint, options);
}

export async function updateFormToApi(id, payload) {
  const endpoint = `${API_BASE_URL}/inquiries/form/${id}/update/`;
  const options = {
    method: 'PATCH',
    body: payload,
  };
  return fetchAPI(endpoint, options);
}

export async function listFormSubmissions(formId, params = {}) {
  if (!formId) throw new Error('formId is required');
  
  const url = new URL(`${API_BASE_URL}/inquiries/form/${formId}/submissions/`);
  
  // Optional filters/pagination if backend supports them
  if (params.page) url.searchParams.append('page', params.page);
  if (params.page_size) url.searchParams.append('page_size', params.page_size);
  if (params.status != null) url.searchParams.append('status', params.status);
  if (params.assigned_to) url.searchParams.append('assigned_to', params.assigned_to);
  if (params.search) url.searchParams.append('search', params.search);
  if (params.ordering) url.searchParams.append('ordering', params.ordering);

  const options = {
    method: 'GET',
  };
  return fetchAPI(url.toString(), options);
}

export async function deleteForm(id) {
  const endpoint = `${API_BASE_URL}/inquiries/form/${id}/delete/`;
  const options = {
    method: 'DELETE',
  };
  return fetchAPI(endpoint, options);
}