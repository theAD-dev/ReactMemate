import { fetchAPI } from "./base-api";
const API_BASE_URL = process.env.REACT_APP_BACKEND_API_URL;

export const getJobTemplates = async () => {
  const endpoint = `/jobs/templates/`;
  const options = {
    method: 'GET',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const getJobTemplate = async (id) => {
  const endpoint = `/jobs/templates/${id}/`;
  const options = {
    method: 'GET',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const createJobTemplate = async (data) => {
  const endpoint = `/jobs/templates/`;
  const options = {
    method: 'POST',
    body: data
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const updateJobTemplate = async (id, data) => {
  const endpoint = `/jobs/templates/${id}/`;
  const options = {
    method: 'PUT',
    body: data
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const deleteJobTemplate = async (id) => {
  const endpoint = `/jobs/templates/${id}/`;
  const options = {
    method: 'DELETE',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const getEmailTemplates = async () => {
  const endpoint = `/settings/templates/email-templates/`;
  const options = {
    method: 'GET',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const createEmailTemplate = async (data) => {
  const endpoint = `/settings/templates/email-templates/`;
  const options = {
    method: 'POST',
    body: data
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const updateEmailTemplate = async (id, data) => {
  const endpoint = `/settings/templates/email-templates/${id}/`;
  const options = {
    method: 'PUT',
    body: data
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const getEmail = async (id) => {
  const endpoint = `/settings/templates/email-templates/${id}/`;
  const options = {
    method: 'GET',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const getSignatureTemplates = async () => {
  const endpoint = `/email-signatures/`;
  const options = {
    method: 'GET',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  // return fetchAPI(url.toString(), options);
  return [
    {
      id: 'new',
      title: "Signature 1",
    },
    {
      id: 'new',
      title: "Signature 2",
    },
  ];
};

export const getEmailSignature = async (id) => {
  const endpoint = `/email-signatures/${id}/`;
  const options = {
    method: 'GET',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const createEmailSignature = async (data) => {
  const endpoint = `/email-signatures/`;
  const options = {
    method: 'POST',
    body: data
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const updateEmailSignature = async (id, data) => {
  const endpoint = `/email-signatures/${id}/`;
  const options = {
    method: 'PUT',
    body: data
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const deleteEmailSignature = async (id) => {
  const endpoint = `/email-signatures/${id}/`;
  const options = {
    method: 'DELETE',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const getSMSTemplates = async () => {
  const endpoint = `/sms-templates/`;
  const options = {
    method: 'GET',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const getSMS = async (id) => {
  const endpoint = `/sms-templates/${id}/`;
  const options = {
    method: 'GET',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const createSMSTemplate = async (data) => {
  const endpoint = `/sms-templates/`;
  const options = {
    method: 'POST',
    body: data
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const updateSMSTemplate = async (id, data) => {
  const endpoint = `/sms-templates/${id}/`;
  const options = {
    method: 'PUT',
    body: data
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const deleteSMSTemplate = async (id) => {
  const endpoint = `/sms-templates/${id}/`;
  const options = {
    method: 'DELETE',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const getProposalBySalesId = async (id) => {
  const endpoint = `/proposals/${id}/`;
  const options = {
    method: 'GET',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const getOutgoingEmail = async () => {
  const endpoint = `/references/outgoing-email/`;
  const options = {
    method: 'GET',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const deleteEmailTemplates = async (id) => {
  const endpoint = `/settings/templates/email-templates/${id}/`;
  const options = {
    method: 'DELETE',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const getProposalsTemplates = async () => {
  const endpoint = `/settings/proposals/`;
  const options = {
    method: 'GET',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const getProposalsTemplate = async (id) => {
  const endpoint = `/settings/proposals/${id}/`;
  const options = {
    method: 'GET',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const createProposalTemplate = async (data) => {
  const endpoint = `/settings/proposals/new/`;
  const options = {
    method: 'POST',
    body: data
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const deleteProposalTemplates = async (id) => {
  const endpoint = `/settings/proposals/delete/${id}/`;
  const options = {
    method: 'DELETE',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};