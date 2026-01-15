import cogoToast from "cogo-toast";
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import apiClient from "../services/apiClient";

export const useAuthStore = defineStore("auth", () => {
  const router = useRouter();

  // ----------------------------
  // Auth State
  // ----------------------------
  const userEmail = ref(localStorage.getItem("pending_email") || "");
  const savedEmail = ref(localStorage.getItem("email") || "");
  const isAuthenticated = computed(() => !!savedEmail.value);

  const authLoading = ref(false);

  // ----------------------------
  // Profile State (defaults)
  // ----------------------------
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

  // ----------------------------
  // Helpers
  // ----------------------------
  const showBackendValidationError = (e, fallbackMsg) => {
    const msg = e?.response?.data?.message;
    const errors = e?.response?.data?.errors;

    // show message
    cogoToast.error(msg || fallbackMsg);

    // show first validation error if exists
    if (errors && typeof errors === "object") {
      const firstKey = Object.keys(errors)[0];
      const firstErr = errors?.[firstKey]?.[0];
      if (firstErr) cogoToast.error(firstErr);
    }
  };

  // ----------------------------
  // Actions
  // ----------------------------

  //  Login (send OTP) - POST
  const login = async (email) => {
    if (!email) {
      cogoToast.error("Email is required");
      return false;
    }

    authLoading.value = true;
    try {
      const res = await apiClient.post("/UserLogin", { UserEmail: email });

      if (res?.status === 200) {
        userEmail.value = email;
        localStorage.setItem("pending_email", email);

        cogoToast.success(res?.data?.data || "OTP sent to your email");
        router.push("/verify");
        return true;
      }

      cogoToast.error(res?.data?.data || "Failed to send OTP");
      return false;
    } catch (e) {
      console.error(e);
      cogoToast.error(
        e?.response?.data?.errors?.UserEmail?.[0] ||
          e?.response?.data?.message ||
          "OTP send failed"
      );
      return false;
    } finally {
      authLoading.value = false;
    }
  };



  //  Verify OTP - POST
  // Try both payload formats because some backends want otp, some want OTP
const verifyOTP = async (otp) => {
  const email = userEmail.value || localStorage.getItem("pending_email") || "";

  if (!email) {
    cogoToast.error("Email not found. Please login again.");
    router.push("/login");
    return false;
  }

  if (!otp) {
    cogoToast.error("OTP is required");
    return false;
  }

  authLoading.value = true;

  try {
    const res = await apiClient.post("/VerifyLogin", {
      UserEmail: email,
      OTP: otp, 
    });

    if (res?.status === 200) {
      localStorage.setItem("email", email);
      savedEmail.value = email;

      localStorage.removeItem("pending_email");
      userEmail.value = "";

      cogoToast.success(res?.data?.data || "Login successful");
      router.push("/");
      return true;
    }

    cogoToast.error(res?.data?.data || "Failed to verify OTP");
    return false;
  } catch (e) {
    console.error(e);
    cogoToast.error(
      e?.response?.data?.errors?.OTP?.[0] ||
        e?.response?.data?.errors?.UserEmail?.[0] ||
        e?.response?.data?.message ||
        "OTP verification failed"
    );
    return false;
  } finally {
    authLoading.value = false;
  }
};



  // Logout (try POST, fallback GET)
  const logout = async () => {
    try {
      await apiClient.post("/logout");
    } catch (e1) {
      try {
        await apiClient.get("/logout");
      } catch (e2) {
        console.error(e2);
      }
    } finally {
      localStorage.removeItem("email");
      localStorage.removeItem("pending_email");

      savedEmail.value = "";
      userEmail.value = "";

      router.push("/login");
    }
  };

  //  Load Profile
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
      cogoToast.error(error?.response?.data?.message || "Failed to load profile");
    } finally {
      profileLoading.value = false;
    }
  };

  //  Save Profile
  const saveProfile = async () => {
    profileSaving.value = true;
    try {
      const payload = { ...profile.value };
      const res = await apiClient.post("/CreateProfile", payload);

      if (res?.data?.msg === "success") {
        cogoToast.success("Profile saved successfully.");
      } else {
        cogoToast.error(res?.data?.data || "Save failed.");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      cogoToast.error(error?.response?.data?.message || "Save failed.");
    } finally {
      profileSaving.value = false;
    }
  };

  return {
    // auth
    userEmail,
    savedEmail,
    isAuthenticated,
    authLoading,

    // actions
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
