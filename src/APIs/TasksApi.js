const API_BASE_URL = 'https://dev.memate.com.au/api/v1';

export const fetchTasks = async (limit, offset) => {
  const myHeaders = new Headers();
  const accessToken = sessionStorage.getItem("access_token");
  myHeaders.append("Authorization", `Bearer ${accessToken}`);
  myHeaders.append("Content-Type", `application/json`);

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  try {
    // Append the limit and offset parameters to the URL query string
    const url = new URL(`${API_BASE_URL}/tasks/`);
    url.searchParams.append("limit", limit);
    url.searchParams.append("offset", offset);

    const response = await fetch(url, requestOptions);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Tasks fetch error:', error);
    throw error;
  }
};
export const fetchTasksRead = async (taskId) => {
  const myHeaders = new Headers();
  const accessToken = sessionStorage.getItem("access_token");
  myHeaders.append("Authorization", `Bearer ${accessToken}`);
  myHeaders.append("Content-Type", `application/json`);

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  try {
    // Append the limit and offset parameters to the URL query string
    const url = new URL(`${API_BASE_URL}/tasks/${taskId}`);

    const response = await fetch(url, requestOptions);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Tasks fetch error:', error);
    throw error;
  }
};
export const fetchTasksUpdate= async (taskId) => {
  const myHeaders = new Headers();
  const accessToken = sessionStorage.getItem("access_token");
  myHeaders.append("Authorization", `Bearer ${accessToken}`);
  myHeaders.append("Content-Type", `application/json`);

  const requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    redirect: 'follow'
  };

  try {
    // Append the limit and offset parameters to the URL query string
    const url = new URL(`${API_BASE_URL}/tasks/update/${taskId}`);

    const response = await fetch(url, requestOptions);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Tasks fetch error:', error);
    throw error;
  }
};



export const fetchTasksNew = async (formData) => {

  const myHeaders = new Headers();
  const accessToken = sessionStorage.getItem("access_token");
  myHeaders.append("Authorization", `Bearer ${accessToken}`);
  myHeaders.append("Content-Type", `application/json`);

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify(formData), // Serialize formData directly here
    redirect: "follow"
  };

  try {
    const response = await fetch(`${API_BASE_URL}/tasks/new/`, requestOptions);
    const result = await response.text();
    return result; // Return the result if needed
  } catch (error) {
    console.error(error);
    throw error; // Rethrow the error if needed
  }
};

export const fetchTasksProject = async () => {
 
  const myHeaders = new Headers();
  const accessToken = sessionStorage.getItem("access_token");
  myHeaders.append("Authorization", `Bearer ${accessToken}`);
  myHeaders.append("Content-Type", `application/json`);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow"
  };

  try {
    const response = await fetch(`${API_BASE_URL}/references/projects/`, requestOptions);
    const result = await response.json();
    return result; // Return the result if needed
  } catch (error) {
    console.error(error);
    throw error; // Rethrow the error if needed
  }
};

export const fetchTasksUsers = async () => {
 
  const myHeaders = new Headers();
  const accessToken = sessionStorage.getItem("access_token");
  myHeaders.append("Authorization", `Bearer ${accessToken}`);
  myHeaders.append("Content-Type", `application/json`);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow"
  };

  try {
    const response = await fetch(`${API_BASE_URL}/references/all-users/`, requestOptions);
    const result = await response.json();
    return result; // Return the result if needed
  } catch (error) {
    console.error(error);
    throw error; // Rethrow the error if needed
  }
};
