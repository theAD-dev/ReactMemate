const API_BASE_URL = 'https://dev.memate.com.au/api/v1';



  export const clientsBusinessNewCreate = async (mainData) => {
    const myHeaders = new Headers();
    const accessToken = sessionStorage.getItem("access_token");
    myHeaders.append("Authorization", `Bearer ${accessToken}`);
    myHeaders.append("Content-Type", "application/json"); 
  
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(mainData), // Serialize formData directly here
      redirect: "follow"
    };
  
    try {
      const response = await fetch(`${API_BASE_URL}/clients/business/new/`, requestOptions);
      const result = await response.text();
      return result; // Return the result if needed
    } catch (error) {
      console.error(error);
      throw error; // Rethrow the error if needed
    }
  };


  export const clientsIndividualClient = async (mainData) => {
    const myHeaders = new Headers();
    const accessToken = sessionStorage.getItem("access_token");
    myHeaders.append("Authorization", `Bearer ${accessToken}`);
    myHeaders.append("Content-Type", "application/json"); 
  
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(mainData), // Serialize formData directly here
      redirect: "follow"
    };
  
    try {
      const response = await fetch(`${API_BASE_URL}/clients/individual/new/`, requestOptions);
      const result = await response.text();
      return result; // Return the result if needed
    } catch (error) {
      console.error(error);
      throw error; // Rethrow the error if needed
    }
  };



  export const newQuoteClientList = async (limit,offset) => {
      const myHeaders = new Headers();
      const accessToken = sessionStorage.getItem("access_token");
      myHeaders.append("Authorization", `Bearer ${accessToken}`);
      myHeaders.append("Content-Type", "application/json"); 
    
      const requestOptions = {
        method: "GET",
        headers: myHeaders,

        redirect: "follow"
      };
    
      try {
        const url = new URL(`${API_BASE_URL}/clients`);
        url.searchParams.append("limit", limit);
        url.searchParams.append("offset", offset);
        const response = await fetch(url, requestOptions);
        const result = await response.json();
        return result; // Return the result if needed
      } catch (error) {
        console.error(error);
        throw error; // Rethrow the error if needed
      }
};


export const newQuoteClientListids = async (id) => {
  const myHeaders = new Headers();
  const accessToken = sessionStorage.getItem("access_token");
  myHeaders.append("Authorization", `Bearer ${accessToken}`);
  myHeaders.append("Content-Type", "application/json"); 

  const requestOptions = {
    method: "GET",
    headers: myHeaders,

    redirect: "follow"
  };

  try {
    const response = await fetch(`${API_BASE_URL}/clients/${id}`, requestOptions);
    const result = await response.json();
    return result; // Return the result if needed
  } catch (error) {
    console.error(error);
    throw error; // Rethrow the error if needed
  }
};


  export const SearchClientList = async (query) => {
      const myHeaders = new Headers();
      const accessToken = sessionStorage.getItem("access_token");
      myHeaders.append("Authorization", `Bearer ${accessToken}`);
      myHeaders.append("Content-Type", "application/json"); 
    
      const requestOptions = {
        method: "GET",
        headers: myHeaders,

        redirect: "follow"
      };
    
      try {
        const response = await fetch(`${API_BASE_URL}/clients/?name=${query}`, requestOptions);
        const result = await response.json();
        return result; // Return the result if needed
      } catch (error) {
        console.error(error);
        throw error; // Rethrow the error if needed
      }

};





