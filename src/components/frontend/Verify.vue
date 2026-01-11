<script setup>
import { ref } from "vue";
import cogoToast from "cogo-toast";
import { useAuthStore } from "../../stores/authStore";

const authStore = useAuthStore();
const code = ref("");

const handleVerify = async () => {
  const cleaned = String(code.value || "")
    .replace(/\D/g, "")
    .slice(0, 6);

  if (cleaned.length !== 6) {
    cogoToast.error("OTP must be 6 digits");
    return;
  }

  await authStore.verifyOTP(cleaned);
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
                <h3>Verification</h3>
              </div>

              <form @submit.prevent="handleVerify">
                <div class="form-group mb-3">
                  <input
                    v-model="code"
                    type="text"
                    inputmode="numeric"
                    maxlength="6"
                    class="form-control"
                    placeholder="Enter 6 digit OTP"
                    autocomplete="one-time-code"
                  />
                </div>

                <div class="form-group mb-3">
                  <button type="submit" class="btn btn-fill-out btn-block">
                    Confirm
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

<style scoped></style>
