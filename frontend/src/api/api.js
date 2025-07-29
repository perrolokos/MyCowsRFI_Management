import axios from 'axios';

// La URL base debe apuntar a tu backend de Django.
// Es recomendable usar variables de entorno para esto.
const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';

const api = axios.create({
    baseURL: API_URL,
});

// Interceptor para inyectar el token de autenticación en cada petición
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;