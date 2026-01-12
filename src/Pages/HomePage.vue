<script setup>
import ExclusiveProducts from "../components/frontend/ExclusiveProducts.vue";
import HeroSlider from "../components/frontend/HeroSlider.vue";
import TopBrands from "../components/frontend/TopBrands.vue";
import TopCategories from "../components/frontend/TopCategories.vue";
import AppLayout from "../components/Layout/AppLayout.vue";

</script>

<template>
 <AppLayout> 
  <HeroSlider />
  <TopCategories />
  <ExclusiveProducts />
  <TopBrands />
 </AppLayout>
</template>

<style scoped>

</style>