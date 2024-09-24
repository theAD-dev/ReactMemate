 const API_BASE_URL = process.env.REACT_APP_BACKEND_API_URL;

  export const fetchHomePage = async () => {
    const myHeaders = new Headers();
    const accessToken = localStorage.getItem("access_token");
    myHeaders.append("Authorization", `Bearer ${accessToken}`);
  
    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };
  
    try {
      const response = await fetch(`${API_BASE_URL}/home/`, requestOptions);
      const result = await response.text();
      return result;
    } catch (error) {
      console.error('Profile fetch error:', error);
      throw error;
    }
  };


