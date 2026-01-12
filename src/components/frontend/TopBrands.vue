<template>
  <div class="section">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="heading_s4 text-center">
            <h2>Top Brands</h2>
          </div>
          <p class="text-center leads">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
            blandit massa enim Nullam nunc varius.
          </p>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="store.brandsLoading" class="text-center py-4">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <!-- Error / Empty -->
      <div v-else-if="!store.brands.length" class="text-center text-muted py-4">
        {{ store.brandsError || "No brands available." }}
      </div>

      <!-- List -->
      <div v-else class="row align-items-center">
        <div
          v-for="brand in store.brands"
          :key="brand.id"
          class="p-2 col-6 col-md-4 col-lg-2"
        >
          <div class="item">
            <div class="categories_box">
              <router-link :to="`/by-brand?id=${brand.id}`">
                <img
                  src="https://upload.wikimedia.org/wikipedia/en/thumb/0/04/Huawei_Standard_logo.svg/1200px-Huawei_Standard_logo.svg.png"
                  :alt="brand.brandName"
                />
                <!-- <img
                  :src="brand.brandImg || fallbackImg"
                  :alt="brand.brandName"
                /> -->
                <span>{{ brand.brandName }}</span>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { onMounted } from "vue";
import { useProductStore } from "../../stores/productStore";


const store = useProductStore();


onMounted(async () => {
  if (!store.brands.length) {
    await store.fetchTopBrands();
  }
});
</script>