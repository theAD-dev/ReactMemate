

import { fetchAPI } from "./base-api";
const API_BASE_URL = process.env.REACT_APP_BACKEND_API_URL;


export const emailQuoteationApi = async () => {
    const endpoint = `/quote/view/3fa6f1eb-f2f9-4e94-b2d7-344dcf661a64/`;
    const options = {
      method: 'GET',
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
  }