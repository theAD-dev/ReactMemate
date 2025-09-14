import { fetchAPI } from "./base-api";
const API_BASE_URL = process.env.REACT_APP_BACKEND_API_URL;

export const getListOfForms = async (page, limit, search = "", order = "", isShowDeleted) => {
  const offset = (page - 1) * limit;
  const endpoint = `/inquiries/forms/`;
  const options = {
    method: 'GET',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  url.searchParams.append("limit", limit);
  url.searchParams.append("offset", offset);
  url.searchParams.append("organization", 5);
  if (search) url.searchParams.append("search", search);
  if (order) url.searchParams.append("ordering", order);
  if (isShowDeleted) url.searchParams.append('deleted', 1);

  return fetchAPI(url.toString(), options);
};