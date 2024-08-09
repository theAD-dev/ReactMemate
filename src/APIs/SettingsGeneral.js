const API_BASE_URL = 'https://dev.memate.com.au/api/v1';

/**
 * A generic fetch function to make API calls.
 * @param {string} endpoint - The API endpoint to call.
 * @param {object} options - The fetch options including method, headers, and body.
 * @returns {Promise<any>} - The JSON response from the API.
 */
const fetchAPI = async (endpoint, options = {}) => {
  const { method = 'GET', headers = {}, body } = options;
  const accessToken = sessionStorage.getItem("access_token");

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
    return await response.json();
  } catch (error) {
    console.error('Fetch API error:', error);
    throw error;
  }
};

export const updateProjectStatusById = async (id, data) => {
  const endpoint = `/settings/project-statuses/update/${id}`;
  const options = {
    method: 'PUT',
    body: data
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
}

export const deleteProjectStatusById = async (id) => {
  const endpoint = `/settings/project-statuses/delete/${id}`;
  const options = {
    method: 'DELETE',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
}







export const SettingsGeneralInformation = async () => {
  const myHeaders = new Headers();
  const accessToken = sessionStorage.getItem("access_token");
  myHeaders.append("Authorization", `Bearer ${accessToken}`);

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  try {
    const response = await fetch(`${API_BASE_URL}/settings/organization/general/`, requestOptions);
    const result = await response.text();
    return result;
  } catch (error) {
    console.error('Profile fetch error:', error);
    throw error;
  }
};

export const updateGeneralInformation = async (generalData) => {
  const myHeaders = new Headers();
  const accessToken = sessionStorage.getItem("access_token");
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
    const response = await fetch(`${API_BASE_URL}/settings/organization/general/`, requestOptions);
    const result = await response.text();
    console.log('result: ', result);
    return result;
  } catch (error) {
    console.error('Profile fetch error:', error);
    throw error;
  }
};

export const SettingsBankInformation = async () => {

  const myHeaders = new Headers();
  const accessToken = sessionStorage.getItem("access_token");
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
  const accessToken = sessionStorage.getItem("access_token");
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
  const accessToken = sessionStorage.getItem("access_token");
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

