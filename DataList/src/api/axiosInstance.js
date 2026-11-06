import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.xsrfCookieName = 'XSRF-TOKEN'; // Cambia por el nombre que use tu backend (ej. '_csrf')
axios.defaults.xsrfHeaderName = 'X-XSRF-TOKEN'; // El header estándar que espera el backend

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api/v1/',
    withCredentials: true, 
});

export default axiosInstance;