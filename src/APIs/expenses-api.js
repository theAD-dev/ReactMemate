import { fetchAPI } from "./base-api";
const API_BASE_URL = process.env.REACT_APP_BACKEND_API_URL;

export const getListOfExpense = async (page, limit, search = "", order = "", isShowUnpaid, filters) => {
  const offset = (page - 1) * limit;
  const endpoint = `/expenses/`;
  const options = {
    method: 'GET',
  };
  // Build query parameters manually to avoid URL encoding issues
  const queryParams = [];
  queryParams.push(`limit=${limit}`);
  queryParams.push(`offset=${offset}`);
  if (search) queryParams.push(`search=${encodeURIComponent(search)}`);
  if (order) queryParams.push(`ordering=${encodeURIComponent(order)}`);
  if (isShowUnpaid) queryParams.push('status=not_paid');

  let suppliersFilter = '';
  if (filters?.suppliers) {
    suppliersFilter = filters?.suppliers?.map(supplier => supplier.id).join(',');
    console.log('Suppliers filter string:', suppliersFilter);
    if (suppliersFilter) {
      queryParams.push(`suppliers=${suppliersFilter}`); // Don't encode commas
    }
  }

  let departmentsFilter = '';
  if (filters?.departments) {
    departmentsFilter = filters?.departments?.map(dept => dept.id).join(',');
    if (departmentsFilter) {
      queryParams.push(`departments=${departmentsFilter}`); // Don't encode commas
    }
  }

  let statusFilter = '';
  if (filters?.status && filters?.status?.length === 1) {
    console.log('Status filter array:', filters.status);
    filters?.status?.forEach(element => {
      console.log('Processing status element:', element);
      if (element?.name === 'paid') statusFilter = 'paid';
      else if (element?.name === 'not_paid') statusFilter = 'not_paid';
    });
    if (statusFilter) {
      console.log('Applied status filter:', statusFilter);
      queryParams.push(`status=${statusFilter}`);
    }
  } else if (filters?.status) {
    console.log('Status filter not applied - length:', filters.status.length, 'values:', filters.status);
  }

  if (filters?.date) {
    const startDate = filters?.date[0]?.value?.[0];
    if (startDate) {
      const date = new Date(startDate);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      queryParams.push(`date_after=${year}-${month}-${day}`);
    }

    const endDate = filters?.date[0]?.value?.[1];
    if (endDate) {
      const date = new Date(endDate);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      queryParams.push(`date_before=${year}-${month}-${day}`);
    }
  }

  // Build final URL with unencoded commas
  const finalUrl = `${API_BASE_URL}${endpoint}?${queryParams.join('&')}`;
  console.log('Final expenses API URL:', finalUrl);

  return fetchAPI(finalUrl, options);
};

export const getXeroCodesList = async () => {
  const endpoint = `/references/xero-codes/`;
  const options = {
    method: 'GET',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const getProjectsList = async () => {
  const endpoint = `/references/projects/expenses/`;
  const options = {
    method: 'GET',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const getExpense = async (id) => {
  const endpoint = `/expenses/update/${id}/`;
  const options = {
    method: 'GET'
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const createNewExpense = async (data) => {
  const endpoint = '/expenses/new/';
  const options = {
    method: 'POST',
    body: data
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const updateExpense = async (id, data) => {
  const endpoint = `/expenses/update/${id}/`;
  const options = {
    method: 'PUT',
    body: data
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const paidExpense = async (data) => {
  const endpoint = '/expenses/paid/';
  const options = {
    method: 'POST',
    body: data
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const unpaidExpense = async (data) => {
  const endpoint = '/expenses/unpaid/';
  const options = {
    method: 'POST',
    body: data
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const sendExpenseToXeroApi = async (data) => {
  const endpoint = `/expenses/to-xero/`;
  const options = {
    method: 'PUT',
    body: data
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const deleteExpense = async (uniqueId) => {
  const endpoint = `/expenses/delete/${uniqueId}/`;
  const options = {
    method: 'DELETE'
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const downloadStatement = async (data) => {
  const endpoint = '/clients/statement/pdf/';
  const options = {
    method: 'POST',
    body: data
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const sendStatementEmail = async (data) => {
  const endpoint = '/clients/statement/send/';
  const options = {
    method: 'POST',
    body: data
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const assignCodeToSupplier = async (id, code) => {
  const endpoint = `/suppliers/service-update/${id}/`;
  const options = {
    method: 'PUT',
    body: { code }
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};