import { fetchAPI } from "./base-api";
const API_BASE_URL = process.env.REACT_APP_BACKEND_API_URL;

export const getListOfOrder = async (page, limit, search="", order="", isShowDeleted, filters = {}) => {
  const offset = (page - 1) * limit;
  const endpoint = `/orders/`;
  const options = {
    method: 'GET',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  url.searchParams.append("limit", limit);
  url.searchParams.append("offset", offset);
  if (search) url.searchParams.append("search", search);
  if (order) url.searchParams.append("ordering", order);
  if (isShowDeleted) url.searchParams.append('deleted', 1);
  
  // Add filter parameters
  if (filters.status) url.searchParams.append("status", filters.status);
  if (filters.clients) url.searchParams.append("clients", filters.clients);
  if (filters.create_date_after) url.searchParams.append("create_date_after", filters.create_date_after);
  if (filters.create_date_before) url.searchParams.append("create_date_before", filters.create_date_before);

  return fetchAPI(url.toString(), options);
};