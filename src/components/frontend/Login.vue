<script setup>
import { ref } from "vue";
import { useAuthStore } from "../../stores/authStore";

const email = ref("");
const authStore = useAuthStore();

const handleLogin = async () => {
  if (!email.value) {
    alert("Please enter email address");
    return;
  }

  try {
    await authStore.login(email.value);
    console.log("Login request sent");
  } catch (error) {
    console.error("Login failed:", error.response || error);
    alert("Login failed. Check console.");
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
                    v-model="email"
                    type="email"
                    required
                    class="form-control"
                    placeholder="Your Email"
                  />
                </div>

                <div class="form-group mb-3">
                  <button
                    type="submit"
                    class="btn btn-fill-out btn-block"
                  >
                    Next
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
