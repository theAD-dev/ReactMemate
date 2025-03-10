import { fetchAPI } from "./base-api";
const API_BASE_URL = process.env.REACT_APP_BACKEND_API_URL;

export const draftSalesRequest = async (data) => {
  const endpoint = `/sales/new-request/`;
  const options = {
    method: 'POST',
    body: data
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

// Sale Table Api
export const fetchSales = async () => {
  const myHeaders = new Headers();
  const accessToken = localStorage.getItem("access_token");
  myHeaders.append("Authorization", `Bearer ${accessToken}`);

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  try {
    const response = await fetch(`${API_BASE_URL}/sales/`, requestOptions);
    const result = await response.text();
    return result;
  } catch (error) {
    console.error('Profile fetch error:', error);
    throw error;
  }
};


// Sales Note Api
export const fetchSalesNotes = async (saleUniqueId, updatedNote) => {
  const myHeaders = new Headers();
  const accessToken = localStorage.getItem("access_token");
  myHeaders.append("Authorization", `Bearer ${accessToken}`);
  myHeaders.append("Content-Type", "application/json");

  const requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: JSON.stringify({ sales_note: updatedNote }),
    redirect: 'follow',
  };

  try {
    const response = await fetch(`${API_BASE_URL}/sales/${saleUniqueId}/notes/`, requestOptions);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Sales notes update failed with status ${response.status}: ${errorText}`);
    }

    const result = await response.text();

    const parsedResult = result.trim() ? JSON.parse(result) : null;

    return parsedResult;
  } catch (error) {
    console.error('Sales notes update error:', error);
    throw error;
  }
};

export const markWon = async (ids) => {
  const endpoint = `/sales/status/won/`;
  const options = {
    method: 'PUT',
    body: { ids: ids }
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

export const markLost = async (ids) => {
  const endpoint = `/sales/status/lost/`;
  const options = {
    method: 'PUT',
    body: { ids: ids }
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options);
};

// Sale Won Api
export const fetchWon = async (saleUniqueId) => {
  const myHeaders = new Headers();
  const accessToken = localStorage.getItem("access_token");
  myHeaders.append("Authorization", `Bearer ${accessToken}`);
  myHeaders.append("Content-Type", "application/json");
  const raw = JSON.stringify({
    "ids": [saleUniqueId]
  });

  const requestOptions = {
    method: "PUT",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };
  const response = await fetch(`${API_BASE_URL}/sales/status/won/`, requestOptions);
  const result = await response.json();
  return result[0];
};


// Sale Contact Api
export const fetchContacts = async (saleUniqueId, formData) => {
  const myHeaders = new Headers();
  const accessToken = localStorage.getItem("access_token");
  myHeaders.append("Authorization", `Bearer ${accessToken}`);
  myHeaders.append("Content-Type", "application/json");
  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify(formData),
    redirect: 'follow'
  };

  try {
    const response = await fetch(`${API_BASE_URL}/sales/${saleUniqueId}/contacts/`, requestOptions);
    if (response.ok) {
      return response;
    } else {
      console.log('Error:', response.status);
      return null;
    }
  } catch (error) {
    console.log('Error:', error);
    return null;
  }
};


// Sale Lead Api
export const fetchSaleslead = async (saleUniqueId, updatedLead) => {
  const myHeaders = new Headers();
  const accessToken = localStorage.getItem("access_token");
  myHeaders.append("Authorization", `Bearer ${accessToken}`);
  myHeaders.append("Content-Type", "application/json");

  const requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: JSON.stringify({ lead: updatedLead, unique_id: saleUniqueId }),
    redirect: 'follow',
  };

  try {
    const response = await fetch(`${API_BASE_URL}/sales/${saleUniqueId}/lead/`, requestOptions);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Sales lead update failed with status ${response.status}: ${errorText}`);
    }

    const result = await response.text();

    const parsedResult = result.trim() ? JSON.parse(result) : null;

    return parsedResult;
  } catch (error) {
    console.error('Sales lead update error:', error);
    throw error;
  }
};




// Sale Multi Won Api
export const fetchMultipleData = async (selectedUniqueIds) => {
  const myHeaders = new Headers();
  const accessToken = localStorage.getItem("access_token");
  myHeaders.append("Authorization", `Bearer ${accessToken}`);
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    "ids": selectedUniqueIds
  });

  const requestOptions = {
    method: "PUT",
    headers: myHeaders,
    body: raw, // Include the body here
    redirect: "follow"
  };

  const responses = await Promise.all([
    fetch(`${API_BASE_URL}/sales/status/won/`, requestOptions), // Pass requestOptions directly
  ]);

  const data = await Promise.all(responses.map(response => response.json()));
  return data;
};


// Sale DUPLICATE Api
export const fetchduplicateData = async (saleUniqueId) => {
  const myHeaders = new Headers();
  const accessToken = localStorage.getItem("access_token");
  myHeaders.append("Authorization", `Bearer ${accessToken}`);
  myHeaders.append("Content-Type", "application/json");

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    redirect: "follow"
  };

  const response = await fetch(`${API_BASE_URL}/sales/${saleUniqueId}/duplicate/`, requestOptions);
  const result = await response.json();
  return result[0];
};




// Sale history Api
export const fetchhistoryData = async (saleUniqueId) => {
  const myHeaders = new Headers();
  const accessToken = localStorage.getItem("access_token");
  myHeaders.append("Authorization", `Bearer ${accessToken}`);
  myHeaders.append("Content-Type", "application/json");

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow"
  };

  try {
    await fetch(`${API_BASE_URL}/sales/${saleUniqueId}/history/`, requestOptions);
  } catch (error) {
    console.error(error);
  }
};





// Sale Multi Lost Api
export const fetchMultipleLost = async (selectedUniqueIds) => {
  const myHeaders = new Headers();
  const accessToken = localStorage.getItem("access_token");
  myHeaders.append("Authorization", `Bearer ${accessToken}`);
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    "ids": selectedUniqueIds
  });

  const requestOptions = {
    method: "PUT",
    headers: myHeaders,
    body: raw, // Include the body here
    redirect: "follow"
  };


  const responses = await Promise.all([
    fetch(`${API_BASE_URL}/sales/status/lost/`, requestOptions), // Pass requestOptions directly
  ]);

  const data = await Promise.all(responses.map(response => response.json()));
  return data; // Return data to handleMoveToManagementWon function
};





