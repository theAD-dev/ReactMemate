import { fetchAPI } from "./base-api";
const API_BASE_URL = 'https://dev.memate.com.au/api/v1';

export const locationListApi = async () => {
    const endpoint = `/locations/`;
    const options = {
      method: 'GET',
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
  }

