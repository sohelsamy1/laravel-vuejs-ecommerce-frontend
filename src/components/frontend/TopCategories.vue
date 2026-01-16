<script setup>
import { onBeforeMount } from "vue";
import { useProductStore } from "../../stores/productStore";

const store = useProductStore();

onBeforeMount(async () => {
  await store.fetchTopCategories();
});
</script>

<template>
  <div class="section">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="heading_s4 text-center">
            <h2>Top Categories</h2>
          </div>
          <p class="text-center leads">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
            blandit massa enim Nullam nunc varius.
          </p>
        </div>
      </div>
        <div v-if="store.categoriesLoading" class="text-center py-4">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div
        v-else-if="!store.categories.length"
        class="text-center text-muted py-4"
      >
        {{ store.categoriesError || "No categories available." }}
      </div>

      <div v-else class="row align-items-center">
        <div
          v-for="category in store.categories"
          :key="category.id"
          class="p-2 col-2"
        >
          <div class="item">
            <div class="categories_box">
              <RouterLink :to="`/by-category?id=${category.id}`">
                <img
                  src="https://img.freepik.com/free-psd/stunning-mountain-landscape-displayed-modern-smart-tv_191095-80909.jpg?semt=ais_hybrid&w=740&q=80"
                  alt="Category Name"
                />
                <!-- <img :src="category.categoryImg" :alt="category.categoryName" /> -->
                <span>{{ category.categoryName }}</span>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
      </div>
  </div>
</template>
