<script setup>
import { useRoute } from "vue-router";
import { useProductStore } from "../stores/productStore";
import { onBeforeMount, watch } from "vue";

const store = useProductStore();
const route = useRoute();

const fetchCurrentCategory = async () => {
  const categoryId = route.query.id;
  await store.fetchProductsByCategory(categoryId);
};

onBeforeMount(async () => {
  await fetchCurrentCategory();
});

watch(() => route.query.id, fetchCurrentCategory);
</script>

<template>
  <!-- Breadcrumb -->
  <div class="breadcrumb_section bg_gray page-title-mini">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-md-6">
          <div class="page-title">
            <h1>
              Category: <span>{{ store.categoryName }}</span>
            </h1>
          </div>
        </div>
        <div class="col-md-6">
          <ol class="breadcrumb justify-content-md-end">
            <li class="breadcrumb-item">
              <router-link to="/">Home</router-link>
            </li>
            <li class="breadcrumb-item active">Category Products</li>
          </ol>
        </div>
      </div>
    </div>
  </div>

  <!-- Content -->
  <div class="mt-5">
    <div class="container my-5">
      <!-- Loading -->
      <div v-if="store.categoriesLoading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-3">Loading products...</p>
      </div>

      <!-- Error -->
      <div
        v-else-if="store.categoriesError"
        class="alert alert-danger"
        role="alert"
      >
        Error message here
      </div>

      <!-- Empty -->
      <div
        v-else-if="store.categoryProducts.length === 0"
        class="text-center py-5"
      >
        <p class="text-muted mb-0">No products found for this category.</p>
      </div>

      <!-- Grid -->
      <div v-else class="row">
        <div
          v-for="item in store.categoryProducts"
          :key="item.id"
          class="col-lg-3 col-md-4 col-6"
        >
          <div class="product">
            <div class="product_img">
              <router-link :to="`/details?id=${item.id}`">
                <img :src="item.image" :alt="item.title" />
                <!-- <img src="product.jpg" alt="Product Title" /> -->
              </router-link>
              <div class="product_action_box">
                <ul class="list_none pr_action_btn">
                  <li>
                    <router-link
                      :to="`/details?id=${item.id}`"
                      class="popup-ajax"
                    >
                      <i class="icon-magnifier-add"></i>
                    </router-link>
                  </li>
                </ul>
              </div>
            </div>

            <div class="product_info">
              <h6 class="product_title">
                <router-link :to="`/details?id=${item.id}`">
                  {{ item.title }}
                </router-link>
              </h6>
              <div class="product_price">
                <span class="price">$ {{ item.price }}</span>
              </div>
              <div class="rating_wrap">
                <div class="rating">
                  <div
                    class="product_rate"
                    :style="{ width: (item.star || 0) + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- /col -->
      </div>
      <!-- /row -->
    </div>
  </div>
</template>
