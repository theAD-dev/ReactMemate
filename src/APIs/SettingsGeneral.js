import { nanoid } from "nanoid";
import { getLocation } from "./location-api";

const API_BASE_URL = process.env.REACT_APP_BACKEND_API_URL;

/**
 * A generic fetch function to make API calls.
 * @param {string} endpoint - The API endpoint to call.
 * @param {object} options - The fetch options including method, headers, and body.
 * @returns {Promise<any>} - The JSON response from the API.
 */
const fetchAPI = async (endpoint, options = {}) => {
  const { method = 'GET', headers = {}, body } = options;
  const accessToken = localStorage.getItem("access_token");

  const defaultHeaders = {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
    ...headers
  };

  const requestOptions = {
    method,
    headers: defaultHeaders,
    body: JSON.stringify(body),
    redirect: 'follow'
  };

  try {
    const url = new URL(`${endpoint}`);
    const response = await fetch(url, requestOptions);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      // Handle non-JSON responses
      const text = await response.text();
      return { message: 'Non-JSON response', body: text };
    }

  } catch (error) {
    console.error('Fetch API error:', error);
    throw error;
  }
};

export const getBillingPersonalInfo = async () => {
  const endpoint = `/settings/subscriptions/tax-id/`;
  const options = {
    method: 'GET'
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const getUpcomingPayment = async () => {
  const endpoint = `/settings/subscriptions/upcoming/`;
  const options = {
    method: 'GET'
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const updateBillingPersonalInfo = async (data) => {
  const endpoint = `/settings/subscriptions/tax-id/`;
  const options = {
    method: 'PUT',
    body: data
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const getPaymentMethodInfo = async () => {
  const endpoint = `/settings/subscriptions/payment-method/`;
  const options = {
    method: 'GET'
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const retryPayment = async () => {
  const endpoint = `/subscriptions/retry/`;
  const options = {
    method: 'POST'
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const updatePaymentMethodInfo = async (data) => {
  const endpoint = `/settings/subscriptions/payment-method/`;
  const options = {
    method: 'PUT',
    body: data
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const getReginalAndLanguage = async () => {
  const endpoint = `/settings/organization/region-language/`;
  const options = {
    method: 'GET'
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const updateReginalAndLanguage = async (data) => {
  const endpoint = `/settings/organization/region-language/`;
  const options = {
    method: 'PUT',
    body: data
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const createProjectStatus = async (data) => {
  console.log('data: ', data);
  if (data.id) delete data.id;
  if (data.isNew) delete data.isNew;
  if (data.isChanged) delete data.isChanged;
  if (data.value) delete data.value;

  const endpoint = `/settings/project-statuses/new/`;
  const options = {
    method: 'POST',
    body: data
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const updateProjectStatusById = async (id, data) => {
  const endpoint = `/settings/project-statuses/update/${id}/`;
  const options = {
    method: 'PUT',
    body: data
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const deleteProjectStatusById = async (id) => {
  const endpoint = `/settings/project-statuses/delete/${id}/`;
  const options = {
    method: 'DELETE',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};







export const SettingsGeneralInformation = async () => {
  const myHeaders = new Headers();
  const accessToken = localStorage.getItem("access_token");
  myHeaders.append("Authorization", `Bearer ${accessToken}`);

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  try {
    const response = await fetch(`${API_BASE_URL}/settings/organization/general/`, requestOptions);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Profile fetch error:', error);
    throw error;
  }
};

export const updateGeneralInformation = async (data, photo) => {
  const myHeaders = new Headers();
  const accessToken = localStorage.getItem("access_token");
  myHeaders.append("Authorization", `Bearer ${accessToken}`);

  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    formData.append(key, data[key]);
  });

  if (photo?.croppedImageBlob) {
    const photoHintId = nanoid(6);
    formData.append('company_logo', photo?.croppedImageBlob, `${photoHintId}.jpg`);
  }

  const requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: formData,
    redirect: 'follow'
  };

  try {
    const response = await fetch(`${API_BASE_URL}/settings/organization/general/`, requestOptions);
    const result = await response.text();
    console.log('result>>>>>>>>>>: ', result);
    return result;
  } catch (error) {
    console.error('Profile fetch error:', error);
    throw error;
  }
};

export const SettingsBankInformation = async () => {

  const myHeaders = new Headers();
  const accessToken = localStorage.getItem("access_token");
  myHeaders.append("Authorization", `Bearer ${accessToken}`);

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  try {
    const response = await fetch(`${API_BASE_URL}/settings/organization/bank/`, requestOptions);
    const result = await response.text();
    return result;
  } catch (error) {
    console.error('Profile fetch error:', error);
    throw error;
  }
};

export const updateBankInformation = async (generalData) => {
  const myHeaders = new Headers();
  const accessToken = localStorage.getItem("access_token");
  myHeaders.append("Authorization", `Bearer ${accessToken}`);

  const formData = new FormData();
  Object.keys(generalData).forEach((key) => {
    formData.append(key, generalData[key]);
  });

  const requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: formData,
    redirect: 'follow'
  };

  try {
    const response = await fetch(`${API_BASE_URL}/settings/organization/bank/`, requestOptions);
    const result = await response.text();
    console.log('result: ', result);
    return result;
  } catch (error) {
    console.error('Profile fetch error:', error);
    throw error;
  }
};

export const ProjectStatusesList = async () => {

  const myHeaders = new Headers();
  const accessToken = localStorage.getItem("access_token");
  myHeaders.append("Authorization", `Bearer ${accessToken}`);

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  try {
    const response = await fetch(`${API_BASE_URL}/settings/project-statuses/`, requestOptions);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('project fetch error:', error);
    throw error;
  }
};


export const getHolidaysList = async () => {
  try {
    const location = JSON.parse(localStorage.getItem("profileData")).location;
    const locationDetails = await getLocation(location);
    if (!locationDetails || !locationDetails.state) {
      console.error('Invalid location details:', locationDetails);
      return [];
    }
    const endpoint = `/locations/${locationDetails.state}/holidays/`;
    const options = {
      method: 'GET'
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
  } catch (err) {
    console.error('Error fetching holidays:', err);
    return [];
  }
};