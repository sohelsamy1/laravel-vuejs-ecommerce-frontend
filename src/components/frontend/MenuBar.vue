<script setup>
import { computed, onMounted, ref } from "vue";
import { useAuthStore } from "../../stores/authStore";
import { useProductStore } from "../../stores/productStore";

const authStore = useAuthStore();
const productStore = useProductStore();

const isLoggedIn = computed(() => authStore.isAuthenticated);
const categories = ref([]);

const handleLogout = async () => {
  await authStore.logout();
};

// Fetch Category
onMounted(async () => {
  categories.value = await productStore.fetchCategories();
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
                <li><i class="ti-email"></i><span>info@samytech.com</span></li>
              </ul>
            </div>
          </div>
          <div class="col-md-6">
            <div class="text-center text-md-end">
              <ul class="header_list">
                <li>
                  <a href="/policy?type=about">About</a>
                </li>
                <li>
                  <a href="/profile">
                    <i class="linearicons-user"></i> Account
                  </a>
                </li>
                <li v-if="isLoggedIn">
                  <button @click="handleLogout" class="btn btn-danger btn-sm">
                    Logout
                  </button>
                </li>
                <li v-else>
                  <RouterLink to="/login" class="btn btn-danger btn-sm"
                    >Login</RouterLink
                  >
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
          <a class="navbar-brand" href="/">
              <img
                class="logo"
                src="../../assets/images/SAMYLOGO.png"
                alt="SAMY Logo"/>
          </a>
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
                <a class="nav-link nav_item" href="/">Home</a>
              </li>
              <li class="dropdown">
                <a
                  class="dropdown-toggle nav-link"
                  href="#"
                  data-bs-toggle="dropdown"
                  >Products</a
                >
                <div class="dropdown-menu">
                  <ul id="CategoryItem">
                    <li v-for="category in categories" :key="category.id">
                      <a class="dropdown-item nav-link nav_item" href="#">
                        {{ category.categoryName }}
                      </a>
                    </li>
                  </ul>
                </div>
              </li>
              <li>
                <a class="nav-link nav_item" href="/wish">
                  <i class="ti-heart"></i> Wish
                </a>
              </li>
              <li>
                <a class="nav-link nav_item" href="/cart">
                  <i class="linearicons-cart"></i> Cart
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </div>
  </header>
</template>
