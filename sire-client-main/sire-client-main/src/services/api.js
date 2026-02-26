import axios from "axios";
import config from "./config";


const SESSION_STORAGE_KEY = "userSession";

const api = axios.create({
    baseURL: config.baseUrl,
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use((config) => {
    const session = JSON.parse(localStorage.getItem(SESSION_STORAGE_KEY));
    const token =  session ? session.token : null;
    if (token) {
        config.headers['Authorization'] = `JWT ${token}`;
    }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

export default api;
