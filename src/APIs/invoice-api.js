import { fetchAPI } from "./base-api";
const API_BASE_URL = process.env.REACT_APP_BACKEND_API_URL;

export const getListOfInvoice = async (page, limit, search = "", order = "", isShowUnpaid, clientsFilter) => {
  const offset = (page - 1) * limit;
  const endpoint = `/invoices/`;
  const options = {
    method: 'GET',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  url.searchParams.append("limit", limit);
  url.searchParams.append("offset", offset);
  if (search) url.searchParams.append("search", search);
  if (order) url.searchParams.append("ordering", order);
  if (isShowUnpaid) url.searchParams.append('status', 'not_paid');
  if (clientsFilter) url.searchParams.append('clients', clientsFilter);

  return fetchAPI(url.toString(), options);
};

export const getInvoice = async (uniqueId) => {
  const endpoint = `/invoices/view/${uniqueId}/`;
  const options = {
    method: 'GET',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options, false);
};

export const paymentIntentCreate = async (uniqueId, data) => {
  const endpoint = `/invoices/payment-intent/${uniqueId}/`;
  const options = {
    method: 'POST',
    body: data
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options, false);
};

export const deleteInvoice = async (uniqueId) => {
  const endpoint = `/invoices/delete/${uniqueId}/`;
  const options = {
    method: 'DELETE'
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const sendInvoiceEmail = async (id, data) => {
  const endpoint = `/invoices/send/${id}/`;
  const options = {
    method: 'POST',
    body: data
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const resendInvoiceEmail = async (id, data) => {
    const endpoint = `/resend/invoice/${id}/`;
    const options = {
        method: 'POST',
        body: data
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
};

export const partialPaymentCreate = async (id, data) => {
  const endpoint = `/invoices/partial-payment/${id}/`;
  const options = {
      method: 'POST',
      body: data
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const sendInvoiceToXeroApi = async (data) => {
  const endpoint = `/invoices/to-xero/`;
  const options = {
      method: 'PUT',
      body: data
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const markInvoiceAsPaid = async (id) => {
  const endpoint = `/team/mobile-users/invoices/${id}/pay/`;
  const options = {
    method: 'POST'
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const markInvoiceAsUnpaid = async (id) => {
  const endpoint = `/team/mobile-users/invoices/${id}/unpay/`;
  const options = {
    method: 'POST'
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};