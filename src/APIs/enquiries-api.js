import { fetchAPI } from "./base-api";
const API_BASE_URL = process.env.REACT_APP_BACKEND_API_URL;

export const getListOfForms = async (page, limit, search = "", order = "", isShowDeleted, organizationId) => {
  const offset = (page - 1) * limit;
  const endpoint = `/inquiries/forms/`;
  const options = {
    method: 'GET',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  url.searchParams.append("limit", limit);
  url.searchParams.append("offset", offset);
  if (organizationId) url.searchParams.append("organization", organizationId);
  if (search) url.searchParams.append("search", search);
  if (order) url.searchParams.append("ordering", order);
  if (isShowDeleted) url.searchParams.append('deleted', 1);

  return fetchAPI(url.toString(), options);
};

export const getListOfSubmissions = async (orgId, page, limit, search = "", order = "", isShowDeleted, filterType = "", formId = "", statusFilter = "") => {
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
  if (isShowDeleted) url.searchParams.append('is_deleted', true);
  if (filterType) url.searchParams.append('type', filterType);
  if (statusFilter) url.searchParams.append('status', statusFilter);

  return fetchAPI(url.toString(), options);
};

export const getEnquirySubmissionDetails = async (formId) => {
  const endpoint = `/inquiries/submission/${formId}/detail/`;
  const options = {
    method: 'GET',
  };

  return fetchAPI(`${API_BASE_URL}${endpoint}`, options);
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

export const deleteSubmission = async (submissionId) => {
  const endpoint = `/inquiries/submission/${submissionId}/delete/`;
  const options = {
    method: 'DELETE'
  };

  return fetchAPI(`${API_BASE_URL}${endpoint}`, options);
};

export const bulkDeleteSubmissions = async (ids) => {
  const endpoint = `/inquiries/submissions/bulk-delete/`;
  const options = {
    method: 'POST',
    body: { ids }
  };

  return fetchAPI(`${API_BASE_URL}${endpoint}`, options);
};

export const restoreSubmission = async (submissionId, status) => {
  const endpoint = `/inquiries/submission/${submissionId}/restore/`;
  const options = {
    method: 'POST',
    body: status !== undefined ? { status } : undefined
  };

  return fetchAPI(`${API_BASE_URL}${endpoint}`, options);
};

export const bulkRestoreSubmissions = async (ids) => {
  const endpoint = `/inquiries/submissions/bulk-restore/`;
  const options = {
    method: 'POST',
    body: { ids }
  };

  return fetchAPI(`${API_BASE_URL}${endpoint}`, options);
};
 
export const getEnquiryCounts = async (orgId) => {
  const endpoint = `/inquiries/organization/${orgId}/submissions/unread-count/`;
  const options = {
    method: 'GET',
  };

  return fetchAPI(`${API_BASE_URL}${endpoint}`, options);
};

export const getEnquiryHistory = async (submissionId) => {
  const endpoint = `/inquiries/submission/${submissionId}/history/`;
  const options = {
    method: 'GET',
  };

  return fetchAPI(`${API_BASE_URL}${endpoint}`, options);
};

export const addEnquiryNote = async (submissionId, data) => {
  const endpoint = `/inquiries/submission/${submissionId}/note/`;
  const options = {
    method: 'POST',
    body: data
  };

  return fetchAPI(`${API_BASE_URL}${endpoint}`, options);
};

export const sendEnquirySMS = async (submissionId, data) => {
  const endpoint = `/inquiries/submission/${submissionId}/sms/`;
  const options = {
    method: 'POST',
    body: data
  };

  return fetchAPI(`${API_BASE_URL}${endpoint}`, options);
};

export const sendEnquiryEmail = async (submissionId, data) => {
  data.body = data.email_body || "";
  delete data.email_body;
  
  const endpoint = `/inquiries/submission/${submissionId}/email/`;
  const options = {
    method: 'POST',
    body: data
  };

  return fetchAPI(`${API_BASE_URL}${endpoint}`, options);
};

export const linkEnquiryToSale = async (submissionId, data) => {
  const endpoint = `/inquiries/submission/${submissionId}/`;
  const options = {
    method: 'PUT',
    body: data
  };

  return fetchAPI(`${API_BASE_URL}${endpoint}`, options);
};