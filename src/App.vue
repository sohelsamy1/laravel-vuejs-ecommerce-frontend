<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import Footer from "./components/frontend/Footer.vue";
import MenuBar from "./components/frontend/MenuBar.vue";

const route = useRoute();

const hideLayout = computed(() => ["/login", "/verify"].includes(route.path));
</script>

<template>
  <MenuBar v-if="!hideLayout" />
  <RouterView />
  <Footer v-if="!hideLayout" />
</template>
