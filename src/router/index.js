import { createMemoryHistory, createRouter } from 'vue-router'
import HomePage from '../Pages/HomePage.vue';
import LoginPage from '../Pages/LoginPage.vue';


const routes = [
  { path: '/',
     component: HomePage,
  },
    { path: '/login',
     component: LoginPage, 
  },
 ]

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

export default router;