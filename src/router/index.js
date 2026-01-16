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
import WishlistPage from "../Pages/WishlistPage.vue";

const routes = [
  { path: "/", name: "Home", component: HomePage },

 
  { path: "/login", name: "Login", component: LoginPage, meta: { layout: "auth" } },
  { path: "/verify", name: "Verify", component: VerifyPage, meta: { layout: "auth" } },

  { path: "/by-category", name: "ProductsByCategory", component: ProductsByCategoryPage },
  { path: "/by-brand", name: "ProductByBrand", component: ProductsByBrandPage },
  { path: "/details", name: "ProductDetails", component: DetailsPage },

  { path: "/profile", name: "Profile", component: ProfilePage },
  { path: "/orders", name: "Orders", component: OrdersPage },

  { path: "/cart", name: "Cart", component: CartPage },
  { path: "/wish", name: "Wish", component: WishlistPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
export { router };
