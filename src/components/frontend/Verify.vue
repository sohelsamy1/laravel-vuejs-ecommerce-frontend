<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import cogoToast from "cogo-toast";
import { useAuthStore } from "../../stores/authStore";

const authStore = useAuthStore();
const router = useRouter();
const code = ref("");

const handleVerify = async () => {
  const otp = String(code.value).replace(/\D/g, "").slice(0, 6);

  if (otp.length !== 6) {
    cogoToast.error("OTP must be 6 digits");
    return;
  }

  const success = await authStore.verifyOTP(otp);

  if (success) {
    router.push("/cart"); // or "/"
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
                <h3>Verification</h3>
              </div>

              <form @submit.prevent="handleVerify">
                <div class="form-group mb-3">
                  <input
                    v-model="code"
                    type="text"
                    maxlength="6"
                    class="form-control"
                    placeholder="Enter 6 digit OTP"
                    inputmode="numeric"
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
