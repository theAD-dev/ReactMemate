

  const API_BASE_URL = 'https://dev.memate.com.au/api/v1';

  export const calcDepartment = async () => {
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
            const response = await fetch(`${API_BASE_URL}/references/calc-indexes/`, requestOptions);
            const result = await response.json();
            return result; // Return the result if needed
          } catch (error) {
            console.error(error);
            throw error; // Rethrow the error if needed
          }
  };

  export const calcReferenceId = async (subItem) => {
    console.log('subItem: ', subItem);
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
  const response = await fetch(`${API_BASE_URL}/references/calculators/${subItem}/`, requestOptions);
  const result = await response.json();
  return result; // Return the result if needed
} catch (error) {
  console.error(error);
  throw error; // Rethrow the error if needed
}

};