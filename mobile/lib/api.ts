import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// URL de l'API en production sur Render
const API_URL = 'https://expense-tracker-app-biq1.onrender.com';
const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use(async (config) => {
    const token = await SecureStore.getItemAsync('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
