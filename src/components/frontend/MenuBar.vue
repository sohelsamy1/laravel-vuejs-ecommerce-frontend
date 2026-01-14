<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/authStore";
import { useProductStore } from "../../stores/productStore";

const router = useRouter();
const authStore = useAuthStore();
const productStore = useProductStore();

const isLoggedIn = computed(() => !!authStore.isAuthenticated); // ✅ boolean
const categories = ref([]);

const handleLogout = async () => {
  await authStore.logout();
  router.push("/login"); // ✅ logout হলে login এ যাও
};

// Fetch Category
onMounted(async () => {
  try {
    const data = await productStore.fetchCategories();
    categories.value = Array.isArray(data) ? data : [];
  } catch (e) {
    console.log("Category fetch error:", e);
    categories.value = [];
  }
});
</script>

<template>
  <header class="header_wrap fixed-top header_with_topbar">
    <div class="top-header">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-md-6">
            <div
              class="d-flex align-items-center justify-content-center justify-content-md-start"
            >
              <ul class="contact_detail text-center text-lg-start">
                <li><i class="ti-mobile"></i><span>123-456-7890</span></li>
                <li><i class="ti-email"></i><span>info@apple.com</span></li>
              </ul>
            </div>
          </div>

          <div class="col-md-6">
            <div class="text-center text-md-end">
              <ul class="header_list">
                <li>
                  <RouterLink :to="{ path: '/policy', query: { type: 'about' } }">
                    About
                  </RouterLink>
                </li>

                <!-- ✅ Login থাকলে Account, না থাকলে Login -->
                <li v-if="isLoggedIn">
                  <RouterLink to="/profile">
                    <i class="linearicons-user"></i> Account
                  </RouterLink>
                </li>
                <li v-else>
                  <RouterLink to="/login">
                    <i class="linearicons-user"></i> Account
                  </RouterLink>
                </li>

                <li v-if="isLoggedIn">
                  <button @click="handleLogout" class="btn btn-danger btn-sm">
                    Logout
                  </button>
                </li>
                <li v-else>
                  <RouterLink to="/login" class="btn btn-danger btn-sm">
                    Login
                  </RouterLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bottom_header dark_skin main_menu_uppercase">
      <div class="container">
        <nav class="navbar navbar-expand-lg">
          <RouterLink class="navbar-brand" to="/">
            <img class="logo_dark" src="" alt="logo" />
          </RouterLink>

          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-expanded="false"
          >
            <span class="ion-android-menu"></span>
          </button>

          <div
            class="collapse navbar-collapse justify-content-end"
            id="navbarSupportedContent"
          >
            <ul class="navbar-nav">
              <li>
                <RouterLink class="nav-link nav_item" to="/">Home</RouterLink>
              </li>

              <li class="dropdown">
                <a class="dropdown-toggle nav-link" href="#" data-bs-toggle="dropdown">
                  Products
                </a>

                <div class="dropdown-menu">
                  <ul id="CategoryItem">
                    <li v-if="categories.length === 0" class="px-3 py-2">
                      <small>No categories</small>
                    </li>

                    <li v-for="category in categories" :key="category.id">
                      <RouterLink
                        class="dropdown-item nav-link nav_item"
                        :to="{ path: '/by-category', query: { id: category.id } }"
                      >
                        {{ category?.categoryName || "Category" }}
                      </RouterLink>
                    </li>
                  </ul>
                </div>
              </li>

              <li>
                <RouterLink class="nav-link nav_item" to="/wish">
                  <i class="ti-heart"></i> Wish
                </RouterLink>
              </li>

              <li>
                <RouterLink class="nav-link nav_item" to="/cart">
                  <i class="linearicons-cart"></i> Cart
                </RouterLink>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </div>
  </header>
</template>

<style scoped></style>
