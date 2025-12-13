import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    // Add cache buster to all GET requests to prevent browser/SW caching
    if (config.method === 'get') {
        config.params = { ...config.params, _t: Date.now() };
    }

    return config;
});

export default api;
