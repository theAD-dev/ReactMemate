// const API_BASE_URL = 'https://dev.memate.com.au/api/v1';



// export const fetchCalcIndexes = async () => {
//     const myHeaders = new Headers();
//     const accessToken = localStorage.getItem("access_token");
//     myHeaders.append("Authorization", `Bearer ${accessToken}`);
  
//     const requestOptions = {
//       method: "GET",
//       headers: myHeaders,
//       redirect: "follow"
//     };
  
//     try {
//       const response = await fetch("https://dev.memate.com.au/api/v1/references/calc-indexes/", requestOptions);
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const result = await response.text();

//       console.log(result);
//       return result;
//     } catch (error) {
//       console.error('Error fetching calc indexes:', error);
//       throw error;
//     }
//   };
  


// export const fetchCalcIndexesAdd = async () => {
//     const myHeaders = new Headers();
//     const accessToken = localStorage.getItem("access_token");
//     myHeaders.append("Authorization", `Bearer ${accessToken}`);
//     myHeaders.append("Content-Type", "application/json"); 
  
//     const raw = JSON.stringify([
//         {
//           "id": 0,
//           "name": "string",
//           "subindexes": [
//             {
//               "id": 0,
//               "name": "string"
//             }
//           ]
//         }
//       ]);
      
//       const requestOptions = {
//         method: "GET",
//         headers: myHeaders,
//         body: raw,
//         redirect: "follow"
//       };
      
//       fetch(`${API_BASE_URL}/references/calculators/136/`, requestOptions)
//         .then((response) => response.text())
//         .then((result) => console.log(result))
//         .catch((error) => console.error(error));
//   }
  




