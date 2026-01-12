import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../Pages/HomePage.vue';
import LoginPage from '../Pages/LoginPage.vue';
import VerifyPage from '../Pages/VerifyPage.vue';
import ProductsByCategoryPage from '../Pages/ProductsByCategoryPage.vue';



const routes = [
  { path: '/',
    name: "Home",
     component: HomePage,
  },
    { path: '/login',
      name: "Login",
     component: LoginPage, 
  },
     { path: '/verify',
      name: "Verify",
     component: VerifyPage, 
  },
     { path: '/by-category',
      name: "ProductsByCategory",
     component: ProductsByCategoryPage, 
  },
   
  
 ];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;