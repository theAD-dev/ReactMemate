import { fetchAPI } from "./base-api";
const API_BASE_URL = process.env.REACT_APP_BACKEND_API_URL;

export const resetEmail = async (data) => {
  const endpoint = `/profile/forget/`;
  const options = {
    method: 'POST',
    body: data
  };
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  return fetchAPI(url.toString(), options, false);
};

export const ProfileResetUpdate = async (email) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    const raw = JSON.stringify({
      "email": email
    });
    
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };
    
    fetch(`${API_BASE_URL}/profile/forget/`, requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));

};


export const ProfileChangePassword = async (password,tokenId) => {
  console.log('tokenId: ', tokenId);
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    "new_password": password
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  try {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/${tokenId}/`, requestOptions);
    const result = await response.text();
    console.log(result);
    return result; // Return the result to handle success or error in the component
  } catch (error) {
    console.error(error);
    throw error; // Throw the error to handle it in the component
  }
};

