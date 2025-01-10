import axios from 'axios';
import { useAuth } from './utils/useAuthUtils';

const http = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

http.interceptors.request.use((request) => {
    const token = localStorage.getItem("token");
    console.log(token);
    if(token) {
        request.headers.Authorization = `Bearer ${token}`;
    }
    return request; 
  });
  
  http.interceptors.response.use((response) => response,
    (error) => {
      if (error.response && error.response.status === 401 || error.response.status === 403) {
        const { handleAuthError } = useAuth();
        handleAuthError();
      }
      return Promise.reject(error)
    },
  )
  
export default http;