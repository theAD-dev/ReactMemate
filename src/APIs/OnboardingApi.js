const API_BASE_URL = process.env.REACT_APP_BACKEND_API_URL;

export const OnboardingCreateApi = async (formData) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify(formData), // Serialize formData directly here
    redirect: "follow"
  };

  try {
    const response = await fetch(`${API_BASE_URL}/onboarding/create/`, requestOptions);
    const result = await response.text();
    return result; // Return the result if needed
  } catch (error) {
    console.error(error);
    throw error; // Rethrow the error if needed
  }
};


export const OnboardingCode = async (otpCode, uuid) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const requestBody = JSON.stringify({ code: otpCode }); // Stringify the object

  const requestOptions = {
    method: "PUT",
    headers: myHeaders,
    body: requestBody, // Assign the stringified object to the body
    redirect: "follow"
  };

  try {
    const response = await fetch(`${API_BASE_URL}/onboarding/verify/${uuid}/`, requestOptions);
    const result = await response.text();
    
    // Check if the request was successful (status code 200)
    if (response.status === 200) {
      console.log("Request was successful!");
    } else {
      console.error("Request failed with status:", response.status);
    }
    return result; // Return the result if needed
  } catch (error) {
    console.error(error);
    throw error; // Rethrow the error if needed
  }
};





export const OnboardingtimeZone = async (counteryData, uuid) => {
  console.log('counteryData: ', counteryData);
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  const raw = JSON.stringify(counteryData);

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch(`${API_BASE_URL}/onboarding/organization/${uuid}/`, requestOptions)
.then((response) => {
  return response.text();
})
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
};



export const OnboardingSubscription = async (subscriptionData, uuid) => {
  // let uuidSubData = JSON.parse(uuid);
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  const raw = JSON.stringify(subscriptionData);
  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  fetch(`${API_BASE_URL}/onboarding/subscription/${uuid}/`, requestOptions)
    .then((response) => {
      console.log('response: ', response);
      return response.text();
    })
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
};


export const requestDemoCreate = async (mainData) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  const raw = JSON.stringify(mainData); 
  console.log('raw: ', raw);
  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  try {
    const response = await fetch(`${API_BASE_URL}/onboarding/request_demo/`, requestOptions);
    const result = await response.text();
    console.log('result: ', result);
    return result;
  
  } catch (error) {
    console.error('Error:', error);
    return error.text().then(errorMessage => {
      console.error('Error Message:', errorMessage);
      throw new Error(errorMessage); 
    });
  }
};



export const onboardingNextStep = async (uuid) => {
  try {
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };
    
    const response = await fetch(`${API_BASE_URL}/onboarding/next_step/${uuid}/`, requestOptions);
    const result = await response.text();
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

