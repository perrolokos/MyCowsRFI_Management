
import axios from 'axios';

// Crea una instancia de Axios con la URL base de tu API
const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api', // Asegúrate de que coincida con tu backend
});

// Interceptor de peticiones: se ejecuta ANTES de cada petición
// Aquí es donde inyectamos el token de autenticación
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            // Si el token existe, lo añadimos a la cabecera 'Authorization'
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // Si hay un error en la configuración de la petición, lo rechazamos
        return Promise.reject(error);
    }
);

export default api;
