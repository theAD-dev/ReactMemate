const API_BASE_URL = 'https://dev.memate.com.au/api/v1';

export const SettingsGeneralInformation = async () => {

            const myHeaders = new Headers();
            const accessToken = sessionStorage.getItem("access_token");
            myHeaders.append("Authorization", `Bearer ${accessToken}`);
          
            const requestOptions = {
              method: 'GET',
              headers: myHeaders,
              redirect: 'follow'
            };
          
            try {
              const response = await fetch(`${API_BASE_URL}/settings/organization/general/`, requestOptions);
              const result = await response.text();
              return result;
            } catch (error) {
              console.error('Profile fetch error:', error);
              throw error;
            }
  };


  export const updateGeneralInformation = async (generalData) => {
    const myHeaders = new Headers();
    const accessToken = sessionStorage.getItem("access_token");
    myHeaders.append("Authorization", `Bearer ${accessToken}`);

    const formData = new FormData();
    Object.keys(generalData).forEach((key) => {
        formData.append(key, generalData[key]);
    });

    const requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: formData,
        redirect: 'follow'
    };

    try {
        const response = await fetch(`${API_BASE_URL}/settings/organization/general/`, requestOptions);
        const result = await response.text();
        console.log('result: ', result);
        return result;
    } catch (error) {
        console.error('Profile fetch error:', error);
        throw error;
    }
};



// Bank

export const SettingsBankInformation = async () => {

  const myHeaders = new Headers();
  const accessToken = sessionStorage.getItem("access_token");
  myHeaders.append("Authorization", `Bearer ${accessToken}`);

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  try {
    const response = await fetch(`${API_BASE_URL}/settings/organization/bank/`, requestOptions);
    const result = await response.text();
    return result;
  } catch (error) {
    console.error('Profile fetch error:', error);
    throw error;
  }
};



export const updateBankInformation = async (generalData) => {
  const myHeaders = new Headers();
  const accessToken = sessionStorage.getItem("access_token");
  myHeaders.append("Authorization", `Bearer ${accessToken}`);

  const formData = new FormData();
  Object.keys(generalData).forEach((key) => {
      formData.append(key, generalData[key]);
  });

  const requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: formData,
      redirect: 'follow'
  };

  try {
      const response = await fetch(`${API_BASE_URL}/settings/organization/bank/`, requestOptions);
      const result = await response.text();
      console.log('result: ', result);
      return result;
  } catch (error) {
      console.error('Profile fetch error:', error);
      throw error;
  }
};