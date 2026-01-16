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

  //  backend expects header('id')
  const userId = ref(localStorage.getItem("user_id") || "");

  // jwt token
  const token = ref(localStorage.getItem("token") || "");

  const isAuthenticated = computed(() => !!token.value && !!userId.value);
  const authLoading = ref(false);

  // ----------------------------
  // Profile State
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
  // Login (send OTP)
  // ----------------------------
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

  // ----------------------------
  // Verify OTP (login)
  // ----------------------------
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
        //  Save email
        localStorage.setItem("email", email);
        savedEmail.value = email;

        // Save token (response এ token আছে)
        const t = res?.data?.token || "";
        if (t) {
          localStorage.setItem("token", t);
          token.value = t;
        } else {
          cogoToast.error("Token not found in response!");
          console.warn("VerifyLogin response:", res?.data);
          return false;
        }

        //  Save user id (response এ user.id আছে)
        const uid = res?.data?.user?.id || "";
        if (uid) {
          localStorage.setItem("user_id", String(uid));
          userId.value = String(uid);
        } else {
          cogoToast.error("User ID not found in response!");
          console.warn("VerifyLogin response:", res?.data);
          return false;
        }

        // clear pending
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

  // ----------------------------
  // Logout
  // ----------------------------
  const logout = async () => {
    try {
      await apiClient.post("/logout");
    } catch (e) {
      console.warn("Logout request failed (ignore):", e);
    } finally {
      localStorage.removeItem("email");
      localStorage.removeItem("pending_email");
      localStorage.removeItem("token");
      localStorage.removeItem("user_id");

      savedEmail.value = "";
      userEmail.value = "";
      token.value = "";
      userId.value = "";

      router.push("/login");
    }
  };

  // ----------------------------
  // Load Profile
  // ----------------------------
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
      cogoToast.error(error?.response?.data?.data || "Failed to load profile");
    } finally {
      profileLoading.value = false;
    }
  };

  // ----------------------------
  // Save Profile
  // ----------------------------
  const saveProfile = async () => {
    profileSaving.value = true;
    try {
      const res = await apiClient.post("/CreateProfile", { ...profile.value });

      const ok = res?.status === 200 && res?.data?.msg === "success";

      if (ok) {
        cogoToast.success("Profile saved successfully.");
        await loadProfile();
        return true;
      }

      cogoToast.error(res?.data?.data || "Save failed.");
      return false;
    } catch (error) {
      console.error("Error saving profile:", error);
      cogoToast.error(error?.response?.data?.data || "Save failed.");
      return false;
    } finally {
      profileSaving.value = false;
    }
  };

  return {
    // auth
    userEmail,
    savedEmail,
    userId,
    token,
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
