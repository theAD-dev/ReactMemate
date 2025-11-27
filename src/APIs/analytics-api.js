import { fetchAPI } from "./base-api";
const API_BASE_URL = process.env.REACT_APP_BACKEND_API_URL;

export const getGaProperties = async () => {
  const endpoint = `/analytics/properties`;
  const options = { method: "GET" };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const getGaReports = async ({ property_id, params = {} }) => {
  const search = new URLSearchParams({ property_id, ...params }).toString();
  const endpoint = `/analytics/reports?${search}`;
  const options = { method: "GET" };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};
