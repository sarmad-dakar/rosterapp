import axios from 'axios';
import { store } from '../redux/store';
import { BASE_URL } from './endpoints';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  config => {
    // You can add authorization tokens or other headers here
    const token = store.getState().user?.token;
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    // Handle errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      return Promise.reject(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      return Promise.reject(error.message);
    }
  },
);

export default axiosInstance;
