import { axiosInstance } from "../../../shared/lib/axios-instance";

export const getSession = async () => {
    const response = await axiosInstance.get('/profile/');
    return response.data;
};