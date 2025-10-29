import axiosInstance from '.';
import { API_ENDPOINTS } from './endpoints';

const verifyDomain = data => {
  return axiosInstance.post(
    API_ENDPOINTS.VALIDATE_DOMAIN + '?domain=' + data.domain,
  );
};

const verifyLogin = data => {
  return axiosInstance.post(API_ENDPOINTS.LOGIN, data);
};

export { verifyDomain, verifyLogin };
