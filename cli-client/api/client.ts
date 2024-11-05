import axios from "axios";
import { loader } from "../loader";

const BASE_URL = 'http://localhost:3210';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

apiClient.interceptors.request.use(function (config) {
  // Do something before request is sent
  loader.show();
  return config;
}, function (error) {
  // Do something with request error
  loader.hide();
  return Promise.reject(error);
});

// Add a response interceptor
apiClient.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  loader.hide();
  return response;
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  loader.hide();
  return Promise.reject(error);
});
