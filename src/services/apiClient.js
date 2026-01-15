import axios from "axios";

const apiClient = axios.create({
 
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api",

  withCredentials: true, 

  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },

  timeout: 15000, 
});

// ===============================
// Request Interceptor
// ===============================
apiClient.interceptors.request.use(
  (config) => {
    // 🔹 If later you move JWT to header, enable this
    // const token = localStorage.getItem("token");
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    return config;
  },
  (error) => Promise.reject(error)
);

// ===============================
// ✅ Response Interceptor
// ===============================
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Network / CORS / server down
    if (!error.response) {
      console.error("Network error or server not responding");
      return Promise.reject(error);
    }

    // Unauthorized (token expired etc.)
    if (error.response.status === 401) {
      console.warn("Unauthorized request");
      // optional: auto logout or redirect
      // localStorage.removeItem("email");
    }

    return Promise.reject(error);
  }
);

export default apiClient;

