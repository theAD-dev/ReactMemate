import { fetchAPI } from "./base-api";
const API_BASE_URL = process.env.REACT_APP_BACKEND_API_URL;

export const getRecurring = async ({ limit, offset }) => {
    const endpoint = `/settings/projects/recurrings?limit=${limit}&offset=${offset}`;
    const options = {
        method: 'GET',
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
};