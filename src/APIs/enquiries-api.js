import { fetchAPI } from "./base-api";
const API_BASE_URL = process.env.REACT_APP_BACKEND_API_URL;

export const getListOfForms = async (page, limit, search = "", order = "", isShowDeleted) => {
  const offset = (page - 1) * limit;
  const endpoint = `/inquiries/forms/`;
  const options = {
    method: 'GET',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  url.searchParams.append("limit", limit);
  url.searchParams.append("offset", offset);
  url.searchParams.append("organization", 5);
  if (search) url.searchParams.append("search", search);
  if (order) url.searchParams.append("ordering", order);
  if (isShowDeleted) url.searchParams.append('deleted', 1);

  return fetchAPI(url.toString(), options);
};

export const getListOfSubmissions = async (orgId, page, limit, search = "", order = "", isShowDeleted, filterType = "", formId = "") => {
  const offset = (page - 1) * limit;
  const endpoint = formId ? `/inquiries/form/${formId}/submissions/` : `/inquiries/organization/${orgId}/submissions/`;
  const options = {
    method: 'GET',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  url.searchParams.append("limit", limit);
  url.searchParams.append("offset", offset);
  if (search) url.searchParams.append("search", search);
  if (order) url.searchParams.append("ordering", order);
  if (isShowDeleted) url.searchParams.append('deleted', 1);
  if (filterType) url.searchParams.append('type', filterType);

  return fetchAPI(url.toString(), options);
};

export const createEnquirySubmission = async (formId, data) => {
  const endpoint = `/inquiries/form/${formId}/admin/submit/`;
  const options = {
    method: 'POST',
    body: data,
  };

  return fetchAPI(`${API_BASE_URL}${endpoint}`, options);
};

export const updateEnquirySubmission = async (submissionId, data) => {
  const endpoint = `/inquiries/submission/${submissionId}/`;
  const options = {
    method: 'PATCH',
    body: data,
  };

  return fetchAPI(`${API_BASE_URL}${endpoint}`, options);
};

export const deleteForm = async (formId) => {
  const endpoint = `/inquiries/form/${formId}/delete/`;
  const options = {
    method: 'PATCH',
  };

  return fetchAPI(`${API_BASE_URL}${endpoint}`, options);
};

export const deleteSubmission = async (formId, submissionId) => {
  const endpoint = `/inquiries/form/${formId}/submissions/delete/`;
  const options = {
    method: 'DELETE',
    body: { id: submissionId }
  };

  return fetchAPI(`${API_BASE_URL}${endpoint}`, options);
};
