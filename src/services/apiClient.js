import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api",
  timeout: 15000,
  withCredentials: false, 
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// ===============================
// Request Interceptor
// ===============================
apiClient.interceptors.request.use(
  (config) => {
    config.headers = config.headers || {};

    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

     const userId =
      localStorage.getItem("user_id") ||
      localStorage.getItem("id") ||
      localStorage.getItem("uid") ||
      "";

    if (userId) {
      config.headers["id"] = String(userId);
    }

    const email =
      localStorage.getItem("email") ||
      localStorage.getItem("user_email") ||
      "";

    if (email) {
      config.headers["email"] = String(email);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ===============================
// Response Interceptor
// ===============================
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error("Network error or server not responding");
      return Promise.reject(error);
    }

    if (error.response.status === 401) {
      console.warn("Unauthorized request (401)");

      // optional: auto logout
      // localStorage.removeItem("token");
      // localStorage.removeItem("user_id");
      // localStorage.removeItem("email");
      // window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default apiClient;
