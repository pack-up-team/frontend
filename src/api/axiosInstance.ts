import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const instance = axios.create({
    baseURL,
    withCredentials: false,
});

export default instance;
