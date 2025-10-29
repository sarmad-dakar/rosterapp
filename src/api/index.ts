import axios from 'axios';
import { store } from '../redux/store';
import { BASE_URL } from './endpoints';
import { logout } from '../redux/slices/authSlice';

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
    const token = store.getState().auth?.token;
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
  async error => {
    // Handle response error (e.g., 4xx, 5xx)
    console.log(JSON.stringify(error), 'error');
    if (error.response) {
      // You can access the response status code, data, headers, etc.
      const { status, data } = error.response;
      console.log(data, 'error');
      // Handle specific error codes as needed
      if (status === 401) {
        await store.dispatch(logout());
        // return Promise.reject({message: 'Token Expired', status: 401});
        // Unauthorized: Redirect or handle accordingly
      } else if (status === 404) {
        // Resource not found: Handle accordingly
      } else {
        // Handle other error codes
        // You can log the error or display a user-friendly message
      }
      if (data.message) {
        return Promise.reject(data.message);
      }

      return Promise.reject(error);
    } else {
      // Handle network errors or other issues
      return Promise.reject(error);
    }
  },
);

export default axiosInstance;
