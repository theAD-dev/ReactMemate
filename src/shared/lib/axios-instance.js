import axios from 'axios';
import { toast } from 'sonner';

const API_BASE_URL = process.env.REACT_APP_BACKEND_API_URL;

export const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 300000
});

axiosInstance.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) config.headers['Authorization'] = `Bearer ${accessToken}`;
    return config;
}, (error) => Promise.reject(error));

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const { response } = error;
        if (response && response.status === 403) {
            console.error('Permission denied: You do not have access to this resource.');
            window.location.href = '/403';
        }
        // if (response && response.status === 401) {
        //     console.error('Session expired. Please log in again.');
        //     localStorage.clear();
        //     window.location.href = '/login';
        // }
        if (error.code === 'ECONNABORTED') {
            console.error('Request timeout: The server took too long to respond.');
            toast.error('Request timeout. Please try again later.');
        }

        return Promise.reject(error);
    }
);