import { fetchAPI } from "./base-api";
const API_BASE_URL = process.env.REACT_APP_BACKEND_API_URL;

export const createNewIndividualClient = async (data) => {
  const endpoint = '/clients/individual/new/';
  const options = {
    method: 'POST',
    body: data
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
}

export const createNewBusinessClient = async (data) => {
  const endpoint = '/clients/business/new/';
  const options = {
    method: 'POST',
    body: data
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
}

export const restoreClient = async (id) => {
  const endpoint = `/clients/restore/${id}/`;
  const options = {
    method: 'POST'
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
}

export const getClientById = async (id) => {
  const endpoint = `/clients/${id}/`;
  const options = {
    method: 'GET',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
}

export const getClientCategories = async () => {
  const endpoint = `/references/clients/categories/`;
  const options = {
    method: 'GET',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
}

export const getClientIndustries = async () => {
  const endpoint = `/references/clients/industries/`;
  const options = {
    method: 'GET',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
}

export const getCountries = async () => {
  const endpoint = `/references/countries/`;
  const options = {
    method: 'GET',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options, false);
}

export const getStates = async (country) => {
  const endpoint = `/references/states/${country}/`;
  const options = {
    method: 'GET',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options, false);
}

export const getCities = async (state) => {
  const endpoint = `/references/cities/${state}/`;
  const options = {
    method: 'GET',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options, false);
}

export const getProjectManager = async () => {
  const endpoint = `/references/desktop-users/`;
  const options = {
    method: 'GET',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
}

export const clientEditApi = async (id) => {
  const endpoint = `/clients/${id}/`;
  const options = {
    method: 'GET',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
}

export const getListOfClients = async (page, limit, name="", order="", isShowDeleted) => {
  const offset = (page - 1) * limit;
  const endpoint = `/clients/`;
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

export const clientOrderHistory = async (id) => {
  const endpoint = `/clients/${id}/orders/`;
  const options = {
    method: 'GET',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
}

export const markeMainAddress = async (id) => {
  const endpoint = `/clients/address/${id}/main`;
  const options = {
    method: 'PUT',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
}

export const markeMainContact = async (id) => {
  const endpoint = `/clients/contact-persons/${id}/main`;
  const options = {
    method: 'PUT',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
}

export const deleteClient = async (id) => {
  const endpoint = `/clients/delete/${id}/`;
  const options = {
    method: 'DELETE',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
}

export const deleteContactPerson = async (id) => {
  const endpoint = `/clients/contact-persons/${id}/delete/`;
  const options = {
    method: 'DELETE',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
}

export const deleteAddress = async (id) => {
  const endpoint = `/clients/address/${id}/delete/`;
  const options = {
    method: 'DELETE',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
}

export const fetchClients = async (limit, offset) => {
  const myHeaders = new Headers();
  const accessToken = localStorage.getItem("access_token");
  myHeaders.append("Authorization", `Bearer ${accessToken}`);
  myHeaders.append("Content-Type", `application/json`);

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  try {
    // Append the limit and offset parameters to the URL query string
    const url = new URL(`${API_BASE_URL}/clients`);
    url.searchParams.append("limit", limit);
    url.searchParams.append("offset", offset);

    const response = await fetch(url, requestOptions);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Clients fetch error:', error);
    throw error;
  }
};

export const bringBack = async (id) => {
  const endpoint = `/projects/back/`;
  const options = {
      method: 'PUT',
      body: { unique_id: id }
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
}
