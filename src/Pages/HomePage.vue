<script setup>
import AppLayout from "../layout/AppLayout.vue";

import HeroSlider from "../components/frontend/HeroSlider.vue";
import TopCategories from "../components/frontend/TopCategories.vue";
import ExclusiveProducts from "../components/frontend/ExclusiveProducts.vue";
import TopBrands from "../components/frontend/TopBrands.vue";
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
