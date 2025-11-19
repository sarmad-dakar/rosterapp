import axios from 'axios';
import axiosInstance from '.';
import { API_ENDPOINTS } from './endpoints';

const getDynamicTableData = data => {
  return axiosInstance.post(API_ENDPOINTS.TABLE_DATA, data);
};

const getRosterEmployees = data => {
  return axiosInstance.post(API_ENDPOINTS.GET_ROSTER_EMPLOYEES, data);
};

const getRosterSchedules = data => {
  return axiosInstance.post(API_ENDPOINTS.GET_ROSTER_SCHEDULES, data);
};

const getDynamicForm = data => {
  return axios.post(
    'https://rosterapi.dakarhr.com/api/DynamicForm/details',
    data,
    {
      timeout: 40000,
    },
  );
};

export {
  getDynamicTableData,
  getRosterEmployees,
  getRosterSchedules,
  getDynamicForm,
};
