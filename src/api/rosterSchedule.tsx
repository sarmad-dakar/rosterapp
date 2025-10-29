import axiosInstance from '.';
import { API_ENDPOINTS } from './endpoints';

const getDynamicTableData = data => {
  return axiosInstance.post(API_ENDPOINTS.TABLE_DATA, data);
};

const getRosterEmployees = data => {
  return axiosInstance.post(API_ENDPOINTS.GET_ROSTER_EMPLOYEES, data);
};

export { getDynamicTableData, getRosterEmployees };
