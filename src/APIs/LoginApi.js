export const authenticateUser = async (email, password) => {
  const formdata = new FormData();
  formdata.append("email", email);
  formdata.append("password", password);

  const requestOptions = {
    method: 'POST',
    body: formdata,
    redirect: 'follow'
  };

  try {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/login/`, requestOptions);

    if (!response.ok) {
      console.error('Authentication error:', response.statusText);
      return { success: false, error: response.statusText };
    }

    // Assuming the server responds with JSON
    const result = await response.json();

    const { access, refresh } = result;
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);

    return { success: true };
  } catch (error) {
    console.error('Authentication error:', error);
    return { success: false, error: error.message };
  }
};



