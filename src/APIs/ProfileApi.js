




import { nanoid } from "nanoid";

  const API_BASE_URL = 'https://dev.memate.com.au/api/v1';



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
      const response = await fetch(`${API_BASE_URL}/profile/`, requestOptions);
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Profile fetch error:', error);
      throw error;
    }
  };
  



  export const updateProfile = async (data, photo) => {
    const myHeaders = new Headers();
    const accessToken = sessionStorage.getItem("access_token");
    myHeaders.append("Authorization", `Bearer ${accessToken}`);
  
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });
  
    if (photo?.croppedImageBlob) {
      const photoHintId = nanoid(6);
      formData.append('photo', photo?.croppedImageBlob, `${photoHintId}.png`);
    }
  
    const requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: formData,
      redirect: 'follow'
    };
  
    try {
      const response = await fetch(`${API_BASE_URL}/profile/update/`, requestOptions);
      const result = await response.text();
      console.log('result>>>>>>>>>>: ', result);
      return result;
    } catch (error) {
      console.error('Profile fetch error:', error);
      throw error;
    }
  };