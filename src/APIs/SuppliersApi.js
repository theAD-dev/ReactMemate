









import { fetchAPI } from "./base-api";
  const API_BASE_URL = 'https://dev.memate.com.au/api/v1';

export const fetchClients = async (limit, offset) => {
  const myHeaders = new Headers();
  const accessToken = sessionStorage.getItem("access_token");
  myHeaders.append("Authorization", `Bearer ${accessToken}`);
  myHeaders.append("Content-Type", `application/json`);

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  try {
    // Append the limit and offset parameters to the URL query string
    const url = new URL(`${API_BASE_URL}/suppliers/`);
    url.searchParams.append("limit", limit);
    url.searchParams.append("offset", offset);
    const response = await fetch(url, requestOptions);
    console.log('response: ', response);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Clients fetch error:', error);
    throw error;
  }
};




export const supplierstReadApi = async (id) => {
  const endpoint = `/suppliers/${id}/`;
  const options = {
    method: 'GET',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
}
