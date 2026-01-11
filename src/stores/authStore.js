import cogoToast from "cogo-toast";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useRouter } from "vue-router";
import apiClient from "../services/apiClient";

export const useAuthStore = defineStore("auth", () => {
  const router = useRouter();

  const userEmail = ref(localStorage.getItem("pending_email") || "");
  const isAuthenticated = ref(!!localStorage.getItem("email"));

  //Login
  const login = async (email) => {
    try {
      const cleanEmail = String(email || "").trim();

      if (!cleanEmail) {
        cogoToast.error("Email is required");
        return;
      }

      await apiClient.post("/UserLogin", { UserEmail: cleanEmail });

      userEmail.value = cleanEmail;
      localStorage.setItem("pending_email", cleanEmail);

      cogoToast.success("OTP sent to your email");
      router.replace("/verify");
    } catch (e) {
      cogoToast.error(
        e?.response?.data?.data ||
          e?.response?.data?.message ||
          "Failed to send OTP"
      );
    }
  };

// Verify OTP
  const verifyOTP = async (otp) => {
    try {
      const cleanEmail = String(userEmail.value || "").trim();

      const cleanOtp = String(otp || "")
        .replace(/\D/g, "")
        .slice(0, 6);

      if (!cleanEmail) {
        cogoToast.error("Session expired. Please login again.");
        router.replace("/login");
        return;
      }

      if (cleanOtp.length !== 6) {
        cogoToast.error("OTP must be 6 digits");
        return;
      }

      await apiClient.post("/VerifyLogin", {
        UserEmail: cleanEmail,
        OTP: cleanOtp,
      });

      localStorage.setItem("email", cleanEmail);
      localStorage.removeItem("pending_email");

      isAuthenticated.value = true;
      userEmail.value = "";

      cogoToast.success("Login successful");
      router.replace("/");
    } catch (e) {
      cogoToast.error(
        e?.response?.data?.data ||
          e?.response?.data?.message ||
          "Invalid or expired OTP"
      );
    }
  };

   //Logout
  const logout = async () => {
    try {
      await apiClient.post("/logout");
    } catch (e) {
     } finally {
      localStorage.removeItem("email");
      localStorage.removeItem("pending_email");

      isAuthenticated.value = false;
      userEmail.value = "";

      cogoToast.success("Logged out");
      router.replace("/login");
    }
  };

  return {
    userEmail,
    isAuthenticated,
    login,
    verifyOTP,
    logout,
  };
});
