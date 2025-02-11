import { fetchAPI } from "./base-api";
const API_BASE_URL = process.env.REACT_APP_BACKEND_API_URL;

// Onboarding API endpoints
export const OnboardingCreateApi = async (data) => {
  const endpoint = `/onboarding/create/user/`;
  const options = {
    method: "POST",
    body: data,
    headers: {
      "Content-Type": "application/json",
    },
  };
  return fetchAPI(`${API_BASE_URL}${endpoint}`, options, false);
};

export const onboardingNextStep = async (uuid) => {
  const endpoint = `/onboarding/next-step/${uuid}/`;
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  return fetchAPI(`${API_BASE_URL}${endpoint}`, options, false);
};

export const OnboardingCode = async (otpCode, uuid) => {
  const endpoint = `/onboarding/verify/user/${uuid}/`;
  const options = {
    method: "PUT",
    body: { code: otpCode },
    headers: {
      "Content-Type": "application/json",
    },
  };
  return fetchAPI(`${API_BASE_URL}${endpoint}`, options, false);
};

export const OnboardingCreateOrganisation = async (uuid, data) => {
  const endpoint = `/onboarding/create/organization/${uuid}/`;
  const options = {
    method: "POST",
    body: data,
    headers: {
      "Content-Type": "application/json",
    },
  };
  return fetchAPI(`${API_BASE_URL}${endpoint}`, options, false);
};

export const OnboardingCreateSubscription = async (uuid, data) => {
  const endpoint = `/onboarding/create/subscription/${uuid}/`;
  const options = {
    method: "POST",
    body: data,
    headers: {
      "Content-Type": "application/json",
    },
  };
  return fetchAPI(`${API_BASE_URL}${endpoint}`, options, false);
};

export const OnboardingCreatePassword = async (uuid, data) => {
  const endpoint = `/onboarding/create/password/${uuid}/`;
  const options = {
    method: "POST",
    body: data,
    headers: {
      "Content-Type": "application/json",
    },
  };
  return fetchAPI(`${API_BASE_URL}${endpoint}`, options, false);
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




