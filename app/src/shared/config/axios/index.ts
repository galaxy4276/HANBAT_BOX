import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000,
});

export const downloadClient = axios.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: undefined,
});

apiClient.interceptors.response.use((res) => {
  if (res.data?.data) {
    return res.data.data;
  }

  return res.data;
});
