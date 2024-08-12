const API_BASE_URL = 'https://dev.memate.com.au/api/v1';

export const getManagement = async () => {
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
        const response = await fetch(`${API_BASE_URL}/management/`, requestOptions);
        const result = await response.json();
        return result; // Return the result if needed
    } catch (error) {
        console.error(error);
        throw error; // Rethrow the error if needed
    }
}



export const ProjectCardApi = async (uniqueId) => {
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
        const response = await fetch(`${API_BASE_URL}/project-card/${uniqueId}/`, requestOptions);
        const result = await response.json();
        return result; // Return the result if needed
    } catch (error) {
        console.error(error);
        throw error; // Rethrow the error if needed
    }
}

export const cardScheduleUpdateApi = async (uniqueId) => {
    const myHeaders = new Headers();
    const accessToken = sessionStorage.getItem("access_token");
    myHeaders.append("Authorization", `Bearer ${accessToken}`);
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        redirect: "follow"
    };

    try {
        const response = await fetch(`${API_BASE_URL}/project-card/schedule/${uniqueId}/`, requestOptions);
        const result = await response.text();
        console.log('result>>>>>>>>>>: ', result);
        return result; // Return the result if needed
    } catch (error) {
        console.error(error);
        throw error; // Rethrow the error if needed
    }
}




