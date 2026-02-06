import axios from 'axios';

const API_BASE_URL = 'https://api.dymacademy.xyz/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Authentication API
export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData)
};

// Councils API
export const councilsAPI = {
    getAll: () => api.get('/councils'),
    getById: (id) => api.get(`/councils/${id}`),
    create: (councilData) => api.post('/councils', councilData),
    update: (id, councilData) => api.put(`/councils/${id}`, councilData),
    delete: (id) => api.delete(`/councils/${id}`),
    searchNearest: (address) => api.post('/councils/search', { address })
};

export default api;
