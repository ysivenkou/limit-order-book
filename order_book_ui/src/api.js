import axios from 'axios';
import {redirect} from "react-router-dom";

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
});

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            console.log("No token")
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                const response = await api.post('/token/refresh/', {refresh: refreshToken});
                const accessToken = response.data.access;

                localStorage.setItem('accessToken', accessToken);

                // Retry the original request with the new token
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return axios(originalRequest);
            } catch (error) {
                localStorage.clear()
                window.location.href = "/login"
            }
        }

        return Promise.reject(error);
    }
);

export default api;
