import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api",
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// ✅ Public endpoints (token লাগবে না)
const PUBLIC_ENDPOINTS = [
  "/UserLogin",
  "/VerifyLogin",
  "/CategoryList",
  "/BrandList",
  "/ListProduct",
  "/ProductDetailsById",
  "/ListProductSlider",
  "/PolicyByType",
  "/ListReviewByProduct",
];

// helper: url normalize
const normalizeUrl = (url = "") => {
  // axios config.url সাধারণত "/VerifyLogin" বা "VerifyLogin" হতে পারে
  if (!url) return "";
  const u = String(url);
  return u.startsWith("/") ? u : `/${u}`;
};

const isPublicEndpoint = (url = "") => {
  const u = normalizeUrl(url);
  // ✅ exact match / startsWith match (query থাকলেও safe)
  return PUBLIC_ENDPOINTS.some((p) => u === p || u.startsWith(`${p}?`) || u.startsWith(`${p}/`));
};

// ===============================
// Request Interceptor
// ===============================
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    const url = config?.url || "";

    // headers safe copy
    config.headers = config.headers || {};

    // ✅ Only attach token for protected routes
    if (token && !isPublicEndpoint(url)) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // ✅ public হলে remove
      if ("Authorization" in config.headers) delete config.headers.Authorization;
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
    // Network / CORS / server down
    if (!error?.response) {
      console.error("Network error or server not responding");
      return Promise.reject(error);
    }

    const status = error.response.status;

    if (status === 401) {
      console.warn("Unauthorized request (401)");

      // ✅ Optional auto-logout (চাইলে uncomment করো)
      // localStorage.removeItem("token");
      // localStorage.removeItem("email");
      // window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default apiClient;
