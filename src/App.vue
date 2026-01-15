<template>
  <MenuBar />

  <main class="main_content">
    <RouterView />
  </main>

  <Footer />
</template>

<script setup>
import MenuBar from "./components/frontend/MenuBar.vue";
import Footer from "./components/frontend/Footer.vue";
</script>
