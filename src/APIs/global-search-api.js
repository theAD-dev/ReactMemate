import { fetchAPI } from "./base-api";
const API_BASE_URL = process.env.REACT_APP_BACKEND_API_URL;

/**
 * Global Search API
 * Provides unified search across different entities in the application
 */

export const globalSearch = async (query, searchTypes = ['projects', 'clients'], limit = 10) => {
  const endpoint = `/search/global/`;
  const options = {
    method: 'GET',
  };

  const url = new URL(`${API_BASE_URL}${endpoint}`);
  url.searchParams.append("q", query);
  url.searchParams.append("limit", limit);

  // Add search types as comma-separated values
  if (searchTypes.length > 0) {
    url.searchParams.append("types", searchTypes.join(','));
  }

  return fetchAPI(url.toString(), options);
};

/**
 * Search Projects by Reference and Project Number
 */
export const searchProjects = async (query, limit = 10) => {
  const endpoint = `/projects/search/`;
  const options = {
    method: 'GET',
  };

  const url = new URL(`${API_BASE_URL}${endpoint}`);
  if (query) url.searchParams.append("search", query);
  url.searchParams.append("limit", limit);
  url.searchParams.append("offset", 0);

  return fetchAPI(url.toString(), options);
};

/**
 * Search Jobs by short_description, long_description, and project details
 */
export const searchJobs = async (query, limit = 10) => {
  const endpoint = `/jobs/`;
  const options = {
    method: 'GET',
  };

  const url = new URL(`${API_BASE_URL}${endpoint}`);
  if (query) url.searchParams.append("search", query);
  url.searchParams.append("limit", limit);
  url.searchParams.append("offset", 0);

  return fetchAPI(url.toString(), options);
};

/**
 * Search Tasks by title and description
 */
export const searchTasks = async (query, limit = 10) => {
  const endpoint = `/tasks/`;
  const options = {
    method: 'GET',
  };

  const url = new URL(`${API_BASE_URL}${endpoint}`);
  if (query) url.searchParams.append("search", query);
  url.searchParams.append("limit", limit);
  url.searchParams.append("offset", 0);

  return fetchAPI(url.toString(), options);
};

/**
 * Search Invoices by invoice number and client details
 */
export const searchInvoices = async (query, limit = 10) => {
  const endpoint = `/invoices/`;
  const options = {
    method: 'GET',
  };

  const url = new URL(`${API_BASE_URL}${endpoint}`);
  if (query) url.searchParams.append("search", query);
  url.searchParams.append("limit", limit);
  url.searchParams.append("offset", 0);

  return fetchAPI(url.toString(), options);
};

/**
 * Search Suppliers by name and contact details
 */
export const searchSuppliers = async (query, limit = 10) => {
  const endpoint = `/suppliers/`;
  const options = {
    method: 'GET',
  };

  const url = new URL(`${API_BASE_URL}${endpoint}`);
  if (query) url.searchParams.append("search", query);
  url.searchParams.append("limit", limit);
  url.searchParams.append("offset", 0);

  return fetchAPI(url.toString(), options);
};

/**
 * Search Expenses by description, supplier name, and amount
 */
export const searchExpenses = async (query, limit = 10) => {
  const endpoint = `/expenses/`;
  const options = {
    method: 'GET',
  };

  const url = new URL(`${API_BASE_URL}${endpoint}`);
  if (query) url.searchParams.append("search", query);
  url.searchParams.append("limit", limit);
  url.searchParams.append("offset", 0);

  return fetchAPI(url.toString(), options);
};

/**
 * Search Clients by Name, Contact Person, Email, Phone
 */
export const searchClients = async (query, limit = 10) => {
  const endpoint = `/clients/`;
  const options = {
    method: 'GET',
  };

  const url = new URL(`${API_BASE_URL}${endpoint}`);
  if (query) url.searchParams.append("search", query);
  url.searchParams.append("limit", limit);
  url.searchParams.append("offset", 0);

  return fetchAPI(url.toString(), options);
};

/**
 * Client-side filter for projects (since management API doesn't support server-side search)
 */
const filterProjects = (projects, query) => {
  if (!query) return projects;
  const searchTerm = query.toLowerCase();

  return projects.filter(project =>
    (project.number?.toLowerCase()?.includes(searchTerm)) ||
    (project.reference?.toLowerCase()?.includes(searchTerm)) ||
    (project.unique_id?.toLowerCase()?.includes(searchTerm))
  );
};

/**
 * Unified search function that searches across all entities
 * Returns structured data for each entity type
 */
export const performUnifiedSearch = async (query, limit = 3) => {
  if (!query || query.trim().length < 2) {
    return {
      projects: [],
      clients: [],
      suppliers: [],
      total: 0
    };
  }

  try {
    const [
      projectsResponse,
      clientsResponse,
      suppliersResponse
    ] = await Promise.all([
      searchProjects(query, limit).catch(() => ({ results: [], count: 0 })),
      searchClients(query, limit).catch(() => ({ results: [], count: 0 })),
      searchSuppliers(query, limit).catch(() => ({ results: [], count: 0 }))
    ]);

    return {
      projects: projectsResponse.results || [],
      clients: clientsResponse.results || [],
      suppliers: suppliersResponse.results || [],
      total: (projectsResponse.count || projectsResponse.results?.length || 0) +
        (clientsResponse.count || clientsResponse.results?.length || 0) +
        (suppliersResponse.count || suppliersResponse.results?.length || 0)
    };
  } catch (error) {
    console.error('Global search error:', error);
    return {
      projects: [],
      clients: [],
      suppliers: [],
      total: 0
    };
  }
};