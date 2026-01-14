import cogoToast from "cogo-toast";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useRouter } from "vue-router";
import apiClient from "../services/apiClient";

export const useAuthStore = defineStore("auth", () => {
  const router = useRouter();
  // States
  const userEmail = ref("");
  const isAuthenticated = ref(localStorage.getItem("email") ?? false);

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

  // ============== Actions =======================

  // Login
  const login = async (email) => {
    try {
      const res = await apiClient.get(`/UserLogin/${email}`);
      //   console.log(res);
      if (res.status === 200) {
        userEmail.value = email;
        cogoToast.success(res.data.data || "OTP sent to your email");
        router.push("/verify");
      } else {
        cogoToast.error(res.data.data || "Failed to send OTP");
      }
    } catch (e) {
      cogoToast.error("Something went wrong");
    }
  };

  // Verify OTP
  const verifyOTP = async (otp) => {
    try {
      const res = await apiClient.get(`/VerifyLogin/${userEmail.value}/${otp}`);
      console.log(res);
      if (res.status === 200) {
        localStorage.setItem("email", userEmail.value);
        isAuthenticated.value = userEmail.value;
        cogoToast.success(res.data.data || "Login successfull");
        router.push("/");
      } else {
        cogoToast.error(res.data.data || "Failed to verify OTP");
      }
    } catch (e) {
      cogoToast.error("Something went wrong");
    }
  };

  // Logout
  const logout = async () => {
    try {
      await apiClient.get("/logout");
      localStorage.removeItem("email");
      router.push("/login");
    } catch (e) {
      cogoToast.error("Something went wrong");
    }
  };

  // Load Profile
  const loadProfile = async () => {
    profileLoading.value = true;
    try {
      const res = await apiClient.get("/ReadProfile");
      const data = res?.data?.data || null;
      if (data) {
        // merge with defaults to avoid missing keys
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
    // Login States
    userEmail,
    isAuthenticated,

    // Login Actions
    login,
    verifyOTP,
    logout,

    // profile
    profile,
    profileLoading,
    profileSaving,
    loadProfile,
    saveProfile,
  };
});
