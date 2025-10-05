import axios from "axios";
import { toast } from "react-hot-toast";

const axiosInstance = axios.create({
  baseURL: '/', // To work with Vite proxy which handles /api prefix
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage if it exists
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "An error occurred";
    
    // Handle different error status codes
    switch (error.response?.status) {
      case 401:
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem("token"); // ensure main token is also removed
        localStorage.removeItem("refreshToken");
        if (!window.location.pathname.endsWith('/login')) { // Avoid redirect loop
          window.location.href = "/login";
        }
        break;
      case 403:
        // Forbidden
        toast.error("You don't have permission to perform this action");
        break;
      case 404:
        // Not found
        toast.error("The requested resource was not found");
        break;
      case 500:
        // Server error
        toast.error("Server error. Please try again later");
        break;
      default:
        // Other errors
        toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
