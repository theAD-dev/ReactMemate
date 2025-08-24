import { fetchAPI } from "./base-api";
const API_BASE_URL = process.env.REACT_APP_BACKEND_API_URL;

export const getListOfInvoice = async (page, limit, search = "", order = "", isShowUnpaid, filters) => {
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

  let clientsFilter = '';
  if (filters?.client) {
    clientsFilter = filters?.client?.map(client => client.id).join(',');
  }
  if (clientsFilter) url.searchParams.append('clients', clientsFilter);

  let statusFilter = '';
  if (filters?.status && filters?.status?.length === 1) {
    filters?.status?.forEach(element => {
      if (element?.name === 'Paid') statusFilter = 'paid';
      else if (element?.name === 'Not Paid') statusFilter = 'not_paid';
    });
  }
  if (statusFilter) url.searchParams.append('status', statusFilter);

  if (filters?.date) {
    const startDate = filters?.date[0]?.value?.[0];
    if (startDate) {
      const date = new Date(startDate);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      url.searchParams.append('create_date_after', `${year}-${month}-${day}`);
    }

    const endDate = filters?.date[0]?.value?.[1];
    if (endDate) {
      const date = new Date(endDate);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      url.searchParams.append('create_date_before', `${year}-${month}-${day}`);
    }
  }

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