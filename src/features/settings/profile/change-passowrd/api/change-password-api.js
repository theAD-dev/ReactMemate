import { axiosInstance } from "../../../../../shared/lib/axios-instance";

export const changePassword = async ({ current_password, new_password }) => {
    try {
        const response = await axiosInstance.post('/profile/update-password/', {
            current_password,
            new_password
        });
        return response.data;
    } catch (error) {
        console.error('Error updating password' || error.response?.data || error.message);
        throw error;
    }
};
