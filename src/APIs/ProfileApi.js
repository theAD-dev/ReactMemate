export const fetchProfile = async () => {
    const myHeaders = new Headers();
    const accessToken = sessionStorage.getItem("access_token");
    myHeaders.append("Authorization", `Bearer ${accessToken}`);
  
    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };
  
    try {
      const response = await fetch("https://dev.memate.com.au/api/v1/profile/", requestOptions);
      const result = await response.text();
      return result;
    } catch (error) {
      console.error('Profile fetch error:', error);
      throw error;
    }
  };
  