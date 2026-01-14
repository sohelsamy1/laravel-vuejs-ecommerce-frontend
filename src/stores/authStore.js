import cogoToast from "cogo-toast";
import { defineStore } from "pinia";
import { ref } from "vue";
import apiClient from "../services/apiClient";

// ✅ Store এর ভিতরে useRouter() avoid করি
// Router push করার জন্য window.location বা import router ব্যবহার করবো (recommended)
// যদি তুমি router instance export করে থাকো (src/router/index.js থেকে), তাহলে নিচের line use করো:
// import router from "../router";

export const useAuthStore = defineStore("auth", () => {
  // ===== States =====
  const userEmail = ref(localStorage.getItem("email") || "");
  const isAuthenticated = ref(!!localStorage.getItem("token"));

  // ========= Profile State =========
  const profile = ref({
    cus_name: "",
    cus_add: "",
    cus_city: "",
    cus_state: "",
    cus_postcode: "",
    cus_country: "",
    cus_phone: "",
    cus_fax: "",
    ship_name: "",
    ship_add: "",
    ship_city: "",
    ship_state: "",
    ship_postcode: "",
    ship_country: "",
    ship_phone: "",
  });

  const profileLoading = ref(false);
  const profileSaving = ref(false);

  // ✅ small helper
  const go = (path) => {
    // ✅ Best: router import করলে router.push(path)
    // router.push(path);

    // ✅ Simple fallback (সবসময় কাজ করবে)
    window.location.href = path;
  };

  // ✅ Login (Send OTP) - POST /UserLogin
  const login = async (email) => {
    try {
      if (!email) return cogoToast.error("Please enter email");

      const res = await apiClient.post("/UserLogin", {
        UserEmail: email, // ✅ backend key
      });

      if (res.status === 200) {
        userEmail.value = email;

        // ✅ localStorage এ email save করো, না হলে refresh দিলে userEmail হারাবে
        localStorage.setItem("email", email);

        cogoToast.success(res?.data?.data || "OTP sent to your email");
        go("/verify");
      } else {
        cogoToast.error(res?.data?.data || "Failed to send OTP");
      }
    } catch (e) {
      console.log("LOGIN ERROR:", e?.response?.status, e?.response?.data);
      cogoToast.error(e?.response?.data?.message || "Something went wrong");
    }
  };

  // ✅ Verify OTP - POST /VerifyLogin
  const verifyOTP = async (otp) => {
    try {
      // ✅ refresh / direct verify page open করলে userEmail.value empty হতে পারে
      const email = userEmail.value || localStorage.getItem("email") || "";

      if (!email) {
        cogoToast.error("Email missing, please login again.");
        go("/login");
        return false;
      }
      if (!otp) {
        cogoToast.error("Please enter OTP");
        return false;
      }

      const res = await apiClient.post("/VerifyLogin", {
        UserEmail: email,
        OTP: otp,
      });

      if (res.status === 200) {
        // ✅ token extract (support multiple shapes)
        const token =
          res?.data?.token ||
          res?.data?.data?.token ||
          res?.data?.access_token ||
          res?.data?.data?.access_token;

        // ✅ যদি backend token না দেয়, তাহলে atleast logged-in flag set করার অপশন রাখতে পারো
        // কিন্তু cart/profile protected হলে token দরকার হবেই।
        if (!token) {
          console.log("Verify response (no token):", res.data);
          cogoToast.error("Token not found from server! Backend token return লাগবে.");
          return false;
        }

        localStorage.setItem("token", token);
        localStorage.setItem("email", email);

        userEmail.value = email;
        isAuthenticated.value = true;

        cogoToast.success(res?.data?.data || "Login successful");
        go("/cart");
        return true;
      }

      cogoToast.error(res?.data?.data || "Failed to verify OTP");
      return false;
    } catch (e) {
      console.log("VERIFY ERROR:", e?.response?.status, e?.response?.data);
      cogoToast.error(e?.response?.data?.message || "Something went wrong");
      return false;
    }
  };

  // ✅ Logout - POST /logout (protected)
  const logout = async () => {
    try {
      await apiClient.post("/logout").catch(() => {});
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("email");

      userEmail.value = "";
      isAuthenticated.value = false;

      go("/login");
    }
  };

  // Load Profile
  const loadProfile = async () => {
    profileLoading.value = true;
    try {
      const res = await apiClient.get("/ReadProfile");
      const data = res?.data?.data || null;

      if (data) {
        profile.value = {
          ...profile.value,
          ...Object.fromEntries(
            Object.entries(data).map(([k, v]) => [k, v ?? ""])
          ),
        };
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      cogoToast.error("Failed to load profile.");
    } finally {
      profileLoading.value = false;
    }
  };

  // Save Profile
  const saveProfile = async () => {
    profileSaving.value = true;
    try {
      const payload = { ...profile.value };
      const res = await apiClient.post("/CreateProfile", payload);

      if (res?.data?.msg === "success") {
        cogoToast.success("Profile saved successfully.");
      } else {
        cogoToast.error("Save failed.");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      cogoToast.error("Save failed.");
    } finally {
      profileSaving.value = false;
    }
  };

  return {
    userEmail,
    isAuthenticated,
    login,
    verifyOTP,
    logout,
    profile,
    profileLoading,
    profileSaving,
    loadProfile,
    saveProfile,
  };
});
