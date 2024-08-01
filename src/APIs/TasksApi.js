const API_BASE_URL = 'https://dev.memate.com.au/api/v1';

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Fetch API >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
export const fetchTasks = async (limit, offset) => {
  const myHeaders = new Headers();
  const accessToken = sessionStorage.getItem("access_token");
  myHeaders.append("Authorization", `Bearer ${accessToken}`);
  myHeaders.append("Content-Type", `application/json`);

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
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


// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> View Task API >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
export const fetchTasksRead = async (taskId) => {
  const myHeaders = new Headers();
  const accessToken = sessionStorage.getItem("access_token");
  myHeaders.append("Authorization", `Bearer ${accessToken}`);
  myHeaders.append("Content-Type", `application/json`);

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
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


// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Task Update API >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
export const fetchTasksUpdate= async (mainData,taskId) => {
  const myHeaders = new Headers();
  const accessToken = sessionStorage.getItem("access_token");
  myHeaders.append("Authorization", `Bearer ${accessToken}`);
  myHeaders.append("Content-Type", `application/json`);

  const requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: JSON.stringify(mainData)
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

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Task partials Update API  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
export const partialsTasksUpdate= async (taskId, data) => {
  console.log('taskId: ', taskId);
  console.log('data: ', data);
  const myHeaders = new Headers();
  const accessToken = sessionStorage.getItem("access_token");
  myHeaders.append("Authorization", `Bearer ${accessToken}`);
  myHeaders.append("Content-Type", `application/json`);

  const requestOptions = {
    method: 'PATCH',
    headers: myHeaders,
    body: JSON.stringify(data),
  };

  try {
    const url = new URL(`${API_BASE_URL}/tasks/update/${taskId}`);
    const response = await fetch(url, requestOptions);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Partials update error:', error);
    throw error;
  }
};


// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Task Create API >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
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

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Fetch Task Project API >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
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


// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Fetch Task Uses API >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
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


// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> DELETE Task  API >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
export const fetchTasksDelete = async (taskId) => {
  const myHeaders = new Headers();
  const accessToken = sessionStorage.getItem("access_token");
  myHeaders.append("Authorization", `Bearer ${accessToken}`);
  myHeaders.append("Content-Type", `application/json`);

  const requestOptions = {
    method: 'DELETE',
    headers: myHeaders,
    redirect: 'follow'
  };

  try {
    // Append the limit and offset parameters to the URL query string
    const url = new URL(`${API_BASE_URL}/tasks/delete/${taskId}`);

    const response = await fetch(url, requestOptions);
    if (response.ok) 
    return { message: 'Task deleted successfully' }
    else
    throw new Error("Error during deleting"); 
    
  } catch (error) {
    console.error('Tasks fetch error:', error);
    throw error;
  }
};


// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Complete Task  API >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
export const TaskCompleteJob = async (taskId, finished) => {
  const myHeaders = new Headers();
  const accessToken = sessionStorage.getItem("access_token");
  myHeaders.append("Authorization", `Bearer ${accessToken}`);
  myHeaders.append("Content-Type", `application/json`);

  const raw = JSON.stringify({
    "finished": finished
  });

  const requestOptions = {
    method: "PATCH",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  try {
    const url = new URL(`${API_BASE_URL}/tasks/complete/${taskId}`);
    const response = await fetch(url, requestOptions);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Tasks fetch error:', error);
    throw error;
  }
};
