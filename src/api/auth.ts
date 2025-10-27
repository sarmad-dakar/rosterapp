import axiosInstance from '.';
import { API_ENDPOINTS } from './endpoints';

const verifyDomain = data => {
  return axiosInstance.post(
    API_ENDPOINTS.VALIDATE_DOMAIN + '?domain=' + data.domain,
  );
};

const verifyLogin = () => {
  return axiosInstance.post(API_ENDPOINTS.LOGIN);
};

export { verifyDomain, verifyLogin };
