<template>
  <AppLayout>

     <div class="container mt-5">
      <div class="row">
        <div class="col-12">
          <!-- Tabs -->
          <ul class="nav nav-tabs" id="myTab" role="tablist">
            <li class="nav-item" role="presentation">
              <button
                type="button"
                @click="navigateToProfile"
                class="nav-link"
                :class="{ active: $route.path === '/profile' }"
              >
                Profile
              </button>
            </li>

            <li class="nav-item" role="presentation">
              <button
                type="button"
                @click="navigateToOrders"
                class="nav-link"
                :class="{ active: $route.path === '/orders' }"
              >
                Orders
              </button>
            </li>
          </ul>

          <!-- Tab Content -->
          <div class="tab-content" id="myTabContent">
            <!-- Profile Tab Pane -->
            <div
              class="tab-pane"
              :class="{ 'show active': $route.path === '/profile' }"
              id="profile-tab-pane"
              role="tabpanel"
              tabindex="0"
            >
              <!-- Loading state -->
              <div v-if="auth.profileLoading" class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-3">Loading profile...</p>
              </div>

              <!-- Profile not ready (null safety) -->
              <div v-else-if="!profileReady" class="text-center py-5">
                <p class="mb-0">Profile data not available.</p>
              </div>

              <!-- Profile Form -->
              <div v-else class="container-fluid">
                <div class="row">
                  <div class="col-md-3 p-2">
                    <label class="form-label">Customer Name</label>
                    <input
                      v-model="auth.profile.cus_name"
                      type="text"
                      class="form-control form-control-sm"
                    />
                  </div>

                  <div class="col-md-3 p-2">
                    <label class="form-label">Customer Address</label>
                    <input
                      v-model="auth.profile.cus_add"
                      type="text"
                      class="form-control form-control-sm"
                    />
                  </div>

                  <div class="col-md-3 p-2">
                    <label class="form-label">Customer City</label>
                    <input
                      v-model="auth.profile.cus_city"
                      type="text"
                      class="form-control form-control-sm"
                    />
                  </div>

                  <div class="col-md-3 p-2">
                    <label class="form-label">Customer State</label>
                    <input
                      v-model="auth.profile.cus_state"
                      type="text"
                      class="form-control form-control-sm"
                    />
                  </div>

                  <div class="col-md-3 p-2">
                    <label class="form-label">Customer Post Code</label>
                    <input
                      v-model="auth.profile.cus_postcode"
                      type="text"
                      class="form-control form-control-sm"
                    />
                  </div>

                  <div class="col-md-3 p-2">
                    <label class="form-label">Customer Country</label>
                    <input
                      v-model="auth.profile.cus_country"
                      type="text"
                      class="form-control form-control-sm"
                    />
                  </div>

                  <div class="col-md-3 p-2">
                    <label class="form-label">Customer Phone</label>
                    <input
                      v-model="auth.profile.cus_phone"
                      type="text"
                      class="form-control form-control-sm"
                    />
                  </div>

                  <div class="col-md-3 p-2">
                    <label class="form-label">Customer Fax</label>
                    <input
                      v-model="auth.profile.cus_fax"
                      type="text"
                      class="form-control form-control-sm"
                    />
                  </div>
                </div>

                <hr />

                <div class="row">
                  <div class="col-md-3 p-2">
                    <label class="form-label">Shipping Name</label>
                    <input
                      v-model="auth.profile.ship_name"
                      type="text"
                      class="form-control form-control-sm"
                    />
                  </div>

                  <div class="col-md-3 p-2">
                    <label class="form-label">Shipping Address</label>
                    <input
                      v-model="auth.profile.ship_add"
                      type="text"
                      class="form-control form-control-sm"
                    />
                  </div>

                  <div class="col-md-3 p-2">
                    <label class="form-label">Shipping City</label>
                    <input
                      v-model="auth.profile.ship_city"
                      type="text"
                      class="form-control form-control-sm"
                    />
                  </div>

                  <div class="col-md-3 p-2">
                    <label class="form-label">Shipping State</label>
                    <input
                      v-model="auth.profile.ship_state"
                      type="text"
                      class="form-control form-control-sm"
                    />
                  </div>

                  <div class="col-md-3 p-2">
                    <label class="form-label">Shipping Post Code</label>
                    <input
                      v-model="auth.profile.ship_postcode"
                      type="text"
                      class="form-control form-control-sm"
                    />
                  </div>

                  <div class="col-md-3 p-2">
                    <label class="form-label">Shipping Country</label>
                    <input
                      v-model="auth.profile.ship_country"
                      type="text"
                      class="form-control form-control-sm"
                    />
                  </div>

                  <div class="col-md-3 p-2">
                    <label class="form-label">Shipping Phone</label>
                    <input
                      v-model="auth.profile.ship_phone"
                      type="text"
                      class="form-control form-control-sm"
                    />
                  </div>
                </div>

                <hr />

                <div class="row align-items-center">
                  <div class="col-md-3">
                    <button
                      type="button"
                      class="btn btn-danger"
                      :disabled="auth.profileSaving"
                      @click="auth.saveProfile()"
                    >
                      <span
                        v-if="auth.profileSaving"
                        class="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Save Change
                    </button>
                  </div>
                </div>
              </div>
              <!-- /Profile Form -->
            </div>
            <!-- /Profile Tab Pane -->
          </div>
        </div>
      </div>
    </div>

    <TopBrands />
  </AppLayout>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useRouter } from "vue-router";

import AppLayout from "../layout/AppLayout.vue";
import MenuBar from "../components/frontend/MenuBar.vue";
import TopBrands from "../components/frontend/TopBrands.vue";
import Footer from "../components/frontend/Footer.vue";

import { useAuthStore } from "../stores/authStore";

const router = useRouter();
const auth = useAuthStore();

const navigateToProfile = () => router.push("/profile");
const navigateToOrders = () => router.push("/orders");

const profileReady = computed(() => !!auth.profile);

onMounted(() => {
  auth.loadProfile();
});
</script>

<style scoped>

</style>
