import axios from 'axios';
import { localForage } from '../services';

const axiosClient = axios.create();

axiosClient.defaults.baseURL = (process.env.NODE_ENV === 'production') ? process.env.REACT_APP_LIVE_BASEURL : process.env.REACT_APP_DEV_BASEURL;

axiosClient.interceptors.response.use(
  res => res,
  err => {
    if (err && err.response.status === 419) {
      localForage.clear().then(() => {
        window.location.href = 'https://mile9ine.com';
      }).catch((e) => {
        console.error('Error clearing localForage', e);
      });
    }
    console.log('Err:', err);
    throw err;
  }
);

axiosClient.defaults.headers = {
  'Content-Type': 'application/json',
  Accept: 'application/json'
};

axiosClient.defaults.withCredentials = false;

export const getRequest = axiosClient.get;
export const postRequest = axiosClient.post;
export const deleteRequest = axiosClient.delete;

export default axiosClient;

