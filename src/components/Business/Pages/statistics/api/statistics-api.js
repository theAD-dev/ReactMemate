import { format } from 'date-fns';
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

export const getOverviewStatistics = async (startDate, endDate) => {
  const currentStart = new Date(startDate);
  const currentEnd = new Date(endDate);

  const prevStart = new Date(startDate);
  prevStart.setFullYear(prevStart.getFullYear() - 1);

  const prevEnd = new Date(endDate);
  prevEnd.setFullYear(prevEnd.getFullYear() - 1);

  // Format dates as YYYY-MM-DD
  const currentRange = `${format(currentStart, 'yyyy-MM-dd')}:${format(currentEnd, 'yyyy-MM-dd')}`;
  const previousRange = `${format(prevStart, 'yyyy-MM-dd')}:${format(prevEnd, 'yyyy-MM-dd')}`;

  const endpoint = `/statistics/overview/${currentRange}/${previousRange}/`;
  const options = {
    method: 'GET',
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};