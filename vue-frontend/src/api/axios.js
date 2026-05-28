import axios from 'axios';

const api = axios.create({
  baseURL: 'https://marco-des.mexicocentral.cloudapp.azure.com/smartlearn/api',
  headers: {
    'X-Client-Type': 'mobile'
  }
});

// Interceptor para inyectar el token en cada petición
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (refreshToken) {
      config.headers['X-Refresh-Token'] = refreshToken;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Helper para extraer y guardar un nuevo token si el backend lo envía
const checkNewToken = (headers) => {
  if (headers && headers['x-new-access-token']) {
    const newToken = headers['x-new-access-token'];
    localStorage.setItem('token', newToken);
    // Para actualizar el state local si estamos en la misma pestaña
    // aunque Pinia lo lee del localStorage al iniciar.
  }
};

// Interceptor para manejar respuestas 401 (Token expirado)
api.interceptors.response.use(
  response => {
    checkNewToken(response.headers);
    return response;
  },
  error => {
    if (error.response) {
      checkNewToken(error.response.headers);
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/web/login'; // Forzar logout
      }
    }
    return Promise.reject(error);
  }
);

export default api;
