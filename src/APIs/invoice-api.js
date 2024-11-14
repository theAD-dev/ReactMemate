import { fetchAPI } from "./base-api";
const API_BASE_URL = process.env.REACT_APP_BACKEND_API_URL;

export const getListOfInvoice = async (page, limit, name = "", order = "", isShowDeleted) => {
  const offset = (page - 1) * limit;
  const endpoint = `/invoices/`;
  const options = {
    method: 'GET',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  url.searchParams.append("limit", limit);
  url.searchParams.append("offset", offset);
  if (name) url.searchParams.append("name", name);
  if (order) url.searchParams.append("ordering", order);
  if (isShowDeleted) url.searchParams.append('deleted', 1)

  return fetchAPI(url.toString(), options);
}

export const getInvoice = async (uniqueId) => {
  const endpoint = `/invoices/view/${uniqueId}/`;
  const options = {
    method: 'GET',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options, false);
}

export const paymentIntentCreate = async (uniqueId, data) => {
  const endpoint = `/invoices/payment-intent/${uniqueId}/`;
  const options = {
    method: 'POST',
    body: data
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options, false);
}

export const deleteInvoice = async (uniqueId) => {
  const endpoint = `/invoices/delete/${uniqueId}/`;
  const options = {
    method: 'DELETE'
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
}

export const resendInvoiceEmail = async (id, data) => {
    const endpoint = `/resend/invoice/${id}/`;
    const options = {
        method: 'POST',
        body: data
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
}

export const partialPaymentCreate = async (id, data) => {
  const endpoint = `/invoices/partial-payment/${id}/`;
  const options = {
      method: 'POST',
      body: data
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
}