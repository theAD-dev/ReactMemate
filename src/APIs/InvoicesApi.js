const API_BASE_URL = 'https://dev.memate.com.au/api/v1';

export const fetchInvoices = async (limit, offset) => {
  const myHeaders = new Headers();
  const accessToken = localStorage.getItem("access_token");
  myHeaders.append("Authorization", `Bearer ${accessToken}`);
  myHeaders.append("Content-Type", `application/json`);

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  try {
    // Append the limit and offset parameters to the URL query string
    const url = new URL(`${API_BASE_URL}/invoices/`);
    url.searchParams.append("limit", limit);
    url.searchParams.append("offset", offset);

    const response = await fetch(url, requestOptions);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Invoices fetch error:', error);
    throw error;
  }
};
