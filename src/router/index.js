import { createRouter, createWebHistory } from "vue-router";

import HomePage from "../Pages/HomePage.vue";
import LoginPage from "../Pages/LoginPage.vue";
import VerifyPage from "../Pages/VerifyPage.vue";
import ProductsByCategoryPage from "../Pages/ProductsByCategoryPage.vue";
import ProductsByBrandPage from "../Pages/ProductsByBrandPage.vue";
import DetailsPage from "../Pages/DetailsPage.vue";
import ProfilePage from "../Pages/ProfilePage.vue";
import OrdersPage from "../Pages/OrdersPage.vue";
import CartPage from "../Pages/CartPage.vue";

// ✅ Temporary placeholders (later তুমি real page বানাবে)
const TempWishPage = { template: "<div class='container py-5'><h3>Wish page (Coming soon)</h3></div>" };
const TempPolicyPage = { template: "<div class='container py-5'><h3>Policy page (Coming soon)</h3></div>" };

const routes = [
  { path: "/", name: "Home", component: HomePage },

  { path: "/login", name: "Login", component: LoginPage },
  { path: "/verify", name: "Verify", component: VerifyPage },

  { path: "/by-category", name: "ProductsByCategory", component: ProductsByCategoryPage },
  { path: "/by-brand", name: "ProductByBrand", component: ProductsByBrandPage },

  // ✅ Details (query id দিয়ে /details?id=2)
  { path: "/details", name: "ProductDetails", component: DetailsPage },

  // ✅ Warnings stop + later replace with real pages
  { path: "/wish", name: "Wish", component: TempWishPage },
  { path: "/policy", name: "Policy", component: TempPolicyPage },

  // ✅ Protected routes (login required)
  { path: "/profile", name: "Profile", component: ProfilePage, meta: { requiresAuth: true } },
  { path: "/orders", name: "Orders", component: OrdersPage, meta: { requiresAuth: true } },
  { path: "/cart", name: "Cart", component: CartPage, meta: { requiresAuth: true } },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

// ✅ Route Guard (token না থাকলে protected route এ ঢুকতে দিবে না)
router.beforeEach((to) => {
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  // protected route -> login required
  if (to.meta.requiresAuth && !isLoggedIn) {
    return { name: "Login" };
  }

  // already logged in -> login/verify এ গেলে home এ পাঠাও
  if (isLoggedIn && (to.name === "Login" || to.name === "Verify")) {
    return { name: "Home" };
  }

  return true;
});

export default router;
