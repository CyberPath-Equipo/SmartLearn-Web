import axios from 'axios';

const api = axios.create({
  baseURL: '/smartlearn/api',
  headers: {
    'X-Client-Type': 'mobile'
  }
});

// Interceptor para inyectar el token en cada petición
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas 401 (Token expirado)
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login'; // Forzar logout
    }
    return Promise.reject(error);
  }
);

export default api;
