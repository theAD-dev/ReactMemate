import { nanoid } from 'nanoid';

// Helper function to create FormData from input data
export const createFormData = (data, photo) => {
    const formData = new FormData();

    // Append user data
    formData.append("firstname", data.firstname);
    formData.append("lastname", data.lastname);
    formData.append("email", data.email);
    formData.append("phone", data.phone);

    if (data.category != "0") formData.append("category", data.category);
    formData.append("payment_terms", data.payment_terms);

    if(data.description) formData.append("description", data.description);

    // Append address data
    if (data.address.city) {
        formData.append("address.country", data.address.country);
        formData.append("address.title", data.address.title);
        formData.append("address.city", data.address.city);
        formData.append("address.address", data.address.address);
        formData.append("address.state", data.address.state);
        formData.append("address.postcode", data.address.postcode);
        if (data.address.id) formData.append("address.id", data.address.id);
    }

    // Append photo if it exists
    if (photo?.croppedImageBlob) {
        const photoHintId = nanoid(6);
        formData.append('photo', photo.croppedImageBlob, `${photoHintId}.jpg`);
    }

    return formData;
};

// Helper function to handle API requests with FormData
export const handleApiRequest = async (url, method, formData, onSuccess, onError) => {
    const accessToken = localStorage.getItem("access_token");

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            body: formData,
        });

        if (response.ok) {
            onSuccess(response);
        } else {
            const message = await response.json();
            onError(message);
        }
    } catch (error) {
        console.error("API request error:", error);
        onError();
    }
};