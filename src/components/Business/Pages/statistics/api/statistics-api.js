import { fetchAPI } from "../../../../../APIs/base-api";
const API_BASE_URL = process.env.REACT_APP_BACKEND_API_URL;

export const getExecutiveStatistics = async (year) => {
  const endpoint = `/statistics/executive/`;
  const options = {
    method: 'GET',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  if (year) url.searchParams.append('year', year);

  return fetchAPI(url.toString(), options);
};

export const getKeyResultStatics = async (year, month) => {
  console.log('month: ', month);
  console.log('year: ', year);
  const endpoint = `/statistics/key-results/${year}/${month}/`;
  const options = {
    method: 'GET',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};