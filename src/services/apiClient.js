import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
//   withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  // We are not using token based authentication in this project
  // const token = localStorage.getItem("token");

  // if (token) {
  // For Laravel Sanctum authentication
  //   config.headers.Authorization = `Bearer ${token}`;
  // }

  return config;
});

export default apiClient;
