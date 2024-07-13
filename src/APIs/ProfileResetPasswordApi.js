const API_BASE_URL = 'https://dev.memate.com.au/api/v1';

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
    const response = await fetch(`https://dev.memate.com.au/api/v1/${tokenId}/`, requestOptions);
    const result = await response.text();
    console.log(result);
    return result; // Return the result to handle success or error in the component
  } catch (error) {
    console.error(error);
    throw error; // Throw the error to handle it in the component
  }
};

