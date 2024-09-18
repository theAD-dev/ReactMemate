import { fetchAPI } from "./base-api";
const API_BASE_URL = 'https://dev.memate.com.au/api/v1';

export const getListOfOrder = async (page, limit, name="", order="", isShowDeleted) => {
  const offset = (page - 1) * limit;
  const endpoint = `/orders/`;
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