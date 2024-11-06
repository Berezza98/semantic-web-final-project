import axios from "axios";

const BASE_URL = 'http://localhost:3210';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});
