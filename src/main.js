import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";

// Bootstrap (CSS first, then JS)
import "./assets/bootstrap/css/bootstrap.min.css";
import "bootstrap";

// Project CSS
import "./style.css";
import "./assets/css/animate.css";
import "./assets/css/all.min.css";
import "./assets/css/ionicons.min.css";
import "./assets/css/style.css";
import "./assets/css/responsive.css";
import "./assets/css/slick.css";
import "./assets/css/slick-theme.css";

const pinia = createPinia();

createApp(App).use(router).use(pinia).mount("#app");
