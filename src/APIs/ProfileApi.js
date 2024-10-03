import { nanoid } from "nanoid";
const API_BASE_URL = process.env.REACT_APP_BACKEND_API_URL;

export const fetchProfile = async () => {
  const myHeaders = new Headers();
  const accessToken = localStorage.getItem("access_token");
  myHeaders.append("Authorization", `Bearer ${accessToken}`);

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  try {
    const response = await fetch(`${API_BASE_URL}/profile/`, requestOptions);
    if (response.status === 401) {
      window.localStorage.removeItem('access_token');
      window.localStorage.removeItem('refresh_token');
      window.localStorage.removeItem('isLoggedIn');
      window.location = "/login"
    }

    if (!response.ok) {
      if (response.status === 404) throw new Error('Not found');
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      localStorage.setItem('profileData', JSON.stringify(data));
      return data;
    } else {
      const text = await response.text();
      localStorage.setItem('profileData', text);
      return text
    }
  } catch (error) {
    console.error('Profile fetch error:', error);
    throw error;
  }
};




export const updateProfile = async (data, photo) => {
  const myHeaders = new Headers();
  const accessToken = localStorage.getItem("access_token");
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