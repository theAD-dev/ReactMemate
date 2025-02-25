import { axiosInstance } from "../../../shared/lib/axios-instance";

export const getSession = async () => {
    const response = await axiosInstance.get('/api/v1/auth/session');
    return response.data;
};