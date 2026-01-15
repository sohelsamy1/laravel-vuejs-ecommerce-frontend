<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/authStore";

const router = useRouter();
const authStore = useAuthStore();

const email = ref("");
const loading = ref(false);

const handleLogin = async () => {
  if (!email.value) {
    alert("Please enter email address");
    return;
  }

  loading.value = true;

  try {
      await authStore.login(email.value);

    router.push("/verify");
  } catch (error) {
    console.error("Login failed:", error?.response || error);
    alert(error?.response?.data?.message || "Login failed. Check console.");
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="login_register_wrap section">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-xl-6 col-md-10">
          <div class="login_wrap">
            <div class="padding_eight_all bg-white">
              <div class="heading_s1">
                <h3>Login</h3>
              </div>

              <form @submit.prevent="handleLogin">
                <div class="form-group mb-3">
                  <input
                    v-model.trim="email"
                    type="email"
                    required
                    class="form-control"
                    placeholder="Your Email"
                    :disabled="loading"
                  />
                </div>

                <div class="form-group mb-3">
                  <button
                    type="submit"
                    class="btn btn-fill-out btn-block"
                    :disabled="loading"
                  >
                    <span
                      v-if="loading"
                      class="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Next
                  </button>
                </div>
              </form>

              <!-- optional hint -->
              <!-- <small class="text-muted">We’ll send an OTP to your email.</small> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
